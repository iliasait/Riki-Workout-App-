import React, { useState } from "react";
import { C, LOGO } from "../constants.js";
import { FlameIcon } from "./Icons.jsx";

export default function Onboarding({onDone}) {
  const [step,setStep]=useState(0);
  const [g,setG]=useState(null);
  const [w,setW]=useState("");
  if(step===0) return (
    <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 30%, rgba(190,255,108,0.06) 0%, "+C.bg+" 70%)",zIndex:999,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:30,animation:"fadeIn 0.6s ease"}}>
      <div style={{width:100,height:100,borderRadius:28,background:"rgba(190,255,108,0.06)",border:"1px solid rgba(190,255,108,0.12)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:28}}>
        <img src={LOGO} alt="RIKI" style={{height:60,objectFit:"contain"}}/>
      </div>
      <h1 style={{color:C.t,fontSize:32,fontWeight:800,margin:"0 0 8px",textAlign:"center",fontFamily:C.display,letterSpacing:"-0.5px"}}>RIKI</h1>
      <p style={{color:C.ts,fontSize:15,textAlign:"center",lineHeight:1.7,marginBottom:36,fontWeight:300,maxWidth:260}}>Ton coach de musculation personnel.<br/>Suis tes séances, bats tes records.</p>
      <button onClick={()=>setStep(1)} style={{width:"100%",height:58,borderRadius:18,border:"none",cursor:"pointer",fontFamily:C.display,background:C.gr,color:C.bg,fontWeight:800,fontSize:17,letterSpacing:"0.5px",boxShadow:"0 0 40px rgba(190,255,108,0.2), 0 4px 20px rgba(190,255,108,0.15)"}}>C'EST PARTI</button>
    </div>
  );
  return (
    <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 20%, rgba(190,255,108,0.05) 0%, "+C.bg+" 70%)",zIndex:999,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:30,animation:"fadeIn 0.4s ease"}}>
      <div style={{width:72,height:72,borderRadius:22,background:"rgba(190,255,108,0.08)",border:"1px solid rgba(190,255,108,0.15)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:24}}>
        <FlameIcon size={36}/>
      </div>
      <h2 style={{color:C.t,fontSize:26,fontWeight:800,margin:"0 0 6px",textAlign:"center",fontFamily:C.display,letterSpacing:"-0.5px"}}>Ton objectif</h2>
      <p style={{color:C.ts,fontSize:14,textAlign:"center",marginBottom:28,fontWeight:300}}>Combien de séances par semaine ?</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,width:"100%",marginBottom:20}}>
        {[2,3,4,5,6,7].map(n=>(<button key={n} onClick={()=>setG(n)} style={{padding:"20px 0",borderRadius:16,border:g===n?"2px solid "+C.gr:"2px solid "+C.c2,cursor:"pointer",fontFamily:C.display,background:g===n?"rgba(190,255,108,0.1)":C.c1,color:g===n?C.gr:C.ts,fontWeight:800,fontSize:22,transition:"all 0.2s ease"}}>{n}<div style={{fontSize:9,fontWeight:400,marginTop:3,fontFamily:C.body,letterSpacing:"0.5px",textTransform:"uppercase"}}>{n<=3?"tranquille":n<=5?"solide":"intense"}</div></button>))}
      </div>
      <div style={{width:"100%",marginBottom:28}}>
        <label style={{color:C.ts,fontSize:12,fontWeight:500,display:"block",marginBottom:6,textAlign:"center"}}>Ton poids de corps (optionnel)</label>
        <div style={{position:"relative",maxWidth:160,margin:"0 auto"}}>
          <input value={w} onChange={e=>setW(e.target.value)} type="number" inputMode="decimal" placeholder="ex: 75" style={{width:"100%",padding:"12px 36px 12px 14px",borderRadius:14,border:"1px solid "+C.c2,background:C.c1,color:C.t,fontSize:16,fontWeight:600,outline:"none",textAlign:"center",boxSizing:"border-box",fontFamily:C.display}}/>
          <span style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",color:C.ts,fontSize:13}}>kg</span>
        </div>
        <p style={{color:C.ts,fontSize:10,textAlign:"center",marginTop:6,opacity:0.7}}>Sert a estimer le volume des exercices au poids du corps</p>
      </div>
      <button onClick={()=>{if(g)onDone(g,parseFloat(w)||0);}} disabled={!g} style={{width:"100%",height:58,borderRadius:18,border:"none",cursor:g?"pointer":"default",fontFamily:C.display,background:g?C.gr:C.c2,color:g?C.bg:C.ts,fontWeight:800,fontSize:17,letterSpacing:"0.5px",boxShadow:g?"0 0 40px rgba(190,255,108,0.2)":"none",transition:"all 0.25s ease"}}>COMMENCER</button>
    </div>
  );
}
