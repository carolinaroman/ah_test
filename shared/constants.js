/**
 * @fileoverview
 *
 * This file contains values extracted from providers.csv (including the
 * columns of mock data I added), to create a shared list of values for
 * backend and frontend. These values are used in the frontend components
 * in the onboarding form, and in backend to validate the frontend
 * request.
 *
 * In the case of Areas of Concern and Therapy Modalities, I gathered
 * all possible values from the mock data, and created a broader
 * category. Then the array contains all possible terms in this category
 * that exists in the mock data. This allows me to show the user only
 * 10 categories for concerns, instead of 32. Same for therapy types,
 */

/**
 * The keys are the simplified categories for display to patients
 * The array are the corresponding strings found in the csv
 */
export const concernsMapping = {
  "ADHD & Autism": [
    "ADHD",
    "Attention Deficit Hyperactivity Disorder (ADD/ADHD)",
    "Autism",
  ],
  "Anxiety, Panic & Worry": [
    "Anxiety",
    "Panic attacks",
    "Social fears",
    "Worry",
  ],
  "Behavioral Health": [
    "Anger management",
    "Eating Disorders",
    "Sleep problems",
    "Substance use disorder",
  ],
  "Cultural & Identity": [
    "Culturally-responsive treatments",
    "Ethnicity and racial identity related issues and/or trauma",
    "LGBTQ+ related concerns",
  ],
  "Depression & Mood Disorders": [
    "Depression",
    "Low self-esteem",
    "Mood disorder",
  ],
  "Grief & Loss": ["Grief/bereavement"],
  "Mental Health Conditions": [
    "Impulse-control difficulties",
    "OCD",
    "Personality disorders",
  ],
  "Relationships & Social": [
    "Interpersonal problems",
    "Relationship difficulties",
    "Sexual concerns",
  ],
  "Trauma & PTSD": [
    "Post-Traumatic Stress Disorder (PTSD)",
    "Race-based trauma",
    "Trauma therapy",
    "Trauma-related stress",
  ],
  "Work & Life Challenges": [
    "Academic stress",
    "Major life transitions",
    "Occupation-related stress",
    "Work-related stress",
  ],
};

/**
 * Therapist preferences
 */
export const gender = ["female", "male", "no preference"];

export const ethnicity = [
  "African American",
  "Asian American, Taiwanese",
  "Chinese American",
  "Chinese Canadian",
  "Chinese Taiwanese American",
  "Indian",
  "Korean American",
  "Mixed - half indian half white",
  "South Asian- Mixed , Sri Lankan",
  "Southeast Asian",
  "Taiwanese American",
  "Vietnamese",
  "White/Caucasian",
  "No preference",
];

export const languages = [
  "Cantonese",
  "English",
  "French",
  "Hindi",
  "Korean",
  "Mandarin",
  "Spanish",
  "Tagalog",
  "Vietnamese",
  "No preference",
];

export const religion = [
  "Buddhist",
  "Catholic",
  "Christian",
  "Hindu",
  "Muslim",
  // "Prefer not to say",
  "Non-religious", // Placed at the end,
  "No preference",
];

export const therapyTypes = {
  "Behavioral & Motivational": [
    "Dialectical Behavioral Therapy (DBT)",
    "MI",
    "Motivational Interviewing",
  ],
  "Cognitive Behavioral Approaches": [
    "Acceptance and Commitment Therapy (ACT)",
    "Cognitive Behavioral Therapy (CBT)",
    "Mindfulness-Based (MBCT)",
    "Trauma Focused CBT",
  ],
  "Creative & Narrative": ["Art Therapy", "Narrative Therapy"],
  "Psychodynamic & Person-Centered": [
    "Person Centered Therapy",
    "Psychodynamic therapy",
  ],
  "Relationship & Family": [
    "Contextual Therapy",
    "Emotionally Focused Therapy",
    "Family Systems Therapy",
    "Relational-Cultural Therapy",
    "Restoration Therapy",
  ],
  "Trauma & EMDR": ["EMDR", "Prolonged Exposure Therapy"],
};

export const insurances = [
  "Aetna",
  "Anthem",
  "Blue Cross Blue Shield",
  "Centene",
  "Cigna",
  "Empire BlueCross",
  "HealthNet",
  "Humana",
  "Kaiser Permanente",
  "Medicare",
  "Molina Healthcare",
  "Optum",
  "Oxford Health Plans",
  "UnitedHealthcare",
  "Self Pay",
];
