import { ClerkProvider } from '@clerk/nextjs'
import TopBar from './top-bar';
import './globals.css'
import { Inter } from 'next/font/google';
import { ContextProvider } from './appContext';

const inter = Inter({
    subsets: ["latin"],
});

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body className={ inter.className }>
                <ClerkProvider>
                    <ContextProvider>
                        <div className="mainLayout"> 
                            <TopBar />
                            {children}
                        </div>
                </ContextProvider>
                </ClerkProvider>
            </body>
        </html>
    )
}