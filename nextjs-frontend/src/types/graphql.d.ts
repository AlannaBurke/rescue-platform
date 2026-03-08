// Type augmentation for Apollo GraphQL query results.
// Since we are not running graphql-codegen against a live schema at build time,
// we declare the query result shapes manually here.

import type { Animal, BlogPost, Event, BasicPage, Person, MedicalRecord, Expense } from "./drupal";

export interface GetAnimalQuery {
  nodeAnimal: Animal | null;
}

export interface GetAnimalsListQuery {
  nodeAnimals: {
    nodes: Animal[];
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string;
      endCursor?: string;
    };
  };
}

export interface GetBlogPostsQuery {
  nodeBlogPosts: {
    nodes: BlogPost[];
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string;
      endCursor?: string;
    };
  };
}

export interface GetBlogPostQuery {
  nodeBlogPost: BlogPost | null;
}

export interface GetEventsQuery {
  nodeEvents: {
    nodes: Event[];
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string;
      endCursor?: string;
    };
  };
}

export interface GetEventQuery {
  nodeEvent: Event | null;
}

export interface GetPageQuery {
  nodePage: BasicPage | null;
}
