import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {DURATION, FPS, HEIGHT, SCENES, WIDTH, getSceneIndex} from './content';
import {C, ClassicChrome, Pattern, abs, border, pixel, selected, text} from './classic';

const move = (f: number, start: number, end: number, a = 0, b = 1) => interpolate(f, [start, end], [a, b], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
const snap = (n: number, grid = 6) => Math.round(n / grid) * grid;
const pop = (f: number, at = 0): React.CSSProperties => ({opacity: move(f, at, at + 12), transform: `translateY(${snap(move(f, at, at + 16, 36, 0))}px)`});

function Robot({color = C.mint, size = 150, step = 0}: {color?: string; size?: number; step?: number}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" shapeRendering="crispEdges" aria-hidden>
    <path fill={color} d="M10 1h4v3h-4zM5 5h14v2h2v10h-2v2H5v-2H3V7h2zM5 20h4v3H5zM15 20h4v3h-4z"/>
    <path fill={C.ink} d={`M7 9h3v${step % 2 ? 1 : 3}H7zM14 9h3v${step % 2 ? 1 : 3}h-3zM8 15h8v2H8z`}/>
    <path fill={C.cream} d="M7 7h3v1H7zM14 7h3v1h-3z"/>
  </svg>;
}

function Star({x, y, size = 24, color = C.gold}: {x: number; y: number; size?: number; color?: string}) {
  return <svg style={abs(x, y, size, size)} viewBox="0 0 16 16" shapeRendering="crispEdges"><path fill={color} d="M6 0h4v5h6v5h-6v6H6v-6H0V5h6z"/></svg>;
}

function Film() {
  return <svg width={150} height={150} viewBox="0 0 24 24" shapeRendering="crispEdges"><path fill={C.cream} d="M1 4h22v16H1z"/><path fill={C.ink} d="M3 6h2v2H3zM3 11h2v2H3zM3 16h2v2H3zM19 6h2v2h-2zM19 11h2v2h-2zM19 16h2v2h-2zM7 7h10v10H7z"/><path fill={C.gold} d="M10 9h2v1h2v1h2v2h-2v1h-2v1h-2z"/></svg>;
}

function Tag({children, color = C.gold}: {children: React.ReactNode; color?: string}) {
  return <span style={{...text(17, color), display: 'inline-block', padding: '11px 16px', background: C.ink, border: `3px solid ${color}`}}>{children}</span>;
}

function Heading({kicker, title, sub, color = C.gold}: {kicker: string; title: string; sub?: string; color?: string}) {
  return <div style={abs(65, 151, 1470)}><div style={text(18, color)}>{kicker}</div><h1 style={{fontFamily:'Arial,sans-serif',fontSize:49,fontWeight:500,color:'#101017',textAlign:'center',lineHeight:1.1,background:'#fafaff',border:'5px solid #c6c5d3',borderRadius:16,boxShadow:'0 5px #666175',padding:'15px 24px',marginTop:30}}>{title}</h1>{sub && <p style={{fontSize:28,color:C.muted,fontFamily:'monospace',marginTop:23,textAlign:'center'}}>{sub}</p>}</div>;
}

function Photo({name, label, width = 340}: {name: string; label: string; width?: number}) {
  return <div style={{width,...border(C.silver),background:C.panel,overflow:'hidden'}}><div style={{height:16,background:'linear-gradient(#565262,#292733)'}}/><Img src={(`assets/${name}.jpg`)} style={{width:'100%',height:width*.62,objectFit:'cover',display:'block'}}/><div style={{...text(15),padding:'17px 12px',borderTop:'4px solid #545064'}}>{label}</div></div>;
}

function Cartridge({label = 'AI DATA CENTER', small = false, color = C.red}: {label?: string; small?: boolean; color?: string}) {
  const w=small?280:400;const h=small?345:420;
  return <div style={{width:w,height:h,background:C.panel,...selected,position:'relative',overflow:'hidden'}}>
    <div style={{height:38,background:'linear-gradient(#615d74,#292636)',borderBottom:'5px solid #050507'}}/>
    <Img src={('assets/arcade.jpg')} style={{width:'100%',height:small?177:245,objectFit:'cover'}}/>
    <div style={{position:'absolute',top:small?137:188,left:15,right:15,background:'#050507e8',padding:'13px 9px',color,textAlign:'center',...text(small?16:22,color)}}>{label}</div>
    <div style={{position:'absolute',left:14,right:14,bottom:11,borderTop:'4px solid #666173',paddingTop:14,display:'flex',alignItems:'center',justifyContent:'space-between'}}><div style={{display:'flex',gap:8}}>{[0,1,2,3].map(i=><span key={i} style={{width:small?20:26,height:small?20:26,border:'4px solid #aaa8c0',borderRadius:6}}/>)}</div><Robot color={color} size={small?49:61}/></div>
  </div>;
}

function Arrow({x1, y1, x2, y2, color = C.gold, progress = 1, bend}: {x1: number; y1: number; x2: number; y2: number; color?: string; progress?: number; bend?: number}) {
  const mid = bend ?? (x1 + x2) / 2;
  return <svg style={abs(0, 0, WIDTH, HEIGHT)} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} aria-hidden><path d={`M${x1},${y1} H${mid} V${y2} H${x2}`} fill="none" stroke={color} strokeWidth="5" opacity={.28}/><path d={`M${x1},${y1} H${mid} V${y2} H${x2}`} pathLength="1" strokeDasharray="1" strokeDashoffset={1 - progress} fill="none" stroke={color} strokeWidth="5"/><path d={`M${x2-13} ${y2-10} L${x2} ${y2} L${x2-13} ${y2+10}`} stroke={color} strokeWidth="5" fill="none" opacity={progress > .95 ? 1 : 0}/></svg>;
}

