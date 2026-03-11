<?php

namespace Drupal\rescue_admin_api\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * Handles CSV import of vet nodes.
 *
 * POST /api/rescue/vet-import
 * Accepts multipart/form-data with a 'csv' file field.
 * Returns JSON with { imported, skipped, errors[] }.
 */
class VetCsvImportController extends ControllerBase {

  /**
   * Parse and import a CSV file of vet data.
   */
  public function import(Request $request): JsonResponse {
    $file = $request->files->get('csv');

    if (!$file) {
      return new JsonResponse(['error' => 'No CSV file uploaded.'], 400);
    }

    $path = $file->getPathname();
    $handle = fopen($path, 'r');
    if (!$handle) {
      return new JsonResponse(['error' => 'Could not read uploaded file.'], 400);
    }

    // Read header row.
    $headers = fgetcsv($handle);
    if (!$headers) {
      fclose($handle);
      return new JsonResponse(['error' => 'CSV file is empty or has no header row.'], 400);
    }

    // Normalise header names: trim whitespace, lowercase.
    $headers = array_map(fn($h) => strtolower(trim($h)), $headers);

    $imported = 0;
    $skipped = 0;
    $errors = [];
    $row_number = 1; // 1 = header row.

    $entity_manager = \Drupal::entityTypeManager();
    $node_storage = $entity_manager->getStorage('node');
    $paragraph_storage = $entity_manager->getStorage('paragraph');

    while (($row = fgetcsv($handle)) !== FALSE) {
      $row_number++;

      // Skip completely empty rows.
      if (empty(array_filter($row))) {
        continue;
      }

      // Map row values to column names.
      $data = [];
      foreach ($headers as $i => $header) {
        $data[$header] = isset($row[$i]) ? trim($row[$i]) : '';
      }

      // Require practice_name.
      if (empty($data['practice_name'])) {
        $errors[] = "Row $row_number: Missing required field 'practice_name'. Row skipped.";
        $skipped++;
        continue;
      }

      try {
        // Build the node values.
        $node_values = [
          'type' => 'vet',
          'title' => $data['practice_name'],
          'status' => 1,
          'field_vet_practice_name' => $data['practice_name'],
          'field_vet_street' => $data['street'] ?? '',
          'field_vet_city' => $data['city'] ?? '',
          'field_vet_state' => $data['state'] ?? '',
          'field_vet_zip' => $data['zip'] ?? '',
          'field_vet_phone' => $data['phone'] ?? '',
          'field_vet_emergency_phone' => $data['emergency_phone'] ?? '',
          'field_vet_email' => $data['email'] ?? '',
          'field_vet_website' => !empty($data['website']) ? ['uri' => $data['website'], 'title' => ''] : NULL,
          'field_vet_hours' => $data['hours'] ?? '',
          'field_vet_specialties' => $data['specialties'] ?? '',
          'field_vet_sees_exotics' => $this->parseBool($data['sees_exotics'] ?? ''),
          'field_vet_rescue_discount' => $this->parseBool($data['rescue_discount'] ?? ''),
          'field_vet_discount_details' => $data['discount_details'] ?? '',
          'field_vet_is_emergency' => $this->parseBool($data['is_emergency'] ?? ''),
          'field_vet_is_preferred' => $this->parseBool($data['is_preferred'] ?? ''),
          'field_vet_cost_rating' => $this->parseCostRating($data['cost_rating'] ?? ''),
          'field_vet_endorsement' => $this->parseEndorsement($data['endorsement'] ?? ''),
          'field_vet_public_notes' => ['value' => $data['public_notes'] ?? '', 'format' => 'basic_html'],
          'field_vet_notes' => ['value' => $data['internal_notes'] ?? '', 'format' => 'basic_html'],
        ];

        // Parse species (comma-separated machine names).
        if (!empty($data['species'])) {
          $valid_species = ['rabbit', 'guinea_pig', 'rat', 'chinchilla', 'hamster', 'ferret', 'bird', 'reptile', 'hedgehog', 'sugar_glider', 'other'];
          $species_values = [];
          foreach (explode(',', $data['species']) as $s) {
            $s = strtolower(trim($s));
            if (in_array($s, $valid_species)) {
              $species_values[] = $s;
            }
            else {
              $errors[] = "Row $row_number: Unknown species value '$s' — skipped.";
            }
          }
          $node_values['field_vet_species'] = $species_values;
        }

        // Parse staff members (staff_1_*, staff_2_*, staff_3_*, ...).
        $staff_paragraphs = [];
        $staff_index = 1;
        while (isset($data["staff_{$staff_index}_name"]) && !empty($data["staff_{$staff_index}_name"])) {
          $para = $paragraph_storage->create([
            'type' => 'vet_staff',
            'field_staff_name' => $data["staff_{$staff_index}_name"],
            'field_staff_role' => $data["staff_{$staff_index}_role"] ?? '',
            'field_staff_phone' => $data["staff_{$staff_index}_phone"] ?? '',
            'field_staff_email' => $data["staff_{$staff_index}_email"] ?? '',
            'field_staff_notes' => $data["staff_{$staff_index}_notes"] ?? '',
          ]);
          $para->save();
          $staff_paragraphs[] = ['target_id' => $para->id(), 'target_revision_id' => $para->getRevisionId()];
          $staff_index++;
        }
        if (!empty($staff_paragraphs)) {
          $node_values['field_vet_staff'] = $staff_paragraphs;
        }

        // Create and save the node.
        $node = $node_storage->create($node_values);
        $node->save();
        $imported++;

      }
      catch (\Exception $e) {
        $errors[] = "Row $row_number: Failed to import '{$data['practice_name']}' — " . $e->getMessage();
        $skipped++;
      }
    }

    fclose($handle);

    $response = new JsonResponse([
      'imported' => $imported,
      'skipped' => $skipped,
      'errors' => $errors,
    ]);
    $response->headers->set('Access-Control-Allow-Origin', '*');
    return $response;
  }

