'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Envelope, Lock, User, ArrowRight, Spinner } from '@phosphor-icons/react';
import Link from 'next/link';
import apiClient from '@/lib/api-client';
import { useQueryClient } from '@tanstack/react-query';
import AuthInput from './ui/auth-input';

const authSchema = z.object({ name: z.string().min(2).optional(), email: z.string().email(), password: z.string().min(6) });

export default function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(authSchema) });

  const onSubmit = async (data: any) => {
    setIsLoading(true); setError(null);
    try {
      const res = await apiClient.post(mode === 'login' ? '/auth/login' : '/auth/register', data);
      if (res.data.success) { await queryClient.invalidateQueries({ queryKey: ['auth-me'] }); router.push('/dashboard'); }
    } catch (err: any) { setError(err.response?.data?.message || 'Something went wrong.'); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="w-full max-w-md p-8 glass-card rounded-3xl shadow-2xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">{mode === 'login' ? 'Welcome Back' : 'Join PocketBite'}</h1>
        <p className="text-muted-foreground mt-2">{mode === 'login' ? 'Sign in to discover your next favorite meal' : 'Create an account for recommendations'}</p>
      </div>
      {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {mode === 'register' && <AuthInput label="Full Name" icon={User} register={register} name="name" type="text" error={errors.name} placeholder="John Doe" />}
        <AuthInput label="Email Address" icon={Envelope} register={register} name="email" type="email" error={errors.email} placeholder="name@example.com" />
        <AuthInput label="Password" icon={Lock} register={register} name="password" type="password" error={errors.password} placeholder="••••••••" />
        <button type="submit" disabled={isLoading} className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70">
          {isLoading ? <Spinner className="animate-spin" size={20} weight="bold" /> : <><span className="uppercase tracking-widest text-xs font-black">{mode === 'login' ? 'Sign In' : 'Create Account'}</span><ArrowRight size={20} weight="bold" /></>}
        </button>
      </form>
      <div className="mt-8 pt-6 border-t border-border/60 text-center">
        <p className="text-sm text-muted-foreground">{mode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}<Link href={mode === 'login' ? '/register' : '/login'} className="text-primary font-bold hover:underline underline-offset-4">{mode === 'login' ? 'Join Now' : 'Sign In'}</Link></p>
      </div>
    </div>
  );
}
