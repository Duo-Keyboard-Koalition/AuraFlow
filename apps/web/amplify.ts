import { Amplify } from 'aws-amplify';
import { generateClient } from '@aws-amplify/api';
import type { Schema } from './amplify/data/resource';
import outputs from './amplify_outputs.json';

// Configure Amplify with the outputs from amplify_outputs.json
Amplify.configure(outputs);

// Configure the API client with the correct schema
export const client = generateClient<Schema>(); 