export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex justify-center items-center text-blue-500">
          <svg
            className="w-8 h-8 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 1116 0A8 8 0 014 12z"
            ></path>
          </svg>
        </div>
      </div>
      <p className="mt-4 text-blue-700">
        Privacy comes with a cost... This may take a while.
      </p>
    </div>
  );
}
