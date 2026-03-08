'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FormField,
  TextInput,
  TextArea,
  Select,
  RadioGroup,
  CheckboxGroup,
  SectionHeader,
  InfoBox,
} from '@/components/forms/FormField';

type FormStep = 1 | 2 | 3 | 4 | 5;

interface FormData {
  // Step 1 — Contact
  email: string;
  fullName: string;
  dateOfBirth: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  daytimePhone: string;
  eveningPhone: string;

  // Step 2 — Residence
  residenceType: string;
  residenceTypeOther: string;
  isHomeowner: string;

  // Step 3 — Application intent
  applicationDate: string;
  fosterOrAdopt: string;
  animalTypes: string[];
  sexPreference: string;
  agePreferences: string[];
  reasonForPet: string;
  otherPetsConsidered: string;

  // Step 4 — Household & Lifestyle
  hoursAttention: string;
  petLocationHome: string;
  petLocationAway: string;
  householdMembers: string;
  currentPreviousPets: string;
  everSurrendered: string;
  surrenderExplanation: string;
  allergies: string;
  veterinarian: string;
  wantVetRecommendation: string;
  vetCareFrequency: string;
  annualBudget: string;
  plannedDiet: string;
  ownedThisTypeBefore: string;

  // Step 5 — Care & References
  cageDescription: string;
  cageBedding: string;
  awareBrushingNails: string;
  nailClipper: string;
  references: string;
}

const ANIMAL_TYPES = [
  { value: 'guinea_pig', label: 'Guinea Pig' },
  { value: 'rabbit', label: 'Rabbit' },
  { value: 'hamster', label: 'Hamster' },
  { value: 'gerbil', label: 'Gerbil' },
  { value: 'rat', label: 'Rat' },
  { value: 'mouse', label: 'Mouse' },
  { value: 'chinchilla', label: 'Chinchilla' },
  { value: 'hedgehog', label: 'Hedgehog' },
  { value: 'ferret', label: 'Ferret' },
  { value: 'other', label: 'Other (please describe in your application)' },
];

const AGE_PREFS = [
  { value: 'baby', label: 'Baby / Young' },
  { value: 'adult', label: 'Adult' },
  { value: 'senior', label: 'Senior' },
  { value: 'no_preference', label: 'No preference' },
  { value: 'special_needs', label: 'Special needs / sanctuary' },
];

const RESIDENCE_TYPES = [
  { value: 'house', label: 'House (own)' },
  { value: 'house_rent', label: 'House (rent)' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'condo', label: 'Condo' },
  { value: 'mobile_home', label: 'Mobile home' },
  { value: 'other', label: 'Other' },
];

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY','DC',
].map((s) => ({ value: s, label: s }));

const STEP_TITLES: Record<FormStep, string> = {
  1: 'Contact Information',
  2: 'Residence Information',
  3: 'Application Details',
  4: 'Household & Lifestyle',
  5: 'Care & References',
};

