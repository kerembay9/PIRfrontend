"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react"; // Import Suspense
import Loading from "./loading"; // You can create a separate Loading component

export default function ResultsPage() {
  const API_URL = "http://13.60.250.133:5000"; // Replace with your actual API endpoint
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState([]); // State for storing search results
  const [loading, setLoading] = useState(false); // State for loading status
  const [error, setError] = useState(null); // State for any error during API call

  // Fetch search results from API
  useEffect(() => {
    if (query) {
      setLoading(true); // Start loading when a search query is present
      setError(null); // Reset any previous errors

      // Fetch results from the API endpoint
      fetch(`${API_URL}/query?search=${query}`)
        .then((response) => response.json())
        .then((data) => {
          setResults(data.results); // Assuming API response is { results: [...] }
          setLoading(false); // Set loading to false after data is fetched
        })
        .catch((err) => {
          setError("Failed to fetch results. Please try again later.");
          setLoading(false); // Stop loading even if there's an error
        });
    }
  }, [query]); // Re-fetch when the query changes

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/results?query=${searchQuery}`); // Update URL with search query
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(e); // Trigger the search if Enter key is pressed
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Search Bar */}
      <div className="flex items-center p-4 bg-white shadow-md">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex flex-col items-center">
            <img src="logo.png" alt="ABCGPT" className="h-8 w-8" />
          </Link>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown} // Add the keydown event to the input
            placeholder="Search the web"
            className="pl-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white py-1 px-4 rounded-md ml-2 hover:bg-blue-600 transition"
          >
            Search
          </button>
        </div>
      </div>

      {/* Search Results */}
      {loading && <Loading />}
      {!loading && (
        <div className="max-w-4xl justify-start ml-5 px-4 py-8">
          <h2 className="text-2xl font-semibold mb-4">
            Search results for: {query}
          </h2>

          {/* Display error message if the API fetch failed */}
          {error && <p className="text-red-600">{error}</p>}

          {/* Display the search results */}
          {!loading && !error && results.length === 0 && (
            <p>No results found for &quot;{query}&quot;.</p>
          )}

          {/* Map through the results and display them */}
          {results.map((result, index) => (
            <div key={index} className="mb-4">
              <a
                href={result.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                <h3 className="text-xl font-bold">{result.title}</h3>
              </a>
              <p className="text-gray-600">{result.link}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ResultsPageWrapper() {
  return (
    <Suspense fallback={<Loading />}>
      <ResultsPage />
    </Suspense>
  );
}
