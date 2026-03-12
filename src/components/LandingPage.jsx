import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

// ─── Data Arrays ─────────────────────────────────────────────────────────────

const BREEDS = [
  { name: 'Halfmoon', color: '#22d3ee', sprite: '/images/races/blue_betta.png', trait: 'Current Flow — +1 All Stats', desc: 'Balanced perfection — a 180-degree caudal spread with full ray branching and flawless symmetry.' },
  { name: 'Plakat', color: '#ef4444', sprite: '/images/races/red_betta.png', trait: 'Blood Frenzy — +4 STR, +2 VIT', desc: 'Short-finned brawlers from the original fighting bloodlines — compact, aggressive, bred for battle.' },
  { name: 'Doubletail', color: '#a855f7', sprite: '/images/races/purple_betta.png', trait: 'Arcane Depths — +3 INT, +2 DEX', desc: 'Twin-lobed and mystical — a rare recessive breed channeling arcane currents through split caudal fins.' },
  { name: 'Cambodian', color: '#94a3b8', sprite: '/images/races/white_betta.png', trait: 'Phantom Scales — +3 VIT, +2 END', desc: 'Pale and spectral — reduced pigment bettas from the frozen depths, nearly impossible to kill.' },
  { name: 'Giant', color: '#22c55e', sprite: '/images/races/green_betta.png', trait: 'River Fury — +3 STR, +2 AGI', desc: 'Oversized river predators — the enlarged chr8 locus lineage with devastating raw power.' },
  { name: 'Crowntail', color: '#f59e0b', sprite: '/images/races/gold_betta.png', trait: 'Royal Guard — +3 END, +2 VIT', desc: 'Royal defenders — extended ray tips form a crown of spines, armoring them in living gold.' },
  { name: 'Dragonscale', color: '#f97316', sprite: '/images/races/orange_betta.png', trait: 'Thermal Dash — +3 AGI, +2 STR', desc: 'Armored speedsters — thick metallic iridescent scales over a blazing orange body.' },
  { name: 'Butterfly', color: '#ec4899', sprite: '/images/races/pink_betta.png', trait: 'Healing Current — +3 WIS, +2 INT', desc: 'Graceful healers — distinctive banded fin patterns that pulse with restorative energy.' },
];

const CLASSES = [
  { name: 'Bruiser', color: '#ef4444', bg: '/map_nodes/leviathan_lair.png', desc: 'Frontline fighter from the crushing depths. Specializes in raw power, deep-water defense, and the devastating Leviathan Form transformation.' },
  { name: 'Mystic', color: '#8b5cf6', bg: '/map_nodes/crystal_grotto.png', desc: 'Master of current magic and root healing arts. Wields Hydrothermal Blasts, Frozen Currents, and the sacred Bubble Shield barrier.' },
  { name: 'Vesselist', color: '#d97706', bg: '/map_nodes/kelp_forest.png', desc: 'Shapeshifter who transforms into a devastating lake predator. Shark Form unleashes Savage Bite, Torpedo Rush, and Predator\'s Roar.' },
  { name: 'Scraper', color: '#22c55e', bg: '/map_nodes/anemone_garden.png', desc: 'Silent hunter from the kelp canopy. Precision strikes with Root Spine Barrage, Depth Charge traps, and deadly Venom Shot.' },
];

const BOSSES = [
  { name: 'Scylla, Siren of the Shallows', title: 'Guardian of the Sunlit Waters — Level 9', color: '#06b6d4', desc: 'Once the gentlest of the three, Scylla watched over the root groves where young aquatic creatures took their first breaths. Now maddened, her six serpentine heads strike with the speed of rapids.', lore: '"Scylla\'s petrification was always temporary — she would release her victims after they learned respect for the grove. This mercy is now gone."' },
  { name: 'Medusa, Siren of the Mid-Waters', title: 'Keeper of the Twilight Depths — Level 17', color: '#a855f7', desc: 'Medusa maintained the delicate border between light and darkness. Her serpent hair could sense disturbances from miles away. With the Plankton Magic gone, she lashes out at shadows.', lore: '"Legend says Medusa wept when the Plankton Magic fell silent, and her tears became the first abyssal pearls — worth a fortune but cursed with sorrow."' },
  { name: 'Charybdis, Siren of the Abyss', title: 'The Devourer of the Deep — Level 20', color: '#ef4444', desc: 'The most fearsome of the three. She could create whirlpools that swallowed armies, and her gaze didn\'t just petrify — it unmade, dissolving matter back into raw water.', lore: '"Charybdis is the only being who was present at the moment the Plankton Magic went silent. What she saw in that instant drove her to the edge of madness."' },
];

const BOSS_CARDS = [
  { name: 'Medusa', vessel: 'Gorgon Vessel · Fire of Wrath', lore: '"Look upon me and know despair. My gaze turns courage to stone and hope to ash."', img: '/images/bosses/gorgon_siren_1_medusa.png', cls: 'red' },
  { name: 'Charybdis', vessel: 'Gorgon Vessel · Weight of the Abyss', lore: '"The deep hungers endlessly. I am but its maw — all currents flow to me, and none return."', img: '/images/bosses/gorgon_siren_2_charybdis.png', cls: 'blue' },
  { name: 'Scylla', vessel: 'Gorgon Vessel · Coils of Ruin', lore: '"Every root I grasp withers. Every grove I touch crumbles. Nature itself recoils from what I\'ve become."', img: '/images/bosses/gorgon_siren_3_scylla.png', cls: 'green' },
];

