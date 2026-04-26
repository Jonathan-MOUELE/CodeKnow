import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, ArrowLeft, Globe, ChevronRight, Lock } from 'lucide-react';
import { useAuth } from './lib/AuthContext';
import { StatsBar, ModuleIcon } from './components/UI';
import { QuestTerminal } from './components/QuestTerminal';
import { CharacterSprite } from './components/UI';
import { MENTORS, MODULES, INITIAL_QUESTS, Mentor, Quest, Module } from './constants';

// ── Animated Login Background ────────────────────────────────
function LoginBG() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {/* Single static image */}
      <img src="/assets/login_bg1.png" alt="" className="absolute inset-0 w-full h-full object-cover opacity-30 blur-[2px]" />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50" />
      {/* Animated grid */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'linear-gradient(rgba(0,242,255,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(0,242,255,0.3) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
      {/* Floating particles */}
      {['{}', '/>', '()', '[]', '=>', '&&', '||', '??'].map((sym, i) => (
        <div key={i} className="absolute font-mono text-dg-pink/20 text-sm select-none pointer-events-none"
          style={{
            left: `${10 + i * 11}%`, bottom: '-10%',
            animation: `float-particle ${8 + i * 1.5}s linear infinite`,
            animationDelay: `${i * 1.2}s`
          }}>{sym}</div>
      ))}
    </div>
  );
}

