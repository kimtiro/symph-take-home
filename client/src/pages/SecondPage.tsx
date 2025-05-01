import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { FiExternalLink } from "react-icons/fi"; // Import an external link icon from react-icons

const SecondPage: React.FC = () => {
  const location = useLocation();
  const { shortUrl, originalUrl } = location.state || {};
  const [successMessage, setSuccessMessage] = useState("");

  const handleCopy = () => {
    if (shortUrl) {
      navigator.clipboard.writeText(shortUrl);
      setSuccessMessage("Shortened link copied to clipboard!");
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <div className="h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-xl font-bold mb-4">Shortened Link</h1>
        {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
        {shortUrl && originalUrl ? (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Original URL:</label>
              <p className="p-2 border rounded bg-gray-100">{originalUrl}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Shortened URL:</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={shortUrl}
                  readOnly
                  onFocus={handleFocus}
                  className="block w-full p-2 border rounded cursor-pointer"
                />
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700"
                  title="Open Shortened URL"
                >
                  <FiExternalLink size={20} />
                </a>
              </div>
            </div>
            <button
              onClick={handleCopy}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
            >
              Copy Shortened Link
            </button>
          </>
        ) : (
          <p className="text-red-500">No data available. Please go back and shorten a URL.</p>
        )}
        <Link to="/" className="text-blue-500 hover:underline mt-4 block text-center">
          Go Back to Home
        </Link>
      </div>
    </div>
  );
};

export default SecondPage;
