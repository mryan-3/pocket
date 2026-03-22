'use client';

import AuthForm from '@/components/auth/auth-form';

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-[radial-gradient(circle_at_top_right,var(--accent),transparent_40%),radial-gradient(circle_at_bottom_left,var(--accent),transparent_40%)]">
      <AuthForm mode="register" />
    </div>
  );
}
