# Rescue Platform: Next.js Frontend

This directory contains the Next.js 15 public-facing website for the Rescue Platform.

## Status

**Phase 3 development has not yet started.** See the [Development Roadmap](../docs/roadmap.md).

## Overview

The Next.js frontend is the public-facing website for the rescue. It consumes data from the Drupal backend via GraphQL and renders a fast, modern, and accessible website for potential adopters and supporters.

## Tech Stack

| Technology | Purpose |
| :--- | :--- |
| Next.js 15 (App Router) | React framework |
| TypeScript | Type-safe JavaScript |
| Tailwind CSS | Utility-first styling |
| `next-drupal` | Drupal integration library |
| GraphQL | API query language |

## Setup

See the [Frontend Setup Guide](../docs/frontend-setup.md) for installation and configuration instructions.

## Key Routes

| Route | Description |
| :--- | :--- |
| `/` | Homepage |
| `/animals` | Animal listings with search and filters |
| `/animals/[slug]` | Individual animal profile |
| `/adopt` | Adoption information and application form |
| `/blog` | Blog post listing |
| `/blog/[slug]` | Individual blog post |
| `/events` | Events listing |
| `/about` | About the rescue |
| `/contact` | Contact page |

## Deployment

Designed for one-click deployment on [Vercel](https://vercel.com). See the [Frontend Setup Guide](../docs/frontend-setup.md#deployment) for instructions.
