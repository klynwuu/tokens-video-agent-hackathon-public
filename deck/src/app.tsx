import React, {useCallback, useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Player, type PlayerRef} from '@remotion/player';
import {Demo} from './video';
import {DURATION, FPS, HEIGHT, SCENES, WIDTH, getSceneIndex} from './content';
import './app.css';

function App() {
  const player = useRef<PlayerRef>(null);
  const [frame,setFrame] = useState(150);
  const [presenter,setPresenter] = useState(false);
  const [notesVisible,setNotesVisible] = useState(true);
  const [playing,setPlaying] = useState(false);
  const index = getSceneIndex(frame);
  const scene = SCENES[index];
  const jump = useCallback((i:number) => {
    if (i<0 || i>=SCENES.length) return;
    player.current?.seekTo(SCENES[i].start*FPS+13);
    player.current?.play();
  },[]);
  useEffect(()=>{
    const p=player.current;
    if(!p) return;
    const update=({detail}:{detail:{frame:number}})=>{
      setFrame(detail.frame);
      const current=getSceneIndex(detail.frame);
      if(presenter && detail.frame >= (SCENES[current].start+SCENES[current].duration)*FPS-1) p.pause();
    };
    const onPlay=()=>setPlaying(true);
    const onPause=()=>setPlaying(false);
    p.addEventListener('frameupdate',update);
    p.addEventListener('play',onPlay);
    p.addEventListener('pause',onPause);
    return()=>{p.removeEventListener('frameupdate',update);p.removeEventListener('play',onPlay);p.removeEventListener('pause',onPause);};
  },[presenter]);
  useEffect(()=>{
    const key=(e:KeyboardEvent)=>{
      const target=e.target as HTMLElement;
      if(target.closest('input,textarea')) return;
      if(e.key==='ArrowRight'){e.preventDefault();jump(Math.min(7,index+1));}
      if(e.key==='ArrowLeft'){e.preventDefault();jump(Math.max(0,index-1));}
      if(e.key===' ' && !target.closest('button')){e.preventDefault();player.current?.toggle();}
      if(e.key.toLowerCase()==='f') player.current?.requestFullscreen();
    };
    window.addEventListener('keydown',key);
    return()=>window.removeEventListener('keydown',key);
  },[index,jump]);
  const autoplay=()=>{setPresenter(false);player.current?.seekTo(0);player.current?.play();};
  return <main>
    <header className="site-header"><a className="brand" href="../">VGA<span>VIDEO GAMING AGENTS</span></a><div className="edition">HACKATHON DEMO <span>120 SEC / 8 LEVELS</span></div></header>
    <section className="deck" aria-label="Animated architecture deck">
      <Player ref={player} component={Demo} durationInFrames={DURATION} fps={FPS} compositionWidth={WIDTH} compositionHeight={HEIGHT} initialFrame={150} controls={false} clickToPlay={false} doubleClickToFullscreen moveToBeginningWhenEnded={false} initiallyMuted style={{width:'100%'}}/>
    </section>
    <div className="controller">
      <div className="actions"><button className="primary" onClick={autoplay}>▶ PLAY 2-MIN DEMO</button><button onClick={()=>player.current?.toggle()}>{playing?'Ⅱ PAUSE':'▶ RESUME'}</button><button aria-label="Previous level" disabled={index===0} onClick={()=>jump(index-1)}>←</button><button aria-label="Next level" disabled={index===7} onClick={()=>jump(index+1)}>→</button></div>
      <div className="actions"><label className="mode"><input type="checkbox" checked={presenter} onChange={e=>setPresenter(e.target.checked)}/>Pause after each level</label><button onClick={()=>setNotesVisible(!notesVisible)}>{notesVisible?'HIDE NOTES':'SHOW NOTES'}</button><button onClick={()=>player.current?.requestFullscreen()}>FULLSCREEN</button><span className="time">{String(Math.floor(frame/FPS/60)).padStart(2,'0')}:{String(Math.floor(frame/FPS)%60).padStart(2,'0')} / 02:00</span></div>
    </div>
    <nav className="levels" aria-label="Jump to slide">{SCENES.map((s,i)=><button aria-current={index===i?'step':undefined} key={s.id} className={index===i?'selected':''} onClick={()=>jump(i)}><span>0{i+1}</span>{s.label}</button>)}</nav>
    {notesVisible && <section className="notes"><div><p className="eyebrow">PRESENTER NOTES / {String(index+1).padStart(2,'0')}</p><h2>{scene.title}</h2><p>{scene.notes}</p></div><aside><p className="eyebrow">HOW TO PRESENT</p><p>Play the full demo, or pause after each level and narrate at your own pace.</p><p className="keys">← → levels · SPACE play/pause · F fullscreen</p><p className="prototype">Concept demo. The preview uses real project stills; editing and rendering are illustrated.</p></aside></section>}
    <footer>CONTEXT AGENT: FIND THE MEANING. <span>VIDEO AGENT: MAKE THE MOVIE.</span><a href="https://www.remotion.dev/docs/player" target="_blank" rel="noreferrer">BUILT WITH REMOTION</a></footer>
  </main>;
}
createRoot(document.getElementById('root')!).render(<App/>);
