import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-8">The page you are looking for doesn't exist.</p>
      <Link to="/" className="text-pink-600 hover:text-pink-700 underline">Go back home</Link>
    </div>
  );
};

export default NotFound;


