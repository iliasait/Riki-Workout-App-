import React, { useState } from "react";
import { C, GROUPS, GRP_ICON, CARD, CARD_SOLID } from "../constants.js";
import { ExoSvg, Chip } from "./Icons.jsx";

export default function ExoList({exos,onD,onNew}) {
  const [fg,setFg]=useState(null);const [q,setQ]=useState("");
  const list=exos.filter(e=>(!fg||e.g===fg)&&(!q||e.n.toLowerCase().includes(q.toLowerCase())));
  return (
    <div style={{padding:"14px 16px 0"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <h1 style={{color:C.t,fontSize:26,fontWeight:800,margin:0,fontFamily:C.display,letterSpacing:"-0.5px"}}>Exercices</h1>
        <button onClick={onNew} style={{background:"rgba(190,255,108,0.1)",border:"1px solid rgba(190,255,108,0.15)",color:C.gr,borderRadius:12,padding:"7px 14px",fontSize:12,cursor:"pointer",fontWeight:600,fontFamily:C.body}}>+ Créer</button>
      </div>
      <input value={q} onChange={ev=>setQ(ev.target.value)} placeholder="Rechercher..." style={{width:"100%",padding:"11px 14px",borderRadius:14,border:"1px solid "+C.c2,background:C.c1,color:C.t,fontSize:13,outline:"none",boxSizing:"border-box",margin:"12px 0 10px",fontFamily:C.body}}/>
      <div style={{display:"flex",gap:5,overflowX:"auto",paddingBottom:10}}><Chip l="Tous" a={!fg} o={()=>setFg(null)}/>{GROUPS.map(g=>(<Chip key={g} l={g} a={fg===g} o={()=>setFg(fg===g?null:g)}/>))}</div>
      {list.map((ex,idx)=>(<div key={ex.id} onClick={()=>onD(ex)} style={{...CARD,padding:"12px 14px",marginBottom:6,display:"flex",alignItems:"center",gap:12,cursor:"pointer",animation:"stagger1 0.3s ease both",animationDelay:(idx%8)*30+"ms"}}>
        <div style={{width:58,height:58,borderRadius:16,background:"rgba(190,255,108,0.06)",border:"1px solid rgba(190,255,108,0.1)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,overflow:"hidden"}}><ExoSvg type={GRP_ICON[ex.g]||"generic"} size={40}/></div>
        <div style={{flex:1,minWidth:0}}><div style={{color:C.t,fontWeight:600,fontSize:13,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{ex.n}</div><div style={{color:C.ts,fontSize:11,marginTop:1}}>{ex.g}</div></div>
        <span style={{color:C.c3,fontSize:16}}>›</span>
      </div>))}
    </div>
  );
}

export function ExoDetail({exo,onBack,exos,setExos,presets,setPresets}) {
  const delExo=()=>{if(confirm("Supprimer cet exercice ?")){setExos(p=>p.filter(e=>e.id!==exo.id));onBack();}};
  const delPreset=(pid)=>{if(confirm("Supprimer ce preset ?")){setPresets(p=>p.filter(x=>x.id!==pid));}};
  const linkedPresets=(presets||[]).filter(p=>p.ids.includes(exo.id));
  const muscles={Pectoraux:["Grand pectoral","Petit pectoral","Deltoïde ant."],Dos:["Grand dorsal","Trapèzes","Rhomboïdes"],Épaules:["Deltoïde moyen","Deltoïde ant.","Deltoïde post."],Biceps:["Biceps brachial","Brachial"],Triceps:["Triceps (3 chefs)","Anconé"],Jambes:["Quadriceps","Ischio-jambiers","Fessiers"],Mollets:["Gastrocnémien","Soléaire"],Abdominaux:["Grand droit","Obliques","Transverse"],"Avant-bras":["Fléchisseurs","Extenseurs"],Cardio:["Système cardiovasculaire"]};
  const tips={Pectoraux:"Omoplates serrées, dos légèrement cambré.",Dos:"Tirez avec les coudes, pas les mains.",Épaules:"Technique > charge sur les élévations.",Biceps:"Évitez de balancer le corps.",Triceps:"Coudes fixes et serrés.",Jambes:"Poussez avec les talons.",Mollets:"Amplitude complète.",Abdominaux:"Expirez en contractant.","Avant-bras":"Mouvements lents et contrôlés.",Cardio:"Gardez un rythme régulier."};
  const targeted=muscles[exo.g]||[];
  return (
    <div style={{padding:20}}>
      <button onClick={onBack} style={{background:"none",border:"none",color:C.gr,fontSize:13,cursor:"pointer",marginBottom:14,fontFamily:C.body,fontWeight:500}}>← Retour</button>
      <div style={{background:"radial-gradient(ellipse at 50% 30%, rgba(190,255,108,0.06) 0%, "+C.c1+" 70%)",borderRadius:24,padding:"24px 18px",textAlign:"center",marginBottom:18,border:"1px solid "+C.c2}}>
        <div style={{width:120,height:100,borderRadius:26,background:"rgba(190,255,108,0.08)",display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:12,border:"1px solid rgba(190,255,108,0.12)",overflow:"hidden"}}><ExoSvg type={GRP_ICON[exo.g]||"generic"} size={64}/></div>
        <h2 style={{color:C.t,fontSize:20,fontWeight:800,margin:"0 0 6px",fontFamily:C.display}}>{exo.n}</h2>
        <span style={{background:"rgba(190,255,108,0.1)",color:C.gr,padding:"4px 16px",borderRadius:20,fontSize:12,fontWeight:600}}>{exo.g}</span>
      </div>
      <div style={{...CARD_SOLID,padding:16,marginBottom:10}}>
        <h3 style={{color:C.t,fontSize:14,margin:"0 0 10px",display:"flex",alignItems:"center",gap:6,fontFamily:C.display}}><span style={{color:C.gr}}>◎</span> Muscles ciblés</h3>
        <div style={{display:"flex",flexWrap:"wrap",gap:7}}>{targeted.map((m,i)=>(<span key={i} style={{background:i===0?"rgba(190,255,108,0.1)":C.c2,color:i===0?C.gr:C.ts,padding:"5px 12px",borderRadius:10,fontSize:11,fontWeight:i===0?600:400}}>{m}</span>))}</div>
      </div>
      <div style={{...CARD_SOLID,padding:16,marginBottom:10}}><h3 style={{color:C.t,fontSize:14,margin:"0 0 8px",fontFamily:C.display}}>Exécution</h3><p style={{color:C.ts,lineHeight:1.7,fontSize:13,margin:0}}>{exo.d}</p></div>
      <div style={{...CARD_SOLID,padding:16,marginBottom:10,borderLeft:"3px solid "+C.gr}}><h3 style={{color:C.gr,fontSize:13,margin:"0 0 6px",fontFamily:C.display}}>Conseil</h3><p style={{color:C.ts,lineHeight:1.6,fontSize:12,margin:0}}>{tips[exo.g]}</p></div>
      {exo.custom&&(<button onClick={delExo} style={{width:"100%",padding:"14px 0",borderRadius:14,border:"1px solid rgba(255,77,77,0.2)",background:"rgba(255,77,77,0.08)",color:C.rd,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:C.display,marginTop:6}}>Supprimer cet exercice</button>)}
    </div>
  );
}

export function NewExo({exos,setExos,onBack}) {
  const [n,setN]=useState("");const [d,setD]=useState("");const [g,setG]=useState("Pectoraux");const [pt,setPt]=useState("weight");
  const save=()=>{if(!n.trim())return;setExos(p=>[...p,{id:Date.now(),n:n.trim(),g,d:d.trim(),pr:0,prType:pt,custom:true}]);onBack();};
  return (
    <div style={{padding:20}}>
      <button onClick={onBack} style={{background:"none",border:"none",color:C.gr,fontSize:13,cursor:"pointer",marginBottom:14,fontFamily:C.body,fontWeight:500}}>← Retour</button>
      <h2 style={{color:C.t,fontSize:22,fontWeight:800,margin:"0 0 18px",fontFamily:C.display}}>Créer un exercice</h2>
      <label style={{color:C.ts,fontSize:11,fontWeight:500,letterSpacing:"0.5px",textTransform:"uppercase"}}>Nom</label>
      <input value={n} onChange={ev=>setN(ev.target.value)} placeholder="Ex: Tirage Yates..." style={{width:"100%",padding:"12px 14px",borderRadius:14,border:"1px solid "+C.c2,background:C.c1,color:C.t,fontSize:14,outline:"none",boxSizing:"border-box",marginTop:4,marginBottom:12}}/>
      <label style={{color:C.ts,fontSize:11,fontWeight:500,letterSpacing:"0.5px",textTransform:"uppercase"}}>Groupe</label>
      <select value={g} onChange={ev=>setG(ev.target.value)} style={{width:"100%",padding:"12px 14px",borderRadius:14,border:"1px solid "+C.c2,background:C.c1,color:C.t,fontSize:14,outline:"none",marginTop:4,marginBottom:12}}>{GROUPS.map(gr=>(<option key={gr} value={gr}>{gr}</option>))}</select>
      <label style={{color:C.ts,fontSize:11,fontWeight:500,letterSpacing:"0.5px",textTransform:"uppercase"}}>Type de PR</label>
      <div style={{display:"flex",gap:6,marginTop:4,marginBottom:12}}>
        {[["weight","Poids (kg)"],["reps","Répétitions"],["duration","Durée (sec)"]].map(([v,l])=>(<button key={v} onClick={()=>setPt(v)} style={{flex:1,padding:9,borderRadius:10,border:"none",background:pt===v?"rgba(190,255,108,0.1)":C.c2,color:pt===v?C.gr:C.ts,fontSize:11,cursor:"pointer",fontWeight:600,fontFamily:C.body}}>{l}</button>))}
      </div>
      <label style={{color:C.ts,fontSize:11,fontWeight:500,letterSpacing:"0.5px",textTransform:"uppercase"}}>Description</label>
      <textarea value={d} onChange={ev=>setD(ev.target.value)} placeholder="Consignes..." rows={3} style={{width:"100%",padding:"12px 14px",borderRadius:14,border:"1px solid "+C.c2,background:C.c1,color:C.t,fontSize:13,outline:"none",boxSizing:"border-box",marginTop:4,marginBottom:16,resize:"none"}}/>
      <button onClick={save} style={{width:"100%",height:52,borderRadius:16,border:"none",background:C.gr,color:C.bg,fontWeight:700,fontSize:15,cursor:"pointer",fontFamily:C.display,letterSpacing:"0.5px"}}>CRÉER L'EXERCICE</button>
    </div>
  );
}

export function NewPreset({exos,presets,setPresets,onBack}) {
  const [n,setN]=useState("");const [ids,setIds]=useState([]);
  const tog=id=>setIds(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  const save=()=>{if(!n.trim()||ids.length===0)return;setPresets(p=>[...p,{id:Date.now(),nom:n.trim(),ids}]);onBack();};
  return (
    <div style={{padding:20}}>
      <button onClick={onBack} style={{background:"none",border:"none",color:C.gr,fontSize:13,cursor:"pointer",marginBottom:14,fontFamily:C.body,fontWeight:500}}>← Retour</button>
      <h2 style={{color:C.t,fontSize:22,fontWeight:800,margin:"0 0 18px",fontFamily:C.display}}>Créer un preset</h2>
      <label style={{color:C.ts,fontSize:11,fontWeight:500,letterSpacing:"0.5px",textTransform:"uppercase"}}>Nom</label>
      <input value={n} onChange={ev=>setN(ev.target.value)} placeholder="Ex: Push hypertrophie..." style={{width:"100%",padding:"12px 14px",borderRadius:14,border:"1px solid "+C.c2,background:C.c1,color:C.t,fontSize:14,outline:"none",boxSizing:"border-box",marginTop:4,marginBottom:14}}/>
      <span style={{color:C.ts,fontSize:11,fontWeight:500,letterSpacing:"0.5px",textTransform:"uppercase"}}>Exercices ({ids.length})</span>
      <div style={{maxHeight:300,overflow:"auto",marginTop:8}}>{exos.map(ex=>(<div key={ex.id} onClick={()=>tog(ex.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:12,marginBottom:4,cursor:"pointer",background:ids.includes(ex.id)?"rgba(190,255,108,0.08)":C.c1,border:ids.includes(ex.id)?"1px solid rgba(190,255,108,0.15)":"1px solid transparent",transition:"all 0.15s ease"}}>
        <div style={{width:28,display:"flex",justifyContent:"center"}}><ExoSvg type={GRP_ICON[ex.g]} size={16} color={ids.includes(ex.id)?C.gr:"#555"}/></div>
        <span style={{color:C.t,fontSize:13,flex:1}}>{ex.n}</span>{ids.includes(ex.id)&&(<span style={{color:C.gr,fontWeight:700}}>✓</span>)}
      </div>))}</div>
      <button onClick={save} disabled={!n.trim()||ids.length===0} style={{width:"100%",height:52,borderRadius:16,border:"none",marginTop:14,cursor:"pointer",fontFamily:C.display,background:(n.trim()&&ids.length>0)?C.gr:C.c2,color:(n.trim()&&ids.length>0)?C.bg:C.ts,fontWeight:700,fontSize:15,letterSpacing:"0.5px"}}>ENREGISTRER ({ids.length} EXO)</button>
    </div>
  );
}
