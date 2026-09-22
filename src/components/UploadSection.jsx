import { useState } from "react";

import MessageBanner from "./MessageBanner";

function UploadSection({ onUpload, loading, error, message }) {
    const [selectedFile, setSelectedFile] = useState(null);

    function handleFileChange(event) {
        const file = event.target.files[0];

        setSelectedFile(file || null);
    }

    async function handleUpload() {
        if (!selectedFile) {
            return;
        }

        await onUpload(selectedFile);
        setSelectedFile(null);
    }

    return (
        <section className="upload-section">
            <h2>Upload File</h2>

            <div className="upload-box">
                <p>Select a file to upload</p>

                <input
                    type="file"
                    onChange={handleFileChange}
                />

                {selectedFile && (
                    <p>
                        Selected: <strong>{selectedFile.name}</strong>
                    </p>
                )}

                <button
                    type="button"
                    onClick={handleUpload}
                    disabled={loading}
                >
                    {loading ? "Uploading..." : "Upload File"}
                </button>
            </div>

            <MessageBanner
                message={message}
                error={error}
            />
        </section>
    );
}

export default UploadSection;

