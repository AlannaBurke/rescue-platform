# Rescue Platform — Drupal Backend

This directory contains the headless Drupal 10 backend for the Rescue Platform. It serves as the content management system and data store for all rescue operations, exposing all data via a GraphQL API powered by [GraphQL Compose](https://drupal.org/project/graphql_compose).

## Requirements

- PHP 8.1 or higher (8.2+ recommended)
- Composer 2.x
- A supported database: MySQL 8.0+, MariaDB 10.6+, or PostgreSQL 14+
- [DDEV](https://ddev.readthedocs.io/) (recommended for local development)

## Quick Start (Local Development with DDEV)

```bash
# 1. Clone the repository
git clone https://github.com/AlannaBurke/rescue-platform.git
cd rescue-platform/drupal-backend

# 2. Start DDEV
ddev start

# 3. Install dependencies
ddev composer install

# 4. Install Drupal
ddev drush site:install standard \
  --account-name=admin \
  --account-pass=admin \
  --site-name="Rescue Platform"

# 5. Import the full configuration
ddev drush config:import --yes

# 6. Run the setup scripts to create content types and taxonomies
ddev drush php:script scripts/create_taxonomies.php
ddev drush php:script scripts/create_content_types.php
ddev drush php:script scripts/enable_graphql_fields.php

# 7. Clear caches
ddev drush cr
```

The GraphQL API will be available at `https://rescue-platform.ddev.site/graphql`.

## Architecture

This backend uses a **headless (decoupled)** architecture:

- **Content Management**: All rescue data (animals, people, medical records, expenses) is managed through the standard Drupal admin interface.
- **GraphQL API**: The [GraphQL Compose](https://drupal.org/project/graphql_compose) module automatically generates a typed GraphQL schema from the Drupal content model.
- **Authentication**: [Simple OAuth](https://drupal.org/project/simple_oauth) provides OAuth 2.0 token-based authentication for protected API operations.
- **Next.js Integration**: The [Next.js for Drupal](https://drupal.org/project/next) module enables Incremental Static Regeneration (ISR) and preview mode for the frontend.

## Installed Modules

| Module | Purpose |
| :--- | :--- |
| `graphql` | Core GraphQL server infrastructure |
| `graphql_compose` | Auto-generates GraphQL schema from content model |
| `graphql_compose_route` | Exposes URL routing in the schema |
| `graphql_compose_menus` | Exposes navigation menus in the schema |
| `simple_oauth` | OAuth 2.0 authentication |
| `next` | Next.js integration (ISR, preview mode) |
| `next_jsonapi` | JSON:API support for Next.js |
| `webform` | Adoption, foster, and volunteer application forms |
| `paragraphs` | Flexible page builder for website content |
| `address` | Structured address fields |
| `admin_toolbar` | Enhanced admin navigation |
| `pathauto` | Automatic URL alias generation |
| `telephone` | Phone number fields |

## Data Model

See [../docs/data-model.md](../docs/data-model.md) for the full content type and field specification.

### Content Types

| Type | Machine Name | Purpose |
| :--- | :--- | :--- |
| Animal | `animal` | Animals in the rescue's care |
| Person | `person` | Fosters, volunteers, adopters, donors |
| Medical Record | `medical_record` | Medical event log for animals |
| Expense | `expense` | Financial expense tracking |
| Blog Post | `blog_post` | News and updates for the website |
| Event | `event` | Fundraisers, adoption events |
| Basic Page | `page` | Static website pages |

### Taxonomy Vocabularies

| Vocabulary | Machine Name | Purpose |
| :--- | :--- | :--- |
| Animal Status | `animal_status` | Available, In Foster, Adopted, etc. |
| Animal Species | `animal_species` | Dog, Cat, Rabbit, etc. |
| Person Role | `person_role` | Foster, Volunteer, Adopter, etc. |
| Medical Type | `medical_type` | Vaccination, Surgery, etc. |
| Expense Category | `expense_category` | Veterinary, Transport, etc. |

## GraphQL API

The GraphQL endpoint is available at `/graphql`. The schema is automatically generated from the content model.

### Example Queries

**Fetch a single animal:**
```graphql
{
  nodeAnimal(id: "1") {
    title
    animalId
    animalBreed
    animalAgeYears
    animalSex
    animalSize
    animalStatus {
      ... on TermAnimalStatus { name }
    }
    animalSpecies {
      ... on TermAnimalSpecy { name }
    }
    goodWithDogs
    goodWithCats
    goodWithKids
    body { value }
  }
}
```

## Configuration Management

All Drupal configuration is exported to `config/sync/` and committed to this repository. This ensures the entire site configuration is version-controlled and reproducible.

To import configuration after pulling changes:
```bash
ddev drush config:import --yes
ddev drush cr
```

To export configuration after making changes in the admin UI:
```bash
ddev drush config:export --yes
```

## Setup Scripts

The `scripts/` directory contains Drush PHP scripts for initial site setup:

| Script | Purpose |
| :--- | :--- |
| `create_taxonomies.php` | Creates all taxonomy vocabularies and default terms |
| `create_content_types.php` | Creates all content types and fields |
| `enable_graphql_fields.php` | Enables all fields in the GraphQL Compose schema |
