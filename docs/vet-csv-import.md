# How to Import Vets via CSV

This guide explains how to use the CSV import feature to add multiple vet practices to the site at once. You can download the template file here:

[**Download Vet Import CSV Template**](/vet_import_template.csv)

---

## CSV File Format

The CSV file has 31 columns. The first row must be the header row with the exact column names listed below. The second row in the template file is an example — you can delete it.

### Required Fields

- `practice_name`: The name of the vet practice.

### All Fields

| Column Name | Type | Notes |
|---|---|---|
| `practice_name` | Text | **Required.** |
| `street` | Text | |
| `city` | Text | |
| `state` | Text | 2-letter abbreviation (e.g., OR, WA) |
| `zip` | Text | 5-digit zip code |
| `phone` | Text | Main phone number |
| `emergency_phone` | Text | Separate emergency line, if any |
| `email` | Text | Main contact email |
| `website` | URL | Full URL including `https://` |
| `hours` | Text | Free-text for hours (e.g., "Mon-Fri: 8am-6pm; Sat: 9am-4pm") |
| `specialties` | Text | Comma-separated list of specialties (e.g., "surgery, dentistry, exotic medicine") |
| `sees_exotics` | Boolean | `TRUE` or `FALSE` |
| `species` | Text | Comma-separated list of species **machine names**. See table below. |
| `rescue_discount` | Boolean | `TRUE` or `FALSE` |
| `discount_details` | Text | Description of the discount (e.g., "10% off exams") |
| `endorsement` | Text | `none`, `recommended`, or `endorsed`. See table below. |
| `cost_rating` | Integer | 1, 2, 3, 4, or 5 |
| `is_emergency` | Boolean | `TRUE` or `FALSE` (for 24hr emergency hospitals) |
| `is_preferred` | Boolean | `TRUE` or `FALSE` (for rescue-preferred vets) |
| `public_notes` | Text | Notes visible to the public on the vet profile |
| `internal_notes` | Text | Notes visible only to rescue staff |
| `staff_1_name` | Text | Name of the first staff member |
| `staff_1_role` | Text | Role/title of the first staff member |
| `staff_1_phone` | Text | Direct phone for the first staff member |
| `staff_1_email` | Text | Direct email for the first staff member |
| `staff_1_notes` | Text | Notes for the first staff member |
| `staff_2_name` | Text | Name of the second staff member |
| `staff_2_role` | Text | Role/title of the second staff member |
| `staff_2_phone` | Text | Direct phone for the second staff member |
| `staff_2_email` | Text | Direct email for the second staff member |
| `staff_2_notes` | Text | Notes for the second staff member |

**Note:** You can add more staff members by adding more columns with the pattern `staff_3_name`, `staff_3_role`, etc. The importer will automatically detect them.

### Allowed Values for Key Fields

**`species`** (comma-separated):

| Value | Label |
|---|---|
| `rabbit` | Rabbits |
| `guinea_pig` | Guinea Pigs |
| `rat` | Rats & Mice |
| `chinchilla` | Chinchillas |
| `hamster` | Hamsters & Gerbils |
| `ferret` | Ferrets |
| `bird` | Birds / Avian |
| `reptile` | Reptiles |
| `hedgehog` | Hedgehogs |
| `sugar_glider` | Sugar Gliders |
| `other` | Other |

**`endorsement`**:

| Value | Label |
|---|---|
| `none` | Listed only (no endorsement) |
| `recommended` | Recommended |
| `endorsed` | Endorsed Partner |

---

## How to Import

1. Go to the **Admin Dashboard**
2. Click on the **"Import Vets (CSV)"** card in the "Manage Site" section
3. Click **"Choose File"** and select your CSV file
4. Click **"Upload and Preview"**
5. The system will show you a preview of the vets to be imported, along with any errors.
6. If everything looks correct, click **"Confirm Import"**.

The vets will be added to the site. You can then edit them individually to add photos or make other changes.
