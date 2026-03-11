# Content Types

This document provides a comprehensive reference for all content types available in the Rescue Platform.

---

## Animal

| Field Name | Label | Type | Description |
| :--- | :--- | :--- | :--- |
| `title` | Name | string | The animal's name. |
| `body` | Bio | text_with_summary | The animal's full story, personality, and needs. |
| `field_animal_species` | Species | entity_reference | e.g. Rabbit, Guinea Pig, Rat |
| `field_animal_breed` | Breed | string | e.g. Holland Lop, Lionhead, American |
| `field_animal_sex` | Sex | list_string | Male, Female |
| `field_animal_age_years` | Age (Years) | integer |  |
| `field_animal_age_months` | Age (Months) | integer |  |
| `field_animal_color` | Color | string | e.g. Orange & White, Black, Tortoiseshell |
| `field_animal_size` | Size | list_string | Small, Medium, Large, X-Large |
| `field_animal_photos` | Animal Photos | image | Upload one or more photos. The first is the main profile photo. |
| `field_good_with` | Good With | list_string | Check all that apply: Dogs, Cats, Kids, Rabbits, Guinea Pigs, Rats, Birds, Reptiles, Small Animals. |
| `field_not_good_with` | Not Good With | list_string | Check all that apply. Anything not checked in either "Good With" or "Not Good With" will not be displayed. |
| `field_lifecycle_status` | Lifecycle Status | entity_reference | Available for Adoption, Sanctuary, Rainbow Bridge, etc. |
| `field_intake_date` | Intake Date | datetime | The date the animal came into the rescue's care. |
| `field_animal_source` | Source / Origin | text_long | e.g. Owner surrender, stray, transfer from another rescue. |
| `field_animal_id` | Animal ID | string | Optional internal ID number. |
| `field_microchip` | Microchip Number | string |  |
| `field_animal_vet` | Veterinarian(s) | entity_reference | Link to one or more Vet/Clinic nodes. |
| `field_animal_notes` | Internal Notes | text_long | Private notes visible only to admins. |
| `field_is_featured` | Is Featured? | boolean | Check to feature this animal on the homepage. |
| `field_exclude_public` | Exclude from Public View? | boolean | Check to hide this animal from all public-facing pages. |
| `field_current_foster` | Current Foster | entity_reference | Link to the Person node of the current foster. |
| `field_adopted_by` | Adopted By | entity_reference | Link to the Person node of the adopter. |
| `field_adoption_date` | Adoption Date | datetime |  |
| `field_date_of_passing` | Date of Passing | datetime | For animals in the Rainbow Bridge. |

---

## Blog Post

| Field Name | Label | Type | Description |
| :--- | :--- | :--- | :--- |
| `title` | Title | string | The title of the blog post. |
| `body` | Body | text_with_summary | The full content of the post. |
| `field_tags` | Tags | entity_reference | Add one or more tags to categorize the post. |
| `field_social_share_image` | Social Share Image (1200×630) | image | Optional: override the social share image. If blank, the system will try to use an image from the body. |

---

## Resource

| Field Name | Label | Type | Description |
| :--- | :--- | :--- | :--- |
| `title` | Title | string | The title of the resource. |
| `body` | Body | text_with_summary | The full content of the resource page. |
| `field_resource_category` | Category | list_string | e.g. Rabbit Care, Guinea Pig Health, Adoption Guide |
| `field_tags` | Tags | entity_reference | Add one or more tags to categorize the resource. |
| `field_resource_image` | Featured Image | image | Used on listing cards and as the default social share image. |
| `field_social_share_image` | Social Share Image (1200×630) | image | Optional: override the social share image. If blank, the Featured Image is used. |
| `field_share_targets` | Social Share Targets | list_string | Select which platforms to show share buttons for on this resource. |

---

## Event

| Field Name | Label | Type | Description |
| :--- | :--- | :--- | :--- |
| `title` | Title | string | The name of the event. |
| `body` | Body | text_with_summary | Full details about the event. |
| `field_event_date` | Event Date | datetime | Start date and time. |
| `field_event_end_date` | Event End Date | datetime | End date and time. |
| `field_event_location` | Location | string | Physical address or virtual link. |

---

## Person

| Field Name | Label | Type | Description |
| :--- | :--- | :--- | :--- |
| `title` | Name | string | The person's full name. |
| `field_person_roles` | Role(s) | entity_reference | Board Member, Volunteer, Foster, Donor, Adopter, Transporter, etc. |
| `field_person_email` | Email | email |  |
| `field_person_phone` | Phone | telephone |  |
| `field_person_phone2` | Alternate Phone | telephone |  |
| `field_person_address` | Street Address | string |  |
| `field_person_city` | City | string |  |
| `field_person_state` | State / Province | string |  |
| `field_person_zip` | ZIP / Postal Code | string |  |
| `field_person_country` | Country | string |  |
| `field_person_photo` | Profile Photo | image |  |
| `field_person_bio` | Bio / Notes | string_long | Internal notes about this person. |
| `field_do_not_adopt` | Do Not Adopt Flag | boolean | **IMPORTANT:** Check this box if this person should NOT be approved for adoption or fostering. |
| `field_dna_notes` | Do Not Adopt Notes | string_long | Internal notes explaining why this person is flagged. Visible only to admins. |
| `field_availability_notes` | Availability Notes | text_long | Describe availability for fostering or volunteering (e.g., weekends only, no dogs over 30 lbs, etc.) |
| `field_foster_restrictions` | Foster Restrictions | text_long | Any restrictions on what animals this foster can take (e.g., no cats, dogs only, kittens only). |
| `field_max_foster_capacity` | Max Foster Capacity | integer | Maximum number of animals this foster can house at one time. |
| `field_currently_fostering` | Currently Fostering | entity_reference | Animals this person is currently fostering. |

