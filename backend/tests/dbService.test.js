import { ProviderMatcher } from "../database/dbService.js";

describe("ProviderMatcher", () => {
  let matcher;

  beforeEach(async () => {
    matcher = new ProviderMatcher();

    await matcher.initialize();
  });

  test("should find Nancy Nguyen when filtering by TX state only", async () => {
    const filters = {
      state: "TX",
      "payment method": "Self Pay",
      religion: "no preference",
      ethnicity: "no preference",
      gender: "no preference",
      language: "no preference",
    };

    const expectedProvider = [
      {
        "first name": "Nancy",
        "last name": "Nguyen",
        "ethnic identity": "Vietnamese",
        "gender identity": "Female",
        "no of clients able to take on": "15",
        language: "English,Vietnamese",
        location: "FL, CA",
        bio: "I specialize in working with individuals with ADHD to develop strategies for focus, organization, and emotional regulation. Whether you're a child, teen, or adult, I'm here to help you harness your strengths and achieve your goals.",
        "sexual orientation": "Bisexual / pansexual",
        "religious background": "Christian",
        "treatment modality":
          "Trauma Focused CBT, Psychodynamic, Relational-Cultural Therapy, Art Therapy",
        "areas of specialization":
          "Depression, Low self-esteem, Ethnicity and racial identity related issues and/or trauma, LGBTQ+ related concerns, Social fears, Interpersonal problems, Relationship difficulties, Academic stress, Occupation-related stress, Major life transitions, Anxiety, Panic attacks, Worry, Culturally-responsive treatments",
        "state licensed": "FL, CA, TX",
        matchScore: "0",
        "insurance accepted":
          "Aetna, Cigna, UnitedHealthcare, HealthNet, Molina Healthcare, Self Pay",
      },
    ];

    const result = await matcher.getMatches(filters);

    expect(result).toEqual(expectedProvider);
  });

  test("should find providers when filtering by NY state and Empire BlueCross insurance", async () => {
    const filters = {
      state: "NY",
      "payment method": "Empire BlueCross",
      religion: "no preference",
      ethnicity: "no preference",
      gender: "no preference",
    };

    const result = await matcher.getMatches(filters);

    expect(result.length).toBe(3);
    expect(result.map((provider) => provider["first name"])).toEqual(
      expect.arrayContaining(["Nisha", "Joe", "Sabreen"]),
    );
  });

  test("should find providers when filtering by CA state, Christian religion and Aetna insurance", async () => {
    const filters = {
      state: "CA",
      "payment method": "Aetna",
      religion: "Christian",
      ethnicity: "no preference",
      gender: "no preference",
    };

    const result = await matcher.getMatches(filters);

    expect(result.length).toBe(2);
    expect(result.map((provider) => provider["first name"])).toEqual(
      expect.arrayContaining(["Nora", "Nancy"]),
    );
  });

  test("should find providers filtering by WA state, Buddhist religion, Blue Cross insurance and Chinese Taiwanese American ethnicity", async () => {
    const filters = {
      state: "WA",
      "payment method": "Blue Cross Blue Shield",
      religion: "Buddhist",
      ethnicity: "Chinese Taiwanese American",
      gender: "no preference",
    };

    const result = await matcher.getMatches(filters);

    expect(result.length).toBe(1);
    expect(result.map((provider) => provider["first name"])).toEqual(
      expect.arrayContaining(["Grace"]),
    );
  });

  test("should find providers filtering by WA state, Buddhist religion, Aetna insurance,  Chinese Taiwanese American ethnicity", async () => {
    const filters = {
      state: "WA",
      "payment method": "Aetna",
      religion: "Buddhist",
      ethnicity: "Chinese Taiwanese American",
      gender: "Female",
    };

    const result = await matcher.getMatches(filters);

    expect(result.length).toBe(1);
    expect(result.map((provider) => provider["first name"])).toEqual(
      expect.arrayContaining(["Grace"]),
    );
  });

  test("should find providers with Trauma & PTSD specialty and Trauma & EMDR approach, respecting No preference selections", async () => {
    const filters = {
      email: "carolina@example.com",
      name: "Carolina Roman",
      state: "CA",
      language: "No preference",
      "concerns_ADHD & Autism": false,
      "concerns_Anxiety, Panic & Worry": false,
      "concerns_Behavioral Health": false,
      "concerns_Cultural & Identity": false,
      "concerns_Depression & Mood Disorders": false,
      "concerns_Grief & Loss": false,
      "concerns_Mental Health Conditions": false,
      "concerns_Relationships & Social": false,
      "concerns_Trauma & PTSD": true,
      "concerns_Work & Life Challenges": false,
      gender: "No preference",
      ethnicity: "No preference",
      religion: "No preference",
      "therapy_Behavioral & Motivational": false,
      "therapy_Cognitive Behavioral Approaches": false,
      "therapy_Creative & Narrative": false,
      "therapy_Psychodynamic & Person-Centered": false,
      "therapy_Relationship & Family": false,
      "therapy_Trauma & EMDR": true,
      "payment method": "Self Pay",
    };

    const result = await matcher.getMatches(filters);

    expect(result.length).toBeGreaterThan(0);
    // All returned providers should have Trauma & PTSD specialty
    result.forEach((provider) => {
      expect(provider["areas of specialization"]).toEqual(
        expect.stringContaining("rauma"),
      );
    });

    // All returned providers should be from Florida
    result.forEach((provider) => {
      expect(provider["state licensed"]).toEqual(expect.stringContaining("CA"));
    });

    // All returned providers should accept Self Pay
    result.forEach((provider) => {
      expect(provider["insurance accepted"]).toEqual(
        expect.stringContaining("Self Pay"),
      );
    });
  });

  test("should find providers with Depression & Mood Disorders specialty in Florida with Self Pay", async () => {
    const filters = {
      email: "carolina.roman@zoho.com",
      name: "Carolina Roman",
      state: "FL",
      language: "No preference",
      "concerns_ADHD & Autism": false,
      "concerns_Anxiety, Panic & Worry": false,
      "concerns_Behavioral Health": false,
      "concerns_Cultural & Identity": false,
      "concerns_Depression & Mood Disorders": true,
      "concerns_Grief & Loss": false,
      "concerns_Mental Health Conditions": false,
      "concerns_Relationships & Social": false,
      "concerns_Trauma & PTSD": false,
      "concerns_Work & Life Challenges": false,
      gender: "no preference",
      ethnicity: "No preference",
      religion: "No preference",
      "therapy_Behavioral & Motivational": false,
      "therapy_Cognitive Behavioral Approaches": false,
      "therapy_Creative & Narrative": false,
      "therapy_Psychodynamic & Person-Centered": false,
      "therapy_Relationship & Family": false,
      "therapy_Trauma & EMDR": false,
      "payment method": "Self Pay",
    };

    const result = await matcher.getMatches(filters);

    console.log(result);

    expect(result.length).toBeGreaterThan(0);

    // All returned providers should have Depression & Mood Disorders specialty
    result.forEach((provider) => {
      expect(provider["areas of specialization"]).toEqual(
        expect.stringContaining("Depression"),
      );
    });

    // All returned providers should be from Florida
    result.forEach((provider) => {
      expect(provider["state licensed"]).toEqual(expect.stringContaining("FL"));
    });

    // All returned providers should accept Self Pay
    result.forEach((provider) => {
      expect(provider["insurance accepted"]).toEqual(
        expect.stringContaining("Self Pay"),
      );
    });
  });
});
