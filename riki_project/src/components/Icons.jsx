import React from "react";
import { C } from "../constants.js";

const MUSCLE_IMG={bench:"muscles/pectoraux.svg",pullup:"muscles/dos.svg",shoulder:"muscles/epaules.svg",curl:"muscles/biceps.svg",dip:"muscles/triceps.svg",squat:"muscles/jambes.svg",calf:"muscles/jambes.svg",crunch:"muscles/abdominaux.svg",grip:"muscles/avantbras.svg"};
// Portrait SVGs get height=size, landscape ones get width=size*1.5
const PORTRAIT_SVG=new Set(["squat","calf","grip"]);

export function ExoSvg({type,size=28,color=C.gr}) {
  const s={width:size,height:size,display:"block"};
  const p={fill:"none",stroke:color,strokeWidth:2.5,strokeLinecap:"round",strokeLinejoin:"round"};
  if(MUSCLE_IMG[type]){const portrait=PORTRAIT_SVG.has(type);const isDark=C.bg==="#060606";const f=isDark?"brightness(0) saturate(100%) invert(88%) sepia(22%) saturate(1057%) hue-rotate(44deg) brightness(104%) contrast(97%)":"brightness(0) saturate(100%) invert(27%) sepia(95%) saturate(2000%) hue-rotate(85deg) brightness(95%) contrast(105%)";return (<img src={MUSCLE_IMG[type]} alt={type} style={{width:portrait?size:size*1.6,height:portrait?size*1.2:size,objectFit:"contain",display:"block",filter:f,opacity:isDark?0.85:0.8}}/>);}
  const icons={
    // Cardio — heart with pulse line
    cardio:(<svg viewBox="0 0 32 32" style={s}>
      <path d="M16 27 L7 18 Q3 14 7 9 Q11 5 16 11 Q21 5 25 9 Q29 14 25 18 Z" fill={color} opacity="0.2" stroke={color} strokeWidth="2"/>
      <polyline points="6,17 12,17 14,13 16,21 18,15 20,17 26,17" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>),
    // Générique — haltère simple
    generic:(<svg viewBox="0 0 32 32" style={s}>
      <circle cx="16" cy="7" r="3" fill={color} opacity="0.3" stroke={color} strokeWidth="2"/>
      <line x1="16" y1="10" x2="16" y2="20" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="10" y1="15" x2="22" y2="15" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="12" y1="27" x2="16" y2="20" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="20" y1="27" x2="16" y2="20" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    </svg>),
  };
  return icons[type] || icons.generic;
}

export function FlameIcon({size=16}) {
  return (<svg width={size} height={size*1.25} viewBox="0 0 16 20"><path d="M8 0C8 0 2 6 2 11a6 6 0 0012 0C14 6 8 0 8 0zM8 16a3 3 0 01-3-3c0-1.5 1-3 3-5 2 2 3 3.5 3 5a3 3 0 01-3 3z" fill={C.gr}/></svg>);
}

