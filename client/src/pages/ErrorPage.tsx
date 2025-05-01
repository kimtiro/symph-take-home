import React from "react";
import { Link, useLocation } from "react-router-dom";

const ErrorPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const messageFromQuery = queryParams.get("message");
  const { message } = location.state || { message: messageFromQuery || "An unexpected error occurred." };

  return (
    <div className="h-screen bg-gray-100 flex justify-center items-center flex-col space-y-4">
      <h1 className="text-2xl font-bold text-red-500">Error</h1>
      <p className="text-center">{message}</p>
      <Link to="/" className="text-blue-500 hover:underline mt-4">
        Go Back to Home
      </Link>
    </div>
  );
};

export default ErrorPage;