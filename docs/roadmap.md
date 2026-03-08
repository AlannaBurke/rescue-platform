# Development Roadmap

This document outlines the phased development plan for the HaltRescue Platform. Each phase builds upon the previous one, ensuring a stable and testable foundation at every step.

## Phase 1: Backend Foundation

**Goal:** Establish a working Drupal 11 backend with the complete data model and a functional GraphQL API.

**Deliverables:**

- Drupal 11 installed with all required contributed modules.
- All content types, fields, and taxonomies defined per the [Data Model](./data-model.md).
- GraphQL Compose configured and exposing the full schema.
- Simple OAuth configured for frontend authentication.
- A working GraphQL playground accessible for development testing.

**Status:** `Not Started`

---

## Phase 2: Backend Logic & Administrative Interface

**Goal:** Build out the administrative experience so rescue staff can effectively manage all data.

**Deliverables:**

- Custom Views for administrative listings of animals, people, and expenses.
- Webform configured for the adoption application with email notifications.
- User roles and permissions configured (e.g., Staff, Volunteer).
- Basic workflow automation (e.g., status updates on foster assignment).

**Status:** `Not Started`

---

## Phase 3: Frontend Scaffolding & API Connection

**Goal:** Initialize the Next.js application and establish a verified, working connection to the Drupal backend.

**Deliverables:**

- Next.js 15 project initialized with TypeScript and Tailwind CSS.
- `next-drupal` library installed and configured.
- Authentication flow implemented.
- A proof-of-concept page that successfully fetches and renders animal data from the GraphQL API.

**Status:** `Not Started`

---

## Phase 4: Frontend Build-Out

**Goal:** Build all public-facing pages and components of the website.

**Deliverables:**

- Animal listings page with search and filtering by species, status, age, and size.
- Individual animal profile pages with full details, photo gallery, and adoption application link.
- Blog listing and individual post pages.
- Events listing page.
- Static pages (About, Contact, How to Help, etc.).
- Adoption application form, integrated with the Drupal Webform module.
- Responsive design across all pages.

**Status:** `Not Started`

---

## Phase 5: Deployment & Distribution

**Goal:** Package the platform for easy deployment by non-technical users and release it publicly.

**Deliverables:**

- Pre-configured Drupal installation profile for one-click deployment.
- "Deploy to Vercel" button for the Next.js frontend.
- Comprehensive user-facing setup and configuration documentation.
- Public GitHub repository with all code, documentation, and a clear contribution guide.

**Status:** `Not Started`

---

## Future Roadmap (Post v1.0)

The following features are planned for future releases after the initial v1.0 launch:

- **Donation Integration:** Integration with Stripe or PayPal for online donations.
- **Volunteer Scheduling:** A calendar-based system for scheduling volunteer shifts and events.
- **Foster Portal:** A dedicated, authenticated portal for foster parents to view their animals and submit updates.
- **Reporting & Analytics:** Dashboards for tracking key metrics like animals intake/adopted, expenses over time, etc.
- **Petfinder / Adopt-a-Pet Integration:** Automatic syncing of available animals to third-party adoption platforms.
- **Email Marketing Integration:** Integration with Mailchimp or a similar platform for newsletters.
- **Mobile App:** A companion mobile app for fosters and volunteers.
