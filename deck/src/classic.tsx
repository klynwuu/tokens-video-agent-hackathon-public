import React from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';
import {HEIGHT, SCENES, WIDTH} from './content';

export const C = {ink:'#050507',panel:'#11111d',cream:'#f9faff',muted:'#bcc1d8',red:'#ba9cff',gold:'#ffe189',mint:'#43edf1',blue:'#4caeff',silver:'#c6c5d3',purple:'#7860db'};
export const pixel='"Pixel", monospace';
export const abs=(x:number,y:number,w?:number,h?:number):React.CSSProperties=>({position:'absolute',left:x,top:y,width:w,height:h});
export const text=(size:number,color=C.cream):React.CSSProperties=>({fontFamily:pixel,fontSize:size,color,lineHeight:1.5,margin:0});
export const border=(color=C.silver):React.CSSProperties=>({border:`5px solid ${color}`,borderRadius:12,boxShadow:`inset 0 0 0 3px #050507, 0 0 0 2px #050507, 7px 7px 0 #0009`});
export const selected:React.CSSProperties={border:`5px solid ${C.mint}`,borderRadius:14,boxShadow:`0 0 0 5px #168ed7, inset 0 0 0 3px #168ed7, 0 0 22px #43edf15c`};

export function MenuIcon({kind,size=58}:{kind:number;size?:number}){
  return <svg width={size} height={size} viewBox="0 0 24 24" shapeRendering="crispEdges" aria-hidden>
    {kind===0?<><path fill="#09090b" d="M2 2h20v16H2zM8 18h8v3h4v2H4v-2h4z"/><path fill="#eeedf4" d="M4 4h16v12H4z"/><path fill="#1b4b91" d="M6 6h12v8H6z"/><path fill="#56affc" d="M6 10h12v4H6z"/></>:kind===1?<><path fill="#08080a" d="M9 1h6v3h3v3h4v9h-4v3h-3v4H9v-4H6v-3H2V7h4V4h3z"/><path fill="#dedee8" d="M10 3h4v4h4v10h-4v4h-4v-4H6V7h4z"/><path fill="#767482" d="M10 8h5v8h-5z"/><path fill="#11111b" d="M11 10h3v4h-3z"/></>:kind===2?<><path fill="#09090b" d="M7 1h10v3h4v4h2v10h-3v3H4v-3H1V8h2V4h4z"/><path fill="#318fe5" d="M8 3h8v3h4v11h-4v3H7v-3H3V7h5z"/><path fill="#eeeef4" d="M10 3h2v17h-2zM3 10h17v2H3zM7 5h2v3H7zM14 15h3v2h-3z"/></>:kind===3?<><path fill="#09090b" d="M4 1h16v22H4z"/><path fill="#f4f3f7" d="M6 3h12v18H6z"/><path fill="#91909b" d="M8 6h8v2H8zM8 11h8v2H8zM8 16h6v2H8z"/></>:<><path fill="#08080a" d="M3 2h18v20H3z"/><path fill="#54b67a" d="M5 4h14v16H5z"/><path fill="#edfff2" d="M8 6h7v2h2v4h-3v3h-3v-4h3V8H8zM11 17h3v2h-3z"/></>}
  </svg>;
}

export function Pattern(){
  const f=useCurrentFrame();
  return <svg style={{position:'absolute',inset:0,width:WIDTH,height:HEIGHT,transform:`translate(${Math.round(Math.sin(f/120)*8)}px,${Math.round(Math.cos(f/130)*8)}px)`}} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} aria-hidden>
    <g fill="none" stroke="#29204b" strokeWidth="19" opacity=".75">
      <path d="M-190 390C-60 20 240 160 80 470S530 690 450 290 670 220 740 425 1020 310 1140 110"/>
      <path d="M1300 65C970 220 1200 525 1460 310S1740 600 1430 650 1530 1000 1770 1110"/>
      <path d="M-60 1020C210 1090 520 730 410 650S25 710 320 900 630 1160 690 875 1010 700 1110 930 1400 1170 1340 920"/>
      <path d="M70 160C500 320 410 80 690 50S850 350 985 545 730 800 720 1030"/>
    </g><g fill="none" stroke="#635091" strokeWidth="5" opacity=".26"><path d="M-90 340C20 105 215 190 92 490S540 672 460 300 689 249 754 415 1030 300 1140 120"/><path d="M1290 77C994 241 1213 510 1462 321S1735 619 1434 661 1532 1007 1770 1120"/></g>
  </svg>;
}

export function ClassicChrome({index}:{index:number}){
  const covers=['arcade','entrance','corridor','arcade','arcade','servers','arcade','lounge'];
  return <>
    <div style={{...abs(0,0,WIDTH,111),background:'linear-gradient(#e0dfe8 0%,#bbbaca 72%,#d9d8e3 73%)',borderBottom:'8px double #696779',boxShadow:'0 5px 0 #ecebf9',display:'flex',alignItems:'center'}}>
      <div style={{...abs(34,39),...text(15,'#30303a')}}>VGA / VIDEO GAMING AGENTS</div>
      <div style={{...abs(640,19),display:'flex',gap:24}}>{[0,1,2,3,4].map(k=><div key={k} style={{padding:'6px 10px',background:k===0?'#9e9cac':'transparent',border:k===0?'3px inset #e7e7ef':'3px solid transparent'}}><MenuIcon kind={k}/></div>)}</div>
      <div style={{...abs(1260,42),...text(18,'#37343f')}}>LEVEL {String(index+1).padStart(2,'0')} / 08</div>
    </div>
    <div style={{...abs(1065,151,470),...text(17,index<4?C.mint:C.red),textAlign:'right'}}>{index<4?'PLAYER 1 / CONTEXT':'PLAYER 2 / VIDEO'}</div>
    <div style={{...abs(140,1015,1320,85),display:'flex',gap:20,alignItems:'center',justifyContent:'center'}}>{SCENES.map((s,i)=><div key={s.id} style={{width:144,height:index===i?83:70,position:'relative',background:C.ink,border:index===i?`4px solid ${C.mint}`:'3px solid #626071',borderRadius:6,boxShadow:index===i?'0 0 0 3px #178ddb,0 0 12px #43edf17a':'3px 3px #000',opacity:index===i?1:.65,transform:index===i?'translateY(-4px)':'none'}}><Img src={(`assets/${covers[i]}.jpg`)} style={{width:'100%',height:'100%',objectFit:'cover'}}/><span style={{position:'absolute',bottom:2,left:5,...text(13),background:'#000c',padding:3}}>0{i+1}</span></div>)}</div>
    <div style={{...abs(0,1120,WIDTH,80),background:'linear-gradient(#cfcedb,#aeacbd)',borderTop:'8px double #eeedf6',display:'flex',gap:46,alignItems:'center',padding:'0 48px',fontFamily:'Arial,sans-serif',color:'#30303a',fontSize:25}}><span><Keycap>← →</Keycap> Levels</span><span><Keycap>SPACE</Keycap> Play / Pause</span><span><Keycap>F</Keycap> Fullscreen</span><span style={{marginLeft:'auto',...text(13,'#514a69')}}>CONCEPT DEMO</span></div>
  </>;
}

export function Keycap({children}:{children:React.ReactNode}){
  return <span style={{display:'inline-block',background:C.purple,border:'3px solid #ddd7f8',borderRadius:9,padding:'7px 14px',boxShadow:'inset 3px 3px #a394e9,inset -3px -3px #4d3891',...text(15),marginRight:9}}>{children}</span>;
}
