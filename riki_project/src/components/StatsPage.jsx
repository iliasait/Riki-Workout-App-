import React, { useState } from "react";
import { C, GROUPS, GRP_ICON, volS, exoVol, sessionVol, prFmt, CARD, CARD_SOLID } from "../constants.js";
import { ExoSvg, Chip } from "./Icons.jsx";

export default function StatsPage({exos,hist,bw=0}) {
  const [prTab,setPrTab]=useState("all");const [showAllPR,setShowAllPR]=useState(false);

  const dl=["L","M","M","J","V","S","D"];
  const dayMap=[1,2,3,4,5,6,0];
  const now=new Date();const mon=new Date(now);mon.setDate(now.getDate()-(now.getDay()+6)%7);mon.setHours(0,0,0,0);
  const data=dayMap.map(jsDay=>{
    return hist.filter(h=>{const d=new Date(h.date);return d>=mon&&d.getDay()===jsDay;}).reduce((a,s)=>a+sessionVol(s,bw),0);
  });
  const mx=Math.max(...data,1);

  const gd=GROUPS.filter(g=>g!=="Cardio").map(g=>{const v=hist.reduce((a,s)=>a+s.exos.filter(e=>e.g===g).reduce((b,e)=>b+exoVol(e,bw),0),0);return{g,v};}).filter(d=>d.v>0).sort((a,b)=>b.v-a.v);
  const mg=gd.length>0?Math.max(...gd.map(d=>d.v)):1;const totalV=gd.reduce((a,d)=>a+d.v,0);
  const prList=exos.filter(e=>e.pr>0&&(prTab==="all"||e.g===prTab)).sort((a,b)=>b.pr-a.pr);

  const recentHist=[...hist].sort((a,b)=>a.date.localeCompare(b.date)).slice(-12);
  const evoData=recentHist.map(s=>sessionVol(s,bw));
  const evoMin=evoData.length>0?Math.min(...evoData):0;
  const evoMax=evoData.length>0?Math.max(...evoData):1;
  const evoRange=evoMax-evoMin||1;
  const co=evoData.map((v,i)=>({x:evoData.length>1?(i/(evoData.length-1))*280+10:150,y:100-((v-evoMin)/evoRange)*85}));
  const hasEvo=evoData.length>=2;
  const area=hasEvo?"M"+co[0].x+",100 "+co.map(c=>"L"+c.x+","+c.y).join(" ")+" L"+co[co.length-1].x+",100 Z":"";
  const line=hasEvo?co.map(c=>c.x+","+c.y).join(" "):"";

  return (
    <div style={{padding:"14px 16px"}}>
      <h1 style={{color:C.t,fontSize:26,fontWeight:800,margin:"0 0 16px",fontFamily:C.display,letterSpacing:"-0.5px"}}>Statistiques</h1>

      {/* Stat cards — asymmetric grid */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
        {[{v:hist.length,l:"SÉANCES",big:false},{v:(totalV/1000).toFixed(1)+"k",l:"VOLUME",c:C.gr,big:true},{v:Math.round(hist.reduce((a,s)=>a+s.dur,0)/(hist.length||1)),l:"MIN MOY.",sub:"min"},{v:exos.filter(e=>e.pr>0).length,l:"RECORDS",c:C.gr}].map((d,i)=>(
          <div key={i} style={{...CARD,padding:d.big?"18px 14px":"14px 12px",position:"relative",overflow:"hidden"}}>
            {d.c&&<div style={{position:"absolute",top:-10,right:-10,width:40,height:40,borderRadius:"50%",background:"radial-gradient(circle, rgba(190,255,108,0.1) 0%, transparent 70%)",pointerEvents:"none"}}/>}
            <div style={{color:C.ts,fontSize:10,fontWeight:600,letterSpacing:"1px",marginBottom:6}}>{d.l}</div>
            <div style={{color:d.c||C.t,fontSize:d.big?28:22,fontWeight:800,fontFamily:C.display,fontVariantNumeric:"tabular-nums",lineHeight:1}}>{d.v}{d.sub&&<span style={{color:C.ts,fontSize:11,fontWeight:400,marginLeft:2}}>{d.sub}</span>}</div>
          </div>
        ))}
      </div>

      {/* Volume quotidien */}
      <h3 style={{color:C.t,fontSize:14,fontWeight:700,marginBottom:10,fontFamily:C.display}}>Volume quotidien</h3>
      <div style={{display:"flex",alignItems:"flex-end",gap:6,height:100,...CARD,padding:"14px 10px 10px",marginBottom:16}}>
        {data.map((v,i)=>(<div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
          {v>0?<span style={{color:C.ts,fontSize:8,fontVariantNumeric:"tabular-nums"}}>{v>=1000?(v/1000).toFixed(1)+"k":v}</span>:<span style={{color:C.c3,fontSize:8}}>—</span>}
          <div style={{width:"100%",height:v>0?Math.max(5,(v/mx)*65)+"px":"4px",borderRadius:"6px 6px 2px 2px",background:v>0?"linear-gradient(180deg,"+C.gr+","+C.gd+")":C.c2,opacity:v>0?(0.5+(v/mx)*0.5):0.2,boxShadow:v>0?"0 0 8px rgba(190,255,108,0.1)":"none",transition:"height 0.4s ease"}}/>
          <span style={{color:C.ts,fontSize:9,fontWeight:600}}>{dl[i]}</span>
        </div>))}
      </div>

      {/* Répartition */}
      <h3 style={{color:C.t,fontSize:14,fontWeight:700,marginBottom:10,fontFamily:C.display}}>Répartition par groupe</h3>
      <div style={{...CARD_SOLID,padding:14,marginBottom:16}}>
        {gd.length===0&&<p style={{color:C.ts,fontSize:12,textAlign:"center",margin:"8px 0"}}>Pas encore de données</p>}
        {gd.map(d=>(<div key={d.g} style={{marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><div style={{display:"flex",alignItems:"center",gap:7}}><ExoSvg type={GRP_ICON[d.g]} size={16}/><span style={{color:C.t,fontSize:12,fontWeight:500}}>{d.g}</span></div><span style={{color:C.ts,fontSize:11,fontVariantNumeric:"tabular-nums"}}>{(d.v/1000).toFixed(1)}k · {(d.v/totalV*100).toFixed(0)}%</span></div><div style={{height:6,background:C.c2,borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:(d.v/mg)*100+"%",borderRadius:4,background:"linear-gradient(90deg,"+C.gr+","+C.gd+")",boxShadow:"0 0 8px rgba(190,255,108,0.15)",transition:"width 0.5s ease"}}/></div></div>))}
      </div>

      {/* Records */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><h3 style={{color:C.t,fontSize:14,fontWeight:700,margin:0,fontFamily:C.display}}>Records</h3></div>
      <div style={{display:"flex",gap:5,overflowX:"auto",marginBottom:10}}><Chip l="Tous" a={prTab==="all"} o={()=>setPrTab("all")}/>{GROUPS.slice(0,6).map(g=>(<Chip key={g} l={g} a={prTab===g} o={()=>setPrTab(prTab===g?"all":g)}/>))}</div>
      <div style={{...CARD_SOLID,padding:12,marginBottom:16}}>
        {prList.length===0&&(<p style={{color:C.ts,fontSize:12,textAlign:"center",margin:"10px 0"}}>Aucun PR</p>)}
        {(showAllPR?prList:prList.slice(0,5)).map((ex,i)=>(<div key={ex.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<prList.length-1?"1px solid "+C.c2:"none"}}>
          <span style={{color:i<3?C.gr:C.ts,fontWeight:800,fontSize:14,width:24,textAlign:"center",fontFamily:C.display}}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":(i+1)+"."}</span>
          <ExoSvg type={GRP_ICON[ex.g]} size={18} color={i<3?C.gr:C.ts}/>
          <div style={{flex:1}}><div style={{color:C.t,fontSize:13,fontWeight:500}}>{ex.n}</div><div style={{color:C.ts,fontSize:10,marginTop:1}}>{ex.g}</div></div>
          <span style={{color:C.gr,fontSize:15,fontWeight:800,fontFamily:C.display,fontVariantNumeric:"tabular-nums"}}>{prFmt(ex)}</span>
        </div>))}
        {!showAllPR&&prList.length>5&&(<button onClick={()=>setShowAllPR(true)} style={{width:"100%",padding:"10px",borderRadius:10,border:"1px solid "+C.gr,background:"transparent",color:C.gr,fontWeight:600,fontSize:12,cursor:"pointer",fontFamily:C.body,marginTop:8,letterSpacing:"0.3px"}}>Voir + ({prList.length-5} PR)</button>)}
      </div>

      {/* Evolution curve */}
      <h3 style={{color:C.t,fontSize:14,fontWeight:700,marginBottom:10,fontFamily:C.display}}>Évolution du volume</h3>
      <div style={{...CARD,padding:14}}>
        {hasEvo?(<svg viewBox="0 0 300 110" style={{width:"100%",height:110}}>
          <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.gr} stopOpacity="0.2"/><stop offset="100%" stopColor={C.gr} stopOpacity="0"/></linearGradient></defs>
          <path d={area} fill="url(#ag)"/><polyline points={line} fill="none" stroke={C.gr} strokeWidth="2.5" strokeLinejoin="round" style={{filter:"drop-shadow(0 0 4px rgba(190,255,108,0.3))"}}/>
          {co.map((c,i)=>(<circle key={i} cx={c.x} cy={c.y} r="4.5" fill={C.gr} stroke={C.bg} strokeWidth="2.5"/>))}
        </svg>):(<div style={{textAlign:"center",padding:"24px 0"}}><span style={{color:C.ts,fontSize:13}}>Fais au moins 2 séances pour voir ta courbe</span></div>)}
      </div>
    </div>
  );
}