  /**
   * Preview a CSV file without importing — returns parsed rows as JSON.
   */
  public function preview(Request $request): JsonResponse {
    $file = $request->files->get('csv');

    if (!$file) {
      return new JsonResponse(['error' => 'No CSV file uploaded.'], 400);
    }

    $path = $file->getPathname();
    $handle = fopen($path, 'r');
    if (!$handle) {
      return new JsonResponse(['error' => 'Could not read uploaded file.'], 400);
    }

    $headers = fgetcsv($handle);
    if (!$headers) {
      fclose($handle);
      return new JsonResponse(['error' => 'CSV file is empty or has no header row.'], 400);
    }

    $headers = array_map(fn($h) => strtolower(trim($h)), $headers);

    $rows = [];
    $errors = [];
    $row_number = 1;

    while (($row = fgetcsv($handle)) !== FALSE) {
      $row_number++;
      if (empty(array_filter($row))) {
        continue;
      }

      $data = [];
      foreach ($headers as $i => $header) {
        $data[$header] = isset($row[$i]) ? trim($row[$i]) : '';
      }

      if (empty($data['practice_name'])) {
        $errors[] = "Row $row_number: Missing required field 'practice_name'.";
        continue;
      }

      // Count staff members.
      $staff_count = 0;
      $staff_index = 1;
      while (isset($data["staff_{$staff_index}_name"]) && !empty($data["staff_{$staff_index}_name"])) {
        $staff_count++;
        $staff_index++;
      }

      $rows[] = [
        'row' => $row_number,
        'practice_name' => $data['practice_name'],
        'city' => $data['city'] ?? '',
        'state' => $data['state'] ?? '',
        'phone' => $data['phone'] ?? '',
        'sees_exotics' => $this->parseBool($data['sees_exotics'] ?? ''),
        'species' => $data['species'] ?? '',
        'rescue_discount' => $this->parseBool($data['rescue_discount'] ?? ''),
        'endorsement' => $data['endorsement'] ?? 'none',
        'cost_rating' => $this->parseCostRating($data['cost_rating'] ?? ''),
        'is_emergency' => $this->parseBool($data['is_emergency'] ?? ''),
        'is_preferred' => $this->parseBool($data['is_preferred'] ?? ''),
        'staff_count' => $staff_count,
      ];
    }

    fclose($handle);

    return new JsonResponse([
      'rows' => $rows,
      'errors' => $errors,
      'total' => count($rows),
    ]);
  }

  /**
   * Parse a boolean value from a CSV cell.
   */
  private function parseBool(string $value): bool {
    return in_array(strtolower(trim($value)), ['true', '1', 'yes', 'y']);
  }

  /**
   * Parse a cost rating integer (1-5) from a CSV cell.
   */
  private function parseCostRating(string $value): ?int {
    $int = (int) $value;
    if ($int >= 1 && $int <= 5) {
      return $int;
    }
    return NULL;
  }

  /**
   * Parse and validate an endorsement value.
   */
  private function parseEndorsement(string $value): string {
    $valid = ['none', 'recommended', 'endorsed'];
    $v = strtolower(trim($value));
    return in_array($v, $valid) ? $v : 'none';
  }

}
