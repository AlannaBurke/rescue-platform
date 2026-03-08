# Backend Setup Guide

This guide covers the installation and configuration of the Drupal 11 backend for the Rescue Platform.

## Prerequisites

Before you begin, ensure your environment meets the following requirements:

| Requirement | Version |
| :--- | :--- |
| PHP | 8.3+ |
| Composer | 2.x |
| MySQL / MariaDB | 8.0+ / 10.6+ |
| Drush | 12.x |

## Installation

### 1. Install Drupal via Composer

The recommended way to install Drupal is via Composer. From the `drupal-backend/` directory, run:

```bash
composer create-project drupal/recommended-project . --no-interaction
```

### 2. Install Required Contributed Modules

Install all required contributed modules via Composer:

```bash
composer require \
  drupal/admin_toolbar \
  drupal/address \
  drupal/graphql:^4.8 \
  drupal/graphql_compose:^2.2 \
  drupal/module_filter \
  drupal/next \
  drupal/paragraphs \
  drupal/simple_oauth \
  drupal/typed_data:^1.0@beta \
  drupal/webform
```

### 3. Run the Drupal Installer

Navigate to your site in a browser and follow the standard Drupal installation wizard, or use Drush:

```bash
drush site:install --db-url=mysql://USER:PASS@localhost/DBNAME --account-name=admin --account-pass=YOURPASSWORD
```

### 4. Enable Modules

Enable all required modules via Drush:

```bash
drush pm:enable \
  admin_toolbar \
  admin_toolbar_tools \
  address \
  graphql \
  graphql_compose \
  graphql_compose_routes \
  graphql_compose_menus \
  module_filter \
  next \
  next_jsonapi \
  paragraphs \
  simple_oauth \
  webform \
  webform_ui
```

### 5. Import Configuration

Once the platform's configuration has been exported (Phase 2), import it using:

```bash
drush config:import
```

## Configuration

### GraphQL Compose

After enabling the module, navigate to **Admin > Configuration > GraphQL Compose** to enable the entity types and fields you want to expose in the schema. Enable all content types defined in the [Data Model](./data-model.md).

### Simple OAuth (Authentication)

1. Navigate to **Admin > Configuration > Simple OAuth** and generate encryption keys.
2. Create a new OAuth2 client for the Next.js frontend under **Admin > Configuration > Simple OAuth > Clients**.
3. Note the Client ID and Secret — you will need these when configuring the Next.js frontend.

### Next.js Integration

1. Navigate to **Admin > Configuration > Next.js** and add your Next.js site URL.
2. Configure the preview secret to enable draft/preview mode.

## Local Development

For local development, it is recommended to use [DDEV](https://ddev.readthedocs.io/), which provides a consistent, Docker-based local environment for Drupal.

```bash
# From the drupal-backend/ directory
ddev config --project-type=drupal11 --php-version=8.3
ddev start
ddev composer install
ddev drush site:install
```
