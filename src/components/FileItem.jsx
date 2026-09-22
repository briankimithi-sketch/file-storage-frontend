function FileItem({ file, onDownload, onDelete }) {
    const viewUrl = file.viewUrl.replace(/^https?:\/\/[^/]+/, "");

    return (
        <div className="file-item">
            <div className="file-info">
                <strong>{file.originalName}</strong>
                <span>{file.size} bytes</span>
            </div>

            <div className="file-actions">
                <a
                    href={viewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    View
                </a>

                <button
                    type="button"
                    onClick={() => onDownload(file)}
                >
                    Download
                </button>

                <button
                    type="button"
                    onClick={() => onDelete(file.originalName)}
                >
                    Delete
                </button>
            </div>
        </div>
    );
}

export default FileItem;
