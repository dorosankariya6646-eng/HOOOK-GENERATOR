import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { HookGenerator } from './components/HookGenerator';
import { ImageEditor } from './components/ImageEditor';
import { Zap, LogOut, PenTool, Image as ImageIcon } from 'lucide-react';

function App() {
  const [user, setUser] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'hooks' | 'images'>('hooks');

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('hook_gen_user');
    if (storedUser) setUser(storedUser);
  }, []);

  const handleLogin = (email: string) => {
    setUser(email);
    localStorage.setItem('hook_gen_user', email);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('hook_gen_user');
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-400/20">
                <Zap className="w-6 h-6 text-black fill-black" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-gray-900">Hook Generator</span>
                <span className="hidden sm:inline-block ml-2 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">Pro</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <span className="hidden md:block text-sm text-gray-500">
                {user}
              </span>
              <button 
                onClick={handleLogout}
                className="text-gray-400 hover:text-gray-900 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 -mb-px">
            <button
              onClick={() => setActiveTab('hooks')}
              className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'hooks'
                  ? 'border-yellow-400 text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <PenTool className="w-4 h-4 mr-2" />
              Text Hooks
            </button>
            <button
              onClick={() => setActiveTab('images')}
              className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'images'
                  ? 'border-yellow-400 text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Visual Editor
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {activeTab === 'hooks' ? 'Generate Viral Hooks' : 'Magic Image Editor'}
          </h1>
          <p className="text-gray-500 mt-1">
            {activeTab === 'hooks' 
              ? 'Create high-retention opening lines optimized for any platform.' 
              : 'Edit and enhance your thumbnails using simple text prompts.'}
          </p>
        </div>

        {activeTab === 'hooks' ? <HookGenerator /> : <ImageEditor />}
      </main>

    </div>
  );
}

export default App;