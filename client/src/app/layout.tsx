import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'
import QueryProvider from '@/components/providers/query-provider'
import { AuthProvider } from '@/components/providers/auth-provider'
import Navbar from '@/components/layout/navbar'

const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-outfit',
})

export const metadata: Metadata = {
    title: 'PocketBite | Find Your Next Favorite Meal',
    description: 'Personalized restaurant recommendations and visit scheduling.',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang='en' className={`${outfit.variable} h-full antialiased`}>
            <body className='min-h-full font-sans flex flex-col'>
                <QueryProvider>
                    <AuthProvider>
                        <Navbar />
                        <main className='flex-1'>{children}</main>
                    </AuthProvider>
                </QueryProvider>
            </body>
        </html>
    )
}
