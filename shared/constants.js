export const specializations = [
  "depression",
  "anxiety",
  "academic stress",
  "insomnia",
  "racial identity issues",
  "trauma related stress",
  "work related stress",
];

/**
 * The keys are the simplified categories for display to patients
 * The array are the corresponding strings found in the csv
 */
const concernsMapping = {
  "Depression & Mood Disorders": [
    "Depression",
    "Low self-esteem",
    "Mood disorder"
  ],
  "Anxiety, Panic & Worry": [
    "Anxiety",
    "Panic attacks",
    "Worry",
    "Social fears"
  ],
  "Trauma & PTSD": [
    "Post-Traumatic Stress Disorder (PTSD)",
    "Trauma-related stress",
    "Race-based trauma",
    "Trauma therapy"
  ],
  "Cultural & Identity": [
    "Ethnicity and racial identity related issues and/or trauma",
    "LGBTQ+ related concerns",
    "Culturally-responsive treatments"
  ],
  "Work & Life Challenges": [
    "Major life transitions",
    "Academic stress",
    "Occupation-related stress",
    "Work-related stress"
  ],
  "Relationships & Social": [
    "Interpersonal problems",
    "Relationship difficulties",
    "Sexual concerns"
  ],
  "ADHD & Autism": [
    "Attention Deficit Hyperactivity Disorder (ADD/ADHD)",
    "ADHD",
    "Autism"
  ],
  "Mental Health Conditions": [
    "OCD",
    "Personality disorders",
    "Impulse-control difficulties"
  ],
  "Behavioral Health": [
    "Anger management",
    "Substance use disorder",
    "Eating Disorders",
    "Sleep problems"
  ],
  "Grief & Loss": [
    "Grief/bereavement"
  ]
};

const therapyTypesMapping = {
  "Cognitive Behavioral Approaches": [
    "CBT",
    "Cognitive Behavioral Therapy (CBT)",
    "Trauma Focused CBT",
    "Mindfulness-Based (MBCT)",
    "Acceptance and Commitment Therapy (ACT)"
  ],
  "Trauma & EMDR": [
    "EMDR",
    "Prolonged Exposure Therapy"
  ],
  "Relationship & Family": [
    "Family Systems Therapy",
    "Emotionally Focused Therapy",
    "Relational-Cultural Therapy",
    "Contextual Therapy",
    "Restoration Therapy"
  ],
  "Psychodynamic & Person-Centered": [
    "Psychodynamic therapy",
    "Psychodynamic",
    "Person Centered Therapy"
  ],
  "Behavioral & Motivational": [
    "Dialectical Behavioral Therapy (DBT)",
    "Motivational Interviewing",
    "MI"
  ],
  "Creative & Narrative": [
    "Art Therapy",
    "Narrative Therapy"
  ],
  "Other Approaches": [
    "Therapist's Recommendation"
  ]
};

// Utility functions for therapy types
const getTherapyDisplayCategory = (originalType) => {
  for (const [displayCategory, originalTypes] of Object.entries(therapyTypesMapping)) {
    if (originalTypes.includes(originalType)) {
      return displayCategory;
    }
  }
  return null;
};


const insurances = [
  "Aetna",
  "Blue Cross Blue Shield",
  "Cigna",
  "Kaiser Permanente",
  "UnitedHealthcare",
  "Anthem",
  "Humana",
  "Oxford Health Plans",
  "Empire BlueCross",
  "Medicare",
  "HealthNet",
  "Optum",
  "Molina Healthcare",
  "Centene",
  "Self Pay"
]

const languages = [
  "English",
  "Hindi",
  "French",
  "Spanish",
  "Korean",
  "Mandarin",
  "Tagalog",
  "Cantonese",
  "Vietnamese",
];

const religion = [
  "None",
  "Buddhist",
  "Hindu",
  "Catholic",
  "Prefer not to say", // Joe Tanaka
  "Christian",
  "Muslim"
]

