const TOKEN_KEY = "profitlens_access_token";
const USER_KEY = "profitlens_user";

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  businessId: string | null;
}

export const authStorage = {
  save(token: string, user: StoredUser) {
    if (typeof window === "undefined") return;

    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getToken(): string | null {
    if (typeof window === "undefined") return null;

    return sessionStorage.getItem(TOKEN_KEY);
  },

  getUser(): StoredUser | null {
    if (typeof window === "undefined") return null;


    const value = sessionStorage.getItem(USER_KEY);
    if (!value) return null;

    try {
      return JSON.parse(value) as StoredUser;
    } catch {
      sessionStorage.removeItem(USER_KEY);
      return null;
    }
  },

  clear() {
    if (typeof window === "undefined") return;

    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  },
};