function Start() {
  const f = useCurrentFrame();
  return <>
    <Heading kicker="A NEW CREATIVE QUEST" title="Turn footage into a playable story."/>
    <div style={{...abs(86, 394, 880), ...pop(f)}}><h1 style={{...text(76), lineHeight: 1.25, marginTop: 36}}>VIDEO<br/><span style={{color:C.blue}}>GAMING</span><br/>AGENTS</h1></div>
    <div style={{...abs(1020, 408), transform: `translateY(${snap(Math.sin(f / 20) * 12)}px)`}}><Cartridge/></div>
    <div style={{...abs(983, 856), display: 'flex', gap: 46, alignItems: 'center', ...pop(f, 65)}}><Robot size={120}/><span style={text(30, C.gold)}>+</span><Robot size={120} color={C.red}/></div>
    <div style={{...abs(90, 915), ...text(25, C.gold), opacity: f < 80 ? 0 : Math.floor(f / 20) % 2 ? 1 : .45}}>▶ PRESS START</div>
    <Star x={956} y={407}/><Star x={1470} y={877} color={C.red}/>
  </>;
}

function Chaos() {
  const f = useCurrentFrame();
  const shots = [{name: 'entrance', label: 'THE ARRIVAL', x: 74, y: 423, r: -9}, {name: 'servers', label: 'SERVER ROOMS', x: 487, y: 407, r: 6}, {name: 'corridor', label: 'MORE CORRIDORS', x: 917, y: 423, r: -4}, {name: 'lounge', label: 'SIDE QUESTS', x: 254, y: 684, r: 5}, {name: 'arcade', label: 'WAIT... AN ARCADE?', x: 779, y: 683, r: -5}];
  return <><Heading kicker="LEVEL 01 / THE FOOTAGE DUNGEON" title="Great moments. Buried in footage." sub="A real Story: unbox AI data center"/>
    {shots.map((s, i) => <div key={s.name} style={{...abs(s.x, s.y), ...pop(f, i * 13), transform: `translateY(${snap(Math.sin(f / 26 + i) * 10)}px) rotate(${s.r}deg)`}}><Photo name={s.name} label={s.label} width={310}/></div>)}
    <div style={{...abs(1293, 501, 260), ...pop(f, 85)}}><div style={text(65, C.gold)}>115</div><p style={{...text(20), marginTop: 13}}>STORY ITEMS</p><div style={{...text(22, C.red), marginTop: 75, lineHeight: 1.7}}>FIND THE<br/>HIDDEN STORY.</div></div>
    {f > 255 && <div style={{...abs(826, 653), ...text(25, C.gold), background: C.ink, padding: 15}}>! CLUE FOUND</div>}
  </>;
}