// ── Login Screen ─────────────────────────────────────────────
function LoginScreen() {
  const { signIn, language, setLanguage, authError } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    await signIn();
    setIsLoading(false);
  };

  const mentors = MENTORS.slice(0, 4);

  return (
    <div className="min-h-screen relative flex items-center overflow-hidden">
      <LoginBG />

      {/* Right side: character showcase */}
      <div className="absolute right-0 bottom-0 h-[90vh] w-[45%] pointer-events-none hidden lg:flex items-end justify-end gap-2 pr-8">
        {mentors.map((m, i) => (
          <motion.div key={m.id}
            initial={{ y: 120 + i * 20, opacity: 0 }}
            animate={{ y: 0, opacity: [1, 0.8, 0.6, 0.4][i] }}
            transition={{ delay: 0.1 + i * 0.12, duration: 0.8, type: 'spring', bounce: 0.1 }}
            className="flex items-end"
            style={{
              height: `${60 + i * 8}%`,
              width: '22%',
              filter: i === 0 ? 'drop-shadow(0 0 30px rgba(0,242,255,0.3))' : `brightness(${0.9 - i * 0.1})`
            }}>
            <CharacterSprite mentor={m} isTalking={false} className="w-full h-full" />
          </motion.div>
        ))}
      </div>

      {/* Left side: login panel */}
      <div className="relative z-10 w-full max-w-xl px-8 md:px-16">
        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-7xl md:text-8xl font-display font-black text-white leading-none tracking-tighter italic animate-text-flicker">
            CODE<span className="text-dg-pink">KNOW</span>
          </h1>
          <div className="h-1 w-40 bg-gradient-to-r from-dg-pink to-cyber-blue mt-3 mb-4 transform -skew-x-12" />
          <p className="text-sm font-bold text-dg-pink uppercase tracking-[0.4em] mb-2">
            {language === 'fr' ? 'ACADÉMIE DE CODE RPG' : 'RPG CODE ACADEMY'}
          </p>
          <p className="text-white/50 text-base leading-relaxed mb-8 max-w-sm font-medium">
            {language === 'fr'
              ? 'Apprends à coder à travers des quêtes guidées par des mentors IA. Progresse, monte en grade, deviens développeur.'
              : 'Learn to code through quests guided by AI mentors. Progress, level up, become a developer.'}
          </p>
        </motion.div>

        {/* Login card */}
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <div className="border border-white/10 bg-black/70 backdrop-blur-xl p-6 space-y-4"
            style={{ clipPath: 'polygon(0 0,100% 0,100% calc(100% - 16px),calc(100% - 16px) 100%,0 100%)' }}>
            {/* Module preview tags */}
            <div className="flex flex-wrap gap-2 mb-2">
              {MODULES.map(m => (
                <span key={m.id} className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 border"
                  style={{ color: m.color, borderColor: m.color + '44' }}>
                  {m.name}
                </span>
              ))}
            </div>

            {authError && (
              <div className="text-red-400 text-xs font-mono bg-red-500/10 border border-red-500/20 p-3">
                ⚠ {authError}
              </div>
            )}

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={handleSignIn} disabled={isLoading}
              className="w-full py-4 bg-white text-black font-display font-bold text-sm uppercase tracking-[0.2em] hover:bg-dg-pink hover:text-white transition-all transform -skew-x-2 shadow-[0_0_30px_rgba(255,255,255,0.1)] cursor-pointer disabled:opacity-50 flex items-center justify-center gap-3">
              {isLoading
                ? <><span className="animate-spin inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full" />
                    {language === 'fr' ? 'Connexion en cours...' : 'Connecting...'}</>
                : <>{language === 'fr' ? 'Se connecter avec Google' : 'Sign in with Google'}</>}
            </motion.button>

            <button onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
              className="w-full flex items-center justify-center gap-2 text-white/30 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest cursor-pointer">
              <Globe size={12} /> {language === 'en' ? 'SWITCH TO FRANÇAIS' : 'SWITCH TO ENGLISH'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ── Module Selection ─────────────────────────────────────────
function ModuleSelect({ onSelect }: { onSelect: (m: Module) => void }) {
  const { userData, language, signOut } = useAuth();
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-10">
      <StatsBar />
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h2 className="text-5xl md:text-7xl font-display font-black text-white uppercase italic tracking-tighter leading-none">
            {language === 'fr' ? <>CHOISIS TON <span className="text-dg-pink">MODULE</span></> : <>CHOOSE YOUR <span className="text-dg-pink">PATH</span></>}
          </h2>
          <div className="flex justify-between items-end mt-4">
            <p className="text-white/30 text-sm max-w-md">
              {language === 'fr'
                ? 'Chaque module correspond à une spécialité du développement. Avance à ton rythme.'
                : 'Each module covers a dev specialty. Progress at your own pace.'}
            </p>
            <button onClick={signOut} className="text-white/20 hover:text-red-400 transition-colors text-[10px] font-mono uppercase flex items-center gap-2 cursor-pointer">
              <LogOut size={12} /> {language === 'fr' ? 'Déconnexion' : 'Sign out'}
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {MODULES.map((mod, i) => {
            const modQuests = INITIAL_QUESTS.filter(q => mod.mentorIds.includes(q.mentorId));
            const done = modQuests.filter(q => userData?.completedQuestIds?.includes(q.id)).length;
            const modMentors = MENTORS.filter(m => mod.mentorIds.includes(m.id));
            return (
              <motion.div key={mod.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }} onClick={() => onSelect(mod)} className="module-card cursor-pointer group">
                <div className={`absolute inset-0 bg-gradient-to-br ${mod.gradient}`} />
                <div className="absolute inset-0 border border-white/0 group-hover:border-white/20 transition-colors" style={{ borderColor: mod.color + '22' }} />
                {/* Colored accent top */}
                <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, ${mod.color}, transparent)` }} />

                <div className="relative z-10 p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 border" style={{ color: mod.color, borderColor: mod.color + '44', background: mod.color + '11' }}>
                      <ModuleIcon name={mod.icon} size={28} />
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] text-white/30 font-mono uppercase">{language === 'fr' ? 'QUÊTES' : 'QUESTS'}</div>
                      <div className="font-display font-bold text-lg" style={{ color: mod.color }}>
                        {done}/{modQuests.length}
                      </div>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="h-1 bg-white/5 mb-6 overflow-hidden">
                    <div className="h-full transition-all duration-1000" style={{ width: `${modQuests.length ? (done / modQuests.length) * 100 : 0}%`, backgroundColor: mod.color }} />
                  </div>

                  <h3 className="text-3xl font-display font-black uppercase tracking-tighter mb-1" style={{ color: mod.color }}>
                    {mod.name}
                  </h3>
                  <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4">{mod.tagline[language]}</p>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {mod.techs.slice(0, 5).map(t => (
                      <span key={t} className="text-[9px] font-mono px-2 py-0.5 bg-white/5 text-white/40 uppercase">{t}</span>
                    ))}
                  </div>
                  {/* Mentor avatars */}
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                      {modMentors.map(m => (
                        <img key={m.id} src={m.avatar} alt={m.name}
                          className="w-9 h-9 object-cover object-top pixel-render border-2 border-black"
                          style={{ borderColor: mod.color + '44' }} />
                      ))}
                    </div>
                    <span className="text-white/30 text-[10px] font-mono uppercase">{modMentors.map(m => m.name).join(', ')}</span>
                    <ChevronRight size={14} className="ml-auto text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Mentor Selection (within a module) ──────────────────────
function MentorSelect({ module: mod, onSelect, onBack }: { module: Module; onSelect: (m: Mentor) => void; onBack: () => void }) {
  const { language } = useAuth();
  const mentors = MENTORS.filter(m => mod.mentorIds.includes(m.id));

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-10">
      <StatsBar />
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-10">
          <button onClick={onBack} className="flex items-center gap-2 text-white/30 hover:text-white transition-colors text-[10px] font-mono uppercase mb-6 group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> {language === 'fr' ? 'MODULES' : 'MODULES'}
          </button>
          <div className="text-[9px] font-mono tracking-[0.5em] mb-2 uppercase" style={{ color: mod.color }}>// {mod.name} //</div>
          <h2 className="text-5xl font-display font-black text-white uppercase italic">
            {language === 'fr' ? 'CHOISIR UN MENTOR' : 'CHOOSE MENTOR'}
          </h2>
        </motion.div>
        <div className={`grid gap-6 ${mentors.length === 1 ? 'max-w-sm' : mentors.length === 2 ? 'grid-cols-2 max-w-2xl' : 'grid-cols-3'}`}>
          {mentors.map((mentor, i) => {
            const quests = INITIAL_QUESTS.filter(q => q.mentorId === mentor.id);
            return (
              <motion.div key={mentor.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }} onClick={() => onSelect(mentor)}
                className="mentor-card cursor-pointer group" style={{ borderColor: mentor.color + '33', aspectRatio: '3/4' }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />
                <CharacterSprite mentor={mentor} className="absolute inset-0 w-full h-full" />
                <div className="absolute inset-x-0 bottom-0 p-5 z-20">
                  <div className="text-[9px] font-mono uppercase tracking-widest mb-1" style={{ color: mentor.color }}>{mentor.sector}</div>
                  <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight leading-none mb-1">{mentor.name}</h3>
                  <p className="text-white/40 text-[10px] uppercase tracking-wider mb-3">{mentor.specialty[language]}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono text-white/30">{quests.length} {language === 'fr' ? 'QUÊTES' : 'QUESTS'}</span>
                    <ChevronRight size={14} className="text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Quest Selection ──────────────────────────────────────────
function QuestSelect({ mentor, onSelect, onBack }: { mentor: Mentor; onSelect: (q: Quest) => void; onBack: () => void }) {
  const { userData, language } = useAuth();
  const quests = INITIAL_QUESTS.filter(q => q.mentorId === mentor.id).sort((a, b) => a.order - b.order);

  const diffColors: Record<string, string> = { Novice: '#22c55e', Adept: '#00f2ff', Expert: '#ff3399', Master: '#ffd700' };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-10">
      <StatsBar />
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-10">
          <button onClick={onBack} className="flex items-center gap-2 text-white/30 hover:text-white transition-colors text-[10px] font-mono uppercase mb-6 group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> {language === 'fr' ? 'RETOUR' : 'BACK'}
          </button>
          <div className="flex items-end gap-6 mb-6">
            <img src={mentor.avatar} alt={mentor.name} className="w-20 h-20 object-cover object-top pixel-render border-2" style={{ borderColor: mentor.color + '66' }} />
            <div>
              <div className="text-[9px] font-mono uppercase tracking-[0.4em] mb-1" style={{ color: mentor.color }}>{mentor.sector}</div>
              <h2 className="text-4xl font-display font-black text-white uppercase italic">{mentor.name}</h2>
              <p className="text-white/30 text-xs mt-1 italic">{mentor.description[language]}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {quests.map((quest, i) => {
            const done = userData?.completedQuestIds?.includes(quest.id);
            const col = diffColors[quest.difficulty] || '#fff';
            return (
              <motion.div key={quest.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                whileHover={!done ? { y: -6 } : {}} onClick={() => onSelect(quest)} className="cursor-pointer group relative">
                <div className={`border p-5 transition-all duration-300 relative overflow-hidden ${done ? 'opacity-70' : ''}`}
                  style={{ borderColor: done ? '#22c55e44' : col + '22', clipPath: 'polygon(0 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%)' }}>
                  {!done && <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: col + '08' }} />}
                  <div className="absolute top-0 left-0 w-full h-0.5" style={{ background: done ? '#22c55e' : col }} />

                  <div className="flex justify-between items-start mb-4">
                    <div className={`text-[9px] font-bold uppercase border px-2 py-0.5 transform -skew-x-12 font-mono diff-${quest.difficulty.toLowerCase()}`}>
                      {quest.difficulty}
                    </div>
                    <div className="flex items-center gap-2">
                      {done && <span className="text-cyber-green text-[9px] font-mono">✓ DONE</span>}
                      <span className="text-[9px] font-mono" style={{ color: col }}>+{quest.xpReward} XP</span>
                    </div>
                  </div>
                  <div className="text-[9px] font-mono text-white/30 uppercase mb-1">{quest.lang}</div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-tight mb-2 group-hover:text-dg-pink transition-colors line-clamp-2">
                    {quest.title[language]}
                  </h3>
                  <p className="text-white/30 text-[11px] leading-relaxed line-clamp-3">{quest.description[language]}</p>
                  <div className="mt-4 flex justify-end">
                    <ChevronRight size={14} className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── App Root ─────────────────────────────────────────────────
type View = 'modules' | 'mentors' | 'quests' | 'terminal';

function Dashboard() {
  const [view, setView] = useState<View>('modules');
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);

  const handleModuleSelect = (mod: Module) => {
    setSelectedModule(mod);
    if (mod.mentorIds.length === 1) {
      setSelectedMentor(MENTORS.find(m => m.id === mod.mentorIds[0]) || null);
      setView('quests');
    } else {
      setView('mentors');
    }
  };

  const handleMentorSelect = (mentor: Mentor) => { setSelectedMentor(mentor); setView('quests'); };
  const handleQuestSelect = (quest: Quest) => { setActiveQuest(quest); setView('terminal'); };
  const handleComplete = () => { setActiveQuest(null); setView('quests'); };
  const handleBack = () => {
    if (view === 'terminal') { setActiveQuest(null); setView('quests'); }
    else if (view === 'quests') {
      setActiveQuest(null);
      if (selectedModule && selectedModule.mentorIds.length > 1) setView('mentors');
      else { setSelectedMentor(null); setView('modules'); }
    }
    else if (view === 'mentors') { setSelectedMentor(null); setView('modules'); }
  };

  return (
    <AnimatePresence mode="wait">
      {view === 'modules' && <motion.div key="modules" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><ModuleSelect onSelect={handleModuleSelect} /></motion.div>}
      {view === 'mentors' && selectedModule && <motion.div key="mentors" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><MentorSelect module={selectedModule} onSelect={handleMentorSelect} onBack={handleBack} /></motion.div>}
      {view === 'quests' && selectedMentor && <motion.div key="quests" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><QuestSelect mentor={selectedMentor} onSelect={handleQuestSelect} onBack={handleBack} /></motion.div>}
      {view === 'terminal' && selectedMentor && activeQuest && <motion.div key="terminal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><QuestTerminal mentor={selectedMentor} quest={activeQuest} onComplete={handleComplete} onBack={handleBack} /></motion.div>}
    </AnimatePresence>
  );
}

export default function App() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    // Safety timeout: if auth takes > 3s, stop loading to allow manual retry or check state
    const timer = setTimeout(() => setLoading(false), 3500);
    if (!authLoading) setLoading(false);
    return () => clearTimeout(timer);
  }, [authLoading]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="crt-overlay" />
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-dg-pink border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="font-sans text-sm text-white/40 uppercase tracking-[0.2em] animate-pulse">
          Chargement de l'Académie...
        </p>
      </div>
    </div>
  );

  return (
    <>
      <div className="crt-overlay" />
      {user ? <Dashboard /> : <LoginScreen />}
    </>
  );
}
