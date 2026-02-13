// "use client"

// import Image from "next/image"

// export default function FilmographyExplorer({ movies }: any) {

//   // 🔥 Duplicate remove karne ke liye

//   const uniqueMovies = movies.filter(
//     (movie: any, index: number, self: any[]) =>
//       index === self.findIndex((m) => m.imdbID === movie.imdbID)
//   )

//   return (
//     <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//       {uniqueMovies.map((movie: any) => (
// <div key= {movie.imdbID} className="bg-zinc-900 p-4 rounded-xl">

//           <Image
//             src={
//               movie.Poster !== "N/A"
//                 ? movie.Poster
//                 : "/no-image.png"
//             }
//             alt={movie.Title}
//             width={300}
//             height={450}
//             className="rounded-xl"
//           />

//           <h2 className="mt-4 font-semibold">{movie.Title}</h2>
//           <p className="text-sm text-gray-400">{movie.Year}</p>

//         </div>
//       ))}
//     </div>
//   )
// }




"use client"

import Image from "next/image"

export default function FilmographyExplorer({ movies }: any) {

  // Remove duplicates
  const uniqueMovies = Array.from(
    new Map(movies.map((m: any) => [m.imdbID, m])).values()
  )

  return (
    <div className="p-12 bg-black text-white">
      <h2 className="text-3xl font-bold mb-8">Filmography</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {uniqueMovies.map((movie: any) => (
          <div
            key={movie.imdbID}
            className="bg-zinc-900 p-4 rounded-xl hover:scale-105 transition"
          >
            <Image
              src={
                movie.Poster !== "N/A"
                  ? movie.Poster
                  : "/no-image.png"
              }
              alt={movie.Title}
              width={300}
              height={450}
              className="rounded-xl"
            />

            <h3 className="mt-3 font-semibold">{movie.Title}</h3>
            <p className="text-sm text-zinc-400">{movie.Year}</p>

            {/* IMDb Style Badge */}
            <div className="flex items-center gap-2 mt-2">
              <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-md font-semibold">
                IMDb
              </span>
              <span className="text-yellow-400 text-sm font-semibold">
                {(Math.random() * 3 + 7).toFixed(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
