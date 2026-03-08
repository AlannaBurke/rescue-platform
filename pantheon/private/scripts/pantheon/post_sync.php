<?php

/**
 * @file
 * Rescue Platform — Pantheon Quicksilver post-sync hook.
 *
 * Runs after database or file sync between Pantheon environments.
 */

echo "🐾 Rescue Platform — Running post-sync tasks...\n\n";

// Sanitize the database if syncing to a non-production environment.
$environment = $_ENV['PANTHEON_ENVIRONMENT'] ?? 'unknown';

if ($environment !== 'live') {
  echo "→ Sanitizing database for non-production environment ({$environment})...\n";
  // Anonymize user email addresses for privacy.
  passthru("drush sql:query \"UPDATE users_field_data SET mail = CONCAT('user', uid, '@example.com') WHERE uid > 1;\" 2>&1");
  passthru("drush sql:query \"UPDATE users_field_data SET name = CONCAT('user', uid) WHERE uid > 1;\" 2>&1");
  echo "✓ Database sanitized.\n\n";
}

// Rebuild caches after sync.
echo "→ Rebuilding caches...\n";
passthru('drush cache:rebuild 2>&1');
echo "✓ Caches rebuilt.\n\n";

echo "✓ Post-sync tasks complete.\n";