const LOCATIONS = [
  { name: 'Root Shallows', tag: 'Birthplace of the Warlords', quote: '"Where the first Betta drew breath, the Crown\'s light still lingers."', img: '/map_nodes/coral_shallows.png', vessel: '#ef4444' },
  { name: 'Kelp Forest', tag: 'The Whispering Canopy', quote: '"The kelp remembers when the Plankton sang through every frond."', img: '/map_nodes/kelp_forest.png', vessel: '#22d3ee' },
  { name: 'Anemone Garden', tag: 'Garden of the First Spells', quote: '"Ancient magic pulses here — older than the Crown itself."', img: '/map_nodes/anemone_garden.png', vessel: '#22d3ee' },
  { name: 'Biolume Caves', tag: 'Echoes of the Lost Light', quote: '"Even in silence, the caves glow with the memory of unity."', img: '/map_nodes/biolume_caves.png', vessel: '#22d3ee' },
  { name: 'Sargasso Maze', tag: 'Labyrinth of the Fallen', quote: '"The drowned drift here, caught between the living and the void."', img: '/map_nodes/sargasso_maze.png', vessel: '#a855f7' },
  { name: 'Sunken Citadel', tag: 'Ruins of the Old Kingdom', quote: '"Once the jewel of Abyssia, now a tomb for forgotten kings."', img: '/map_nodes/ancient_ruins.png', vessel: '#ef4444' },
  { name: 'Crystal Grotto', tag: 'The Singing Crystals', quote: '"The crystals hum with Crown resonance — a fragment is near."', img: '/map_nodes/crystal_grotto.png', vessel: '#ef4444' },
  { name: 'Current Stream', tag: 'The Razor Current', quote: '"Powerful currents sweep the unwary into ambushes and glory alike."', img: '/map_nodes/tide_stream.png', vessel: '#ef4444' },
  { name: 'Shipwreck Hollow', tag: 'Lair of the First Siren', quote: '"Scylla\'s shadow falls across these timbers."', img: '/map_nodes/sunken_wreck.png', vessel: '#a855f7' },
  { name: 'Thermal Vent', tag: 'The Burning Forge', quote: '"In scalding fury, the Warlord forges instruments of destruction."', img: '/map_nodes/thermal_vent.png', vessel: '#ef4444' },
  { name: 'Frozen Depths', tag: 'The Ancient Cold', quote: '"This cold predates the Crown. Something older sleeps beneath the ice."', img: '/map_nodes/frozen_depths.png', vessel: '#22d3ee' },
  { name: 'Leviathan\'s Wake', tag: 'Path of the Titans', quote: '"Where ancient titans passed, the stone still trembles."', img: '/map_nodes/leviathan_lair.png', vessel: '#a855f7' },
  { name: 'Mushroom Forest', tag: 'The Corrupted Garden', quote: '"Corruption blooms where the Plankton\'s light once purified."', img: '/map_nodes/mushroom_forest.png', vessel: '#22d3ee' },
  { name: 'Shadow Citadel', tag: 'Fortress of the Second Siren', quote: '"Medusa\'s tears became abyssal pearls. Her rage became this fortress."', img: '/map_nodes/pearl_gate.png', vessel: '#a855f7' },
  { name: 'Maelstrom Peak', tag: 'Eye of the Storm', quote: '"The vortex masks the approach to the King\'s inner sanctum."', img: '/map_nodes/maelstrom.png', vessel: '#ef4444' },
  { name: 'Hadal Trench', tag: 'Where the Light Hides', quote: '"In the deepest dark, Plankton still glow. They spell a single word."', img: '/map_nodes/abyssal_trench.png', vessel: '#22d3ee' },
  { name: 'Void Threshold', tag: 'Edge of the Known', quote: '"Where light ends, the Abyss begins. A Sentinel stands watch."', img: '/map_nodes/jellyfish_drift.png', vessel: '#22d3ee' },
  { name: 'Corrupted Spire', tag: 'The Final Fragment', quote: '"The last Crown fragment pulses faintly, calling out for rescue."', img: '/map_nodes/clam_beds.png', vessel: '#ef4444' },
  { name: 'The Abyss Throne', tag: 'Seat of the Abyss King', quote: '"In crushing darkness, the King sits upon a throne of devoured light."', img: '/map_nodes/abyssal_throne.png', vessel: '#a855f7' },
  { name: 'Sandy Wastes', tag: 'Graveyard of Heroes', quote: '"The bones of the First Current War lie scattered across the sand."', img: '/map_nodes/sandy_wastes.png', vessel: '#ef4444' },
];

const ENEMIES = [
  'armored_crab', 'barracuda', 'barnacle_warrior', 'jellyfish_eye', 'kelp_giant',
  'lobster_warlord', 'mantis_shrimp', 'sea_serpent', 'shadow_eel', 'shadow_manta',
  'swordfish_knight', 'ink_sorcerer', 'puffer_scout', 'water_elemental', 'frost_titan',
  'frost_wyrm', 'kraken_lich', 'leviathan', 'nature_elemental', 'ocean_mimic',
  'poseidon', 'stone_guardian', 'void_sentinel', 'water_priestess', 'abyss_king',
  'demon_lord', 'grand_shaman', 'charybdis', 'sea_devil', 'sea_mushroom',
];

const BUILDINGS = [
  { name: 'Camp', img: 'campfire.png' }, { name: 'Weapons', img: 'weapons_shop.png' },
  { name: 'Armor', img: 'armor_shop.png' }, { name: 'Potions', img: 'potions_shop.png' },
  { name: 'Relics', img: 'relics_shop.png' }, { name: 'Shrine', img: 'healing_shrine.png' },
  { name: 'Crystal Cave', img: 'crystal_cave.png' }, { name: 'Grotto', img: 'crystal_grotto.png' },
  { name: 'Pearl Beds', img: 'pearl_beds.png' }, { name: 'Coral Grove', img: 'coral_grove.png' },
  { name: 'Algae', img: 'algae_garden.png' }, { name: 'Ore Vein', img: 'ore_vein.png' },
  { name: 'Shells', img: 'shell_deposit.png' }, { name: 'Boss Lair', img: 'boss_lair.png' },
  { name: 'Dungeon', img: 'dungeon_gate.png' }, { name: 'Treasure', img: 'treasure_chest.png' },
];

const ATTRIBUTES = ['strength', 'vitality', 'endurance', 'dexterity', 'agility', 'intellect', 'wisdom', 'tactics'];

const TCG_CARDS = ['card_v1_blue','card_v1_green','card_v1_red','card_v2_blue','card_v2_green','card_v2_red','card_v3_blue','card_v3_green','card_v3_red'];
const TCG_BACKS = ['card_back_blue', 'card_back_green', 'card_back_red'];

const ECO_CARDS = [
  { title: 'Earn GBuX', desc: 'Earn GBuX tokens through battles, quests, cNFT breeding, and exploration. Universal currency across all Grudge Studios titles.', bg: '/map_nodes/coral_shallows.png' },
  { title: 'Free AI Access', desc: 'Free AI via advanced language models. Hero dialogue, battle narration, lore generation, NPC personalities — all free.', bg: '/map_nodes/pearl_gate.png' },
  { title: 'Game Catalog Access', desc: 'GBuX earned here unlocks early access to upcoming Grudge Studios titles before public release.', bg: '/map_nodes/maelstrom.png' },
  { title: 'Exclusive Early Access', desc: 'Betta Warlords is the ONLY entry point to early-stage GBuX. The founding game for everything Grudge Studios builds.', bg: '/map_nodes/abyssal_throne.png' },
  { title: 'cNFT Marketplace', desc: 'Trade bred Warlords, rare mutations, and legendary morphs. In-game achievements become real digital assets.', bg: '/map_nodes/jellyfish_drift.png' },
  { title: 'Founding Player Status', desc: 'Permanent Founding Player status — bonus GBuX rates, exclusive cNFT drops, and priority access forever.', bg: '/map_nodes/frozen_depths.png' },
];

const MYSTERY_CLUES = [
  { text: '"The Root Crown\'s inscriptions speak of a \'Fourth Vessel\' that was never meant to awaken."', color: '#22d3ee' },
  { text: '"Charybdis\'s mad ravings mention \'the light that ate itself.\'"', color: '#a855f7' },
  { text: '"In the deepest part of the Hadal Trench, Plankton still glow — but they spell out a single word in an ancient script."', color: '#22d3ee' },
  { text: '"The Abyss King isn\'t conquering the waters — he\'s filling a vacuum the Plankton left behind."', color: '#ef4444' },
  { text: '"Each Root Crown fragment restored causes a brief, blinding flash of Plankton light — as if they\'re watching."', color: '#06b6d4' },
];

