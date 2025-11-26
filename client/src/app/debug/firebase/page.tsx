import FirebaseTest from '@/components/debug/FirebaseTest';

export default function DebugPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">🔧 Firebase Debug</h1>
        <FirebaseTest />
        
        <div className="mt-8 space-y-6">
          <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-4">Environment Variables</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>API Key:</strong> {process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Present' : '❌ Missing'}
              </div>
              <div>
                <strong>Auth Domain:</strong> {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '❌ Missing'}
              </div>
              <div>
                <strong>Project ID:</strong> {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '❌ Missing'}
              </div>
              <div>
                <strong>Storage Bucket:</strong> {process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '❌ Missing'}
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-50 rounded-lg shadow-lg max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-4">🔧 Environment Debug Info</h2>
            <div className="space-y-4 text-sm">
              <div>
                <strong>Current Domain:</strong> {typeof window !== 'undefined' ? window.location.hostname : 'Server-side'}
              </div>
              <div>
                <strong>Environment:</strong> {process.env.NODE_ENV}
              </div>
              <div>
                <strong>Build Time:</strong> {new Date().toISOString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}