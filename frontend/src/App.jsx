import React, { useState } from 'react';
import fetchRepoContents from './functions.js';

const App = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [wpm, setWpm] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    if (!repoUrl || !wpm) {
      setResult('Please enter both the repository URL and typing speed.');
      return;
    }

    if (isNaN(wpm) || wpm <= 0) {
      setResult('Typing speed must be a positive number.');
      return;
    }

    setResult('');
    setLoading(true);

    try {
      const analysis = await fetchRepoContents(repoUrl, parseInt(wpm, 10));
      setResult(`
        Total words in repository: ${analysis.totalWords}
        Estimated time to type: ${analysis.timeToType.hours} hours ${analysis.timeToType.minutes} minutes
        Analysis: ${analysis.analysis}
      `);
    } catch (error) {
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">GitHub Repo Word Counter</h1>
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
              onChange={(e) => setWpm(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Enter typing speed (e.g., 50)"
              required
            />
          </div>
          <button
            onClick={handleFetch}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Analyze Repository'}
          </button>
        </div>
        {result && (
          <div className="mt-4 p-4 bg-gray-200 rounded">
            <pre className="whitespace-pre-wrap">{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
