import { gql } from "@apollo/client";

// ── Core animal card fragment (used on listing pages) ──
export const ANIMAL_CARD_FRAGMENT = gql`
  fragment AnimalCard on NodeAnimal {
    id
    title
    path
    status
    animalId
    animalBreed
    animalSex
    animalSize
    animalColor
    animalAgeYears
    animalAgeMonths
    goodWithDogs
    goodWithCats
    goodWithKids
    isFeatured
    excludePublic
    intakeDate {
      time
    }
    animalStatus {
      ... on TermAnimalStatus {
        id
        name
      }
    }
    lifecycleStatus {
      ... on TermAnimalLifecycleStatus {
        id
        name
      }
    }
    animalSpecies {
      ... on TermAnimalSpecy {
        id
        name
      }
    }
    body {
      summary
      value
    }
  }
`;

// ── Full animal detail fragment (used on the animal profile page) ──
export const ANIMAL_DETAIL_FRAGMENT = gql`
  fragment AnimalDetail on NodeAnimal {
    ...AnimalCard
    microchip
    animalSource
    adoptionDate {
      time
    }
    dateOfPassing {
      time
    }
    animalNotes {
      value
    }
    currentFoster {
      ... on NodePerson {
        id
        title
      }
    }
    adoptedBy {
      ... on NodePerson {
        id
        title
      }
    }
    historyLog {
      ... on ParagraphLogEntry {
        id
        logDate {
          time
        }
        logType
        logDetails {
          value
        }
      }
    }
    medicationLog {
      ... on ParagraphMedicationLog {
        id
        medName
        medDosage
        medFrequency
        medStartDate {
          time
        }
        medEndDate {
          time
        }
        medNotes {
          value
        }
      }
    }
    placementHistory {
      ... on ParagraphPlacement {
        id
        placementType
        placementStartDate {
          time
        }
        placementEndDate {
          time
        }
        placementNotes {
          value
        }
        placementPerson {
          ... on NodePerson {
            id
            title
          }
        }
      }
    }
  }
`;

// ── Query: single animal by ID (full detail) ──
export const GET_ANIMAL = gql`
  ${ANIMAL_CARD_FRAGMENT}
  ${ANIMAL_DETAIL_FRAGMENT}
  query GetAnimal($id: ID!) {
    nodeAnimal(id: $id) {
      ...AnimalDetail
    }
  }
`;

// ── Query: paginated list of all animals ──
export const GET_ANIMALS_LIST = gql`
  ${ANIMAL_CARD_FRAGMENT}
  query GetAnimalsList($first: Int, $after: Cursor) {
    nodeAnimals(first: $first, after: $after) {
      nodes {
        ...AnimalCard
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
