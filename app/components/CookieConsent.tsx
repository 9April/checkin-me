'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[200] max-w-xl mx-auto md:left-auto md:right-8 md:bottom-8 animate-in slide-in-from-bottom-5 duration-500">
      <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h4 className="text-lg font-bold mb-1 flex items-center gap-2">
              <span className="text-xl">🍪</span> We value your privacy
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed font-medium">
              We use essential cookies for authentication and to store your preferences. 
              By continuing to use our site, you agree to our 
              <Link href="/privacy" className="text-blue-400 hover:text-blue-300 underline mx-1">
                Privacy Policy
              </Link>.
            </p>
          </div>
          <div className="flex gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={acceptCookies}
              className="flex-1 md:flex-none px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-black rounded-xl transition-all shadow-lg active:scale-95"
            >
              Accept
            </button>
            <button
               onClick={() => setIsVisible(false)}
               className="flex-1 md:flex-none px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white text-sm font-bold rounded-xl transition-all active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
