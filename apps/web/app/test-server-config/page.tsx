import { getAmplifyConfig } from '@/lib/amplify-config'

export default function TestServerConfigPage() {
  const config = getAmplifyConfig()
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Server-Side Amplify Configuration Test</h1>
      
      {config ? (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-green-800 mb-4">✅ Server Configuration Loaded Successfully</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Authentication (Cognito)</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>User Pool ID:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{config.auth.userPoolId}</code></div>
                  <div><strong>User Pool Client ID:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{config.auth.userPoolClientId}</code></div>
                  <div><strong>Identity Pool ID:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{config.auth.identityPoolId}</code></div>
                  <div><strong>Region:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{config.auth.region}</code></div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">GraphQL API</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>Endpoint:</strong> <code className="bg-gray-100 px-2 py-1 rounded break-all">{config.api.endpoint}</code></div>
                  <div><strong>Region:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{config.api.region}</code></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-800 mb-3">Test Links</h3>
            <div className="space-y-2">
              <div>
                <a href="/auth/login" className="text-blue-600 hover:text-blue-800 underline">
                  Test Login Page
                </a>
              </div>
              <div>
                <a href="/cognito-test" className="text-blue-600 hover:text-blue-800 underline">
                  Test Cognito Authentication
                </a>
              </div>
              <div>
                <a href="/test-auth" className="text-blue-600 hover:text-blue-800 underline">
                  Test Auth Page
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-800 mb-4">❌ Server Configuration Failed to Load</h2>
          <p className="text-red-700">Unable to load Amplify configuration from amplify_outputs.json on server-side</p>
        </div>
      )}
    </div>
  )
} 