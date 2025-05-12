"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Brain, ArrowLeft, Plus, Edit, Trash2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useFlashcards } from "@/context/flashcard-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function EditDeck({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const { getDeck, addCard, updateCard, deleteCard } = useFlashcards()

  const deck = getDeck(params.id)

  const [isAddCardDialogOpen, setIsAddCardDialogOpen] = useState(false)
  const [isEditCardDialogOpen, setIsEditCardDialogOpen] = useState(false)
  const [newCardFront, setNewCardFront] = useState("")
  const [newCardBack, setNewCardBack] = useState("")
  const [editCardId, setEditCardId] = useState<string | null>(null)
  const [editCardFront, setEditCardFront] = useState("")
  const [editCardBack, setEditCardBack] = useState("")

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

  const handleAddCard = () => {
    if (newCardFront.trim() && newCardBack.trim()) {
      addCard(deck.id, newCardFront.trim(), newCardBack.trim())
      setNewCardFront("")
      setNewCardBack("")
      setIsAddCardDialogOpen(false)
    }
  }

  const openEditCardDialog = (cardId: string, front: string, back: string) => {
    setEditCardId(cardId)
    setEditCardFront(front)
    setEditCardBack(back)
    setIsEditCardDialogOpen(true)
  }

  const handleEditCard = () => {
    if (editCardId && editCardFront.trim() && editCardBack.trim()) {
      updateCard(deck.id, editCardId, editCardFront.trim(), editCardBack.trim())
      setEditCardId(null)
      setEditCardFront("")
      setEditCardBack("")
      setIsEditCardDialogOpen(false)
    }
  }

  const handleDeleteCard = (cardId: string) => {
    deleteCard(deck.id, cardId)
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="sr-only">Back</span>
                </Button>
              </Link>
              <h1 className="text-2xl font-bold tracking-tight">{deck.title}</h1>
            </div>
            <p className="text-gray-500">{deck.description}</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Dialog open={isAddCardDialogOpen} onOpenChange={setIsAddCardDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Card
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Card</DialogTitle>
                  <DialogDescription>Create a new flashcard for this deck.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="front">Front (Question)</Label>
                    <Textarea
                      id="front"
                      placeholder="e.g., What is photosynthesis?"
                      value={newCardFront}
                      onChange={(e) => setNewCardFront(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="back">Back (Answer)</Label>
                    <Textarea
                      id="back"
                      placeholder="e.g., The process by which green plants use sunlight to synthesize foods with carbon dioxide and water."
                      value={newCardBack}
                      onChange={(e) => setNewCardBack(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddCardDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleAddCard}>
                    Add Card
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button
              variant="outline"
              onClick={() => {
                toast({
                  title: "All changes saved",
                  description: "Your flashcards have been saved successfully.",
                })
                router.push("/dashboard")
              }}
            >
              <Save className="mr-2 h-4 w-4" />
              Done
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Cards ({deck.cards.length})</h2>
          <p className="text-gray-500 text-sm">
            {deck.cards.length === 0
              ? "This deck doesn't have any cards yet. Add your first card to get started."
              : "Click on a card to edit its content."}
          </p>
        </div>

        {deck.cards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-lg border border-dashed">
            <div className="rounded-full bg-purple-100 p-3 mb-4">
              <Plus className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">No cards yet</h3>
            <p className="text-gray-500 mb-4 max-w-md">Start by adding your first flashcard to this deck.</p>
            <Dialog open={isAddCardDialogOpen} onOpenChange={setIsAddCardDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Card
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {deck.cards.map((card, index) => (
              <Card key={card.id} className="overflow-hidden">
                <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Card {index + 1}</span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => openEditCardDialog(card.id, card.front, card.back)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600"
                      onClick={() => handleDeleteCard(card.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-purple-50 p-4 rounded-md">
                    <div className="text-xs font-medium text-purple-600 mb-1">Front</div>
                    <div className="whitespace-pre-wrap">{card.front}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="text-xs font-medium text-gray-600 mb-1">Back</div>
                    <div className="whitespace-pre-wrap">{card.back}</div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto"
                    onClick={() => openEditCardDialog(card.id, card.front, card.back)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Card
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Card Dialog */}
        <Dialog open={isEditCardDialogOpen} onOpenChange={setIsEditCardDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Card</DialogTitle>
              <DialogDescription>Update the content of this flashcard.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-front">Front (Question)</Label>
                <Textarea id="edit-front" value={editCardFront} onChange={(e) => setEditCardFront(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-back">Back (Answer)</Label>
                <Textarea id="edit-back" value={editCardBack} onChange={(e) => setEditCardBack(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditCardDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleEditCard}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
