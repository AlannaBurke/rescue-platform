<?php

/**
 * Configure GraphQL Compose for new animal fields and create Views.
 */

use Drupal\views\Entity\View;

// ─────────────────────────────────────────────────────────────────────────────
// 1. Enable new animal fields in GraphQL Compose
// ─────────────────────────────────────────────────────────────────────────────

echo "Enabling new animal fields in GraphQL Compose...\n";

$config = \Drupal::configFactory()->getEditable('graphql_compose.settings');
$settings = $config->get() ?: [];

// Ensure entity_config exists
if (!isset($settings['entity_config'])) {
  $settings['entity_config'] = [];
}

// ── Paragraph types ──
$paragraph_bundles = [
  'log_entry' => [
    'field_log_date',
    'field_log_type',
    'field_log_details',
  ],
  'medication_log' => [
    'field_med_name',
    'field_med_dosage',
    'field_med_frequency',
    'field_med_start_date',
    'field_med_end_date',
    'field_med_notes',
  ],
  'placement' => [
    'field_placement_type',
    'field_placement_person',
    'field_placement_start_date',
    'field_placement_end_date',
    'field_placement_notes',
  ],
];

foreach ($paragraph_bundles as $bundle => $fields) {
  $settings['entity_config']['paragraph'][$bundle]['enabled'] = TRUE;
  $settings['entity_config']['paragraph'][$bundle]['query_load_enabled'] = TRUE;
  $settings['entity_config']['paragraph'][$bundle]['edges_enabled'] = TRUE;
  foreach ($fields as $field) {
    $settings['field_config']['paragraph'][$bundle][$field]['enabled'] = TRUE;
  }
  echo "  Enabled paragraph type in GraphQL: {$bundle}\n";
}

// ── New animal fields ──
$new_animal_fields = [
  'field_animal_source',
  'field_lifecycle_status',
  'field_is_featured',
  'field_exclude_public',
  'field_date_of_passing',
  'field_adoption_date',
  'field_adopted_by',
  'field_history_log',
  'field_medication_log',
  'field_placement_history',
];

foreach ($new_animal_fields as $field) {
  $settings['field_config']['node']['animal'][$field]['enabled'] = TRUE;
  echo "  Enabled field in GraphQL: node.animal.{$field}\n";
}

// ── Taxonomy: animal_lifecycle_status ──
$settings['entity_config']['taxonomy_term']['animal_lifecycle_status']['enabled'] = TRUE;
$settings['entity_config']['taxonomy_term']['animal_lifecycle_status']['query_load_enabled'] = TRUE;
$settings['entity_config']['taxonomy_term']['animal_lifecycle_status']['edges_enabled'] = TRUE;
echo "  Enabled taxonomy in GraphQL: animal_lifecycle_status\n";

$config->setData($settings)->save();
\Drupal::service('cache.render')->deleteAll();
echo "  GraphQL Compose settings saved and cache cleared.\n";

// ─────────────────────────────────────────────────────────────────────────────
// 2. Create Views for frontend display
// ─────────────────────────────────────────────────────────────────────────────

echo "\nCreating Views...\n";

/**
 * Helper: create a basic view with a page display.
 */
function create_animal_view(string $id, string $label, string $path, string $status_filter_value, string $sort_field = 'field_is_featured'): void {
  if (View::load($id)) {
    echo "  View already exists: {$id}\n";
    return;
  }

  $view = View::create([
    'id'          => $id,
    'label'       => $label,
    'base_table'  => 'node_field_data',
    'description' => "Animals with lifecycle status: {$status_filter_value}",
    'status'      => TRUE,
    'display'     => [
      'default' => [
        'id'             => 'default',
        'display_plugin' => 'default',
        'display_title'  => 'Default',
        'position'       => 0,
        'display_options' => [
          'access' => [
            'type'    => 'perm',
            'options' => ['perm' => 'access content'],
          ],
          'cache' => [
            'type'    => 'tag',
            'options' => [],
          ],
          'query' => [
            'type'    => 'views_query',
            'options' => ['distinct' => FALSE],
          ],
          'exposed_form' => [
            'type'    => 'basic',
            'options' => [],
          ],
          'pager' => [
            'type'    => 'full',
            'options' => ['items_per_page' => 50],
          ],
          'style' => [
            'type'    => 'default',
            'options' => [],
          ],
          'row' => [
            'type'    => 'entity:node',
            'options' => ['view_mode' => 'teaser'],
          ],
          'fields' => [],
          'filters' => [
            'status' => [
              'id'         => 'status',
              'table'      => 'node_field_data',
              'field'      => 'status',
              'value'      => '1',
              'group'      => 1,
              'expose'     => ['operator' => ''],
              'plugin_id'  => 'boolean',
            ],
            'type' => [
              'id'        => 'type',
              'table'     => 'node_field_data',
              'field'     => 'type',
              'value'     => ['animal' => 'animal'],
              'plugin_id' => 'bundle',
            ],
          ],
          'sorts' => [
            'field_is_featured_value' => [
              'id'        => 'field_is_featured_value',
              'table'     => 'node__field_is_featured',
              'field'     => 'field_is_featured_value',
              'order'     => 'DESC',
              'plugin_id' => 'standard',
            ],
            'field_intake_date_value' => [
              'id'        => 'field_intake_date_value',
              'table'     => 'node__field_intake_date',
              'field'     => 'field_intake_date_value',
              'order'     => 'ASC',
              'plugin_id' => 'date',
            ],
          ],
          'title'       => $label,
          'header'      => [],
          'footer'      => [],
          'empty'       => [],
          'relationships' => [],
          'arguments'   => [],
          'display_extenders' => [],
        ],
        'cache_metadata' => [
          'max-age' => -1,
          'contexts' => ['languages:language_interface', 'url.query_args', 'user.permissions'],
          'tags'     => [],
        ],
      ],
      'page_1' => [
        'id'             => 'page_1',
        'display_plugin' => 'page',
        'display_title'  => 'Page',
        'position'       => 1,
        'display_options' => [
          'path'          => $path,
          'display_extenders' => [],
        ],
        'cache_metadata' => [
          'max-age' => -1,
          'contexts' => ['languages:language_interface', 'url.query_args', 'user.permissions'],
          'tags'     => [],
        ],
      ],
    ],
  ]);

  $view->save();
  echo "  Created view: {$id} at {$path}\n";
}

create_animal_view(
  'adoptable_animals',
  'Adoptable Animals',
  '/adopt-list',
  'Available for Adoption'
);

create_animal_view(
  'sanctuary_animals',
  'Sanctuary Animals',
  '/sanctuary-list',
  'Sanctuary'
);

create_animal_view(
  'rainbow_bridge',
  'Rainbow Bridge',
  '/rainbow-bridge-list',
  'Deceased (Rainbow Bridge)'
);

// ─────────────────────────────────────────────────────────────────────────────
// 3. Rebuild caches
// ─────────────────────────────────────────────────────────────────────────────

echo "\nRebuilding caches...\n";
drupal_flush_all_caches();
echo "Done!\n";
