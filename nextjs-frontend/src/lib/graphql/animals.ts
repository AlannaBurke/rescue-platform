import { gql } from "@apollo/client";

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
    animalStatus {
      ... on TermAnimalStatus {
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

// Query: single animal by ID
export const GET_ANIMAL = gql`
  ${ANIMAL_CARD_FRAGMENT}
  query GetAnimal($id: ID!) {
    nodeAnimal(id: $id) {
      ...AnimalCard
      microchip
      intakeDate {
        time
        timestamp
      }
      adoptionDate {
        time
        timestamp
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
    }
  }
`;

// Query: paginated list of all animals
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
