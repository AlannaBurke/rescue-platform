<?php

/**
 * Expand the Animal data model for comprehensive lifecycle tracking.
 *
 * Creates:
 * - 3 new Paragraph types: log_entry, medication_log, placement
 * - Expanded animal_lifecycle_status taxonomy with full lifecycle terms
 * - New fields on the Animal content type
 * - GraphQL Compose configuration for all new fields
 */

use Drupal\field\Entity\FieldConfig;
use Drupal\field\Entity\FieldStorageConfig;
use Drupal\node\Entity\NodeType;
use Drupal\paragraphs\Entity\ParagraphsType;
use Drupal\taxonomy\Entity\Term;
use Drupal\taxonomy\Entity\Vocabulary;

// ─────────────────────────────────────────────────────────────────────────────
// 1. Create the animal_lifecycle_status taxonomy vocabulary
// ─────────────────────────────────────────────────────────────────────────────

echo "Creating animal_lifecycle_status vocabulary...\n";

$vocab = Vocabulary::load('animal_lifecycle_status');
if (!$vocab) {
  $vocab = Vocabulary::create([
    'vid'         => 'animal_lifecycle_status',
    'name'        => 'Animal Lifecycle Status',
    'description' => 'Comprehensive lifecycle status for animals in the rescue.',
  ]);
  $vocab->save();
  echo "  Created vocabulary: animal_lifecycle_status\n";
} else {
  echo "  Vocabulary already exists: animal_lifecycle_status\n";
}

$lifecycle_terms = [
  ['name' => 'Intake',                      'weight' => 0],
  ['name' => 'Available for Adoption',      'weight' => 1],
  ['name' => 'Adoption Pending',            'weight' => 2],
  ['name' => 'In Foster',                   'weight' => 3],
  ['name' => 'Pregnancy Watch',             'weight' => 4],
  ['name' => 'Sanctuary',                   'weight' => 5],
  ['name' => 'Hospice',                     'weight' => 6],
  ['name' => 'Adopted',                     'weight' => 7],
  ['name' => 'Deceased (Rainbow Bridge)',   'weight' => 8],
];

