import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CreditLens — Alternative Credit Scoring',
  description: 'AI-powered credit risk scoring for unbanked women',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
