import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
// import api from "../api/axios"; // will be used once backend is ready

function UrlScan() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleScan = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!url.trim()) {
      setError("Please enter a URL to scan.");
      return;
    }

    setLoading(true);

    // ---- TEMPORARY DUMMY SCAN (remove once real backend is ready) ----
    setTimeout(() => {
      const lower = url.toLowerCase();
      const dangerWords = ["verify", "secure-login", "bank", "urgent", "suspended", "free-gift"];
      const looksHttps = lower.startsWith("https://");
      const hasDangerWord = dangerWords.some((w) => lower.includes(w));

      let dummyResult;
      if (hasDangerWord) {
        dummyResult = {
          url,
          riskScore: 91,
          riskLevel: "Malicious",
          reasons: [
            "URL contains known phishing keywords",
            "Domain registered very recently",
            "No valid HTTPS certificate found",
          ],
          recommendation:
            "Do not enter any personal or financial information. This site shows strong signs of phishing.",
        };
      } else if (looksHttps) {
        dummyResult = {
          url,
          riskScore: 12,
          riskLevel: "Safe",
          reasons: [
            "Valid HTTPS certificate found",
            "Domain has an established registration history",
          ],
          recommendation: "No major threats detected. Site appears safe to visit.",
        };
      } else {
        dummyResult = {
          url,
          riskScore: 58,
          riskLevel: "Suspicious",
          reasons: [
            "URL does not use HTTPS",
            "Domain registered recently",
          ],
          recommendation:
            "Proceed with caution. Avoid entering sensitive information on this site.",
        };
      }

      setResult(dummyResult);
      setLoading(false);
    }, 1000);
    // -------------------------------------------------------------

    /* REAL VERSION (use this once Harshil's backend is ready):
    try {
      const response = await api.post("/url", { url });
      setResult(response.data);
    } catch (err) {
      setError("Scan failed. Please try again.");
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

  const getChartColor = (level) => {
    if (level === "Safe") return "#22c55e";
    if (level === "Suspicious") return "#eab308";
    return "#ef4444";
  };

  const chartData = result
    ? [
        { name: "Risk", value: result.riskScore },
        { name: "Remaining", value: 100 - result.riskScore },
      ]
    : [];

  return (
    <div className="min-h-screen bg-orange-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">🔗 URL Scanner</h1>
        <p className="text-slate-600 mb-6">
          Paste a URL below to check it for phishing or malicious content.
        </p>

        {/* Input form */}
        <form
          onSubmit={handleScan}
          className="bg-white rounded-xl shadow p-6 flex gap-3 mb-6"
        >
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Scanning..." : "Scan"}
          </button>
        </form>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Results */}
        {result && (
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-slate-800 break-all">
                {result.url}
              </h2>
              <span
                className={`text-sm font-semibold px-3 py-1 rounded-full border ${getBadgeColor(
                  result.riskLevel
                )}`}
              >
                {result.riskLevel}
              </span>
            </div>

            {/* Chart + score side by side */}
            <div className="flex items-center gap-6 mb-4">
              <div style={{ width: 120, height: 120 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      innerRadius={35}
                      outerRadius={55}
                      startAngle={90}
                      endAngle={-270}
                    >
                      <Cell fill={getChartColor(result.riskLevel)} />
                      <Cell fill="#e2e8f0" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-800">
                  {result.riskScore}
                  <span className="text-base text-slate-400">/100</span>
                </p>
                <p className="text-sm text-slate-500">Risk Score</p>
              </div>
            </div>

            {/* Reasons */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-slate-700 mb-2">
                Findings
              </h3>
              <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                {result.reasons.map((reason, i) => (
                  <li key={i}>{reason}</li>
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

export default UrlScan;