<?php

/**
 * Phase 3: Build expense tracking and financial reporting features.
 *
 * Enhancements to the existing Expense content type:
 * 1. Add "Receipt" file field (image/PDF upload)
 * 2. Add "Reimbursement Status" field (pending/approved/paid/denied)
 * 3. Add "Reimbursed To" entity reference (person)
 * 4. Add "Payment Method" field
 * 5. Add "Donation" content type for tracking incoming donations
 * 6. Add "Budget Item" taxonomy for budget categories
 * 7. Add "Fiscal Year" field to expenses
 * 8. Enable Views module and create expense summary views
 */

use Drupal\field\Entity\FieldStorageConfig;
use Drupal\field\Entity\FieldConfig;
use Drupal\taxonomy\Entity\Vocabulary;
use Drupal\taxonomy\Entity\Term;

// ---------------------------------------------------------------
// 1. Add "Receipt" file field to Expense
// ---------------------------------------------------------------
$field_storage = FieldStorageConfig::loadByName('node', 'field_expense_receipt');
if (!$field_storage) {
  $field_storage = FieldStorageConfig::create([
    'field_name' => 'field_expense_receipt',
    'entity_type' => 'node',
    'type' => 'file',
    'cardinality' => 3,
    'settings' => [
      'uri_scheme' => 'private',
      'display_field' => FALSE,
    ],
  ]);
  $field_storage->save();
}
$field = FieldConfig::loadByName('node', 'expense', 'field_expense_receipt');
if (!$field) {
  FieldConfig::create([
    'field_storage' => $field_storage,
    'bundle' => 'expense',
    'label' => 'Receipt / Documentation',
    'required' => FALSE,
    'description' => 'Upload receipt images or PDF documents (max 3 files).',
    'settings' => [
      'file_extensions' => 'jpg jpeg png pdf',
      'max_filesize' => '10 MB',
      'file_directory' => 'receipts/[date:custom:Y-m]',
      'description_field' => TRUE,
    ],
  ])->save();
  echo "Created field: field_expense_receipt on expense\n";
}

// ---------------------------------------------------------------
// 2. Add "Reimbursement Status" field to Expense
// ---------------------------------------------------------------
$field_storage = FieldStorageConfig::loadByName('node', 'field_reimbursement_status');
if (!$field_storage) {
  $field_storage = FieldStorageConfig::create([
    'field_name' => 'field_reimbursement_status',
    'entity_type' => 'node',
    'type' => 'list_string',
    'cardinality' => 1,
    'settings' => [
      'allowed_values' => [
        'not_applicable' => 'Not Applicable (Rescue Paid)',
        'pending' => 'Pending Reimbursement',
        'approved' => 'Approved',
        'paid' => 'Paid / Reimbursed',
        'denied' => 'Denied',
      ],
    ],
  ]);
  $field_storage->save();
}
$field = FieldConfig::loadByName('node', 'expense', 'field_reimbursement_status');
if (!$field) {
  FieldConfig::create([
    'field_storage' => $field_storage,
    'bundle' => 'expense',
    'label' => 'Reimbursement Status',
    'required' => FALSE,
    'default_value' => [['value' => 'not_applicable']],
  ])->save();
  echo "Created field: field_reimbursement_status on expense\n";
}

// ---------------------------------------------------------------
// 3. Add "Reimbursed To" entity reference to Expense
// ---------------------------------------------------------------
$field_storage = FieldStorageConfig::loadByName('node', 'field_reimbursed_to');
if (!$field_storage) {
  $field_storage = FieldStorageConfig::create([
    'field_name' => 'field_reimbursed_to',
    'entity_type' => 'node',
    'type' => 'entity_reference',
    'cardinality' => 1,
    'settings' => ['target_type' => 'node'],
  ]);
  $field_storage->save();
}
$field = FieldConfig::loadByName('node', 'expense', 'field_reimbursed_to');
if (!$field) {
  FieldConfig::create([
    'field_storage' => $field_storage,
    'bundle' => 'expense',
    'label' => 'Reimbursed To (Person)',
    'required' => FALSE,
    'description' => 'The foster or volunteer who paid out of pocket and needs reimbursement.',
    'settings' => [
      'handler' => 'default:node',
      'handler_settings' => [
        'target_bundles' => ['person' => 'person'],
        'sort' => ['field' => 'title', 'direction' => 'ASC'],
        'auto_create' => FALSE,
      ],
    ],
  ])->save();
  echo "Created field: field_reimbursed_to on expense\n";
}

// ---------------------------------------------------------------
// 4. Add "Payment Method" field to Expense
// ---------------------------------------------------------------
$field_storage = FieldStorageConfig::loadByName('node', 'field_payment_method');
if (!$field_storage) {
  $field_storage = FieldStorageConfig::create([
    'field_name' => 'field_payment_method',
    'entity_type' => 'node',
    'type' => 'list_string',
    'cardinality' => 1,
    'settings' => [
      'allowed_values' => [
        'rescue_card' => 'Rescue Debit/Credit Card',
        'rescue_check' => 'Rescue Check',
        'paypal' => 'PayPal',
        'venmo' => 'Venmo',
        'zelle' => 'Zelle',
        'cash' => 'Cash',
        'personal_card' => 'Personal Card (Reimbursable)',
        'donation_in_kind' => 'Donation In Kind',
        'other' => 'Other',
      ],
    ],
  ]);
  $field_storage->save();
}
$field = FieldConfig::loadByName('node', 'expense', 'field_payment_method');
if (!$field) {
  FieldConfig::create([
    'field_storage' => $field_storage,
    'bundle' => 'expense',
    'label' => 'Payment Method',
    'required' => FALSE,
  ])->save();
  echo "Created field: field_payment_method on expense\n";
}

