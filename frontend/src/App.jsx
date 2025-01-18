// App.jsx
import React, { useState } from 'react';
import fetchRepoContents  from './functions.js';

const App = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [result, setResult] = useState('');

  const handleFetch = async () => {
    try {
      const wordCount = await fetchRepoContents(repoUrl);
      setResult(`Total words in repository: ${wordCount.totalWords}`);
    } catch (error) {
      setResult(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-1" htmlFor="repoUrl">
              GitHub Repo URL
            </label>
            <input
              id="repoUrl"
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="https://github.com/username/repo"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1" htmlFor="wpm">
              Typing Speed (WPM)
            </label>
            <input
              id="wpm"
              type="number"
              value={wpm}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <button
            onClick={handleFetch}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
          >
            Word Count
          </button>
        </div>
        {result && (
          <div className="mt-4 p-4 bg-gray-200 rounded">
            <p>{result}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
