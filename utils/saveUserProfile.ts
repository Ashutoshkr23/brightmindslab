import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const saveUserProfile = async (uid: string, name: string, email: string) => {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    await setDoc(userRef, {
      name,
      email,
      joinedAt: new Date().toISOString(),
    });
  }
};
