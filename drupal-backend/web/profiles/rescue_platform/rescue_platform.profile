<?php

/**
 * @file
 * Rescue Platform installation profile.
 *
 * Provides a comprehensive content management and website platform
 * for small animal rescues. This profile sets up all required content
 * types, taxonomies, user roles, workflows, and GraphQL API configuration
 * out of the box.
 */

use Drupal\Core\Form\FormStateInterface;

/**
 * Implements hook_install_tasks().
 *
 * Adds custom installation tasks to the Drupal installer.
 */
function rescue_platform_install_tasks(&$install_state): array {
  return [
    'rescue_platform_setup_content_types' => [
      'display_name' => t('Setting up animal management content types'),
      'type' => 'normal',
    ],
    'rescue_platform_setup_taxonomies' => [
      'display_name' => t('Creating taxonomy vocabularies and default terms'),
      'type' => 'normal',
    ],
    'rescue_platform_setup_roles' => [
      'display_name' => t('Configuring user roles and permissions'),
      'type' => 'normal',
    ],
    'rescue_platform_setup_workflows' => [
      'display_name' => t('Setting up content moderation workflows'),
      'type' => 'normal',
    ],
    'rescue_platform_setup_graphql' => [
      'display_name' => t('Configuring GraphQL API'),
      'type' => 'normal',
    ],
    'rescue_platform_setup_rescue_info' => [
      'display_name' => t('Enter your rescue information'),
      'display' => TRUE,
      'type' => 'form',
      'function' => 'rescue_platform_rescue_info_form',
    ],
  ];
}

/**
 * Implements hook_install_tasks_alter().
 */
function rescue_platform_install_tasks_alter(array &$tasks, array $install_state): void {
  // Move our rescue info form to appear after the site configuration step.
  if (isset($tasks['install_configure_form']) && isset($tasks['rescue_platform_setup_rescue_info'])) {
    $rescue_info_task = $tasks['rescue_platform_setup_rescue_info'];
    unset($tasks['rescue_platform_setup_rescue_info']);
    $keys = array_keys($tasks);
    $pos = array_search('install_configure_form', $keys);
    $tasks = array_slice($tasks, 0, $pos + 1, TRUE)
      + ['rescue_platform_setup_rescue_info' => $rescue_info_task]
      + array_slice($tasks, $pos + 1, NULL, TRUE);
  }
}

/**
 * Installation task: Set up content types.
 */
function rescue_platform_setup_content_types(): void {
  // Content types are defined in config/install YAML files and will be
  // imported automatically. This task verifies they are in place.
  $content_types = [
    'animal', 'person', 'medical_record', 'expense',
    'donation', 'blog_post', 'event', 'page',
  ];

  $type_storage = \Drupal::entityTypeManager()->getStorage('node_type');
  foreach ($content_types as $type) {
    if (!$type_storage->load($type)) {
      \Drupal::logger('rescue_platform')->warning(
        'Content type @type was not created during installation.',
        ['@type' => $type]
      );
    }
  }
}

/**
 * Installation task: Set up taxonomy vocabularies with default terms.
 */
function rescue_platform_setup_taxonomies(): void {
  $default_terms = [
    'animal_status' => [
      'Intake', 'In Foster', 'Available', 'Adoption Pending',
      'Adopted', 'Returned', 'Deceased', 'Transferred',
    ],
    'animal_species' => [
      'Dog', 'Cat', 'Rabbit', 'Guinea Pig', 'Bird',
      'Reptile', 'Small Animal', 'Other',
    ],
    'medical_type' => [
      'Spay/Neuter', 'Vaccination', 'Dental', 'Emergency',
      'Routine Exam', 'Medication', 'Surgery', 'Lab Work', 'Other',
    ],
    'expense_category' => [
      'Veterinary Care', 'Food & Supplies', 'Transport',
      'Foster Supplies', 'Events', 'Marketing', 'Administrative', 'Other',
    ],
    'person_role' => [
      'Foster Parent', 'Volunteer', 'Adopter',
      'Donor', 'Veterinarian', 'Board Member', 'Staff',
    ],
    'volunteer_skills' => [
      'Animal Transport', 'Photography', 'Videography', 'Social Media',
      'Graphic Design', 'Web Development', 'Grant Writing',
      'Event Planning', 'Veterinary Skills', 'Training', 'Other',
    ],
  ];

  $term_storage = \Drupal::entityTypeManager()->getStorage('taxonomy_term');

  foreach ($default_terms as $vocab => $terms) {
    // Check vocabulary exists before adding terms.
    $vocabulary = \Drupal::entityTypeManager()
      ->getStorage('taxonomy_vocabulary')
      ->load($vocab);

    if (!$vocabulary) {
      continue;
    }

    // Only add terms if the vocabulary is empty (fresh install).
    $existing = $term_storage->loadTree($vocab);
    if (!empty($existing)) {
      continue;
    }

    foreach ($terms as $weight => $name) {
      $term = $term_storage->create([
        'vid' => $vocab,
        'name' => $name,
        'weight' => $weight,
      ]);
      $term->save();
    }
  }
}

/**
 * Installation task: Set up user roles and permissions.
 */
