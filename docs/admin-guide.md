# Drupal Admin Guide

This guide provides an overview of key administrative areas in the Drupal backend, helping you manage your rescue's data and website content effectively.

## Accessing the Admin Dashboard

To access the Drupal admin dashboard, navigate to `http://your-drupal-site.com/admin`. If you are using the local development environment, the URL is `http://localhost:8888/admin`.

## Key Admin Sections

### Content

The **Content** section (`/admin/content`) is where you will manage all of your site's content, including animals, blog posts, events, and more. You can filter by content type, status, and other criteria to quickly find what you're looking for.

### Structure

The **Structure** section (`/admin/structure`) is where you can modify the underlying architecture of your site.

#### Content Types

Here you can manage the fields and settings for each content type. For a detailed reference of all content types and their fields, see the [Content Types](content-types.md) documentation.

#### Menus

The main navigation menu is managed here. You can add, remove, and reorder menu items. The header navigation on the public-facing website is powered by the "Main navigation" menu.

#### Taxonomy

Taxonomies are used for categorizing content. The Rescue Platform uses taxonomies for things like animal species, blog post tags, and expense categories. You can add new terms to these vocabularies as needed.

#### Views

Views are used to create lists of content, such as the list of adoptable animals or the blog post archive. While the Rescue Platform comes with pre-configured views, you can customize them or create new ones to display content in different ways.

### Webforms

All online forms (adoption, foster, surrender, etc.) are managed as webforms. You can view submissions, edit form fields, and configure form settings in the **Webforms** section (`/admin/structure/webform`).

### Site Settings

Global site settings, such as your organization's name, social media handles, and navigation items, are managed in a special "Site Settings" content item. To edit these, go to the **Content** section, filter by the "Site Settings" content type, and edit the single entry.


---

## Social Media Publisher

The platform includes a powerful social media publisher that lets you post content directly to Facebook, Bluesky, Threads, Mastodon, and Instagram.

1. **Navigate to `/admin/social-publish`** on your site.
2. **Choose Content:** Select an animal, blog post, or resource from the left panel.
3. **Select Platforms:** Toggle which social networks you want to post to.
4. **Generate Copy:** Click the "Generate Copy" button. The AI will write platform-appropriate copy for each selected network.
5. **Review & Edit:** You can edit the generated text in each platform's text box.
6. **Publish:** Click "Publish Now" to post to all selected platforms simultaneously.

For a full guide on setting up the credentials for each platform, see the [Social Publishing Guide](social-publishing.md).
