'use client';

import { useState, useEffect } from 'react';

type Consent = 'granted' | 'denied' | null;

function getStoredConsent(): Consent {
  if (typeof window === 'undefined') return null;
  const v = localStorage.getItem('cookie_consent');
  return v === 'granted' || v === 'denied' ? v : null;
}

function applyConsent(consent: 'granted' | 'denied') {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      analytics_storage: consent,
    });
  }
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = getStoredConsent();
    if (stored) {
      applyConsent(stored);
    } else {
      setVisible(true);
    }
  }, []);

  function handleAccept() {
    localStorage.setItem('cookie_consent', 'granted');
    applyConsent('granted');
    setVisible(false);
  }

  function handleDecline() {
    localStorage.setItem('cookie_consent', 'denied');
    applyConsent('denied');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <>
      {/* Subtle backdrop to draw attention */}
      <div className="fixed inset-0 z-[998] bg-black/10 dark:bg-black/30" />

      <div className="fixed bottom-0 left-0 right-0 z-[999] p-4 md:p-6">
        <div className="mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-900/15 dark:border-gray-700 dark:bg-gray-900 dark:shadow-black/30">
          <div className="p-5 md:p-6">
            <p className="text-base text-gray-700 dark:text-gray-300">
              We use cookies to understand how people find this site and which
              content matters most. No personal data is sold or shared.
            </p>

            <div className="mt-4 flex items-center justify-between">
              <a
                href="/privacy"
                className="text-sm text-gray-400 underline decoration-gray-300 underline-offset-2 hover:text-gray-600 hover:decoration-gray-400 dark:text-gray-500 dark:decoration-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                Privacy policy
              </a>

              <div className="flex items-center gap-4">
                <button
                  onClick={handleDecline}
                  className="text-sm text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                >
                  Decline
                </button>
                <button
                  onClick={handleAccept}
                  className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                >
                  Accept cookies
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
