<?php

namespace Drupal\rescue_admin_api\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Returns webform submission counts for the admin dashboard.
 */
class SubmissionCountsController extends ControllerBase {

  /**
   * Returns JSON with submission counts per webform.
   */
  public function getCounts(): JsonResponse {
    $webform_ids = [
      'adoption_application',
      'foster_application',
      'volunteer_application',
      'surrender_intake',
      'contact',
    ];

    $counts = [];
    $storage = \Drupal::entityTypeManager()->getStorage('webform_submission');

    foreach ($webform_ids as $id) {
      $counts[$id] = (int) $storage->getQuery()
        ->condition('webform_id', $id)
        ->accessCheck(FALSE)
        ->count()
        ->execute();
    }

    $response = new JsonResponse($counts);
    $response->headers->set('Access-Control-Allow-Origin', '*');
    return $response;
  }

}
