import { Amplify } from 'aws-amplify';

// Import amplify outputs for local development
let amplifyOutputs: any;
try {
  // Use dynamic import for better server-side compatibility
  if (typeof window === 'undefined') {
    // Server-side
    const fs = require('fs');
    const path = require('path');
    const outputsPath = path.join(process.cwd(), 'amplify_outputs.json');
    if (fs.existsSync(outputsPath)) {
      amplifyOutputs = JSON.parse(fs.readFileSync(outputsPath, 'utf8'));
    } else {
      throw new Error('amplify_outputs.json not found');
    }
  } else {
    // Client-side
    amplifyOutputs = require('../amplify_outputs.json');
  }
} catch (error) {
  console.warn('amplify_outputs.json not found, using fallback configuration');
  amplifyOutputs = {
    auth: {
      user_pool_id: 'us-east-1_dyseSxz2I',
      user_pool_client_id: '3g3ndjjhhmf9bnvrkda5uk7788',
      identity_pool_id: 'us-east-1:a34eb943-31ee-4586-92b7-bf3b826ba40c',
      aws_region: 'us-east-1'
    },
    data: {
      url: 'https://dg3vdpz3g5htffnfrq2yt4ow7m.appsync-api.us-east-1.amazonaws.com/graphql',
      aws_region: 'us-east-1'
    }
  };
}

export function getAmplifyConfig() {
  return {
    auth: {
      userPoolId: amplifyOutputs.auth.user_pool_id,
      userPoolClientId: amplifyOutputs.auth.user_pool_client_id,
      identityPoolId: amplifyOutputs.auth.identity_pool_id,
      region: amplifyOutputs.auth.aws_region,
    },
    api: {
      endpoint: amplifyOutputs.data.url,
      region: amplifyOutputs.data.aws_region,
    }
  };
}

export function logAmplifyConfig() {
  const config = getAmplifyConfig();
  console.log('🔧 Current Amplify Configuration:');
  console.log('User Pool ID:', config.auth.userPoolId);
  console.log('User Pool Client ID:', config.auth.userPoolClientId);
  console.log('Identity Pool ID:', config.auth.identityPoolId);
  console.log('GraphQL Endpoint:', config.api.endpoint);
  console.log('Region:', config.auth.region);
}

// Log configuration on import (client-side only)
if (typeof window !== 'undefined') {
  logAmplifyConfig();
} 