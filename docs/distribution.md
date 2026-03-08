# Rescue Platform as a Drupal Distribution

This document explains how Rescue Platform is structured as a Drupal distribution and how to use it to build and maintain your own custom version.

---

## What is a Drupal Distribution?

A Drupal distribution is a pre-packaged version of Drupal that includes a specific set of modules, themes, libraries, and a default configuration. It allows you to create a fully-featured website for a specific purpose (like a rescue platform) with a single installation, rather than assembling all the pieces manually.

Rescue Platform is built as a Drupal **installation profile**, which is the core component of a distribution.

## The `rescue_platform` Installation Profile

The heart of the distribution is the `rescue_platform` profile, located in `drupal-backend/web/profiles/rescue_platform`.

### Key Files

| File | Purpose |
| :--- | :--- |
| `rescue_platform.info.yml` | Defines the profile, its dependencies (modules, themes), and metadata. |
| `rescue_platform.install` | Contains `hook_install()` which runs after the base Drupal installation to perform setup tasks like creating default themes, setting configurations, and running updates. |
| `rescue_platform.profile` | Contains `hook_install_tasks()` which adds custom steps to the Drupal installation wizard, such as the "Rescue Information" form. |
| `config/install/` | Contains all the default configuration YAML files (content types, fields, views, workflows, etc.) that are imported during installation. |
| `config/optional/` | Contains configuration for modules that may not be enabled by default but will be imported if they are. |

### How it Works

1.  When you run the Drupal installer and select the "Rescue Platform" profile, Drupal reads `rescue_platform.info.yml`.
2.  It installs Drupal core along with all the modules and themes listed as dependencies.
3.  It imports all the configuration files from `config/install/`, which creates the entire data structure of the platform.
4.  It runs the tasks defined in `rescue_platform.profile`, including our custom form to gather rescue-specific information.
5.  Finally, it executes the `hook_install()` in `rescue_platform.install` to perform final setup tasks.

## The Composer Project Template

To make it easy for anyone to create a new project using the Rescue Platform distribution, we provide a Composer project template.

**Location:** `/composer-template`

This template is what gets used when someone runs:

```bash
composer create-project rescue-platform/project-template my-rescue-site
```

### `composer.json`

The `composer.json` file in this template is the key. It defines:

*   All the `require` dependencies (Drupal core, contrib modules, etc.).
*   The `extra.drupal-scaffold` configuration to place files in the correct directories.
*   The `extra.installer-paths` to ensure modules and themes go into `web/modules/contrib` and `web/themes/contrib`.
*   A `post-create-project-cmd` script that welcomes the user and provides next steps.

## Customizing the Distribution

If you want to extend or modify Rescue Platform for your own needs, follow these steps:

1.  **Clone the main repository:** Start with the full `rescue-platform` codebase.
2.  **Make your changes in the Drupal UI:** Add new fields, create new views, modify content types, etc.
3.  **Export your configuration:** Use Drush to export your changes back to the profile's configuration directory.

    ```bash
    # From the drupal-backend directory
    drush config:export --destination=../web/profiles/rescue_platform/config/install
    ```

4.  **Update the `.info.yml` file:** If you added new contributed modules, be sure to add them to the `dependencies` list in `rescue_platform.info.yml`.
5.  **Commit your changes:** Commit the updated YAML files and `rescue_platform.info.yml` to your forked repository.

By following this workflow, you can create your own customized version of Rescue Platform while still being able to pull in updates from the main project in the future.

## Creating a Pantheon Upstream

To provide the one-click "Deploy to Pantheon" button, the `composer-template` repository needs to be registered as a Pantheon upstream. This is a process for advanced users and is documented in the [Pantheon Custom Upstream documentation](https://docs.pantheon.io/custom-upstreams).

Once the upstream is registered, its UUID is added to the `Deploy to Pantheon` button URL, enabling the one-click deployment experience forking and site creation process for all users.
