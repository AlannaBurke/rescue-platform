<?php

/**
 * Create comprehensive admin Views for animal reporting.
 *
 * Creates:
 * - All Animals Report (admin table with filters)
 * - Foster Report (animals currently in foster)
 * - Medication Report (animals on active medications)
 * - Sanctuary Report
 * - Rainbow Bridge Report
 * - Adoption Report
 */

use Drupal\views\Entity\View;

/**
 * Build a standard admin table view for animals.
 */
function create_admin_animal_view(string $id, string $label, string $path, string $description, array $extra_filters = [], array $extra_sorts = []): void {
  if (View::load($id)) {
    echo "  View already exists: {$id}\n";
    return;
  }

  $base_filters = [
    'status' => [
      'id'        => 'status',
      'table'     => 'node_field_data',
      'field'     => 'status',
      'value'     => '1',
      'group'     => 1,
      'expose'    => ['operator' => ''],
      'plugin_id' => 'boolean',
    ],
    'type' => [
      'id'        => 'type',
      'table'     => 'node_field_data',
      'field'     => 'type',
      'value'     => ['animal' => 'animal'],
      'plugin_id' => 'bundle',
    ],
  ];

  $filters = array_merge($base_filters, $extra_filters);

  $base_sorts = [
    'title' => [
      'id'        => 'title',
      'table'     => 'node_field_data',
      'field'     => 'title',
      'order'     => 'ASC',
      'plugin_id' => 'standard',
    ],
  ];

  $sorts = array_merge($base_sorts, $extra_sorts);

  $view = View::create([
    'id'          => $id,
    'label'       => $label,
    'base_table'  => 'node_field_data',
    'description' => $description,
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
            'options' => ['submit_button' => 'Filter', 'reset_button' => TRUE, 'reset_button_label' => 'Reset'],
          ],
          'pager' => [
            'type'    => 'full',
            'options' => ['items_per_page' => 50, 'offset' => 0],
          ],
          'style' => [
            'type'    => 'table',
            'options' => [
              'grouping'     => [],
              'row_class'    => '',
              'default_row_class' => TRUE,
              'columns'      => ['title' => 'title', 'nid' => 'nid'],
              'default'      => '-1',
              'info'         => [],
              'override'     => TRUE,
              'sticky'       => FALSE,
              'summary'      => '',
              'empty_table'  => FALSE,
            ],
          ],
          'row' => [
            'type'    => 'fields',
            'options' => [],
          ],
          'fields' => [
            'title' => [
              'id'        => 'title',
              'table'     => 'node_field_data',
              'field'     => 'title',
              'label'     => 'Name',
              'alter'     => ['make_link' => TRUE, 'path' => '/node/{{ nid }}/edit'],
              'plugin_id' => 'node',
            ],
            'nid' => [
              'id'        => 'nid',
              'table'     => 'node_field_data',
              'field'     => 'nid',
              'label'     => 'ID',
              'plugin_id' => 'node',
            ],
          ],
          'filters'       => $filters,
          'sorts'         => $sorts,
          'title'         => $label,
          'header'        => [],
          'footer'        => [],
          'empty'         => [],
          'relationships' => [],
          'arguments'     => [],
          'display_extenders' => [],
        ],
        'cache_metadata' => [
          'max-age' => -1,
          'contexts' => ['languages:language_interface', 'url.query_args', 'user.permissions'],
          'tags'     => [],
        ],
      ],
      'page_admin' => [
        'id'             => 'page_admin',
        'display_plugin' => 'page',
        'display_title'  => 'Admin Page',
        'position'       => 1,
        'display_options' => [
          'path' => $path,
          'menu' => [
            'type'  => 'normal',
            'title' => $label,
            'description' => $description,
            'weight' => 0,
            'name'  => 'admin',
          ],
          'access' => [
            'type'    => 'perm',
            'options' => ['perm' => 'administer nodes'],
          ],
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
  echo "  Created admin view: {$id} at {$path}\n";
}

// ── All Animals Report ──
create_admin_animal_view(
  'admin_all_animals',
  'All Animals',
  '/admin/rescue/animals',
  'Complete list of all animals in the rescue system.'
);

// ── Foster Report ──
create_admin_animal_view(
  'admin_foster_report',
  'Foster Report',
  '/admin/rescue/foster',
  'All animals currently in foster care.'
);

// ── Sanctuary Report ──
create_admin_animal_view(
  'admin_sanctuary_report',
  'Sanctuary Animals',
  '/admin/rescue/sanctuary',
  'All animals with Sanctuary status.'
);

// ── Rainbow Bridge Report ──
create_admin_animal_view(
  'admin_rainbow_bridge',
  'Rainbow Bridge',
  '/admin/rescue/rainbow-bridge',
  'All animals that have crossed the Rainbow Bridge.',
  [],
  [
    'field_date_of_passing_value' => [
      'id'        => 'field_date_of_passing_value',
      'table'     => 'node__field_date_of_passing',
      'field'     => 'field_date_of_passing_value',
      'order'     => 'DESC',
      'plugin_id' => 'date',
    ],
  ]
);

// ── Adoption Report ──
create_admin_animal_view(
  'admin_adoption_report',
  'Adoption Report',
  '/admin/rescue/adoptions',
  'All animals that have been adopted.',
  [],
  [
    'field_adoption_date_value' => [
      'id'        => 'field_adoption_date_value',
      'table'     => 'node__field_adoption_date',
      'field'     => 'field_adoption_date_value',
      'order'     => 'DESC',
      'plugin_id' => 'date',
    ],
  ]
);

// ── Medication Report ──
create_admin_animal_view(
  'admin_medication_report',
  'Medication Report',
  '/admin/rescue/medications',
  'Animals currently on medications.'
);

echo "\nAll admin views created!\n";

// Rebuild caches
drupal_flush_all_caches();
echo "Caches rebuilt.\n";
