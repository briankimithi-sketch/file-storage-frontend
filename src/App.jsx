import { useEffect, useState } from "react";
import "./App.css";

import {
    getFiles,
    uploadFile,
    downloadFile,
    deleteFile,
} from "./services/fileService";

function App() {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
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

    function handleFileChange(event) {
        const file = event.target.files[0];
        setSelectedFile(file || null);
        setMessage("");
        setError("");
    }

    async function handleUpload() {
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
            setSelectedFile(null);
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
            <header className="header">
                <h1>File Storage</h1>
                <p>Upload and manage your files</p>
            </header>

            <main className="main">
                <section className="upload-section">
                    <h2>Upload File</h2>
                    <div className="upload-box">
                        <p>Select a file to upload</p>
                        <input type="file" onChange={handleFileChange} />
                        {selectedFile && (
                            <p>
                                Selected: <strong>{selectedFile.name}</strong>
                            </p>
                        )}
                        <button type="button" onClick={handleUpload} disabled={loading}>
                            {loading ? "Uploading..." : "Upload File"}
                        </button>
                    </div>
                    {message && <p className="success-message">{message}</p>}
                    {error && <p className="error-message">{error}</p>}
                </section>

                <section className="files-section">
                    <div className="section-header">
                        <h2>Stored Files</h2>
                        <span>
                            {files.length} {files.length === 1 ? "file" : "files"}
                        </span>
                    </div>

                    {files.length === 0 ? (
                        <div className="empty-state">
                            <p>No files uploaded yet.</p>
                        </div>
                    ) : (
                        <div className="file-list">
                            {files.map((file) => (
                                <div className="file-item" key={file.id}>
                                    <div className="file-info">
                                        <strong>{file.originalName}</strong>
                                        <span>{file.size} bytes</span>
                                    </div>
                                    <div className="file-actions">
                                        {/* VIEW */}
                                        <a
                                            href={file.viewUrl.replace(/^https?:\/\/[^/]+/, '')}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            View
                                        </a>

                                        {/* DOWNLOAD */}
                                        <button type="button" onClick={() => handleDownload(file)}>
                                            Download
                                        </button>

                                        {/* DELETE */}
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(file.originalName)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default App;

