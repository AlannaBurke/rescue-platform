'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FormField,
  TextInput,
  TextArea,
  Select,
  RadioGroup,
  SectionHeader,
  InfoBox,
} from '@/components/forms/FormField';

interface PetData {
  species: string;
  speciesOther: string;
  name: string;
  sex: string;
  age: string;
  diet: string;
  medicalIssues: string;
  hasMedicalIssues: string;
  physicalCondition: string;
  hasPhysicalCondition: string;
  surrenderReason: string;
  source: string;
}

interface FormData {
  // Owner info
  email: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  // Surrender details
  previouslyAdoptedFromHalt: string;
  numberOfPets: string;
  pets: PetData[];
}

const SPECIES_OPTIONS = [
  { value: 'guinea_pig', label: 'Guinea Pig' },
  { value: 'hamster', label: 'Hamster' },
  { value: 'gerbil', label: 'Gerbil' },
  { value: 'mouse', label: 'Mouse' },
  { value: 'chinchilla', label: 'Chinchilla' },
  { value: 'hedgehog', label: 'Hedgehog' },
  { value: 'ferret', label: 'Ferret' },
  { value: 'other', label: 'Other' },
];

const SEX_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'unknown', label: 'Unknown' },
];

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY','DC',
].map((s) => ({ value: s, label: s }));

const emptyPet = (): PetData => ({
  species: '',
  speciesOther: '',
  name: '',
  sex: '',
  age: '',
  diet: '',
  hasMedicalIssues: '',
  medicalIssues: '',
  hasPhysicalCondition: '',
  physicalCondition: '',
  surrenderReason: '',
  source: '',
});

