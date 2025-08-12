import React, { useState } from 'react';

interface FirebaseConfigWizardProps {
  missingVars: string[];
  onConfigComplete: () => void;
}

const FirebaseConfigWizard: React.FC<FirebaseConfigWizardProps> = ({ missingVars, onConfigComplete }) => {
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
      <div className="bg-brand-dark-200 rounded-lg shadow-xl p-8 max-w-2xl w-full">
        <div className="text-center">
          <div className="text-6xl mb-4">🔥</div>
          <h1 className="text-2xl font-bold text-white mb-4">Firebase Configuration Required</h1>
          <p className="text-gray-300 mb-6">
            Your Firebase configuration is missing or incomplete. Please set up your environment variables to continue.
          </p>
        </div>

        <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
          <h3 className="text-red-400 font-semibold mb-2">Missing Environment Variables:</h3>
          <ul className="space-y-1">
            {missingVars.map(varName => (
              <li key={varName} className="text-red-300 font-mono text-sm">• {varName}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="w-full bg-brand-primary hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            {showInstructions ? 'Hide Setup Instructions' : 'Show Setup Instructions'}
          </button>

          {showInstructions && (
            <div className="bg-brand-dark-300 rounded-lg p-6 space-y-4 text-sm">
              <h3 className="font-semibold text-white">Setup Instructions:</h3>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-yellow-400">1. Get Firebase Configuration</h4>
                  <p className="text-gray-300">
                    • Go to <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Firebase Console</a><br/>
                    • Select your project (or create a new one)<br/>
                    • Go to Project Settings → General tab<br/>
                    • Scroll down to "Your apps" section<br/>
                    • Click on the web app icon (&lt;/&gt;) or "Add app" if none exists<br/>
                    • Copy the config object values
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-yellow-400">2. Create .env.local File</h4>
                  <p className="text-gray-300">
                    Create a file named <code className="bg-gray-700 px-1 rounded">.env.local</code> in your project root with:
                  </p>
                  <pre className="bg-gray-800 p-3 rounded text-xs text-green-400 overflow-x-auto">
{`VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX`}
                  </pre>
                </div>

                <div>
                  <h4 className="font-medium text-yellow-400">3. Enable Firebase Services</h4>
                  <p className="text-gray-300">
                    In Firebase Console, make sure to enable:<br/>
                    • Authentication (Email/Password)<br/>
                    • Firestore Database<br/>
                    • Storage<br/>
                    • Analytics (optional)
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-yellow-400">4. Restart Development Server</h4>
                  <p className="text-gray-300">
                    After creating the .env.local file, restart your development server:
                  </p>
                  <pre className="bg-gray-800 p-2 rounded text-xs text-green-400">
                    npm run dev
                  </pre>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={onConfigComplete}
            className="w-full bg-brand-secondary hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            I've Set Up My Configuration - Refresh Page
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Need help? Check the README.md file for detailed setup instructions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FirebaseConfigWizard;