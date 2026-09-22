import HttpService from "./HttpService";

const API_BASE = "/files";

export async function getFiles() {
  const response = await HttpService.get(API_BASE);
  if (!response.ok) {
    throw new Error(`Failed to fetch files (${response.status})`);
  }
  return response.json();
}

export async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await HttpService.post(`${API_BASE}/upload`, formData);
  if (!response.ok) {
    throw new Error(`Upload failed (${response.status})`);
  }
  return response.json();
}

export async function downloadFile(file) {
  const url = file.downloadUrl.replace(/^https?:\/\/[^/]+/, "");
  const response = await HttpService.get(url);
  if (!response.ok) {
    throw new Error(`Download failed (${response.status})`);
  }

  const blob = await response.blob();
  const disposition = response.headers.get("Content-Disposition");

  let filename = file.originalName;
  if (disposition) {
    const match = disposition.match(/filename="([^"]+)"/);
    if (match && match[1]) {
      filename = match[1];
    }
  }

  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);
}

export async function deleteFile(filename) {
  const response = await HttpService.delete(`${API_BASE}/${encodeURIComponent(filename)}`);
  if (!response.ok) {
    throw new Error(`Delete failed (${response.status})`);
  }
  return response;
}