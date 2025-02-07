import React, { useState } from 'react';
import { Wand2 } from 'lucide-react';

interface QuestionGeneratorProps {
  onGenerate: (keyword: string) => void;
  isGenerating: boolean;
}

export function QuestionGenerator({ onGenerate, isGenerating }: QuestionGeneratorProps) {
  const [keyword, setKeyword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      onGenerate(keyword.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center space-x-2 mb-4">
        <Wand2 className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-gray-900">Generate Questions</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="keyword" className="block text-sm font-medium text-gray-700">
            Keyword or Topic
          </label>
          <input
            type="text"
            id="keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter a topic..."
            disabled={isGenerating}
          />
        </div>

        <button
          type="submit"
          disabled={isGenerating || !keyword.trim()}
          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 mr-2" />
              Generate Questions
            </>
          )}
        </button>
      </div>
    </form>
  );
}