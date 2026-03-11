// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/dashboard-stats
// Returns content counts and form submission counts for the admin dashboard.
// Queries Drupal GraphQL server-side to avoid CORS issues.
// ─────────────────────────────────────────────────────────────────────────────
import { NextResponse } from "next/server";

const DRUPAL_GRAPHQL = process.env.DRUPAL_BASE_URL
  ? `${process.env.DRUPAL_BASE_URL}/graphql`
  : "http://localhost:8888/graphql";

const STATS_QUERY = `{
  animals:      nodeAnimals(first: 100)      { nodes { id } }
  blogPosts:    nodeBlogPosts(first: 100)    { nodes { id } }
  events:       nodeEvents(first: 100)       { nodes { id } }
  resources:    nodeResources(first: 100)    { nodes { id } }
  vets:         nodeVets(first: 100)         { nodes { id } }
  organizations: nodeOrganizations(first: 100) { nodes { id } }
  people:       nodePeople(first: 100)       { nodes { id } }
  expenses:     nodeExpenses(first: 100)     { nodes { id } }
  medicalRecords: nodeMedicalRecords(first: 100) { nodes { id } }
}`;

// Drupal REST endpoint for webform submission counts
const DRUPAL_BASE = process.env.DRUPAL_BASE_URL ?? "http://localhost:8888";

async function getAllFormCounts(auth: string): Promise<Record<string, number>> {
  try {
    const res = await fetch(
      `${DRUPAL_BASE}/api/rescue/submission-counts?_format=json`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          Accept: "application/json",
        },
        cache: "no-store",
      }
    );
    if (!res.ok) return {};
    return await res.json() as Record<string, number>;
  } catch {
    return {};
  }
}

export async function GET() {
  // Build basic auth header for Drupal admin
  const user = process.env.DRUPAL_ADMIN_USER ?? "admin";
  const pass = process.env.DRUPAL_ADMIN_PASS ?? "admin";
  const auth = Buffer.from(`${user}:${pass}`).toString("base64");

  // Fetch content counts via GraphQL
  let content = {
    animal: 0,
    blog_post: 0,
    event: 0,
    resource: 0,
    vet: 0,
    organization: 0,
    person: 0,
    expense: 0,
    medical_record: 0,
  };

  try {
    const res = await fetch(DRUPAL_GRAPHQL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: STATS_QUERY }),
      cache: "no-store",
    });
    const json = await res.json() as {
      data: {
        animals?: { nodes: unknown[] };
        blogPosts?: { nodes: unknown[] };
        events?: { nodes: unknown[] };
        resources?: { nodes: unknown[] };
        vets?: { nodes: unknown[] };
        organizations?: { nodes: unknown[] };
        people?: { nodes: unknown[] };
        expenses?: { nodes: unknown[] };
        medicalRecords?: { nodes: unknown[] };
      };
    };
    const d = json.data ?? {};
    content = {
      animal:         d.animals?.nodes?.length ?? 0,
      blog_post:      d.blogPosts?.nodes?.length ?? 0,
      event:          d.events?.nodes?.length ?? 0,
      resource:       d.resources?.nodes?.length ?? 0,
      vet:            d.vets?.nodes?.length ?? 0,
      organization:   d.organizations?.nodes?.length ?? 0,
      person:         d.people?.nodes?.length ?? 0,
      expense:        d.expenses?.nodes?.length ?? 0,
      medical_record: d.medicalRecords?.nodes?.length ?? 0,
    };
  } catch {
    // Return zeros if GraphQL fails
  }

  // Fetch form submission counts from Drupal API
  const formCounts = await getAllFormCounts(auth);

  return NextResponse.json({
    content,
    forms: {
      adoption_application:  formCounts.adoption_application  ?? 0,
      foster_application:    formCounts.foster_application    ?? 0,
      volunteer_application: formCounts.volunteer_application ?? 0,
      surrender_intake:      formCounts.surrender_intake      ?? 0,
      contact:               formCounts.contact               ?? 0,
    },
  });
}
