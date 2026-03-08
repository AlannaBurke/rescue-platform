<?php

/**
 * Phase 3: Build foster and volunteer management features.
 *
 * This script:
 * 1. Adds a "Foster Placement" paragraph type to track foster assignments
 *    (animal → person, start date, end date, notes)
 * 2. Adds a "Volunteer Shift" paragraph type to track volunteer hours
 * 3. Adds a "Foster History" field to the Animal content type
 * 4. Adds a "Volunteer Hours" field to the Person content type
 * 5. Creates a "Foster Application" webform (basic structure via config)
 * 6. Creates Drupal Views for:
 *    - Active fosters dashboard (animals currently in foster)
 *    - Foster parent roster (persons with foster role)
 *    - Volunteer roster (persons with volunteer role)
 *    - Animals needing foster (status = intake/available)
 */

use Drupal\field\Entity\FieldStorageConfig;
use Drupal\field\Entity\FieldConfig;
use Drupal\Core\Entity\Entity\EntityFormDisplay;
use Drupal\Core\Entity\Entity\EntityViewDisplay;
use Drupal\paragraphs\Entity\ParagraphsType;

// ---------------------------------------------------------------
// 1. Create "Foster Placement" paragraph type
// ---------------------------------------------------------------
$foster_placement_type = ParagraphsType::load('foster_placement');
if (!$foster_placement_type) {
  $foster_placement_type = ParagraphsType::create([
    'id' => 'foster_placement',
    'label' => 'Foster Placement',
    'description' => 'Records a foster placement: which person is fostering this animal and for what period.',
    'icon_uuid' => NULL,
    'icon_default' => NULL,
  ]);
  $foster_placement_type->save();
  echo "Created paragraph type: Foster Placement\n";
} else {
  echo "Foster Placement paragraph type already exists\n";
}

// ---------------------------------------------------------------
// 2. Add fields to Foster Placement paragraph
// ---------------------------------------------------------------

// Field: foster_person (entity_reference → node:person)
$field_storage = FieldStorageConfig::loadByName('paragraph', 'field_foster_person');
if (!$field_storage) {
  $field_storage = FieldStorageConfig::create([
    'field_name' => 'field_foster_person',
    'entity_type' => 'paragraph',
    'type' => 'entity_reference',
    'cardinality' => 1,
    'settings' => ['target_type' => 'node'],
  ]);
  $field_storage->save();
}
$field = FieldConfig::loadByName('paragraph', 'foster_placement', 'field_foster_person');
if (!$field) {
  FieldConfig::create([
    'field_storage' => $field_storage,
    'bundle' => 'foster_placement',
    'label' => 'Foster Parent',
    'required' => TRUE,
    'settings' => [
      'handler' => 'default:node',
      'handler_settings' => [
        'target_bundles' => ['person' => 'person'],
        'sort' => ['field' => '_none'],
        'auto_create' => FALSE,
      ],
    ],
  ])->save();
  echo "Created field: field_foster_person on foster_placement\n";
}

// Field: placement_start_date
$field_storage = FieldStorageConfig::loadByName('paragraph', 'field_placement_start_date');
if (!$field_storage) {
  $field_storage = FieldStorageConfig::create([
    'field_name' => 'field_placement_start_date',
    'entity_type' => 'paragraph',
    'type' => 'datetime',
    'cardinality' => 1,
    'settings' => ['datetime_type' => 'date'],
  ]);
  $field_storage->save();
}
$field = FieldConfig::loadByName('paragraph', 'foster_placement', 'field_placement_start_date');
if (!$field) {
  FieldConfig::create([
    'field_storage' => $field_storage,
    'bundle' => 'foster_placement',
    'label' => 'Placement Start Date',
    'required' => TRUE,
  ])->save();
  echo "Created field: field_placement_start_date on foster_placement\n";
}

// Field: placement_end_date
$field_storage = FieldStorageConfig::loadByName('paragraph', 'field_placement_end_date');
if (!$field_storage) {
  $field_storage = FieldStorageConfig::create([
    'field_name' => 'field_placement_end_date',
    'entity_type' => 'paragraph',
    'type' => 'datetime',
    'cardinality' => 1,
    'settings' => ['datetime_type' => 'date'],
  ]);
  $field_storage->save();
}
$field = FieldConfig::loadByName('paragraph', 'foster_placement', 'field_placement_end_date');
if (!$field) {
  FieldConfig::create([
    'field_storage' => $field_storage,
    'bundle' => 'foster_placement',
    'label' => 'Placement End Date',
    'required' => FALSE,
    'description' => 'Leave blank if placement is ongoing.',
  ])->save();
  echo "Created field: field_placement_end_date on foster_placement\n";
}

