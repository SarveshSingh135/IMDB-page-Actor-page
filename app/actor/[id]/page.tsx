import FilmographyExplorer from "@/components/FilmographyExplorer"
import ActorHero from "@/components/ActorHero"

export const revalidate = 60 // ISR

async function getMovies(name: string) {
  const res = await fetch(
    `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&s=${name}`,
    {
      next: { revalidate: 60 },
    }
  )

  return res.json()
}

export default async function ActorPage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = params

  const data = await getMovies(id)

  if (!data || data.Response === "False") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-red-500 text-xl">
        No movies found 😢
      </div>
    )
  }

  const movies = data.Search ?? []

  return (
    <main className="bg-black text-white">

      {/* HERO SECTION */}
      <ActorHero id={id} movies={movies} />

      {/* FILMOGRAPHY GRID */}
      <div className="px-12 py-16">
        <FilmographyExplorer movies={movies} />
      </div>

    </main>
  )
}
