"use client";

import { useState } from "react";
import DocumentUploader from "@/components/DocumentUploader";
import DocumentViewer from "@/components/DocumentViewer";

export default function Home() {
  const [uploadedDocument, setUploadedDocument] = useState<any>(null);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Inmiform
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              AI-Powered Immigration Document Processor
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Upload identity documents (passport, birth certificate, ID) to extract information for USCIS forms
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                Upload Document
              </h2>
              <DocumentUploader onUploadSuccess={setUploadedDocument} />
            </div>

            {/* Results Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                Extracted Information
              </h2>
              <DocumentViewer document={uploadedDocument} />
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-8 bg-blue-50 dark:bg-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Supported Documents
            </h3>
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-center">
                <span className="mr-2">📘</span> Passport
              </li>
              <li className="flex items-center">
                <span className="mr-2">📄</span> Birth Certificate
              </li>
              <li className="flex items-center">
                <span className="mr-2">🪪</span> National ID
              </li>
              <li className="flex items-center">
                <span className="mr-2">💳</span> Driver License
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
