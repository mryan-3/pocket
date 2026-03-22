'use client'

import RestaurantCard from './restaurant-card'
import { Spinner, MagnifyingGlass } from '@phosphor-icons/react'

export default function RestaurantList({
    restaurants,
    isLoading,
    error,
    onClear,
}: any) {
    if (isLoading)
        return (
            <div className='flex flex-col items-center justify-center py-32'>
                <Spinner
                    size={48}
                    className='animate-spin text-primary'
                    weight='bold'
                />
            </div>
        )
    if (error)
        return (
            <div className='p-12 glass-card rounded-[3rem] text-center max-w-2xl mx-auto text-red-500 font-bold'>
                Something went wrong.
            </div>
        )
    if (restaurants.length === 0)
        return (
            <div className='py-32 flex flex-col items-center text-center'>
                <div className='bg-accent p-12 rounded-full mb-8'>
                    <MagnifyingGlass size={64} className='text-primary' weight='bold' />
                </div>
                <h2 className='text-3xl font-bold mb-4'>No bites found</h2>
                <button
                    onClick={onClear}
                    className='mt-8 text-primary font-black uppercase tracking-widest hover:underline'
                >
                    Clear all filters
                </button>
            </div>
        )
    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700'>
            {restaurants.map((r: any) => (
                <RestaurantCard key={r._id} restaurant={r} />
            ))}
        </div>
    )
}
