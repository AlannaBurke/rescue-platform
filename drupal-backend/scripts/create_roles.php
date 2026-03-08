<?php

/**
 * Phase 3: Create user roles and assign permissions.
 *
 * Roles:
 *   - rescue_admin      : Full control of all rescue data and content
 *   - rescue_staff      : Manage animals, fosters, volunteers, expenses; edit content
 *   - foster_coordinator: Manage foster placements and foster parent records
 *   - volunteer_coordinator: Manage volunteer records and events
 *   - content_editor    : Create and edit website content (blog, pages, events)
 *   - foster_parent     : View their own foster animal records (future portal)
 */

use Drupal\user\Entity\Role;

$roles = [
  'rescue_admin' => [
    'label' => 'Rescue Admin',
    'weight' => 1,
  ],
  'rescue_staff' => [
    'label' => 'Rescue Staff',
    'weight' => 2,
  ],
  'foster_coordinator' => [
    'label' => 'Foster Coordinator',
    'weight' => 3,
  ],
  'volunteer_coordinator' => [
    'label' => 'Volunteer Coordinator',
    'weight' => 4,
  ],
  'content_editor' => [
    'label' => 'Content Editor',
    'weight' => 5,
  ],
  'foster_parent' => [
    'label' => 'Foster Parent',
    'weight' => 6,
  ],
];

foreach ($roles as $id => $config) {
  $existing = Role::load($id);
  if ($existing) {
    echo "Role '$id' already exists, skipping creation.\n";
    continue;
  }
  $role = Role::create([
    'id' => $id,
    'label' => $config['label'],
    'weight' => $config['weight'],
  ]);
  $role->save();
  echo "Created role: {$config['label']} ($id)\n";
}

// ---------------------------------------------------------------
// Permission sets per role
// ---------------------------------------------------------------

// All node types we manage
$node_types = ['animal', 'person', 'medical_record', 'expense', 'blog_post', 'event', 'page'];

// Helper: build CRUD permission strings for a content type
function node_perms(string $type, array $ops): array {
  $perms = [];
  foreach ($ops as $op) {
    switch ($op) {
      case 'create':   $perms[] = "create $type content"; break;
      case 'edit_own': $perms[] = "edit own $type content"; break;
      case 'edit_any': $perms[] = "edit any $type content"; break;
      case 'delete_own': $perms[] = "delete own $type content"; break;
      case 'delete_any': $perms[] = "delete any $type content"; break;
      case 'view_own': $perms[] = "view own unpublished content"; break;
    }
  }
  return $perms;
}

// ---------------------------------------------------------------
// rescue_admin: everything
// ---------------------------------------------------------------
$admin_perms = [
  'administer users',
  'administer permissions',
  'administer content types',
  'administer node fields',
  'administer taxonomy',
  'administer site configuration',
  'access administration pages',
  'access content overview',
  'view any unpublished content',
  'use text format basic_html',
  'use text format full_html',
];
foreach ($node_types as $type) {
  $admin_perms = array_merge($admin_perms, node_perms($type, ['create', 'edit_own', 'edit_any', 'delete_own', 'delete_any']));
}
user_role_grant_permissions('rescue_admin', $admin_perms);
echo "Permissions set for rescue_admin\n";

// ---------------------------------------------------------------
// rescue_staff: manage all rescue data, edit all content
// ---------------------------------------------------------------
$staff_perms = [
  'access administration pages',
  'access content overview',
  'view any unpublished content',
  'use text format basic_html',
  'use text format full_html',
];
foreach ($node_types as $type) {
  $staff_perms = array_merge($staff_perms, node_perms($type, ['create', 'edit_own', 'edit_any', 'delete_own']));
}
user_role_grant_permissions('rescue_staff', $staff_perms);
echo "Permissions set for rescue_staff\n";

// ---------------------------------------------------------------
// foster_coordinator: manage animals, persons, medical records
// ---------------------------------------------------------------
$foster_coord_types = ['animal', 'person', 'medical_record'];
$foster_coord_perms = [
  'access administration pages',
  'access content overview',
  'view any unpublished content',
  'use text format basic_html',
];
foreach ($foster_coord_types as $type) {
  $foster_coord_perms = array_merge($foster_coord_perms, node_perms($type, ['create', 'edit_own', 'edit_any', 'delete_own']));
}
user_role_grant_permissions('foster_coordinator', $foster_coord_perms);
echo "Permissions set for foster_coordinator\n";

// ---------------------------------------------------------------
// volunteer_coordinator: manage persons and events
// ---------------------------------------------------------------
$vol_coord_types = ['person', 'event'];
$vol_coord_perms = [
  'access administration pages',
  'access content overview',
  'view any unpublished content',
  'use text format basic_html',
];
foreach ($vol_coord_types as $type) {
  $vol_coord_perms = array_merge($vol_coord_perms, node_perms($type, ['create', 'edit_own', 'edit_any', 'delete_own']));
}
user_role_grant_permissions('volunteer_coordinator', $vol_coord_perms);
echo "Permissions set for volunteer_coordinator\n";

// ---------------------------------------------------------------
// content_editor: create and edit website content
// ---------------------------------------------------------------
$editor_types = ['blog_post', 'event', 'page'];
$editor_perms = [
  'access administration pages',
  'access content overview',
  'view own unpublished content',
  'use text format basic_html',
  'use text format full_html',
];
foreach ($editor_types as $type) {
  $editor_perms = array_merge($editor_perms, node_perms($type, ['create', 'edit_own', 'edit_any', 'delete_own']));
}
user_role_grant_permissions('content_editor', $editor_perms);
echo "Permissions set for content_editor\n";

// ---------------------------------------------------------------
// foster_parent: view their own animal records (read-only portal)
// ---------------------------------------------------------------
$foster_parent_perms = [
  'access content',
];
user_role_grant_permissions('foster_parent', $foster_parent_perms);
echo "Permissions set for foster_parent\n";

echo "\nAll roles and permissions configured successfully.\n";
