import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UrlScan from "./pages/UrlScan";
import EmailScan from "./pages/EmailScan";
import FileScan from "./pages/FileScan";
import AiChat from "./pages/AiChat";
import Reports from "./pages/Reports";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/url-scan" element={<UrlScan />} />
        <Route path="/email-scan" element={<EmailScan />} />
        <Route path="/file-scan" element={<FileScan />} />
        <Route path="/ai-chat" element={<AiChat />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