const VESSELS = [
  { name: 'The Betta — Fire of Will', color: '#ef4444', bg: '/map_nodes/thermal_vent.png', desc: 'The Betta fish carry the oldest conscious magic in the waters. Each of the eight breeds channels a different aspect of Will — from the Halfmoon\'s protective resolve to the Crowntail\'s fierce ambition.', status: 'Active — You are the last hope', statusBg: 'rgba(239,68,68,0.15)' },
  { name: 'The Gorgons — Weight of Law', color: '#a855f7', bg: '/map_nodes/abyssal_trench.png', desc: 'Three Gorgon Sirens once maintained the natural order of the deep. Their petrifying gaze was justice — turning only those who threatened the balance to stone. Now they can\'t distinguish friend from foe.', status: 'Corrupted — Must be defeated or restored', statusBg: 'rgba(168,85,247,0.15)' },
  { name: 'The Plankton — Light of Unity', color: '#22d3ee', bg: '/map_nodes/biolume_caves.png', desc: 'The most mysterious magic. Plankton are everywhere — a living bioluminescent network. When their magic went silent, the waters themselves went blind and deaf. Why they withdrew is the central mystery.', status: 'Silent — The great mystery', statusBg: 'rgba(34,211,238,0.15)' },
];

// ─── CSS ─────────────────────────────────────────────────────────────────────

const LANDING_CSS = `
  .lp-reveal { opacity: 0; transform: translateY(50px); transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1); }
  .lp-reveal.visible { opacity: 1; transform: translateY(0); }
  .lp-reveal-left { opacity: 0; transform: translateX(-60px); transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1); }
  .lp-reveal-left.visible { opacity: 1; transform: translateX(0); }
  .lp-reveal-right { opacity: 0; transform: translateX(60px); transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1); }
  .lp-reveal-right.visible { opacity: 1; transform: translateX(0); }
  .lp-reveal-scale { opacity: 0; transform: scale(0.85); transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1); }
  .lp-reveal-scale.visible { opacity: 1; transform: scale(1); }
  @keyframes lpLogoFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-16px); } }
  @keyframes lpBubbleRise {
    0% { transform: translateY(100vh) translateX(0) scale(0.3); opacity: 0; }
    8% { opacity: 1; } 50% { transform: translateY(50vh) translateX(var(--wx)) scale(0.7); }
    92% { opacity: 1; } 100% { transform: translateY(-5vh) translateX(calc(var(--wx) * -0.6)) scale(1); opacity: 0; }
  }
  .lp-bubble { position: absolute; border-radius: 50%; background: radial-gradient(circle at 30% 30%, rgba(34,211,238,0.35), rgba(34,211,238,0.08)); border: 1px solid rgba(34,211,238,0.15); animation: lpBubbleRise linear infinite; }
  @media (max-width: 768px) {
    .lp-split-grid { grid-template-columns: 1fr !important; }
    .lp-nav-links { display: none !important; }
  }
`;

// ─── Bubbles ─────────────────────────────────────────────────────────────────

