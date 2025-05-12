"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export type Card = {
  id: string
  front: string
  back: string
}

export type Deck = {
  id: string
  title: string
  description: string
  cards: Card[]
  lastStudied?: string
  createdAt: string
}

type FlashcardContextType = {
  decks: Deck[]
  addDeck: (title: string, description: string) => void
  updateDeck: (id: string, title: string, description: string) => void
  deleteDeck: (id: string) => void
  getDeck: (id: string) => Deck | undefined
  addCard: (deckId: string, front: string, back: string) => void
  updateCard: (deckId: string, cardId: string, front: string, back: string) => void
  deleteCard: (deckId: string, cardId: string) => void
  updateLastStudied: (deckId: string) => void
}

const FlashcardContext = createContext<FlashcardContextType | undefined>(undefined)

export function FlashcardProvider({ children }: { children: React.ReactNode }) {
  const [decks, setDecks] = useState<Deck[]>([])
  const { toast } = useToast()

  // Load decks from localStorage on initial render
  useEffect(() => {
    const savedDecks = localStorage.getItem("mermory-decks")
    if (savedDecks) {
      try {
        setDecks(JSON.parse(savedDecks))
      } catch (error) {
        console.error("Failed to parse saved decks:", error)
      }
    } else {
      // Add sample deck for demo purposes
      const sampleDeck: Deck = {
        id: "sample-deck",
        title: "Biology 101",
        description: "Introduction to basic biology concepts",
        cards: [
          {
            id: "card-1",
            front: "What is the function of mitochondria?",
            back: "Mitochondria are the powerhouse of the cell. They generate most of the cell's supply of adenosine triphosphate (ATP), used as a source of chemical energy.",
          },
          {
            id: "card-2",
            front: "What is photosynthesis?",
            back: "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with carbon dioxide and water.",
          },
          {
            id: "card-3",
            front: "What is DNA?",
            back: "DNA, or deoxyribonucleic acid, is a molecule composed of two polynucleotide chains that coil around each other to form a double helix carrying genetic instructions.",
          },
        ],
        createdAt: new Date().toISOString(),
      }
      setDecks([sampleDeck])
    }
  }, [])

  // Save decks to localStorage whenever they change
  useEffect(() => {
    if (decks.length > 0) {
      localStorage.setItem("mermory-decks", JSON.stringify(decks))
    }
  }, [decks])

  const addDeck = (title: string, description: string) => {
    const newDeck: Deck = {
      id: `deck-${Date.now()}`,
      title,
      description,
      cards: [],
      createdAt: new Date().toISOString(),
    }
    setDecks([...decks, newDeck])
    toast({
      title: "Deck created",
      description: `"${title}" has been created successfully.`,
    })
  }

  const updateDeck = (id: string, title: string, description: string) => {
    setDecks(
      decks.map((deck) =>
        deck.id === id
          ? {
              ...deck,
              title,
              description,
            }
          : deck,
      ),
    )
    toast({
      title: "Deck updated",
      description: `"${title}" has been updated successfully.`,
    })
  }

  const deleteDeck = (id: string) => {
    const deckToDelete = decks.find((deck) => deck.id === id)
    setDecks(decks.filter((deck) => deck.id !== id))
    toast({
      title: "Deck deleted",
      description: deckToDelete ? `"${deckToDelete.title}" has been deleted.` : "Deck has been deleted.",
    })
  }

  const getDeck = (id: string) => {
    return decks.find((deck) => deck.id === id)
  }

  const addCard = (deckId: string, front: string, back: string) => {
    setDecks(
      decks.map((deck) => {
        if (deck.id === deckId) {
          return {
            ...deck,
            cards: [
              ...deck.cards,
              {
                id: `card-${Date.now()}`,
                front,
                back,
              },
            ],
          }
        }
        return deck
      }),
    )
    toast({
      title: "Card added",
      description: "New flashcard has been added to the deck.",
    })
  }

  const updateCard = (deckId: string, cardId: string, front: string, back: string) => {
    setDecks(
      decks.map((deck) => {
        if (deck.id === deckId) {
          return {
            ...deck,
            cards: deck.cards.map((card) =>
              card.id === cardId
                ? {
                    ...card,
                    front,
                    back,
                  }
                : card,
            ),
          }
        }
        return deck
      }),
    )
    toast({
      title: "Card updated",
      description: "Flashcard has been updated successfully.",
    })
  }

  const deleteCard = (deckId: string, cardId: string) => {
    setDecks(
      decks.map((deck) => {
        if (deck.id === deckId) {
          return {
            ...deck,
            cards: deck.cards.filter((card) => card.id !== cardId),
          }
        }
        return deck
      }),
    )
    toast({
      title: "Card deleted",
      description: "Flashcard has been removed from the deck.",
    })
  }

  const updateLastStudied = (deckId: string) => {
    setDecks(
      decks.map((deck) => {
        if (deck.id === deckId) {
          return {
            ...deck,
            lastStudied: new Date().toISOString(),
          }
        }
        return deck
      }),
    )
  }

  return (
    <FlashcardContext.Provider
      value={{
        decks,
        addDeck,
        updateDeck,
        deleteDeck,
        getDeck,
        addCard,
        updateCard,
        deleteCard,
        updateLastStudied,
      }}
    >
      {children}
    </FlashcardContext.Provider>
  )
}

export function useFlashcards() {
  const context = useContext(FlashcardContext)
  if (context === undefined) {
    throw new Error("useFlashcards must be used within a FlashcardProvider")
  }
  return context
}