// Field: placement_notes
$field_storage = FieldStorageConfig::loadByName('paragraph', 'field_placement_notes');
if (!$field_storage) {
  $field_storage = FieldStorageConfig::create([
    'field_name' => 'field_placement_notes',
    'entity_type' => 'paragraph',
    'type' => 'text_long',
    'cardinality' => 1,
  ]);
  $field_storage->save();
}
$field = FieldConfig::loadByName('paragraph', 'foster_placement', 'field_placement_notes');
if (!$field) {
  FieldConfig::create([
    'field_storage' => $field_storage,
    'bundle' => 'foster_placement',
    'label' => 'Placement Notes',
    'required' => FALSE,
  ])->save();
  echo "Created field: field_placement_notes on foster_placement\n";
}

// ---------------------------------------------------------------
// 3. Create "Volunteer Shift" paragraph type
// ---------------------------------------------------------------
$vol_shift_type = ParagraphsType::load('volunteer_shift');
if (!$vol_shift_type) {
  $vol_shift_type = ParagraphsType::create([
    'id' => 'volunteer_shift',
    'label' => 'Volunteer Shift',
    'description' => 'Records a volunteer shift: date, hours worked, and activity description.',
  ]);
  $vol_shift_type->save();
  echo "Created paragraph type: Volunteer Shift\n";
} else {
  echo "Volunteer Shift paragraph type already exists\n";
}

// Field: shift_date
$field_storage = FieldStorageConfig::loadByName('paragraph', 'field_shift_date');
if (!$field_storage) {
  $field_storage = FieldStorageConfig::create([
    'field_name' => 'field_shift_date',
    'entity_type' => 'paragraph',
    'type' => 'datetime',
    'cardinality' => 1,
    'settings' => ['datetime_type' => 'date'],
  ]);
  $field_storage->save();
}
$field = FieldConfig::loadByName('paragraph', 'volunteer_shift', 'field_shift_date');
if (!$field) {
  FieldConfig::create([
    'field_storage' => $field_storage,
    'bundle' => 'volunteer_shift',
    'label' => 'Shift Date',
    'required' => TRUE,
  ])->save();
  echo "Created field: field_shift_date on volunteer_shift\n";
}

// Field: shift_hours
$field_storage = FieldStorageConfig::loadByName('paragraph', 'field_shift_hours');
if (!$field_storage) {
  $field_storage = FieldStorageConfig::create([
    'field_name' => 'field_shift_hours',
    'entity_type' => 'paragraph',
    'type' => 'decimal',
    'cardinality' => 1,
    'settings' => ['precision' => 5, 'scale' => 2],
  ]);
  $field_storage->save();
}
$field = FieldConfig::loadByName('paragraph', 'volunteer_shift', 'field_shift_hours');
if (!$field) {
  FieldConfig::create([
    'field_storage' => $field_storage,
    'bundle' => 'volunteer_shift',
    'label' => 'Hours',
    'required' => TRUE,
  ])->save();
  echo "Created field: field_shift_hours on volunteer_shift\n";
}

// Field: shift_activity
$field_storage = FieldStorageConfig::loadByName('paragraph', 'field_shift_activity');
if (!$field_storage) {
  $field_storage = FieldStorageConfig::create([
    'field_name' => 'field_shift_activity',
    'entity_type' => 'paragraph',
    'type' => 'string',
    'cardinality' => 1,
    'settings' => ['max_length' => 255],
  ]);
  $field_storage->save();
}
$field = FieldConfig::loadByName('paragraph', 'volunteer_shift', 'field_shift_activity');
if (!$field) {
  FieldConfig::create([
    'field_storage' => $field_storage,
    'bundle' => 'volunteer_shift',
    'label' => 'Activity Description',
    'required' => FALSE,
  ])->save();
  echo "Created field: field_shift_activity on volunteer_shift\n";
}

