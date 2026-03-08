# Frontend Setup Guide

This guide covers the installation and configuration of the Next.js 15 frontend for the Rescue Platform.

## Prerequisites

| Requirement | Version |
| :--- | :--- |
| Node.js | 20.x+ |
| pnpm | 9.x+ |

## Installation

### 1. Initialize the Next.js Project

From the `nextjs-frontend/` directory:

```bash
pnpm create next-app . --typescript --tailwind --app --src-dir --import-alias "@/*"
```

### 2. Install Dependencies

```bash
pnpm add next-drupal graphql graphql-request
pnpm add -D @types/node
```

### 3. Configure Environment Variables

Create a `.env.local` file in the `nextjs-frontend/` directory with the following variables:

```env
# The base URL of your Drupal backend
NEXT_PUBLIC_DRUPAL_BASE_URL=https://your-drupal-site.com

# OAuth2 credentials from the Drupal Simple OAuth module
DRUPAL_CLIENT_ID=your-client-id
DRUPAL_CLIENT_SECRET=your-client-secret

# A secret string used for preview mode
DRUPAL_PREVIEW_SECRET=your-preview-secret
```

### 4. Configure the `next-drupal` Client

Create a `src/lib/drupal.ts` file:

```typescript
import { DrupalClient } from "next-drupal";

export const drupal = new DrupalClient(
  process.env.NEXT_PUBLIC_DRUPAL_BASE_URL!,
  {
    auth: {
      clientId: process.env.DRUPAL_CLIENT_ID!,
      clientSecret: process.env.DRUPAL_CLIENT_SECRET!,
    },
  }
);
```

### 5. Start the Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

## Key Routes

| Route | Description |
| :--- | :--- |
| `/` | Homepage |
| `/animals` | Animal listings with search and filters |
| `/animals/[slug]` | Individual animal profile page |
| `/adopt` | Adoption information and application form |
| `/blog` | Blog post listing |
| `/blog/[slug]` | Individual blog post |
| `/events` | Events listing |
| `/about` | About the rescue |
| `/contact` | Contact page |

## Deployment

The Next.js frontend is designed to be deployed on [Vercel](https://vercel.com).

### One-Click Deploy

*(A "Deploy to Vercel" button will be added here once the initial frontend build is complete.)*

### Manual Deployment

1. Push your code to a GitHub repository.
2. Create a new project on Vercel and import the repository.
3. Set the root directory to `nextjs-frontend/`.
4. Add all environment variables from your `.env.local` file to the Vercel project settings.
5. Deploy.
