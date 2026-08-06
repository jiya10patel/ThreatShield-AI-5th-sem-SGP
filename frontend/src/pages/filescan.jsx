import { useState } from "react";
// import api from "../api/axios"; // will be used once backend is ready

function FileScan() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleScan = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setUploadProgress(0);

    if (!file) {
      setError("Please select or drag a file to analyze.");
      return;
    }

    setLoading(true);

    // ---- TEMPORARY DUMMY UPLOAD SIMULATION (remove once real backend is ready) ----
    // Simulate progress over 1.5 seconds
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 40;
      if (progress > 90) progress = 90;
      setUploadProgress(Math.floor(progress));
      if (progress >= 90) clearInterval(interval);
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);

      const fileName = file.name.toLowerCase();
      const fileSize = (file.size / 1024).toFixed(2); // KB
      const isSuspicious = fileName.includes("malware") || fileName.includes("virus");
      const isExecutable = [".exe", ".bat", ".sh", ".com"].some((ext) =>
        fileName.endsWith(ext)
      );

      let dummyResult;
      if (isSuspicious) {
        dummyResult = {
          fileName: file.name,
          fileSize: `${fileSize} KB`,
          fileType: file.type || "Unknown",
          riskLevel: "Malicious",
          hash: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
          entropy: 7.8,
          findings: [
            "File name contains known malware keywords",
            "Executable file detected",
            "High entropy indicates compression or encryption",
          ],
          recommendation:
            "Do not open or execute this file. This file shows strong signs of being malicious. Delete it immediately.",
        };
      } else if (isExecutable) {
        dummyResult = {
          fileName: file.name,
          fileSize: `${fileSize} KB`,
          fileType: file.type || "Unknown",
          riskLevel: "Suspicious",
          hash: "b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7",
          entropy: 6.2,
          findings: [
            "Executable file type detected",
            "Medium entropy detected",
          ],
          recommendation:
            "Be cautious. Only open executable files from trusted sources.",
        };
      } else {
        dummyResult = {
          fileName: file.name,
          fileSize: `${fileSize} KB`,
          fileType: file.type || "Unknown",
          riskLevel: "Safe",
          hash: "c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8",
          entropy: 3.5,
          findings: [
            "File type is not executable",
            "Normal entropy detected",
            "No known malware signatures found",
          ],
          recommendation: "No major threats detected. File appears safe.",
        };
      }

      setResult(dummyResult);
      setLoading(false);
    }, 1500);
    // -------------------------------------------------------------

    /* REAL VERSION (use this once Harshil's backend is ready):
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post("/file", formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });
      setResult(response.data);
    } catch (err) {
      setError("File analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
    */
  };

  const getBadgeColor = (level) => {
    if (level === "Safe") return "bg-green-100 text-green-700 border-green-400";
    if (level === "Suspicious") return "bg-yellow-100 text-yellow-700 border-yellow-400";
    return "bg-red-100 text-red-700 border-red-400";
  };

  return (
    <div className="min-h-screen bg-orange-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">📁 File Analyzer</h1>
        <p className="text-slate-600 mb-6">
          Upload or drag a file below to check for malware and analyze its properties.
        </p>

        {/* File upload area */}
        <form
          onSubmit={handleScan}
          className={`bg-white rounded-xl shadow p-8 mb-6 border-2 border-dashed transition ${
            dragActive ? "border-orange-400 bg-orange-50" : "border-slate-300"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center">
            <p className="text-3xl mb-2">📤</p>
            <p className="text-slate-800 font-semibold mb-1">
              {file ? file.name : "Drop file here or click to select"}
            </p>
            <p className="text-sm text-slate-500 mb-4">
              {file
                ? `${(file.size / 1024).toFixed(2)} KB`
                : "Supported: Any file type"}
            </p>
            <input
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              id="fileInput"
            />
            <label
              htmlFor="fileInput"
              className="cursor-pointer bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg transition mb-2"
            >
              Choose File
            </label>
            {file && (
              <button
                type="button"
                onClick={() => setFile(null)}
                className="text-sm text-red-500 hover:text-red-600"
              >
                Clear
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={loading || !file}
            className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze File"}
          </button>
        </form>

        {/* Upload progress */}
        {loading && uploadProgress > 0 && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-slate-600 mb-1">
              <span>Upload progress</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-orange-500 transition-all"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Results */}
        {result && (
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-800 break-all mb-1">
                  {result.fileName}
                </h2>
                <p className="text-sm text-slate-500">
                  {result.fileSize} • {result.fileType}
                </p>
              </div>
              <span
                className={`text-sm font-semibold px-3 py-1 rounded-full border whitespace-nowrap ${getBadgeColor(
                  result.riskLevel
                )}`}
              >
                {result.riskLevel}
              </span>
            </div>

            {/* File metadata */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-500 mb-1">Hash (SHA256)</p>
                <p className="text-xs font-mono text-slate-700 break-all">
                  {result.hash}
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-500 mb-1">Entropy</p>
                <p className="text-sm font-semibold text-slate-800">
                  {result.entropy}
                  <span className="text-xs text-slate-500">/8.0</span>
                </p>
              </div>
            </div>

            {/* Findings */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-slate-700 mb-2">
                Findings
              </h3>
              <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                {result.findings.map((finding, i) => (
                  <li key={i}>{finding}</li>
                ))}
              </ul>
            </div>

            {/* Recommendation */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm text-slate-700">
              💡 {result.recommendation}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FileScan;