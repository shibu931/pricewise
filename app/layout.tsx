import Navbar from '@/Components/Navbar'
import './globals.css'
import type { Metadata } from 'next'
import { Inter,Space_Grotesk } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({
  subsets:['latin'],
  weight:['300','400','500','600','700']
})
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Price Wise',
  description: 'Track Product prices effortlessly and save money on your online shopping',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className='max-w-10xl mx-auto'>
          <Navbar/>
          {children}
        </main>
      </body>
    </html>
  )
}
