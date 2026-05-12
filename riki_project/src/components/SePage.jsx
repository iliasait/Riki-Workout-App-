import React, { useState, useEffect, useRef } from "react";
import { C, GRP_ICON, CARD, CARD_SOLID } from "../constants.js";
import { ExoSvg, SlotIcon, SaveIcon } from "./Icons.jsx";
import SlotM from "./SlotMachine.jsx";

export default function SePage({sOn,exos,setExos,sIds,setSIds,step,setStep,rest,setRest,mode,setMode,tR,setTR,tS,setTS,cE,setCE,cSI,setCSI,allS,setAllS,onEnd,onCan,onNP}) {
  const [wt,setWt]=useState("");const [rp,setRp]=useState("");const [tmr,setTmr]=useState(0);const [tRun,setTRun]=useState(false);const [showSlot,setShowSlot]=useState(false);
  const [keepWt,setKeepWt]=useState(()=>{try{return localStorage.getItem("riki_keepwt")==="1"}catch{return false}});
  useEffect(()=>{try{localStorage.setItem("riki_keepwt",keepWt?"1":"0")}catch{}},[keepWt]);
  const [isoTime,setIsoTime]=useState(0);const [isoRun,setIsoRun]=useState(false);
  const tRef=useRef(null);const isoRef=useRef(null);
  useEffect(()=>{if(tRun&&tmr>0){tRef.current=setTimeout(()=>setTmr(t=>t-1),1000);}else if(tmr===0&&tRun){setTRun(false);setStep("workout");}return()=>clearTimeout(tRef.current);},[tmr,tRun,setStep]);
  useEffect(()=>{if(isoRun){isoRef.current=setInterval(()=>setIsoTime(t=>t+1),1000);}else{clearInterval(isoRef.current);}return()=>clearInterval(isoRef.current);},[isoRun]);

  const inputStyle={width:"100%",padding:12,borderRadius:14,border:"1px solid "+C.c2,background:C.c1,color:C.t,fontSize:20,fontWeight:700,outline:"none",textAlign:"center",boxSizing:"border-box",fontFamily:C.display,fontVariantNumeric:"tabular-nums"};

  if(!sOn) return (<div style={{padding:20,textAlign:"center",paddingTop:80}}><ExoSvg type="bench" size={48}/><h2 style={{color:C.t,marginTop:14,fontSize:18,fontFamily:C.display}}>Prêt ?</h2><p style={{color:C.ts,fontSize:13,marginTop:4}}>Démarrez depuis l'accueil</p></div>);

  if(step==="setup") return (
    <div style={{padding:16}}>
      <h2 style={{color:C.t,fontSize:22,fontWeight:800,margin:"0 0 14px",fontFamily:C.display}}>Configurer</h2>
      <div style={{...CARD_SOLID,padding:14,marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <span style={{color:C.t,fontWeight:700,fontSize:14,fontFamily:C.display}}>Exercices ({sIds.length})</span>
          <div style={{display:"flex",gap:5}}>
            <button onClick={()=>setShowSlot(true)} style={{background:"rgba(190,255,108,0.1)",border:"1px solid rgba(190,255,108,0.15)",color:C.gr,borderRadius:10,padding:"5px 10px",fontSize:11,cursor:"pointer",fontFamily:C.body,display:"flex",alignItems:"center",gap:4}}><SlotIcon size={13}/></button>
            <button onClick={onNP} style={{background:C.c2,border:"none",color:C.ts,borderRadius:10,padding:"5px 10px",fontSize:11,cursor:"pointer",fontFamily:C.body,display:"flex",alignItems:"center",gap:4}}><SaveIcon size={13}/></button>
          </div>
        </div>
        {sIds.length===0&&(<p style={{color:C.ts,fontSize:12,textAlign:"center",margin:"10px 0"}}>Aucun exercice</p>)}
        {sIds.map((id,i)=>{const ex=exos.find(e=>e.id===id);if(!ex)return null;return(<div key={id} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 0",borderBottom:i<sIds.length-1?"1px solid "+C.c2:"none"}}><ExoSvg type={GRP_ICON[ex.g]} size={18} color={C.ts}/><span style={{color:C.t,fontSize:13,flex:1}}>{ex.n}</span><button onClick={()=>setSIds(p=>p.filter(x=>x!==id))} style={{background:"none",border:"none",color:C.rd,fontSize:16,cursor:"pointer"}}>×</button></div>);})}
        <select value="" onChange={ev=>{if(ev.target.value)setSIds(p=>[...new Set([...p,parseInt(ev.target.value)])])}} style={{width:"100%",padding:10,borderRadius:12,border:"1px solid "+C.c2,background:C.c2,color:C.ts,fontSize:12,outline:"none",marginTop:10}}>
          <option value="">+ Ajouter...</option>{exos.filter(e=>!sIds.includes(e.id)).map(e=>(<option key={e.id} value={e.id}>{e.n}</option>))}
        </select>
      </div>
      <div style={{...CARD_SOLID,padding:14,marginBottom:12}}>
        <span style={{color:C.t,fontWeight:700,fontSize:14,fontFamily:C.display}}>Paramètres</span>
        <div style={{marginTop:10}}><span style={{color:C.ts,fontSize:11}}>Repos : <span style={{color:C.gr,fontWeight:700}}>{rest}s</span></span><input type="range" min={15} max={300} step={5} value={rest} onChange={ev=>setRest(parseInt(ev.target.value))} style={{width:"100%",accentColor:C.gr,marginTop:4}}/></div>
        <div style={{display:"flex",gap:6,marginTop:8,marginBottom:10}}>
          <button onClick={()=>setMode("fixed")} style={{flex:1,padding:9,borderRadius:10,border:"none",background:mode==="fixed"?"rgba(190,255,108,0.1)":C.c2,color:mode==="fixed"?C.gr:C.ts,fontSize:12,cursor:"pointer",fontWeight:600,fontFamily:C.body}}>Reps fixées</button>
          <button onClick={()=>setMode("failure")} style={{flex:1,padding:9,borderRadius:10,border:"none",background:mode==="failure"?"rgba(190,255,108,0.1)":C.c2,color:mode==="failure"?C.gr:C.ts,fontSize:12,cursor:"pointer",fontWeight:600,fontFamily:C.body}}>À l'échec</button>
        </div>
        <div style={{display:"flex",gap:8}}><div style={{flex:1}}><label style={{color:C.ts,fontSize:10,fontWeight:500,letterSpacing:"0.5px",textTransform:"uppercase"}}>Séries</label><input type="number" value={tS} onChange={ev=>setTS(parseInt(ev.target.value)||1)} style={{...inputStyle,fontSize:16,marginTop:3}}/></div>
        {mode==="fixed"&&(<div style={{flex:1}}><label style={{color:C.ts,fontSize:10,fontWeight:500,letterSpacing:"0.5px",textTransform:"uppercase"}}>Reps</label><input type="number" value={tR} onChange={ev=>setTR(parseInt(ev.target.value)||1)} style={{...inputStyle,fontSize:16,marginTop:3}}/></div>)}</div>
      </div>
      <button onClick={()=>{if(sIds.length===0)return;setCE(0);setCSI(0);setAllS({});setStep("workout");}} disabled={sIds.length===0} style={{width:"100%",height:56,borderRadius:18,border:"none",cursor:"pointer",fontFamily:C.display,background:sIds.length>0?C.gr:C.c2,color:sIds.length>0?C.bg:C.ts,fontWeight:800,fontSize:16,letterSpacing:"0.5px",boxShadow:sIds.length>0?"0 0 30px rgba(190,255,108,0.15)":"none"}}>COMMENCER ({sIds.length} EXO)</button>
      {showSlot&&(<SlotM exos={exos} onClose={()=>setShowSlot(false)} onSel={ex=>{setSIds(p=>[...new Set([...p,ex.id])]);setShowSlot(false);}}/>)}
    </div>
  );

  if(step==="rest"){const pct=tmr>0?tmr/rest:0;return(
    <div style={{padding:20,textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:480}}>
      <p style={{color:C.ts,fontSize:13,marginBottom:20,fontWeight:500,letterSpacing:"0.5px",textTransform:"uppercase"}}>Temps de repos</p>
      <div style={{position:"relative",width:190,height:190,marginBottom:24}}>
        <svg viewBox="0 0 190 190" style={{width:190,height:190,transform:"rotate(-90deg)",filter:"drop-shadow(0 0 12px rgba(190,255,108,0.15))"}}>
          <circle cx="95" cy="95" r="84" fill="none" stroke={C.c2} strokeWidth="6"/>
          <circle cx="95" cy="95" r="84" fill="none" stroke={C.gr} strokeWidth="6" strokeDasharray={2*Math.PI*84} strokeDashoffset={2*Math.PI*84*(1-pct)} strokeLinecap="round" style={{transition:"stroke-dashoffset 1s linear"}}/>
        </svg>
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:C.gr,fontSize:48,fontWeight:800,fontVariantNumeric:"tabular-nums",fontFamily:C.display}}>{Math.floor(tmr/60).toString().padStart(2,"0")}:{(tmr%60).toString().padStart(2,"0")}</span></div>
      </div>
      <button onClick={()=>{setTRun(false);setTmr(0);setStep("workout");}} style={{padding:"12px 32px",borderRadius:14,background:C.c1,border:"1px solid "+C.c2,color:C.gr,fontWeight:600,fontSize:14,cursor:"pointer",fontFamily:C.body}}>Passer →</button>
    </div>
  );}

  const cur=exos.find(e=>e.id===sIds[cE]);if(!cur)return null;
  const eSets=allS[cur.id]||[];
  const isDuration=cur.prType==="duration";
  const isReps=cur.prType==="reps";
  const logSet=()=>{
    if(isDuration){
      if(isoTime<=0)return;
      const ns={...allS};if(!ns[cur.id])ns[cur.id]=[];ns[cur.id].push({w:0,r:isoTime});setAllS(ns);setIsoTime(0);setIsoRun(false);
      if(isoTime>(cur.pr||0))setExos(prev=>prev.map(e=>e.id===cur.id?{...e,pr:isoTime}:e));
      if(ns[cur.id].length<tS){setCSI(ns[cur.id].length);setTmr(rest);setTRun(true);setStep("rest");}
      return;
    }
    if(isReps){
      const r=parseInt(rp)||0;if(r<=0)return;
      const ns={...allS};if(!ns[cur.id])ns[cur.id]=[];ns[cur.id].push({w:0,r});setAllS(ns);setRp("");
      if(r>(cur.pr||0))setExos(prev=>prev.map(e=>e.id===cur.id?{...e,pr:r}:e));
      if(ns[cur.id].length<tS){setCSI(ns[cur.id].length);setTmr(rest);setTRun(true);setStep("rest");}
      return;
    }
    const w=parseFloat(wt)||0;const r=mode==="failure"?(parseInt(rp)||0):tR;if(w<=0||(mode==="failure"&&r<=0))return;
    const ns={...allS};if(!ns[cur.id])ns[cur.id]=[];ns[cur.id].push({w,r});setAllS(ns);if(!keepWt)setWt("");setRp("");
    if(w>(cur.pr||0))setExos(prev=>prev.map(e=>e.id===cur.id?{...e,pr:w}:e));
    if(ns[cur.id].length<tS){setCSI(ns[cur.id].length);setTmr(rest);setTRun(true);setStep("rest");}};
  const nextE=()=>{if(cE>=sIds.length-1)onEnd();else{setCE(cE+1);setCSI(0);setIsoTime(0);setIsoRun(false);}};

  const ctaStyle={width:"100%",height:52,borderRadius:16,border:"none",cursor:"pointer",fontFamily:C.display,background:C.gr,color:C.bg,fontWeight:800,fontSize:15,boxShadow:"0 0 24px rgba(190,255,108,0.12)",letterSpacing:"0.5px"};

  return (
    <div style={{padding:16}}>
      <div style={{display:"flex",gap:3,marginBottom:12}}>{sIds.map((_,i)=>(<div key={i} style={{flex:1,height:3,borderRadius:2,background:i<cE?C.gr:i===cE?C.gd:C.c2,transition:"background 0.3s ease"}}/>))}</div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{color:C.ts,fontSize:11,fontWeight:500}}>Exercice {cE+1}/{sIds.length}</span><button onClick={onCan} style={{background:"none",border:"none",color:C.rd,fontSize:12,cursor:"pointer",fontFamily:C.body,fontWeight:500}}>Abandonner</button></div>
      <div style={{...CARD,padding:18,textAlign:"center",marginBottom:14}}>
        <div style={{overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"}}><ExoSvg type={GRP_ICON[cur.g]||"generic"} size={60}/></div><h2 style={{color:C.t,fontSize:19,fontWeight:800,margin:"8px 0 3px",fontFamily:C.display}}>{cur.n}</h2><span style={{color:C.gr,fontSize:12,fontWeight:500}}>{cur.g}</span>
        <div style={{marginTop:12,display:"flex",justifyContent:"center",gap:20}}>
          <div><span style={{color:C.ts,fontSize:10,fontWeight:500,letterSpacing:"0.5px",textTransform:"uppercase"}}>Série</span><div style={{color:C.t,fontSize:22,fontWeight:800,fontFamily:C.display,fontVariantNumeric:"tabular-nums"}}>{eSets.length+1}/{tS}</div></div>
          {isDuration?(<div><span style={{color:C.ts,fontSize:10,fontWeight:500,letterSpacing:"0.5px",textTransform:"uppercase"}}>Type</span><div style={{color:C.t,fontSize:13,fontWeight:600}}>Isométrique</div></div>)
          :(<div><span style={{color:C.ts,fontSize:10,fontWeight:500,letterSpacing:"0.5px",textTransform:"uppercase"}}>Mode</span><div style={{color:C.t,fontSize:13,fontWeight:600}}>{isReps?"Reps":mode==="fixed"?tR+" reps":"Échec"}</div></div>)}
          <div><span style={{color:C.ts,fontSize:10,fontWeight:500,letterSpacing:"0.5px",textTransform:"uppercase"}}>Repos</span><div style={{color:C.t,fontSize:13,fontWeight:600}}>{rest}s</div></div>
        </div>
      </div>
      {isDuration?(
        <div style={{textAlign:"center",marginBottom:12}}>
          <div style={{position:"relative",width:170,height:170,margin:"0 auto 16px"}}>
            <svg viewBox="0 0 170 170" style={{width:170,height:170,transform:"rotate(-90deg)",filter:"drop-shadow(0 0 10px rgba(190,255,108,0.12))"}}>
              <circle cx="85" cy="85" r="74" fill="none" stroke={C.c2} strokeWidth="5"/>
              <circle cx="85" cy="85" r="74" fill="none" stroke={C.gr} strokeWidth="5" strokeDasharray={2*Math.PI*74} strokeDashoffset={2*Math.PI*74*Math.max(0,1-isoTime/300)} strokeLinecap="round" style={{transition:"stroke-dashoffset 1s linear"}}/>
            </svg>
            <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
              <span style={{color:C.gr,fontSize:42,fontWeight:800,fontVariantNumeric:"tabular-nums",fontFamily:C.display}}>{Math.floor(isoTime/60).toString().padStart(2,"0")}:{(isoTime%60).toString().padStart(2,"0")}</span>
              <span style={{color:C.ts,fontSize:11,marginTop:3}}>secondes</span>
            </div>
          </div>
          <div style={{display:"flex",gap:8,justifyContent:"center"}}>
            <button onClick={()=>setIsoRun(!isoRun)} style={{padding:"14px 32px",borderRadius:14,border:"none",cursor:"pointer",fontFamily:C.display,background:isoRun?C.rd:C.gr,color:isoRun?"#fff":C.bg,fontWeight:800,fontSize:15,letterSpacing:"0.5px"}}>{isoRun?"PAUSE":"DÉMARRER"}</button>
            {!isoRun&&isoTime>0&&(<button onClick={()=>setIsoTime(0)} style={{padding:"14px 18px",borderRadius:14,border:"1px solid "+C.c2,cursor:"pointer",fontFamily:C.body,background:C.c1,color:C.ts,fontWeight:600,fontSize:14}}>↺</button>)}
          </div>
          {!isoRun&&isoTime>0&&(<button onClick={logSet} style={{...ctaStyle,marginTop:12}}>SÉRIE TERMINÉE — {isoTime}s</button>)}
        </div>
      ):isReps?(
        <div style={{marginBottom:12}}>
          <label style={{color:C.ts,fontSize:10,fontWeight:500,letterSpacing:"0.5px",textTransform:"uppercase"}}>Répétitions</label>
          <input value={rp} onChange={ev=>setRp(ev.target.value)} type="number" style={{...inputStyle,marginTop:4,marginBottom:10}}/>
          <button onClick={logSet} style={ctaStyle}>SÉRIE TERMINÉE</button>
        </div>
      ):(
        <div>
          <div style={{display:"flex",gap:8,marginBottom:8}}>
            <div style={{flex:1}}><label style={{color:C.ts,fontSize:10,fontWeight:500,letterSpacing:"0.5px",textTransform:"uppercase"}}>Poids (kg)</label><input value={wt} onChange={ev=>setWt(ev.target.value)} type="number" style={{...inputStyle,marginTop:4}}/></div>
            {mode==="failure"&&(<div style={{flex:1}}><label style={{color:C.ts,fontSize:10,fontWeight:500,letterSpacing:"0.5px",textTransform:"uppercase"}}>Reps</label><input value={rp} onChange={ev=>setRp(ev.target.value)} type="number" style={{...inputStyle,marginTop:4}}/></div>)}
          </div>
          <div onClick={()=>setKeepWt(!keepWt)} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",marginBottom:12,padding:"6px 0"}}>
            <div style={{width:36,height:20,borderRadius:10,background:keepWt?C.gr:C.c2,position:"relative",transition:"background 0.2s ease",flexShrink:0}}>
              <div style={{width:16,height:16,borderRadius:8,background:keepWt?C.bg:"#666",position:"absolute",top:2,left:keepWt?18:2,transition:"left 0.2s ease,background 0.2s ease"}}/>
            </div>
            <span style={{color:keepWt?C.t:C.ts,fontSize:12,fontWeight:500}}>Garder le poids</span>
          </div>
          <button onClick={logSet} style={{...ctaStyle,marginBottom:8}}>SÉRIE TERMINÉE</button>
        </div>
      )}
      {eSets.length>=tS&&(<button onClick={nextE} style={{width:"100%",height:48,borderRadius:14,border:"2px solid "+C.gr,background:"transparent",color:C.gr,fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:C.display,marginBottom:8,letterSpacing:"0.5px"}}>{cE>=sIds.length-1?"TERMINER":"SUIVANT →"}</button>)}
      {eSets.length>0&&(<div style={{...CARD_SOLID,padding:10,marginTop:8}}><span style={{color:C.ts,fontSize:11,fontWeight:600,letterSpacing:"0.5px",textTransform:"uppercase"}}>Séries</span>{eSets.map((s,i)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",fontSize:13}}><span style={{color:C.t,fontFamily:C.display,fontWeight:600}}>#{i+1}</span><span style={{color:C.ts}}>{isDuration?(s.r+"s"):(s.w>0?(s.w+"kg × "+s.r):(s.r+" reps"))}</span><span style={{color:C.gr,fontWeight:700,fontVariantNumeric:"tabular-nums"}}>{isDuration?(s.r+"s"):(s.w>0?(s.w*s.r).toFixed(0)+"kg":(s.r+" reps"))}</span></div>))}</div>)}
    </div>
  );
}
