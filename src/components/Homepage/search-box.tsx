"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const searchSuggestions = [
    "Sarees",
    "Salwar Kameez",
    "Lehengas",
    "Kurtis",
    "Bridal Wear",
    "Anarkali",
    "Silk Sarees",
    "Cotton Kurtis",
    "Wedding Collection",
    "Festival Wear",
]

export function SearchBar() {
    const [query, setQuery] = useState("")
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])
    const inputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    useEffect(() => {
        if (query.length > 0) {
            const filtered = searchSuggestions.filter((suggestion) => suggestion.toLowerCase().includes(query.toLowerCase()))
            setFilteredSuggestions(filtered)
            setShowSuggestions(true)
        } else {
            setShowSuggestions(false)
        }
    }, [query])

    const handleSearch = (searchQuery: string = query) => {
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
            setShowSuggestions(false)
            inputRef.current?.blur()
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch()
        } else if (e.key === "Escape") {
            setShowSuggestions(false)
            inputRef.current?.blur()
        }
    }

    const handleSuggestionClick = (suggestion: string) => {
        setQuery(suggestion)
        handleSearch(suggestion)
    }

    const clearSearch = () => {
        setQuery("")
        setShowSuggestions(false)
        inputRef.current?.focus()
    }

    return (
        <div className="relative flex-1 max-w-lg mx-8">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search for sarees, kurtis, lehengas..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => query.length > 0 && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="w-full pl-12 pr-12 py-3 border border-stone-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                />
                {query && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 h-auto"
                    >
                        <X className="w-4 h-4 text-stone-400" />
                    </Button>
                )}
            </div>

            {/* Search Suggestions */}
            {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-stone-200 rounded-lg shadow-lg mt-1 z-50 max-h-60 overflow-y-auto">
                    {filteredSuggestions.map((suggestion, index) => (
                        <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="w-full px-4 py-3 text-left hover:bg-stone-50 transition-colors border-b border-stone-100 last:border-b-0"
                        >
                            <div className="flex items-center">
                                <Search className="w-4 h-4 text-stone-400 mr-3" />
                                <span className="text-stone-700">{suggestion}</span>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
