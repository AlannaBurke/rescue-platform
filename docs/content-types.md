# Content Types

This document provides a comprehensive reference for all content types available in the Rescue Platform.

## Animal

| Field Name | Label | Type | Description |
| :--- | :--- | :--- | :--- |
| `status` | Published | boolean |  |
| `title` | Title | string |  |
| `body` | Body | text_with_summary |  |
| `field_adopted_by` | Adopted By | entity_reference |  |
| `field_adoption_date` | Adoption Date | datetime |  |
| `field_animal_age_months` | Age (Months) | integer |  |
| `field_animal_age_years` | Age (Years) | integer |  |
| `field_animal_breed` | Breed | string |  |
| `field_animal_color` | Color | string |  |
| `field_animal_id` | Animal ID | string |  |
| `field_animal_notes` | Internal Notes | text_long |  |
| `field_animal_photos` | Animal Photos | image |  |
| `field_animal_sex` | Sex | list_string |  |
| `field_animal_size` | Size | list_string |  |
| `field_animal_source` | Source / Origin | text_long |  |
| `field_animal_species` | Species | entity_reference |  |
| `field_animal_status` | Status | entity_reference |  |
| `field_animal_vet` | Veterinarian(s) | entity_reference |  |
| `field_current_foster` | Current Foster | entity_reference |  |
| `field_date_of_passing` | Date of Passing | datetime |  |
| `field_exclude_public` | Exclude from Public View? | boolean |  |
| `field_foster_history` | Foster History | entity_reference_revisions |  |
| `field_good_with_cats` | Good With Cats | boolean |  |
| `field_good_with_dogs` | Good With Dogs | boolean |  |
| `field_good_with_kids` | Good With Kids | boolean |  |
| `field_history_log` | History Log | entity_reference_revisions |  |
| `field_intake_date` | Intake Date | datetime |  |
| `field_is_featured` | Is Featured? | boolean |  |
| `field_lifecycle_status` | Lifecycle Status | entity_reference |  |
| `field_medication_log` | Medication Log | entity_reference_revisions |  |
| `field_microchip` | Microchip Number | string |  |
| `field_placement_history` | Placement History | entity_reference_revisions |  |

## Article

| Field Name | Label | Type | Description |
| :--- | :--- | :--- | :--- |
| `status` | Published | boolean |  |
| `title` | Title | string |  |
| `body` | Body | text_with_summary |  |
| `field_image` | Image | image |  |
| `field_tags` | Tags | entity_reference | Enter a comma-separated list. For example: Amsterdam, Mexico City, "Cleveland, Ohio" |

## Blog Post

| Field Name | Label | Type | Description |
| :--- | :--- | :--- | :--- |
| `status` | Published | boolean |  |
| `title` | Title | string |  |
| `body` | Body | text_with_summary |  |
| `field_share_targets` | Social Share Targets | list_string |  |
| `field_social_share_image` | Social Share Image (1200×630) | image | Optional: override the social share image. |
| `field_tags` | Tags | entity_reference |  |

## Donation

| Field Name | Label | Type | Description |
| :--- | :--- | :--- | :--- |
| `status` | Published | boolean |  |
| `title` | Title | string |  |
| `field_donation_amount` | Amount | decimal |  |
| `field_donation_date` | Donation Date | datetime |  |
| `field_donation_for_animal` | Designated For Animal | entity_reference | If this donation is designated for a specific animal (e.g., memorial donation). |
| `field_donation_notes` | Notes | text_long |  |
| `field_donation_platform` | Platform / Source | list_string |  |
| `field_donation_type` | Donation Type | list_string |  |
| `field_donor_name` | Donor Name | string | Leave blank for anonymous donations. |

## Event

| Field Name | Label | Type | Description |
| :--- | :--- | :--- | :--- |
| `status` | Published | boolean |  |
| `title` | Title | string |  |
| `body` | Body | text_with_summary |  |
| `field_event_date` | Event Date | datetime |  |
| `field_event_end_date` | Event End Date | datetime |  |
| `field_event_location` | Location | string |  |

## Expense

