import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronRight, Sun, Moon, Cpu, Award,
  Monitor, Server, Database, Shield, Zap
} from 'lucide-react';
import { useAuth, calcLevel, LEVEL_TITLES } from '../lib/AuthContext';
import { useTheme } from '../lib/ThemeContext';
import { Mentor } from '../constants';

// ── Icon helper ─────────────────────────────────────────────
export function ModuleIcon({ name, size = 24 }: { name: string; size?: number }) {
  const icons: Record<string, React.ElementType> = {
    monitor: Monitor, server: Server, database: Database, shield: Shield, zap: Zap, cpu: Cpu
  };
  const Icon = icons[name] || Cpu;
  return <Icon size={size} />;
}

// ── RetroBox ────────────────────────────────────────────────
export const RetroBox: React.FC<{ children: React.ReactNode; className?: string; title?: string }> = ({ children, className = '', title }) => (
  <div className={`sharp-box p-5 relative ${className}`}>
    {title && (
      <div className="absolute -top-3 left-5 bg-dg-pink px-4 py-0.5 text-[10px] font-bold uppercase tracking-[0.25em] text-white transform -skew-x-12 z-20 shadow-lg font-mono">
        {title}
      </div>
    )}
    <div className="relative z-10">{children}</div>
  </div>
);

// ── CharacterSprite (single image, no frame animation) ──────
export const CharacterSprite = React.forwardRef<
  { startTalking: () => void; stopTalking: () => void },
  { mentor: Mentor; className?: string; isTalking?: boolean; isStatic?: boolean }
>(({ mentor, className = '' }, _ref) => {
  return (
    <div className={`relative flex items-end justify-center ${className}`}>
      <img
        src={mentor.avatar}
        alt={mentor.name}
        className="pixel-render animate-breathe w-full h-full object-contain object-bottom select-none"
        draggable={false}
      />
    </div>
  );
});
CharacterSprite.displayName = 'CharacterSprite';

// ── DialogueBox ─────────────────────────────────────────────
// Mentor character is prominent on the RIGHT with a large portrait.
// Text is clearly readable on the LEFT side of the dialogue box.
export const DialogueBox: React.FC<{
  mentor: Mentor; message: string; onComplete?: () => void;
}> = ({ mentor, message, onComplete }) => {
  const [displayed, setDisplayed] = React.useState('');
  const [idx, setIdx] = React.useState(0);
  const { language } = useAuth();
  const isTalking = idx < message.length;

  React.useEffect(() => {
    setDisplayed(''); setIdx(0);
  }, [message]);

  React.useEffect(() => {
    if (idx < message.length) {
      const t = setTimeout(() => {
        setDisplayed(p => p + message[idx]);
        setIdx(p => p + 1);
      }, 22);
      return () => clearTimeout(t);
    }
  }, [idx, message]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 60 }}
      className="vn-dialogue"
    >
      <div className="relative h-full flex items-end">

        {/* ── Text Content (RIGHT, padded left for portrait) ── */}
        <div className="flex-1 pl-[340px] pr-8 pt-5 pb-4 flex flex-col justify-between min-h-[160px]">
          {/* Name tag */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-dg-pink text-white px-6 py-1 font-bold italic tracking-[0.2em] transform -skew-x-12 text-base shadow-[4px_4px_0_rgba(0,0,0,1)] font-display">
                {mentor.name.toUpperCase()}
              </div>
              <div className="h-px flex-1 bg-white/10" />
              <div className="font-mono text-[9px] text-white/25 tracking-[0.4em] uppercase">{mentor.sector}</div>
            </div>
            <p className="font-sans text-base md:text-lg font-medium leading-relaxed text-white/90 italic min-h-[60px]">
              "{displayed}"
              {isTalking && <span className="inline-block w-3 h-5 bg-dg-pink animate-pulse ml-1 align-middle shadow-[0_0_8px_#ff3399]" />}
            </p>
          </div>
          {!isTalking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={onComplete}
              className="self-end flex items-center gap-3 text-dg-pink font-bold text-xs tracking-[0.3em] cursor-pointer group mt-2"
            >
              <div className="h-px w-8 bg-dg-pink group-hover:w-16 transition-all duration-300" />
              {language === 'fr' ? 'SUIVANT' : 'NEXT'}
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </motion.div>
          )}
        </div>

        {/* ── Portrait (LEFT side, large and prominent) ── */}
        <div
          className="absolute left-4 bottom-0 pointer-events-none z-20 flex items-end justify-start"
          style={{ width: '320px', height: '420px' }}
        >
          <motion.div
            className="w-full h-full relative"
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: 'spring', bounce: 0.25, duration: 0.8 }}
          >
            {/* Glow behind character */}
            <div
              className="absolute -inset-8 blur-3xl rounded-full opacity-30"
              style={{ background: mentor.color + '55' }}
            />
            <CharacterSprite mentor={mentor} isTalking={isTalking} className="w-full h-full drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]" />
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
};

