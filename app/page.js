/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"; // Import Heroicon
import Link from "next/link";

export default function Home() {
  const [query, setQuery] = useState("");
  const [scrambledText, setScrambledText] = useState(
    "CS 533 Private Search Engine"
  );
  const router = useRouter();

  useEffect(() => {
    // Scrambling effect for the entire phrase when the page loads
    const characters = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890*#@/*!%&^"];
    const randomArrayElement = (arr) => arr[(arr.length * Math.random()) | 0];

    const scrambleText = () => {
      let scrambled = "CS 533 Private Search Engine";
      const solveMilliseconds = 1800;
      const characterSelectionMilliseconds = 90;

      const scrambleCharacter = (index) => {
        let intervalId = setInterval(() => {
          const randomCharacter = randomArrayElement(characters);
          scrambled = replaceCharacter(scrambled, index, randomCharacter);
          setScrambledText(scrambled);
        }, characterSelectionMilliseconds);

        setTimeout(() => {
          clearInterval(intervalId);
          scrambled = replaceCharacter(
            scrambled,
            index,
            "CS 533 Private Search Engine"[index]
          );
          setScrambledText(scrambled);
        }, solveMilliseconds);
      };

      // Loop over each character in the phrase and scramble it
      for (let i = 0; i < scrambled.length; i++) {
        scrambleCharacter(i);
      }
    };

    scrambleText();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/results?query=${query}`); // Redirect to results page
  };

  const replaceCharacter = (str, index, chr) => {
    return `${str.substring(0, index)}${chr}${str.substring(index + 1)}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-between ">
      <div className="min-h-screen  flex flex-col items-center mt-40 ">
        <Link href="/" className=" flex flex-col items-center">
          <img src="logo.png" alt="ABCGPT" className="w-40" />
          <h1 className="text-3xl font-bold mb-6 flex items-center space-x-2">
            <span>{scrambledText}</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSearch}
          className="w-full max-w-md relative flex items-center"
        >
          <div className="relative w-full">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your search query..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="ml-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
}