export default function SurrenderPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<FormData>({
    email: '',
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    previouslyAdoptedFromHalt: '',
    numberOfPets: '1',
    pets: [emptyPet()],
  });

  const setField = (field: keyof Omit<FormData, 'pets'>, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const setPetCount = (count: string) => {
    const n = parseInt(count, 10);
    const pets = Array.from({ length: n }, (_, i) => form.pets[i] ?? emptyPet());
    setForm((prev) => ({ ...prev, numberOfPets: count, pets }));
  };

  const setPet = (index: number, field: keyof PetData, value: string) => {
    setForm((prev) => {
      const pets = [...prev.pets];
      pets[index] = { ...pets[index], [field]: value };
      return { ...prev, pets };
    });
  };

  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      const firstPet = form.pets[0] || {};
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webform_id: 'surrender_intake',
          owner_name: `${form.firstName} ${form.lastName}`.trim(),
          owner_email: form.email,
          owner_phone: '',
          animal_name: (firstPet as PetData).name || 'Unknown',
          animal_species: (firstPet as PetData).species || 'other',
          animal_age: (firstPet as PetData).age || 'Unknown',
          animal_sex: (firstPet as PetData).sex || 'unknown',
          spayed_neutered: 'unknown',
          health_issues: (firstPet as PetData).medicalIssues || '',
          reason_for_surrender: (firstPet as PetData).surrenderReason || '',
          timeline: 'flexible',
          additional_info: JSON.stringify({
            address: `${form.street}, ${form.city}, ${form.state} ${form.zipCode}`,
            previouslyAdoptedFromHalt: form.previouslyAdoptedFromHalt,
            numberOfPets: form.numberOfPets,
            allPets: form.pets,
          }),
        }),
      });
      const data = await response.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setSubmitError(data.error || 'Submission failed. Please try again.');
      }
    } catch {
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
          <div className="text-6xl mb-4">🐾</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Surrender Form Submitted</h1>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Thank you for reaching out to Helping All Little Things. We have received your surrender
            request and will be in touch as soon as possible to discuss next steps.
          </p>
          <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
            <strong>Important:</strong> Please add <strong>info@helpingalllittlethings.org</strong> to
            your contacts and check your spam folder so you don&apos;t miss our reply.
          </p>
          <Link
            href="/"
            className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-amber-700 text-white py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-amber-200 text-sm mb-3">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span>Surrender a Pet</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Animal Surrender Request</h1>
          <p className="text-amber-100 text-sm">
            Helping All Little Things Rescue
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* ── Important Notices ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <SectionHeader title="Before You Submit" />

            <InfoBox variant="warning">
              <p className="font-bold mb-1">We are no longer accepting rabbits or rats for surrender.</p>
              <p className="text-sm">
                Please understand that every shelter, rescue, and volunteer are absolutely full to
                the brim right now and we are doing all we can. If there is anything we can do to
                help you keep your pet, please reach out to us via email at{' '}
                <a href="mailto:info@helpingalllittlethings.org" className="underline font-semibold">
                  info@helpingalllittlethings.org
                </a>.
              </p>
            </InfoBox>

            <InfoBox variant="info">
              <p className="font-semibold mb-2">What happens when you surrender your pet:</p>
              <p className="text-sm mb-2">
                When you surrender your pet, Helping All Little Things assumes legal ownership and
                all responsibility for that pet&apos;s ongoing care. Surrendered pets that are
                healthy or able to be rehabilitated may be adopted to a new loving home after a
                successful adoption application.
              </p>
              <p className="text-sm">
                Surrendered pets with serious or chronic health issues are likely to stay at Helping
                All Little Things as sanctuary residents for the remainder of their lives.
              </p>
            </InfoBox>

            <InfoBox variant="warning">
              <strong>Please note:</strong> Submission of this form may prohibit you from adopting
              from us in the future.
            </InfoBox>
          </div>

          {/* ── Owner Information ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <SectionHeader title="Your Information" />

            <FormField label="Email address" name="email" required>
              <TextInput
                name="email" type="email" required
                value={form.email} onChange={(e) => setField('email', e.target.value)}
                placeholder="you@example.com"
              />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <FormField label="First name" name="firstName" required>
                <TextInput
                  name="firstName" required
                  value={form.firstName} onChange={(e) => setField('firstName', e.target.value)}
                />
              </FormField>

              <FormField label="Last name" name="lastName" required>
                <TextInput
                  name="lastName" required
                  value={form.lastName} onChange={(e) => setField('lastName', e.target.value)}
                />
              </FormField>

              <div className="md:col-span-2">
                <FormField label="Street address" name="street" required>
                  <TextInput
                    name="street" required
                    value={form.street} onChange={(e) => setField('street', e.target.value)}
                  />
                </FormField>
              </div>

              <FormField label="City" name="city" required>
                <TextInput
                  name="city" required
                  value={form.city} onChange={(e) => setField('city', e.target.value)}
                />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="State" name="state" required>
                  <Select
                    name="state" required
                    value={form.state} onChange={(e) => setField('state', e.target.value)}
                    options={US_STATES} placeholder="Select"
                  />
                </FormField>
                <FormField label="Zip code" name="zipCode" required>
                  <TextInput
                    name="zipCode" required
                    value={form.zipCode} onChange={(e) => setField('zipCode', e.target.value)}
                    placeholder="12345"
                  />
                </FormField>
              </div>
            </div>

            <FormField
              label="Were the pets you are surrendering previously adopted from the Pipsqueakery, Pipswheekery, or HALP/HALT?"
              name="previouslyAdoptedFromHalt" required
            >
              <RadioGroup
                name="previouslyAdoptedFromHalt" required
                options={[
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' },
                  { value: 'unsure', label: 'Not sure' },
                ]}
                value={form.previouslyAdoptedFromHalt}
                onChange={(v) => setField('previouslyAdoptedFromHalt', v)}
              />
            </FormField>

            <FormField label="How many pets do you need to surrender?" name="numberOfPets" required>
              <Select
                name="numberOfPets" required
                value={form.numberOfPets}
                onChange={(e) => setPetCount(e.target.value)}
                options={[
                  { value: '1', label: '1 pet' },
                  { value: '2', label: '2 pets' },
                  { value: '3', label: '3 pets' },
                  { value: '4', label: '4 pets' },
                  { value: '5', label: '5 pets' },
                  { value: '6', label: '6 pets' },
                ]}
              />
            </FormField>
          </div>

          {/* ── Per-Pet Information ── */}
          {form.pets.map((pet, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <SectionHeader
                title={form.pets.length > 1 ? `Pet ${index + 1} of ${form.pets.length}` : 'Information About Your Pet'}
                description="Please fill out the following information for each pet you intend to surrender."
              />

              <FormField label="Species" name={`species_${index}`} required>
                <Select
                  name={`species_${index}`} required
                  value={pet.species}
                  onChange={(e) => setPet(index, 'species', e.target.value)}
                  options={SPECIES_OPTIONS}
                  placeholder="Select species"
                />
                {pet.species === 'other' && (
                  <TextInput
                    name={`speciesOther_${index}`}
                    className="mt-3"
                    value={pet.speciesOther}
                    onChange={(e) => setPet(index, 'speciesOther', e.target.value)}
                    placeholder="Please specify species"
                  />
                )}
              </FormField>

              <FormField label="Pet's name" name={`name_${index}`} required>
                <TextInput
                  name={`name_${index}`} required
                  value={pet.name}
                  onChange={(e) => setPet(index, 'name', e.target.value)}
                />
              </FormField>

              <FormField label="Sex" name={`sex_${index}`} required>
                <RadioGroup
                  name={`sex_${index}`} required
                  options={SEX_OPTIONS}
                  value={pet.sex}
                  onChange={(v) => setPet(index, 'sex', v)}
                />
              </FormField>

              <FormField label="Age" name={`age_${index}`} required hint="e.g. 2 years, 6 months, unknown">
                <TextInput
                  name={`age_${index}`} required
                  value={pet.age}
                  onChange={(e) => setPet(index, 'age', e.target.value)}
                  placeholder="e.g. 2 years"
                />
              </FormField>

              <FormField
                label="Where did you get this animal?"
                name={`source_${index}`} required
                hint="Please list the rescue, shelter, breeder, or other source."
              >
                <TextArea
                  name={`source_${index}`} required rows={3}
                  value={pet.source}
                  onChange={(e) => setPet(index, 'source', e.target.value)}
                  placeholder="e.g. Adopted from HALT in 2022, purchased from a pet store, found as a stray..."
                />
              </FormField>

              <FormField label="Current diet" name={`diet_${index}`} required hint="Describe what you currently feed this pet, including pellets, hay, fresh vegetables, treats, etc.">
                <TextArea
                  name={`diet_${index}`} required rows={3}
                  value={pet.diet}
                  onChange={(e) => setPet(index, 'diet', e.target.value)}
                  placeholder="e.g. Oxbow pellets, unlimited timothy hay, daily fresh vegetables..."
                />
              </FormField>

              {/* ── Medical Issues (new expanded field) ── */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
                <h3 className="text-sm font-bold text-amber-900 mb-4 uppercase tracking-wide">
                  Health Information
                </h3>

                <FormField
                  label="Does this pet have any known medical issues?"
                  name={`hasMedicalIssues_${index}`} required
                  hint="Include any diagnosed conditions, ongoing treatments, medications, or veterinary history."
                >
                  <RadioGroup
                    name={`hasMedicalIssues_${index}`} required
                    options={[
                      { value: 'no', label: 'No known medical issues' },
                      { value: 'yes', label: 'Yes — please describe below' },
                    ]}
                    value={pet.hasMedicalIssues}
                    onChange={(v) => setPet(index, 'hasMedicalIssues', v)}
                  />
                  {pet.hasMedicalIssues === 'yes' && (
                    <TextArea
                      name={`medicalIssues_${index}`}
                      className="mt-3"
                      rows={4}
                      value={pet.medicalIssues}
                      onChange={(e) => setPet(index, 'medicalIssues', e.target.value)}
                      placeholder="Please describe all known medical conditions, diagnoses, medications, and any recent veterinary visits..."
                    />
                  )}
                </FormField>

                <FormField
                  label="Does this pet have any physical conditions or special needs we should be aware of?"
                  name={`hasPhysicalCondition_${index}`} required
                  hint="Include mobility issues, missing limbs, blindness, deafness, dental problems, skin conditions, weight concerns, or any other physical characteristics that affect care."
                >
                  <RadioGroup
                    name={`hasPhysicalCondition_${index}`} required
                    options={[
                      { value: 'no', label: 'No physical conditions or special needs' },
                      { value: 'yes', label: 'Yes — please describe below' },
                    ]}
                    value={pet.hasPhysicalCondition}
                    onChange={(v) => setPet(index, 'hasPhysicalCondition', v)}
                  />
                  {pet.hasPhysicalCondition === 'yes' && (
                    <TextArea
                      name={`physicalCondition_${index}`}
                      className="mt-3"
                      rows={4}
                      value={pet.physicalCondition}
                      onChange={(e) => setPet(index, 'physicalCondition', e.target.value)}
                      placeholder="Please describe any physical conditions, mobility limitations, sensory impairments, or special care requirements..."
                    />
                  )}
                </FormField>
              </div>

              <FormField
                label="Reason for surrender"
                name={`surrenderReason_${index}`} required
                hint="Please be as detailed as possible. This information helps us provide the best possible care and find the right home."
              >
                <TextArea
                  name={`surrenderReason_${index}`} required rows={5}
                  value={pet.surrenderReason}
                  onChange={(e) => setPet(index, 'surrenderReason', e.target.value)}
                  placeholder="Please explain why you are surrendering this pet..."
                />
              </FormField>
            </div>
          ))}

          {/* ── Submit ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <InfoBox variant="warning">
              <strong>Before you submit:</strong> Please make sure all information is accurate and
              complete. Providing complete health information is critical to ensuring your pet
              receives proper care from day one.
            </InfoBox>
            <InfoBox variant="info">
              <strong>Reminder:</strong> Please add{' '}
              <strong>info@helpingalllittlethings.org</strong> to your contacts and check your spam
              folder so you don&apos;t miss our response.
            </InfoBox>

            {submitError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <strong>Error:</strong> {submitError}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="bg-amber-600 text-white px-10 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
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
                  'Submit Surrender Request'
                )}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
