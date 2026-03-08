<?php

/**
 * @file
 * Rescue Platform — Pantheon Quicksilver deploy hook.
 *
 * Runs automatically after each code deploy on Pantheon.
 * Executes database updates, imports configuration, and clears caches.
 */

echo "🐾 Rescue Platform — Running deploy tasks...\n\n";

// Run database updates.
echo "→ Running database updates...\n";
passthru('drush updatedb --yes 2>&1');
echo "✓ Database updates complete.\n\n";

// Import configuration from code.
echo "→ Importing configuration...\n";
passthru('drush config:import --yes 2>&1');
echo "✓ Configuration imported.\n\n";

// Rebuild caches.
echo "→ Rebuilding caches...\n";
passthru('drush cache:rebuild 2>&1');
echo "✓ Caches rebuilt.\n\n";

// Deploy entity updates.
echo "→ Applying entity schema updates...\n";
passthru('drush deploy:hook --yes 2>&1');
echo "✓ Entity updates applied.\n\n";

echo "🎉 Deploy complete! Rescue Platform is up to date.\n";
