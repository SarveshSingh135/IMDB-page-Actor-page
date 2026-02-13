"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Home() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSearch = () => {
    if (!query.trim()) return
    router.push(`/actor/${query.trim()}`)
  }

  const quickSearch = (name: string) => {
    router.push(`/actor/${name}`)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-br from-purple-900 via-black to-orange-900 text-white">

      {/* Title */}
      <h1 className="text-7xl font-extrabold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent mb-6">
        CINEVERSE
      </h1>

      <p className="text-gray-300 mb-8 text-lg text-center">
        Discover movies. Explore actors. Experience cinema like never before.
      </p>

      {/* Search Bar */}
      <div className="flex w-full max-w-2xl mb-10">
        <input
          type="text"
          placeholder="Search movies or actors..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1 px-6 py-3 rounded-l-full bg-white/10 backdrop-blur-md border border-gray-600 focus:outline-none"
        />
        <button
          onClick={handleSearch}
          className="px-8 py-3 rounded-r-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold transition"
        >
          EXPLORE
        </button>
      </div>

      {/* Quick Buttons */}
      <div className="grid grid-cols-2 gap-6">
        {["Batman", "Spiderman", "Ironman", "Joker"].map((name) => (
          <button
            key={name}
            onClick={() => quickSearch(name)}
            className="px-10 py-6 bg-white/10 backdrop-blur-md rounded-2xl hover:bg-white/20 transition"
          >
            {name}
          </button>
        ))}
      </div>
    </main>
  )
}
