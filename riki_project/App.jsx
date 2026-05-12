import React, { useState, useEffect, useRef, useMemo } from "react";
import { C, INIT_EX, applyTheme } from "./src/constants.js";
import { NI } from "./src/components/Icons.jsx";
import { ExoDetail, NewExo, NewPreset } from "./src/components/ExoList.jsx";
import { HistDetail } from "./src/components/HistPage.jsx";
import Onboarding from "./src/components/Onboarding.jsx";
import Dash from "./src/components/Dash.jsx";
import ExoList from "./src/components/ExoList.jsx";
import SePage from "./src/components/SePage.jsx";
import HistPage from "./src/components/HistPage.jsx";
import StatsPage from "./src/components/StatsPage.jsx";

export default function App() {
  const [tab,setTab]=useState(0);
  const DEFAULT_PRESETS=[{id:1,nom:"Push Day",ids:[1,3,6,30,31]},{id:2,nom:"Pull Day",ids:[10,12,14,25,26]},{id:3,nom:"Leg Day",ids:[35,37,38,40,43]}];
  const [exos,setExos]=useState(()=>{try{const s=localStorage.getItem("riki_exos");return s?JSON.parse(s):INIT_EX}catch{return INIT_EX}});
  const [hist,setHist]=useState(()=>{try{const s=localStorage.getItem("riki_hist");return s?JSON.parse(s):[]}catch{return[]}});
  const [presets,setPresets]=useState(()=>{try{const s=localStorage.getItem("riki_presets");return s?JSON.parse(s):DEFAULT_PRESETS}catch{return DEFAULT_PRESETS}});
  const [ov,_setOv]=useState(null);
  const setOv=(v)=>{_setOv(v);if(v&&contentRef.current)contentRef.current.scrollTop=0;};
  const [sOn,setSOn]=useState(false);
  const [sIds,setSIds]=useState([]);
  const [sStep,setSStep]=useState("setup");
  const [rest,setRest]=useState(90);
  const [mode,setMode]=useState("fixed");
  const [tR,setTR]=useState(10);
  const [tS,setTS]=useState(4);
  const [cE,setCE]=useState(0);
  const [cSI,setCSI]=useState(0);
  const [allS,setAllS]=useState({});
  useEffect(()=>{try{localStorage.setItem("riki_exos",JSON.stringify(exos))}catch{}},[exos]);
  useEffect(()=>{try{localStorage.setItem("riki_hist",JSON.stringify(hist))}catch{}},[hist]);
  useEffect(()=>{try{localStorage.setItem("riki_presets",JSON.stringify(presets))}catch{}},[presets]);
  const [planned,setPlanned]=useState(()=>{try{return JSON.parse(localStorage.getItem("riki_planned")||"[]")}catch{return[]}});
  useEffect(()=>{try{localStorage.setItem("riki_planned",JSON.stringify(planned))}catch{}},[planned]);
  const [goal,setGoal]=useState(()=>{try{return parseInt(localStorage.getItem("riki_goal"))||0}catch{return 0}});
  useEffect(()=>{try{localStorage.setItem("riki_goal",goal)}catch{}},[goal]);
  const [onboarded,setOnboarded]=useState(()=>{try{return localStorage.getItem("riki_onboarded")==="1"}catch{return false}});
  const [theme,setTheme]=useState(()=>{const t=localStorage.getItem("riki_theme")||"dark";applyTheme(t);return t;});
  useMemo(()=>{applyTheme(theme);try{localStorage.setItem("riki_theme",theme)}catch{}},[theme]);
  const toggleTheme=()=>setTheme(t=>t==="dark"?"light":"dark");
  const contentRef=useRef(null);
  const [slideDir,setSlideDir]=useState(0);
  const [animating,setAnimating]=useState(false);
  const prevTab=useRef(0);

  const touchStart=useRef(null);
  const touchStartY=useRef(null);
  const handleTouchStart=(e)=>{touchStart.current=e.touches[0].clientX;touchStartY.current=e.touches[0].clientY;};
  const handleTouchEnd=(e)=>{
    if(!touchStart.current||ov) return;
    const diffX=touchStart.current-e.changedTouches[0].clientX;
    const diffY=touchStartY.current-e.changedTouches[0].clientY;
    if(Math.abs(diffX)>150&&Math.abs(diffX)>Math.abs(diffY)*2.5){
      if(diffX>0&&tab<4) changeTab(tab+1);
      else if(diffX<0&&tab>0) changeTab(tab-1);
    }
    touchStart.current=null;touchStartY.current=null;
  };

  const changeTab=(i)=>{
    if(i===tab)return;
    setSlideDir(i>prevTab.current?1:-1);setAnimating(true);
    setOv(null);setTab(i);prevTab.current=i;
    setTimeout(()=>setAnimating(false),300);
  };

  const startP=(p)=>{setSIds([...p.ids]);changeTab(2);setSOn(true);setSStep("setup");};
  const copySe=(se)=>{
    const ids=se.exos.map(ex=>{const f=exos.find(e=>e.n===ex.n);return f?f.id:null;}).filter(Boolean);
    setSIds(ids);changeTab(2);setSOn(true);setSStep("setup");setOv(null);
  };
  const endSe=()=>{
    const res=sIds.map(id=>{const ex=exos.find(e=>e.id===id);const ss=allS[id]||[];if(ss.length===0)return null;
      const maxW=Math.max(...ss.map(s=>s.w));if(maxW>(ex.pr||0)&&ex.prType==="weight")setExos(prev=>prev.map(e=>e.id===id?{...e,pr:maxW}:e));
      return{n:ex.n,g:ex.g,sets:ss.map(x=>({p:x.w,r:x.r}))};}).filter(Boolean);
    const localDate=`${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,"0")}-${String(new Date().getDate()).padStart(2,"0")}`;
    if(res.length>0)setHist(h=>[{id:Date.now(),date:localDate,dur:Math.floor(Math.random()*30)+35,notes:"",exos:res},...h]);
    setSOn(false);setSStep("setup");setSIds([]);setAllS({});setCE(0);setCSI(0);changeTab(0);
  };

  const navItems=[{k:"home",l:"Accueil",i:"home"},{k:"exos",l:"Exercices",i:"dumbbell"},{k:"se",l:"Séance",i:"bolt"},{k:"hist",l:"Historique",i:"history"},{k:"stats",l:"Stats",i:"stats"}];

  // Parse "YYYY-MM-DD" as local date (not UTC)
  const parseLocal=(s)=>{const p=s.split("-");return new Date(+p[0],p[1]-1,+p[2]);};

  const now=new Date();
  const monday=new Date(now);monday.setDate(now.getDate()-(now.getDay()+6)%7);monday.setHours(0,0,0,0);
  const workoutDays=new Set();
  hist.forEach(h=>{const d=parseLocal(h.date);if(d>=monday&&d<=now)workoutDays.add(d.getDay());});

  // Duolingo-style streak: count consecutive past weeks where workout days >= goal
  const streak=useMemo(()=>{
    if(!goal||goal<=0||hist.length===0) return 0;
    let count=0;
    const checkDate=new Date(monday);
    checkDate.setDate(checkDate.getDate()-1);
    while(true){
      const weekEnd=new Date(checkDate);
      const weekStart=new Date(weekEnd);
      weekStart.setDate(weekEnd.getDate()-(weekEnd.getDay()+6)%7);
      weekStart.setHours(0,0,0,0);
      weekEnd.setHours(23,59,59,999);
      const days=new Set();
      hist.forEach(h=>{
        const d=parseLocal(h.date);
        if(d>=weekStart&&d<=weekEnd) days.add(d.getDay());
      });
      if(days.size>=goal) count++;
      else break;
      checkDate.setDate(weekStart.getDate()-1);
    }
    return count;
  },[hist,goal,monday.getTime()]);

  return (
    <div style={{width:"100%",height:"100dvh",background:C.bg,overflow:"hidden",fontFamily:"'Outfit',sans-serif",position:"relative",margin:"0 auto",display:"flex",flexDirection:"column"}}
      onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>

      {!onboarded&&(<Onboarding onDone={(g)=>{setGoal(g);setOnboarded(true);try{localStorage.setItem("riki_goal",g);localStorage.setItem("riki_onboarded","1")}catch{}}}/>)}

      {onboarded&&<><div style={{height:"env(safe-area-inset-top,0px)",flexShrink:0,background:C.bg}}/>
      <div ref={contentRef} style={{flex:1,overflow:"auto",position:"relative",background:theme==="dark"?"radial-gradient(ellipse at 50% 0%, rgba(190,255,108,0.03) 0%, transparent 50%)":"radial-gradient(ellipse at 50% 0%, rgba(76,175,0,0.02) 0%, transparent 50%)"}}>
        {ov&&(<div key={ov.t+(ov.d?.id||"")} ref={el=>{if(el)el.scrollTop=0;}} style={{position:"absolute",inset:0,background:C.bg,zIndex:100,overflow:"auto",animation:"fadeInUp 0.25s ease"}}>
          {ov.t==="exD"&&(<ExoDetail exo={ov.d} onBack={()=>setOv(null)} exos={exos} setExos={setExos} presets={presets} setPresets={setPresets}/>)}
          {ov.t==="hD"&&(<HistDetail se={ov.d} onBack={()=>setOv(null)} onCopy={()=>copySe(ov.d)}/>)}
          {ov.t==="nE"&&(<NewExo exos={exos} setExos={setExos} onBack={()=>setOv(null)}/>)}
          {ov.t==="nP"&&(<NewPreset exos={exos} presets={presets} setPresets={setPresets} onBack={()=>setOv(null)}/>)}
        </div>)}
        <div key={tab} style={{animation:animating?(slideDir>0?"slideInRight":"slideInLeft")+" 0.3s ease":"none"}}>
        {tab===0&&(<Dash onStart={()=>{changeTab(2);setSOn(true);}} sOn={sOn} presets={presets} setPresets={setPresets} onP={startP} streak={streak} goal={goal} setGoal={setGoal} workoutDays={workoutDays} exos={exos} hist={hist} theme={theme} toggleTheme={toggleTheme} planned={planned} setPlanned={setPlanned} onSlotSel={ex=>{setSIds(p=>[...new Set([...p,ex.id])]);changeTab(2);setSOn(true);setSStep("setup");}}/>)}
        {tab===1&&(<ExoList exos={exos} onD={e=>setOv({t:"exD",d:e})} onNew={()=>setOv({t:"nE"})}/>)}
        {tab===2&&(<SePage sOn={sOn} exos={exos} setExos={setExos} sIds={sIds} setSIds={setSIds} step={sStep} setStep={setSStep} rest={rest} setRest={setRest} mode={mode} setMode={setMode} tR={tR} setTR={setTR} tS={tS} setTS={setTS} cE={cE} setCE={setCE} cSI={cSI} setCSI={setCSI} allS={allS} setAllS={setAllS} onEnd={endSe} onCan={()=>{setSOn(false);setSStep("setup");setSIds([]);changeTab(0);}} onNP={()=>setOv({t:"nP"})}/>)}
        {tab===3&&(<HistPage hist={hist} exos={exos} onD={s=>setOv({t:"hD",d:s})} planned={planned} setPlanned={setPlanned} presets={presets} onStartPlanned={p=>{const pr=presets.find(x=>x.id===p.presetId);if(pr)startP(pr);}}/>)}
        {tab===4&&(<StatsPage exos={exos} hist={hist}/>)}
        </div>
      </div>

      <div style={{height:84,background:C.navBg,backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",display:"flex",borderTop:"1px solid "+C.navBorder,flexShrink:0,paddingBottom:"max(20px, env(safe-area-inset-bottom, 0px))",paddingTop:8}}>
        {navItems.map((nd,i)=>(<button key={nd.k} onClick={()=>changeTab(i)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,background:"none",border:"none",cursor:"pointer",position:"relative",fontFamily:"'Outfit',sans-serif"}}>
          {tab===i&&(<div style={{position:"absolute",top:-8,width:24,height:3,background:C.gr,borderRadius:2,boxShadow:"0 0 8px rgba(190,255,108,0.3)"}}/>)}
          <NI name={nd.i} active={tab===i}/>
          <span style={{fontSize:10,color:tab===i?C.gr:C.ts,fontWeight:tab===i?700:400,letterSpacing:"0.3px"}}>{nd.l}</span>
        </button>))}
      </div></>}
    </div>
  );
}
