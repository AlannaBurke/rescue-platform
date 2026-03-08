<?php

/**
 * Drush script to enable all custom fields in GraphQL Compose field_config.
 * Run with: drush php:script enable_graphql_fields.php
 */

$field_manager = \Drupal::service('entity_field.manager');
$settings = \Drupal::configFactory()->getEditable('graphql_compose.settings');
$field_config = $settings->get('field_config') ?? [];

// Define all bundles and their entity types
$bundles = [
  'node' => ['animal', 'person', 'medical_record', 'expense', 'blog_post', 'event', 'page'],
  'taxonomy_term' => ['animal_status', 'animal_species', 'person_role', 'medical_type', 'expense_category'],
];

foreach ($bundles as $entity_type => $bundle_list) {
  foreach ($bundle_list as $bundle) {
    $fields = $field_manager->getFieldDefinitions($entity_type, $bundle);
    foreach ($fields as $field_name => $field_def) {
      // Enable all fields (both base fields and custom fields)
      $field_config[$entity_type][$bundle][$field_name] = [
        'enabled' => TRUE,
      ];
    }
    echo "Enabled fields for {$entity_type}/{$bundle}\n";
  }
}

$settings->set('field_config', $field_config);
$settings->save();

drupal_flush_all_caches();
echo "\nAll fields enabled and caches flushed.\n";
