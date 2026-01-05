import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Health Co-Pilot | AI-Powered Ingredient Analysis',
    description: 'Understand what\'s in your food with AI-driven ingredient analysis. Get honest, reasoned insights about health impacts.',
    keywords: ['health', 'ingredients', 'nutrition', 'AI', 'food safety'],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </head>
            <body>{children}</body>
        </html>
    );
}
