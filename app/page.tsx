"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import MovieCard from "@/components/MovieCard"
import { useTheme } from "@/context/ThemeContext"

export const dynamic = "force-dynamic"

export default function HomePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()

  const [mounted, setMounted] = useState(false)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  // mount fix
  useEffect(() => {
    setMounted(true)
  }, [])

  const query = searchParams.get("q") || ""

  // URL sync
  useEffect(() => {
    setSearch(query)
  }, [query])

  // API fetch
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

  // React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: !!query,
  })

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search) {
        setPage(1)
        router.push(`/?q=${search}`)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [search, router])

  // 🔥 VERY IMPORTANT (hydration + prerender fix)
  if (!mounted) return null

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white p-6">

      {/* Navbar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">🎬 Movie App</h1>

        <div className="flex gap-3">
          <button
            onClick={toggleTheme}
            className="px-3 py-2 rounded bg-gray-800 text-white"
          >
            {theme === "dark" ? "🌞" : "🌙"}
          </button>

          <Link href="/watchlist">
            <button className="bg-yellow-500 px-4 py-2 rounded text-black">
              ⭐ Watchlist
            </button>
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-2 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search movies..."
          className="p-3 w-full bg-gray-900 text-white rounded"
        />

        <button
          onClick={() => {
            setPage(1)
            router.push(`/?q=${search}`)
          }}
          className="bg-yellow-500 px-4 py-2 rounded text-black"
        >
          Search
        </button>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold mb-4">
        {query ? `${query.toUpperCase()} Movies` : "Movies"}
      </h2>

      {/* Error */}
      {error && (
        <p className="text-red-500">{(error as Error).message}</p>
      )}

      {/* Loading */}
      {isLoading && <p>Loading...</p>}

      {/* Movies */}
      {!isLoading && data?.Search && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {data.Search.map((movie: any) => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && !data?.Search && query && (
        <p>No results found 😢</p>
      )}

      {/* Pagination */}
      {!isLoading && data?.Search && (
        <div className="flex justify-center gap-4 mt-6">
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