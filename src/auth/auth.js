import { auth, provider, signInWithPopup } from "../config/firebase-config.js";

class AuthManager {
  constructor() {
    this.currentUser = null;
  }

  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, provider);
      this.currentUser = result.user;
      return this.currentUser;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  }

  async signOut() {
    try {
      await auth.signOut();
      this.currentUser = null;
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  }

  getCurrentUser() {
    return this.currentUser;
  }
}

export const authManager = new AuthManager();