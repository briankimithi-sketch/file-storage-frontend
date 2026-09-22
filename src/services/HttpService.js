import keycloak from "../keycloak";

async function getToken() {
  if (!keycloak.authenticated) {
    throw new Error("User is not authenticated");
  }
  try {
    await keycloak.updateToken(30);
  } catch (error) {
    console.error("Failed to refresh Keycloak token:", error);
    throw new Error("Authentication session expired", { cause: error });
  }
  return keycloak.token;
}

async function request(url, options = {}) {
  const token = await getToken();
  const headers = new Headers(options.headers || {});
  headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    console.error("API returned 401 Unauthorized");
    try {
      await keycloak.updateToken(-1);
    } catch (error) {
      console.error("Unable to refresh authentication:", error);
    }
  }

  return response;
}

const HttpService = {
  get(url, options = {}) {
    return request(url, { ...options, method: "GET" });
  },

  post(url, body, options = {}) {
    const headers = new Headers(options.headers || {});
    if (!(body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }
    return request(url, { ...options, method: "POST", body, headers });
  },

  put(url, body, options = {}) {
    const headers = new Headers(options.headers || {});
    headers.set("Content-Type", "application/json");
    return request(url, { ...options, method: "PUT", body: JSON.stringify(body), headers });
  },

  delete(url, options = {}) {
    return request(url, { ...options, method: "DELETE" });
  },
};

export default HttpService;