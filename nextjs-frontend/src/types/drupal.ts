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

export interface TermAnimalLifecycleStatus {
  __typename: "TermAnimalLifecycleStatus";
  id: string;
  name: string;
}

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
// Paragraph types
// ============================================================

export interface ParagraphLogEntry {
  __typename: "ParagraphLogEntry";
  id: string;
  logDate?: DrupalDateTime;
  logType?: string;
  logDetails?: DrupalText;
}

export interface ParagraphMedicationLog {
  __typename: "ParagraphMedicationLog";
  id: string;
  medName?: string;
  medDosage?: string;
  medFrequency?: string;
  medStartDate?: DrupalDateTime;
  medEndDate?: DrupalDateTime;
  medNotes?: DrupalText;
}

export interface ParagraphPlacement {
  __typename: "ParagraphPlacement";
  id: string;
  placementType?: string;
  placementPerson?: Person;
  placementStartDate?: DrupalDateTime;
  placementEndDate?: DrupalDateTime;
  placementNotes?: DrupalText;
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
  animalSource?: string;
  // Physical
  animalSpecies?: TermAnimalSpecy;
  animalBreed?: string;
  animalSex?: AnimalSex;
  animalSize?: AnimalSize;
  animalColor?: string;
  animalAgeYears?: number;
  animalAgeMonths?: number;
  // Lifecycle & display flags
  animalStatus?: TermAnimalStatus;
  lifecycleStatus?: TermAnimalLifecycleStatus;
  isFeatured?: boolean;
  excludePublic?: boolean;
  // Dates
  intakeDate?: DrupalDateTime;
  adoptionDate?: DrupalDateTime;
  dateOfPassing?: DrupalDateTime;
  // People
  currentFoster?: Person;
  adoptedBy?: Person;
  // Compatibility — arrays of string keys (dogs, cats, kids, rabbits, guinea_pigs, rats, birds, reptiles, small_animals)
  goodWith?: string[] | null;
  notGoodWith?: string[] | null;
  // Content
  body?: DrupalTextSummary;
  animalNotes?: DrupalText;
  // Paragraphs
  historyLog?: ParagraphLogEntry[];
  medicationLog?: ParagraphMedicationLog[];
  placementHistory?: ParagraphPlacement[];
  // Media
  image?: DrupalImage;
  animalPhotos?: DrupalImage[];
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
