<?php

/**
 * Drush script to create all content types and fields
 * for the Rescue Platform data model.
 *
 * Run with: drush php:script create_content_types.php
 */

use Drupal\node\Entity\NodeType;
use Drupal\field\Entity\FieldStorageConfig;
use Drupal\field\Entity\FieldConfig;

/**
 * Helper: Create a field storage if it doesn't exist.
 */
function ensure_field_storage($field_name, $entity_type, $field_type, $settings = [], $cardinality = 1) {
  $storage = FieldStorageConfig::loadByName($entity_type, $field_name);
  if (!$storage) {
    $storage = FieldStorageConfig::create([
      'field_name' => $field_name,
      'entity_type' => $entity_type,
      'type' => $field_type,
      'cardinality' => $cardinality,
      'settings' => $settings,
    ]);
    $storage->save();
  }
  return $storage;
}

/**
 * Helper: Attach a field to a bundle if it doesn't exist.
 */
function ensure_field($field_name, $entity_type, $bundle, $label, $required = FALSE, $settings = []) {
  $field = FieldConfig::loadByName($entity_type, $bundle, $field_name);
  if (!$field) {
    $field = FieldConfig::create([
      'field_name' => $field_name,
      'entity_type' => $entity_type,
      'bundle' => $bundle,
      'label' => $label,
      'required' => $required,
      'settings' => $settings,
    ]);
    $field->save();
    echo "  Created field: {$label} ({$field_name})\n";
  }
  else {
    echo "  Field already exists: {$label} ({$field_name})\n";
  }
  return $field;
}

// ============================================================
// 1. ANIMAL CONTENT TYPE
// ============================================================
echo "\n=== Creating Animal content type ===\n";

$animal_type = NodeType::load('animal');
if (!$animal_type) {
  $animal_type = NodeType::create([
    'type' => 'animal',
    'name' => 'Animal',
    'description' => 'An animal in the rescue\'s care.',
  ]);
  $animal_type->save();
  node_add_body_field($animal_type);
  echo "Created content type: Animal\n";
}
else {
  echo "Content type already exists: Animal\n";
}

// Animal ID
ensure_field_storage('field_animal_id', 'node', 'string');
ensure_field('field_animal_id', 'node', 'animal', 'Animal ID', TRUE);

// Status (taxonomy reference)
ensure_field_storage('field_animal_status', 'node', 'entity_reference', ['target_type' => 'taxonomy_term']);
ensure_field('field_animal_status', 'node', 'animal', 'Status', TRUE, [
  'handler' => 'default:taxonomy_term',
  'handler_settings' => ['target_bundles' => ['animal_status' => 'animal_status']],
]);

// Species (taxonomy reference)
ensure_field_storage('field_animal_species', 'node', 'entity_reference', ['target_type' => 'taxonomy_term']);
ensure_field('field_animal_species', 'node', 'animal', 'Species', TRUE, [
  'handler' => 'default:taxonomy_term',
  'handler_settings' => ['target_bundles' => ['animal_species' => 'animal_species']],
]);

// Breed
ensure_field_storage('field_animal_breed', 'node', 'string');
ensure_field('field_animal_breed', 'node', 'animal', 'Breed');

// Age (years)
ensure_field_storage('field_animal_age_years', 'node', 'integer');
ensure_field('field_animal_age_years', 'node', 'animal', 'Age (Years)');

// Age (months) - for young animals
ensure_field_storage('field_animal_age_months', 'node', 'integer');
ensure_field('field_animal_age_months', 'node', 'animal', 'Age (Months)');

// Sex
ensure_field_storage('field_animal_sex', 'node', 'list_string', [
  'allowed_values' => [
    'male' => 'Male',
    'female' => 'Female',
    'unknown' => 'Unknown',
  ],
]);
ensure_field('field_animal_sex', 'node', 'animal', 'Sex', TRUE);

// Size
ensure_field_storage('field_animal_size', 'node', 'list_string', [
  'allowed_values' => [
    'small' => 'Small',
    'medium' => 'Medium',
    'large' => 'Large',
    'xlarge' => 'X-Large',
  ],
]);
ensure_field('field_animal_size', 'node', 'animal', 'Size');

// Color
ensure_field_storage('field_animal_color', 'node', 'string');
ensure_field('field_animal_color', 'node', 'animal', 'Color');

// Internal Notes (private)
ensure_field_storage('field_animal_notes', 'node', 'text_long');
ensure_field('field_animal_notes', 'node', 'animal', 'Internal Notes');

