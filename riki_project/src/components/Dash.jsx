import React, { useState } from "react";
import { C, LOGO, CARD, CARD_SOLID } from "../constants.js";
import { GRP_ICON } from "../constants.js";
import { ExoSvg, FlameIcon, SlotIcon, NI } from "./Icons.jsx";
import SlotM from "./SlotMachine.jsx";

export default function Dash({onStart,sOn,presets,setPresets,onP,streak,goal,setGoal,workoutDays,exos,onSlotSel,hist,theme,toggleTheme,planned,setPlanned}) {
  const [showGoal,setShowGoal]=useState(false);
  const [showSlot,setShowSlot]=useState(false);
  const parseLocal=(s)=>{const p=s.split("-");return new Date(+p[0],p[1]-1,+p[2]);};
  const weekDone=workoutDays.size;
  const streakOk=weekDone>=goal;
  const now=new Date();const mon=new Date(now);mon.setDate(now.getDate()-(now.getDay()+6)%7);mon.setHours(0,0,0,0);
  const weekHist=hist.filter(h=>parseLocal(h.date)>=mon);
  const weekVol=weekHist.reduce((a,s)=>a+s.exos.reduce((b,e)=>b+e.sets.reduce((c,st)=>c+st.p*st.r,0),0),0);
  const weekDur=weekHist.length>0?Math.round(weekHist.reduce((a,s)=>a+s.dur,0)/weekHist.length):0;
  const weekPR=0;
  const dayMap=[1,2,3,4,5,6,0];
  const today=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
  const upcoming=(planned||[]).filter(p=>p.date>=today).sort((a,b)=>a.date.localeCompare(b.date));
  // Build set of planned day-of-week for this week
  const plannedDays=new Set();
  const sun=new Date(mon);sun.setDate(mon.getDate()+6);sun.setHours(23,59,59,999);
  (planned||[]).forEach(p=>{const d=parseLocal(p.date);if(d>=mon&&d<=sun)plannedDays.add(d.getDay());});

  const fmtDateShort=(s)=>{const d=parseLocal(s);return d.toLocaleDateString("fr-FR",{weekday:"short",day:"numeric",month:"short"});};

  return (
    <div style={{padding:"0 0 24px"}}>
      {/* Header with gradient mesh */}
      <div style={{padding:"16px 20px 20px",background:theme==="dark"?"radial-gradient(ellipse at 30% 0%, rgba(190,255,108,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(138,255,0,0.03) 0%, transparent 50%)":"radial-gradient(ellipse at 30% 0%, rgba(76,175,0,0.04) 0%, transparent 60%)"}}>
        {/* Logo centered */}
        <div style={{display:"flex",justifyContent:"center",marginBottom:12}}>
          <img src={LOGO} alt="RIKI" style={{height:44,objectFit:"contain"}}/>
        </div>
        {/* Streak + theme toggle row */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
          <div onClick={()=>setShowGoal(!showGoal)} style={{background:C.glass,borderRadius:14,padding:"6px 14px",display:"flex",alignItems:"center",gap:8,border:"1px solid "+C.glassBorder,cursor:"pointer",backdropFilter:"blur(8px)",WebkitBackdropFilter:"blur(8px)"}}>
            <FlameIcon size={16}/><div><div style={{color:C.gr,fontSize:16,fontWeight:800,lineHeight:1,fontVariantNumeric:"tabular-nums"}}>{streak}</div><div style={{color:C.ts,fontSize:8,fontWeight:500,letterSpacing:"0.5px"}}>SEM.</div></div>
          </div>
          <button onClick={toggleTheme} style={{width:40,height:40,borderRadius:20,border:"1px solid "+C.glassBorder,background:C.glass,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(8px)",WebkitBackdropFilter:"blur(8px)"}}>
            {theme==="dark"?(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.gr} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>):(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.gr} strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>)}
          </button>
        </div>
        {showGoal&&(<div style={{marginBottom:14,...CARD_SOLID,padding:14,animation:"fadeInUp 0.2s ease"}}>
          <div style={{color:C.t,fontSize:13,fontWeight:600,marginBottom:10,fontFamily:C.display}}>Objectif hebdomadaire</div>
          <div style={{display:"flex",gap:6}}>{[2,3,4,5,6,7].map(n=>(<button key={n} onClick={(e)=>{e.stopPropagation();setGoal(n);setShowGoal(false);}} style={{flex:1,padding:"11px 0",borderRadius:12,border:"none",cursor:"pointer",fontFamily:C.display,background:goal===n?C.gr:C.c2,color:goal===n?C.bg:C.ts,fontWeight:700,fontSize:15}}>{n}</button>))}</div>
        </div>)}
      </div>

      <div style={{padding:"0 18px"}}>
        {/* Main weekly card */}
        <div style={{...CARD,padding:18,marginBottom:14,position:"relative",overflow:"hidden"}}>
          {/* Subtle glow behind ring */}
          <div style={{position:"absolute",top:-20,left:-20,width:120,height:120,borderRadius:"50%",background:"radial-gradient(circle, rgba(190,255,108,0.08) 0%, transparent 70%)",pointerEvents:"none"}}/>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,position:"relative"}}>
            <span style={{color:C.t,fontWeight:700,fontSize:15,fontFamily:C.display,letterSpacing:"-0.3px"}}>Cette semaine</span>
            {streakOk&&(<span style={{color:C.gr,fontSize:11,fontWeight:600,background:"rgba(190,255,108,0.1)",padding:"4px 10px",borderRadius:8}}>Objectif atteint</span>)}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:18,position:"relative"}}>
            <div style={{position:"relative",width:76,height:76,flexShrink:0}}>
              <svg viewBox="0 0 76 76" style={{width:76,height:76,transform:"rotate(-90deg)",filter:"drop-shadow(0 0 8px rgba(190,255,108,0.15))"}}>
                <circle cx="38" cy="38" r="30" fill="none" stroke={C.c2} strokeWidth="5"/>
                <circle cx="38" cy="38" r="30" fill="none" stroke={C.gr} strokeWidth="5" strokeDasharray={2*Math.PI*30} strokeDashoffset={2*Math.PI*30*(1-Math.min(weekDone/goal,1))} strokeLinecap="round" style={{transition:"stroke-dashoffset 0.8s ease"}}/>
              </svg>
              <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}><span style={{color:C.gr,fontSize:22,fontWeight:800,lineHeight:1,fontFamily:C.display,fontVariantNumeric:"tabular-nums"}}>{weekDone}</span><span style={{color:C.ts,fontSize:9,fontWeight:500}}>/{goal}</span></div>
            </div>
            <div style={{flex:1,display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div><div style={{color:C.ts,fontSize:10,fontWeight:500,letterSpacing:"0.5px",textTransform:"uppercase",marginBottom:2}}>Volume</div><div style={{color:C.t,fontSize:18,fontWeight:800,fontFamily:C.display,fontVariantNumeric:"tabular-nums"}}>{weekVol>=1000?(weekVol/1000).toFixed(1)+"k":weekVol} <span style={{color:C.ts,fontSize:10,fontWeight:400}}>kg</span></div></div>
              <div><div style={{color:C.ts,fontSize:10,fontWeight:500,letterSpacing:"0.5px",textTransform:"uppercase",marginBottom:2}}>Séances</div><div style={{color:C.t,fontSize:18,fontWeight:800,fontFamily:C.display,fontVariantNumeric:"tabular-nums"}}>{weekDone}</div></div>
              <div><div style={{color:C.ts,fontSize:10,fontWeight:500,letterSpacing:"0.5px",textTransform:"uppercase",marginBottom:2}}>Durée moy.</div><div style={{color:C.t,fontSize:18,fontWeight:800,fontFamily:C.display,fontVariantNumeric:"tabular-nums"}}>{weekDur||"—"} <span style={{color:C.ts,fontSize:10,fontWeight:400}}>min</span></div></div>
              <div><div style={{color:C.ts,fontSize:10,fontWeight:500,letterSpacing:"0.5px",textTransform:"uppercase",marginBottom:2}}>Records</div><div style={{color:C.gr,fontSize:18,fontWeight:800,fontFamily:C.display}}>{weekPR} PR</div></div>
            </div>
          </div>
        </div>

        {/* Week dots */}
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:18,padding:"0 2px"}}>
          {["L","M","M","J","V","S","D"].map((d,i)=>{
            const jsDay=dayMap[i];
            const done=workoutDays.has(jsDay);
            const isPlanned=!done&&plannedDays.has(jsDay);
            const isToday=new Date().getDay()===jsDay;
            return (<div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
              <span style={{color:done?C.gr:isPlanned?C.t2:C.ts,fontSize:10,fontWeight:600,letterSpacing:"0.5px"}}>{d}</span>
              <div style={{width:34,height:34,borderRadius:17,display:"flex",alignItems:"center",justifyContent:"center",background:done?"rgba(190,255,108,0.12)":"transparent",border:isToday?"2px solid "+C.gr:done?"2px solid rgba(190,255,108,0.3)":isPlanned?"2px dashed "+C.t2:"2px solid "+C.c2,transition:"all 0.3s ease",boxShadow:done?"0 0 12px rgba(190,255,108,0.1)":"none"}}>
                {done&&(<div style={{width:10,height:10,borderRadius:5,background:C.gr,boxShadow:"0 0 6px rgba(190,255,108,0.4)"}}/>)}
                {isPlanned&&!done&&(<div style={{width:8,height:8,borderRadius:4,background:C.t2,opacity:0.5}}/>)}
                {!done&&!isPlanned&&isToday&&(<div style={{width:8,height:8,borderRadius:4,background:C.c3}}/>)}
              </div>
            </div>);
          })}
        </div>

        {/* Upcoming planned sessions */}
        {upcoming.length>0&&(<div style={{marginBottom:16}}>
          <span style={{color:C.ts,fontSize:11,fontWeight:600,letterSpacing:"0.5px",textTransform:"uppercase"}}>Programmées</span>
          <div style={{marginTop:10,display:"flex",flexDirection:"column",gap:8}}>
            {upcoming.slice(0,3).map(p=>{
              const pr=presets.find(x=>x.id===p.presetId);
              return (<div key={p.date} style={{...CARD,padding:"12px 14px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{color:C.gr,fontSize:14}}>📅</div>
                  <div>
                    <div style={{color:C.t,fontSize:13,fontWeight:600,fontFamily:C.display,textTransform:"capitalize"}}>{fmtDateShort(p.date)}</div>
                    <div style={{color:C.ts,fontSize:11}}>{pr?pr.nom:p.preset||"Séance"}</div>
                  </div>
                </div>
                <button onClick={(e)=>{e.stopPropagation();setPlanned(prev=>prev.filter(x=>x.date!==p.date));}} style={{background:"none",border:"none",cursor:"pointer",color:C.ts,fontSize:16,padding:"4px 8px"}}>✕</button>
              </div>);
            })}
          </div>
        </div>)}

        {/* Quick sessions */}
        {presets.length>0&&(<div style={{marginBottom:16}}>
          <span style={{color:C.ts,fontSize:11,fontWeight:600,letterSpacing:"0.5px",textTransform:"uppercase"}}>Séances rapides</span>
          <div style={{display:"flex",gap:10,marginTop:10,overflowX:"auto",paddingBottom:4}}>
            {presets.map(p=>(<div key={p.id} style={{position:"relative",flexShrink:0}}>
              <button onClick={()=>onP(p)} style={{padding:"14px 18px",borderRadius:16,...CARD,color:C.t,fontSize:13,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",fontFamily:C.body,textAlign:"left",minWidth:120}}>
                <div style={{color:C.gr,fontSize:16,marginBottom:6}}>⚡</div><div style={{fontFamily:C.display,fontWeight:700}}>{p.nom}</div><div style={{color:C.ts,fontSize:10,marginTop:3,fontWeight:400}}>{p.ids.length} exercices</div>
              </button>
              <button onClick={(e)=>{e.stopPropagation();if(confirm("Supprimer "+p.nom+" ?"))setPresets(prev=>prev.filter(x=>x.id!==p.id));}} style={{position:"absolute",top:6,right:6,width:20,height:20,borderRadius:10,background:"rgba(255,77,77,0.15)",border:"none",color:C.rd,fontSize:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1}}>✕</button>
            </div>))}
          </div>
        </div>)}

        {/* CTA buttons */}
        <div style={{display:"flex",gap:10}}>
          <button onClick={onStart} style={{flex:1,height:60,borderRadius:18,border:sOn?"2px solid "+C.gr:"none",cursor:"pointer",fontFamily:C.display,background:sOn?C.c1:C.gr,color:sOn?C.gr:C.bg,fontWeight:800,fontSize:17,boxShadow:sOn?"none":"0 0 40px rgba(190,255,108,0.15), 0 4px 20px rgba(190,255,108,0.1)",letterSpacing:"0.5px"}}>
            {sOn?"REPRENDRE":"COMMENCER"}
          </button>
          <button onClick={()=>setShowSlot(true)} style={{width:60,height:60,borderRadius:18,border:"1px solid "+C.glassBorder,cursor:"pointer",fontFamily:C.body,background:C.glass,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,backdropFilter:"blur(8px)",WebkitBackdropFilter:"blur(8px)"}}>
            <SlotIcon size={24}/>
          </button>
        </div>
      </div>
      {showSlot&&(<SlotM exos={exos} onClose={()=>setShowSlot(false)} onSel={ex=>{setShowSlot(false);onSlotSel(ex);}}/>)}
    </div>
  );
}
