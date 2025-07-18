import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import js from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

SyntaxHighlighter.registerLanguage("javascript", js);

const ScanDetails = () => {
  const { state } = useLocation(); // expecting { files: [...], repoName: 'xyz' }
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [impact, setImpact] = useState([]);

  const handleSelectFile = async (filePath) => {
    setSelectedFile(filePath);

    try {
      const previewRes = await fetch(`/api/file/preview?path=${encodeURIComponent(filePath)}`);
      const code = await previewRes.text();
      setFileContent(code);

      const impactRes = await fetch(`/api/file/impact?file=${encodeURIComponent(filePath)}`);
      const impactData = await impactRes.json();
      setImpact(impactData.referencedBy || []);
    } catch (err) {
      console.error("Failed to load preview/impact", err);
    }
  };

  const files = state?.files || [];

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left - File Tree */}
      <div className="bg-white border p-4 rounded-lg">
        <h3 className="font-semibold text-lg mb-2">Unused Files</h3>
        <ul className="space-y-2 text-sm">
          {files.map((f, i) => (
            <li
              key={i}
              onClick={() => handleSelectFile(f)}
              className="cursor-pointer hover:text-blue-600 truncate"
            >
              📄 {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Right - Preview + Impact */}
      <div className="lg:col-span-2 space-y-4">
        {selectedFile ? (
          <>
            <div className="bg-white p-4 border rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">
                Code Preview: <span className="text-blue-600">{selectedFile.split("/").pop()}</span>
              </h4>
              <SyntaxHighlighter language="javascript" style={docco} showLineNumbers>
                {fileContent}
              </SyntaxHighlighter>
            </div>

            <div className="bg-white p-4 border rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Referenced In:</h4>
              {impact.length === 0 ? (
                <p className="text-green-600 text-sm">✅ This file is not referenced anywhere.</p>
              ) : (
                <ul className="list-disc pl-6 text-sm text-gray-700">
                  {impact.map((ref, i) => (
                    <li key={i}>{ref}</li>
                  ))}
                </ul>
              )}
            </div>
          </>
        ) : (
          <p className="text-gray-500">Select a file to view preview and impact analysis.</p>
        )}
      </div>
    </div>
  );
};

export default ScanDetails;
