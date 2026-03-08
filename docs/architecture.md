# Architecture Overview

HaltRescue Platform is built on a **fully decoupled** architecture, separating the backend content management system from the public-facing frontend website. This provides significant advantages in performance, flexibility, and developer experience.

## System Components

### Backend: Drupal 11

The backend is a headless **Drupal 11** instance. Its responsibilities are:

- Providing the administrative interface for all rescue staff and volunteers.
- Storing and managing all operational data (animals, people, expenses, etc.).
- Managing all website content (blog posts, pages, events).
- Exposing all data via a secure GraphQL API.

Drupal was chosen for the backend because of its unparalleled content modeling capabilities, its mature and stable open-source ecosystem, its robust access control system, and its proven track record in the nonprofit sector.

### Frontend: Next.js 15

The frontend is a **Next.js 15** application. Its responsibilities are:

- Rendering the public-facing website.
- Fetching data from the Drupal GraphQL API.
- Providing a fast, modern, and accessible user experience for website visitors.

Next.js was chosen for its hybrid rendering capabilities (SSG, SSR, ISR), its excellent developer experience, and its strong performance characteristics.

### API Layer: GraphQL

The two applications communicate exclusively via a **GraphQL API**. The API is generated automatically from the Drupal content model using the `graphql_compose` module, which dramatically reduces the amount of custom code required.

GraphQL was chosen over REST/JSON:API for its efficiency (clients request only the data they need), its strongly typed schema (which reduces integration errors), and its excellent tooling.

## Deployment Architecture

```
[Rescue Staff / Volunteers]
         |
         | (HTTPS)
         v
+-------------------+
|  Drupal Backend   |  <-- PHP Host (Pantheon / Acquia / any PHP host)
|  (Admin UI + API) |
+-------------------+
         |
         | (GraphQL API over HTTPS)
         v
+-------------------+
|  Next.js Frontend |  <-- Vercel (or any Node.js host)
|  (Public Website) |
+-------------------+
         |
         | (HTTPS)
         v
[Website Visitors / Potential Adopters]
```

## Data Flow

1. A rescue staff member logs into the Drupal admin interface and creates or updates an animal record.
2. The Next.js frontend, on the next page request (or via Incremental Static Regeneration), fetches the updated animal data from the Drupal GraphQL API.
3. The updated animal profile is rendered and served to website visitors.

## Security

- The Drupal admin interface is not publicly exposed as a website; it is only accessible to authenticated users.
- The GraphQL API uses OAuth2 tokens (via `simple_oauth`) for authenticated requests, such as submitting adoption applications.
- Public data (animal listings, blog posts) is exposed via the GraphQL API without authentication.
- The Next.js frontend and the Drupal backend are hosted on separate domains, reducing the attack surface.
