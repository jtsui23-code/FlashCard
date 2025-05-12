// Importing the React type to type-check React-specific elements
import type React from "react"

// Importing Metadata type from Next.js to define SEO-related metadata
import type { Metadata } from "next"

// Importing the Inter font from Google Fonts using Next.js's built-in font loader
import { Inter } from "next/font/google"

// Importing global CSS file to apply styles across the entire app
import "./globals.css"

// Importing custom components and context providers
import { ThemeProvider } from "@/components/theme-provider" // Provides theme context (light/dark/system)
import { Toaster } from "@/components/ui/toaster"           // Renders toast notifications
import { FlashcardProvider } from "@/context/flashcard-context" // Provides context for managing flashcard state

// Load the Inter font with the Latin character set
const inter = Inter({ subsets: ["latin"] })

// Exporting default metadata for the entire application
export const metadata: Metadata = {
  title: "Mermory - Next-Gen Flashcard App", // The title shown in the browser tab or search results
  description: "A modern flashcard application for effective learning", // Description for SEO and previews
}

// RootLayout is the root component that wraps all pages of the app
export default function RootLayout({
  children, // Props: represents all child components passed to the layout
}: Readonly<{
  children: React.ReactNode // Ensures type safety for React children nodes
}>) {
  return (
    <html lang="en"> {/* Sets HTML language attribute to English */}
      <body className={inter.className}> {/* Applies Inter font to entire body using className */}
        {/* ThemeProvider wraps the app to allow toggling light/dark themes */}
        <ThemeProvider 
          attribute="class" // Theme is toggled by applying a class to the HTML element
          defaultTheme="light" // Default theme is light mode
          enableSystem // Enables detection of system-level dark/light theme
          disableTransitionOnChange // Prevents transition animations when switching themes
        >
          {/* FlashcardProvider wraps children with flashcard state context */}
          <FlashcardProvider>
            {children} {/* Renders all page-level content passed to the layout */}
            <Toaster /> {/* Renders toast notifications for user feedback */}
          </FlashcardProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
