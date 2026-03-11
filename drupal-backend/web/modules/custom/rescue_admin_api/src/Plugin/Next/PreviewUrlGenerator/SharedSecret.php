<?php

namespace Drupal\rescue_admin_api\Plugin\Next\PreviewUrlGenerator;

use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Url;
use Drupal\next\Entity\NextSiteInterface;
use Drupal\next\Plugin\PreviewUrlGeneratorBase;
use Symfony\Component\HttpFoundation\Request;

/**
 * Shared Secret preview URL generator for decoupled Next.js Draft Mode.
 *
 * Generates preview URLs in the format:
 *   /api/preview?secret=TOKEN&type=node.blog_post&id=17
 *
 * The secret is the static PREVIEW_SECRET stored in next_site.preview_secret.
 * This matches the Next.js /api/preview route handler.
 *
 * @PreviewUrlGenerator(
 *   id = "shared_secret",
 *   label = "Shared Secret (Next.js Draft Mode)",
 *   description = "Uses a static shared secret to enable Next.js Draft Mode preview."
 * )
 */
class SharedSecret extends PreviewUrlGeneratorBase {

  /**
   * {@inheritdoc}
   */
  public function generate(NextSiteInterface $next_site, EntityInterface $entity, string $resource_version = NULL): ?Url {
    // Build the entity type ID in the format "node.bundle"
    $entity_type_id = $entity->getEntityTypeId();
    $bundle         = $entity->bundle();
    $type           = $entity_type_id . '.' . $bundle;

    // Use the node ID (nid) as the content identifier
    $id = $entity->id();

    // Get the static shared secret from the next_site config
    $secret = $next_site->getPreviewSecret();

    if (!$secret) {
      return NULL;
    }

    return Url::fromUri($next_site->getPreviewUrl(), [
      'query' => [
        'secret' => $secret,
        'type'   => $type,
        'id'     => $id,
      ],
    ]);
  }

  /**
   * {@inheritdoc}
   *
   * Validates the preview request. Since we use a static secret, validation
   * is handled entirely in Next.js. This method is a no-op here.
   */
  public function validate(Request $request) {
    // Validation is performed in Next.js /api/preview route handler.
    // Nothing to do on the Drupal side.
  }

}
