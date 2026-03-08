<?php

/**
 * Configure Gin as the Drupal admin theme with rescue-friendly settings.
 */

use Drupal\Core\Config\Config;

// 1. Install and enable Gin theme and gin_toolbar module
\Drupal::service('theme_installer')->install(['gin']);
\Drupal::service('module_installer')->install(['gin_toolbar']);

// 2. Set Gin as the admin theme
\Drupal::configFactory()->getEditable('system.theme')
  ->set('admin', 'gin')
  ->save();

// 3. Use admin theme for content editing
\Drupal::configFactory()->getEditable('node.settings')
  ->set('use_admin_theme', TRUE)
  ->save();

// 4. Configure Gin theme settings
$gin_settings = \Drupal::configFactory()->getEditable('gin.settings');
$gin_settings
  // Layout & navigation
  ->set('enable_darkmode', 0)              // Light mode default
  ->set('classic_toolbar', 'vertical')     // Vertical sidebar nav
  ->set('secondary_toolbar_frontend', FALSE)
  ->set('show_description_toggle', TRUE)   // Show field descriptions
  ->set('show_user_theme_settings', TRUE)  // Let users pick dark/light

  // Accent color — HALT teal #2099a1
  ->set('preset_accent_color', 'custom')
  ->set('accent_color', '#2099a1')

  // Focus color — warm orange
  ->set('preset_focus_color', 'custom')
  ->set('focus_color', '#e8a87c')

  // High contrast mode off by default
  ->set('high_contrast_mode', FALSE)

  // Content density
  ->set('content_form_width', 'medium')    // Medium width for forms

  // Dashboard
  ->set('show_description_toggle', TRUE)

  ->save();

echo "✅ Gin theme installed and configured as admin theme\n";
echo "   - Accent color: #2099a1 (HALT teal)\n";
echo "   - Focus color: #e8a87c (warm orange)\n";
echo "   - Toolbar: vertical sidebar\n";
echo "   - Dark mode: user-selectable\n";

// 5. Configure the admin toolbar
$toolbar_settings = \Drupal::configFactory()->getEditable('toolbar.settings');
$toolbar_settings->save();

// 6. Set up admin menu shortcuts for rescue workflow
// Add quick links to the most-used admin pages
$shortcut_sets = \Drupal::entityTypeManager()->getStorage('shortcut_set')->loadMultiple();
if (!empty($shortcut_sets)) {
  $default_set = reset($shortcut_sets);
  $shortcuts = $default_set->getShortcuts();

  // Clear existing shortcuts
  foreach ($shortcuts as $shortcut) {
    $shortcut->delete();
  }

  // Add rescue-specific shortcuts
  $rescue_shortcuts = [
    ['title' => 'Add Animal', 'path' => '/node/add/animal', 'weight' => 0],
    ['title' => 'All Animals', 'path' => '/admin/rescue/animals', 'weight' => 1],
    ['title' => 'Add Person', 'path' => '/node/add/person', 'weight' => 2],
    ['title' => 'Foster Report', 'path' => '/admin/rescue/foster', 'weight' => 3],
    ['title' => 'Add Expense', 'path' => '/node/add/expense', 'weight' => 4],
    ['title' => 'Add Blog Post', 'path' => '/node/add/blog_post', 'weight' => 5],
  ];

  foreach ($rescue_shortcuts as $data) {
    $shortcut = \Drupal\shortcut\Entity\Shortcut::create([
      'shortcut_set' => $default_set->id(),
      'title' => $data['title'],
      'weight' => $data['weight'],
      'link' => ['uri' => 'internal:' . $data['path']],
    ]);
    $shortcut->save();
  }
  echo "✅ Admin shortcuts configured for rescue workflow\n";
}

// 7. Configure the Views admin display settings for a cleaner experience
$views_ui_settings = \Drupal::configFactory()->getEditable('views_ui.settings');
$views_ui_settings
  ->set('show_advanced_column', FALSE)   // Hide advanced column by default
  ->set('ui_show_preview_information', TRUE)
  ->save();

// 8. Configure Content overview display
$node_admin_settings = \Drupal::configFactory()->getEditable('views.view.content');
// This is handled by the existing views config

// 9. Rebuild caches
drupal_flush_all_caches();
echo "✅ All caches rebuilt\n";
echo "\n🎉 Gin admin theme is ready! Visit /admin to see the new interface.\n";
