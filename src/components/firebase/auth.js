import { auth, db } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export const doCreateUserWithEmailAndPassword = async (email, password, userData) => {
  // 1. Create user in Firebase Auth
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // 2. Create document in 'id' collection using email as ID
  await setDoc(doc(db, 'id', user.uid), {
    email,
    ...userData, // name, major, universityId
  });

  // 3. Optionally also store in 'users' collection (for auth lookup)
  await setDoc(doc(db, 'users', user.uid), {
    email,
    ...userData,
  });

  return user;
};

export const doSignInWithEmailAndPassword = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const doSignOut = () => signOut(auth);
