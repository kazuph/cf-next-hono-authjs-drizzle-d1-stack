'use client';

import { signIn } from '@hono/auth-js/react';
import { Button } from '@/components/ui/button';

export default function Auth() {
  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10">
      <h2 className="mb-6 text-2xl font-bold text-center">ログイン / サインアップ</h2>
      <Button onClick={handleGoogleSignIn} className="w-full">
        Googleでログイン / サインアップ
      </Button>
    </div>
  );
}