function Bubbles() {
  const bubbles = useMemo(() => Array.from({ length: 35 }, (_, i) => ({
    id: i, size: 3 + Math.random() * 12, left: Math.random() * 100,
    wx: 15 + Math.random() * 40, dur: 7 + Math.random() * 16, delay: Math.random() * 12,
  })), []);
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {bubbles.map(b => <div key={b.id} className="lp-bubble" style={{ width: b.size, height: b.size, left: `${b.left}%`, '--wx': `${b.wx}px`, animationDuration: `${b.dur}s`, animationDelay: `${b.delay}s` }} />)}
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const SEC = { maxWidth: 1300, margin: '0 auto', padding: '100px 24px' };

function STitle({ children, style }) {
  return <h2 className="lp-reveal" style={{ textAlign: 'center', fontFamily: "'Cinzel', serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: 16, background: 'linear-gradient(135deg, #22d3ee, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', ...style }}>{children}</h2>;
}
function SSub({ children }) {
  return <p className="lp-reveal" style={{ textAlign: 'center', color: '#94a3b8', fontSize: 'clamp(1rem, 2.2vw, 1.3rem)', marginBottom: 56, maxWidth: 750, marginLeft: 'auto', marginRight: 'auto' }}>{children}</p>;
}
function Divider() {
  return <div style={{ height: 1, maxWidth: 700, margin: '0 auto', background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.3), transparent)' }} />;
}
function FullImg({ src, alt, title, subtitle }) {
  return (
    <div className="lp-reveal-scale" style={{ width: '100%', position: 'relative', overflow: 'hidden' }}>
      <img src={src} alt={alt} loading="lazy" style={{ width: '100%', display: 'block', maxHeight: 500, objectFit: 'cover' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(5,10,24,0.92) 0%, rgba(5,10,24,0.4) 40%, rgba(5,10,24,0.4) 60%, rgba(5,10,24,0.92) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 40 }}>
        <div>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: 16, color: '#fff' }}>{title}</h2>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.3rem)', color: '#94a3b8', maxWidth: 650 }}>{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
function Btn({ href, children, bg, color, border, shadow }) {
  return <a href={href} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 36px', borderRadius: 10, fontFamily: "'Cinzel', serif", fontSize: '1.05rem', fontWeight: 700, textDecoration: 'none', letterSpacing: 1.5, background: bg, color, border: border || 'none', boxShadow: shadow || 'none', transition: 'all 0.3s' }}>{children}</a>;
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function LandingPage() {
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef(null);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const s1 = document.createElement('style'); s1.id = 'landing-scroll-fix';
    s1.textContent = 'html,body,#root{overflow:auto!important;height:auto!important;overscroll-behavior:auto!important;position:static!important}body{touch-action:auto!important}#root{display:block!important}';
    document.head.appendChild(s1);
    const s2 = document.createElement('style'); s2.id = 'landing-page-css'; s2.textContent = LANDING_CSS;
    document.head.appendChild(s2);
    setLoaded(true);
    return () => { document.getElementById('landing-scroll-fix')?.remove(); document.getElementById('landing-page-css')?.remove(); };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    containerRef.current?.querySelectorAll('.lp-reveal,.lp-reveal-left,.lp-reveal-right,.lp-reveal-scale').forEach(n => obs.observe(n));
    return () => obs.disconnect();
  }, [loaded]);

  useEffect(() => {
    const h = e => { e.preventDefault(); setDeferredPrompt(e); };
    window.addEventListener('beforeinstallprompt', h);
    return () => window.removeEventListener('beforeinstallprompt', h);
  }, []);

  const installPWA = useCallback(() => {
    if (deferredPrompt) { deferredPrompt.prompt(); deferredPrompt.userChoice.then(() => setDeferredPrompt(null)); }
  }, [deferredPrompt]);

  if (!loaded) return null;

  return (
    <div ref={containerRef} style={{ minHeight: '100vh', color: '#e2e8f0', fontFamily: "'Jost', sans-serif", background: '#050a18' }}>
      <Bubbles />

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(5,10,24,0.88)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
        <a href="/"><img src="/images/logo.png" alt="Betta Warlords" style={{ height: 36, filter: 'drop-shadow(0 0 8px rgba(6,182,212,0.3))' }} /></a>
        <div className="lp-nav-links" style={{ display: 'flex', gap: 24 }}>
          {['Lore','Breeds','World','cNFT','Grudge','GBuX','Install'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500, letterSpacing: 0.5, textTransform: 'uppercase', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color='#22d3ee'} onMouseLeave={e => e.target.style.color='#94a3b8'}>{l}</a>
          ))}
        </div>
      </nav>

      {/* EXCLUSIVE + WEB STRIPS */}
      <div style={{ marginTop: 60, background: 'linear-gradient(90deg, #f59e0b, #f97316, #f59e0b)', color: '#000', textAlign: 'center', padding: '14px 20px', fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 'clamp(0.8rem, 2vw, 1.1rem)', letterSpacing: 2, textTransform: 'uppercase' }}>
        Your Exclusive Gateway to GBuX, cNFT Breeding & Grudge Studios Free AI
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', padding: '14px 20px', fontSize: '0.9rem', fontWeight: 600, letterSpacing: 1 }}>
        {[{ l:'Web2 — Play Free',c:'#22d3ee' },{ l:'Web3 — cNFT On-Chain',c:'#a855f7' },{ l:'PWA — Install as App',c:'#22c55e' },{ l:'Free AI Powered',c:'#f59e0b' }].map(b =>
          <span key={b.l} style={{ padding:'6px 16px', borderRadius:8, background:`${b.c}18`, color:b.c, border:`1px solid ${b.c}50` }}>{b.l}</span>
        )}
      </div>

      {/* HERO */}
      <header style={{ position:'relative', minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', overflow:'hidden', padding:'60px 24px' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 20% 50%, rgba(6,182,212,0.18) 0%, transparent 50%), radial-gradient(ellipse at 80% 30%, rgba(168,85,247,0.14) 0%, transparent 50%), linear-gradient(180deg, #050a18 0%, #0a1128 50%, #0e1630 100%)' }} />
        <div style={{ position:'relative', zIndex:2 }}>
          <img src="/images/splash_logo.png" alt="Betta Warlords" style={{ width:'min(600px, 90vw)', marginBottom:32, filter:'drop-shadow(0 0 60px rgba(6,182,212,0.5))', animation:'lpLogoFloat 4s ease-in-out infinite' }} />
          <h1 style={{ fontFamily:"'Cinzel', serif", fontSize:'clamp(2.8rem, 7vw, 5.5rem)', fontWeight:900, background:'linear-gradient(135deg, #22d3ee 0%, #a855f7 40%, #ef4444 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', marginBottom:20, letterSpacing:3 }}>BETTA WARLORDS</h1>
          <p style={{ fontSize:'clamp(1.1rem, 2.5vw, 1.6rem)', color:'#94a3b8', marginBottom:36, maxWidth:750 }}>The Sunken Kingdom of Abyssia awaits. 8 Betta breeds. 4 classes. 32 unique Warlords. Tactical RPG combat — and your gateway to cNFT breeding, GBuX rewards, and Free AI.</p>
          <div style={{ display:'flex', gap:14, flexWrap:'wrap', justifyContent:'center', marginBottom:40 }}>
            {[{l:'Turn-Based RPG',c:'#06b6d4'},{l:'cNFT Breeding',c:'#a855f7'},{l:'GBuX Rewards',c:'#f59e0b'},{l:'Grudge Gameplay',c:'#ef4444'}].map(b =>
              <span key={b.l} style={{ padding:'8px 20px', borderRadius:24, fontSize:'0.85rem', fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', border:`1px solid ${b.c}`, color:b.c, background:`${b.c}20` }}>{b.l}</span>
            )}
          </div>
          <div style={{ display:'flex', gap:18, flexWrap:'wrap', justifyContent:'center' }}>
            <Btn href="/play" bg="linear-gradient(135deg, #06b6d4, #a855f7)" color="#fff" shadow="0 6px 24px rgba(6,182,212,0.45)">Dive In — Play Now</Btn>
            <Btn href="#cnft" bg="rgba(255,255,255,0.05)" color="#22d3ee" border="1px solid rgba(6,182,212,0.4)">cNFT Breeding</Btn>
            <Btn href="#gbux" bg="linear-gradient(135deg, #f59e0b, #f97316)" color="#000" shadow="0 6px 24px rgba(245,158,11,0.45)">Earn GBuX</Btn>
            {deferredPrompt && <button onClick={installPWA} style={{ display:'inline-flex', alignItems:'center', padding:'16px 36px', borderRadius:10, fontFamily:"'Cinzel', serif", fontSize:'1.05rem', fontWeight:700, letterSpacing:1.5, background:'linear-gradient(135deg, #22c55e, #059669)', color:'#fff', border:'none', cursor:'pointer', boxShadow:'0 6px 24px rgba(34,197,94,0.45)' }}>Install App</button>}
          </div>
        </div>
      </header>

      <FullImg src="/backgrounds/ocean_battle_new.png" alt="Battle" title="Tactical Combat in Living Waters" subtitle="4-row positioning, speed-based initiative, Guardian intercepts, transformations, and multi-unit party battles" />

      {/* VIDEOS */}
      <section style={SEC}>
        <STitle>See It In Action</STitle>
        <SSub>Watch gameplay footage and cinematics from the Sunken Kingdom</SSub>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(380px, 1fr))', gap:28 }}>
          {[{ src:'/videos/intro_cinematic.mp4', title:'Intro Cinematic', desc:'Your first dive into Abyssia', color:'#22d3ee', border:'rgba(6,182,212,0.2)' },
            { src:'/videos/hero_creation_cinematic.mp4', title:'Hero Creation', desc:'Choose breed, class, and destiny', color:'#a855f7', border:'rgba(168,85,247,0.2)' }].map(v =>
            <div key={v.src} className="lp-reveal" style={{ borderRadius:16, overflow:'hidden', border:`1px solid ${v.border}`, background:'rgba(14,22,48,0.6)' }}>
              <video controls preload="metadata" playsInline style={{ width:'100%', display:'block', aspectRatio:'16/9', objectFit:'cover', background:'#000' }}><source src={v.src} type="video/mp4" /></video>
              <div style={{ padding:'16px 20px' }}>
                <h4 style={{ fontFamily:"'Cinzel', serif", color:v.color, marginBottom:4 }}>{v.title}</h4>
                <p style={{ fontSize:'0.9rem', color:'#94a3b8' }}>{v.desc}</p>
              </div>
            </div>
          )}
        </div>
        <div className="lp-reveal" style={{ marginTop:28, borderRadius:16, overflow:'hidden', border:'1px solid rgba(245,158,11,0.2)', background:'rgba(14,22,48,0.4)', textAlign:'center' }}>
          <img src="/videos/beta_intro.gif" alt="Beta Preview" loading="lazy" style={{ width:'100%', maxHeight:360, objectFit:'cover', display:'block' }} />
          <div style={{ padding:'16px 20px' }}>
            <h4 style={{ fontFamily:"'Cinzel', serif", color:'#f59e0b', marginBottom:4 }}>Beta Preview</h4>
            <p style={{ fontSize:'0.9rem', color:'#94a3b8' }}>Live gameplay preview from the beta build</p>
          </div>
        </div>
      </section>

      <Divider />

      {/* LORE */}
      <section style={SEC} id="lore">
        <STitle>The Silence of the Plankton</STitle>
        <SSub>Three Vessels of Magic once sustained all life beneath the waves. Then the Light of Unity went silent...</SSub>
        <div className="lp-reveal" style={{ maxWidth:900, margin:'0 auto', background:'rgba(14,22,48,0.6)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:20, padding:'48px 40px', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:4, background:'linear-gradient(90deg, #ef4444, #a855f7, #22d3ee)' }} />
          {['In the age before memory, when the waters were young and currents still sang, three vessels of magic sustained all life beneath the waves. The Betta carried the Fire of Will. The Gorgons held the Weight of Law. And the Plankton bore the Light of Unity, the quiet magic that binds every living thing.',
            'For eons, the three magics held the waters in balance. The Betta Warlords built Abyssia atop the Root Crown, a living root throne that channeled all three magics into harmony.',
            'Then the Plankton Magic went silent. No warning, no cataclysm. The Root Crown shattered. The Gorgon Sirens turned hostile. The Betta Warlords found themselves alone in darkening waters.',
          ].map((p,i) => <p key={i} style={{ fontSize:'clamp(1rem, 1.8vw, 1.15rem)', lineHeight:1.9, color:'#94a3b8', marginBottom:20 }}>{p}</p>)}
          <p style={{ fontSize:'clamp(1rem, 1.8vw, 1.15rem)', lineHeight:1.9, color:'#22d3ee', fontWeight:500 }}>Now you must gather your Warlords, restore the Root Crown, face the maddened Gorgons, and discover why the Plankton Magic fell silent.</p>
        </div>
      </section>

      {/* VESSELS */}
      <section style={SEC}>
        <STitle>The Three Vessels of Magic</STitle>
        <SSub>Fire, Law, and Unity — the water's power flows through three ancient channels</SSub>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(340px, 1fr))', gap:28 }}>
          {VESSELS.map((v,i) => (
            <div key={i} className={i===0?'lp-reveal-left':i===2?'lp-reveal-right':'lp-reveal'} style={{ border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, padding:'40px 28px', textAlign:'center', position:'relative', overflow:'hidden', backgroundImage:`url(${v.bg})`, backgroundSize:'cover', backgroundPosition:'center', transition:'all 0.4s' }}>
              <div style={{ position:'absolute', inset:0, background:'rgba(5,10,24,0.82)', borderRadius:20 }} />
              <div style={{ position:'absolute', top:0, left:0, right:0, height:4, zIndex:2, background:`linear-gradient(90deg, ${v.color}, ${v.color}88)` }} />
              <div style={{ position:'relative', zIndex:1 }}>
                <h3 style={{ fontFamily:"'Cinzel', serif", fontSize:'1.4rem', marginBottom:12, color:v.color }}>{v.name}</h3>
                <p style={{ fontSize:'1rem', color:'#94a3b8', lineHeight:1.7 }}>{v.desc}</p>
                <span style={{ display:'inline-block', padding:'6px 16px', borderRadius:14, fontSize:'0.8rem', fontWeight:700, marginTop:16, textTransform:'uppercase', letterSpacing:1, background:v.statusBg, color:v.color }}>{v.status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Divider />
      <FullImg src="/backgrounds/kelp_battle.png" alt="Kelp Forest" title="Explore a Vast Underwater World" subtitle="32 locations across root groves, kelp forests, volcanic vents, frozen depths, and the darkest abyss" />

      {/* BREEDS */}
      <section style={SEC} id="breeds">
        <STitle>8 Betta Breeds</STitle>
        <SSub>Inspired by real IBC show standards. Each breed channels a unique aspect of the Fire of Will.</SSub>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:24 }}>
          {BREEDS.map((b,i) => (
            <div key={i} className="lp-reveal" style={{ background:'rgba(14,22,48,0.7)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:16, padding:24, display:'flex', gap:20, alignItems:'flex-start', transition:'all 0.4s' }}>
              <img src={b.sprite} alt={b.name} loading="lazy" style={{ width:80, height:80, borderRadius:14, imageRendering:'pixelated', flexShrink:0, border:`2px solid ${b.color}` }} />
              <div>
                <h4 style={{ fontFamily:"'Cinzel', serif", fontSize:'1.15rem', marginBottom:4, color:b.color }}>{b.name}</h4>
                <div style={{ fontSize:'0.82rem', fontWeight:700, letterSpacing:0.5, marginBottom:8, color:b.color }}>{b.trait}</div>
                <p style={{ fontSize:'0.9rem', color:'#94a3b8', lineHeight:1.5 }}>{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* CLASSES */}
      <section style={SEC}>
        <STitle>4 Warlord Classes</STitle>
        <SSub>8 breeds × 4 classes = 32 unique Warlord combinations with deep skill trees</SSub>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:28 }}>
          {CLASSES.map((c,i) => (
            <div key={i} className="lp-reveal" style={{ border:`1px solid ${c.color}30`, borderRadius:20, padding:'36px 28px', textAlign:'center', position:'relative', overflow:'hidden', backgroundImage:`url(${c.bg})`, backgroundSize:'cover', backgroundPosition:'center', transition:'all 0.4s' }}>
              <div style={{ position:'absolute', inset:0, background:'rgba(5,10,24,0.82)', borderRadius:20 }} />
              <div style={{ position:'relative', zIndex:1 }}>
                <h4 style={{ fontFamily:"'Cinzel', serif", fontSize:'1.3rem', marginBottom:10, color:c.color }}>{c.name}</h4>
                <p style={{ fontSize:'0.95rem', color:'#94a3b8' }}>{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Divider />
      <FullImg src="/backgrounds/volcanic_battle.png" alt="Volcanic" title="From Burning Vents to Frozen Depths" subtitle="Each battlefield tells a story — unique terrain, hazards, and atmosphere" />

      {/* BOSSES */}
      <section style={SEC}>
        <STitle>The Gorgon Sirens</STitle>
        <SSub>Three corrupted guardians stand between you and the truth of the Silence</SSub>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(350px, 1fr))', gap:28 }}>
          {BOSSES.map((b,i) => (
            <div key={i} className={i===0?'lp-reveal-left':i===2?'lp-reveal-right':'lp-reveal'} style={{ background:'rgba(14,22,48,0.8)', borderRadius:20, padding:'36px 28px', position:'relative', overflow:'hidden', transition:'all 0.4s' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:4, background:b.color }} />
              <h4 style={{ fontFamily:"'Cinzel', serif", fontSize:'1.25rem', marginBottom:6, color:b.color }}>{b.name}</h4>
              <div style={{ fontSize:'0.85rem', textTransform:'uppercase', letterSpacing:1.5, marginBottom:14, color:b.color }}>{b.title}</div>
              <p style={{ fontSize:'0.95rem', color:'#94a3b8', marginBottom:14, lineHeight:1.6 }}>{b.desc}</p>
              <div style={{ fontStyle:'italic', fontSize:'0.9rem', padding:'14px 18px', borderLeft:`3px solid ${b.color}`, background:'rgba(0,0,0,0.25)', borderRadius:'0 10px 10px 0', color:b.color }}>{b.lore}</div>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* TCG BOSS CARDS */}
      <section style={SEC}>
        <STitle>The Three Gorgon Sirens</STitle>
        <SSub>The Root Crown shattered — driving the Gorgon Sirens mad with power</SSub>
        <div className="lp-reveal" style={{ display:'flex', gap:28, justifyContent:'center', flexWrap:'wrap' }}>
          {BOSS_CARDS.map((bc,i) => {
            const C = { red:{ n:'#ef4444',v:'#f87171',b:'rgba(239,68,68,0.2)' }, blue:{ n:'#60a5fa',v:'#93c5fd',b:'rgba(96,165,250,0.2)' }, green:{ n:'#4ade80',v:'#86efac',b:'rgba(74,222,128,0.2)' } }[bc.cls];
            return (
              <div key={i} style={{ width:220, borderRadius:12, overflow:'hidden', border:`2px solid ${C.b}`, background:'rgba(0,0,0,0.4)' }}>
                <div style={{ width:'100%', aspectRatio:'1/1', overflow:'hidden', position:'relative' }}>
                  <img src={bc.img} alt={bc.name} loading="lazy" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                  <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'50%', background:'linear-gradient(transparent, rgba(0,0,0,0.8))' }} />
                </div>
                <div style={{ padding:'12px 14px 16px', textAlign:'center' }}>
                  <div style={{ fontFamily:"'Cinzel', serif", fontSize:'1rem', fontWeight:700, marginBottom:4, color:C.n }}>{bc.name}</div>
                  <div style={{ fontSize:'0.7rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:6, color:C.v, opacity:0.8 }}>{bc.vessel}</div>
                  <div style={{ fontSize:'0.75rem', color:'rgba(200,200,220,0.7)', lineHeight:1.4, fontStyle:'italic' }}>{bc.lore}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="lp-reveal" style={{ display:'flex', justifyContent:'center', marginTop:32 }}>
          <div style={{ width:380, borderRadius:12, overflow:'hidden', border:'2px solid rgba(255,215,0,0.2)', background:'rgba(0,0,0,0.4)' }}>
            <div style={{ width:'100%', aspectRatio:'16/10', overflow:'hidden', position:'relative' }}>
              <img src="/images/bosses/gorgon_sisters_all.png" alt="Gorgon Sisters" loading="lazy" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
            </div>
            <div style={{ padding:'12px 14px 16px', textAlign:'center' }}>
              <div style={{ fontFamily:"'Cinzel', serif", fontSize:'1rem', fontWeight:700, marginBottom:4, color:'#ffd700' }}>The Gorgon Sisters</div>
              <div style={{ fontSize:'0.7rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:6, color:'#fbbf24' }}>United Vessels · The Root Crown Shattered</div>
              <div style={{ fontSize:'0.75rem', color:'rgba(200,200,220,0.7)', lineHeight:1.4, fontStyle:'italic' }}>"Three who were guardians. Three who fell. Three who must be stopped."</div>
            </div>
          </div>
        </div>
        <div className="lp-reveal" style={{ display:'flex', gap:20, justifyContent:'center', flexWrap:'wrap', marginTop:36 }}>
          {TCG_CARDS.map(c => <div key={c} style={{ width:160, borderRadius:10, overflow:'hidden', border:'1px solid rgba(255,255,255,0.06)' }}><img src={`/images/cards/${c}.png`} alt={c} loading="lazy" style={{ width:'100%', display:'block', imageRendering:'pixelated' }} /></div>)}
        </div>
        <div className="lp-reveal" style={{ display:'flex', gap:20, justifyContent:'center', flexWrap:'wrap', marginTop:16 }}>
          {TCG_BACKS.map(c => <div key={c} style={{ width:160, borderRadius:10, overflow:'hidden', border:'1px solid rgba(255,255,255,0.06)' }}><img src={`/images/cards/${c}.png`} alt={c} loading="lazy" style={{ width:'100%', display:'block', imageRendering:'pixelated' }} /></div>)}
        </div>
      </section>

      <Divider />

      {/* WORLD */}
      <section style={SEC} id="world">
        <STitle>The World of Abyssia</STitle>
        <SSub>32 explorable locations across 5 freshwater terrain regions</SSub>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:20 }}>
          {LOCATIONS.map((loc,i) => (
            <div key={i} className="lp-reveal" style={{ background:'rgba(14,22,48,0.6)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:14, overflow:'hidden', transition:'all 0.4s' }}>
              <img src={loc.img} alt={loc.name} loading="lazy" style={{ width:'100%', height:150, objectFit:'cover', imageRendering:'pixelated' }} />
              <div style={{ padding:18 }}>
                <h5 style={{ fontFamily:"'Cinzel', serif", fontSize:'1rem', marginBottom:6 }}><span style={{ display:'inline-block', width:10, height:10, borderRadius:'50%', marginRight:8, verticalAlign:'middle', background:loc.vessel }} />{loc.name}</h5>
                <span style={{ fontSize:'0.75rem', textTransform:'uppercase', letterSpacing:1, color:loc.vessel, display:'block', marginBottom:10 }}>{loc.tag}</span>
                <p style={{ fontSize:'0.85rem', fontStyle:'italic', color:'#94a3b8', lineHeight:1.5 }}>{loc.quote}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* CREATURES */}
      <section style={SEC}>
        <STitle>Creatures of the Deep</STitle>
        <SSub>Over 30 unique enemy types inhabit the waters of Abyssia</SSub>
        <div className="lp-reveal" style={{ display:'flex', flexWrap:'wrap', gap:16, justifyContent:'center' }}>
          {ENEMIES.map(e => <img key={e} src={`/images/enemies/${e}.png`} alt={e.replace(/_/g,' ')} title={e.replace(/_/g,' ')} loading="lazy" style={{ width:96, height:96, borderRadius:12, border:'1px solid rgba(255,255,255,0.08)', background:'rgba(14,22,48,0.5)', padding:8, imageRendering:'pixelated', objectFit:'contain', transition:'all 0.4s' }} />)}
        </div>
      </section>

      <Divider />
      <FullImg src="/backgrounds/abyss_throne_battle.png" alt="Abyss" title="Descend Into the Abyss" subtitle="Face the Abyss King and discover the truth behind the Silence" />

      {/* BUILDINGS */}
      <section style={SEC}>
        <STitle>Kingdom Structures</STitle>
        <SSub>Build, upgrade, and manage your underwater stronghold</SSub>
        <div className="lp-reveal" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(110px, 1fr))', gap:14 }}>
          {BUILDINGS.map((b,i) => <div key={i} style={{ background:'rgba(14,22,48,0.5)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:12, padding:12, textAlign:'center' }}><img src={`/images/buildings/${b.img}`} alt={b.name} loading="lazy" style={{ width:72, height:72, imageRendering:'pixelated', marginBottom:8 }} /><span style={{ display:'block', fontSize:'0.72rem', textTransform:'uppercase', letterSpacing:0.5, color:'#94a3b8' }}>{b.name}</span></div>)}
        </div>
      </section>

      <Divider />

      {/* ATTRIBUTES */}
      <section style={SEC}>
        <STitle>8 Core Attributes</STitle>
        <SSub>Every Warlord is defined by 8 attributes that shape combat and progression</SSub>
        <div className="lp-reveal" style={{ display:'flex', flexWrap:'wrap', gap:18, justifyContent:'center' }}>
          {ATTRIBUTES.map(a => <div key={a} style={{ width:110, background:'rgba(14,22,48,0.5)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:12, padding:12, textAlign:'center' }}><img src={`/images/attributes/${a}.png`} alt={a} loading="lazy" style={{ width:64, height:64, imageRendering:'pixelated', marginBottom:8 }} /><span style={{ display:'block', fontSize:'0.78rem', textTransform:'uppercase', letterSpacing:0.5, color:'#94a3b8' }}>{a}</span></div>)}
        </div>
      </section>

      <Divider />

      {/* cNFT */}
      <section id="cnft" style={{ position:'relative', padding:'100px 24px', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(168,85,247,0.1), rgba(6,182,212,0.1))' }} />
        <div className="lp-split-grid" style={{ position:'relative', zIndex:2, maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, alignItems:'center' }}>
          <div className="lp-reveal-left">
            <h2 style={{ fontFamily:"'Cinzel', serif", fontSize:'clamp(1.8rem, 4vw, 2.8rem)', marginBottom:20, background:'linear-gradient(135deg, #a855f7, #22d3ee)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>cNFT Breeding</h2>
            <p style={{ color:'#94a3b8', fontSize:'clamp(1rem, 1.6vw, 1.15rem)', marginBottom:18, lineHeight:1.8 }}>Your Betta Warlords are compressed NFTs on-chain. Breed 8 species across 4 classes to create rare genetic combinations.</p>
            <ul style={{ listStyle:'none', marginBottom:28 }}>
              {['32 base cNFT types with unique genetics','Hybrid traits and rare mutations via breeding','Battle history permanently on-chain','Trade or breed on the marketplace','Legendary morphs through multi-gen breeding'].map(li =>
                <li key={li} style={{ padding:'10px 0', fontSize:'1.05rem', display:'flex', gap:12 }}><span style={{ fontFamily:"'Cinzel', serif", fontWeight:900, fontSize:'1.2rem', flexShrink:0, color:'#a855f7' }}>›</span>{li}</li>
              )}
            </ul>
            <Btn href="/play" bg="linear-gradient(135deg, #06b6d4, #a855f7)" color="#fff" shadow="0 6px 24px rgba(6,182,212,0.45)">Start Breeding</Btn>
          </div>
          <div className="lp-reveal-right" style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:10 }}>
            {BREEDS.map(b => <img key={b.name} src={b.sprite} alt={b.name} loading="lazy" style={{ width:'100%', borderRadius:10, imageRendering:'pixelated', border:'1px solid rgba(255,255,255,0.08)' }} />)}
          </div>
        </div>
      </section>

      {/* GRUDGE */}
      <section id="grudge" style={{ position:'relative', padding:'100px 24px', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(245,158,11,0.1))' }} />
        <div className="lp-split-grid" style={{ position:'relative', zIndex:2, maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, alignItems:'center' }}>
          <div className="lp-reveal-left" style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:10 }}>
            {['swordfish_knight','lobster_warlord','abyss_king','charybdis','kraken_lich','void_sentinel','demon_lord','leviathan'].map(e =>
              <img key={e} src={`/images/enemies/${e}.png`} alt={e} loading="lazy" style={{ width:'100%', borderRadius:10, imageRendering:'pixelated', border:'1px solid rgba(255,255,255,0.08)' }} />
            )}
          </div>
          <div className="lp-reveal-right">
            <h2 style={{ fontFamily:"'Cinzel', serif", fontSize:'clamp(1.8rem, 4vw, 2.8rem)', marginBottom:20, background:'linear-gradient(135deg, #ef4444, #f97316)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Grudge Gameplay</h2>
            <p style={{ color:'#94a3b8', fontSize:'clamp(1rem, 1.6vw, 1.15rem)', marginBottom:18, lineHeight:1.8 }}>Built on the Grudge engine — every battle has consequences, every defeat creates a grudge, and rivals remember.</p>
            <p style={{ color:'#ef4444', fontWeight:600, marginBottom:18 }}>Betta Warlords is the ONLY way to access the early stages of Grudge Studios systems.</p>
            <ul style={{ listStyle:'none', marginBottom:28 }}>
              {['Persistent rival system','Grudge mechanics fuel revenge bonuses','4-row tactical positioning','Multi-unit speed-based initiative','Exclusive early access to Grudge engine'].map(li =>
                <li key={li} style={{ padding:'10px 0', fontSize:'1.05rem', display:'flex', gap:12 }}><span style={{ fontFamily:"'Cinzel', serif", fontWeight:900, fontSize:'1.2rem', flexShrink:0, color:'#ef4444' }}>›</span>{li}</li>
              )}
            </ul>
            <Btn href="/play" bg="linear-gradient(135deg, #ef4444, #f97316)" color="#fff" shadow="0 6px 24px rgba(239,68,68,0.45)">Enter the Arena</Btn>
          </div>
        </div>
      </section>

      {/* GBuX */}
      <section id="gbux" style={{ position:'relative', padding:'100px 24px', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(245,158,11,0.14), rgba(34,211,238,0.08))' }} />
        <div style={{ position:'relative', zIndex:2, maxWidth:1200, margin:'0 auto' }}>
          <div className="lp-reveal" style={{ textAlign:'center', marginBottom:48 }}>
            <h2 style={{ fontFamily:"'Cinzel', serif", fontSize:'clamp(2rem, 5vw, 3.5rem)', background:'linear-gradient(135deg, #f59e0b, #f97316)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>GBuX & Grudge Studios Free AI</h2>
            <p style={{ color:'#94a3b8', maxWidth:800, margin:'20px auto 0', fontSize:'clamp(1rem, 1.8vw, 1.2rem)' }}>Your exclusive gateway to the GBuX reward ecosystem and Free AI platform.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:24, marginTop:40 }}>
            {ECO_CARDS.map((ec,i) => (
              <div key={i} className="lp-reveal" style={{ border:'1px solid rgba(255,255,255,0.06)', borderRadius:16, padding:'28px 24px', textAlign:'center', position:'relative', overflow:'hidden', backgroundImage:`url(${ec.bg})`, backgroundSize:'cover', backgroundPosition:'center', transition:'all 0.4s' }}>
                <div style={{ position:'absolute', inset:0, background:'rgba(5,10,24,0.85)', borderRadius:16 }} />
                <div style={{ position:'relative', zIndex:1 }}>
                  <h4 style={{ fontFamily:"'Cinzel', serif", fontSize:'1.05rem', marginBottom:10, color:'#f59e0b' }}>{ec.title}</h4>
                  <p style={{ fontSize:'0.9rem', color:'#94a3b8', lineHeight:1.6 }}>{ec.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="lp-reveal" style={{ textAlign:'center', marginTop:48 }}>
            <Btn href="/play" bg="linear-gradient(135deg, #f59e0b, #f97316)" color="#000" shadow="0 6px 24px rgba(245,158,11,0.45)">Play Now — Start Earning GBuX</Btn>
          </div>
        </div>
      </section>

      <Divider />

      {/* PWA */}
      <section style={SEC} id="install">
        <STitle>Play Anywhere</STitle>
        <SSub>Web2 browser game. Web3 on-chain cNFTs. Install as a native app on any device.</SSub>
        <div className="lp-reveal" style={{ background:'linear-gradient(135deg, rgba(34,197,94,0.12), rgba(6,182,212,0.12))', border:'1px solid rgba(34,197,94,0.2)', borderRadius:16, padding:32, display:'flex', alignItems:'center', gap:24, flexWrap:'wrap', maxWidth:900, margin:'0 auto' }}>
          <div style={{ width:64, height:64, borderRadius:14, overflow:'hidden', flexShrink:0 }}><img src="/images/logo.png" alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} /></div>
          <div style={{ flex:1 }}>
            <h3 style={{ fontFamily:"'Cinzel', serif", fontSize:'1.3rem', color:'#22c55e', marginBottom:6 }}>Install Betta Warlords</h3>
            <p style={{ color:'#94a3b8', fontSize:'0.95rem' }}>Full-screen app-like experience. Works offline, launches instantly, automatic updates.</p>
            <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginTop:12 }}>
              {['iOS Safari','Android Chrome','Windows','macOS','Linux','ChromeOS'].map(p =>
                <span key={p} style={{ padding:'4px 12px', borderRadius:8, fontSize:'0.75rem', fontWeight:600, background:'rgba(255,255,255,0.06)', color:'#e2e8f0', border:'1px solid rgba(255,255,255,0.1)' }}>{p}</span>
              )}
            </div>
          </div>
          {deferredPrompt && <button onClick={installPWA} style={{ flexShrink:0, padding:'16px 36px', borderRadius:10, fontFamily:"'Cinzel', serif", fontSize:'1.05rem', fontWeight:700, background:'linear-gradient(135deg, #22c55e, #059669)', color:'#fff', border:'none', cursor:'pointer' }}>Install Now</button>}
        </div>
        <div className="lp-reveal" style={{ textAlign:'center', marginTop:32 }}>
          <p style={{ color:'#94a3b8', fontSize:'0.95rem', marginBottom:24 }}>Or just play in your browser — no download needed.</p>
          <Btn href="/play" bg="linear-gradient(135deg, #06b6d4, #a855f7)" color="#fff" shadow="0 6px 24px rgba(6,182,212,0.45)">Play in Browser</Btn>
        </div>
      </section>

      <Divider />

      {/* MYSTERY */}
      <section style={SEC}>
        <STitle>The Silence of the Plankton</STitle>
        <SSub>Fragments of truth scattered through the deep...</SSub>
        <div className="lp-reveal" style={{ maxWidth:800, margin:'0 auto', background:'rgba(14,22,48,0.6)', border:'1px solid rgba(34,211,238,0.15)', borderRadius:14, padding:28 }}>
          {MYSTERY_CLUES.map((mc,i) => <div key={i} style={{ padding:'16px 0', borderBottom:i<MYSTERY_CLUES.length-1?'1px solid rgba(255,255,255,0.05)':'none', fontStyle:'italic', fontSize:'1rem', lineHeight:1.6, color:mc.color }}>{mc.text}</div>)}
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ ...SEC, textAlign:'center', paddingBottom:48 }}>
        <STitle style={{ marginBottom:20 }}>The Waters Are Calling</STitle>
        <SSub>Gather your Warlords. Restore the Root Crown. Discover the Silence. Earn GBuX. Be a founding player.</SSub>
        <div className="lp-reveal" style={{ display:'flex', gap:18, flexWrap:'wrap', justifyContent:'center' }}>
          <Btn href="/play" bg="linear-gradient(135deg, #06b6d4, #a855f7)" color="#fff" shadow="0 6px 24px rgba(6,182,212,0.45)">Dive In — Play Betta Warlords</Btn>
          <Btn href="#cnft" bg="rgba(255,255,255,0.05)" color="#22d3ee" border="1px solid rgba(6,182,212,0.4)">cNFT Breeding</Btn>
          <Btn href="#gbux" bg="linear-gradient(135deg, #f59e0b, #f97316)" color="#000" shadow="0 6px 24px rgba(245,158,11,0.45)">Earn GBuX</Btn>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ textAlign:'center', padding:'80px 24px 48px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
        <img src="/images/logo.png" alt="Betta Warlords" style={{ width:140, marginBottom:20, filter:'drop-shadow(0 0 16px rgba(6,182,212,0.3))' }} />
        <p style={{ fontFamily:"'Cinzel', serif", fontSize:'1.1rem', color:'#e2e8f0', marginBottom:6 }}>Grudge Studios</p>
        <p style={{ color:'#94a3b8', fontSize:'0.9rem', marginBottom:10 }}>Betta Warlords — The Sunken Kingdom of Abyssia</p>
        <p style={{ fontSize:'0.8rem', color:'#94a3b8' }}>Powered by Free AI • cNFT Breeding • GBuX Ecosystem • PWA</p>
        <div style={{ display:'flex', gap:28, justifyContent:'center', marginTop:20, flexWrap:'wrap' }}>
          {[{l:'Play Now',h:'/play'},{l:'Lore',h:'#lore'},{l:'Breeds',h:'#breeds'},{l:'cNFT',h:'#cnft'},{l:'Grudge',h:'#grudge'},{l:'GBuX',h:'#gbux'},{l:'Install',h:'#install'},{l:'Game Factory',h:'/factory'}].map(lk =>
            <a key={lk.l} href={lk.h} style={{ color:'#06b6d4', textDecoration:'none', fontSize:'0.9rem', transition:'color 0.2s' }} onMouseEnter={e=>e.target.style.color='#22d3ee'} onMouseLeave={e=>e.target.style.color='#06b6d4'}>{lk.l}</a>
          )}
        </div>
        <p style={{ marginTop:28, fontSize:'0.75rem', color:'rgba(148,163,184,0.5)' }}>© 2026 Grudge Studios. All rights reserved.</p>
      </footer>
    </div>
  );
}
