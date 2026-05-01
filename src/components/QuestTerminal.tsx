import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, RefreshCw, Trophy, AlertTriangle, ArrowLeft } from 'lucide-react';
import { RetroBox, DialogueBox, XPToast } from './UI';
import { Mentor, Quest } from '../constants';
import { getMentorFeedback, MentorFeedback } from '../services/geminiService';
import { useAuth } from '../lib/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

export const QuestTerminal: React.FC<{
  mentor: Mentor;
  quest: Quest;
  onComplete: () => void;
  onBack: () => void;
}> = ({ mentor, quest, onComplete, onBack }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<MentorFeedback | null>(null);
  const [showDialogue, setShowDialogue] = useState(true);
  const [showXP, setShowXP] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userData, updateUserStats, language } = useAuth();

  const handleSubmit = async () => {
    if (!code.trim()) return;
    setLoading(true); setError(null);
    try {
      const result = await getMentorFeedback(
        mentor.name, mentor.specialty[language], mentor.personality[language],
        quest.title[language], quest.description[language], code, language
      );
      setFeedback(result);
      if (result.isCorrect && userData) {
        await updateUserStats(result.xpReward, quest.id, quest.lang);
        const questRef = doc(db, 'users', userData.uid, 'quests', quest.id);
        await setDoc(questRef, {
          questId: quest.id, status: 'completed',
          submission: code.slice(0, 500), xpEarned: result.xpReward,
          completedAt: new Date().toISOString()
        }).catch(e => handleFirestoreError(e, OperationType.CREATE, `users/${userData.uid}/quests/${quest.id}`));
        setShowXP(true);
        setTimeout(() => setShowXP(false), 3000);
        // Trigger victory celebration
        setShowVictory(true);
        setTimeout(() => setShowVictory(false), 4000);
      }
    } catch (e: any) {
      setError(language === 'fr' ? `Erreur IA: ${e.message}` : `AI Error: ${e.message}`);
    } finally { setLoading(false); }
  };

  const t = {
    briefing: language === 'fr' ? 'Mission Briefing' : 'Mission Briefing',
    terminal: language === 'fr' ? 'Terminal de Code' : 'Code Terminal',
    success: language === 'fr' ? 'Quête Réussie !' : 'Quest Accomplished!',
    fail: language === 'fr' ? 'Échec Système' : 'System Failure',
    deploy: language === 'fr' ? '// SOUMETTRE CODE' : '// SUBMIT CODE',
    deploying: language === 'fr' ? 'Compilation en cours...' : 'Compiling...',
    abort: language === 'fr' ? 'RETOUR' : 'BACK',
    return: language === 'fr' ? 'Confirmer & Retourner' : 'Confirm & Return',
    tryAgain: language === 'fr' ? 'Les bugs forgent les maîtres.' : 'Bugs forge masters.',
    analysis: language === 'fr' ? 'Analyse' : 'Analysis',
    example: language === 'fr' ? 'Référence' : 'Reference',
    realWorld: language === 'fr' ? 'Production' : 'Production',
    trap: language === 'fr' ? 'Piège' : 'Trap',
    seniorTip: language === 'fr' ? 'Conseil Mentor' : 'Mentor Tip',
    placeholder: language === 'fr' ? '// Écris ton code ici...' : '// Write your code here...',
    alreadyDone: language === 'fr' ? '✓ Déjà complétée' : '✓ Already completed',
  };

  const isCompleted = userData?.completedQuestIds?.includes(quest.id);

  // ── LAYOUT STRATEGY ──────────────────────────────────────────────
  // The page is: fixed StatsBar (h-14 = 56px) + scrollable content below.
  // We use a fixed-height container starting below the navbar so nothing is hidden.
  // LEFT col: mission briefing + AI feedback, scrollable
  // RIGHT col: code editor, fixed height = viewport minus navbar and padding

  return (
    // Outer: fills viewport below the StatsBar (top-14), scrollable for mobile
    <div className="fixed inset-0 top-14 overflow-y-auto overflow-x-hidden bg-[var(--color-app-bg)]">
      {/* Background Mentor Silhouettes (Symbiosis) */}
      <div className="fixed top-14 right-0 bottom-0 w-[40%] opacity-[0.05] pointer-events-none select-none">
        <img
          src={mentor.sprites?.[1] || mentor.avatar}
          alt=""
          className="w-full h-full object-contain object-right-bottom pixel-render"
        />
      </div>

      <XPToast xp={feedback?.xpReward || 0} visible={showXP} />

      {/* ── Victory Celebration Overlay ── */}
      <AnimatePresence>
        {showVictory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[160] flex items-center justify-center pointer-events-none"
          >
            {/* Dark vignette */}
            <div className="absolute inset-0 bg-black/60" />

            {/* Particle burst */}
            {[...Array(20)].map((_, i) => {
              const angle = (i / 20) * Math.PI * 2;
              const dist = 180 + Math.random() * 120;
              const colors = ['#ff3399', '#00ff9f', '#00f2ff', '#ffd700', '#ffffff'];
              const color = colors[i % colors.length];
              return (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full"
                  style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                  animate={{
                    x: Math.cos(angle) * dist,
                    y: Math.sin(angle) * dist,
                    scale: [0, 1.5, 0],
                    opacity: [1, 1, 0]
                  }}
                  transition={{ duration: 1.2, ease: 'easeOut', delay: i * 0.02 }}
                />
              );
            })}

            {/* Central burst ring */}
            <motion.div
              className="absolute border-4 border-cyber-green rounded-full"
              initial={{ width: 0, height: 0, opacity: 1 }}
              animate={{ width: 400, height: 400, opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
            <motion.div
              className="absolute border-2 border-dg-pink rounded-full"
              initial={{ width: 0, height: 0, opacity: 1 }}
              animate={{ width: 600, height: 600, opacity: 0 }}
              transition={{ duration: 1.1, ease: 'easeOut', delay: 0.1 }}
            />

            {/* XP reward text */}
            <motion.div
              className="relative z-10 text-center"
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: [0, 1.4, 1], rotate: 0 }}
              transition={{ type: 'spring', bounce: 0.5, duration: 0.7 }}
            >
              <div className="font-display font-black text-cyber-green text-7xl md:text-9xl leading-none tracking-tighter"
                style={{ textShadow: '0 0 60px #00ff9f, 0 0 120px #00ff9f' }}>
                +{feedback?.xpReward}
              </div>
              <div className="font-display font-black text-white/80 text-2xl uppercase tracking-[0.5em] mt-2">
                XP SYNCED
              </div>
              <div className="text-dg-pink font-mono text-sm uppercase tracking-widest mt-3 animate-pulse">
                {language === 'fr' ? '// QUÊTE ACCOMPLIE' : '// QUEST ACCOMPLISHED'}
              </div>
            </motion.div>

            {/* Mentor portrait cameo */}
            <motion.div
              className="absolute bottom-0 right-8 w-48 h-64 pointer-events-none"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, type: 'spring', bounce: 0.3 }}
            >
              <div className="absolute -inset-4 blur-2xl rounded-full opacity-40" style={{ background: mentor.color }} />
              <img src={mentor.avatar} alt={mentor.name} className="w-full h-full object-contain object-bottom pixel-render" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Two-column grid filling full height ── */}
      <div className="flex flex-col lg:flex-row w-full h-full min-h-[calc(100vh-56px)]">

        {/* ════ LEFT: Briefing + Feedback ════ */}
        <div className="lg:w-[42%] flex-shrink-0 overflow-y-auto custom-scrollbar border-r border-white/5">
          <div className="px-6 pt-8 pb-6 space-y-6">
            {/* Briefing */}
            <motion.div initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
              <RetroBox title={t.briefing} className="bg-black/60">
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-display font-black text-white uppercase italic tracking-tighter leading-none">
                      {quest.title[language]}
                    </h2>
                    <div className={`text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 inline-block border transform -skew-x-12 diff-${quest.difficulty.toLowerCase()}`}>
                      {quest.difficulty} // {quest.lang}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-white/30 font-mono uppercase tracking-widest">REWARD</div>
                    <div className="text-dg-pink font-black text-2xl font-display italic">+{quest.xpReward} XP</div>
                  </div>
                </div>

                <p className="text-white/60 text-base leading-relaxed mb-6">{quest.description[language]}</p>

                <div className="bg-dg-pink/5 border-l-4 border-dg-pink p-5">
                  <div className="text-[10px] font-bold text-dg-pink uppercase mb-2 tracking-[0.3em] font-mono">TARGET_OBJECTIVE</div>
                  <p className="text-white/90 font-mono text-sm italic leading-relaxed">"{quest.prompt[language]}"</p>
                </div>

                {isCompleted && (
                  <div className="mt-4 text-cyber-green text-xs font-bold font-mono tracking-widest">✓ DÉJÀ COMPLÉTÉE</div>
                )}
              </RetroBox>
            </motion.div>

            {/* AI Feedback */}
            <AnimatePresence mode="wait">
              {feedback && (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                >
                  <RetroBox
                    title={feedback.isCorrect ? t.success : t.fail}
                    className={`${feedback.isCorrect ? 'border-cyber-green/40' : 'border-red-500/40'} bg-black/80`}
                  >
                    <div className="space-y-5">
                      {/* Result banner */}
                      <div className={`flex items-start gap-4 p-4 border-l-4 ${feedback.isCorrect ? 'border-cyber-green bg-cyber-green/5' : 'border-red-500 bg-red-500/5'}`}>
                        <div className={`p-2 shrink-0 ${feedback.isCorrect ? 'bg-cyber-green text-black' : 'bg-red-500 text-white'}`}>
                          {feedback.isCorrect ? <Trophy size={20} /> : <AlertTriangle size={20} />}
                        </div>
                        <div>
                          <p className="text-white font-bold text-base leading-tight">{feedback.message}</p>
                          <p className="text-[10px] text-white/40 font-mono mt-1">
                            {feedback.isCorrect ? `+${feedback.xpReward} XP SYNCED` : t.tryAgain}
                          </p>
                        </div>
                      </div>

                      {/* Analysis */}
                      <div className="bg-white/[0.03] p-4 border-l-2 border-white/20">
                        <p className="text-dg-pink text-[10px] font-bold uppercase mb-2 font-mono">// {t.analysis}</p>
                        <p className="text-white/70 text-sm leading-relaxed">{feedback.analysis}</p>
                      </div>

                      {/* Code example */}
                      <div>
                        <p className="text-dg-pink text-[10px] font-bold uppercase mb-2 font-mono">// {t.example}</p>
                        <pre className="bg-black p-4 border border-white/5 text-xs text-cyber-green overflow-x-auto font-mono leading-relaxed custom-scrollbar max-h-[250px]">
                          <code>{feedback.example}</code>
                        </pre>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-blue-500/5 border border-blue-500/10">
                          <p className="text-blue-400 text-[9px] font-bold uppercase mb-1 font-mono">{t.realWorld}</p>
                          <p className="text-white/50 text-xs leading-relaxed">{feedback.usage}</p>
                        </div>
                        <div className="p-3 bg-red-500/5 border border-red-500/10">
                          <p className="text-red-400 text-[9px] font-bold uppercase mb-1 font-mono">{t.trap}</p>
                          <p className="text-white/50 text-xs leading-relaxed">{feedback.trap}</p>
                        </div>
                      </div>

                      <div className="p-3 bg-yellow-500/5 border border-yellow-500/10 italic">
                        <p className="text-yellow-400 text-[9px] font-bold uppercase mb-1 font-mono">{t.seniorTip}</p>
                        <p className="text-white/60 text-sm">"{feedback.seniorTip}"</p>
                      </div>

                      {feedback.isCorrect && (
                        <button
                          onClick={onComplete}
                          className="w-full py-4 bg-white text-black font-display font-black text-sm uppercase tracking-[0.4em] hover:bg-dg-pink hover:text-white transition-all"
                        >
                          {t.return}
                        </button>
                      )}
                    </div>
                  </RetroBox>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ════ RIGHT: Code Editor — fills remaining height ════ */}
        <div className="flex-1 flex flex-col">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="flex-1 flex flex-col h-full"
          >
            {/* Terminal chrome bar */}
            <div className="flex-shrink-0 flex items-center justify-between px-6 py-3 bg-black/60 border-b border-white/5">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-white/40 hover:text-white transition-all text-[11px] font-black uppercase font-mono group cursor-pointer"
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                {t.abort}
              </button>
              <div className="text-[9px] font-bold text-white/10 uppercase tracking-[0.5em] font-mono">CODEKNOW_KERNEL_V4</div>
              <div className="flex gap-2">
                {['#ff5f56', '#ffbd2e', '#27c93f'].map((c, i) => (
                  <div key={i} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>

            {/* Textarea — fills all remaining space */}
            <div className="flex-1 relative overflow-hidden">
              {/* Line numbers */}
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-white/[0.02] border-r border-white/5 flex flex-col items-center pt-6 text-[10px] font-mono text-white/15 select-none z-10">
                {[...Array(40)].map((_, i) => (
                  <div key={i} className="h-7 leading-7 w-full text-right pr-2">{i + 1}</div>
                ))}
              </div>
              <textarea
                value={code}
                onChange={e => setCode(e.target.value)}
                spellCheck={false}
                autoFocus
                className="absolute inset-0 pl-14 pr-6 pt-6 pb-6 w-full h-full bg-transparent text-cyber-green font-mono text-base focus:outline-none resize-none placeholder:text-white/10 leading-7 custom-scrollbar"
                placeholder={t.placeholder}
              />
              {/* Scanline */}
              <div className="absolute inset-0 pointer-events-none bg-scanline opacity-[0.03] z-0" />
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 p-5 bg-black/40 border-t border-white/5 space-y-3">
              {error && (
                <div className="text-red-400 text-xs font-mono bg-red-500/10 border border-red-500/20 p-2 flex items-center gap-2">
                  <AlertTriangle size={12} /> {error}
                </div>
              )}
              <div className="flex justify-between items-center text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">
                <span className={loading ? 'text-dg-pink animate-pulse' : ''}>
                  {loading ? '⟳ NEURAL_LINK_ACTIVE' : '◉ STANDBY_MODE'} // {code.split('\n').length}L
                </span>
                {loading && (
                  <div className="h-1 w-32 bg-white/5 overflow-hidden">
                    <motion.div
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="h-full w-1/2 bg-dg-pink"
                    />
                  </div>
                )}
              </div>
              <motion.button
                whileHover={!loading && code.trim() ? { scale: 1.01 } : {}}
                whileTap={!loading && code.trim() ? { scale: 0.99 } : {}}
                disabled={loading || !code.trim()}
                onClick={handleSubmit}
                className={`w-full py-4 font-black text-sm uppercase tracking-[0.4em] font-display transition-all transform -skew-x-2 ${
                  loading || !code.trim()
                    ? 'bg-white/5 text-white/10 border border-white/5 cursor-not-allowed'
                    : 'bg-dg-pink text-white shadow-[0_0_30px_rgba(255,51,153,0.3)] cursor-pointer hover:brightness-110'
                }`}
              >
                {loading
                  ? <span className="flex items-center justify-center gap-3">{t.deploying} <RefreshCw size={18} className="animate-spin" /></span>
                  : <span className="flex items-center justify-center gap-3">{t.deploy} <Send size={18} /></span>}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Dialogue overlay ── */}
      <AnimatePresence>
        {showDialogue && (
          <DialogueBox
            mentor={mentor}
            message={
              language === 'fr'
                ? `Agent détecté. Prouve ta maîtrise de ${quest.lang}. L'Académie attend ton code.`
                : `Agent detected. Prove your mastery of ${quest.lang}. The Academy awaits your code.`
            }
            onComplete={() => setShowDialogue(false)}
          />
        )}
      </AnimatePresence>
      {showDialogue && (
        <div className="fixed inset-0 z-[145] cursor-pointer" onClick={() => setShowDialogue(false)} />
      )}
    </div>
  );
};
