"use client";

import Link from "next/link";
import { addToWatchlist, isInWatchlist } from "@/lib/watchlist";

export default function MovieCard({ movie }: any) {

  // ✅ check already added or not
  const added = isInWatchlist(movie?.imdbID);

  // ✅ handle add
  const handleAdd = () => {
    addToWatchlist({
      imdbID: movie.imdbID,
      Title: movie.Title,
      Poster: movie.Poster,
      Year: movie.Year,
    });

    alert("Added to Watchlist ✅");
  };

  return (
    <div className="bg-gray-800 p-3 rounded shadow">

      {/* 🎬 Click → Movie Details */}
      <Link href={`/movie/${movie.imdbID}`}>
        <img
          src={movie.Poster}
          alt={movie.Title}
          className="w-full h-60 object-cover rounded mb-2 cursor-pointer"
        />
      </Link>

      {/* 🎬 Title */}
      <h2 className="text-sm font-bold">{movie.Title}</h2>

      {/* 📅 Year */}
      <p className="text-gray-400 text-xs">{movie.Year}</p>

      {/* ⭐ Add Button */}
      <button
        onClick={handleAdd}
        disabled={added}
        className={`mt-2 w-full py-1 rounded text-sm font-bold ${
          added
            ? "bg-green-500 text-black"
            : "bg-yellow-500 text-black"
        }`}
      >
        {added ? "✅ Added" : "➕ Add to Watchlist"}
      </button>

    </div>
  );
}