export function SlotIcon({size=14}) {
  return (<svg width={size} height={size} viewBox="0 0 600 600" fill={C.gr} stroke="none">
    <g transform="translate(0,600) scale(0.1,-0.1)">
      <path d="M5081 4240 c-18 -4 -52 -21 -75 -37 -140 -98 -112 -310 50 -378 l34-14 0 -285 c0 -268 1 -285 18 -279 15 6 15 5 3 -10 -10 -13 -10 -17 -1 -17 7 0 10 -6 7 -14 -4 -11 1 -13 20 -10 20 4 24 1 20 -10 -4 -9 -2 -18 2 -21 5 -2 12 10 15 28 7 37 32 46 42 15 3 -10 10 -18 15 -18 5 0 9 -7 9 -15 0 -9 7 -18 15 -21 8 -4 15 -19 15 -34 0 -16 4 -31 9 -34 22 -14 30 -231 14 -379 -13 -115-62 -215 -133 -269 -26 -21 -53 -38 -58 -38 -5 0 -15 -7 -22 -15 -21 -25 155-21 196 4 62 37 64 54 64 418 0 300 -2 331 -19 363 -24 46 -58 69 -106 73 l-40 2 -3 281 -2 281 57 29 c133 66 162 230 62 339 -53 58 -134 83 -208 65z"/>
      <path d="M923 3838 c-2 -5 -12 -8 -21 -8 -33 0 -89 -49 -113 -97 l-24 -48 0-830 c0 -768 1 -833 17 -864 10 -18 15 -39 11 -45 -3 -6 -3 -8 2 -4 4 4 23 -6 41 -22 19 -16 51 -34 71 -39 25 -6 693 -10 1882 -10 2041 0 1880 -5 1953 66 54 53 62 100 53 307 -4 94 -7 458 -6 810 0 611 0 640 -19 676 -24 47 -70 86-118 100 -43 12 -3721 20 -3729 8z m1103 -144 c15 -11 37 -33 48 -48 21 -27 21 -36 21 -784 0 -739 0 -758 -20 -790 -11 -18 -34 -42 -51 -53 -30 -18 -55-19 -531 -19 l-500 0 -33 23 c-18 12 -41 38 -51 57 -18 33 -19 74 -19 778 0 724 0 744 20 782 12 24 35 47 58 60 36 19 55 19 534 17 484 -2 497 -3 524 -23z m1274 8 c19 -9 45 -32 57 -51 l23 -34 0 -754 c0 -833 3 -796 -63 -840 l-33-23 -501 0 -500 0 -34 23 c-72 48 -69 7 -69 833 0 617 2 747 14 775 16 39 40 64 76 78 15 6 215 10 510 10 443 1 488 -1 520 -17z m1283 4 c18 -7 43 -25 57-40 22 -25 25 -38 31 -154 9 -163 9 -1126 0 -1299 -6 -122 -8 -134 -31 -158-52 -56 -39 -55 -572 -55 -474 0 -494 1 -526 20 -18 11 -41 34 -52 52 -20 32-20 49 -18 795 3 752 3 762 24 790 47 64 40 63 572 63 387 0 489 -3 515 -14z"/>
      <path d="M1120 3000 l0 -220 95 0 c52 0 95 -3 95 -6 0 -3 -18 -29 -40 -57 l-41 -50 3 -136 3 -136 215 0 214 0 18 105 c26 157 79 303 154 422 22 35 24 48 24 168 l0 130 -370 0 -370 0 0 -220z"/>
      <path d="M2420 3000 c0 -169 3 -220 13 -221 6 0 49 0 95 1 45 1 82 -2 82 -5 0-4 -18 -30 -40 -58 l-41 -50 3 -136 3 -136 215 0 214 0 12 75 c24 158 76 310 143 421 l39 64 3 130 4 130 -372 3 -373 2 0 -220z"/>
      <path d="M3700 3000 l0 -220 95 0 c52 0 95 -3 95 -6 0 -3 -18 -27 -40 -53 l-41 -48 3 -139 3 -139 215 0 215 0 13 95 c17 125 70 282 132 391 l50 89 0 125 0 125 -370 0 -370 0 0 -220z"/>
      <path d="M5066 3128 c-12 -17 -16 -50 -16 -144 0 -115 1 -122 25 -148 29 -32 82 -35 116 -7 23 18 24 27 27 143 4 127 -6 178 -33 178 -11 0 -15 -12 -15 -49 0 -30 -5 -51 -12 -54 -10 -4 -10 -6 0 -6 8 -1 12 -24 12 -79 0 -67 -3 -79 -20-90 -15 -9 -26 -10 -40 -2 -18 10 -20 22 -21 128 -1 64 -1 125 0 135 3 23 -5 22 -23 -5z"/>
      <path d="M4891 2212 c-1 -26 -5 -41 -11 -37 -6 4 -10 -13 -10 -44 0 -28 -4-51 -10 -51 -5 0 -10 -18 -10 -40 0 -30 -4 -40 -16 -40 -12 0 -15 -7 -12 -25 4 -20 2 -23 -8 -14 -10 8 -13 4 -16 -17 -2 -15 -9 -30 -17 -32 -8 -3 -11 0 -7 7 4 6 2 11 -4 11 -17 0 -24 -31 -9 -42 11 -8 10 -9 -4 -4 -10 3 -30 3 -43 0-21 -5 -23 -9 -12 -22 11 -13 10 -14 -14 -8 -18 4 -28 2 -28 -5 0 -6 -7 -9-15 -5 -8 3 -23 -3 -32 -13 -15 -15 -38 -18 -153 -20 -74 -1 -164 -6 -200 -11-36 -5 -189 -10 -340 -11 -151 0 -286 -4 -300 -8 -51 -16 169 -22 605 -19 l440 3 60 29 c118 58 173 149 182 299 3 51 1 108 -5 127 l-10 35 -1 -43z"/>
    </g>
  </svg>);
}

