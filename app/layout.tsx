import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { FlashcardProvider } from "@/context/flashcard-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mermory - Next-Gen Flashcard App",
  description: "A modern flashcard application for effective learning",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <FlashcardProvider>
            {children}
            <Toaster />
          </FlashcardProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
