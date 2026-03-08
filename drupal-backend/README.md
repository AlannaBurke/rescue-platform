# Rescue Platform: Drupal Backend

This directory contains the Drupal 11 backend for the Rescue Platform.

## Status

**Phase 1 development in progress.** See the [Development Roadmap](../docs/roadmap.md).

## Overview

The Drupal backend serves as the headless CMS and data management hub for the entire platform. It provides:

- A rich administrative interface for rescue staff to manage animals, people, expenses, and website content.
- A GraphQL API (powered by `graphql_compose`) consumed by the Next.js frontend.
- Secure OAuth2 authentication for frontend interactions.

## Setup

See the [Backend Setup Guide](../docs/backend-setup.md) for full installation and configuration instructions.

## Key Modules

| Module | Purpose |
| :--- | :--- |
| `graphql` | Core GraphQL engine |
| `graphql_compose` | Auto-generates GraphQL schema from content types |
| `simple_oauth` | OAuth2 authentication for the frontend |
| `next` | Next.js / Drupal integration bridge |
| `webform` | Adoption application form |
| `paragraphs` | Flexible page content components |
| `address` | Standardized address field |
| `admin_toolbar` | Improved admin navigation |
