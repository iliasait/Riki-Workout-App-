// ── RIKI Design System ──
// Direction: Industrial raw × refined luxury
// Fonts: Urbanist (display) + Outfit (body)

const DARK = {
  bg:"#060606",
  sf:"#0C0C0C",
  c1:"#141414",
  c2:"#1E1E1E",
  c3:"#2A2A2A",
  gr:"#BEFF6C",
  gd:"#8AFF00",
  gi:"rgba(190,255,108,0.08)",
  gg:"rgba(190,255,108,0.18)",
  gl:"rgba(190,255,108,0.04)",
  t:"#F5F5F0",
  ts:"#6B6B6B",
  t2:"#999",
  rd:"#FF4D4D",
  glass:"rgba(255,255,255,0.03)",
  glassBorder:"rgba(255,255,255,0.06)",
  navBg:"rgba(12,12,12,0.95)",
  navBorder:"rgba(255,255,255,0.04)",
};

const LIGHT = {
  bg:"#F8F8F6",
  sf:"#FFFFFF",
  c1:"#EFEFED",
  c2:"#E2E2DE",
  c3:"#D4D4D0",
  gr:"#4CAF00",
  gd:"#3D8C00",
  gi:"rgba(76,175,0,0.08)",
  gg:"rgba(76,175,0,0.18)",
  gl:"rgba(76,175,0,0.04)",
  t:"#1A1A1A",
  ts:"#777777",
  t2:"#555",
  rd:"#E53935",
  glass:"rgba(0,0,0,0.03)",
  glassBorder:"rgba(0,0,0,0.08)",
  navBg:"rgba(255,255,255,0.95)",
  navBorder:"rgba(0,0,0,0.06)",
};

export const C = {
  ...DARK,
  display:"'Urbanist', sans-serif",
  body:"'Outfit', sans-serif",
};

export function applyTheme(theme) {
  const palette = theme === "light" ? LIGHT : DARK;
  Object.assign(C, palette);
  refreshCards();
  document.body.style.background = C.bg;
  document.body.style.color = C.t;
  const meta = document.querySelector('meta[name="color-scheme"]');
  if (meta) meta.content = theme;
  // Update inputs/selects styling
  const style = document.getElementById("riki-theme-vars");
  if (style) {
    style.textContent = `
      body{background:${C.bg};color:${C.t};color-scheme:${theme}}
      select,input,textarea{background-color:${C.c1};color:${C.t};color-scheme:${theme}}
    `;
  } else {
    const s = document.createElement("style");
    s.id = "riki-theme-vars";
    s.textContent = `
      body{background:${C.bg};color:${C.t};color-scheme:${theme}}
      select,input,textarea{background-color:${C.c1};color:${C.t};color-scheme:${theme}}
    `;
    document.head.appendChild(s);
  }
}

export const LOGO = "/logo_riki.png";

export const GROUPS = ["Pectoraux","Dos","Épaules","Biceps","Triceps","Jambes","Mollets","Abdominaux","Avant-bras","Cardio"];

export const GRP_ICON = {Pectoraux:"bench",Dos:"pullup",Épaules:"shoulder",Biceps:"curl",Triceps:"dip",Jambes:"squat",Mollets:"calf",Abdominaux:"crunch","Avant-bras":"grip",Cardio:"cardio"};

