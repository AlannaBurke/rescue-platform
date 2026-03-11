# Rescue Platform

**Every little life matters.** An open-source, mobile-first, headless Drupal + Next.js platform for animal rescues and sanctuaries.

---

## Features

- **Animal Management:** Full lifecycle tracking from intake to adoption, including medical records, foster history, and detailed profiles.
- **People Management:** Centralized database of fosters, adopters, volunteers, donors, and contacts with a "Do Not Adopt" flag.
- **Content Management:** Built-in content types for blog posts, events, resources, and site pages.
- **Configurable Site:** Easily edit navigation, social media handles, and organization info directly in the admin UI.
- **Online Forms:** Webforms for adoption, foster, and surrender applications that submit directly to the Drupal backend.
- **Social Media Publisher:** Post animals, blog posts, and resources to Facebook, Bluesky, Threads, Mastodon, and Instagram with AI-generated, platform-appropriate copy.

## Tech Stack

- **Backend:** Drupal 10 (headless)
- **Frontend:** Next.js 14 (App Router)
- **API:** GraphQL
- **Styling:** Tailwind CSS
- **Local Dev:** Docker

## Documentation

- [**Getting Started**](docs/getting-started.md) — Local development, production hosting, and environment variables.
- [**Content Types**](docs/content-types.md) — A complete reference for all 14 content types and their fields.
- [**Drupal Admin Guide**](docs/admin-guide.md) — An overview of the Drupal admin dashboard.
- [**Theme Customization**](docs/theme-guide.md) — How to change colors, fonts, illustrations, and layout.
- [**Social Publishing**](docs/social-publishing.md) — How to set up and use the social media publisher.

## Local Development

1. **Prerequisites:** Docker, Node.js (v18+), pnpm, Composer
2. **Clone the repo:** `git clone https://github.com/AlannaBurke/rescue-platform.git`
3. **Install dependencies:**
   - `cd rescue-platform/drupal-backend && composer install`
   - `cd ../nextjs-frontend && pnpm install`
4. **Start the services:** `docker compose up -d`
5. **Access the sites:**
   - **Frontend:** http://localhost:3000
   - **Drupal:** http://localhost:8888 (admin/admin)

## Production Hosting

See the [Getting Started](docs/getting-started.md) guide for detailed instructions on deploying to Vercel and Railway.
