import Link from "next/link"
import { ArrowRight, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            <span className="text-xl font-bold">Mermory</span>
          </div>
          <nav className="flex gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-purple-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="inline-block rounded-lg bg-purple-100 px-3 py-1 text-sm text-purple-700">
                  Next-Gen Flashcards
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Study Smarter, <span className="text-purple-600">Remember Longer</span>
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl">
                  Mermory combines the best of flashcard apps with real-time collaboration and a user-friendly design.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/dashboard">
                    <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <div className="relative w-full max-w-[500px] overflow-hidden rounded-xl border bg-white shadow-xl">
                  <div className="p-4">
                    <div className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4 text-purple-600"
                          >
                            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                            <path d="m9 12 2 2 4-4" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium">Biology 101</div>
                          <div className="text-xs text-gray-500">120 cards</div>
                        </div>
                      </div>
                    </div>
                    <div className="py-8 flex flex-col items-center justify-center">
                      <div className="w-full max-w-[400px] aspect-[4/3] bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg flex items-center justify-center p-6 mb-4">
                        <div className="text-center">
                          <h3 className="text-xl font-medium mb-2">What is the function of mitochondria?</h3>
                          <div className="text-sm text-gray-500">Click to reveal answer</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Previous
                        </Button>
                        <Button variant="outline" size="sm">
                          Flip
                        </Button>
                        <Button variant="outline" size="sm">
                          Next
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-gray-50">
        <div className="container flex flex-col gap-6 py-8 md:py-12 px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-purple-600" />
              <span className="text-xl font-bold">Mermory</span>
            </div>
            <div className="text-sm text-gray-500">© {new Date().getFullYear()} Mermory. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
