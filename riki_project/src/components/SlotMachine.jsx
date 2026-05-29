import React, { useState, useEffect, useRef } from "react";
import { C, GRP_ICON, CARD } from "../constants.js";
import { ExoSvg } from "./Icons.jsx";

export default function SlotM({exos,onClose,onSel}) {
  const [spin,setSpin]=useState(false);const [res,setRes]=useState(null);const [off,setOff]=useState(0);const aRef=useRef(null);
  const iH=76;const tH=exos.length*iH;
  const doSpin=()=>{if(spin)return;setSpin(true);setRes(null);let spd=18+Math.random()*12;let o=off;
    const go=()=>{spd*=0.975;o=(o+spd)%tH;setOff(o);if(spd>0.4){aRef.current=requestAnimationFrame(go);}else{const idx=Math.round(o/iH)%exos.length;setOff(idx*iH);setRes(exos[idx]);setSpin(false);}};
    aRef.current=requestAnimationFrame(go);};
  useEffect(()=>()=>cancelAnimationFrame(aRef.current),[]);
  const trip=[...exos,...exos,...exos];
  return (
    <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.95)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",zIndex:200,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,animation:"fadeIn 0.25s ease"}}>
      <button onClick={onClose} style={{position:"absolute",top:14,right:20,background:"none",border:"none",color:C.t,fontSize:20,cursor:"pointer",opacity:0.6}}>✕</button>
      <h3 style={{color:C.gr,fontSize:18,fontWeight:800,marginBottom:16,fontFamily:C.display,letterSpacing:"-0.3px"}}>Exercice aléatoire</h3>
      <div style={{width:270,height:iH*5,overflow:"hidden",borderRadius:18,background:C.c1,position:"relative",border:"1px solid "+C.c2}}>
        <div style={{position:"absolute",left:0,right:0,top:iH*2,height:iH,border:"2px solid "+C.gr,borderRadius:12,zIndex:10,background:"rgba(190,255,108,0.06)",pointerEvents:"none",boxShadow:"0 0 24px rgba(190,255,108,0.15)"}}/>
        <div style={{transform:"translateY("+(-(off%tH)+iH*2)+"px)",transition:spin?"none":"transform 0.3s ease-out"}}>{trip.map((ex,i)=>(<div key={i} style={{height:iH,display:"flex",alignItems:"center",gap:12,padding:"0 16px",borderBottom:"1px solid "+C.c2}}>
          <div style={{width:44,height:44,borderRadius:14,background:"rgba(190,255,108,0.08)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><ExoSvg type={GRP_ICON[ex.g]||"generic"} size={22}/></div>
          <div><div style={{color:C.t,fontWeight:600,fontSize:13}}>{ex.n}</div><div style={{color:C.ts,fontSize:11}}>{ex.g}</div></div>
        </div>))}</div>
      </div>
      {res&&!spin&&(<div style={{marginTop:18,textAlign:"center",animation:"popIn 0.3s ease"}}><div style={{color:C.gr,fontSize:16,fontWeight:800,fontFamily:C.display}}>🎉 {res.n}</div><button onClick={()=>onSel(res)} style={{marginTop:10,padding:"11px 24px",borderRadius:12,background:C.gr,color:C.bg,fontWeight:700,border:"none",cursor:"pointer",fontSize:13,fontFamily:C.display,letterSpacing:"0.3px"}}>AJOUTER</button></div>)}
      <button onClick={doSpin} disabled={spin} style={{marginTop:18,padding:"13px 32px",borderRadius:16,border:"none",cursor:spin?"default":"pointer",fontFamily:C.display,background:spin?C.c1:C.gr,color:spin?C.ts:C.bg,fontWeight:800,fontSize:15,letterSpacing:"0.5px",boxShadow:spin?"none":"0 0 24px rgba(190,255,108,0.15)"}}>{spin?"...":"LANCER"}</button>
    </div>
  );
}