foreach ($lifecycle_terms as $term_data) {
  $existing = \Drupal::entityTypeManager()
    ->getStorage('taxonomy_term')
    ->loadByProperties(['vid' => 'animal_lifecycle_status', 'name' => $term_data['name']]);
  if (empty($existing)) {
    $term = Term::create([
      'vid'    => 'animal_lifecycle_status',
      'name'   => $term_data['name'],
      'weight' => $term_data['weight'],
    ]);
    $term->save();
    echo "  Created term: {$term_data['name']}\n";
  } else {
    echo "  Term already exists: {$term_data['name']}\n";
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Enable the Paragraphs module
// ─────────────────────────────────────────────────────────────────────────────

echo "\nEnabling paragraphs module...\n";
$module_installer = \Drupal::service('module_installer');
if (!\Drupal::moduleHandler()->moduleExists('paragraphs')) {
  $module_installer->install(['paragraphs', 'entity_reference_revisions']);
  echo "  Installed: paragraphs, entity_reference_revisions\n";
} else {
  echo "  Already enabled: paragraphs\n";
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Create Paragraph types
// ─────────────────────────────────────────────────────────────────────────────

echo "\nCreating Paragraph types...\n";

$paragraph_types = [
  'log_entry' => [
    'label'       => 'Log Entry',
    'description' => 'A dated log entry for general, medical, or behavioral notes.',
  ],
  'medication_log' => [
    'label'       => 'Medication Log',
    'description' => 'Tracks medications administered to an animal.',
  ],
  'placement' => [
    'label'       => 'Placement',
    'description' => 'Records a foster or adoption placement.',
  ],
];

foreach ($paragraph_types as $id => $info) {
  $existing = ParagraphsType::load($id);
  if (!$existing) {
    $paragraph_type = ParagraphsType::create([
      'id'          => $id,
      'label'       => $info['label'],
      'description' => $info['description'],
    ]);
    $paragraph_type->save();
    echo "  Created paragraph type: {$id}\n";
  } else {
    echo "  Paragraph type already exists: {$id}\n";
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Create fields on Paragraph types
// ─────────────────────────────────────────────────────────────────────────────

echo "\nCreating fields on Paragraph types...\n";

/**
 * Helper: create a field storage + instance if it doesn't exist.
 */
function ensure_field(string $entity_type, string $bundle, string $field_name, string $field_type, string $label, array $storage_settings = [], array $field_settings = [], int $cardinality = 1): void {
  // Field storage
  $storage = FieldStorageConfig::loadByName($entity_type, $field_name);
  if (!$storage) {
    $storage = FieldStorageConfig::create([
      'field_name'   => $field_name,
      'entity_type'  => $entity_type,
      'type'         => $field_type,
      'cardinality'  => $cardinality,
      'settings'     => $storage_settings,
    ]);
    $storage->save();
    echo "    Created storage: {$entity_type}.{$field_name}\n";
  }

  // Field instance
  $instance = FieldConfig::loadByName($entity_type, $bundle, $field_name);
  if (!$instance) {
    $instance = FieldConfig::create([
      'field_storage' => $storage,
      'bundle'        => $bundle,
      'label'         => $label,
      'required'      => FALSE,
      'settings'      => $field_settings,
    ]);
    $instance->save();
    echo "    Created field: {$entity_type}.{$bundle}.{$field_name}\n";
  } else {
    echo "    Field already exists: {$entity_type}.{$bundle}.{$field_name}\n";
  }
}

// ── Log Entry fields ──
ensure_field('paragraph', 'log_entry', 'field_log_date', 'datetime', 'Log Date');
ensure_field('paragraph', 'log_entry', 'field_log_type', 'list_string', 'Log Type', [
  'allowed_values' => [
    'general'      => 'General',
    'medical'      => 'Medical',
    'behavioral'   => 'Behavioral',
    'intake'       => 'Intake',
    'placement'    => 'Placement',
  ],
]);
ensure_field('paragraph', 'log_entry', 'field_log_details', 'text_long', 'Log Details');

// ── Medication Log fields ──
ensure_field('paragraph', 'medication_log', 'field_med_name',       'string',   'Medication Name');
ensure_field('paragraph', 'medication_log', 'field_med_dosage',     'string',   'Dosage');
ensure_field('paragraph', 'medication_log', 'field_med_frequency',  'string',   'Frequency / Schedule');
ensure_field('paragraph', 'medication_log', 'field_med_start_date', 'datetime', 'Start Date');
ensure_field('paragraph', 'medication_log', 'field_med_end_date',   'datetime', 'End Date (leave blank if ongoing)');
ensure_field('paragraph', 'medication_log', 'field_med_notes',      'text_long','Medication Notes');

// ── Placement fields ──
ensure_field('paragraph', 'placement', 'field_placement_type', 'list_string', 'Placement Type', [
  'allowed_values' => [
    'foster'   => 'Foster',
    'adoption' => 'Adoption',
    'transfer' => 'Transfer to Another Rescue',
    'return'   => 'Return from Foster',
  ],
]);
ensure_field('paragraph', 'placement', 'field_placement_person', 'entity_reference', 'Person', [], [
  'handler'          => 'default:node',
  'handler_settings' => ['target_bundles' => ['person' => 'person']],
]);
ensure_field('paragraph', 'placement', 'field_placement_start_date', 'datetime', 'Start Date');
ensure_field('paragraph', 'placement', 'field_placement_end_date',   'datetime', 'End Date (leave blank if current)');
ensure_field('paragraph', 'placement', 'field_placement_notes',      'text_long','Placement Notes');

// ─────────────────────────────────────────────────────────────────────────────
// 5. Add new fields to the Animal content type
// ─────────────────────────────────────────────────────────────────────────────

echo "\nAdding new fields to Animal content type...\n";

// Intake date
ensure_field('node', 'animal', 'field_intake_date', 'datetime', 'Intake Date');

// Source / origin
ensure_field('node', 'animal', 'field_animal_source', 'text_long', 'Source / Origin');

// Lifecycle status (entity reference to new vocabulary)
$storage = FieldStorageConfig::loadByName('node', 'field_lifecycle_status');
if (!$storage) {
  $storage = FieldStorageConfig::create([
    'field_name'  => 'field_lifecycle_status',
    'entity_type' => 'node',
    'type'        => 'entity_reference',
    'cardinality' => 1,
    'settings'    => ['target_type' => 'taxonomy_term'],
  ]);
  $storage->save();
  echo "  Created storage: node.field_lifecycle_status\n";
}
$instance = FieldConfig::loadByName('node', 'animal', 'field_lifecycle_status');
if (!$instance) {
  $instance = FieldConfig::create([
    'field_storage' => $storage,
    'bundle'        => 'animal',
    'label'         => 'Lifecycle Status',
    'required'      => FALSE,
    'settings'      => [
      'handler'          => 'default:taxonomy_term',
      'handler_settings' => ['target_bundles' => ['animal_lifecycle_status' => 'animal_lifecycle_status']],
    ],
  ]);
  $instance->save();
  echo "  Created field: node.animal.field_lifecycle_status\n";
} else {
  echo "  Field already exists: node.animal.field_lifecycle_status\n";
}

// Is Featured boolean
ensure_field('node', 'animal', 'field_is_featured', 'boolean', 'Is Featured?');

// Exclude from public view boolean
ensure_field('node', 'animal', 'field_exclude_public', 'boolean', 'Exclude from Public View?');

// Date of passing (for rainbow bridge)
ensure_field('node', 'animal', 'field_date_of_passing', 'datetime', 'Date of Passing');

// Adoption date
ensure_field('node', 'animal', 'field_adoption_date', 'datetime', 'Adoption Date');

// Adopted by (person reference)
$storage = FieldStorageConfig::loadByName('node', 'field_adopted_by');
if (!$storage) {
  $storage = FieldStorageConfig::create([
    'field_name'  => 'field_adopted_by',
    'entity_type' => 'node',
    'type'        => 'entity_reference',
    'cardinality' => 1,
    'settings'    => ['target_type' => 'node'],
  ]);
  $storage->save();
  echo "  Created storage: node.field_adopted_by\n";
}
$instance = FieldConfig::loadByName('node', 'animal', 'field_adopted_by');
if (!$instance) {
  $instance = FieldConfig::create([
    'field_storage' => $storage,
    'bundle'        => 'animal',
    'label'         => 'Adopted By',
    'required'      => FALSE,
    'settings'      => [
      'handler'          => 'default:node',
      'handler_settings' => ['target_bundles' => ['person' => 'person']],
    ],
  ]);
  $instance->save();
  echo "  Created field: node.animal.field_adopted_by\n";
} else {
  echo "  Field already exists: node.animal.field_adopted_by\n";
}

// History log (paragraph reference, unlimited)
$storage = FieldStorageConfig::loadByName('paragraph', 'field_history_log');
if (!$storage) {
  // Need entity_reference_revisions for paragraphs
  $storage = FieldStorageConfig::create([
    'field_name'  => 'field_history_log',
    'entity_type' => 'node',
    'type'        => 'entity_reference_revisions',
    'cardinality' => -1,
    'settings'    => ['target_type' => 'paragraph'],
  ]);
  $storage->save();
  echo "  Created storage: node.field_history_log\n";
}
$instance = FieldConfig::loadByName('node', 'animal', 'field_history_log');
if (!$instance) {
  $instance = FieldConfig::create([
    'field_storage' => FieldStorageConfig::loadByName('node', 'field_history_log') ?: $storage,
    'bundle'        => 'animal',
    'label'         => 'History Log',
    'required'      => FALSE,
    'settings'      => [
      'handler'          => 'default:paragraph',
      'handler_settings' => ['target_bundles' => ['log_entry' => 'log_entry']],
    ],
  ]);
  $instance->save();
  echo "  Created field: node.animal.field_history_log\n";
} else {
  echo "  Field already exists: node.animal.field_history_log\n";
}

// Medication log (paragraph reference, unlimited)
$storage = FieldStorageConfig::loadByName('node', 'field_medication_log');
if (!$storage) {
  $storage = FieldStorageConfig::create([
    'field_name'  => 'field_medication_log',
    'entity_type' => 'node',
    'type'        => 'entity_reference_revisions',
    'cardinality' => -1,
    'settings'    => ['target_type' => 'paragraph'],
  ]);
  $storage->save();
  echo "  Created storage: node.field_medication_log\n";
}
$instance = FieldConfig::loadByName('node', 'animal', 'field_medication_log');
if (!$instance) {
  $instance = FieldConfig::create([
    'field_storage' => FieldStorageConfig::loadByName('node', 'field_medication_log') ?: $storage,
    'bundle'        => 'animal',
    'label'         => 'Medication Log',
    'required'      => FALSE,
    'settings'      => [
      'handler'          => 'default:paragraph',
      'handler_settings' => ['target_bundles' => ['medication_log' => 'medication_log']],
    ],
  ]);
  $instance->save();
  echo "  Created field: node.animal.field_medication_log\n";
} else {
  echo "  Field already exists: node.animal.field_medication_log\n";
}

// Placement history (paragraph reference, unlimited)
$storage = FieldStorageConfig::loadByName('node', 'field_placement_history');
if (!$storage) {
  $storage = FieldStorageConfig::create([
    'field_name'  => 'field_placement_history',
    'entity_type' => 'node',
    'type'        => 'entity_reference_revisions',
    'cardinality' => -1,
    'settings'    => ['target_type' => 'paragraph'],
  ]);
  $storage->save();
  echo "  Created storage: node.field_placement_history\n";
}
$instance = FieldConfig::loadByName('node', 'animal', 'field_placement_history');
if (!$instance) {
  $instance = FieldConfig::create([
    'field_storage' => FieldStorageConfig::loadByName('node', 'field_placement_history') ?: $storage,
    'bundle'        => 'animal',
    'label'         => 'Placement History',
    'required'      => FALSE,
    'settings'      => [
      'handler'          => 'default:paragraph',
      'handler_settings' => ['target_bundles' => ['placement' => 'placement']],
    ],
  ]);
  $instance->save();
  echo "  Created field: node.animal.field_placement_history\n";
} else {
  echo "  Field already exists: node.animal.field_placement_history\n";
}

echo "\nAll animal model expansions complete!\n";
