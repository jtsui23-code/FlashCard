// Importing types from React and Next.js
import type React from "react"
import type { Metadata } from "next"

// Importing a Google font (Inter) using Next.js built-in font loader
import { Inter } from "next/font/google"

// Importing global CSS styles
import "./globals.css"

// Importing custom components and context providers
import { ThemeProvider } from "@/components/theme-provider" // Provides theme (light/dark) context
import { Toaster } from "@/components/ui/toaster"           // Toast notifications UI component
import { FlashcardProvider } from "@/context/flashcard-context" // Context provider for flashcard state management

// Initialize the Inter font with Latin character subset
const inter = Inter({ subsets: ["latin"] })

// Define default metadata for the HTML document
export const metadata: Metadata = {
  title: "Mermory - Next-Gen Flashcard App",             // Sets the page title
  description: "A modern flashcard application for effective learning", // Sets the page description
}

// Root layout component for the entire app
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode // Props passed to layout (the page content)
}>) {
  return (
    <html lang="en"> {/* Sets the language of the HTML document */}
      <body className={inter.className}> {/* Applies Inter font to the body */}
        {/* Wrap the app in a theme provider to support dark/light themes */}
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {/* Wrap the app in flashcard context to manage flashcard-related state globally */}
          <FlashcardProvider>
            {children} {/* Render the main content passed to the layout */}
            <Toaster /> {/* Toast notification system for user feedback */}
          </FlashcardProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