// Good with dogs
ensure_field_storage('field_good_with_dogs', 'node', 'boolean');
ensure_field('field_good_with_dogs', 'node', 'animal', 'Good With Dogs');

// Good with cats
ensure_field_storage('field_good_with_cats', 'node', 'boolean');
ensure_field('field_good_with_cats', 'node', 'animal', 'Good With Cats');

// Good with kids
ensure_field_storage('field_good_with_kids', 'node', 'boolean');
ensure_field('field_good_with_kids', 'node', 'animal', 'Good With Kids');

// Microchip number
ensure_field_storage('field_microchip', 'node', 'string');
ensure_field('field_microchip', 'node', 'animal', 'Microchip Number');

// Intake date
ensure_field_storage('field_intake_date', 'node', 'datetime', ['datetime_type' => 'date']);
ensure_field('field_intake_date', 'node', 'animal', 'Intake Date');

// Adoption date
ensure_field_storage('field_adoption_date', 'node', 'datetime', ['datetime_type' => 'date']);
ensure_field('field_adoption_date', 'node', 'animal', 'Adoption Date');

// Current foster (entity reference to person node)
ensure_field_storage('field_current_foster', 'node', 'entity_reference', ['target_type' => 'node']);
ensure_field('field_current_foster', 'node', 'animal', 'Current Foster', FALSE, [
  'handler' => 'default:node',
  'handler_settings' => ['target_bundles' => ['person' => 'person']],
]);

echo "Animal content type complete.\n";

// ============================================================
// 2. PERSON CONTENT TYPE
// ============================================================
echo "\n=== Creating Person content type ===\n";

$person_type = NodeType::load('person');
if (!$person_type) {
  $person_type = NodeType::create([
    'type' => 'person',
    'name' => 'Person',
    'description' => 'A person associated with the rescue (foster, volunteer, adopter, donor).',
  ]);
  $person_type->save();
  node_add_body_field($person_type);
  echo "Created content type: Person\n";
}
else {
  echo "Content type already exists: Person\n";
}

// Role(s) - taxonomy reference, unlimited
ensure_field_storage('field_person_roles', 'node', 'entity_reference', ['target_type' => 'taxonomy_term'], -1);
ensure_field('field_person_roles', 'node', 'person', 'Role(s)', TRUE, [
  'handler' => 'default:taxonomy_term',
  'handler_settings' => ['target_bundles' => ['person_role' => 'person_role']],
]);

// Email
ensure_field_storage('field_person_email', 'node', 'email');
ensure_field('field_person_email', 'node', 'person', 'Email', TRUE);

// Phone
ensure_field_storage('field_person_phone', 'node', 'telephone');
ensure_field('field_person_phone', 'node', 'person', 'Phone');

// Availability
ensure_field_storage('field_person_availability', 'node', 'string_long');
ensure_field('field_person_availability', 'node', 'person', 'Availability');

// Skills
ensure_field_storage('field_person_skills', 'node', 'string_long');
ensure_field('field_person_skills', 'node', 'person', 'Skills');

// Active since
ensure_field_storage('field_person_active_since', 'node', 'datetime', ['datetime_type' => 'date']);
ensure_field('field_person_active_since', 'node', 'person', 'Active Since');

echo "Person content type complete.\n";

// ============================================================
// 3. MEDICAL RECORD CONTENT TYPE
// ============================================================
echo "\n=== Creating Medical Record content type ===\n";

$medical_type = NodeType::load('medical_record');
if (!$medical_type) {
  $medical_type = NodeType::create([
    'type' => 'medical_record',
    'name' => 'Medical Record',
    'description' => 'A medical event log entry for an animal.',
  ]);
  $medical_type->save();
  node_add_body_field($medical_type);
  echo "Created content type: Medical Record\n";
}
else {
  echo "Content type already exists: Medical Record\n";
}

// Animal reference
ensure_field_storage('field_medical_animal', 'node', 'entity_reference', ['target_type' => 'node']);
ensure_field('field_medical_animal', 'node', 'medical_record', 'Animal', TRUE, [
  'handler' => 'default:node',
  'handler_settings' => ['target_bundles' => ['animal' => 'animal']],
]);

// Date
ensure_field_storage('field_medical_date', 'node', 'datetime', ['datetime_type' => 'date']);
ensure_field('field_medical_date', 'node', 'medical_record', 'Date', TRUE);

