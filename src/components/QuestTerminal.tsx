import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal as TerminalIcon, Send, RefreshCw, Trophy, AlertTriangle, Lightbulb, ExternalLink, ArrowLeft } from 'lucide-react';
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
        // Also save quest completion
        const questRef = doc(db, 'users', userData.uid, 'quests', quest.id);
        await setDoc(questRef, {
          questId: quest.id, status: 'completed',
          submission: code.slice(0, 500), xpEarned: result.xpReward,
          completedAt: new Date().toISOString()
        }).catch(e => handleFirestoreError(e, OperationType.CREATE, `users/${userData.uid}/quests/${quest.id}`));
        setShowXP(true);
        setTimeout(() => setShowXP(false), 3000);
      }
    } catch (e: any) {
      setError(language === 'fr' ? `Erreur IA: ${e.message}` : `AI Error: ${e.message}`);
    } finally { setLoading(false); }
  };

  const t = {
    briefing: language === 'fr' ? 'Briefing Mission' : 'Mission Briefing',
    terminal: language === 'fr' ? 'Terminal de Code' : 'Code Terminal',
    review: language === 'fr' ? 'Analyse Mentor' : 'Mentor Review',
    success: language === 'fr' ? 'Quête Réussie !' : 'Quest Accomplished!',
    fail: language === 'fr' ? 'Échec Système' : 'System Failure',
    deploy: language === 'fr' ? '// SOUMETTRE CODE' : '// SUBMIT CODE',
    deploying: language === 'fr' ? 'Compilation en cours...' : 'Compiling...',
    abort: language === 'fr' ? 'RETOUR' : 'BACK',
    return: language === 'fr' ? 'Confirmer & Retourner' : 'Confirm & Return',
    tryAgain: language === 'fr' ? 'Réessaye. Les bugs forgent les maîtres.' : 'Try again. Bugs forge masters.',
    analysis: language === 'fr' ? 'Analyse' : 'Analysis',
    example: language === 'fr' ? 'Implémentation de Référence' : 'Reference Implementation',
    realWorld: language === 'fr' ? 'Contexte Production' : 'Production Context',
    trap: language === 'fr' ? 'Piège Logique' : 'Logic Trap',
    seniorTip: language === 'fr' ? 'Rapport de Terrain' : 'Field Report',
    placeholder: language === 'fr' ? '// Écris ton code ici...' : '// Write your code here...',
    alreadyDone: language === 'fr' ? '✓ Déjà complétée' : '✓ Already completed',
  };

  const isCompleted = userData?.completedQuestIds?.includes(quest.id);

  return (
    <div className="relative min-h-screen pt-20 pb-48 px-4 md:px-8 max-w-7xl mx-auto overflow-y-auto">
      <XPToast xp={feedback?.xpReward || 0} visible={showXP} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        {/* Left: Briefing + Feedback */}
        <div className="lg:col-span-5 space-y-5">
          <motion.div initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <RetroBox title={t.briefing}>
              <div className="flex justify-between items-start mb-5">
                <div>
                  <h2 className="text-2xl font-bold text-white uppercase tracking-tighter leading-none mb-1">{quest.title[language]}</h2>
                  <div className={`text-[10px] font-bold uppercase tracking-widest italic border px-2 py-0.5 inline-block transform -skew-x-12 diff-${quest.difficulty.toLowerCase()}`}>
                    {quest.difficulty}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] text-white/30 font-mono uppercase">REWARD</div>
                  <div className="text-dg-pink font-bold text-lg font-display">+{quest.xpReward} XP</div>
                </div>
              </div>
              <p className="text-white/60 text-sm leading-relaxed mb-4">{quest.description[language]}</p>
              <div className="bg-dg-pink/10 border-l-4 border-dg-pink p-3">
                <div className="text-[9px] font-bold text-dg-pink uppercase mb-1 font-mono">TARGET_OBJECTIVE</div>
                <p className="text-white/80 font-mono text-xs italic leading-relaxed">"{quest.prompt[language]}"</p>
              </div>
              {isCompleted && <div className="mt-3 text-cyber-green text-xs font-bold font-mono">{t.alreadyDone}</div>}
            </RetroBox>
          </motion.div>

          <AnimatePresence>
            {feedback && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <RetroBox title={t.review} className="space-y-4 bg-black/80">
                  {/* Result header */}
                  <div className={`flex items-center gap-4 p-3 border ${feedback.isCorrect ? 'border-cyber-green/30 bg-cyber-green/5' : 'border-red-500/30 bg-red-500/5'}`}>
                    <div className={`p-3 ${feedback.isCorrect ? 'bg-cyber-green' : 'bg-red-500'}`}>
                      {feedback.isCorrect ? <Trophy className="text-black" size={20} /> : <AlertTriangle className="text-white" size={20} />}
                    </div>
                    <div>
                      <div className={`text-lg font-bold uppercase tracking-tight ${feedback.isCorrect ? 'text-cyber-green' : 'text-red-400'}`}>
                        {feedback.isCorrect ? t.success : t.fail}
                      </div>
                      <div className="text-[10px] text-white/40 font-mono">
                        {feedback.isCorrect ? `+${feedback.xpReward} XP SYNCED` : t.tryAgain}
                      </div>
                    </div>
                  </div>
                  {/* Details */}
                  <div className="space-y-3 text-sm">
                    <div className="bg-white/5 p-3 border-l-2 border-white/20">
                      <p className="text-dg-pink text-[9px] font-bold uppercase mb-1 font-mono">// {t.analysis}</p>
                      <p className="text-white/70 leading-relaxed">{feedback.analysis}</p>
                    </div>
                    <div>
                      <p className="text-dg-pink text-[9px] font-bold uppercase mb-1 font-mono">// {t.example}</p>
                      <pre className="bg-black/90 p-4 border border-white/10 text-xs text-cyber-green overflow-x-auto font-mono leading-relaxed"><code>{feedback.example}</code></pre>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-blue-500/5 border border-blue-500/20">
                        <p className="text-blue-400 text-[9px] font-bold uppercase mb-1 font-mono">// {t.realWorld}</p>
                        <p className="text-white/50 text-[11px] leading-snug">{feedback.usage}</p>
                      </div>
                      <div className="p-3 bg-red-500/5 border border-red-500/20">
                        <p className="text-red-400 text-[9px] font-bold uppercase mb-1 font-mono">// {t.trap}</p>
                        <p className="text-white/50 text-[11px] leading-snug">{feedback.trap}</p>
                      </div>
                    </div>
                    <div className="p-3 bg-yellow-500/5 border border-yellow-500/20">
                      <p className="text-yellow-400 text-[9px] font-bold uppercase mb-1 font-mono">// {t.seniorTip}</p>
                      <p className="text-white/60 text-[11px] leading-relaxed italic">{feedback.seniorTip}</p>
                    </div>
                  </div>
                  {feedback.isCorrect && (
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={onComplete}
                      className="w-full py-4 bg-white text-black font-bold text-xs uppercase tracking-[0.2em] hover:bg-dg-pink hover:text-white transition-all shadow-xl transform -skew-x-2 font-display">
                      {t.return}
                    </motion.button>
                  )}
                </RetroBox>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Code Editor */}
        <div className="lg:col-span-7 flex flex-col" style={{ minHeight: '600px' }}>
          <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="h-full flex flex-col">
            <RetroBox title={t.terminal} className="flex-1 flex flex-col p-0 overflow-hidden bg-black/90">
              {/* Editor header */}
              <div className="bg-black border-b border-white/5 py-3 px-5 flex justify-between items-center shrink-0">
                <button onClick={onBack} className="flex items-center gap-2 text-white/30 hover:text-white transition-colors text-[11px] font-bold uppercase font-mono group">
                  <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> {t.abort}
                </button>
                <div className="text-[9px] font-bold text-white/15 uppercase tracking-[0.4em] font-mono">CODEKNOW_KERNEL_V4</div>
                <div className="flex gap-1.5">
                  {['#ff5f56','#ffbd2e','#27c93f'].map((c,i) => (
                    <div key={i} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
              {/* Textarea */}
              <div className="relative flex-1">
                <textarea value={code} onChange={e => setCode(e.target.value)} spellCheck={false} autoFocus
                  className="w-full h-full bg-transparent text-white/90 font-mono text-sm p-6 focus:outline-none resize-none placeholder:text-white/10 leading-7 absolute inset-0"
                  placeholder={t.placeholder} />
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(255,255,255,0.02) 27px, rgba(255,255,255,0.02) 28px)' }} />
              </div>
              {/* Footer */}
              <div className="p-5 bg-black/50 border-t border-white/5 space-y-3 shrink-0">
                {error && <div className="text-red-400 text-xs font-mono bg-red-500/10 border border-red-500/20 p-2">{error}</div>}
                <div className="flex justify-between items-center">
                  <div className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
                    {loading ? '⟳ NEURAL_LINK_ACTIVE' : '◉ STANDBY_MODE'} // {code.split('\n').length}L
                  </div>
                  {loading && (
                    <div className="h-1 w-20 bg-white/5 overflow-hidden">
                      <motion.div animate={{ x: ['-100%', '200%'] }} transition={{ repeat: Infinity, duration: 0.8 }}
                        className="h-full w-1/2 bg-dg-pink" />
                    </div>
                  )}
                </div>
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  disabled={loading || !code.trim()}
                  onClick={handleSubmit}
                  className={`w-full py-4 font-bold text-xs uppercase tracking-[0.25em] transition-all transform -skew-x-2 font-display
                    ${loading || !code.trim()
                      ? 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                      : 'bg-dg-pink text-white hover:brightness-125 shadow-[0_0_30px_rgba(255,51,153,0.3)] cursor-pointer'}`}>
                  {loading
                    ? <span className="flex items-center justify-center gap-3">{t.deploying} <RefreshCw size={16} className="animate-spin" /></span>
                    : <span className="flex items-center justify-center gap-3">{t.deploy} <Send size={16} /></span>}
                </motion.button>
              </div>
            </RetroBox>
          </motion.div>
        </div>
      </div>

      {/* Dialogue overlay */}
      <AnimatePresence>
        {showDialogue && (
          <DialogueBox mentor={mentor}
            message={language === 'fr'
              ? `Agent détecté. Prouve ta maîtrise de ${quest.lang}. L'Académie attend ton code.`
              : `Agent detected. Prove your mastery of ${quest.lang}. The Academy awaits your code.`}
            onComplete={() => setShowDialogue(false)}
          />
        )}
      </AnimatePresence>
      {showDialogue && <div className="fixed inset-0 z-[145] cursor-pointer" onClick={() => setShowDialogue(false)} />}
    </div>
  );
};
