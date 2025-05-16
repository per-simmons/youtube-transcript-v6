"use client";

import { useState, FormEvent, useRef } from "react";
import { ClipboardIcon, DownloadIcon, LoadingCircle } from "@/components/icons";

export default function Home() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  
  const transcriptRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError("Please enter a YouTube URL");
      return;
    }
    
    setIsLoading(true);
    setTranscript("");
    setError("");
    setIsCopied(false);
    
    try {
      const response = await fetch("/api/transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch transcript");
      }
      
      setTranscript(data.transcript);
      
      if (transcriptRef.current) {
        transcriptRef.current.scrollTop = 0;
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching the transcript");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopy = async () => {
    if (!transcript) return;
    
    try {
      await navigator.clipboard.writeText(transcript);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy transcript:", err);
    }
  };
  
  const handleDownload = () => {
    if (!transcript) return;
    
    const blob = new Blob([transcript], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transcript.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 dark:text-white">
            YouTube Transcript Downloader
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Enter a YouTube URL to fetch, view, and download the transcript
          </p>
        </header>
        
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 
                         disabled:hover:bg-blue-600 transition-colors duration-200"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <LoadingCircle className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                  Loading...
                </span>
              ) : (
                "Get Transcript"
              )}
            </button>
          </div>
        </form>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
            {error}
          </div>
        )}
        
        {transcript && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-medium dark:text-white">Transcript</h2>
              <div className="flex space-x-2">
                <button
                  onClick={handleCopy}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 rounded transition-colors"
                  title="Copy to clipboard"
                >
                  <ClipboardIcon className="h-5 w-5" />
                  {isCopied && <span className="ml-1 text-xs text-green-500">Copied!</span>}
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 rounded transition-colors"
                  title="Download as text file"
                >
                  <DownloadIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div 
              ref={transcriptRef}
              className="p-4 max-h-96 overflow-y-auto font-mono text-sm dark:text-gray-200"
            >
              {transcript.split("\n").map((line, i) => (
                <div key={i} className="mb-1">
                  {line}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
