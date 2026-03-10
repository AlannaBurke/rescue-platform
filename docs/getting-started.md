# Getting Started & Hosting

This guide will walk you through setting up the Rescue Platform for both local development and production hosting.

## Local Development

Our local development environment uses Docker to provide a consistent and easy-to-manage setup. It includes:

- A Drupal 10 backend
- A Next.js 14 frontend
- A MySQL 8 database
- Mailpit for catching and viewing emails

### Prerequisites

- [Docker](https://www.docker.com/get-started) and Docker Compose
- [Node.js](https://nodejs.org/) (v20+) and [pnpm](https://pnpm.io/)
- [Composer](https://getcomposer.org/)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/AlannaBurke/rescue-platform.git
    cd rescue-platform
    ```

2.  **Start the Docker containers:**

    ```bash
    docker compose up -d
    ```

3.  **Install Drupal dependencies:**

    ```bash
    docker compose exec drupal composer install
    ```

4.  **Install Next.js dependencies:**

    ```bash
    cd nextjs-frontend
    pnpm install
    ```

5.  **Run the Next.js dev server:**

    ```bash
    pnpm dev
    ```

Your local environment is now ready!

- **Drupal Admin:** [http://localhost:8888](http://localhost:8888)
- **Next.js Frontend:** [http://localhost:3000](http://localhost:3000)
- **Mailpit (Email Catcher):** [http://localhost:8025](http://localhost:8025)

## Production Hosting

We recommend the following setup for production:

- **Drupal Backend:** A service like Railway, Render, or a traditional VPS (DigitalOcean, Linode).
- **Next.js Frontend:** Vercel, which is optimized for Next.js and offers a generous free tier.

### Drupal Deployment

1.  **Choose a hosting provider** that supports PHP and MySQL.
2.  **Create a new project** and a MySQL database service.
3.  **Set the following environment variables** in your hosting provider's dashboard:

    | Variable | Description |
    | :--- | :--- |
    | `DRUPAL_DB_HOST` | Your database host |
    | `DRUPAL_DB_NAME` | Your database name |
    | `DRUPAL_DB_USER` | Your database user |
    | `DRUPAL_DB_PASS` | Your database password |
    | `DRUPAL_HASH_SALT` | A unique, random string for security |

4.  **Deploy the `drupal` directory** to your hosting provider. Most platforms will automatically detect the `composer.json` and install dependencies.
5.  **Run the Drupal installer.** You can do this by visiting your new Drupal site's URL and following the on-screen instructions.

### Next.js Deployment

1.  **Create a new project on Vercel** and connect it to your GitHub repository.
2.  **Set the following environment variables** in your Vercel project settings:

    | Variable | Description |
    | :--- | :--- |
    | `NEXT_PUBLIC_DRUPAL_BASE_URL` | The public URL of your Drupal backend |

3.  **Deploy!** Vercel will automatically build and deploy your Next.js frontend.