// ── StatsBar ─────────────────────────────────────────────────
export const StatsBar: React.FC = () => {
  const { userData, language, setLanguage } = useAuth();
  const { theme, toggleTheme } = useTheme();
  if (!userData) return null;
  const { progress } = calcLevel(userData.xp);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-5 md:px-8 gap-5 border-b border-white/5 backdrop-blur-xl bg-black/70">
      {/* Level diamond */}
      <div className="relative h-10 w-10 flex items-center justify-center shrink-0">
        <div className="absolute inset-0 bg-dg-pink transform rotate-45 border border-white/20 shadow-[0_0_20px_rgba(255,51,153,0.4)]" />
        <span className="relative z-10 font-bold text-lg text-white font-display">{userData.level}</span>
      </div>
      {/* User info */}
      <div className="flex flex-col shrink-0">
        <div className="text-[9px] text-dg-pink font-bold uppercase tracking-[0.3em] flex items-center gap-1.5 mb-0.5">
          <Cpu size={9} className="animate-pulse" /> {userData.title || 'Script Kiddie'}
        </div>
        <div className="text-sm font-bold text-white tracking-tight uppercase truncate max-w-[130px]">
          {userData.displayName}
        </div>
      </div>
      {/* XP bar */}
      <div className="flex-1 hidden md:flex flex-col gap-1 max-w-sm">
        <div className="flex justify-between text-[9px] font-bold text-white/30 uppercase tracking-widest">
          <span>{progress.toFixed(0)}% XP</span>
          <span className="text-dg-pink">{userData.xp} pts</span>
        </div>
        <div className="h-2 bg-white/5 border border-white/8 overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full xp-bar-fill shadow-[0_0_10px_rgba(255,51,153,0.5)]" />
        </div>
      </div>
      {/* Streak */}
      {userData.streak > 1 && (
        <div className="hidden sm:flex items-center gap-1.5 text-orange-400 text-xs font-bold shrink-0">
          <Zap size={12} fill="currentColor" /> {userData.streak}d
        </div>
      )}
      {/* Points */}
      <div className="hidden sm:flex items-center gap-1.5 text-white/30 text-xs font-mono shrink-0">
        <Award size={12} /> {userData.xp} PTS
      </div>
      {/* Controls */}
      <div className="ml-auto flex items-center gap-3">
        <button onClick={toggleTheme} className="text-white/30 hover:text-white transition-colors">
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <button onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
          className="text-[10px] font-bold text-white/30 hover:text-white transition-colors font-mono uppercase tracking-widest">
          {language === 'fr' ? 'EN' : 'FR'}
        </button>
      </div>
    </div>
  );
};

// ── XPToast ─────────────────────────────────────────────────
export const XPToast: React.FC<{ xp: number; visible: boolean }> = ({ xp, visible }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ y: -80, opacity: 0, scale: 0.8 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -80, opacity: 0, scale: 0.8 }}
        className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] bg-dg-pink text-white px-8 py-3 font-display font-black text-xl uppercase tracking-widest shadow-[0_0_40px_rgba(255,51,153,0.5)] transform -skew-x-6"
      >
        +{xp} XP SYNCED
      </motion.div>
    )}
  </AnimatePresence>
);
