# 🐾 Rescue Platform

**A comprehensive, open-source content management and website platform for small animal rescues.**

Rescue Platform is an all-in-one solution designed to help small, volunteer-run animal rescues manage their operations and online presence efficiently. It combines a powerful Drupal backend for data management with a beautiful, fast, and modern Next.js frontend for the public-facing website.

This project was born from the idea that every rescue, regardless of size or technical skill, deserves access to the same high-quality tools as larger organizations. By providing a free, open-source, and easy-to-deploy platform, we aim to empower rescues to save more lives.

[![Deploy to Pantheon](https://www.pantheon.io/assets/images/deploy-to-pantheon.svg)](https://dashboard.pantheon.io/sites/create?upstream_id=YOUR_UPSTREAM_UUID_HERE)

---

## Features

| Feature | Description | Status |
| :--- | :--- | :--- |
| **Animal Management** | Track every animal from intake to adoption with detailed profiles, medical history, and status updates. | ✅ Complete |
| **Foster & Volunteer Hub** | Manage foster parents and volunteers, track their availability, skills, and assignments. | ✅ Complete |
| **Expense & Donation Tracking** | Log expenses with receipt uploads and track incoming donations for financial transparency. | ✅ Complete |
| **Content Moderation** | Robust, permission-based workflows for publishing content, from blog posts to animal profiles. | ✅ Complete |
| **Decoupled Frontend** | A lightning-fast, SEO-friendly, and mobile-responsive public website built with Next.js. | ✅ Complete |
| **GraphQL API** | A comprehensive and flexible API to connect the backend to the frontend and any future applications. | ✅ Complete |
| **One-Click Deployment** | Deploy the entire Drupal backend to Pantheon with a single click. | ✅ Complete |
| **Local Development** | A fully containerized local development environment powered by Docker Compose. | ✅ Complete |

## Getting Started

There are two primary ways to use Rescue Platform:

1.  **Local Development (Recommended for contributors):** Clone this repository and use Docker to spin up the full environment on your local machine.
2.  **Pantheon Deployment (Recommended for rescues):** Use the "Deploy to Pantheon" button to create a free Drupal backend, then connect it to a Vercel-hosted frontend.

### Local Development with Docker

**Prerequisites:**

*   [Docker](https://www.docker.com/get-started) and Docker Compose
*   [Node.js](https://nodejs.org/) (v20+) and [pnpm](https://pnpm.io/)
*   [Composer](https://getcomposer.org/)

**Installation Steps:**

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/AlannaBurke/rescue-platform.git
    cd rescue-platform
    ```

2.  **Set up environment variables:**

    ```bash
    cp .env.example .env
    ```

    *Open the `.env` file and fill in the required values. The defaults are suitable for local development.*

3.  **Start the Docker containers:**

    ```bash
    docker compose up -d
    ```

4.  **Install Drupal:**

    ```bash
    docker compose exec drupal composer install
    docker compose exec drupal ./scripts/install.sh
    ```

5.  **Install Next.js dependencies:**

    ```bash
    cd nextjs-frontend
    pnpm install
    ```

6.  **Run the Next.js dev server:**

    ```bash
    pnpm dev
    ```

Your local environment is now ready!

*   **Drupal Admin:** [http://localhost:8080](http://localhost:8080)
*   **Next.js Frontend:** [http://localhost:3000](http://localhost:3000)
*   **Mailpit (Email Catcher):** [http://localhost:8025](http://localhost:8025)
*   **phpMyAdmin (Database GUI):** [http://localhost:8081](http://localhost:8081) (enable in `docker-compose.yml`)

### Deployment

For detailed instructions on deploying the Drupal backend to Pantheon and the Next.js frontend to Vercel, please see our comprehensive **[Deployment Guide](docs/deployment.md)**.

## Documentation

All project documentation can be found in the `/docs` directory:

| Document | Description |
| :--- | :--- |
| [**`architecture.md`**](docs/architecture.md) | The complete system architecture, data models, and technical decisions. |
| [**`deployment.md`**](docs/deployment.md) | Step-by-step guides for deploying to Pantheon and Vercel. |
| [**`distribution.md`**](docs/distribution.md) | How to use Rescue Platform as a Drupal distribution. |
| [**`contributing.md`**](docs/contributing.md) | Guidelines for contributing to the project. |

## Contributing

We welcome contributions of all kinds! Whether you are a developer, designer, writer, or just passionate about animal rescue, there are many ways to help. Please see our [**Contributing Guide**](docs/contributing.md) to get started.

## License

Rescue Platform is open-source software licensed under the [GPL-2.0-or-later](LICENSE).