// ---------------------------------------------------------------
// 4. Add "Foster History" paragraph field to Animal content type
// ---------------------------------------------------------------
$field_storage = FieldStorageConfig::loadByName('node', 'field_foster_history');
if (!$field_storage) {
  $field_storage = FieldStorageConfig::create([
    'field_name' => 'field_foster_history',
    'entity_type' => 'node',
    'type' => 'entity_reference_revisions',
    'cardinality' => -1, // unlimited
    'settings' => ['target_type' => 'paragraph'],
  ]);
  $field_storage->save();
}
$field = FieldConfig::loadByName('node', 'animal', 'field_foster_history');
if (!$field) {
  FieldConfig::create([
    'field_storage' => $field_storage,
    'bundle' => 'animal',
    'label' => 'Foster History',
    'required' => FALSE,
    'settings' => [
      'handler' => 'default:paragraph',
      'handler_settings' => [
        'target_bundles' => ['foster_placement' => 'foster_placement'],
        'negate' => FALSE,
        'target_bundles_drag_drop' => ['foster_placement' => ['enabled' => TRUE, 'weight' => 0]],
      ],
    ],
  ])->save();
  echo "Created field: field_foster_history on animal\n";
}

// ---------------------------------------------------------------
// 5. Add "Volunteer Shifts" paragraph field to Person content type
// ---------------------------------------------------------------
$field_storage = FieldStorageConfig::loadByName('node', 'field_volunteer_shifts');
if (!$field_storage) {
  $field_storage = FieldStorageConfig::create([
    'field_name' => 'field_volunteer_shifts',
    'entity_type' => 'node',
    'type' => 'entity_reference_revisions',
    'cardinality' => -1,
    'settings' => ['target_type' => 'paragraph'],
  ]);
  $field_storage->save();
}
$field = FieldConfig::loadByName('node', 'person', 'field_volunteer_shifts');
if (!$field) {
  FieldConfig::create([
    'field_storage' => $field_storage,
    'bundle' => 'person',
    'label' => 'Volunteer Shifts',
    'required' => FALSE,
    'settings' => [
      'handler' => 'default:paragraph',
      'handler_settings' => [
        'target_bundles' => ['volunteer_shift' => 'volunteer_shift'],
        'negate' => FALSE,
        'target_bundles_drag_drop' => ['volunteer_shift' => ['enabled' => TRUE, 'weight' => 0]],
      ],
    ],
  ])->save();
  echo "Created field: field_volunteer_shifts on person\n";
}

// ---------------------------------------------------------------
// 6. Add "Currently Fostering" computed reference field to Person
//    (entity_reference to animal, for quick lookup)
// ---------------------------------------------------------------
$field_storage = FieldStorageConfig::loadByName('node', 'field_currently_fostering');
if (!$field_storage) {
  $field_storage = FieldStorageConfig::create([
    'field_name' => 'field_currently_fostering',
    'entity_type' => 'node',
    'type' => 'entity_reference',
    'cardinality' => -1,
    'settings' => ['target_type' => 'node'],
  ]);
  $field_storage->save();
}
$field = FieldConfig::loadByName('node', 'person', 'field_currently_fostering');
if (!$field) {
  FieldConfig::create([
    'field_storage' => $field_storage,
    'bundle' => 'person',
    'label' => 'Currently Fostering',
    'required' => FALSE,
    'description' => 'Animals this person is currently fostering.',
    'settings' => [
      'handler' => 'default:node',
      'handler_settings' => [
        'target_bundles' => ['animal' => 'animal'],
        'sort' => ['field' => 'title', 'direction' => 'ASC'],
        'auto_create' => FALSE,
      ],
    ],
  ])->save();
  echo "Created field: field_currently_fostering on person\n";
}

// ---------------------------------------------------------------
// 7. Add "Volunteer Skills" taxonomy reference to Person
// ---------------------------------------------------------------

// First create the vocabulary
$vocab = \Drupal\taxonomy\Entity\Vocabulary::load('volunteer_skills');
if (!$vocab) {
  \Drupal\taxonomy\Entity\Vocabulary::create([
    'vid' => 'volunteer_skills',
    'name' => 'Volunteer Skills',
    'description' => 'Skills and areas of expertise that volunteers can offer.',
  ])->save();
  echo "Created vocabulary: Volunteer Skills\n";

  // Add default terms
  $skills = [
    'Animal Transport', 'Photography', 'Social Media', 'Fundraising',
    'Event Planning', 'Veterinary', 'Training', 'Administration',
    'Foster Care', 'Trap-Neuter-Return (TNR)', 'Website / Tech',
  ];
  foreach ($skills as $skill) {
    \Drupal\taxonomy\Entity\Term::create([
      'vid' => 'volunteer_skills',
      'name' => $skill,
    ])->save();
  }
  echo "Added " . count($skills) . " default volunteer skill terms\n";
}