| Field Name | Label | Type | Description |
| :--- | :--- | :--- | :--- |
| `status` | Published | boolean |  |
| `title` | Title | string |  |
| `body` | Body | text_with_summary |  |
| `field_expense_amount` | Amount | decimal |  |
| `field_expense_animal` | Associated Animal | entity_reference |  |
| `field_expense_category` | Category | entity_reference |  |
| `field_expense_date` | Date | datetime |  |
| `field_expense_receipt` | Receipt / Documentation | file | Upload receipt images or PDF documents (max 3 files). |
| `field_fiscal_year` | Fiscal Year | integer | The fiscal year this expense belongs to (e.g., 2025). Auto-populated from expense date. |
| `field_payment_method` | Payment Method | list_string |  |
| `field_reimbursed_to` | Reimbursed To (Person) | entity_reference | The foster or volunteer who paid out of pocket and needs reimbursement. |
| `field_reimbursement_status` | Reimbursement Status | list_string |  |
| `field_vendor` | Vendor / Payee | string | Name of the store, clinic, or service provider. |

## Medical Record

| Field Name | Label | Type | Description |
| :--- | :--- | :--- | :--- |
| `status` | Published | boolean |  |
| `title` | Title | string |  |
| `body` | Body | text_with_summary |  |
| `field_medical_animal` | Animal | entity_reference |  |
| `field_medical_cost` | Cost | decimal |  |
| `field_medical_date` | Date | datetime |  |
| `field_medical_next_due` | Next Due Date | datetime |  |
| `field_medical_provider` | Vet / Provider | string |  |
| `field_medical_type` | Type | entity_reference |  |

## Organization

| Field Name | Label | Type | Description |
| :--- | :--- | :--- | :--- |
| `status` | Published | boolean |  |
| `title` | Title | string |  |
| `body` | Body | text_with_summary |  |
| `field_org_city` | City | string |  |
| `field_org_contact_email` | Contact Email | email |  |
| `field_org_contact_name` | Primary Contact Name | string |  |
| `field_org_contact_phone` | Phone Number | telephone |  |
| `field_org_country` | Country | string |  |
| `field_org_facebook` | Facebook Page | string |  |
| `field_org_instagram` | Instagram Handle | string |  |
| `field_org_is_partner` | Active Partner? | boolean |  |
| `field_org_logo` | Logo / Photo | image |  |
| `field_org_notes` | Internal Notes | string_long |  |
| `field_org_state` | State / Province | string |  |
| `field_org_street` | Street Address | string |  |
| `field_org_type` | Organization Type | list_string |  |
| `field_org_website` | Website | link |  |
| `field_org_zip` | ZIP / Postal Code | string |  |

## Basic page

| Field Name | Label | Type | Description |
| :--- | :--- | :--- | :--- |
| `status` | Published | boolean |  |
| `title` | Title | string |  |
| `body` | Body | text_with_summary |  |

## Person

| Field Name | Label | Type | Description |
| :--- | :--- | :--- | :--- |
| `status` | Published | boolean |  |
| `title` | Title | string |  |
| `body` | Body | text_with_summary |  |
| `field_availability_notes` | Availability Notes | text_long | Describe availability for fostering or volunteering (e.g., weekends only, no dogs over 30 lbs, etc.) |
| `field_currently_fostering` | Currently Fostering | entity_reference | Animals this person is currently fostering. |
| `field_dna_notes` | Do Not Adopt Notes | string_long | Internal notes explaining why this person is flagged. |
| `field_do_not_adopt` | Do Not Adopt Flag | boolean | Check this box if this person should not be approved for adoption. |
| `field_foster_restrictions` | Foster Restrictions | text_long | Any restrictions on what animals this foster can take (e.g., no cats, dogs only, kittens only). |
| `field_max_foster_capacity` | Max Foster Capacity | integer | Maximum number of animals this foster can house at one time. |
| `field_person_active_since` | Active Since | datetime |  |
| `field_person_address` | Street Address | string |  |
| `field_person_availability` | Availability | string_long |  |
| `field_person_bio` | Bio / Notes | string_long |  |
| `field_person_city` | City | string |  |
| `field_person_country` | Country | string |  |
| `field_person_email` | Email | email |  |
| `field_person_facebook` | Facebook Profile URL | string |  |
| `field_person_instagram` | Instagram Handle | string |  |
| `field_person_phone` | Phone | telephone |  |
| `field_person_phone2` | Alternate Phone | telephone |  |
| `field_person_photo` | Profile Photo | image |  |
| `field_person_roles` | Role(s) | entity_reference |  |
| `field_person_skills` | Skills | string_long |  |
| `field_person_state` | State / Province | string |  |
| `field_person_zip` | ZIP / Postal Code | string |  |
| `field_preferred_contact` | Preferred Contact Method | string | e.g. Email, Phone, Text, Facebook Messenger |
| `field_volunteer_shifts` | Volunteer Shifts | entity_reference_revisions |  |
| `field_volunteer_skills` | Volunteer Skills | entity_reference |  |

