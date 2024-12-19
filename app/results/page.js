"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react"; // Import Suspense
import Loading from "./loading"; // You can create a separate Loading component

export default function ResultsPage() {
  const API_URL = "https://cs533.hm-rdp.com"; // Replace with your actual API endpoint
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState([]); // State for storing search results
  const [loading, setLoading] = useState(false); // State for loading status
  const [error, setError] = useState(null); // State for any error during API call
  const [activeTab, setActiveTab] = useState(""); // State for active tab

  // Fetch search results from API
  useEffect(() => {
    if (query) {
      setLoading(true); // Start loading when a search query is present
      setError(null); // Reset any previous errors

      // Test data for generating dummy queries
      const dataGenerateDummyQueries = {
        input_query: query,
        num_queries: 3,
      };

      // Function to call the generate-dummy-queries endpoint
      const fetchDummyQueries = async () => {
        try {
          const response = await fetch(`${API_URL}/generate-dummy-queries`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dataGenerateDummyQueries),
          });

          if (response.ok) {
            const data = await response.json();
            setResults(data); // Set all the results including all_queries and result
            setActiveTab(data.input_category); // Set the active tab based on the input category
            setLoading(false); // Set loading to false after data is fetched
          } else {
            setError("Failed to fetch dummy queries. Please try again later.");
            setLoading(false);
          }
        } catch (err) {
          setError("Failed to fetch dummy queries. Please try again later.");
          setLoading(false); // Stop loading even if there's an error
        }
      };

      // Fetch data from the API for dummy queries
      fetchDummyQueries();
    }
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/results?query=${searchQuery}`); // Update URL with search query
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(e); // Trigger the search if Enter key is pressed
    }
  };

  const renderResults = (category) => {
    if (results.result && results.result[category]) {
      return results.result[category].map((result, index) => (
        <div key={index} className="mb-4">
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            <h3 className="text-xl font-bold">{result.title}</h3>
          </a>
          <p className="text-gray-600">{result.url}</p>
        </div>
      ));
    }
    return <p>No results found for this category: {category}</p>;
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

      {/* Tabs */}
      {results.all_queries && (
        <div className="tabs-container my-4 ml-5 px-4">
          <ul className="flex space-x-4">
            {results.all_queries.map((query, index) => (
              <li
                key={index}
                onClick={() => setActiveTab(query.query)}
                className={`cursor-pointer py-2 px-4 border-b-2 ${
                  activeTab === query.category
                    ? "border-blue-500 text-blue-500"
                    : "border-transparent text-gray-600 hover:border-blue-500"
                }`}
              >
                {query.query}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Search Results */}
      {loading && <Loading />}
      {!loading && (
        <div className="max-w-4xl justify-start ml-5 px-4 py-8">
          {error && <p className="text-red-600">{error}</p>}

          {results.all_queries && activeTab && renderResults(activeTab)}
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
