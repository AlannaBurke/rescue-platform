# Data Model

This document describes the complete data model for the HaltRescue Platform. All data is managed in the Drupal backend and exposed via the GraphQL API.

## Content Types

### Animal (`animal`)

The central entity of the platform, representing an individual animal in the rescue's care.

| Field Label | Machine Name | Field Type | Required | Notes |
| :--- | :--- | :--- | :--- | :--- |
| Title | `title` | Text (Plain) | Yes | The animal's name. |
| Animal ID | `field_animal_id` | Text (Plain) | Yes | Unique internal identifier. |
| Status | `field_animal_status` | Entity Reference | Yes | Ref: `animal_status` taxonomy. |
| Species | `field_animal_species` | Entity Reference | Yes | Ref: `animal_species` taxonomy. |
| Breed | `field_animal_breed` | Text (Plain) | No | |
| Age (Years) | `field_animal_age_years` | Number (Integer) | No | |
| Age (Months) | `field_animal_age_months` | Number (Integer) | No | For young animals. |
| Sex | `field_animal_sex` | List (Text) | Yes | Values: Male, Female, Unknown. |
| Size | `field_animal_size` | List (Text) | No | Values: Small, Medium, Large, XL. |
| Color | `field_animal_color` | Text (Plain) | No | |
| Description | `field_animal_description` | Text (Formatted, Long) | No | Public-facing description. |
| Internal Notes | `field_animal_notes` | Text (Formatted, Long) | No | Private notes for staff only. |
| Photos | `field_animal_photos` | Media (Image) | No | Unlimited. |
| Videos | `field_animal_videos` | Media (Remote Video) | No | Unlimited. |
| Current Foster | `field_current_foster` | Entity Reference | No | Ref: `person` content type. |
| Intake Date | `field_intake_date` | Date | No | |
| Adoption Date | `field_adoption_date` | Date | No | |
| Good With Dogs | `field_good_with_dogs` | Boolean | No | |
| Good With Cats | `field_good_with_cats` | Boolean | No | |
| Good With Kids | `field_good_with_kids` | Boolean | No | |
| Microchip Number | `field_microchip` | Text (Plain) | No | |

### Person (`person`)

A unified profile for any individual interacting with the rescue.

| Field Label | Machine Name | Field Type | Required | Notes |
| :--- | :--- | :--- | :--- | :--- |
| Title | `title` | Text (Plain) | Yes | The person's full name. |
| Role(s) | `field_person_roles` | Entity Reference | Yes | Ref: `person_role` taxonomy. Unlimited. |
| Email | `field_person_email` | Email | Yes | |
| Phone | `field_person_phone` | Telephone | No | |
| Address | `field_person_address` | Address | No | |
| Bio / Notes | `field_person_notes` | Text (Formatted, Long) | No | |
| Availability | `field_person_availability` | Text (Plain, Long) | No | For fosters/volunteers. |
| Skills | `field_person_skills` | Text (Plain, Long) | No | For fosters/volunteers. |
| Active Since | `field_person_active_since` | Date | No | |
| Animals Fostered | `field_animals_fostered` | Entity Reference | No | Ref: `animal`. Unlimited. Reverse ref. |

### Medical Record (`medical_record`)

A log entry for a specific medical event for an animal.

| Field Label | Machine Name | Field Type | Required | Notes |
| :--- | :--- | :--- | :--- | :--- |
| Title | `title` | Text (Plain) | Yes | Auto-generated or descriptive label. |
| Animal | `field_medical_animal` | Entity Reference | Yes | Ref: `animal` content type. |
| Date | `field_medical_date` | Date | Yes | |
| Type | `field_medical_type` | Entity Reference | Yes | Ref: `medical_type` taxonomy. |
| Description | `field_medical_description` | Text (Formatted, Long) | No | |
| Vet / Provider | `field_medical_provider` | Text (Plain) | No | |
| Cost | `field_medical_cost` | Number (Decimal) | No | |
| Next Due Date | `field_medical_next_due` | Date | No | For recurring treatments. |
| Attachments | `field_medical_attachments` | Media (File) | No | For vet records, etc. |

### Expense (`expense`)

A record of a single financial expense incurred by the rescue.

| Field Label | Machine Name | Field Type | Required | Notes |
| :--- | :--- | :--- | :--- | :--- |
| Title | `title` | Text (Plain) | Yes | Brief description of the expense. |
| Date | `field_expense_date` | Date | Yes | |
| Amount | `field_expense_amount` | Number (Decimal) | Yes | |
| Category | `field_expense_category` | Entity Reference | Yes | Ref: `expense_category` taxonomy. |
| Associated Animal | `field_expense_animal` | Entity Reference | No | Ref: `animal` content type. |
| Notes | `field_expense_notes` | Text (Formatted, Long) | No | |
| Receipt | `field_expense_receipt` | Media (Image/File) | No | |

## Website Content Types

These content types power the public-facing website.

| Content Type | Machine Name | Description |
| :--- | :--- | :--- |
| **Page** | `page` | Standard static pages (About Us, Contact, etc.). |
| **Blog Post** | `blog_post` | News and updates from the rescue. |
| **Event** | `event` | Fundraisers, adoption events, etc. |

## Taxonomies

| Vocabulary | Machine Name | Default Terms |
| :--- | :--- | :--- |
| **Animal Status** | `animal_status` | Available, In Foster, Adoption Pending, Adopted, Sanctuary, Medical Hold, Not Available |
| **Animal Species** | `animal_species` | Dog, Cat, Rabbit, Guinea Pig, Bird, Reptile, Other |
| **Person Role** | `person_role` | Foster, Volunteer, Adopter, Donor, Board Member, Staff |
| **Medical Type** | `medical_type` | Vaccination, Medication, Vet Visit, Surgery, Dental, Spay/Neuter, Microchip, Other |
| **Expense Category** | `expense_category` | Veterinary, Food & Supplies, Transport, Boarding, Marketing, Administrative, Other |

## Entity Relationship Diagram

```
[Animal] ----< has many >---- [Medical Record]
[Animal] ----< has many >---- [Expense]
[Animal] ----< has one  >---- [Person] (Current Foster)
[Person] ----< has many >---- [Animal] (Animals Fostered - reverse ref)
```
