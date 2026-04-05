"use client"
import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import MovieCard from "@/components/MovieCard"
import { useTheme } from "@/context/ThemeContext"

export default function HomePage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const { theme, toggleTheme } = useTheme()

  const query = searchParams.get("q") || ""

  const [search, setSearch] = useState(query)
  const [page, setPage] = useState(1)

  // 🎬 Fetch movies
  const fetchMovies = async (query: string, page: number) => {
    const res = await fetch(
      `https://www.omdbapi.com/?apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}&s=${query}&page=${page}`
    )

    const data = await res.json()

    if (data.Response === "False") {
      throw new Error("No movies found ❌")
    }

    return data
  }

  // 🔥 React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: !!query,
    retry: 2,
    staleTime: 1000 * 60 * 5,
  })

  // 🔍 Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search) {
        setPage(1)
        router.push(`/?q=${search}`)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [search])

  return (
    <div className="min-h-screen bg-white text-black dark:bg-linear-to-b dark:from-black dark:via-gray-900 dark:to-black dark:text-white p-6 transition-all duration-300">

      {/* 🔝 Top Bar */}
      <div className="flex justify-between items-center mb-6">

        <h1 className="text-xl font-bold">
          🎬 Movie App
        </h1>

        <div className="flex gap-3 items-center">

          {/* 🌗 Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="px-3 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition"
          >
            {theme === "dark" ? "🌞" : "🌙"}
          </button>

          {/* ⭐ Watchlist */}
          <Link href="/watchlist">
            <button className="bg-yellow-500 px-4 py-2 rounded text-black font-bold hover:bg-yellow-400 transition">
              ⭐ Watchlist
            </button>
          </Link>

        </div>
      </div>

      {/* 🎥 HERO SECTION */}
      <div className="mb-8 rounded-xl overflow-hidden relative h-62.5 flex items-end p-6 bg-[url('https://images.unsplash.com/photo-1524985069026-dd778a71c7b4')] bg-cover bg-center">

        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10">
          <h1 className="text-3xl font-bold">🎬 Movie Explorer</h1>
          <p className="text-gray-300 text-sm">
            Search & save your favorite movies
          </p>
        </div>

      </div>

      {/* 🔍 Search */}
      <div className="flex gap-2 mb-6">

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search movies..."
          className="p-3 w-full bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />

        <button
          onClick={() => {
            setPage(1)
            router.push(`/?q=${search}`)
          }}
          className="bg-yellow-500 px-4 py-2 rounded text-black font-bold hover:bg-yellow-400 transition"
        >
          Search
        </button>

      </div>

      {/* 🎬 Title */}
      <h1 className="text-2xl font-bold mb-4">
        🔥 {query ? `${query.toUpperCase()} Movies` : "Movies"}
      </h1>

      {!query && (
        <p className="text-gray-400">Search for movies 🔍</p>
      )}

      {/* ❌ Error */}
      {error && (
        <p className="text-red-500">
          {(error as Error).message}
        </p>
      )}

      {/* ⏳ Loading */}
      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="h-60 bg-gray-800 animate-pulse rounded"
            />
          ))}
        </div>
      )}

      {/* 🎬 Movies */}
      {!isLoading && data?.Search && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {data.Search.map((movie: any, index: number) => (
            <MovieCard key={movie.imdbID + index} movie={movie} />
          ))}
        </div>
      )}

      {/* 😢 Empty */}
      {!isLoading && !data?.Search && query && (
        <p className="text-gray-400">No results found 😢</p>
      )}

      {/* 🔄 Pagination */}
      {!isLoading && data?.Search && (
        <div className="flex justify-center gap-4 mt-8">

          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="bg-gray-700 px-4 py-2 rounded"
          >
            Prev
          </button>

          <button
            onClick={() => setPage((p) => p + 1)}
            className="bg-yellow-500 px-4 py-2 rounded text-black"
          >
            Next
          </button>

        </div>
      )}

    </div>
  )
}