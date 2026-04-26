import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  User as FirebaseUser,
  signOut as firebaseSignOut,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import {
  doc, getDoc, setDoc, onSnapshot, updateDoc, increment, arrayUnion
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from './firebase';

export interface UserData {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  xp: number;
  level: number;
  title: string;
  streak: number;
  lastLoginDate: string;
  completedQuestIds: string[];
  achievements: string[];
  lastActive: string;
  totalQuestsCompleted: number;
}

// Level thresholds: XP needed to reach each level
export const LEVEL_THRESHOLDS = [0, 300, 700, 1400, 2500, 4200, 7000, 11000, 18000, 30000];
export const LEVEL_TITLES = [
  'Script Kiddie', 'Novice Coder', 'Apprentice', 'Developer',
  'Senior Dev', 'Tech Lead', 'Architect', 'Principal', 'Distinguished', 'Legendary'
];

export const ACHIEVEMENTS = {
  FIRST_BLOOD: { id: 'first_blood', name: 'First Blood', desc: 'Complete your first quest', icon: '⚔️' },
  SPEED_CODER: { id: 'speed_coder', name: 'Speed Coder', desc: 'Submit a correct answer in under 60s', icon: '⚡' },
  POLYGLOT: { id: 'polyglot', name: 'Polyglot', desc: 'Complete quests in 3 different languages', icon: '🌐' },
  VETERAN: { id: 'veteran', name: 'Veteran', desc: 'Complete 10 quests', icon: '🏆' },
  STREAK_3: { id: 'streak_3', name: 'On Fire', desc: '3-day streak', icon: '🔥' },
};

export function calcLevel(xp: number): { level: number; title: string; progress: number; nextXP: number } {
  let level = 1;
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) { level = i + 1; break; }
  }
  level = Math.min(level, LEVEL_THRESHOLDS.length);
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0;
  const nextThreshold = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const progress = nextThreshold > currentThreshold
    ? ((xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100
    : 100;
  return { level, title: LEVEL_TITLES[level - 1] || 'Legend', progress: Math.min(progress, 100), nextXP: nextThreshold };
}

interface AuthContextType {
  user: FirebaseUser | null;
  userData: UserData | null;
  loading: boolean;
  authError: string | null;
  language: 'en' | 'fr';
  setLanguage: (lang: 'en' | 'fr') => void;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUserStats: (xpGain: number, questId: string, lang: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'fr'>('fr');
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const activityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetActivityTimer = () => {
    if (activityTimerRef.current) clearTimeout(activityTimerRef.current);
    activityTimerRef.current = setTimeout(() => {
      console.log('[Auth] Inactivity timeout reached');
      signOut();
    }, 15 * 60 * 1000); // 15 minutes
  };

  useEffect(() => {
    // Force LOCAL persistence (survives tab close)
    setPersistence(auth, browserLocalPersistence).catch(e => console.error('[Auth] Persistence error:', e));

    // Listen for activity to reset timeout
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(e => window.addEventListener(e, resetActivityTimer));

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (unsubscribeRef.current) { unsubscribeRef.current(); unsubscribeRef.current = null; }

      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        const today = new Date().toISOString().split('T')[0];

        try {
          const snap = await getDoc(userRef);
          if (!snap.exists()) {
            const newData: UserData = {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName || 'New Hacker',
              email: firebaseUser.email || '',
              photoURL: firebaseUser.photoURL || '',
              xp: 0, level: 1, title: 'Script Kiddie',
              streak: 1, lastLoginDate: today,
              completedQuestIds: [], achievements: [],
              lastActive: new Date().toISOString(),
              totalQuestsCompleted: 0,
            };
            await setDoc(userRef, newData);
          } else {
            const data = snap.data() as UserData;
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];
            const newStreak = data.lastLoginDate === yesterdayStr ? (data.streak || 0) + 1
              : data.lastLoginDate === today ? data.streak
              : 1;
            await updateDoc(userRef, { lastLoginDate: today, streak: newStreak, lastActive: new Date().toISOString() });
          }

          const unsub = onSnapshot(userRef, (doc) => {
            if (doc.exists()) {
              const d = doc.data() as UserData;
              const { level, title } = calcLevel(d.xp);
              setUserData({ ...d, level, title });
            }
            setLoading(false);
          }, (err) => { 
            console.error('Snapshot error:', err); 
            setLoading(false); // Stop loading even on snapshot error
          });
          unsubscribeRef.current = unsub;
        } catch (e) {
          console.error('Auth sync error:', e);
          setLoading(false); // Stop loading on document fetch error
        }
      } else {
        setUserData(null);
        setLoading(false);
      }
    }, (err) => {
      console.error('onAuthStateChanged error:', err);
      setLoading(false); // Stop loading on auth error
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeRef.current) unsubscribeRef.current();
      if (activityTimerRef.current) clearTimeout(activityTimerRef.current);
      events.forEach(e => window.removeEventListener(e, resetActivityTimer));
    };
  }, []);

  const signIn = async () => {
    setAuthError(null);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      // Try popup first (works in most cases), fall back to redirect
      await signInWithPopup(auth, provider);
    } catch (popupError: any) {
      if (popupError.code === 'auth/popup-blocked' || popupError.code === 'auth/popup-closed-by-user' || popupError.code === 'auth/cancelled-popup-request') {
        try {
          await signInWithRedirect(auth, provider);
        } catch (redirectError: any) {
          setAuthError(`Erreur: ${redirectError.message}`);
        }
      } else {
        setAuthError(`Erreur de connexion: ${popupError.message}`);
      }
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const updateUserStats = async (xpGain: number, questId: string, lang: string) => {
    if (!user || !userData) return;
    const userRef = doc(db, 'users', user.uid);
    const newXp = (userData.xp || 0) + xpGain;
    const { level, title } = calcLevel(newXp);
    const newCompleted = (userData.totalQuestsCompleted || 0) + 1;

    const newAchievements: string[] = [...(userData.achievements || [])];
    if (newCompleted === 1 && !newAchievements.includes('first_blood')) newAchievements.push('first_blood');
    if (newCompleted === 10 && !newAchievements.includes('veteran')) newAchievements.push('veteran');

    await updateDoc(userRef, {
      xp: increment(xpGain),
      level,
      title,
      completedQuestIds: arrayUnion(questId),
      totalQuestsCompleted: increment(1),
      achievements: newAchievements,
      lastActive: new Date().toISOString(),
    }).catch(e => handleFirestoreError(e, OperationType.UPDATE, `users/${user.uid}`));
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, authError, language, setLanguage, signIn, signOut, updateUserStats }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