## Resource

| Field Name | Label | Type | Description |
| :--- | :--- | :--- | :--- |
| `status` | Published | boolean |  |
| `title` | Title | string |  |
| `body` | Body | text_with_summary |  |
| `field_resource_category` | Category | list_string |  |
| `field_resource_image` | Featured Image | image | Used on listing cards and as the default social share image. |
| `field_share_targets` | Social Share Targets | list_string | Select which platforms to show share buttons for on this resource. |
| `field_social_share_image` | Social Share Image (1200×630) | image | Optional: override the social share image. If blank, the Featured Image is used. |
| `field_tags` | Tags | entity_reference |  |

## Site Settings

| Field Name | Label | Type | Description |
| :--- | :--- | :--- | :--- |
| `status` | Published | boolean |  |
| `title` | Title | string |  |
| `field_nav_items` | Navigation Items (one per line: Label|/path|1) | string_long | Each line defines one nav item. Format: Label|/path|enabled(1/0). Example: Adopt|/adopt|1 |
| `field_org_address` | Mailing Address | string_long |  |
| `field_org_ein` | EIN / Tax ID | string |  |
| `field_org_email` | Contact Email | email |  |
| `field_org_phone` | Phone Number | telephone |  |
| `field_org_tagline` | Tagline | string |  |
| `field_social_bluesky` | Bluesky Handle | string |  |
| `field_social_facebook` | Facebook Page URL or Handle | string |  |
| `field_social_instagram` | Instagram Handle (e.g. @myrescue) | string |  |
| `field_social_pinterest` | Pinterest Handle | string |  |
| `field_social_threads` | Threads Handle | string |  |
| `field_social_tiktok` | TikTok Handle | string |  |
| `field_social_twitter` | X / Twitter Handle | string |  |
| `field_social_youtube` | YouTube Channel URL | string |  |

## Support / Giving

| Field Name | Label | Type | Description |
| :--- | :--- | :--- | :--- |
| `status` | Published | boolean |  |
| `title` | Title | string |  |
| `body` | Body | text_with_summary |  |
| `field_giving_goal` | Current Goal / Campaign | string | e.g. "Help us cover Biscuit's dental surgery - $450 needed" |
| `field_giving_handle` | Handle / Username / Email | string | e.g. @myrescue for Venmo, or the email for PayPal |
| `field_giving_image` | QR Code / Image | image | Upload a QR code or logo for this giving method. |
| `field_giving_instructions` | Instructions | string_long | Step-by-step instructions for donors (e.g. "Send to @myrescue, add note: donation") |
| `field_giving_is_active` | Currently Active? | boolean |  |
| `field_giving_sort_weight` | Sort Order | integer | Lower numbers appear first. |
| `field_giving_type` | Giving Type | list_string |  |
| `field_giving_url` | Link / URL | link | Direct link to the giving page, wishlist, etc. |

## Veterinarian / Clinic

| Field Name | Label | Type | Description |
| :--- | :--- | :--- | :--- |
| `status` | Published | boolean |  |
| `title` | Title | string |  |
| `body` | Body | text_with_summary |  |
| `field_vet_city` | City | string |  |
| `field_vet_doctor_names` | Doctor Name(s) | string_long | One per line |
| `field_vet_email` | Email Address | email |  |
| `field_vet_emergency_phone` | Emergency / After-Hours Phone | telephone |  |
| `field_vet_hours` | Office Hours | string_long |  |
| `field_vet_is_emergency` | Offers Emergency Care? | boolean |  |
| `field_vet_is_preferred` | Preferred / Recommended Vet? | boolean |  |
| `field_vet_notes` | Internal Notes | string_long |  |
| `field_vet_phone` | Phone Number | telephone |  |
| `field_vet_photo` | Photo / Logo | image |  |
| `field_vet_practice_name` | Practice / Clinic Name | string |  |
| `field_vet_public_notes` | Public Description | string_long | Shown on the public vet resources page. |
| `field_vet_specialties` | Specialties / Species Seen | string_long | e.g. Rabbits, Guinea Pigs, Exotic Small Mammals |
| `field_vet_state` | State / Province | string |  |
| `field_vet_street` | Street Address | string |  |
| `field_vet_website` | Website | link |  |
| `field_vet_zip` | ZIP / Postal Code | string |  |

