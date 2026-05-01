import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, ArrowLeft, Globe, ChevronRight, RefreshCw, Zap } from 'lucide-react';
import { useAuth } from './lib/AuthContext';
import { StatsBar, ModuleIcon } from './components/UI';
import { QuestTerminal } from './components/QuestTerminal';
import { CharacterSprite } from './components/UI';
import { MENTORS, MODULES, INITIAL_QUESTS, Mentor, Quest, Module } from './constants';

// ── Animated Login Background ────────────────────────────────
function LoginBG() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {/* Ambient background mentor silhouette (Symbiosis) - Centered & Subtle */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none select-none overflow-hidden blur-[4px]">
        <img src={MENTORS[0].avatar} alt="" className="h-[90%] w-auto object-contain transform scale-110 pixel-render" />
      </div>

      {/* Single static image */}
      <img src="/assets/login_bg1.png" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 blur-[2px]" />
      
      {/* Background Decorative Text */}
      <div className="absolute top-[15%] right-[5%] font-display font-black text-white/[0.02] text-[15vw] leading-none select-none pointer-events-none uppercase tracking-tighter">
        CODEKNOW
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50" />
      
      {/* Animated neutral grid */}
      <div className="absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.1) 1px,transparent 1px)', backgroundSize: '80px 80px' }} />
      
      {/* Floating particles */}
      {['{}', '/>', '()', '[]', '=>', '&&', '||', '??'].map((sym, i) => (
        <div key={i} className="absolute font-mono text-white/10 text-sm select-none pointer-events-none"
          style={{
            left: `${10 + i * 11}%`, bottom: '-10%',
            animation: `float-particle ${10 + i * 2}s linear infinite`,
            animationDelay: `${i * 1.5}s`
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
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden py-20">
      <LoginBG />

      {/* Central Content Area */}
      <div className="relative z-10 w-full max-w-5xl px-8 flex flex-col items-center gap-12">
        {/* Logo & Intro */}
        <div className="text-center">
          <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-7xl md:text-9xl font-display font-black text-white leading-none tracking-tighter italic animate-text-flicker">
              CODE<span>KNOW</span>
            </h1>
            <div className="h-1 w-48 bg-white/20 mt-4 mb-6 transform -skew-x-12 mx-auto" />
            <p className="text-sm md:text-base font-bold text-white/40 uppercase tracking-[0.5em] mb-4">
              {language === 'fr' ? 'ACADÉMIE DE CODE RPG' : 'RPG CODE ACADEMY'}
            </p>
            <p className="text-white/50 text-base md:text-lg leading-relaxed max-w-2xl font-medium mx-auto">
              {language === 'fr'
                ? 'Apprends à coder à travers des quêtes guidées par des mentors IA. Progresse, monte en grade, deviens développeur.'
                : 'Learn to code through quests guided by AI mentors. Progress, level up, become a developer.'}
            </p>
          </motion.div>
        </div>

        {/* Login & Mentors Grid */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Login Panel */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-5">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 transform -skew-x-2">
              <div className="flex flex-wrap gap-2 mb-8">
                {MODULES.map(m => (
                  <div key={m.id} className="px-3 py-1 border border-white/10 text-[9px] font-mono text-white/30 uppercase tracking-widest">
                    {m.id}
                  </div>
                ))}
              </div>
              
              {authError && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
                  ERROR: {authError}
                </div>
              )}

              <button 
                onClick={handleSignIn}
                disabled={isLoading}
                className="w-full py-6 bg-white text-black font-display font-black text-sm md:text-base uppercase tracking-[0.4em] hover:bg-dg-pink hover:text-white transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)] relative group overflow-hidden"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-4">
                    INITIALIZING... <RefreshCw size={20} className="animate-spin" />
                  </span>
                ) : (
                  language === 'fr' ? 'SE CONNECTER AVEC GOOGLE' : 'SIGN IN WITH GOOGLE'
                )}
              </button>
              
              <div className="mt-8 flex justify-center">
                <button onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')} className="text-[11px] font-mono text-white/30 hover:text-dg-pink transition-colors uppercase tracking-[0.3em]">
                  {language === 'fr' ? '🌐 Switch to English' : '🌐 Passer au Français'}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Mentors Showcase (Centered/Simplified) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {mentors.map((m, i) => (
              <motion.div 
                key={m.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="relative aspect-[3/4] bg-white/[0.03] border border-white/10 group overflow-hidden"
              >
                <div className="absolute inset-0 bg-scanline opacity-10" />
                <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
                   <CharacterSprite mentor={m} className="w-full h-full object-contain object-bottom transform group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
                  <div className="text-xs font-display font-black text-white uppercase truncate mb-1">{m.name}</div>
                  <div className="text-[8px] font-mono text-white/30 uppercase tracking-widest">{m.sector}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="text-center opacity-20">
          <div className="text-[9px] font-mono uppercase tracking-[1em]">SYSTEM_READY // 0 errors detected</div>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {MODULES.map((mod, i) => {
            const modMentors = MENTORS.filter(m => mod.mentorIds.includes(m.id));
            const mainMentor = modMentors[0];
            const modQuests = INITIAL_QUESTS.filter(q => mod.mentorIds.includes(q.mentorId));
            const done = modQuests.filter(q => userData?.completedQuestIds?.includes(q.id)).length;
            
            return (
              <motion.div key={mod.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                whileHover={{ y: -10 }}
                onClick={() => onSelect(mod)}
                className="group relative h-[450px] cursor-pointer overflow-hidden border border-white/10 bg-black/60 backdrop-blur-xl transition-all duration-500 hover:border-dg-pink/40 shadow-2xl"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%)' }}>
                
                {/* Immersive Mentor Background */}
                <div className="absolute right-0 top-0 h-full w-3/4 pointer-events-none opacity-40 group-hover:opacity-100 transition-all duration-1000 transform translate-x-12 group-hover:translate-x-0 scale-110 group-hover:scale-100">
                  <CharacterSprite mentor={mainMentor} isTalking={false} isStatic={true} className="w-full h-full object-contain object-right-bottom pixel-render" />
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/30 to-black/80" />
                </div>

                {/* Content */}
                <div className="relative h-full p-8 flex flex-col justify-between z-10">
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 border" style={{ color: mod.color, borderColor: mod.color + '44' }}>
                        <ModuleIcon name={mod.icon} size={28} />
                      </div>
                      <div className="h-px w-10 bg-white/10" />
                      <div className="text-[10px] font-mono text-white/30 uppercase tracking-[0.4em]">MODULE_0{i+1}</div>
                    </div>
                    
                    <h3 className="text-5xl font-display font-black uppercase tracking-tighter italic mb-2 leading-none group-hover:text-dg-pink transition-colors">
                      {mod.name}
                    </h3>
                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-6 max-w-[220px] leading-relaxed">
                      {mod.tagline[language]}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {mod.techs.slice(0, 4).map(t => (
                        <span key={t} className="text-[9px] font-mono px-2 py-0.5 border border-white/5 bg-white/5 text-white/40 uppercase tracking-widest">
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="max-w-[200px] h-1 bg-white/5 mb-2 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${modQuests.length ? (done / modQuests.length) * 100 : 0}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full" style={{ backgroundColor: mod.color }} />
                    </div>
                    <div className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
                      {Math.round(modQuests.length ? (done / modQuests.length) * 100 : 0)}% SYNC_COMPLETE
                    </div>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-[9px] font-mono text-white/20 uppercase mb-3 tracking-widest">Primary Mentor</div>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 border-2 border-white/10 overflow-hidden shadow-2xl">
                          <img src={mainMentor.avatar} alt="" className="w-full h-full object-cover object-top pixel-render" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-display font-bold text-sm tracking-widest text-white uppercase italic">{mainMentor.name}</span>
                          <span className="text-dg-pink text-[9px] font-bold uppercase tracking-widest">{done}/{modQuests.length} Quests</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-white/20 group-hover:text-dg-pink transition-all">
                      <div className="text-right">
                        <div className="text-[9px] font-mono uppercase tracking-widest">ENTER_GATE</div>
                        <div className="h-px w-full bg-current mt-1 origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                      </div>
                      <ChevronRight size={28} className="group-hover:translate-x-2 transition-transform duration-500" />
                    </div>
                  </div>
                </div>

                <div className="absolute top-0 right-0 p-4 opacity-20 font-mono text-[8px] text-white/40 pointer-events-none select-none">
                  CRC: {Math.random().toString(16).slice(2, 10).toUpperCase()}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Mentor Selection ─────────────────────────────────────────
function MentorSelect({ module: mod, onSelect, onBack }: { module: Module; onSelect: (m: Mentor) => void; onBack: () => void }) {
  const { language } = useAuth();
  const mentors = MENTORS.filter(m => mod.mentorIds.includes(m.id));

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-10">
      <StatsBar />
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <button onClick={onBack} className="flex items-center gap-2 text-white/30 hover:text-white transition-colors text-[10px] font-mono uppercase mb-6 group cursor-pointer">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            {language === 'fr' ? 'RETOUR AUX MODULES' : 'BACK TO MODULES'}
          </button>
          <div className="text-[9px] font-mono tracking-[0.5em] mb-2 uppercase" style={{ color: mod.color }}>
            // {mod.name} //
          </div>
          <h2 className="text-5xl font-display font-black text-white uppercase italic tracking-tighter">
            {language === 'fr' ? 'CHOISIR UN GARDIEN' : 'CHOOSE GUARDIAN'}
          </h2>
          <p className="text-white/30 text-sm mt-2">
            {language === 'fr' ? 'Sélectionne le mentor avec qui tu veux progresser.' : 'Pick the mentor you want to train with.'}
          </p>
        </motion.div>

        <div className={`grid gap-6 ${mentors.length === 1 ? 'max-w-sm mx-auto' : mentors.length === 2 ? 'grid-cols-2 max-w-2xl' : 'grid-cols-3'}`}>
          {mentors.map((mentor, i) => {
            const quests = INITIAL_QUESTS.filter(q => q.mentorId === mentor.id);
            return (
              <motion.div
                key={mentor.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -12, scale: 1.03 }}
                onClick={() => onSelect(mentor)}
                className="relative cursor-pointer group overflow-hidden border border-white/10 hover:border-dg-pink/60 transition-all duration-500 shadow-2xl"
                style={{
                  aspectRatio: '3/4',
                  clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)',
                  borderColor: mentor.color + '33'
                }}>
                <div className="absolute inset-0">
                  <img
                    src={mentor.avatar}
                    alt={mentor.name}
                    className="w-full h-full object-cover object-top pixel-render group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute top-0 left-0 right-0 h-1" style={{ background: mentor.color }} />

                <div className="absolute top-4 left-4 right-4">
                  <div className="text-[8px] font-mono uppercase tracking-widest font-bold px-2 py-0.5 inline-block" style={{ color: mentor.color, background: mentor.color + '22', border: `1px solid ${mentor.color}44` }}>
                    {mentor.sector}
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                  <h3 className="text-3xl font-display font-black text-white uppercase tracking-tighter leading-none mb-1 group-hover:text-dg-pink transition-colors">
                    {mentor.name}
                  </h3>
                  <p className="text-white/50 text-[10px] font-bold uppercase tracking-wider mb-3">{mentor.specialty[language]}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono text-white/30">{quests.length} {language === 'fr' ? 'QUÊTES' : 'QUESTS'}</span>
                    <motion.div whileHover={{ x: 4 }} className="flex items-center gap-1 text-white/40 group-hover:text-dg-pink transition-colors">
                      <span className="text-[9px] font-mono uppercase">SÉLECT.</span>
                      <ChevronRight size={14} />
                    </motion.div>
                  </div>
                </div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ boxShadow: `inset 0 0 60px ${mentor.color}22` }} />
              </motion.div>
            );
          })}
        </div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="text-center text-white/20 text-[10px] font-mono uppercase tracking-[0.3em] mt-12">
          {language === 'fr' ? '— SÉLECTIONNE UN MENTOR POUR COMMENCER —' : '— SELECT A MENTOR TO START —'}
        </motion.p>
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
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-10 relative overflow-hidden">
      <div className="fixed -right-20 -bottom-20 w-[60%] h-[90%] opacity-[0.05] pointer-events-none select-none z-0">
        <img src={mentor.sprites?.[1] || mentor.avatar} alt="" className="w-full h-full object-contain object-right-bottom pixel-render" />
      </div>
      <div className="fixed -left-10 top-20 w-[30%] h-[50%] opacity-[0.03] pointer-events-none select-none z-0 rotate-12">
        <img src={mentor.sprites?.[2] || mentor.avatar} alt="" className="w-full h-full object-contain object-left-top pixel-render" />
      </div>

      <div className="relative z-10 max-w-[90vw] mx-auto">
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