function Context() {
  const f = useCurrentFrame();
  const lanes = [{y: 439, verb: 'SEE', clue: 'Scenes + subjects', color: C.mint, at: 45}, {y: 601, verb: 'HEAR', clue: 'Words + timestamps', color: C.gold, at: 108}, {y: 763, verb: 'READ', clue: 'File + camera facts', color: C.blue, at: 171}];
  return <><Heading kicker="PLAYER 1 / CONTEXT AGENT" title="Collect the clues." sub="Messy footage → useful metadata → a searchable index" color={C.mint}/>
    {lanes.map(l => <React.Fragment key={l.verb}><Arrow x1={300} y1={660} x2={426} y2={l.y + 58} progress={move(f,l.at,l.at+35)} color={l.color}/><Arrow x1={908} y1={l.y+58} x2={1156} y2={660} progress={move(f,l.at+72,l.at+113)} color={l.color}/></React.Fragment>)}
    <div style={{...abs(65, 493, 235, 340), background: C.panel, ...border(C.cream), display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', ...pop(f)}}><Film/><p style={{...text(24), marginTop: 35}}>FOOTAGE</p></div>
    {lanes.map(l => <div key={l.verb} style={{...abs(426, l.y, 482, 126), padding: '18px 28px', boxSizing: 'border-box', ...border(l.color), background: C.panel, ...pop(f,l.at+20)}}><div style={text(24,l.color)}>{l.verb}</div><p style={{fontSize: 26, fontFamily: 'monospace', margin: '10px 0'}}>{l.clue}</p></div>)}
    <div style={{...abs(1156, 464, 380, 395), background: C.panel, ...border(C.mint), padding: '35px 22px', boxSizing: 'border-box', ...pop(f,290)}}><p style={text(21,C.mint)}>METADATA INDEX</p><p style={{fontSize: 27, fontFamily: 'monospace', lineHeight: 1.9, marginTop: 35}}>{f<420?<>Arcade cabinet<br/>Surprise reaction<br/>Source moment</>:<>Search: "arcade"<br/><span style={{color:C.gold}}>MOMENT FOUND ✓</span><br/>Jump to the source.</>}</p><Tag color={C.gold}>{f<420?'CLUES COLLECTED':'SIDE QUEST FOUND'}</Tag></div>
    <div style={{...abs(65, 955), ...text(20, C.mint), ...pop(f,405)}}>KNOW WHAT'S IN THE FOOTAGE. KNOW WHERE TO FIND IT.</div>
  </>;
}

function Story() {
  const f = useCurrentFrame();
  const beats = ['HOOK', 'DISCOVERY', 'PAYOFF'];
  return <><Heading kicker="PLAYER 1 / STORY UNLOCKED" title="Give the clues a direction." sub="Your context turns a collection of moments into a story." color={C.mint}/>
    <Arrow x1={461} y1={532} x2={623} y2={678} progress={move(f,45,90)} color={C.mint}/><Arrow x1={461} y1={765} x2={623} y2={678} progress={move(f,120,165)} color={C.gold}/><Arrow x1={1009} y1={678} x2={1168} y2={678} progress={move(f,215,260)} color={C.red}/>
    <div style={{...abs(65,442,396,180), background: C.panel, ...border(C.mint), padding: 29, boxSizing: 'border-box', ...pop(f,10)}}><p style={text(23,C.mint)}>INDEXED CLUES</p><p style={{fontFamily:'monospace',fontSize:27,lineHeight:1.6}}>Server rooms.<br/>Arcade surprise.</p></div>
    <div style={{...abs(65,675,396,180), background: C.panel, ...border(C.gold), padding:29,boxSizing:'border-box',...pop(f,92)}}><p style={text(23,C.gold)}>YOUR CONTEXT</p><p style={{fontFamily:'monospace',fontSize:27,lineHeight:1.6}}>"Show the human side<br/>of the data center."</p></div>
    <div style={{...abs(623,478,386,399),background:C.panel,...border(C.cream),padding:24,boxSizing:'border-box',...pop(f,180)}}><p style={text(23,C.cream)}>COMPOSE A STORY</p><h2 style={{...text(28,C.red),marginTop:35}}>AI HAS<br/>A PLAY ROOM?</h2><div style={{display:'flex',gap:10,marginTop:40}}>{beats.map((b,i)=><span key={b} style={{...text(14,C.ink),background:C.gold,padding:'14px 10px',...pop(f,210+i*35)}}>{b}</span>)}</div></div>
    <div style={{...abs(1190,445),...pop(f,280)}}><Cartridge small label="ARCADE SIDE QUEST"/><p style={{...text(19,C.red),marginTop:30}}>STORY CARTRIDGE</p></div>
    <div style={{...abs(410,948),...pop(f,365),...text(18,C.gold)}}>A HOOK. A FEW BEATS. THE SOURCES TO BACK THEM UP.</div>
  </>;
}

function Load() {
  const f = useCurrentFrame();
  const insertion = move(f,85,160);
  return <><Heading kicker="PLAYER 2 / LOAD YOUR QUEST" title="Every story is a cartridge." sub="Choose a story. Plug in the context. Start creating." color={C.red}/>
    <div style={{...abs(65,416,443,487),background:C.panel,...border(C.cream),padding:35,boxSizing:'border-box',...pop(f)}}><p style={text(22,C.gold)}>AVAILABLE STORIES</p>{['AI DATA CENTER','NYC B-ROLLS','BUILD IN PUBLIC'].map((s,i)=><div key={s} style={{...text(21,i===0?C.cream:C.muted),marginTop:36,padding:'23px 14px',background:i===0?'#1457a1':C.ink,border:i===0?`3px solid ${C.mint}`:'3px solid #656070',borderRadius:8}}>{i===0?'▶ ': '  '}{s}</div>)}</div>
    <div style={{...abs(879,390+snap(insertion*182)),zIndex:2,opacity:move(f,140,167,1,0),transform:`scale(${move(f,85,160,1,.88)})`}}><Cartridge small label="ARCADE SIDE QUEST"/></div>
    <div style={{...abs(596,752,926,185),...border(C.cream),background:'linear-gradient(#dedce7,#a29eb4)',padding:35,boxSizing:'border-box',zIndex:3}}><div style={{...abs(244,19,399,25),background:C.ink}}/><div style={{...abs(38,69,585,67),background:C.ink,padding:'18px 24px',boxSizing:'border-box',...text(24,insertion===1?C.mint:C.muted)}}>{insertion===1?'STORY LOADED ✓':'INSERT CARTRIDGE'}</div><div style={{...abs(737,68,123,62),background:C.red,border:`5px solid ${C.ink}`}}/><p style={{...abs(42,148),...text(15,C.ink)}}>VIDEO AGENT / CREATIVE CONSOLE</p></div>
    <div style={{...abs(1259,442),...pop(f,185),display:'flex',alignItems:'center',gap:18}}><Robot color={C.red} size={94}/><div style={text(21,C.mint)}>READY!</div></div>
    <Star x={635} y={585} size={35}/>
  </>;
}

function Edit() {
  const f = useCurrentFrame();
  const prompt = 'Make a 30-second short.\nLead with the arcade surprise.';
  const typed = prompt.slice(0,Math.floor(move(f,15,105,0,prompt.length)));
  const phases = [{at:120,title:'FIND MOMENTS',body:'Follow the Story clues.',color:C.mint}, {at:235,title:'PLAN THE CUT',body:'Hook → reveal → payoff.',color:C.gold}, {at:365,title:'ASSEMBLE',body:'Clips + captions + rhythm.',color:C.red}];
  return <><Heading kicker="PLAYER 2 / VIDEO AGENT" title="Say the edit. Start the quest." sub="Chat is your controller. The Story is your context." color={C.red}/>
    <div style={{...abs(65,430,700,461),background:C.panel,...border(C.cream),padding:29,boxSizing:'border-box'}}><div style={{display:'flex',gap:20,alignItems:'center'}}><Robot color={C.red} size={70}/><p style={text(22,C.red)}>VIDEO AGENT</p></div><div style={{marginTop:30,background:C.ink,border:`3px solid ${C.gold}`,padding:25,minHeight:140,boxSizing:'border-box'}}><p style={{fontFamily:'monospace',fontSize:28,lineHeight:1.6,whiteSpace:'pre-line',margin:0,color:C.gold}}>{typed}<span style={{opacity:Math.floor(f/12)%2?1:0}}>▌</span></p></div><p style={{...text(22,C.mint),marginTop:32,...pop(f,115)}}>QUEST ACCEPTED.</p></div>
    {phases.map((p,i)=><div key={p.title} style={{...abs(897,430+i*157,641,120),...border(p.color),background:C.panel,padding:'19px 22px',boxSizing:'border-box',...pop(f,p.at)}}><div style={{display:'flex',justifyContent:'space-between'}}><p style={text(22,p.color)}>{p.title}</p><p style={text(21,C.mint)}>{f>p.at+65?'✓':'...'}</p></div><p style={{fontFamily:'monospace',fontSize:25,margin:'11px 0'}}>{p.body}</p></div>)}
    <div style={{...abs(897,953),...pop(f,505),...text(18,C.gold)}}>YOU DIRECT. THE AGENT ASSEMBLES.</div>
    <div style={{...abs(65,953),...pop(f,455),fontFamily:'monospace',fontSize:23,color:C.muted}}>Next move: "Tighter pacing. Keep the surprise."</div>
  </>;
}

function GameOn() {
  const f = useCurrentFrame();
  const shot = f < 135 ? 'servers' : f < 270 ? 'arcade' : 'lounge';
  const caption = f < 135 ? 'INSIDE AN AI DATA CENTER...' : f < 270 ? 'WAIT. THEY HAVE AN ARCADE?!' : 'SERIOUS COMPUTE. PLAYFUL HUMANS.';
  const beat = f < 135 ? 0 : f < 270 ? 1 : 2;
  return <><Heading kicker="THE QUEST BECOMES A VIDEO" title="GAME ON." sub="From story to screen — then remix it your way." color={C.red}/>
    <div style={{...abs(65,395,768,578),background:'linear-gradient(#dedce7,#a29eb4)',...border(C.cream),padding:16,boxSizing:'border-box'}}><div style={{height:508,position:'relative',overflow:'hidden',border:`9px solid ${C.ink}`}}><Img src={(`assets/${shot}.jpg`)} style={{width:'100%',height:'100%',objectFit:'cover',transform:`scale(${1+move(f%135,0,134,0,.07)})`}}/><div style={{position:'absolute',bottom:25,left:26,right:26,background:C.ink,padding:15,textAlign:'center',...text(20,C.gold)}}>{caption}</div><div style={{position:'absolute',top:16,left:18,...text(15,C.cream),background:C.ink,padding:10}}>STORYBOARD PREVIEW</div></div><div style={{...text(15,C.ink),marginTop:9,textAlign:'center'}}>CREATIVE CONSOLE / ARCADE SIDE QUEST</div></div>
    <div style={{...abs(930,430,602),...pop(f,25)}}><p style={text(25,C.gold)}>THE STORY BEATS</p>{['01  SET THE SCENE','02  REVEAL THE TWIST','03  LAND THE PAYOFF'].map((b,i)=><div key={b} style={{...text(23,beat===i?C.cream:C.muted),padding:'17px 18px',marginTop:26,background:beat===i?'#1457a1':C.panel,border:`3px solid ${beat===i?C.mint:'#646070'}`,borderRadius:8}}>{b}</div>)}<p style={{fontFamily:'monospace',fontSize:31,color:C.mint,marginTop:38,lineHeight:1.6}}>One cartridge.<br/>Many possible cuts.</p></div>
    <div style={{...abs(930,941,605),...text(17,C.muted)}}>ILLUSTRATED OUTPUT / EDITING BACKEND IS THE NEXT LEVEL</div>
  </>;
}

function Finish() {
  const f = useCurrentFrame();
  return <><Heading kicker="QUEST COMPLETE" title="Two agents. One creative adventure." sub="Same footage. More stories."/>
    <Arrow x1={694} y1={630} x2={900} y2={630} color={C.gold} progress={move(f,35,75)}/>
    <div style={{...abs(65,447,629,378),...border(C.mint),background:C.panel,display:'flex',alignItems:'center',flexDirection:'column',paddingTop:35,...pop(f)}}><Robot color={C.mint} size={128}/><p style={{...text(29,C.mint),marginTop:25}}>CONTEXT AGENT</p><p style={{fontFamily:'monospace',fontSize:34,marginTop:25}}>Find the meaning.</p></div>
    <div style={{...abs(900,447,629,378),...border(C.red),background:C.panel,display:'flex',alignItems:'center',flexDirection:'column',paddingTop:35,...pop(f,45)}}><Robot color={C.red} size={128}/><p style={{...text(29,C.red),marginTop:25}}>VIDEO AGENT</p><p style={{fontFamily:'monospace',fontSize:34,marginTop:25}}>Make the movie.</p></div>
    <div style={{...abs(334,931),...text(28,C.gold),...pop(f,100)}}>PICK A CARTRIDGE. PRESS START.</div>
    <Star x={778} y={584} size={42}/>
  </>;
}

const COMPONENTS = [Start,Chaos,Context,Story,Load,Edit,GameOn,Finish];

export function Demo() {
  const f = useCurrentFrame();
  const index = getSceneIndex(f);
  const local = f - SCENES[index].start * FPS;
  const [fontHandle] = useState(() => delayRender('Loading shared pixel font'));
  useEffect(() => {
    let done = false;
    document.fonts.load('16px Pixel').then(() => {if (!done) {done=true; continueRender(fontHandle);}}).catch(() => {if (!done) {done=true; continueRender(fontHandle);}});
  }, [fontHandle]);
  return <AbsoluteFill style={{background:C.ink,color:C.cream,overflow:'hidden'}}>
    <style>{`@font-face{font-family:Pixel;src:url('${('assets/pixel.ttf')}') format('truetype');font-weight:400;font-display:block}*{box-sizing:border-box}p,h1,h2{margin:0}`}</style>
    <Pattern/>
    {SCENES.map((scene,i)=>{const Scene=COMPONENTS[i];return <Sequence key={scene.id} from={scene.start*FPS} durationInFrames={scene.duration*FPS} name={scene.label}><Scene/></Sequence>;})}
    <ClassicChrome index={index}/>
    {local<12 && index>0 && <div style={{position:'absolute',inset:0,background:C.ink,clipPath:`inset(0 ${move(local,0,12,0,100)}% 0 0)`}}/>}
    <div style={{position:'absolute',left:0,bottom:0,width:`${f/(DURATION-1)*100}%`,height:4,background:C.blue}}/>
  </AbsoluteFill>;
}
