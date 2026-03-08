import { NextRequest, NextResponse } from "next/server";

const DRUPAL_BASE_URL =
  process.env.DRUPAL_BASE_URL || "http://localhost:8888";
const DRUPAL_ADMIN_USER = process.env.DRUPAL_ADMIN_USER || "admin";
const DRUPAL_ADMIN_PASS = process.env.DRUPAL_ADMIN_PASS || "admin";

/**
 * POST /api/submit
 *
 * Proxies webform submissions to Drupal's webform_rest endpoint.
 * Accepts a JSON body with a `webform_id` field plus the form data.
 * Returns { success: true, sid: "..." } on success.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.webform_id) {
      return NextResponse.json(
        { success: false, error: "Missing webform_id" },
        { status: 400 }
      );
    }

    // Build Basic Auth header
    const credentials = Buffer.from(
      `${DRUPAL_ADMIN_USER}:${DRUPAL_ADMIN_PASS}`
    ).toString("base64");

    const drupalResponse = await fetch(
      `${DRUPAL_BASE_URL}/webform_rest/submit?_format=json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${credentials}`,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await drupalResponse.json();

    if (!drupalResponse.ok) {
      console.error("Drupal webform submission error:", data);
      return NextResponse.json(
        {
          success: false,
          error: data.message || "Submission failed",
          details: data,
        },
        { status: drupalResponse.status }
      );
    }

    // Drupal returns { sid: "uuid" } on success
    return NextResponse.json({ success: true, sid: data.sid });
  } catch (error) {
    console.error("Form submission proxy error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
