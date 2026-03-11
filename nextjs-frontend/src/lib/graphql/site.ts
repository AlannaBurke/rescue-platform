import { gql } from "@apollo/client";

// ── Site Settings (singleton) ──────────────────────────────────────────────
export const GET_SITE_SETTINGS = gql`
  query GetSiteSettings($id: ID!) {
    nodeSiteSetting(id: $id) {
      id
      title
      ... on NodeSiteSetting {
        orgTagline
        orgEmail
        orgPhone
        orgAddress
        orgEin
        socialInstagram
        socialFacebook
        socialTiktok
        socialTwitter
        socialYoutube
        socialThreads
        socialBluesky
        socialPinterest
        navItems
      }
    }
  }
`;

// ── Resources ─────────────────────────────────────────────────────────────
export const RESOURCE_CARD_FRAGMENT = gql`
  fragment ResourceCard on NodeResource {
    id
    title
    path
    status
    created { time timestamp }
    changed { time timestamp }
    resourceCategory
    shareTargets
    tags {
      ... on TermTag {
        id
        name
        path
      }
    }
    resourceImage {
      url
      alt
      width
      height
    }
    body {
      summary
      value
      processed
    }
  }
`;

export const GET_RESOURCES = gql`
  ${RESOURCE_CARD_FRAGMENT}
  query GetResources($first: Int, $after: Cursor) {
    nodeResources(first: $first, after: $after) {
      nodes {
        ...ResourceCard
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

export const GET_RESOURCE = gql`
  ${RESOURCE_CARD_FRAGMENT}
  query GetResource($id: ID!) {
    nodeResource(id: $id) {
      ...ResourceCard
      socialShareImage {
        url
        alt
        width
        height
      }
    }
  }
`;

export const GET_RESOURCES_BY_TAG = gql`
  ${RESOURCE_CARD_FRAGMENT}
  query GetResourcesByTag($first: Int) {
    nodeResources(first: $first) {
      nodes {
        ...ResourceCard
      }
    }
  }
`;

// ── Tags ──────────────────────────────────────────────────────────────────
export const GET_TAGS = gql`
  query GetTags {
    termTags(first: 100) {
      nodes {
        id
        name
        path
      }
    }
  }
`;

// ── Vets ──────────────────────────────────────────────────────────────────
export const VET_CARD_FRAGMENT = gql`
  fragment VetCard on NodeVet {
    id
    title
    path
    status
    vetPracticeName
    vetDoctorNames
    vetSpecialties
    vetPhone
    vetEmergencyPhone
    vetEmail
    vetWebsite { url title }
    vetStreet
    vetCity
    vetState
    vetZip
    vetHours
    vetIsEmergency
    vetIsPreferred
    vetPublicNotes
    vetPhoto {
      url
      alt
      width
      height
    }
    vetSeesExotics
    vetSpecies
    vetRescueDiscount
    vetDiscountDetails
    vetEndorsement
    vetCostRating
    vetStaff {
      ... on ParagraphVetStaff {
        staffName
        staffRole
        staffPhone
        staffEmail
        staffNotes
      }
    }
  }
`;

export const GET_VETS = gql`
  ${VET_CARD_FRAGMENT}
  query GetVets($first: Int) {
    nodeVets(first: $first) {
      nodes {
        ...VetCard
      }
    }
  }
`;

// ── Support / Giving ──────────────────────────────────────────────────────
export const GIVING_FRAGMENT = gql`
  fragment GivingItem on NodeSupportGiving {
    id
    title
    path
    status
    givingType
    givingHandle
    givingUrl { url title }
    givingInstructions
    givingGoal
    givingIsActive
    givingSortWeight
    givingImage {
      url
      alt
      width
      height
    }
    body {
      summary
      value
      processed
    }
  }
`;

export const GET_GIVING = gql`
  ${GIVING_FRAGMENT}
  query GetGiving($first: Int) {
    nodeSupportGivings(first: $first) {
      nodes {
        ...GivingItem
      }
    }
  }
`;

// ── Blog with tags ─────────────────────────────────────────────────────────
export const BLOG_POST_FULL_FRAGMENT = gql`
  fragment BlogPostFull on NodeBlogPost {
    id
    title
    path
    status
    created { time timestamp }
    changed { time timestamp }
    tags {
      ... on TermTag {
        id
        name
        path
      }
    }
    shareTargets
    body {
      summary
      value
      processed
    }
  }
`;

export const GET_BLOG_POSTS_WITH_TAGS = gql`
  ${BLOG_POST_FULL_FRAGMENT}
  query GetBlogPostsWithTags($first: Int, $after: Cursor) {
    nodeBlogPosts(first: $first, after: $after) {
      nodes {
        ...BlogPostFull
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

export const GET_VET = gql`
  ${VET_CARD_FRAGMENT}
  query GetVet($id: ID!) {
    nodeVet(id: $id) {
      ...VetCard
      body { value processed }
      vetProcedures {
        ... on ParagraphVetProcedure {
          procDate { time timestamp }
          procName
          procCost
          procNotes
        }
      }
    }
  }
`;
