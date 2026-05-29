import React, { useState } from "react";
import { C, GRP_ICON, fmtD, volS, volE, nS, CARD, CARD_SOLID } from "../constants.js";
import { ExoSvg, NI, Tag } from "./Icons.jsx";

export default function HistPage({hist,setHist,exos,onD,planned,setPlanned,presets,onStartPlanned}) {
  const [vm,setVm]=useState("list");
  const [mo,setMo]=useState(()=>{const d=new Date();return{y:d.getFullYear(),m:d.getMonth()};});
  const [planDay,setPlanDay]=useState(null);
  const mN=["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
  const dim=new Date(mo.y,mo.m+1,0).getDate();const fd=(new Date(mo.y,mo.m,1).getDay()+6)%7;
  const ds=d=>mo.y+"-"+String(mo.m+1).padStart(2,"0")+"-"+String(d).padStart(2,"0");
  const has=d=>hist.some(h=>h.date===ds(d));const getH=d=>hist.find(h=>h.date===ds(d));
  const hasPlan=d=>planned.some(p=>p.date===ds(d));
  const tn=new Date();const today=tn.getFullYear()+"-"+String(tn.getMonth()+1).padStart(2,"0")+"-"+String(tn.getDate()).padStart(2,"0");
  const isFuture=d=>ds(d)>today;
  const allHist=(vm==="list"?hist:hist.filter(h=>{const d=new Date(h.date);return d.getFullYear()===mo.y&&d.getMonth()===mo.m;})).slice().sort((a,b)=>b.date.localeCompare(a.date));

  return (
    <div style={{padding:"14px 16px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <h1 style={{color:C.t,fontSize:26,fontWeight:800,margin:0,fontFamily:C.display,letterSpacing:"-0.5px"}}>Historique</h1>
        <div style={{display:"flex",background:C.c1,borderRadius:10,overflow:"hidden",border:"1px solid "+C.c2}}>
          <button onClick={()=>setVm("list")} style={{padding:"6px 12px",border:"none",background:vm==="list"?"rgba(190,255,108,0.1)":"transparent",color:vm==="list"?C.gr:C.ts,fontSize:11,cursor:"pointer",fontWeight:600,fontFamily:C.body}}>Liste</button>
          <button onClick={()=>setVm("cal")} style={{padding:"6px 12px",border:"none",background:vm==="cal"?"rgba(190,255,108,0.1)":"transparent",color:vm==="cal"?C.gr:C.ts,fontSize:11,cursor:"pointer",fontWeight:600,fontFamily:C.body}}>Calendrier</button>
        </div>
      </div>
      {vm==="cal"&&(<div style={{marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <button onClick={()=>setMo(m=>m.m===0?{y:m.y-1,m:11}:{y:m.y,m:m.m-1})} style={{background:"none",border:"none",color:C.gr,fontSize:20,cursor:"pointer",padding:"4px 8px"}}>‹</button>
          <span style={{color:C.t,fontWeight:700,fontSize:15,fontFamily:C.display}}>{mN[mo.m]} {mo.y}</span>
          <button onClick={()=>setMo(m=>m.m===11?{y:m.y+1,m:0}:{y:m.y,m:m.m+1})} style={{background:"none",border:"none",color:C.gr,fontSize:20,cursor:"pointer",padding:"4px 8px"}}>›</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}}>
          {["L","M","M","J","V","S","D"].map((d,i)=>(<div key={i} style={{textAlign:"center",color:C.ts,fontSize:10,fontWeight:600,padding:5,letterSpacing:"0.5px"}}>{d}</div>))}
          {Array(fd).fill(null).map((_,i)=>(<div key={"b"+i}/>))}
          {Array.from({length:dim},(_,i)=>i+1).map(d=>{const h=has(d);const td=today===ds(d);const pl=hasPlan(d);const fut=isFuture(d);
            const past=!fut&&!td&&!h;
            return (<div key={d} onClick={()=>{if(h)onD(getH(d));else if(fut||td)setPlanDay(planDay===d?null:d);else if(past)setPlanDay(planDay===d?null:d);}} style={{textAlign:"center",padding:"9px 0",borderRadius:10,cursor:"pointer",background:h?"rgba(190,255,108,0.08)":pl?"rgba(190,255,108,0.03)":td?C.c1:"transparent",border:td?"1px solid rgba(190,255,108,0.2)":planDay===d?"1px solid "+C.gr:pl?"1px dashed rgba(190,255,108,0.2)":"1px solid transparent",transition:"all 0.15s ease"}}>
              <span style={{color:h?C.gr:pl?C.gd:td?C.t:C.ts,fontSize:13,fontWeight:(h||pl)?700:400,fontVariantNumeric:"tabular-nums"}}>{d}</span>
              {h&&(<div style={{width:4,height:4,borderRadius:2,background:C.gr,margin:"3px auto 0",boxShadow:"0 0 4px rgba(190,255,108,0.3)"}}/>)}
              {pl&&!h&&(<div style={{width:4,height:4,borderRadius:2,background:C.gd,margin:"3px auto 0",opacity:0.6}}/>)}
            </div>);
          })}
        </div>
        {planDay&&(<div style={{...CARD_SOLID,padding:14,marginTop:12,animation:"fadeInUp 0.2s ease"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <span style={{color:C.t,fontWeight:600,fontSize:13,fontFamily:C.display}}>{isFuture(planDay)||today===ds(planDay)?"Programmer":"Enregistrer"} le {planDay}/{mo.m+1}</span>
            {hasPlan(planDay)&&(<button onClick={()=>{setPlanned(p=>p.filter(x=>x.date!==ds(planDay)));setPlanDay(null);}} style={{background:"none",border:"none",color:C.rd,fontSize:12,cursor:"pointer",fontFamily:C.body}}>Supprimer</button>)}
          </div>
          {(isFuture(planDay)||today===ds(planDay))?(<div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
            {presets.map(p=>(<button key={p.id} onClick={()=>{
              const dateStr=ds(planDay);
              setPlanned(prev=>{const filtered=prev.filter(x=>x.date!==dateStr);return[...filtered,{date:dateStr,preset:p.nom,presetId:p.id}];});
              setPlanDay(null);
            }} style={{padding:"9px 16px",borderRadius:12,border:"1px solid "+C.c2,background:C.c2,color:C.t,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:C.body}}>{p.nom}</button>))}
            <button onClick={()=>{
              const dateStr=ds(planDay);
              setPlanned(prev=>{const filtered=prev.filter(x=>x.date!==dateStr);return[...filtered,{date:dateStr,preset:"Libre",presetId:null}];});
              setPlanDay(null);
            }} style={{padding:"9px 16px",borderRadius:12,border:"1px dashed "+C.gr,background:"transparent",color:C.gr,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:C.body}}>Séance libre</button>
          </div>):(<div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
            {presets.map(p=>(<button key={p.id} onClick={()=>{
              const dateStr=ds(planDay);
              const res=p.ids.map(id=>{const ex=exos.find(e=>e.id===id);if(!ex)return null;return{n:ex.n,g:ex.g,sets:[]};}).filter(Boolean);
              setHist(h=>[{id:Date.now(),date:dateStr,dur:0,notes:"",exos:res},...h]);
              setPlanDay(null);
            }} style={{padding:"9px 16px",borderRadius:12,border:"1px solid "+C.c2,background:C.c2,color:C.t,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:C.body}}>{p.nom}</button>))}
            <button onClick={()=>{
              const dateStr=ds(planDay);
              setHist(h=>[{id:Date.now(),date:dateStr,dur:0,notes:"Séance enregistrée",exos:[]},...h]);
              setPlanDay(null);
            }} style={{padding:"9px 16px",borderRadius:12,border:"1px dashed "+C.gr,background:"transparent",color:C.gr,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:C.body}}>Séance libre</button>
          </div>)}
        </div>)}
      </div>)}
      {planned.filter(p=>p.date>=today).sort((a,b)=>a.date.localeCompare(b.date)).map(p=>(<div key={p.date} onClick={()=>{if(p.presetId)onStartPlanned(p);}} style={{...CARD,padding:"12px 14px",marginBottom:7,display:"flex",alignItems:"center",gap:12,cursor:"pointer",border:"1px dashed rgba(190,255,108,0.15)"}}>
        <div style={{width:42,height:42,borderRadius:13,background:"rgba(138,255,0,0.06)",display:"flex",alignItems:"center",justifyContent:"center"}}><NI name="bolt" active={true}/></div>
        <div style={{flex:1}}><div style={{color:C.gd,fontWeight:600,fontSize:13,textTransform:"capitalize"}}>{fmtD(p.date)}</div><div style={{color:C.ts,fontSize:11,marginTop:1}}>{p.preset}</div></div>
        <span style={{color:C.gd,fontSize:10,fontWeight:600,background:"rgba(138,255,0,0.08)",padding:"4px 10px",borderRadius:8}}>Programmé</span>
      </div>))}
      {allHist.map((s,idx)=>{const vol=volE(s.exos);const ns=nS(s.exos);
        return (<div key={s.id} onClick={()=>onD(s)} style={{...CARD,padding:"12px 14px",marginBottom:7,display:"flex",alignItems:"center",gap:12,cursor:"pointer",animation:"stagger1 0.3s ease both",animationDelay:(idx%8)*30+"ms"}}>
          <div style={{width:42,height:42,borderRadius:13,background:"rgba(190,255,108,0.06)",display:"flex",alignItems:"center",justifyContent:"center"}}><ExoSvg type={GRP_ICON[s.exos[0]?.g]||"generic"} size={22}/></div>
          <div style={{flex:1}}><div style={{color:C.t,fontWeight:600,fontSize:13,textTransform:"capitalize"}}>{fmtD(s.date)}</div><div style={{color:C.ts,fontSize:11,marginTop:1}}>{s.dur}min · {s.exos.length} exo · {ns} séries</div></div>
          <div style={{textAlign:"right"}}><div style={{color:C.gr,fontSize:14,fontWeight:800,fontFamily:C.display,fontVariantNumeric:"tabular-nums"}}>{(vol/1000).toFixed(1)}k</div><div style={{color:C.ts,fontSize:9}}>kg</div></div>
        </div>);
      })}
      {allHist.length===0&&planned.filter(p=>p.date>=today).length===0&&(<div style={{textAlign:"center",padding:"40px 0"}}><span style={{color:C.ts,fontSize:13}}>Aucune séance pour le moment</span></div>)}
    </div>
  );
}

export function HistDetail({se,onBack,onCopy}) {
  const tv=volE(se.exos);const ts=nS(se.exos);
  return (
    <div style={{padding:18}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:C.gr,fontSize:13,cursor:"pointer",fontFamily:C.body,fontWeight:500}}>← Retour</button>
        <button onClick={onCopy} style={{background:"rgba(190,255,108,0.1)",border:"1px solid rgba(190,255,108,0.15)",color:C.gr,borderRadius:10,padding:"6px 12px",fontSize:12,cursor:"pointer",fontWeight:600,fontFamily:C.body}}>Copier</button>
      </div>
      <h2 style={{color:C.t,fontSize:20,fontWeight:800,margin:"0 0 6px",textTransform:"capitalize",fontFamily:C.display}}>{fmtD(se.date)}</h2>
      <div style={{display:"flex",gap:7,marginBottom:16,marginTop:10}}><Tag i="⏱️" t={se.dur+" min"}/><Tag i="🏋️" t={ts+" séries"}/><Tag i="📊" t={tv.toFixed(0)+" kg"}/></div>
      {se.notes&&(<div style={{...CARD_SOLID,padding:12,marginBottom:12}}><p style={{color:C.t,fontSize:13,margin:0}}>📝 {se.notes}</p></div>)}
      {se.exos.map((exo,i)=>{const ev=volS(exo.sets);
        return (<div key={i} style={{...CARD_SOLID,padding:12,marginBottom:7}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}><ExoSvg type={GRP_ICON[exo.g]||"generic"} size={20}/><span style={{color:C.t,fontWeight:600,fontSize:14}}>{exo.n}</span></div>
            <span style={{color:C.gr,fontSize:12,fontWeight:700,fontVariantNumeric:"tabular-nums"}}>{ev.toFixed(0)} kg</span>
          </div>
          {exo.sets.map((st,j)=>(<div key={j} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",fontSize:13}}><span style={{color:C.ts,width:22,fontFamily:C.display,fontWeight:600}}>{j+1}.</span><span style={{flex:1,color:C.t}}>{st.p}kg × {st.r}</span><span style={{color:C.ts,fontVariantNumeric:"tabular-nums"}}>{(st.p*st.r).toFixed(0)}</span></div>))}
        </div>);
      })}
    </div>
  );
}