function rescue_platform_setup_roles(): void {
  $roles_config = [
    'rescue_admin' => [
      'label' => 'Rescue Administrator',
      'weight' => 3,
    ],
    'rescue_staff' => [
      'label' => 'Rescue Staff',
      'weight' => 4,
    ],
    'foster_coordinator' => [
      'label' => 'Foster Coordinator',
      'weight' => 5,
    ],
    'volunteer_coordinator' => [
      'label' => 'Volunteer Coordinator',
      'weight' => 6,
    ],
    'content_editor' => [
      'label' => 'Content Editor',
      'weight' => 7,
    ],
    'foster_parent' => [
      'label' => 'Foster Parent',
      'weight' => 8,
    ],
  ];

  $role_storage = \Drupal::entityTypeManager()->getStorage('user_role');

  foreach ($roles_config as $rid => $config) {
    if (!$role_storage->load($rid)) {
      $role = $role_storage->create([
        'id' => $rid,
        'label' => $config['label'],
        'weight' => $config['weight'],
      ]);
      $role->save();
    }
  }
}

/**
 * Installation task: Set up content moderation workflows.
 */
function rescue_platform_setup_workflows(): void {
  // Workflows are defined in config/install YAML files.
  // This task logs a confirmation message.
  \Drupal::logger('rescue_platform')->info(
    'Content moderation workflows configured: Editorial and Animal Intake.'
  );
}

/**
 * Installation task: Configure the GraphQL API.
 */
function rescue_platform_setup_graphql(): void {
  // GraphQL server configuration is defined in config/install YAML files.
  // This task clears caches to ensure the schema is built.
  \Drupal::service('cache.render')->invalidateAll();

  \Drupal::logger('rescue_platform')->info(
    'GraphQL API configured. Endpoint available at /graphql.'
  );
}

/**
 * Form callback: Rescue information form shown during installation.
 */
function rescue_platform_rescue_info_form(array $form, FormStateInterface $form_state): array {
  $form['#title'] = t('Your Rescue Information');

  $form['rescue_info'] = [
    '#type' => 'fieldset',
    '#title' => t('Tell us about your rescue'),
    '#description' => t('This information will be used to configure your rescue platform. You can change it later in the site settings.'),
  ];

  $form['rescue_info']['rescue_name'] = [
    '#type' => 'textfield',
    '#title' => t('Rescue Name'),
    '#description' => t('The official name of your animal rescue organization.'),
    '#required' => TRUE,
    '#placeholder' => t('e.g., Happy Paws Animal Rescue'),
  ];

  $form['rescue_info']['rescue_tagline'] = [
    '#type' => 'textfield',
    '#title' => t('Tagline'),
    '#description' => t('A short, memorable description of your rescue mission.'),
    '#placeholder' => t('e.g., Saving lives, one paw at a time.'),
  ];

  $form['rescue_info']['rescue_email'] = [
    '#type' => 'email',
    '#title' => t('Contact Email'),
    '#description' => t('The primary contact email for your rescue.'),
    '#required' => TRUE,
  ];

  $form['rescue_info']['rescue_phone'] = [
    '#type' => 'tel',
    '#title' => t('Phone Number'),
    '#description' => t('Your rescue\'s phone number (optional).'),
  ];

  $form['rescue_info']['rescue_location'] = [
    '#type' => 'textfield',
    '#title' => t('Service Area'),
    '#description' => t('The city, region, or area your rescue serves.'),
    '#placeholder' => t('e.g., Portland, OR and surrounding areas'),
  ];

  $form['rescue_info']['rescue_ein'] = [
    '#type' => 'textfield',
    '#title' => t('EIN / Tax ID (optional)'),
    '#description' => t('Your 501(c)(3) Employer Identification Number, if applicable.'),
    '#placeholder' => t('e.g., 12-3456789'),
  ];

  $form['actions'] = [
    '#type' => 'actions',
  ];

  $form['actions']['submit'] = [
    '#type' => 'submit',
    '#value' => t('Save and Continue'),
    '#button_type' => 'primary',
  ];

  return $form;
}

/**
 * Submit handler for the rescue information form.
 */
function rescue_platform_rescue_info_form_submit(array $form, FormStateInterface $form_state): void {
  $config = \Drupal::configFactory()->getEditable('system.site');
  $rescue_name = $form_state->getValue('rescue_name');

  // Update the site name with the rescue name.
  if ($rescue_name) {
    $config->set('name', $rescue_name)->save();
  }

  // Store rescue-specific settings in a custom config object.
  $rescue_config = \Drupal::configFactory()->getEditable('rescue_platform.settings');
  $rescue_config
    ->set('rescue_name', $rescue_name)
    ->set('rescue_tagline', $form_state->getValue('rescue_tagline'))
    ->set('rescue_email', $form_state->getValue('rescue_email'))
    ->set('rescue_phone', $form_state->getValue('rescue_phone'))
    ->set('rescue_location', $form_state->getValue('rescue_location'))
    ->set('rescue_ein', $form_state->getValue('rescue_ein'))
    ->save();

  \Drupal::messenger()->addStatus(t(
    'Your rescue information has been saved. Welcome to Rescue Platform, @name!',
    ['@name' => $rescue_name]
  ));
}
