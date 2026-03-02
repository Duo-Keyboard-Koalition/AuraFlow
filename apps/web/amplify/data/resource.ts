import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  User: a
    .model({
      email: a.string().required(),
      firstName: a.string(),
      lastName: a.string(),
      accountType: a.enum(['influencer', 'brand']),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner(),
    ]),

  Influencer: a
    .model({
      userId: a.string().required(),
      displayName: a.string().required(),
      bio: a.string(),
      location: a.string(),
      website: a.string(),
      platforms: a.string(), // JSON string of platforms
      followerCount: a.string(),
      contentCategories: a.string(), // JSON string of categories
      personalValues: a.string(), // JSON string of values
      contentStyle: a.string(),
      audienceAge: a.string(),
      audienceGender: a.string(),
      profileImage: a.string(),
      isVerified: a.boolean().default(false),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner(),
    ]),

  Brand: a
    .model({
      userId: a.string().required(),
      companyName: a.string().required(),
      displayName: a.string().required(),
      bio: a.string(),
      location: a.string(),
      website: a.string(),
      industry: a.string(),
      companySize: a.string(),
      brandValues: a.string(), // JSON string of values
      missionStatement: a.string(),
      targetAudience: a.string(),
      logo: a.string(),
      isVerified: a.boolean().default(false),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner(),
    ]),

  MatchRequest: a
    .model({
      userId: a.string().required(),
      brandId: a.string().required(),
      influencerId: a.string().required(),
      status: a.enum(['pending', 'processing', 'completed', 'failed']),
      brandValues: a.string(), // JSON string of values
      missionStatement: a.string(),
      targetEmotion: a.string(),
      results: a.string(), // JSON string of results
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner(),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'identityPool',
  },
});
