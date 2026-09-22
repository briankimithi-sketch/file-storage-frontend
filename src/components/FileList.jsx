import EmptyState from "./EmptyState";
import FileItem from "./FileItem";

function FileList({ files, onDownload, onDelete }) {
    return (
        <section className="files-section">
            <div className="section-header">
                <h2>Stored Files</h2>

                <span>
                    {files.length}{" "}
                    {files.length === 1 ? "file" : "files"}
                </span>
            </div>

            {files.length === 0 ? (
                <EmptyState />
            ) : (
                <div className="file-list">
                    {files.map((file) => (
                        <FileItem
                            key={file.id}
                            file={file}
                            onDownload={onDownload}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

export default FileList;