// ---------------------------------------------------------------
// 5. Add "Fiscal Year" field to Expense
// ---------------------------------------------------------------
$field_storage = FieldStorageConfig::loadByName('node', 'field_fiscal_year');
if (!$field_storage) {
  $field_storage = FieldStorageConfig::create([
    'field_name' => 'field_fiscal_year',
    'entity_type' => 'node',
    'type' => 'integer',
    'cardinality' => 1,
    'settings' => ['unsigned' => TRUE, 'size' => 'normal'],
  ]);
  $field_storage->save();
}
$field = FieldConfig::loadByName('node', 'expense', 'field_fiscal_year');
if (!$field) {
  FieldConfig::create([
    'field_storage' => $field_storage,
    'bundle' => 'expense',
    'label' => 'Fiscal Year',
    'required' => FALSE,
    'description' => 'The fiscal year this expense belongs to (e.g., 2025). Auto-populated from expense date.',
    'default_value' => [['value' => (int) date('Y')]],
  ])->save();
  echo "Created field: field_fiscal_year on expense\n";
}

// ---------------------------------------------------------------
// 6. Add "Vendor / Payee" field to Expense
// ---------------------------------------------------------------
$field_storage = FieldStorageConfig::loadByName('node', 'field_vendor');
if (!$field_storage) {
  $field_storage = FieldStorageConfig::create([
    'field_name' => 'field_vendor',
    'entity_type' => 'node',
    'type' => 'string',
    'cardinality' => 1,
    'settings' => ['max_length' => 255],
  ]);
  $field_storage->save();
}
$field = FieldConfig::loadByName('node', 'expense', 'field_vendor');
if (!$field) {
  FieldConfig::create([
    'field_storage' => $field_storage,
    'bundle' => 'expense',
    'label' => 'Vendor / Payee',
    'required' => FALSE,
    'description' => 'Name of the store, clinic, or service provider.',
  ])->save();
  echo "Created field: field_vendor on expense\n";
}

// ---------------------------------------------------------------
// 7. Create "Donation" content type
// ---------------------------------------------------------------
$node_type = \Drupal\node\Entity\NodeType::load('donation');
if (!$node_type) {
  \Drupal\node\Entity\NodeType::create([
    'type' => 'donation',
    'name' => 'Donation',
    'description' => 'Tracks incoming donations to the rescue.',
    'help' => '',
    'new_revision' => TRUE,
    'preview_mode' => 1,
    'display_submitted' => FALSE,
  ])->save();
  echo "Created content type: Donation\n";
} else {
  echo "Donation content type already exists\n";
}

// Donation: amount
$field_storage = FieldStorageConfig::loadByName('node', 'field_donation_amount');
if (!$field_storage) {
  $field_storage = FieldStorageConfig::create([
    'field_name' => 'field_donation_amount',
    'entity_type' => 'node',
    'type' => 'decimal',
    'cardinality' => 1,
    'settings' => ['precision' => 10, 'scale' => 2],
  ]);
  $field_storage->save();
}
$field = FieldConfig::loadByName('node', 'donation', 'field_donation_amount');
if (!$field) {
  FieldConfig::create([
    'field_storage' => $field_storage,
    'bundle' => 'donation',
    'label' => 'Amount',
    'required' => TRUE,
  ])->save();
  echo "Created field: field_donation_amount on donation\n";
}

// Donation: date
$field_storage = FieldStorageConfig::loadByName('node', 'field_donation_date');
if (!$field_storage) {
  $field_storage = FieldStorageConfig::create([
    'field_name' => 'field_donation_date',
    'entity_type' => 'node',
    'type' => 'datetime',
    'cardinality' => 1,
    'settings' => ['datetime_type' => 'date'],
  ]);
  $field_storage->save();
}
$field = FieldConfig::loadByName('node', 'donation', 'field_donation_date');
if (!$field) {
  FieldConfig::create([
    'field_storage' => $field_storage,
    'bundle' => 'donation',
    'label' => 'Donation Date',
    'required' => TRUE,
  ])->save();
  echo "Created field: field_donation_date on donation\n";
}

// Donation: donor name
$field_storage = FieldStorageConfig::loadByName('node', 'field_donor_name');
if (!$field_storage) {
  $field_storage = FieldStorageConfig::create([
    'field_name' => 'field_donor_name',
    'entity_type' => 'node',
    'type' => 'string',
    'cardinality' => 1,
    'settings' => ['max_length' => 255],
  ]);
  $field_storage->save();
}
$field = FieldConfig::loadByName('node', 'donation', 'field_donor_name');
if (!$field) {
  FieldConfig::create([
    'field_storage' => $field_storage,
    'bundle' => 'donation',
    'label' => 'Donor Name',
    'required' => FALSE,
    'description' => 'Leave blank for anonymous donations.',
  ])->save();
  echo "Created field: field_donor_name on donation\n";
}

