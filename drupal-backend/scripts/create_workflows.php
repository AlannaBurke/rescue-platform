<?php

/**
 * Phase 3: Configure content moderation workflows.
 *
 * Two workflows:
 *
 * 1. "Editorial Workflow" (for public-facing content: blog_post, event, page)
 *    States: Draft → Needs Review → Published → Archived
 *    Transitions:
 *      - create_new_draft (any → draft)
 *      - submit_for_review (draft → needs_review)
 *      - publish (needs_review → published)  [staff/admin only]
 *      - archive (published → archived)       [staff/admin only]
 *      - restore_draft (needs_review → draft)
 *
 * 2. "Animal Intake Workflow" (for animal records)
 *    States: Intake → In Foster → Available → Adopted → Deceased → Returned
 *    Transitions: all logical state changes
 */

use Drupal\workflows\Entity\Workflow;

// ---------------------------------------------------------------
// 1. Editorial Workflow
// ---------------------------------------------------------------
$editorial = Workflow::load('editorial');
if (!$editorial) {
  $editorial = Workflow::create([
    'id' => 'editorial',
    'label' => 'Editorial Workflow',
    'type' => 'content_moderation',
    'type_settings' => [
      'states' => [
        'draft' => [
          'label' => 'Draft',
          'published' => FALSE,
          'default_revision' => FALSE,
          'weight' => 0,
        ],
        'needs_review' => [
          'label' => 'Needs Review',
          'published' => FALSE,
          'default_revision' => FALSE,
          'weight' => 1,
        ],
        'published' => [
          'label' => 'Published',
          'published' => TRUE,
          'default_revision' => TRUE,
          'weight' => 2,
        ],
        'archived' => [
          'label' => 'Archived',
          'published' => FALSE,
          'default_revision' => TRUE,
          'weight' => 3,
        ],
      ],
      'transitions' => [
        'create_new_draft' => [
          'label' => 'Create New Draft',
          'to' => 'draft',
          'weight' => 0,
          'from' => ['draft', 'needs_review', 'published', 'archived'],
        ],
        'submit_for_review' => [
          'label' => 'Submit for Review',
          'to' => 'needs_review',
          'weight' => 1,
          'from' => ['draft'],
        ],
        'publish' => [
          'label' => 'Publish',
          'to' => 'published',
          'weight' => 2,
          'from' => ['needs_review', 'draft'],
        ],
        'archive' => [
          'label' => 'Archive',
          'to' => 'archived',
          'weight' => 3,
          'from' => ['published'],
        ],
        'restore_draft' => [
          'label' => 'Restore to Draft',
          'to' => 'draft',
          'weight' => 4,
          'from' => ['needs_review'],
        ],
      ],
      'entity_types' => [
        'node' => ['blog_post', 'event', 'page'],
      ],
    ],
  ]);
  $editorial->save();
  echo "Created Editorial Workflow\n";
} else {
  echo "Editorial Workflow already exists\n";
}