---

## Organization

| Field Name | Label | Type | Description |
| :--- | :--- | :--- | :--- |
| `title` | Name | string | The name of the organization. |
| `field_org_type` | Organization Type | list_string | Rescue, Shelter, Transport, Partner |
| `field_org_website` | Website | link |  |
| `field_org_contact_name` | Primary Contact Name | string |  |
| `field_org_contact_email` | Contact Email | email |  |
| `field_org_contact_phone` | Phone Number | telephone |  |
| `field_org_notes` | Internal Notes | string_long |  |

---

## Veterinarian / Clinic

| Field Name | Label | Type | Description |
| :--- | :--- | :--- | :--- |
| `title` | Practice Name | string | The name of the vet clinic or practice. |
| `field_vet_doctor_names` | Doctor Name(s) | string_long | One per line. |
| `field_vet_specialties` | Specialties / Species Seen | string_long | e.g. Rabbits, Guinea Pigs, Exotic Small Mammals |
| `field_vet_phone` | Phone Number | telephone |  |
| `field_vet_emergency_phone` | Emergency / After-Hours Phone | telephone |  |
| `field_vet_email` | Email Address | email |  |
| `field_vet_website` | Website | link |  |
| `field_vet_address` | Street Address | string |  |
| `field_vet_city` | City | string |  |
| `field_vet_state` | State / Province | string |  |
| `field_vet_zip` | ZIP / Postal Code | string |  |
| `field_vet_hours` | Office Hours | string_long |  |
| `field_vet_is_emergency` | Offers Emergency Care? | boolean |  |
| `field_vet_is_preferred` | Preferred / Recommended Vet? | boolean | Check to feature this vet on the Vets & Care page. |
| `field_vet_public_notes` | Public Description | string_long | Shown on the public vet resources page. |
| `field_vet_notes` | Internal Notes | string_long | Private notes visible only to admins. |

---

## Support / Giving

| Field Name | Label | Type | Description |
| :--- | :--- | :--- | :--- |
| `title` | Title | string | e.g. Venmo, PayPal, Chewy Wishlist |
| `field_giving_type` | Giving Type | list_string | Cash App, Venmo, PayPal, Zelle, Amazon Wishlist, Chewy Wishlist, Vet Bill, etc. |
| `field_giving_handle` | Handle / Username / Email | string | e.g. @myrescue for Venmo, or the email for PayPal |
| `field_giving_url` | Link / URL | link | Direct link to the giving page, wishlist, etc. |
| `field_giving_instructions` | Instructions | string_long | Step-by-step instructions for donors (e.g. "Send to @myrescue, add note: donation") |
| `field_giving_image` | QR Code / Image | image | Upload a QR code or logo for this giving method. |
| `field_giving_goal` | Current Goal / Campaign | string | e.g. "Help us cover Biscuit's dental surgery - $450 needed" |
| `field_giving_is_active` | Currently Active? | boolean |  |
| `field_giving_sort_weight` | Sort Order | integer | Lower numbers appear first on the Support & Giving page. |

---

## Site Settings

This is a special singleton content type. There should only be **one** Site Settings node. It controls global site configuration.

| Field Name | Label | Type | Description |
| :--- | :--- | :--- | :--- |
| `title` | Site Name | string | The name of your rescue. |
| `field_org_tagline` | Tagline | string | Your rescue's tagline or motto. |
| `field_nav_items` | Navigation Items | string_long | Each line defines one nav item. Format: `Label|/path|enabled(1 or 0)`. Example: `Adopt|/adopt|1`. Set the last value to 0 to temporarily hide a nav item without deleting it. |
| `field_org_email` | Contact Email | email |  |
| `field_org_phone` | Phone Number | telephone |  |
| `field_org_address` | Mailing Address | string_long |  |
| `field_org_ein` | EIN / Tax ID | string |  |
| `field_social_facebook` | Facebook Page URL or Handle | string |  |
| `field_social_instagram` | Instagram Handle (e.g. @myrescue) | string |  |
| `field_social_twitter` | X / Twitter Handle | string |  |
| `field_social_threads` | Threads Handle | string |  |
| `field_social_bluesky` | Bluesky Handle | string |  |
| `field_social_tiktok` | TikTok Handle | string |  |
| `field_social_youtube` | YouTube Channel URL | string |  |
| `field_social_pinterest` | Pinterest Handle | string |  |
