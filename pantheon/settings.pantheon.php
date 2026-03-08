<?php

/**
 * @file
 * Rescue Platform — Pantheon-specific Drupal settings.
 *
 * Include this file from your settings.php:
 *   if (file_exists(__DIR__ . '/settings.pantheon.php')) {
 *     include __DIR__ . '/settings.pantheon.php';
 *   }
 *
 * This file handles:
 * - Database connection from Pantheon environment variables
 * - Redis cache backend (if enabled on Pantheon)
 * - File paths for Pantheon's filesystem
 * - Environment-specific configuration splits
 * - Trusted host patterns
 */

// Only apply these settings on Pantheon.
if (!isset($_ENV['PANTHEON_ENVIRONMENT'])) {
  return;
}

// =============================================================================
// DATABASE
// =============================================================================
// Pantheon provides database credentials via environment variables.
if (isset($_ENV['PANTHEON_DATABASE'])) {
  $db = json_decode(base64_decode($_ENV['PANTHEON_DATABASE']), TRUE);
  $databases['default']['default'] = [
    'driver' => 'mysql',
    'database' => $db['name'],
    'username' => $db['username'],
    'password' => $db['password'],
    'host' => $db['host'],
    'port' => $db['port'],
    'prefix' => '',
    'collation' => 'utf8mb4_general_ci',
  ];
}

// =============================================================================
// HASH SALT
// =============================================================================
if (isset($_ENV['DRUPAL_HASH_SALT'])) {
  $settings['hash_salt'] = $_ENV['DRUPAL_HASH_SALT'];
} elseif (isset($_ENV['PANTHEON_SITE'])) {
  // Fall back to a Pantheon-derived hash salt.
  $settings['hash_salt'] = hash('sha256', $_ENV['PANTHEON_SITE']);
}

// =============================================================================
// FILE PATHS
// =============================================================================
$settings['file_public_path'] = 'sites/default/files';
$settings['file_private_path'] = '/srv/bindings/' . $_ENV['PANTHEON_BINDING'] . '/files/private';
$settings['file_temp_path'] = '/tmp';

// =============================================================================
// REDIS CACHE (if enabled on Pantheon)
// =============================================================================
if (isset($_ENV['CACHE_HOST']) && extension_loaded('redis')) {
  $settings['redis.connection']['interface'] = 'PhpRedis';
  $settings['redis.connection']['host'] = $_ENV['CACHE_HOST'];
  $settings['redis.connection']['port'] = $_ENV['CACHE_PORT'] ?? 6379;
  $settings['redis.connection']['password'] = $_ENV['CACHE_PASSWORD'] ?? '';

  $settings['cache']['default'] = 'cache.backend.redis';
  $settings['cache']['bins']['bootstrap'] = 'cache.backend.chainedfast';
  $settings['cache']['bins']['discovery'] = 'cache.backend.chainedfast';
  $settings['cache']['bins']['config'] = 'cache.backend.chainedfast';
}

// =============================================================================
// TRUSTED HOST PATTERNS
// =============================================================================
$pantheon_site_name = $_ENV['PANTHEON_SITE_NAME'] ?? '';
$pantheon_environment = $_ENV['PANTHEON_ENVIRONMENT'] ?? '';

$settings['trusted_host_patterns'] = [
  // Pantheon default domains
  '^.+\.pantheonsite\.io$',
  '^.+\.pantheon\.io$',
  // Allow localhost for Drush commands
  '^localhost$',
];

// Add the live domain if configured.
if (isset($_ENV['RESCUE_PLATFORM_DOMAIN'])) {
  $settings['trusted_host_patterns'][] = '^' . preg_quote($_ENV['RESCUE_PLATFORM_DOMAIN'], '/') . '$';
  $settings['trusted_host_patterns'][] = '^www\.' . preg_quote($_ENV['RESCUE_PLATFORM_DOMAIN'], '/') . '$';
}

// =============================================================================
// ENVIRONMENT-SPECIFIC CONFIGURATION SPLITS
// =============================================================================
// Requires the config_split module.
switch ($pantheon_environment) {
  case 'live':
    $config['config_split.config_split.production']['status'] = TRUE;
    $config['config_split.config_split.development']['status'] = FALSE;
    $config['config_split.config_split.staging']['status'] = FALSE;
    break;

  case 'test':
    $config['config_split.config_split.production']['status'] = FALSE;
    $config['config_split.config_split.development']['status'] = FALSE;
    $config['config_split.config_split.staging']['status'] = TRUE;
    break;

  default:
    // dev and multidev environments
    $config['config_split.config_split.production']['status'] = FALSE;
    $config['config_split.config_split.development']['status'] = TRUE;
    $config['config_split.config_split.staging']['status'] = FALSE;
    // Enable Devel on non-production environments.
    $config['system.logging']['error_level'] = 'verbose';
    break;
}

// =============================================================================
// PERFORMANCE
// =============================================================================
if ($pantheon_environment === 'live') {
  // Enable page caching on production.
  $config['system.performance']['cache']['page']['max_age'] = 900;
  $config['system.performance']['css']['preprocess'] = TRUE;
  $config['system.performance']['js']['preprocess'] = TRUE;
} else {
  // Disable caching on non-production environments.
  $config['system.performance']['cache']['page']['max_age'] = 0;
  $settings['cache']['bins']['render'] = 'cache.backend.null';
  $settings['cache']['bins']['dynamic_page_cache'] = 'cache.backend.null';
  $settings['cache']['bins']['page'] = 'cache.backend.null';
}

// =============================================================================
// CORS (for decoupled Next.js frontend)
// =============================================================================
$settings['cors.config'] = [
  'enabled' => TRUE,
  'allowedHeaders' => ['*'],
  'allowedMethods' => ['GET', 'POST', 'OPTIONS'],
  'allowedOrigins' => [
    'https://*.vercel.app',
    'http://localhost:3000',
  ],
  'exposedHeaders' => FALSE,
  'maxAge' => FALSE,
  'supportsCredentials' => FALSE,
];
