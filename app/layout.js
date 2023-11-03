import { Toaster } from 'react-hot-toast'
import './globals.css'
import { Plus_Jakarta_Sans } from 'next/font/google'

const pjs = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] })

export const metadata = {
  title: 'PeerPost - Decentralized Blogging Platform Driven by AI',
  description: 'Empowering writers with a decentralized, AI-driven blogging platform. Join us to transform the way you write, read, and engage with relevant content. Harness the power of blockchain and AI for an innovative blogging experience.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased bg-slate-50 text-dark ${pjs.className}`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
