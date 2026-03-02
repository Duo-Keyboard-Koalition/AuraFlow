const { Amplify } = require('aws-amplify');

// Configure Amplify for testing
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_snDsTRJao',
      userPoolClientId: 'mlmdtd1m0oft5tfu9onc2cgug',
      identityPoolId: 'us-east-1:5c7aee37-ba06-4240-ae73-50536f25153a',
      signUpVerificationMethod: 'code',
      loginWith: {
        email: true,
      },
    },
  },
  API: {
    GraphQL: {
      endpoint: 'https://tjp54xmqyzep3kzphk7rxxx7p4.appsync-api.us-east-1.amazonaws.com/graphql',
      region: 'us-east-1',
      defaultAuthMode: 'userPool',
    },
  },
});

console.log('✅ Amplify Configuration Loaded');
console.log('User Pool ID:', 'us-east-1_snDsTRJao');
console.log('User Pool Client ID:', 'mlmdtd1m0oft5tfu9onc2cgug');
console.log('Identity Pool ID:', 'us-east-1:5c7aee37-ba06-4240-ae73-50536f25153a');
console.log('GraphQL Endpoint:', 'https://tjp54xmqyzep3kzphk7rxxx7p4.appsync-api.us-east-1.amazonaws.com/graphql');

console.log('\n🎯 Cognito Authentication Test Ready!');
console.log('Visit: http://localhost:3000/cognito-test');
console.log('Or visit: http://localhost:3000/test-auth'); 