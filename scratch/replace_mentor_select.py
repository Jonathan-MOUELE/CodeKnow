import os

file_path = r'c:\xampp\htdocs\CodeKnow\src\App.tsx'

new_func = """function MentorSelect({ module: mod, onSelect, onBack }: { module: Module; onSelect: (m: Mentor) => void; onBack: () => void }) {
  const { language } = useAuth();
  const mentors = MENTORS.filter(m => mod.mentorIds.includes(m.id));
  const [hovered, setHovered] = useState<Mentor>(mentors[0]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-10 flex flex-col relative overflow-hidden">
      <StatsBar />
      
      {/* Background Decorative Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-white/[0.02] pointer-events-none select-none uppercase tracking-tighter">
        {hovered.name}
      </div>

      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8 shrink-0">
          <button onClick={onBack} className="flex items-center gap-2 text-white/30 hover:text-white transition-colors text-[10px] font-mono uppercase mb-4 group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> {language === 'fr' ? 'RETOUR AUX MODULES' : 'BACK TO MODULES'}
          </button>
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-dg-pink shadow-[0_0_10px_#ff3399]" />
            <h2 className="text-4xl font-display font-black text-white uppercase italic tracking-tighter">
              {language === 'fr' ? 'SÉLECTION DU GARDIEN' : 'GUARDIAN SELECTION'}
            </h2>
          </div>
        </motion.div>

        {/* Showcase Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left: Mentor List Thumbnails */}
          <div className="lg:col-span-3 flex lg:flex-col gap-4 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 scrollbar-hide py-2">
            {mentors.map((m, i) => (
              <motion.div key={m.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onMouseEnter={() => setHovered(m)}
                onClick={() => onSelect(m)}
                className={`group relative p-4 cursor-pointer transition-all duration-300 border-l-4 ${hovered.id === m.id ? 'bg-white/10 border-dg-pink shadow-[0_0_20px_rgba(255,51,153,0.1)]' : 'bg-white/5 border-transparent hover:bg-white/8 hover:border-white/20'}`}
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)' }}>
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 border-2 transition-colors ${hovered.id === m.id ? 'border-dg-pink' : 'border-white/10'} overflow-hidden shrink-0 shadow-lg`}>
                    <img src={m.avatar} alt="" className="w-full h-full object-cover object-top pixel-render" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-mono text-white/30 uppercase truncate tracking-widest">{m.sector}</span>
                    <span className="font-display font-bold text-white uppercase tracking-wider group-hover:text-dg-pink transition-colors text-lg">{m.name}</span>
                  </div>
                </div>
                {hovered.id === m.id && (
                  <motion.div layoutId="active-indicator" className="absolute right-4 top-1/2 -translate-y-1/2 text-dg-pink">
                    <Zap size={18} fill="currentColor" className="animate-pulse" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Center: HUGE Portrait */}
          <div className="lg:col-span-5 relative flex items-end justify-center h-[500px] lg:h-auto">
            <AnimatePresence mode="wait">
              <motion.div key={hovered.id}
                initial={{ opacity: 0, scale: 0.85, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 1.1, x: -50 }}
                transition={{ duration: 0.6, type: 'spring', bounce: 0.3 }}
                className="w-full h-full relative z-10">
                <CharacterSprite mentor={hovered} isTalking={false} className="w-full h-full object-contain object-bottom pixel-render drop-shadow-[0_0_80px_rgba(255,51,153,0.25)] scale-110" />
              </motion.div>
            </AnimatePresence>
            
            {/* Cyber Rings */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[120%] h-[20%] bg-dg-pink/10 blur-[100px] rounded-full" />
            <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
              <div className="w-[600px] h-[600px] border border-white/10 rounded-full animate-spin-slow" />
              <div className="absolute w-[450px] h-[450px] border border-dg-pink/20 rounded-full animate-reverse-spin-slow" />
              <div className="absolute w-[800px] h-px bg-gradient-to-r from-transparent via-dg-pink/20 to-transparent rotate-45" />
            </div>
            <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-black via-black/80 to-transparent z-20" />
          </div>

          {/* Right: Info & Select */}
          <div className="lg:col-span-4 flex flex-col justify-center gap-10">
            <AnimatePresence mode="wait">
              <motion.div key={hovered.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="space-y-8">
                
                <div>
                  <div className="text-dg-pink font-mono text-xs font-black uppercase tracking-[0.6em] mb-3">SYSTEM_AUTHORIZED</div>
                  <h3 className="text-7xl font-display font-black text-white uppercase italic leading-none tracking-tighter shadow-dg-pink/20 drop-shadow-lg">
                    {hovered.name}
                  </h3>
                  <div className="flex gap-1 mt-6">
                    {[1, 2, 3, 4, 5].map(dot => (
                      <div key={dot} className={`h-1.5 w-8 transform -skew-x-12 ${dot <= 3 ? 'bg-dg-pink shadow-[0_0_10px_#ff3399]' : 'bg-white/10'}`} />
                    ))}
                  </div>
                </div>

                <div className="space-y-5">
                  <motion.div initial={{ x: 20 }} animate={{ x: 0 }} className="bg-white/5 border-l-4 border-dg-pink p-5 backdrop-blur-md">
                    <div className="text-[10px] font-mono text-white/40 uppercase mb-2 tracking-widest font-bold">PSYCHOLOGY_TAG</div>
                    <p className="text-white text-lg italic font-medium leading-tight">\\"{hovered.personality[language]}\\"</p>
                  </motion.div>
                  <motion.div initial={{ x: 20 }} animate={{ x: 0 }} transition={{ delay: 0.1 }} className="bg-white/5 border-l-4 border-white/20 p-5 backdrop-blur-md">
                    <div className="text-[10px] font-mono text-white/40 uppercase mb-2 tracking-widest font-bold">CORE_ARCHETYPE</div>
                    <p className="text-dg-pink text-xl font-black uppercase tracking-widest">{hovered.specialty[language]}</p>
                  </motion.div>
                </div>

                <p className="text-white/50 text-base leading-relaxed font-medium max-w-md">
                  {hovered.description[language]}
                </p>

                <div className="pt-4">
                  <motion.button 
                    whileHover={{ scale: 1.02, brightness: 1.2 }} 
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelect(hovered)}
                    className="w-full py-6 bg-dg-pink text-white font-display font-black text-xl uppercase tracking-[0.4em] shadow-[0_0_50px_rgba(255,51,153,0.3)] group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                    <span className="relative z-10 flex items-center justify-center gap-4">
                      {language === 'fr' ? 'ÉTABLIR LE LIEN' : 'INITIATE LINK'} <Zap size={24} />
                    </span>
                  </motion.button>
                  <div className="mt-4 flex justify-between px-2 text-[9px] font-mono text-white/20 uppercase tracking-[0.2em]">
                    <span>STATUS: READY</span>
                    <span>SYNC_LEVEL: 98%</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}"""

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find start and end of the old function
start_marker = "function MentorSelect"
end_marker = "// ── Quest Selection"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx] + new_func + "\\n\\n" + content[end_idx:]
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully replaced MentorSelect")
else:
    print(f"Could not find markers: {start_idx}, {end_idx}")
