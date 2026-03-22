'use client'

import { Sparkle } from '@phosphor-icons/react'

export default function ProfileSummary({ profileData }: { profileData: any }) {
  return (
    <div className='lg:col-span-1 space-y-8'>
      <div className='p-8 glass-card rounded-[2.5rem] border border-border/40 bg-primary/5 relative overflow-hidden'>
        <div className='absolute top-0 right-0 p-4 opacity-10'>
          <Sparkle size={80} weight='fill' className='text-primary' />
        </div>
        <h3 className='text-sm font-black uppercase tracking-widest text-muted-foreground mb-6'>
          Your Preferences
        </h3>
        <div className='space-y-6'>
          <div>
            <span className='text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2'>
              Budget Range
            </span>
            <p className='font-black text-xl'>
              Ksh {profileData?.preferences?.budgetMin || 0} -{' '}
              {profileData?.preferences?.budgetMax || 'Any'}
            </p>
          </div>
          <div>
            <span className='text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2'>
              Favorite Cuisines
            </span>
            <div className='flex flex-wrap gap-2'>
              {profileData?.preferences?.favoriteCategories?.length > 0 ? (
                profileData.preferences.favoriteCategories.map(
                  (cat: string) => (
                    <span
                      key={cat}
                      className='bg-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-sm'
                    >
                      {cat}
                    </span>
                  ),
                )
              ) : (
                <span className='text-muted-foreground text-sm italic'>
                  No preferences set yet.
                </span>
              )}
            </div>
          </div>
        </div>
        <button className='w-full mt-8 bg-white border border-border py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-accent transition-colors shadow-sm'>
          Update Taste
        </button>
      </div>
    </div>
  )
}