// Type (taxonomy reference)
ensure_field_storage('field_medical_type', 'node', 'entity_reference', ['target_type' => 'taxonomy_term']);
ensure_field('field_medical_type', 'node', 'medical_record', 'Type', TRUE, [
  'handler' => 'default:taxonomy_term',
  'handler_settings' => ['target_bundles' => ['medical_type' => 'medical_type']],
]);

// Vet / Provider
ensure_field_storage('field_medical_provider', 'node', 'string');
ensure_field('field_medical_provider', 'node', 'medical_record', 'Vet / Provider');

// Cost
ensure_field_storage('field_medical_cost', 'node', 'decimal', ['precision' => 10, 'scale' => 2]);
ensure_field('field_medical_cost', 'node', 'medical_record', 'Cost');

// Next due date
ensure_field_storage('field_medical_next_due', 'node', 'datetime', ['datetime_type' => 'date']);
ensure_field('field_medical_next_due', 'node', 'medical_record', 'Next Due Date');

echo "Medical Record content type complete.\n";

// ============================================================
// 4. EXPENSE CONTENT TYPE
// ============================================================
echo "\n=== Creating Expense content type ===\n";

$expense_type = NodeType::load('expense');
if (!$expense_type) {
  $expense_type = NodeType::create([
    'type' => 'expense',
    'name' => 'Expense',
    'description' => 'A financial expense incurred by the rescue.',
  ]);
  $expense_type->save();
  node_add_body_field($expense_type);
  echo "Created content type: Expense\n";
}
else {
  echo "Content type already exists: Expense\n";
}

// Date
ensure_field_storage('field_expense_date', 'node', 'datetime', ['datetime_type' => 'date']);
ensure_field('field_expense_date', 'node', 'expense', 'Date', TRUE);

// Amount
ensure_field_storage('field_expense_amount', 'node', 'decimal', ['precision' => 10, 'scale' => 2]);
ensure_field('field_expense_amount', 'node', 'expense', 'Amount', TRUE);

// Category (taxonomy reference)
ensure_field_storage('field_expense_category', 'node', 'entity_reference', ['target_type' => 'taxonomy_term']);
ensure_field('field_expense_category', 'node', 'expense', 'Category', TRUE, [
  'handler' => 'default:taxonomy_term',
  'handler_settings' => ['target_bundles' => ['expense_category' => 'expense_category']],
]);

// Associated animal (optional)
ensure_field_storage('field_expense_animal', 'node', 'entity_reference', ['target_type' => 'node']);
ensure_field('field_expense_animal', 'node', 'expense', 'Associated Animal', FALSE, [
  'handler' => 'default:node',
  'handler_settings' => ['target_bundles' => ['animal' => 'animal']],
]);

echo "Expense content type complete.\n";

// ============================================================
// 5. WEBSITE CONTENT TYPES (Blog Post, Event)
// ============================================================
echo "\n=== Creating website content types ===\n";

// Blog Post
$blog_type = NodeType::load('blog_post');
if (!$blog_type) {
  $blog_type = NodeType::create([
    'type' => 'blog_post',
    'name' => 'Blog Post',
    'description' => 'A news or blog post for the rescue website.',
  ]);
  $blog_type->save();
  node_add_body_field($blog_type);
  echo "Created content type: Blog Post\n";
}
else {
  echo "Content type already exists: Blog Post\n";
}

// Event
$event_type = NodeType::load('event');
if (!$event_type) {
  $event_type = NodeType::create([
    'type' => 'event',
    'name' => 'Event',
    'description' => 'A fundraiser, adoption event, or other rescue event.',
  ]);
  $event_type->save();
  node_add_body_field($event_type);
  echo "Created content type: Event\n";
}
else {
  echo "Content type already exists: Event\n";
}

// Event date
ensure_field_storage('field_event_date', 'node', 'datetime', ['datetime_type' => 'datetime']);
ensure_field('field_event_date', 'node', 'event', 'Event Date', TRUE);

// Event end date
ensure_field_storage('field_event_end_date', 'node', 'datetime', ['datetime_type' => 'datetime']);
ensure_field('field_event_end_date', 'node', 'event', 'Event End Date');

// Event location
ensure_field_storage('field_event_location', 'node', 'string');
ensure_field('field_event_location', 'node', 'event', 'Location');

echo "Website content types complete.\n";

echo "\n=== All content types and fields created successfully! ===\n";