// Donation: type
$field_storage = FieldStorageConfig::loadByName('node', 'field_donation_type');
if (!$field_storage) {
  $field_storage = FieldStorageConfig::create([
    'field_name' => 'field_donation_type',
    'entity_type' => 'node',
    'type' => 'list_string',
    'cardinality' => 1,
    'settings' => [
      'allowed_values' => [
        'monetary' => 'Monetary',
        'in_kind' => 'In-Kind (Supplies/Food)',
        'medical' => 'Medical Services (Donated)',
        'transport' => 'Transport Services',
        'event_sponsorship' => 'Event Sponsorship',
        'grant' => 'Grant',
        'bequest' => 'Bequest / Estate',
      ],
    ],
  ]);
  $field_storage->save();
}
$field = FieldConfig::loadByName('node', 'donation', 'field_donation_type');
if (!$field) {
  FieldConfig::create([
    'field_storage' => $field_storage,
    'bundle' => 'donation',
    'label' => 'Donation Type',
    'required' => TRUE,
    'default_value' => [['value' => 'monetary']],
  ])->save();
  echo "Created field: field_donation_type on donation\n";
}

// Donation: platform/source
$field_storage = FieldStorageConfig::loadByName('node', 'field_donation_platform');
if (!$field_storage) {
  $field_storage = FieldStorageConfig::create([
    'field_name' => 'field_donation_platform',
    'entity_type' => 'node',
    'type' => 'list_string',
    'cardinality' => 1,
    'settings' => [
      'allowed_values' => [
        'paypal' => 'PayPal',
        'venmo' => 'Venmo',
        'check' => 'Check',
        'cash' => 'Cash',
        'facebook' => 'Facebook Fundraiser',
        'givebutter' => 'GiveButter',
        'donorbox' => 'DonorBox',
        'amazon_wishlist' => 'Amazon Wishlist',
        'chewy' => 'Chewy Wishlist',
        'other' => 'Other',
      ],
    ],
  ]);
  $field_storage->save();
}
$field = FieldConfig::loadByName('node', 'donation', 'field_donation_platform');
if (!$field) {
  FieldConfig::create([
    'field_storage' => $field_storage,
    'bundle' => 'donation',
    'label' => 'Platform / Source',
    'required' => FALSE,
  ])->save();
  echo "Created field: field_donation_platform on donation\n";
}

// Donation: linked animal (optional - for memorial/tribute donations)
$field_storage = FieldStorageConfig::loadByName('node', 'field_donation_for_animal');
if (!$field_storage) {
  $field_storage = FieldStorageConfig::create([
    'field_name' => 'field_donation_for_animal',
    'entity_type' => 'node',
    'type' => 'entity_reference',
    'cardinality' => 1,
    'settings' => ['target_type' => 'node'],
  ]);
  $field_storage->save();
}
$field = FieldConfig::loadByName('node', 'donation', 'field_donation_for_animal');
if (!$field) {
  FieldConfig::create([
    'field_storage' => $field_storage,
    'bundle' => 'donation',
    'label' => 'Designated For Animal',
    'required' => FALSE,
    'description' => 'If this donation is designated for a specific animal (e.g., memorial donation).',
    'settings' => [
      'handler' => 'default:node',
      'handler_settings' => [
        'target_bundles' => ['animal' => 'animal'],
        'sort' => ['field' => 'title', 'direction' => 'ASC'],
        'auto_create' => FALSE,
      ],
    ],
  ])->save();
  echo "Created field: field_donation_for_animal on donation\n";
}

// Donation: notes
$field_storage = FieldStorageConfig::loadByName('node', 'field_donation_notes');
if (!$field_storage) {
  $field_storage = FieldStorageConfig::create([
    'field_name' => 'field_donation_notes',
    'entity_type' => 'node',
    'type' => 'text_long',
    'cardinality' => 1,
  ]);
  $field_storage->save();
}
$field = FieldConfig::loadByName('node', 'donation', 'field_donation_notes');
if (!$field) {
  FieldConfig::create([
    'field_storage' => $field_storage,
    'bundle' => 'donation',
    'label' => 'Notes',
    'required' => FALSE,
  ])->save();
  echo "Created field: field_donation_notes on donation\n";
}

// ---------------------------------------------------------------
// 8. Grant donation management permissions
// ---------------------------------------------------------------
user_role_grant_permissions('rescue_admin', [
  'create donation content',
  'edit own donation content',
  'edit any donation content',
  'delete own donation content',
  'delete any donation content',
]);
user_role_grant_permissions('rescue_staff', [
  'create donation content',
  'edit own donation content',
  'edit any donation content',
  'delete own donation content',
]);
echo "Donation permissions granted.\n";

echo "\nPhase 3 Step 4: Expense tracking and donation features created successfully.\n";
