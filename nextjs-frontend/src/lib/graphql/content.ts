import { gql } from "@apollo/client";

// Blog Posts
export const BLOG_POST_CARD_FRAGMENT = gql`
  fragment BlogPostCard on NodeBlogPost {
    id
    title
    path
    status
    created {
      time
      timestamp
    }
    changed {
      time
      timestamp
    }
    body {
      summary
      value
      processed
    }
  }
`;

export const GET_BLOG_POSTS = gql`
  ${BLOG_POST_CARD_FRAGMENT}
  query GetBlogPosts($first: Int, $after: Cursor) {
    nodeBlogPosts(first: $first, after: $after) {
      nodes {
        ...BlogPostCard
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

export const GET_BLOG_POST = gql`
  ${BLOG_POST_CARD_FRAGMENT}
  query GetBlogPost($id: ID!) {
    nodeBlogPost(id: $id) {
      ...BlogPostCard
    }
  }
`;

// Events
export const EVENT_CARD_FRAGMENT = gql`
  fragment EventCard on NodeEvent {
    id
    title
    path
    status
    created {
      time
      timestamp
    }
    eventDate {
      time
      timestamp
    }
    eventEndDate {
      time
      timestamp
    }
    eventLocation
    body {
      summary
      value
      processed
    }
  }
`;

export const GET_EVENTS = gql`
  ${EVENT_CARD_FRAGMENT}
  query GetEvents($first: Int, $after: Cursor) {
    nodeEvents(first: $first, after: $after) {
      nodes {
        ...EventCard
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

export const GET_EVENT = gql`
  ${EVENT_CARD_FRAGMENT}
  query GetEvent($id: ID!) {
    nodeEvent(id: $id) {
      ...EventCard
    }
  }
`;

// Donations
export const GET_DONATIONS = gql`
  query GetDonations($first: Int) {
    nodeDonations(first: $first) {
      nodes {
        id
        title
        donationAmount
        donationDate { time timestamp }
        donorName
        donationType
        donationPlatform
        donationNotes { value processed }
        created { time }
      }
    }
  }
`;

export const GET_DONATION = gql`
  query GetDonation($id: ID!) {
    nodeDonation(id: $id) {
      id
      title
      donationAmount
      donationDate { time timestamp }
      donorName
      donationType
      donationPlatform
      donationNotes { value processed }
      created { time }
    }
  }
`;

// Pages
export const GET_PAGE = gql`
  query GetPage($id: ID!) {
    nodePage(id: $id) {
      id
      title
      path
      body {
        value
        processed
      }
    }
  }
`;

// Schema info (for site name etc.)
export const GET_SCHEMA_INFO = gql`
  query GetSchemaInfo {
    info {
      description
      version
    }
  }
`;
