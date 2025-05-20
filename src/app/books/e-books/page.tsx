'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, BookOpen, ExternalLink, Book, Filter, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Book {
  id: string
  volumeInfo: {
    title: string
    authors?: string[]
    description?: string
    imageLinks?: {
      thumbnail: string
    }
    previewLink?: string
    infoLink?: string
    publishedDate?: string
    publisher?: string
    pageCount?: number
    categories?: string[]
    language?: string
    averageRating?: number
    ratingsCount?: number
  }
}

const DEFAULT_BOOK_COVER = `data:image/svg+xml,${encodeURIComponent(`
<svg width="128" height="192" viewBox="0 0 128 192" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="128" height="192" rx="8" fill="#F3F4F6"/>
  <path d="M64 86C77.25 86 88 75.25 88 62C88 48.75 77.25 38 64 38C50.75 38 40 48.75 40 62C40 75.25 50.75 86 64 86Z" fill="#D1D5DB"/>
  <path d="M64 96C44.75 96 26 105.75 26 125V134H102V125C102 105.75 83.25 96 64 96Z" fill="#D1D5DB"/>
</svg>
`)}`

export default function EBooksPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [previewBook, setPreviewBook] = useState<Book | null>(null)

  const categories = Array.from(
    new Set(books.flatMap((book) => book.volumeInfo.categories || []))
  )

  const searchBooks = async () => {
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          searchQuery
        )}&maxResults=24&langRestrict=en`
      )
      const data = await response.json()
      setBooks(data.items || [])
      setSelectedCategory('all')
    } catch (error) {
      console.error('Error fetching books:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredBooks = books.filter((book) => {
    if (selectedCategory === 'all') return true
    return book.volumeInfo.categories?.includes(selectedCategory)
  })

  const handlePreview = (book: Book) => {
    setPreviewBook(book)
  }

  const getPreviewUrl = (book: Book) => {
    // Extract the book ID from the preview link
    const bookId = book.id
    // Construct the Google Books embedded viewer URL
    return `https://books.google.com/books?id=${bookId}&lpg=PP1&pg=PP1&output=embed`
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-500 via-fuchsia-500 to-indigo-500 bg-clip-text text-transparent mb-4">
            Digital Library
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Search through millions of books, access previews, and explore detailed information about any book you're interested in.
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex gap-4">
            <Input
              type="text"
              placeholder="Search for books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchBooks()}
              className="h-12 text-lg"
            />
            <Button
              onClick={searchBooks}
              className="h-12 px-6 bg-rose-500 hover:bg-rose-600 text-white"
              disabled={loading}
            >
              {loading ? (
                'Searching...'
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </>
              )}
            </Button>
            {books.length > 0 && (
              <Button
                variant="outline"
                className="h-12 px-4"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-5 h-5" />
              </Button>
            )}
          </div>

          {/* Filters */}
          <AnimatePresence>
            {showFilters && categories.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    variant={selectedCategory === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory('all')}
                    className="rounded-full"
                  >
                    All Categories
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={
                        selectedCategory === category ? 'default' : 'outline'
                      }
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="rounded-full"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBooks.map((book) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  {/* Book Cover */}
                  <div className="flex-shrink-0">
                    <img
                      src={book.volumeInfo.imageLinks?.thumbnail || DEFAULT_BOOK_COVER}
                      alt={book.volumeInfo.title}
                      className="w-32 h-48 object-cover rounded-lg shadow-md"
                    />
                  </div>

                  {/* Book Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                      {book.volumeInfo.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {book.volumeInfo.authors?.join(', ') || 'Unknown Author'}
                    </p>
                    {book.volumeInfo.publisher && (
                      <p className="text-sm text-gray-500 dark:text-gray-500 truncate">
                        {book.volumeInfo.publisher} •{' '}
                        {book.volumeInfo.publishedDate?.split('-')[0]}
                      </p>
                    )}
                    {book.volumeInfo.averageRating && (
                      <div className="flex items-center gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.round(book.volumeInfo.averageRating || 0)
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          ({book.volumeInfo.ratingsCount || 0})
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 line-clamp-3">
                  {book.volumeInfo.description || 'No description available.'}
                </p>

                {/* Action Buttons */}
                <div className="mt-4 flex gap-4">
                  {book.volumeInfo.previewLink && (
                    <Button
                      variant="outline"
                      onClick={() => handlePreview(book)}
                      className="flex-1"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                  )}
                  {book.volumeInfo.infoLink && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        window.open(book.volumeInfo.infoLink, '_blank')
                      }
                      className="flex-1"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      More Info
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Preview Modal */}
        <Dialog open={!!previewBook} onOpenChange={() => setPreviewBook(null)}>
          <DialogContent className="max-w-6xl w-full h-[80vh] p-0">
            <DialogHeader className="px-6 py-3 border-b">
              <DialogTitle>
                <div className="flex items-center gap-3">
                  {previewBook?.volumeInfo.imageLinks?.thumbnail && (
                    <img
                      src={previewBook.volumeInfo.imageLinks.thumbnail}
                      alt={previewBook.volumeInfo.title}
                      className="w-8 h-12 object-cover rounded"
                    />
                  )}
                  <div>
                    <h2 className="text-xl font-semibold">{previewBook?.volumeInfo.title}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {previewBook?.volumeInfo.authors?.join(', ')}
                    </p>
                  </div>
                </div>
              </DialogTitle>
            </DialogHeader>
            {previewBook && (
              <div className="relative w-full h-full bg-gray-100 dark:bg-gray-900">
                <iframe
                  src={getPreviewUrl(previewBook)}
                  className="w-full h-full border-none"
                  title={`Preview of ${previewBook.volumeInfo.title}`}
                  allow="fullscreen"
                  loading="lazy"
                />
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Empty State */}
        {books.length === 0 && searchQuery && !loading && (
          <div className="text-center py-12">
            <Book className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No books found. Try a different search term.
            </p>
          </div>
        )}

        {/* Initial State */}
        {books.length === 0 && !searchQuery && !loading && (
          <div className="text-center py-12">
            <Book className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Start searching to discover books.
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 