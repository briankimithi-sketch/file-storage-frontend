const API_URL = "http://localhost:8080/files";

export async function getFiles() {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch files");
    }

    return response.json();
}

export async function uploadFile(file) {
    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch(
        `${API_URL}/upload`,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!response.ok) {
        const message =
            await response.text();

        throw new Error(
            message || "Failed to upload file"
        );
    }

    return response.json();
}

export async function downloadFile(file) {
    const response =
        await fetch(file.downloadUrl);

    if (!response.ok) {
        throw new Error(
            `Download failed (${response.status})`
        );
    }

    const blob =
        await response.blob();

    /*
     * Content-Disposition is exposed by
     * FileController through CORS.
     */
    const disposition =
        response.headers.get(
            "Content-Disposition"
        );

    let filename =
        file.originalName;

    if (disposition) {
        const match =
            disposition.match(
                /filename="([^"]+)"/
            );

        if (match && match[1]) {
            filename = match[1];
        }
    }

    const blobUrl =
        window.URL.createObjectURL(
            blob
        );

    const link =
        document.createElement("a");

    link.href = blobUrl;
    link.download = filename;

    document.body.appendChild(link);

    link.click();

    link.remove();

    setTimeout(() => {
        window.URL.revokeObjectURL(
            blobUrl
        );
    }, 100);
}

export async function deleteFile(
    filename
) {

    const response =
        await fetch(
            `${API_URL}/${encodeURIComponent(
                filename
            )}`,
            {
                method: "DELETE",
            }
        );

    if (!response.ok) {
        throw new Error(
            "Failed to delete file"
        );
    }
}