export const INIT_EX = [
  {id:1,n:"Développé couché barre",g:"Pectoraux",d:"Banc plat, descendre la barre puis pousser.",pr:0,prType:"weight"},
  {id:2,n:"Développé couché haltères",g:"Pectoraux",d:"Haltères, plus grande amplitude.",pr:0,prType:"weight"},
  {id:3,n:"Développé incliné barre",g:"Pectoraux",d:"Banc 30-45°. Haut des pecs.",pr:0,prType:"weight"},
  {id:4,n:"Développé incliné haltères",g:"Pectoraux",d:"Banc 30-45° avec haltères.",pr:0,prType:"weight"},
  {id:5,n:"Écarté couché",g:"Pectoraux",d:"Isolation, ouvrir en arc.",pr:0,prType:"weight"},
  {id:6,n:"Écarté poulie",g:"Pectoraux",d:"Câbles croisés.",pr:0,prType:"weight"},
  {id:7,n:"Pompes",g:"Pectoraux",d:"Poids du corps.",pr:0,prType:"reps"},
  {id:8,n:"Pompes diamant",g:"Pectoraux",d:"Mains rapprochées, triceps + pecs intérieurs.",pr:0,prType:"reps"},
  {id:9,n:"Pullover",g:"Pectoraux",d:"Haltère, expansion cage thoracique.",pr:0,prType:"weight"},
  {id:10,n:"Tractions pronation",g:"Dos",d:"Prise large, grand dorsal.",pr:0,prType:"reps"},
  {id:11,n:"Tractions supination",g:"Dos",d:"Prise serrée, biceps + dos.",pr:0,prType:"reps"},
  {id:12,n:"Rowing barre",g:"Dos",d:"Buste 45°, tirer vers nombril.",pr:0,prType:"weight"},
  {id:13,n:"Rowing haltère",g:"Dos",d:"Un bras, appui sur banc.",pr:0,prType:"weight"},
  {id:14,n:"Tirage vertical",g:"Dos",d:"Alternative tractions.",pr:0,prType:"weight"},
  {id:15,n:"Tirage horizontal",g:"Dos",d:"Poulie basse, épaisseur du dos.",pr:0,prType:"weight"},
  {id:16,n:"Soulevé de terre",g:"Dos",d:"Composé fondamental.",pr:0,prType:"weight"},
  {id:17,n:"Soulevé de terre roumain",g:"Dos",d:"Ischio-jambiers et bas du dos.",pr:0,prType:"weight"},
  {id:18,n:"Développé militaire",g:"Épaules",d:"Au-dessus de la tête.",pr:0,prType:"weight"},
  {id:19,n:"Développé Arnold",g:"Épaules",d:"Rotation pendant le mouvement.",pr:0,prType:"weight"},
  {id:20,n:"Élévation latérale",g:"Épaules",d:"Deltoïde moyen.",pr:0,prType:"weight"},
  {id:21,n:"Élévation frontale",g:"Épaules",d:"Deltoïde antérieur.",pr:0,prType:"weight"},
  {id:22,n:"Oiseau",g:"Épaules",d:"Deltoïde postérieur, buste penché.",pr:0,prType:"weight"},
  {id:23,n:"Face pull",g:"Épaules",d:"Santé épaules.",pr:0,prType:"weight"},
  {id:24,n:"Shrug",g:"Épaules",d:"Trapèzes supérieurs.",pr:0,prType:"weight"},
  {id:25,n:"Curl barre EZ",g:"Biceps",d:"Confort poignets.",pr:0,prType:"weight"},
  {id:26,n:"Curl marteau",g:"Biceps",d:"Brachial.",pr:0,prType:"weight"},
  {id:27,n:"Curl haltères",g:"Biceps",d:"Curl classique avec supination.",pr:0,prType:"weight"},
  {id:28,n:"Curl concentré",g:"Biceps",d:"Isolation maximale, assis.",pr:0,prType:"weight"},
  {id:29,n:"Curl pupitre",g:"Biceps",d:"Appui sur pupitre Larry Scott.",pr:0,prType:"weight"},
  {id:30,n:"Dips",g:"Triceps",d:"Barres parallèles.",pr:0,prType:"reps"},
  {id:31,n:"Extension poulie",g:"Triceps",d:"Pushdown.",pr:0,prType:"weight"},
  {id:32,n:"Barre au front",g:"Triceps",d:"Skull crushers, barre EZ.",pr:0,prType:"weight"},
  {id:33,n:"Extension nuque haltère",g:"Triceps",d:"Un haltère derrière la tête.",pr:0,prType:"weight"},
  {id:34,n:"Kick back",g:"Triceps",d:"Haltère, bras tendu en arrière.",pr:0,prType:"weight"},
  {id:35,n:"Squat barre",g:"Jambes",d:"Roi des jambes.",pr:0,prType:"weight"},
  {id:36,n:"Squat bulgare",g:"Jambes",d:"Pied arrière surélevé.",pr:0,prType:"weight"},
  {id:37,n:"Presse à cuisses",g:"Jambes",d:"Machine 45°.",pr:0,prType:"weight"},
  {id:38,n:"Leg extension",g:"Jambes",d:"Isolation quadriceps.",pr:0,prType:"weight"},
  {id:39,n:"Leg curl",g:"Jambes",d:"Isolation ischio-jambiers.",pr:0,prType:"weight"},
  {id:40,n:"Hip thrust",g:"Jambes",d:"Fessiers.",pr:0,prType:"weight"},
  {id:41,n:"Fentes",g:"Jambes",d:"Marchées ou sur place.",pr:0,prType:"weight"},
  {id:42,n:"Goblet squat",g:"Jambes",d:"Squat avec haltère ou kettlebell.",pr:0,prType:"weight"},
  {id:43,n:"Mollets debout",g:"Mollets",d:"Gastrocnémiens.",pr:0,prType:"weight"},
  {id:44,n:"Mollets assis",g:"Mollets",d:"Soléaire.",pr:0,prType:"weight"},
  {id:45,n:"Crunch",g:"Abdominaux",d:"Base abdos.",pr:0,prType:"reps"},
  {id:46,n:"Planche",g:"Abdominaux",d:"Gainage isométrique.",pr:0,prType:"duration"},
  {id:47,n:"Planche latérale",g:"Abdominaux",d:"Gainage obliques.",pr:0,prType:"duration"},
  {id:48,n:"Relevé de jambes",g:"Abdominaux",d:"Abdos inférieurs.",pr:0,prType:"reps"},
  {id:49,n:"Russian twist",g:"Abdominaux",d:"Obliques avec rotation.",pr:0,prType:"reps"},
  {id:50,n:"Ab wheel",g:"Abdominaux",d:"Roue abdominale.",pr:0,prType:"reps"},
  {id:51,n:"Farmer walk",g:"Avant-bras",d:"Préhension.",pr:0,prType:"weight"},
  {id:52,n:"Wrist curl",g:"Avant-bras",d:"Flexion poignets.",pr:0,prType:"weight"},
  {id:53,n:"Course à pied",g:"Cardio",d:"Running, jogging.",pr:0,prType:"duration"},
  {id:54,n:"Vélo",g:"Cardio",d:"Vélo stationnaire ou route.",pr:0,prType:"duration"},
  {id:55,n:"Rameur",g:"Cardio",d:"Rameur ergomètre.",pr:0,prType:"duration"},
  {id:56,n:"Corde à sauter",g:"Cardio",d:"Cardio et coordination.",pr:0,prType:"duration"},
  {id:57,n:"HIIT",g:"Cardio",d:"Intervalles haute intensité.",pr:0,prType:"duration"},
  {id:58,n:"Elliptique",g:"Cardio",d:"Machine elliptique.",pr:0,prType:"duration"},
  {id:59,n:"Natation",g:"Cardio",d:"Nage libre, dos, brasse.",pr:0,prType:"duration"},
];

