"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import MovieCard from "@/components/MovieCard"
import { useTheme } from "@/context/ThemeContext"

export const dynamic = "force-dynamic"

export default function HomePage() {
  const router = useRouter()

  const [mounted, setMounted] = useState(false)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState("")

  // ✅ client only
  useEffect(() => {
    setMounted(true)

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      setQuery(params.get("q") || "")
    }
  }, [])

  // ⚠️ theme AFTER mounted (IMPORTANT)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    setSearch(query)
  }, [query])

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

  const { data, isLoading, error } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: !!query,
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search) {
        setPage(1)
        router.push(`/?q=${search}`)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [search, router])

  // 🚨 MOST IMPORTANT
  if (!mounted) {
    return <div>Loading...</div>
  }

  return (
  <div className="min-h-screen p-6">
    <h1>🎬 Movie App</h1>

    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search..."
      className="p-2 border mb-4"
    />

    {isLoading && <p>Loading...</p>}
    {error && <p>{(error as Error).message}</p>}

    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {data?.Search?.map((movie: any) => (
        <MovieCard key={movie.imdbID} movie={movie} />
      ))}
    </div>
  </div>
)
}