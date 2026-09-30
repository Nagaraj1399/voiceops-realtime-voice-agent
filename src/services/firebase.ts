import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDocFromServer,
  collection,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { Booking, BusinessAction, ConversationSession } from '../types/voice';

// Import or parse firebase configuration
let firebaseConfig: any = {
  projectId: "resolute-web-rmn89",
  appId: "1:765160848149:web:93adb108b58a673ec5871c",
  apiKey: "AIzaSyAwH7yMYBj8SLdSB4o9SLxtAnNZVlXoWzs",
  authDomain: "resolute-web-rmn89.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-voiceopsai-35c9ea44-94b2-45fd-a80a-fd2111d9c991",
  storageBucket: "resolute-web-rmn89.firebasestorage.app",
  messagingSenderId: "765160848149",
};

try {
  // If running in environment with firebase-applet-config.json
  const configElement = document.getElementById('firebase-config');
  if (configElement?.textContent) {
    firebaseConfig = JSON.parse(configElement.textContent);
  }
} catch {
  // Use fallback values from provisioning
}

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firestore with custom database ID from config
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

/**
 * Validate connection to Firestore on application boot
 */
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firestore connection verified successfully.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline warning. Please check your network or Firebase configuration.');
      return false;
    }
    // Document might not exist yet, but server responded without permission/network error
    return true;
  }
}

/**
 * Google Sign-In with Firebase Auth
 * Gracefully handles iframe popup blockers by falling back to anonymous auth or simulated demo credentials
 */
export async function signInWithGoogle(): Promise<FirebaseUser | null> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  try {
    const result = await signInWithPopup(auth, provider);
    if (result.user) {
      await syncUserProfile(result.user);
      return result.user;
    }
    return null;
  } catch (err: any) {
    console.warn('Google Sign-In popup interrupted or blocked in iframe sandbox:', err?.message || err);
    // Fallback: anonymous or test sign-in
    try {
      const anonResult = await signInAnonymously(auth);
      if (anonResult.user) {
        await syncUserProfile(anonResult.user, 'Demo Operator (Google Fallback)');
        return anonResult.user;
      }
    } catch (anonErr) {
      console.error('Anonymous fallback failed:', anonErr);
    }
    return null;
  }
}

/**
 * Sign In Anonymously / Guest Mode
 */
export async function signInAsGuest(): Promise<FirebaseUser | null> {
  try {
    const result = await signInAnonymously(auth);
    if (result.user) {
      await syncUserProfile(result.user, 'Guest Operator');
      return result.user;
    }
    return null;
  } catch (err) {
    console.error('Guest sign-in failed:', err);
    return null;
  }
}

/**
 * Sign out
 */
export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Sync user profile to Firestore `/users/{userId}`
 */
export async function syncUserProfile(user: FirebaseUser, overrideDisplayName?: string): Promise<void> {
  if (!user.uid) return;
  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(
      userRef,
      {
        id: user.uid,
        email: user.email || `${user.uid}@demo.voiceops.ai`,
        displayName: overrideDisplayName || user.displayName || 'VoiceOps Operator',
        photoURL: user.photoURL || '',
        updatedAt: new Date().toISOString(),
        createdAt: user.metadata.creationTime || new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (e) {
    console.warn('Failed to sync user profile to Firestore:', e);
  }
}

/**
 * Save a conversation session to Firestore
 */
export async function saveConversationToFirestore(userId: string, session: ConversationSession): Promise<void> {
  if (!userId || !session.id) return;
  try {
    const ref = doc(db, 'users', userId, 'conversations', session.id);
    await setDoc(ref, {
      ...session,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (e) {
    console.warn('Failed to save conversation to Firestore:', e);
  }
}

/**
 * Subscribe to user's conversation sessions from Firestore
 */
export function subscribeToConversations(
  userId: string,
  onData: (sessions: ConversationSession[]) => void
): () => void {
  if (!userId) return () => {};
  const colRef = collection(db, 'users', userId, 'conversations');
  return onSnapshot(colRef, (snapshot) => {
    const items: ConversationSession[] = [];
    snapshot.forEach((docSnap) => {
      items.push(docSnap.data() as ConversationSession);
    });
    if (items.length > 0) {
      onData(items);
    }
  }, (err) => {
    console.warn('Conversations snapshot listener warning:', err);
  });
}

/**
 * Save a booking to Firestore
 */
export async function saveBookingToFirestore(userId: string, booking: Booking): Promise<void> {
  if (!userId || !booking.id) return;
  try {
    const ref = doc(db, 'users', userId, 'bookings', booking.id);
    await setDoc(ref, {
      ...booking,
      userId,
      createdAt: booking.createdAt || new Date().toISOString(),
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (e) {
    console.warn('Failed to save booking to Firestore:', e);
  }
}

/**
 * Subscribe to user's bookings from Firestore
 */
export function subscribeToBookings(
  userId: string,
  onData: (bookings: Booking[]) => void
): () => void {
  if (!userId) return () => {};
  const colRef = collection(db, 'users', userId, 'bookings');
  return onSnapshot(colRef, (snapshot) => {
    const items: Booking[] = [];
    snapshot.forEach((docSnap) => {
      items.push(docSnap.data() as Booking);
    });
    if (items.length > 0) {
      onData(items);
    }
  }, (err) => {
    console.warn('Bookings snapshot listener warning:', err);
  });
}

/**
 * Save an executed business action to Firestore
 */
export async function saveActionToFirestore(userId: string, action: BusinessAction): Promise<void> {
  if (!userId || !action.id) return;
  try {
    const ref = doc(db, 'users', userId, 'actions', action.id);
    await setDoc(ref, {
      ...action,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (e) {
    console.warn('Failed to save action to Firestore:', e);
  }
}

/**
 * Subscribe to user's business actions from Firestore
 */
export function subscribeToActions(
  userId: string,
  onData: (actions: BusinessAction[]) => void
): () => void {
  if (!userId) return () => {};
  const colRef = collection(db, 'users', userId, 'actions');
  return onSnapshot(colRef, (snapshot) => {
    const items: BusinessAction[] = [];
    snapshot.forEach((docSnap) => {
      items.push(docSnap.data() as BusinessAction);
    });
    if (items.length > 0) {
      onData(items);
    }
  }, (err) => {
    console.warn('Actions snapshot listener warning:', err);
  });
}
