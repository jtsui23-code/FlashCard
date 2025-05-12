"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Brain, ArrowLeft, ChevronLeft, ChevronRight, RotateCcw, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useFlashcards } from "@/context/flashcard-context"

export default function StudyDeck({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { getDeck, updateLastStudied } = useFlashcards()

  const deck = getDeck(params.id)

  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [knownCards, setKnownCards] = useState<Set<string>>(new Set())
  const [reviewLater, setReviewLater] = useState<Set<string>>(new Set())
  const [studyComplete, setStudyComplete] = useState(false)
  const [studyStartTime, setStudyStartTime] = useState<Date | null>(null)
  const [studyEndTime, setStudyEndTime] = useState<Date | null>(null)

  useEffect(() => {
    if (deck && deck.cards.length > 0 && !studyStartTime) {
      setStudyStartTime(new Date())
      updateLastStudied(deck.id)
    }
  }, [deck, studyStartTime, updateLastStudied])

  if (!deck) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Deck not found</h1>
        <p className="text-gray-500 mb-6">The deck you're looking for doesn't exist or has been deleted.</p>
        <Link href="/dashboard">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    )
  }

  if (deck.cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">No cards to study</h1>
        <p className="text-gray-500 mb-6">This deck doesn't have any cards yet. Add some cards first.</p>
        <div className="flex gap-4">
          <Link href="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <Link href={`/deck/${deck.id}/edit`}>
            <Button className="bg-purple-600 hover:bg-purple-700">Add Cards</Button>
          </Link>
        </div>
      </div>
    )
  }

  const currentCard = deck.cards[currentCardIndex]
  const progress = ((currentCardIndex + 1) / deck.cards.length) * 100

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleNext = () => {
    if (currentCardIndex < deck.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
      setIsFlipped(false)
    } else {
      setStudyEndTime(new Date())
      setStudyComplete(true)
    }
  }

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1)
      setIsFlipped(false)
    }
  }

  const handleKnown = () => {
    const updatedKnown = new Set(knownCards)
    updatedKnown.add(currentCard.id)
    setKnownCards(updatedKnown)

    const updatedReviewLater = new Set(reviewLater)
    updatedReviewLater.delete(currentCard.id)
    setReviewLater(updatedReviewLater)

    handleNext()
  }

  const handleReviewLater = () => {
    const updatedReviewLater = new Set(reviewLater)
    updatedReviewLater.add(currentCard.id)
    setReviewLater(updatedReviewLater)

    const updatedKnown = new Set(knownCards)
    updatedKnown.delete(currentCard.id)
    setKnownCards(updatedKnown)

    handleNext()
  }

  const handleRestartStudy = () => {
    setCurrentCardIndex(0)
    setIsFlipped(false)
    setKnownCards(new Set())
    setReviewLater(new Set())
    setStudyComplete(false)
    setStudyStartTime(new Date())
    setStudyEndTime(null)
  }

  const calculateStudyTime = () => {
    if (!studyStartTime || !studyEndTime) return "N/A"

    const diffMs = studyEndTime.getTime() - studyStartTime.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffSecs = Math.floor((diffMs % 60000) / 1000)

    return `${diffMins}m ${diffSecs}s`
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-purple-600" />
              <span className="text-xl font-bold">Mermory</span>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 container px-4 py-6 md:px-6 md:py-8">
        {!studyComplete ? (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Link href="/dashboard">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ArrowLeft className="h-4 w-4" />
                      <span className="sr-only">Back</span>
                    </Button>
                  </Link>
                  <h1 className="text-2xl font-bold tracking-tight">Studying: {deck.title}</h1>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-gray-500">
                    Card {currentCardIndex + 1} of {deck.cards.length}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-xs text-gray-500">Known: {knownCards.size}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-orange-500" />
                      <span className="text-xs text-gray-500">To review: {reviewLater.size}</span>
                    </div>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleRestartStudy}>
                <RotateCcw className="mr-2 h-3 w-3" />
                Restart
              </Button>
            </div>

            <Progress value={progress} className="mb-8" />

            <div className="flex justify-center mb-8">
              <Card
                className={`w-full max-w-2xl aspect-[3/2] flex items-center justify-center p-8 cursor-pointer transition-all duration-500 ${
                  isFlipped ? "bg-gray-50" : "bg-gradient-to-br from-purple-50 to-purple-100"
                }`}
                onClick={handleFlip}
              >
                <div className="text-center">
                  <div className="absolute top-4 left-4 text-xs font-medium text-gray-500">
                    {isFlipped ? "ANSWER" : "QUESTION"}
                  </div>
                  <div className="text-xl md:text-2xl font-medium mb-2 whitespace-pre-wrap">
                    {isFlipped ? currentCard.back : currentCard.front}
                  </div>
                  <div className="text-sm text-gray-500">Click to {isFlipped ? "see question" : "reveal answer"}</div>
                </div>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <div className="flex justify-between sm:justify-center gap-2">
                <Button variant="outline" onClick={handlePrevious} disabled={currentCardIndex === 0}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button variant="outline" onClick={handleNext}>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="flex justify-between sm:justify-center gap-2">
                <Button
                  variant="outline"
                  className="border-red-200 bg-red-50 hover:bg-red-100 text-red-600"
                  onClick={handleReviewLater}
                >
                  <X className="mr-2 h-4 w-4" />
                  Review Later
                </Button>
                <Button
                  variant="outline"
                  className="border-green-200 bg-green-50 hover:bg-green-100 text-green-600"
                  onClick={handleKnown}
                >
                  <Check className="mr-2 h-4 w-4" />I Know This
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-purple-100 p-4 mb-4">
              <Check className="h-8 w-8 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Study Complete!</h1>
            <p className="text-gray-500 mb-8 max-w-md">Great job! You've completed studying this deck.</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 w-full max-w-2xl">
              <div className="bg-purple-50 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">{deck.cards.length}</div>
                <div className="text-sm text-gray-500">Total Cards</div>
              </div>
              <div className="bg-green-50 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{knownCards.size}</div>
                <div className="text-sm text-gray-500">Cards Known</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">{reviewLater.size}</div>
                <div className="text-sm text-gray-500">Need Review</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-8 w-full max-w-2xl">
              <h2 className="text-xl font-semibold mb-4">Study Session Summary</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Study Time</div>
                  <div className="font-medium">{calculateStudyTime()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Completion Rate</div>
                  <div className="font-medium">{Math.round((knownCards.size / deck.cards.length) * 100)}%</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" onClick={handleRestartStudy}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Study Again
              </Button>
              <Link href="/dashboard">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>
      <footer className="border-t bg-gray-50">
        <div className="container flex justify-between items-center h-16 px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium">Mermory</span>
          </div>
          <div className="text-xs text-gray-500">© {new Date().getFullYear()} Mermory</div>
        </div>
      </footer>
    </div>
  )
}
