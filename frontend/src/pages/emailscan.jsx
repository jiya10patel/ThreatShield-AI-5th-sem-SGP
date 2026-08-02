import { useState } from "react";
// import api from "../api/axios"; // will be used once backend is ready

function EmailScan() {
  const [emailInput, setEmailInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleScan = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!emailInput.trim()) {
      setError("Please paste email content or headers to analyze.");
      return;
    }

    setLoading(true);

    // ---- TEMPORARY DUMMY SCAN (remove once real backend is ready) ----
    setTimeout(() => {
      const lower = emailInput.toLowerCase();
      const dangerWords = ["urgent", "verify your account", "click here", "suspended", "prize", "winner"];
      const hasDangerWord = dangerWords.some((w) => lower.includes(w));

      let dummyResult;
      if (hasDangerWord) {
        dummyResult = {
          riskLevel: "Malicious",
          spf: "Fail",
          dkim: "Fail",
          dmarc: "Fail",
          findings: [
            "Sender domain does not match reply-to address",
            "Email contains urgency-based manipulative language",
            "Suspicious embedded link detected",
          ],
          recommendation:
            "This email shows strong signs of phishing. Do not click any links or reply with personal information.",
        };
      } else {
        dummyResult = {
          riskLevel: "Safe",
          spf: "Pass",
          dkim: "Pass",
          dmarc: "Pass",
          findings: [
            "Sender authentication checks passed",
            "No suspicious links detected",
          ],
          recommendation: "No major threats detected. Email appears legitimate.",
        };
      }

      setResult(dummyResult);
      setLoading(false);
    }, 1000);
    // -------------------------------------------------------------

    /* REAL VERSION (use this once Harshil's backend is ready):
    try {
      const response = await api.post("/email", { content: emailInput });
      setResult(response.data);
    } catch (err) {
      setError("Analysis failed. Please try again.");
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

  const getCheckColor = (status) => {
    return status === "Pass" ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="min-h-screen bg-orange-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">📧 Email Analyzer</h1>
        <p className="text-slate-600 mb-6">
          Paste email content or headers below to check for phishing signs.
        </p>

        {/* Input form */}
        <form
          onSubmit={handleScan}
          className="bg-white rounded-xl shadow p-6 mb-6"
        >
          <textarea
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="Paste email content or headers here..."
            rows={6}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze Email"}
          </button>
        </form>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Results */}
        {result && (
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-slate-800">
                Analysis Result
              </h2>
              <span
                className={`text-sm font-semibold px-3 py-1 rounded-full border ${getBadgeColor(
                  result.riskLevel
                )}`}
              >
                {result.riskLevel}
              </span>
            </div>

            {/* Authentication checks */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-slate-50 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-500 mb-1">SPF</p>
                <p className={`font-semibold ${getCheckColor(result.spf)}`}>
                  {result.spf}
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-500 mb-1">DKIM</p>
                <p className={`font-semibold ${getCheckColor(result.dkim)}`}>
                  {result.dkim}
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-500 mb-1">DMARC</p>
                <p className={`font-semibold ${getCheckColor(result.dmarc)}`}>
                  {result.dmarc}
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

export default EmailScan;