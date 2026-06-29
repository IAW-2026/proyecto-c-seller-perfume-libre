import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { Inter } from 'next/font/google';
import { ContextProvider } from './appContext';
import TopBarServer from './top-bar-server';

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
                            <TopBarServer />
                            {children}
                        </div>
                </ContextProvider>
                </ClerkProvider>
            </body>
        </html>
    )
}