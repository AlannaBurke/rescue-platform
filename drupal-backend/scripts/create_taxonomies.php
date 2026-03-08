<?php

/**
 * Drush script to create all taxonomy vocabularies and default terms
 * for the Rescue Platform data model.
 *
 * Run with: drush php:script create_taxonomies.php
 */

use Drupal\taxonomy\Entity\Vocabulary;
use Drupal\taxonomy\Entity\Term;

$vocabularies = [
  'animal_status' => [
    'label' => 'Animal Status',
    'terms' => [
      'Available',
      'In Foster',
      'Adoption Pending',
      'Adopted',
      'Sanctuary',
      'Medical Hold',
      'Not Available',
    ],
  ],
  'animal_species' => [
    'label' => 'Animal Species',
    'terms' => [
      'Dog',
      'Cat',
      'Rabbit',
      'Guinea Pig',
      'Bird',
      'Reptile',
      'Other',
    ],
  ],
  'person_role' => [
    'label' => 'Person Role',
    'terms' => [
      'Foster',
      'Volunteer',
      'Adopter',
      'Donor',
      'Board Member',
      'Staff',
    ],
  ],
  'medical_type' => [
    'label' => 'Medical Type',
    'terms' => [
      'Vaccination',
      'Medication',
      'Vet Visit',
      'Surgery',
      'Dental',
      'Spay/Neuter',
      'Microchip',
      'Other',
    ],
  ],
  'expense_category' => [
    'label' => 'Expense Category',
    'terms' => [
      'Veterinary',
      'Food & Supplies',
      'Transport',
      'Boarding',
      'Marketing',
      'Administrative',
      'Other',
    ],
  ],
];

foreach ($vocabularies as $machine_name => $config) {
  // Create vocabulary if it doesn't exist.
  $vocab = Vocabulary::load($machine_name);
  if (!$vocab) {
    $vocab = Vocabulary::create([
      'vid' => $machine_name,
      'name' => $config['label'],
    ]);
    $vocab->save();
    echo "Created vocabulary: {$config['label']} ({$machine_name})\n";
  }
  else {
    echo "Vocabulary already exists: {$config['label']} ({$machine_name})\n";
  }

  // Create terms.
  foreach ($config['terms'] as $term_name) {
    $existing = \Drupal::entityTypeManager()
      ->getStorage('taxonomy_term')
      ->loadByProperties(['name' => $term_name, 'vid' => $machine_name]);

    if (empty($existing)) {
      $term = Term::create([
        'vid' => $machine_name,
        'name' => $term_name,
      ]);
      $term->save();
      echo "  Created term: {$term_name}\n";
    }
    else {
      echo "  Term already exists: {$term_name}\n";
    }
  }
}

echo "\nAll taxonomies created successfully.\n";
