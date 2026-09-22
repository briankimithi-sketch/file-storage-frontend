import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import UploadSection from "./components/UploadSection";
import FileList from "./components/FileList";
import {
  getFiles,
  uploadFile,
  downloadFile,
  deleteFile,
} from "./services/fileService";

function App() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadFiles();
  }, []);

  async function loadFiles() {
    try {
      setError("");
      const data = await getFiles();
      setFiles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load files.");
    }
  }

  async function handleUpload(selectedFile) {
    if (!selectedFile) {
      setError("Please select a file first.");
      return;
    }
    try {
      setLoading(true);
      setMessage("");
      setError("");
      await uploadFile(selectedFile);
      setMessage("File uploaded successfully.");
      await loadFiles();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload(file) {
    try {
      setError("");
      setMessage("");
      await downloadFile(file);
      setMessage("Download started successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed.");
    }
  }

  async function handleDelete(filename) {
    const confirmed = window.confirm(`Are you sure you want to delete "${filename}"?`);
    if (!confirmed) return;

    try {
      setError("");
      setMessage("");
      await deleteFile(filename);
      setMessage("File deleted successfully.");
      await loadFiles();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    }
  }

  return (
    <div className="app">
      <Header />
      <main className="main">
        <UploadSection
          onUpload={handleUpload}
          loading={loading}
          error={error}
          message={message}
        />
        <FileList
          files={files}
          onDownload={handleDownload}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
}

export default App;