export default function AdoptionApplicationPage() {
  const [step, setStep] = useState<FormStep>(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<FormData>({
    email: '', fullName: '', dateOfBirth: '', addressLine1: '', addressLine2: '',
    city: '', state: '', zipCode: '', daytimePhone: '', eveningPhone: '',
    residenceType: '', residenceTypeOther: '', isHomeowner: '',
    applicationDate: new Date().toISOString().split('T')[0],
    fosterOrAdopt: '', animalTypes: [], sexPreference: '', agePreferences: [],
    reasonForPet: '', otherPetsConsidered: '',
    hoursAttention: '', petLocationHome: '', petLocationAway: '',
    householdMembers: '', currentPreviousPets: '', everSurrendered: '',
    surrenderExplanation: '', allergies: '', veterinarian: '',
    wantVetRecommendation: '', vetCareFrequency: '', annualBudget: '',
    plannedDiet: '', ownedThisTypeBefore: '',
    cageDescription: '', cageBedding: '', awareBrushingNails: '',
    nailClipper: '', references: '',
  });

  const set = (field: keyof FormData, value: string | string[]) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // In production, POST to a Drupal webform endpoint or email API
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitted(true);
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
          <div className="text-6xl mb-4">🐾</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Application Submitted!</h1>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Thank you for your interest in adopting or fostering with Helping All Little Things!
            We will review your application and reach out within about a week.
          </p>
          <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
            <strong>Important:</strong> Please add <strong>info@helpingalllittlethings.org</strong> to
            your contacts and check your spam folder so you don&apos;t miss our reply.
          </p>
          <Link
            href="/adopt"
            className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
          >
            Browse Adoptable Animals
          </Link>
        </div>
      </div>
    );
  }

  const totalSteps = 5;
  const progress = Math.round((step / totalSteps) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-emerald-700 text-white py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-emerald-200 text-sm mb-3">
            <Link href="/adopt" className="hover:text-white transition-colors">Adopt</Link>
            <span>/</span>
            <span>Application</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Adoption & Foster Application</h1>
          <p className="text-emerald-100 text-sm">
            Helping All Little Things Rescue &mdash; Application for {new Date().getFullYear()}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Step {step} of {totalSteps}: {STEP_TITLES[step]}
            </span>
            <span className="text-xs text-gray-400">{progress}% complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        <form onSubmit={handleSubmit}>

          {/* ================================================================
              STEP 1 — CONTACT INFORMATION
          ================================================================ */}
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <SectionHeader
                title="Contact Information"
                description="The first step to adopting or fostering is to fill out this application. While we review it, we will send you some information about proper small animal care to read over while waiting to be approved."
              />

              <InfoBox variant="info">
                <strong>Please be patient!</strong> The approval process may take{' '}
                <strong>about a week</strong> depending on how long it takes to contact your
                references. Our volunteers are also very busy with hands-on animal care.
              </InfoBox>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <div className="md:col-span-2">
                  <FormField label="Email address" name="email" required>
                    <TextInput
                      name="email" type="email" required
                      value={form.email} onChange={(e) => set('email', e.target.value)}
                      placeholder="you@example.com"
                    />
                  </FormField>
                </div>

                <div className="md:col-span-2">
                  <FormField label="Your full name" name="fullName" required>
                    <TextInput
                      name="fullName" required
                      value={form.fullName} onChange={(e) => set('fullName', e.target.value)}
                      placeholder="First and last name"
                    />
                  </FormField>
                </div>

                <FormField label="Date of birth" name="dateOfBirth" required>
                  <TextInput
                    name="dateOfBirth" type="date" required
                    value={form.dateOfBirth} onChange={(e) => set('dateOfBirth', e.target.value)}
                  />
                </FormField>

                <div className="md:col-span-2">
                  <FormField label="Address line 1" name="addressLine1" required>
                    <TextInput
                      name="addressLine1" required
                      value={form.addressLine1} onChange={(e) => set('addressLine1', e.target.value)}
                      placeholder="Street address"
                    />
                  </FormField>
                </div>

                <div className="md:col-span-2">
                  <FormField label="Address line 2" name="addressLine2">
                    <TextInput
                      name="addressLine2"
                      value={form.addressLine2} onChange={(e) => set('addressLine2', e.target.value)}
                      placeholder="Apt, suite, unit (optional)"
                    />
                  </FormField>
                </div>

                <FormField label="City" name="city" required>
                  <TextInput
                    name="city" required
                    value={form.city} onChange={(e) => set('city', e.target.value)}
                  />
                </FormField>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label="State" name="state" required>
                    <Select
                      name="state" required
                      value={form.state} onChange={(e) => set('state', e.target.value)}
                      options={US_STATES} placeholder="Select"
                    />
                  </FormField>
                  <FormField label="Zip code" name="zipCode" required>
                    <TextInput
                      name="zipCode" required
                      value={form.zipCode} onChange={(e) => set('zipCode', e.target.value)}
                      placeholder="12345"
                    />
                  </FormField>
                </div>

                <FormField label="Daytime phone number" name="daytimePhone" required>
                  <TextInput
                    name="daytimePhone" type="tel" required
                    value={form.daytimePhone} onChange={(e) => set('daytimePhone', e.target.value)}
                    placeholder="(555) 555-5555"
                  />
                </FormField>

                <FormField label="Evening phone number" name="eveningPhone">
                  <TextInput
                    name="eveningPhone" type="tel"
                    value={form.eveningPhone} onChange={(e) => set('eveningPhone', e.target.value)}
                    placeholder="(555) 555-5555"
                  />
                </FormField>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Next: Residence Information →
                </button>
              </div>
            </div>
          )}

          {/* ================================================================
              STEP 2 — RESIDENCE INFORMATION
          ================================================================ */}
          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <SectionHeader title="Residence Information" />

              <FormField
                label="Which of the following best describes your current residence?"
                name="residenceType" required
              >
                <RadioGroup
                  name="residenceType" required
                  options={RESIDENCE_TYPES}
                  value={form.residenceType}
                  onChange={(v) => set('residenceType', v)}
                />
                {form.residenceType === 'other' && (
                  <TextInput
                    name="residenceTypeOther" className="mt-3"
                    value={form.residenceTypeOther}
                    onChange={(e) => set('residenceTypeOther', e.target.value)}
                    placeholder="Please describe your residence type"
                  />
                )}
              </FormField>

              <FormField
                label="Are you the homeowner, or do you have written consent from the homeowner to have this pet?"
                name="isHomeowner" required
                hint="We will require you to provide this consent before completing the adoption process."
              >
                <RadioGroup
                  name="isHomeowner" required
                  options={[
                    { value: 'yes_owner', label: 'Yes, I am the homeowner' },
                    { value: 'yes_consent', label: 'I have written consent from the homeowner' },
                    { value: 'no', label: 'No — I need to obtain consent' },
                  ]}
                  value={form.isHomeowner}
                  onChange={(v) => set('isHomeowner', v)}
                />
              </FormField>

              {form.isHomeowner === 'no' && (
                <InfoBox variant="warning">
                  <strong>Action required before submitting:</strong> Please submit written consent
                  from your homeowner to{' '}
                  <a href="mailto:info@helpingalllittlethings.org" className="underline font-semibold">
                    info@helpingalllittlethings.org
                  </a>{' '}
                  and then return to complete this application.
                </InfoBox>
              )}

              <div className="flex justify-between mt-6">
                <button type="button" onClick={() => setStep(1)} className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2">
                  ← Back
                </button>
                <button type="button" onClick={() => setStep(3)} className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
                  Next: Application Details →
                </button>
              </div>
            </div>
          )}

          {/* ================================================================
              STEP 3 — APPLICATION DETAILS
          ================================================================ */}
          {step === 3 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <SectionHeader title="Application Details" />

              <FormField label="Today's date" name="applicationDate" required>
                <TextInput
                  name="applicationDate" type="date" required
                  value={form.applicationDate} onChange={(e) => set('applicationDate', e.target.value)}
                />
              </FormField>

              <FormField label="Are you applying to foster or adopt?" name="fosterOrAdopt" required>
                <RadioGroup
                  name="fosterOrAdopt" required
                  options={[
                    { value: 'adopt', label: 'Adopt' },
                    { value: 'foster', label: 'Foster' },
                    { value: 'either', label: 'Either — open to both' },
                  ]}
                  value={form.fosterOrAdopt}
                  onChange={(v) => set('fosterOrAdopt', v)}
                />
              </FormField>

              <FormField
                label="What type of animal are you hoping to foster or adopt?"
                name="animalTypes" required
                hint="Select all that apply."
              >
                <CheckboxGroup
                  name="animalTypes"
                  options={ANIMAL_TYPES}
                  values={form.animalTypes}
                  onChange={(v) => set('animalTypes', v)}
                />
              </FormField>

              <FormField label="What is your preference for the sex of your new pet?" name="sexPreference">
                <RadioGroup
                  name="sexPreference"
                  options={[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                    { value: 'no_preference', label: 'No preference' },
                  ]}
                  value={form.sexPreference}
                  onChange={(v) => set('sexPreference', v)}
                />
              </FormField>

              <FormField label="Do you have a preference for the age of your new pet?" name="agePreferences">
                <CheckboxGroup
                  name="agePreferences"
                  options={AGE_PREFS}
                  values={form.agePreferences}
                  onChange={(v) => set('agePreferences', v)}
                />
              </FormField>

              <FormField label="What is your reason for wanting a new pet?" name="reasonForPet" required>
                <TextArea
                  name="reasonForPet" required rows={4}
                  value={form.reasonForPet} onChange={(e) => set('reasonForPet', e.target.value)}
                  placeholder="Please share your motivation for adopting or fostering..."
                />
              </FormField>

              <FormField label="What other types of pets have you considered?" name="otherPetsConsidered">
                <TextArea
                  name="otherPetsConsidered" rows={3}
                  value={form.otherPetsConsidered} onChange={(e) => set('otherPetsConsidered', e.target.value)}
                />
              </FormField>

              <div className="flex justify-between mt-6">
                <button type="button" onClick={() => setStep(2)} className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2">← Back</button>
                <button type="button" onClick={() => setStep(4)} className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
                  Next: Household & Lifestyle →
                </button>
              </div>
            </div>
          )}

          {/* ================================================================
              STEP 4 — HOUSEHOLD & LIFESTYLE
          ================================================================ */}
          {step === 4 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <SectionHeader title="Household & Lifestyle" />

              <FormField label="Approximately how many hours each day will your new pet receive attention?" name="hoursAttention" required>
                <TextInput
                  name="hoursAttention" required
                  value={form.hoursAttention} onChange={(e) => set('hoursAttention', e.target.value)}
                  placeholder="e.g. 2–4 hours"
                />
              </FormField>

              <FormField label="Where will your pet reside when you are at home?" name="petLocationHome" required>
                <TextArea
                  name="petLocationHome" required rows={3}
                  value={form.petLocationHome} onChange={(e) => set('petLocationHome', e.target.value)}
                  placeholder="e.g. Living room, bedroom, dedicated pet room..."
                />
              </FormField>

              <FormField label="Where will your pet reside when you are not at home?" name="petLocationAway" required>
                <TextArea
                  name="petLocationAway" required rows={3}
                  value={form.petLocationAway} onChange={(e) => set('petLocationAway', e.target.value)}
                  placeholder="e.g. In their cage in the living room..."
                />
              </FormField>

              <FormField
                label="Please describe all people currently living at your residence"
                name="householdMembers" required
                hint="Include name, age, and relationship. Example: 1. Bob, 45, father. 2. Robyn, 46, mother."
              >
                <TextArea
                  name="householdMembers" required rows={4}
                  value={form.householdMembers} onChange={(e) => set('householdMembers', e.target.value)}
                />
              </FormField>

              <FormField
                label="For all pets currently and previously in your home, please provide details"
                name="currentPreviousPets" required
                hint="Include Name, Breed, Sex, Age, Years Owned, and where they were kept. If no longer owned, please explain why. Example: 1. Fluffy, Poodle, Male, 6 years old, 6 years owned, lives in our house."
              >
                <TextArea
                  name="currentPreviousPets" required rows={5}
                  value={form.currentPreviousPets} onChange={(e) => set('currentPreviousPets', e.target.value)}
                />
              </FormField>

              <FormField label="Have you ever surrendered or rehomed a pet?" name="everSurrendered" required>
                <RadioGroup
                  name="everSurrendered" required
                  options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
                  value={form.everSurrendered}
                  onChange={(v) => set('everSurrendered', v)}
                />
              </FormField>

              {form.everSurrendered === 'yes' && (
                <FormField label="Please explain the situation" name="surrenderExplanation" required>
                  <TextArea
                    name="surrenderExplanation" required rows={4}
                    value={form.surrenderExplanation} onChange={(e) => set('surrenderExplanation', e.target.value)}
                  />
                </FormField>
              )}

              <FormField
                label="Does anyone in your household have any known allergies to animals?"
                name="allergies" required
                hint="If yes, please describe."
              >
                <TextArea
                  name="allergies" required rows={3}
                  value={form.allergies} onChange={(e) => set('allergies', e.target.value)}
                  placeholder="No known allergies, or describe any allergies..."
                />
              </FormField>

              <FormField
                label="Do you have a veterinarian you plan to use with your new pet?"
                name="veterinarian"
                hint="If yes, please provide name, location, and phone number. Note: all current pets must receive regular veterinary care and be up to date on shots to be eligible to adopt from HALT."
              >
                <TextArea
                  name="veterinarian" rows={3}
                  value={form.veterinarian} onChange={(e) => set('veterinarian', e.target.value)}
                  placeholder="Vet name, clinic name, city, phone number..."
                />
              </FormField>

              <FormField label="Would you like us to recommend a veterinarian in your area?" name="wantVetRecommendation">
                <RadioGroup
                  name="wantVetRecommendation"
                  options={[{ value: 'yes', label: 'Yes, please' }, { value: 'no', label: 'No, thank you' }]}
                  value={form.wantVetRecommendation}
                  onChange={(v) => set('wantVetRecommendation', v)}
                />
              </FormField>

              <FormField label="How often will your pet receive veterinary care?" name="vetCareFrequency" required>
                <TextInput
                  name="vetCareFrequency" required
                  value={form.vetCareFrequency} onChange={(e) => set('vetCareFrequency', e.target.value)}
                  placeholder="e.g. Annual checkups, as needed, etc."
                />
              </FormField>

              <FormField label="How much money do you expect to spend on care and food per year?" name="annualBudget" required>
                <TextInput
                  name="annualBudget" required
                  value={form.annualBudget} onChange={(e) => set('annualBudget', e.target.value)}
                  placeholder="e.g. $300–$500 per year"
                />
              </FormField>

              <FormField label="What do you plan to feed your new pet?" name="plannedDiet" required>
                <TextArea
                  name="plannedDiet" required rows={3}
                  value={form.plannedDiet} onChange={(e) => set('plannedDiet', e.target.value)}
                  placeholder="Describe the diet you plan to provide..."
                />
              </FormField>

              <FormField label="Have you ever owned this type of pet before?" name="ownedThisTypeBefore" required>
                <RadioGroup
                  name="ownedThisTypeBefore" required
                  options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
                  value={form.ownedThisTypeBefore}
                  onChange={(v) => set('ownedThisTypeBefore', v)}
                />
              </FormField>

              <div className="flex justify-between mt-6">
                <button type="button" onClick={() => setStep(3)} className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2">← Back</button>
                <button type="button" onClick={() => setStep(5)} className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
                  Next: Care & References →
                </button>
              </div>
            </div>
          )}

          {/* ================================================================
              STEP 5 — CARE & REFERENCES
          ================================================================ */}
          {step === 5 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <SectionHeader title="Care & References" />

              <FormField
                label="What type and size cage will you use for your new pet?"
                name="cageDescription" required
                hint="Please describe the cage dimensions, style, and any enrichment you plan to provide."
              >
                <TextArea
                  name="cageDescription" required rows={4}
                  value={form.cageDescription} onChange={(e) => set('cageDescription', e.target.value)}
                />
              </FormField>

              <FormField label="What will you use to line the bottom of the cage?" name="cageBedding" required>
                <TextArea
                  name="cageBedding" required rows={3}
                  value={form.cageBedding} onChange={(e) => set('cageBedding', e.target.value)}
                  placeholder="e.g. Fleece liners, paper bedding, etc."
                />
              </FormField>

              <FormField
                label="Are you aware that some small animals may need to be brushed daily and may need their nails checked and trimmed regularly?"
                name="awareBrushingNails" required
              >
                <RadioGroup
                  name="awareBrushingNails" required
                  options={[
                    { value: 'yes', label: 'Yes, I am aware and prepared for this' },
                    { value: 'no', label: 'No, I was not aware' },
                  ]}
                  value={form.awareBrushingNails}
                  onChange={(v) => set('awareBrushingNails', v)}
                />
              </FormField>

              <FormField label="Who will clip the animal's nails, if necessary?" name="nailClipper" required>
                <TextInput
                  name="nailClipper" required
                  value={form.nailClipper} onChange={(e) => set('nailClipper', e.target.value)}
                  placeholder="e.g. Myself, a groomer, our veterinarian..."
                />
              </FormField>

              <FormField
                label="Please provide the name and phone number of 3 references"
                name="references" required
                hint="References should not be family members. We will contact them as part of the approval process."
              >
                <TextArea
                  name="references" required rows={5}
                  value={form.references} onChange={(e) => set('references', e.target.value)}
                  placeholder="1. Name, phone number, relationship&#10;2. Name, phone number, relationship&#10;3. Name, phone number, relationship"
                />
              </FormField>

              <InfoBox variant="info">
                <p className="mb-2">
                  <strong>Thank you for taking the time to fill out this application.</strong>
                </p>
                <p className="text-sm">
                  A donation fee is asked and greatly appreciated to help defray the costs associated
                  with the foster care and placement of a new pet. We will check your references and
                  may require a home visit before an adoption can be approved. These steps are taken
                  to protect the animal from any further upset.
                </p>
              </InfoBox>

              <InfoBox variant="warning">
                <strong>Reminder:</strong> Please add{' '}
                <strong>info@helpingalllittlethings.org</strong> to your contacts and check your
                spam folder so you don&apos;t miss our response.
              </InfoBox>

              <div className="flex justify-between mt-6">
                <button type="button" onClick={() => setStep(4)} className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2">← Back</button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-emerald-600 text-white px-10 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    'Submit Application 🐾'
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
