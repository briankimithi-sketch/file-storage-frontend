import keycloak from "../keycloak";

const UserService = {
  async initKeycloak(onSuccess, onError) {
    try {
      const authenticated = await keycloak.init({
        onLoad: "login-required",
        checkLoginIframe: false,
        pkceMethod: "S256",
      });

      if (!authenticated) {
        console.warn("User is not authenticated");
      }

      if (onSuccess) {
        onSuccess(authenticated);
      }
    } catch (err) {
      console.error("Keycloak initialization failed:", err);
      if (onError) {
        onError(err);
      }
    }
  },

  doLogin: () => keycloak.login(),
  doLogout: () => keycloak.logout(),

  getToken: () => keycloak.token,
  isLoggedIn: () => !!keycloak.token,

  async updateToken(minValidity = 30) {
    try {
      const refreshed = await keycloak.updateToken(minValidity);
      if (refreshed) {
        console.log("Keycloak token refreshed");
      }
      return keycloak.token;
    } catch (error) {
      console.error("Failed to refresh Keycloak token:", error);
      throw error;
    }
  },

  getUsername: () => keycloak.tokenParsed?.preferred_username,
  getUser: () => keycloak.tokenParsed || null,
  hasRole: (roles) => roles.some((role) => keycloak.hasRealmRole(role)),
};

export default UserService;