export function SaveIcon({size=14}) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>);
}

export function NI({name,active}) {
  const c=active?C.gr:"#555";const sw=active?2.5:2;
  const pr={fill:"none",stroke:c,strokeWidth:sw,strokeLinecap:"round",strokeLinejoin:"round"};
  const st={width:24,height:24};
  if(name==="home") return (<svg viewBox="0 0 24 24" style={st}><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" {...pr}/><path d="M9 21V12h6v9" {...pr}/></svg>);
  if(name==="dumbbell") return (<svg viewBox="0 0 24 24" style={st}><rect x="1" y="9" width="3" height="6" rx="1" {...pr}/><rect x="4" y="7" width="3" height="10" rx="1" {...pr}/><rect x="17" y="7" width="3" height="10" rx="1" {...pr}/><rect x="20" y="9" width="3" height="6" rx="1" {...pr}/><line x1="7" y1="12" x2="17" y2="12" {...pr}/></svg>);
  if(name==="bolt") return (<svg viewBox="0 0 24 24" style={st}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" {...pr}/></svg>);
  if(name==="history") return (<svg viewBox="0 0 24 24" style={st}><circle cx="12" cy="12" r="9" {...pr}/><polyline points="12 7 12 12 15 14" {...pr}/><path d="M3 12h2" {...pr}/></svg>);
  if(name==="stats") return (<svg viewBox="0 0 24 24" style={st}><circle cx="12" cy="12" r="10" {...pr}/><rect x="7" y="14" width="2" height="4" rx="0.5" fill={active?c:"none"} {...pr} strokeWidth="1.5"/><rect x="11" y="11" width="2" height="7" rx="0.5" fill={active?c:"none"} {...pr} strokeWidth="1.5"/><rect x="15" y="8" width="2" height="10" rx="0.5" fill={active?c:"none"} {...pr} strokeWidth="1.5"/></svg>);
  return null;
}

export function Chip({l,a,o}) {
  return (<button onClick={o} style={{padding:"6px 14px",borderRadius:20,border:a?"1px solid rgba(190,255,108,0.2)":"1px solid transparent",background:a?"rgba(190,255,108,0.1)":C.c1,color:a?C.gr:C.ts,fontSize:11,fontWeight:a?700:400,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"'Outfit',sans-serif",transition:"all 0.15s ease"}}>{l}</button>);
}

export function Tag({i,t}) {
  return (<div style={{background:C.c1,borderRadius:10,padding:"6px 12px",display:"flex",alignItems:"center",gap:5,border:"1px solid "+C.c2}}><span style={{fontSize:12}}>{i}</span><span style={{color:C.t,fontSize:12,fontWeight:500}}>{t}</span></div>);
}