// ---------------------------------------------------------------
// 2. Animal Intake Workflow
// ---------------------------------------------------------------
$animal_wf = Workflow::load('animal_intake');
if (!$animal_wf) {
  $animal_wf = Workflow::create([
    'id' => 'animal_intake',
    'label' => 'Animal Intake Workflow',
    'type' => 'content_moderation',
    'type_settings' => [
      'states' => [
        'draft' => [
          'label' => 'Draft',
          'published' => FALSE,
          'default_revision' => FALSE,
          'weight' => -1,
        ],
        'published' => [
          'label' => 'Published',
          'published' => TRUE,
          'default_revision' => TRUE,
          'weight' => -1,
        ],
        'intake' => [
          'label' => 'Intake / Evaluation',
          'published' => FALSE,
          'default_revision' => FALSE,
          'weight' => 0,
        ],
        'in_foster' => [
          'label' => 'In Foster',
          'published' => TRUE,
          'default_revision' => TRUE,
          'weight' => 1,
        ],
        'available' => [
          'label' => 'Available',
          'published' => TRUE,
          'default_revision' => TRUE,
          'weight' => 2,
        ],
        'adoption_pending' => [
          'label' => 'Adoption Pending',
          'published' => TRUE,
          'default_revision' => TRUE,
          'weight' => 3,
        ],
        'adopted' => [
          'label' => 'Adopted',
          'published' => FALSE,
          'default_revision' => TRUE,
          'weight' => 4,
        ],
        'returned' => [
          'label' => 'Returned',
          'published' => FALSE,
          'default_revision' => FALSE,
          'weight' => 5,
        ],
        'deceased' => [
          'label' => 'Deceased',
          'published' => FALSE,
          'default_revision' => TRUE,
          'weight' => 6,
        ],
        'transferred' => [
          'label' => 'Transferred Out',
          'published' => FALSE,
          'default_revision' => TRUE,
          'weight' => 7,
        ],
      ],
      'transitions' => [
        'create_new_draft' => [
          'label' => 'Create New Draft',
          'to' => 'draft',
          'weight' => -2,
          'from' => ['draft'],
        ],
        'publish_direct' => [
          'label' => 'Publish',
          'to' => 'published',
          'weight' => -1,
          'from' => ['draft'],
        ],
        'place_in_foster' => [
          'label' => 'Place in Foster',
          'to' => 'in_foster',
          'weight' => 0,
          'from' => ['intake', 'returned'],
        ],
        'mark_available' => [
          'label' => 'Mark as Available',
          'to' => 'available',
          'weight' => 1,
          'from' => ['intake', 'in_foster', 'returned'],
        ],
        'pending_adoption' => [
          'label' => 'Mark Adoption Pending',
          'to' => 'adoption_pending',
          'weight' => 2,
          'from' => ['available', 'in_foster'],
        ],
        'adopt' => [
          'label' => 'Mark as Adopted',
          'to' => 'adopted',
          'weight' => 3,
          'from' => ['adoption_pending', 'available', 'in_foster'],
        ],
        'return_animal' => [
          'label' => 'Return to Rescue',
          'to' => 'returned',
          'weight' => 4,
          'from' => ['adopted', 'in_foster', 'available', 'adoption_pending'],
        ],
        'mark_deceased' => [
          'label' => 'Mark as Deceased',
          'to' => 'deceased',
          'weight' => 5,
          'from' => ['intake', 'in_foster', 'available', 'adoption_pending'],
        ],
        'transfer_out' => [
          'label' => 'Transfer to Another Rescue',
          'to' => 'transferred',
          'weight' => 6,
          'from' => ['intake', 'in_foster', 'available'],
        ],
        'back_to_intake' => [
          'label' => 'Return to Intake',
          'to' => 'intake',
          'weight' => 7,
          'from' => ['returned'],
        ],
      ],
      'entity_types' => [
        'node' => ['animal'],
      ],
    ],
  ]);
  $animal_wf->save();
  echo "Created Animal Intake Workflow\n";
} else {
  echo "Animal Intake Workflow already exists\n";
}

// ---------------------------------------------------------------
// Grant moderation permissions to appropriate roles
// ---------------------------------------------------------------

// Content editors can create drafts and submit for review
user_role_grant_permissions('content_editor', [
  'use editorial transition create_new_draft',
  'use editorial transition submit_for_review',
  'view any unpublished content',
  'view latest version',
]);

// Rescue staff can do everything in editorial + manage animal states
user_role_grant_permissions('rescue_staff', [
  'use editorial transition create_new_draft',
  'use editorial transition submit_for_review',
  'use editorial transition publish',
  'use editorial transition archive',
  'use editorial transition restore_draft',
  'use animal_intake transition place_in_foster',
  'use animal_intake transition mark_available',
  'use animal_intake transition pending_adoption',
  'use animal_intake transition adopt',
  'use animal_intake transition return_animal',
  'use animal_intake transition mark_deceased',
  'use animal_intake transition transfer_out',
  'use animal_intake transition back_to_intake',
  'view any unpublished content',
  'view latest version',
]);

// Foster coordinators manage animal workflow states
user_role_grant_permissions('foster_coordinator', [
  'use animal_intake transition place_in_foster',
  'use animal_intake transition mark_available',
  'use animal_intake transition pending_adoption',
  'use animal_intake transition adopt',
  'use animal_intake transition return_animal',
  'use animal_intake transition back_to_intake',
  'view latest version',
]);

// Rescue admin gets everything
user_role_grant_permissions('rescue_admin', [
  'use editorial transition create_new_draft',
  'use editorial transition submit_for_review',
  'use editorial transition publish',
  'use editorial transition archive',
  'use editorial transition restore_draft',
  'use animal_intake transition place_in_foster',
  'use animal_intake transition mark_available',
  'use animal_intake transition pending_adoption',
  'use animal_intake transition adopt',
  'use animal_intake transition return_animal',
  'use animal_intake transition mark_deceased',
  'use animal_intake transition transfer_out',
  'use animal_intake transition back_to_intake',
  'view any unpublished content',
  'view latest version',
  'administer workflows',
]);

echo "Workflow permissions granted to all roles.\n";
echo "\nPhase 3 Step 2: Workflows configured successfully.\n";
