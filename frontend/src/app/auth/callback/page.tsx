'use client';

import { Suspense } from 'react';
import AuthCallbackContent from './components/Content';

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<p>Logging you in...</p>}>
      <AuthCallbackContent />
    </Suspense>
  );
}