export const fmtD = (d) => new Date(d).toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"});
export const volS = (sets) => sets.reduce((a,s)=>a+s.p*s.r,0);
export const volE = (exos) => exos.reduce((a,e)=>a+volS(e.sets),0);
export const nS = (exos) => exos.reduce((a,e)=>a+e.sets.length,0);
export const prFmt = (ex) => ex.prType==="duration"?ex.pr+"s":ex.prType==="reps"?ex.pr+" reps":ex.pr+" kg";

// ── Shared styles ──
export const CARD = {
  background:C.glass,
  borderRadius:20,
  border:"1px solid "+C.glassBorder,
  backdropFilter:"blur(12px)",
  WebkitBackdropFilter:"blur(12px)",
};

export const CARD_SOLID = {
  background:C.c1,
  borderRadius:20,
  border:"1px solid "+C.c2,
};

function refreshCards() {
  CARD.background = C.glass;
  CARD.border = "1px solid "+C.glassBorder;
  CARD_SOLID.background = C.c1;
  CARD_SOLID.border = "1px solid "+C.c2;
}

// Inject animations + grain texture
const ANIM_STYLE = document.createElement("style");
ANIM_STYLE.textContent=`
@keyframes slideInRight{from{transform:translateX(50px);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes slideInLeft{from{transform:translateX(-50px);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes fadeIn{from{opacity:0;transform:scale(0.97)}to{opacity:1;transform:scale(1)}}
@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes popIn{from{opacity:0;transform:scale(0.85)}to{opacity:1;transform:scale(1)}}
@keyframes pulse{0%{transform:scale(1)}50%{transform:scale(1.04)}100%{transform:scale(1)}}
@keyframes stagger1{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes stagger2{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes glow{0%{box-shadow:0 0 8px rgba(190,255,108,0.15)}50%{box-shadow:0 0 20px rgba(190,255,108,0.3)}100%{box-shadow:0 0 8px rgba(190,255,108,0.15)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
button{transition:transform 0.15s ease, opacity 0.15s ease}
button:active{transform:scale(0.95)!important;opacity:0.85!important}
*{-webkit-tap-highlight-color:transparent;-webkit-touch-callout:none}
::-webkit-scrollbar{display:none}
input[type="number"]{font-variant-numeric:tabular-nums}
/* Grain texture overlay */
#root::after{content:"";position:fixed;inset:0;pointer-events:none;z-index:9999;opacity:0.025;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-repeat:repeat;background-size:128px 128px}
`;
if(!document.getElementById("riki-anims")){ANIM_STYLE.id="riki-anims";document.head.appendChild(ANIM_STYLE);}
