import { useState } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Regex to validate URL format
  const urlRegex = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-]*)*(\?.*)?(#.*)?$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous errors
  
    // Validate URL format
    if (!urlRegex.test(originalUrl)) {
      setErrorMessage("Invalid URL format. Please enter a valid URL.");
      return;
    }
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ original_url: originalUrl, custom_slug: customSlug, expiration_date: expirationDate }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
  
        // Handle expired URL error
        if (response.status === 410) {
          navigate("/error", { state: { message: "URL has expired." } });
          return;
        }
  
        throw new Error(errorData.error || "Failed to shorten URL");
      }
  
      const data = await response.json();
  
      // Redirect to SecondPage with the shortened URL and original URL
      navigate("/second", { state: { shortUrl: data.short_url, originalUrl: originalUrl , expirationDate: data.expiration_date } });
    } catch (error: unknown) {
      console.error("Error shortening URL:", error);
  
      // Narrow down the type of error
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex justify-center items-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <h1 className="text-xl font-bold mb-4">URL Shortener</h1>
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        <input
          type="url"
          placeholder="Enter URL"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          required
          className="block w-full p-2 mb-4 border rounded"
        />
        <input
          type="text"
          placeholder="Custom Slug (optional)"
          value={customSlug}
          onChange={(e) => setCustomSlug(e.target.value)}
          className="block w-full p-2 mb-4 border rounded"
        />
        <input
          type="datetime-local"
          placeholder="Expiration Date (optional)"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
          required
          className="block w-full p-2 mb-4 border rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Shorten
        </button>
      </form>
    </div>
  );
}

export default HomePage;
