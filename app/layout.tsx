import { ClerkProvider } from '@clerk/nextjs'
import TopBar from './top-bar';
import './globals.css'
import { Inter } from 'next/font/google';
import { Geist } from 'next/font/google';

const inter = Inter({
    subsets: ["latin"],
});

const geist = Geist({
    subsets: ["latin"],
});

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body className={ inter.className }>
                <ClerkProvider>
                    <TopBar />
                    { children }
                </ClerkProvider>
            </body>
        </html>
    )
}