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
        matchScore: 6,
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
      "ethnic identity": "Chinese Taiwanese American",
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
      "ethnic identity": "Chinese Taiwanese American",
      gender: "Female",
    };

    const result = await matcher.getMatches(filters);

    expect(result.length).toBe(1);
    expect(result.map((provider) => provider["first name"])).toEqual(
      expect.arrayContaining(["Grace"]),
    );
  });
});
