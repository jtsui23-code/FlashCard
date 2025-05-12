"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Brain, Plus, Search, Clock, BookOpen, MoreVertical, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
import { Textarea } from "@/components/ui/textarea"
import { useFlashcards } from "@/context/flashcard-context"
import { formatDistanceToNow } from "@/lib/utils"

export default function Dashboard() {
  const router = useRouter()
  const { decks, addDeck, updateDeck, deleteDeck } = useFlashcards()
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [newDeckTitle, setNewDeckTitle] = useState("")
  const [newDeckDescription, setNewDeckDescription] = useState("")
  const [editDeckId, setEditDeckId] = useState<string | null>(null)
  const [editDeckTitle, setEditDeckTitle] = useState("")
  const [editDeckDescription, setEditDeckDescription] = useState("")

  const filteredDecks = decks.filter(
    (deck) =>
      deck.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deck.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleCreateDeck = () => {
    if (newDeckTitle.trim()) {
      addDeck(newDeckTitle.trim(), newDeckDescription.trim())
      setNewDeckTitle("")
      setNewDeckDescription("")
      setIsCreateDialogOpen(false)
    }
  }

  const handleEditDeck = () => {
    if (editDeckId && editDeckTitle.trim()) {
      updateDeck(editDeckId, editDeckTitle.trim(), editDeckDescription.trim())
      setEditDeckId(null)
      setEditDeckTitle("")
      setEditDeckDescription("")
      setIsEditDialogOpen(false)
    }
  }

  const openEditDialog = (deck: { id: string; title: string; description: string }) => {
    setEditDeckId(deck.id)
    setEditDeckTitle(deck.title)
    setEditDeckDescription(deck.description)
    setIsEditDialogOpen(true)
  }

  const handleDeleteDeck = (id: string) => {
    deleteDeck(id)
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
            <h1 className="text-3xl font-bold tracking-tight">Your Flashcard Decks</h1>
            <p className="text-gray-500 mt-1">Create, manage, and study your flashcard decks</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-64 md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search decks..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Deck
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Deck</DialogTitle>
                  <DialogDescription>Create a new flashcard deck to start studying.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Spanish Vocabulary"
                      value={newDeckTitle}
                      onChange={(e) => setNewDeckTitle(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Brief description of this deck"
                      value={newDeckDescription}
                      onChange={(e) => setNewDeckDescription(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleCreateDeck}>
                    Create Deck
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {filteredDecks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-purple-100 p-3 mb-4">
              <BookOpen className="h-6 w-6 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No decks found</h2>
            <p className="text-gray-500 mb-4 max-w-md">
              {searchQuery
                ? `No decks match your search for "${searchQuery}"`
                : "You haven't created any flashcard decks yet. Create your first deck to get started!"}
            </p>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Deck
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDecks.map((deck) => (
              <Card key={deck.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle>{deck.title}</CardTitle>
                      <CardDescription>{deck.description}</CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(deck)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteDeck(deck.id)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <BookOpen className="h-4 w-4" />
                    <span>
                      {deck.cards.length} {deck.cards.length === 1 ? "card" : "cards"}
                    </span>
                  </div>
                  <div className="h-24 bg-gradient-to-r from-purple-50 to-purple-100 rounded-md flex items-center justify-center">
                    {deck.cards.length > 0 ? (
                      <p className="text-center px-4 text-sm font-medium text-purple-800 line-clamp-3">
                        {deck.cards[0].front}
                      </p>
                    ) : (
                      <p className="text-center px-4 text-sm text-gray-500">No cards yet</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-3 border-t">
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="mr-1 h-3 w-3" />
                    {deck.lastStudied
                      ? `Studied ${formatDistanceToNow(new Date(deck.lastStudied))} ago`
                      : "Not studied yet"}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => router.push(`/deck/${deck.id}/edit`)}>
                      Edit Cards
                    </Button>
                    <Button
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700"
                      onClick={() => router.push(`/deck/${deck.id}/study`)}
                    >
                      Study
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Deck Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Deck</DialogTitle>
              <DialogDescription>Update your flashcard deck details.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input id="edit-title" value={editDeckTitle} onChange={(e) => setEditDeckTitle(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editDeckDescription}
                  onChange={(e) => setEditDeckDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleEditDeck}>
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
