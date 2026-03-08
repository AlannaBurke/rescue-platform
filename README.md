# Rescue Platform

An open-source, all-in-one management and website platform for small animal rescues.

## Overview

Rescue Platform is a **decoupled web application** built on **Drupal 11** (backend) and **Next.js 15** (frontend). It provides a unified system for managing every aspect of a small rescue's operations — from animal records and foster placements to volunteer coordination, expense tracking, and a full public-facing website — all powered from a single content hub.

The platform is designed to be deployed and maintained by rescues without dedicated technical staff. The Drupal backend can be launched on any standard PHP host, and the Next.js frontend can be deployed to Vercel with a single click.

## Repository Structure

```
rescue-platform/
├── drupal-backend/         # Headless Drupal 11 backend (Admin UI + GraphQL API)
│   ├── modules/custom/     # Custom Drupal modules
│   └── config/sync/        # Exported Drupal configuration (CMI)
├── nextjs-frontend/        # Next.js 15 public website frontend
│   └── src/                # Application source code
└── docs/                   # Project documentation
```

## Architecture

The platform uses a **fully decoupled** architecture. The Drupal backend and Next.js frontend are completely independent applications that communicate via a **GraphQL API**, generated automatically from the Drupal content model using the [`graphql_compose`](https://www.drupal.org/project/graphql_compose) module.

See [docs/architecture.md](./docs/architecture.md) for a full overview.

## Key Features

| Feature Area | Capabilities |
| :--- | :--- |
| **Animal Management** | Profiles, medical records, photos/video, status tracking, foster history |
| **People Management** | Unified profiles for fosters, volunteers, adopters, and donors |
| **Expense Tracking** | Categorized expense logging, linked to individual animals |
| **Website** | Animal listings, blog, events, static pages, adoption application form |

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Backend CMS** | Drupal 11 (PHP 8.3+) |
| **Database** | MySQL 8.0+ / MariaDB 10.6+ |
| **API** | GraphQL via `graphql_compose` |
| **Authentication** | OAuth2 via `simple_oauth` |
| **Frontend Framework** | Next.js 15 (App Router) |
| **Frontend Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Drupal-Next Bridge** | `next-drupal` library |

## Documentation

- [Architecture Overview](./docs/architecture.md)
- [Data Model](./docs/data-model.md)
- [Backend Setup Guide](./docs/backend-setup.md)
- [Frontend Setup Guide](./docs/frontend-setup.md)
- [Development Roadmap](./docs/roadmap.md)
- [Contributing Guide](./docs/contributing.md)

## Getting Started

See the [Backend Setup Guide](./docs/backend-setup.md) and [Frontend Setup Guide](./docs/frontend-setup.md) for full installation and configuration instructions.

## Contributing

This project welcomes contributions from developers, designers, and animal welfare advocates. Please read the [Contributing Guide](./docs/contributing.md) before submitting a pull request.

## License

This project is licensed under the [GNU General Public License v2.0](./LICENSE).
