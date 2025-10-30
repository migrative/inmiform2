"use client";

interface DocumentViewerProps {
  document: any;
}

export default function DocumentViewer({ document }: DocumentViewerProps) {
  if (!document) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <svg
          className="w-16 h-16 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p className="text-lg font-medium">No document uploaded yet</p>
        <p className="text-sm mt-1">Upload a document to see extracted information</p>
      </div>
    );
  }

  const { fileName, documentType, status, extractedData, processedAt } = document;

  // Format document type for display
  const formatDocumentType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Render extracted data in a readable format
  const renderExtractedData = (data: any) => {
    if (!data) return null;

    if (data.error) {
      return (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-4">
          <p className="text-red-800 dark:text-red-200">{data.error}</p>
        </div>
      );
    }

    // If data has raw_text (fallback when JSON parsing fails)
    if (data.raw_text) {
      return (
        <div className="space-y-4">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Note: Could not parse structured data. Showing raw extraction:
            </p>
          </div>
          <pre className="bg-gray-50 dark:bg-gray-900 rounded p-4 overflow-auto text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
            {data.raw_text}
          </pre>
        </div>
      );
    }

    // Render structured data
    return (
      <div className="space-y-4">
        {Object.entries(data).map(([key, value]) => {
          // Skip rendering certain meta fields
          if (key === 'confidence' || key === 'notes') return null;

          const formattedKey = key
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

          return (
            <div key={key} className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {formattedKey}
              </dt>
              <dd className="text-base text-gray-900 dark:text-white">
                {typeof value === 'object' ? (
                  <pre className="text-sm bg-gray-50 dark:bg-gray-900 rounded p-2 overflow-auto">
                    {JSON.stringify(value, null, 2)}
                  </pre>
                ) : (
                  value?.toString() || 'N/A'
                )}
              </dd>
            </div>
          );
        })}

        {/* Show confidence and notes at the bottom if present */}
        {data.confidence && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Confidence:
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  data.confidence === 'high'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    : data.confidence === 'medium'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                }`}
              >
                {data.confidence.toUpperCase()}
              </span>
            </div>
          </div>
        )}

        {data.notes && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-4">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
              Notes:
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300">{data.notes}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Document Info */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatDocumentType(documentType)}
          </h3>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              status === 'completed'
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                : status === 'processing'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                : status === 'failed'
                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            {status.toUpperCase()}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {fileName}
        </p>
        {processedAt && (
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Processed: {new Date(processedAt).toLocaleString()}
          </p>
        )}
      </div>

      {/* Extracted Data */}
      <div className="space-y-2">
        {status === 'processing' ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500 dark:text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
            <p>Processing document...</p>
          </div>
        ) : status === 'completed' ? (
          <dl className="space-y-3">{renderExtractedData(extractedData)}</dl>
        ) : status === 'failed' ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">
              Failed to process document. Please try again.
            </p>
          </div>
        ) : null}
      </div>

      {/* Export Button */}
      {status === 'completed' && extractedData && (
        <button
          onClick={() => {
            const dataStr = JSON.stringify(extractedData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${fileName.replace('.pdf', '')}_extracted.json`;
            link.click();
            URL.revokeObjectURL(url);
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Export as JSON
        </button>
      )}
    </div>
  );
}
