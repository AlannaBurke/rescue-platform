<?php

/**
 * @file
 * Rescue Platform — Pantheon Quicksilver clear cache hook.
 */

echo "🐾 Rescue Platform — Clearing caches...\n";
passthru('drush cache:rebuild 2>&1');
echo "✓ Caches cleared.\n";
