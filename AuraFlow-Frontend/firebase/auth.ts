import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import firebaseApp from "./firebase";

// Initialize Firebase Auth
const auth = getAuth(firebaseApp);

// Sign-In Function
export const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

// Sign-Out Function
export const logout = async () => {
  try {
    await signOut(auth);
    console.log("User signed out");
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

export default auth;