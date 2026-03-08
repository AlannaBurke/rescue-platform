# Rescue Platform Deployment Guide

This guide provides step-by-step instructions for deploying the Rescue Platform to a production environment. The recommended setup uses **Pantheon** for the Drupal backend and **Vercel** for the Next.js frontend. This combination offers a robust, scalable, and cost-effective solution for small rescues.

---

## Table of Contents

1.  [Prerequisites](#prerequisites)
2.  [Part 1: Deploying the Drupal Backend to Pantheon](#part-1-deploying-the-drupal-backend-to-pantheon)
    *   [Step 1.1: Create a Pantheon Account](#step-11-create-a-pantheon-account)
    *   [Step 1.2: Create a New Site from the Rescue Platform Upstream](#step-12-create-a-new-site-from-the-rescue-platform-upstream)
    *   [Step 1.3: Run the Drupal Installer](#step-13-run-the-drupal-installer)
    *   [Step 1.4: Configure Your Domain](#step-14-configure-your-domain)
3.  [Part 2: Deploying the Next.js Frontend to Vercel](#part-2-deploying-the-nextjs-frontend-to-vercel)
    *   [Step 2.1: Create a Vercel Account](#step-21-create-a-vercel-account)
    *   [Step 2.2: Fork the Rescue Platform Repository](#step-22-fork-the-rescue-platform-repository)
    *   [Step 2.3: Create a New Vercel Project](#step-23-create-a-new-vercel-project)
    *   [Step 2.4: Configure Environment Variables](#step-24-configure-environment-variables)
    *   [Step 2.5: Deploy and Configure Your Domain](#step-25-deploy-and-configure-your-domain)
4.  [Post-Deployment Checklist](#post-deployment-checklist)

---

## Prerequisites

Before you begin, you will need:

*   A **GitHub account**. [Sign up for free](https://github.com/join).
*   A **domain name** for your rescue's website (e.g., `myrescue.org`).

## Part 1: Deploying the Drupal Backend to Pantheon

Pantheon is a high-performance hosting platform for Drupal and WordPress. Their free tier is generous and perfect for small rescues.

### Step 1.1: Create a Pantheon Account

If you don't already have one, [sign up for a free Pantheon account](https://pantheon.io/register).

### Step 1.2: Create a New Site from the Rescue Platform Upstream

Click the button below to automatically create a new Pantheon site using the official Rescue Platform upstream repository. This pre-configures your Drupal backend with all the necessary modules and settings.

[![Deploy to Pantheon](https://www.pantheon.io/assets/images/deploy-to-pantheon.svg)](https://dashboard.pantheon.io/sites/create?upstream_id=YOUR_UPSTREAM_UUID_HERE)

*   Name your site (e.g., `my-rescue-cms`).
*   Choose a region closest to you.
*   Wait for Pantheon to finish setting up your site.

### Step 1.3: Run the Drupal Installer

1.  Once your site is created, click the **"Visit Development Site"** button on your Pantheon dashboard.
2.  You will be taken to the Drupal installation screen, branded for Rescue Platform.
3.  Follow the on-screen instructions:
    *   Select your language.
    *   Verify the requirements (Pantheon handles this for you).
    *   Wait for the installation to complete.
    *   On the **"Configure site"** screen, enter your rescue's name, your admin account details, and your server settings.
    *   On the **"Your Rescue Information"** screen, enter the details about your rescue.
4.  After the final step, you will be logged into your new Drupal backend. Congratulations!

### Step 1.4: Configure Your Domain

1.  In your Pantheon dashboard, go to the **Live** environment.
2.  Navigate to the **Domains / HTTPS** section.
3.  Follow Pantheon's instructions to add your custom domain (e.g., `cms.myrescue.org`) and provision a free SSL certificate.

Your Drupal backend is now live! Make a note of your live domain URL, as you will need it for the frontend setup.

## Part 2: Deploying the Next.js Frontend to Vercel

Vercel is the creator of Next.js and provides a seamless, free hosting experience for frontend applications.

### Step 2.1: Create a Vercel Account

[Sign up for a free Vercel account](https://vercel.com/signup) using your GitHub account.

### Step 2.2: Fork the Rescue Platform Repository

To deploy to Vercel, you need your own copy of the Rescue Platform code. [Fork the official repository](https://github.com/AlannaBurke/rescue-platform/fork) to your GitHub account.

### Step 2.3: Create a New Vercel Project

1.  From your Vercel dashboard, click **"Add New..."** -> **"Project"**.
2.  Select the `rescue-platform` repository you just forked.
3.  Vercel will automatically detect that it is a Next.js project.

### Step 2.4: Configure Environment Variables

In the **"Environment Variables"** section, you need to tell your frontend where to find your Drupal backend. Add the following variable:

| Name | Value |
| :--- | :--- |
| `NEXT_PUBLIC_DRUPAL_BASE_URL` | The full URL of your live Pantheon site (e.g., `https://cms.myrescue.org`) |

### Step 2.5: Deploy and Configure Your Domain

1.  Click the **"Deploy"** button.
2.  Vercel will build and deploy your Next.js frontend. This may take a few minutes.
3.  Once complete, navigate to the **"Domains"** section in your new Vercel project.
4.  Add your primary domain (e.g., `myrescue.org`) and follow the instructions to update your DNS records.

## Post-Deployment Checklist

Your Rescue Platform is now live! Here are a few final steps to take:

*   [ ] **Log into your Drupal admin** and start adding content: create your first animal, blog post, and event.
*   [ ] **Explore your live website** to see the content appear instantly.
*   [ ] **Review the user roles** and invite your team members.
*   [ ] **Read the full documentation** in the `/docs` directory to understand all the features at your disposal.

Congratulations on launching your new rescue platform!
