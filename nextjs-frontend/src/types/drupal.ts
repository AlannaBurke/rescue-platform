// ============================================================
// Core shared types
// ============================================================

export interface DrupalImage {
  url: string;
  alt: string;
  width: number;
  height: number;
}

export interface DrupalText {
  value: string;
  processed?: string;
  format?: string;
}

export interface DrupalTextSummary extends DrupalText {
  summary?: string;
}

export interface DrupalDateTime {
  time: string;      // RFC 3339 date string (use this for display)
  timestamp: number; // Unix milliseconds
  timezone?: string;
  offset?: string;
}

// ============================================================
// Taxonomy terms
// ============================================================

export interface TermAnimalStatus {
  __typename: "TermAnimalStatus";
  id: string;
  name: string;
}

export interface TermAnimalSpecy {
  __typename: "TermAnimalSpecy";
  id: string;
  name: string;
}

export interface TermPersonRole {
  __typename: "TermPersonRole";
  id: string;
  name: string;
}

export interface TermMedicalType {
  __typename: "TermMedicalType";
  id: string;
  name: string;
}

export interface TermExpenseCategory {
  __typename: "TermExpenseCategory";
  id: string;
  name: string;
}

// ============================================================
// Animal
// ============================================================

export type AnimalSex = "male" | "female" | "unknown";
export type AnimalSize = "extra_small" | "small" | "medium" | "large" | "extra_large";

export interface Animal {
  id: string;
  title: string;
  path: string;
  status: boolean;
  created: DrupalDateTime;
  changed: DrupalDateTime;
  // Identification
  animalId?: string;
  microchip?: string;
  // Physical
  animalSpecies?: TermAnimalSpecy;
  animalBreed?: string;
  animalSex?: AnimalSex;
  animalSize?: AnimalSize;
  animalColor?: string;
  animalAgeYears?: number;
  animalAgeMonths?: number;
  // Status & placement
  animalStatus?: TermAnimalStatus;
  currentFoster?: Person;
  intakeDate?: DrupalDateTime;
  adoptionDate?: DrupalDateTime;
  // Compatibility
  goodWithDogs?: boolean;
  goodWithCats?: boolean;
  goodWithKids?: boolean;
  // Content
  body?: DrupalTextSummary;
  animalNotes?: DrupalText;
  // Media
  image?: DrupalImage;
}

// ============================================================
// Person (Foster, Volunteer, Adopter, Donor)
// ============================================================

export interface Person {
  id: string;
  title: string;
  path: string;
  status: boolean;
  created: DrupalDateTime;
  // Contact
  personEmail?: string;
  personPhone?: string;
  // Role & availability
  personRoles?: TermPersonRole[];
  personAvailability?: string;
  personSkills?: string;
  personActiveSince?: DrupalDateTime;
  // Content
  body?: DrupalTextSummary;
}

// ============================================================
// Medical Record
// ============================================================

export interface MedicalRecord {
  id: string;
  title: string;
  path: string;
  status: boolean;
  created: DrupalDateTime;
  medicalAnimal?: Animal;
  medicalType?: TermMedicalType;
  medicalDate?: DrupalDateTime;
  medicalNextDue?: DrupalDateTime;
  medicalProvider?: string;
  medicalCost?: number;
  body?: DrupalTextSummary;
}

// ============================================================
// Expense
// ============================================================

export interface Expense {
  id: string;
  title: string;
  path: string;
  status: boolean;
  created: DrupalDateTime;
  expenseCategory?: TermExpenseCategory;
  expenseAmount?: number;
  expenseDate?: DrupalDateTime;
  expenseAnimal?: Animal;
  body?: DrupalTextSummary;
}

// ============================================================
// Blog Post
// ============================================================

export interface BlogPost {
  id: string;
  title: string;
  path: string;
  status: boolean;
  created: DrupalDateTime;
  changed: DrupalDateTime;
  body?: DrupalTextSummary;
  image?: DrupalImage;
}

// ============================================================
// Event
// ============================================================

export interface Event {
  id: string;
  title: string;
  path: string;
  status: boolean;
  created: DrupalDateTime;
  eventDate?: DrupalDateTime;
  eventEndDate?: DrupalDateTime;
  eventLocation?: string;
  body?: DrupalTextSummary;
  image?: DrupalImage;
}

// ============================================================
// Basic Page
// ============================================================

export interface BasicPage {
  id: string;
  title: string;
  path: string;
  status: boolean;
  body?: DrupalTextSummary;
}

// ============================================================
// GraphQL response wrappers
// ============================================================

export interface NodeConnection<T> {
  nodes: T[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
}