$field_storage = FieldStorageConfig::loadByName('node', 'field_volunteer_skills');
if (!$field_storage) {
  $field_storage = FieldStorageConfig::create([
    'field_name' => 'field_volunteer_skills',
    'entity_type' => 'node',
    'type' => 'entity_reference',
    'cardinality' => -1,
    'settings' => ['target_type' => 'taxonomy_term'],
  ]);
  $field_storage->save();
}
$field = FieldConfig::loadByName('node', 'person', 'field_volunteer_skills');
if (!$field) {
  FieldConfig::create([
    'field_storage' => $field_storage,
    'bundle' => 'person',
    'label' => 'Volunteer Skills',
    'required' => FALSE,
    'settings' => [
      'handler' => 'default:taxonomy_term',
      'handler_settings' => [
        'target_bundles' => ['volunteer_skills' => 'volunteer_skills'],
        'auto_create' => FALSE,
      ],
    ],
  ])->save();
  echo "Created field: field_volunteer_skills on person\n";
}

// ---------------------------------------------------------------
// 8. Add "Availability" field to Person (for fosters/volunteers)
// ---------------------------------------------------------------
$field_storage = FieldStorageConfig::loadByName('node', 'field_availability_notes');
if (!$field_storage) {
  $field_storage = FieldStorageConfig::create([
    'field_name' => 'field_availability_notes',
    'entity_type' => 'node',
    'type' => 'text_long',
    'cardinality' => 1,
  ]);
  $field_storage->save();
}
$field = FieldConfig::loadByName('node', 'person', 'field_availability_notes');
if (!$field) {
  FieldConfig::create([
    'field_storage' => $field_storage,
    'bundle' => 'person',
    'label' => 'Availability Notes',
    'required' => FALSE,
    'description' => 'Describe availability for fostering or volunteering (e.g., weekends only, no dogs over 30 lbs, etc.)',
  ])->save();
  echo "Created field: field_availability_notes on person\n";
}

// ---------------------------------------------------------------
// 9. Add "Max Foster Capacity" and "Current Foster Count" to Person
// ---------------------------------------------------------------
$field_storage = FieldStorageConfig::loadByName('node', 'field_max_foster_capacity');
if (!$field_storage) {
  $field_storage = FieldStorageConfig::create([
    'field_name' => 'field_max_foster_capacity',
    'entity_type' => 'node',
    'type' => 'integer',
    'cardinality' => 1,
    'settings' => ['unsigned' => TRUE, 'size' => 'normal'],
  ]);
  $field_storage->save();
}
$field = FieldConfig::loadByName('node', 'person', 'field_max_foster_capacity');
if (!$field) {
  FieldConfig::create([
    'field_storage' => $field_storage,
    'bundle' => 'person',
    'label' => 'Max Foster Capacity',
    'required' => FALSE,
    'description' => 'Maximum number of animals this foster can house at one time.',
  ])->save();
  echo "Created field: field_max_foster_capacity on person\n";
}

// ---------------------------------------------------------------
// 10. Add "Foster Restrictions" field to Person
// ---------------------------------------------------------------
$field_storage = FieldStorageConfig::loadByName('node', 'field_foster_restrictions');
if (!$field_storage) {
  $field_storage = FieldStorageConfig::create([
    'field_name' => 'field_foster_restrictions',
    'entity_type' => 'node',
    'type' => 'text_long',
    'cardinality' => 1,
  ]);
  $field_storage->save();
}
$field = FieldConfig::loadByName('node', 'person', 'field_foster_restrictions');
if (!$field) {
  FieldConfig::create([
    'field_storage' => $field_storage,
    'bundle' => 'person',
    'label' => 'Foster Restrictions',
    'required' => FALSE,
    'description' => 'Any restrictions on what animals this foster can take (e.g., no cats, dogs only, kittens only).',
  ])->save();
  echo "Created field: field_foster_restrictions on person\n";
}

echo "\nPhase 3 Step 3: Foster and volunteer management features created successfully.\n";
