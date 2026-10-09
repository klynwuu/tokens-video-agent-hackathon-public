// Static, browser-only replacement for the private local service.
// No credentials, original-media paths or remote service calls.
const PRIMARY = 'demo-ai-data-center';
const DEFAULTS = {duration_s:30, ratio:'9:16', captions:'clean', sfx:true};
const brief = 'An unexpected AI data center visit reveals an arcade. Make a fun vertical short.';
const json = async path => {
  const response = await fetch(new URL(path, import.meta.url));
  if (!response.ok) throw Error('A packaged demo asset could not be loaded.');
  return response.json();
};
const snapshot = () => json('../data/ai-data-center.story.json');
function plan(data = {}) {
  if (data.story_id && data.story_id !== PRIMARY) throw Error('Only the public AI Data Center cartridge is included.');
  const prompt = String(data.prompt || '').toLowerCase();
  let duration = Number(data.options?.duration_s || 30);
  const match = prompt.match(/\b(\d+)\s*(?:s\b|sec|second)/);
  if (match) duration = Number(match[1]);
  else if (/fifteen/.test(prompt)) duration = 15;
  else if (/thirty/.test(prompt)) duration = 30;
  if (![15,30].includes(duration)) throw Error('This offline demo includes the 15- and 30-second completed exports.');
  if (/16:9|4:3|3:4|1:1|square|landscape|horizontal|no captions|without captions|remove captions|no subtitles|without subtitles|pixel captions|original only|no (?:sound|sfx)|voiceover|tts|reorder|color grad|ai (?:shot|video|generat)/.test(prompt)) {
    throw Error('This offline demo loads fixed vertical exports with animated English captions and arcade audio. Select 15 or 30 seconds; other edits need the live renderer.');
  }
  if (data.options && ((data.options.ratio && data.options.ratio !== '9:16') || (data.options.captions && data.options.captions !== 'clean') || data.options.sfx === false)) {
    throw Error('The packaged exports have fixed vertical framing, English captions and arcade audio.');
  }
  return {story_id:PRIMARY, ...DEFAULTS, duration_s:duration, planner:'offline-demo',
    agent_profile:'packaged-exports', creative_brief:String(data.brief || brief).slice(0,4000),
    memory:(data.memory || []).slice(-20), tools:['public-story-json','saved-edit-plan','packaged-mp4'],
    render_supported:false, playback_supported:true, recipe:'packaged-nbox', width:1080,height:1920};
}
export async function request(path, data) {
  if (path === '/api/stories') return {source:'sanitized-snapshot', stories:await json('stories.json')};
  if (path.startsWith('/api/context?')) {
    if (new URLSearchParams(path.split('?')[1]).get('id') !== PRIMARY) throw Error('Cartridge not included.');
    const s = await snapshot(), ai = s.ai_versions[0].ai;
    return {story_id:PRIMARY,title:s.story.title,source:s.source,item_count:s.items.length,
      version:10, has_composition:true, angle_count:ai.angles.length,short_count:ai.shorts.length,
      beat_count:ai.beats.length, default_brief:brief,default_options:DEFAULTS,
      composition:ai,items:s.items,brief_source:'Public demo direction'};
  }
  if (path === '/api/plan') return plan(data);
  if (path === '/api/jobs') {
    const options = plan(data);
    const s = await snapshot();
    const saved = await json(`../demo/plans/nbox-${options.duration_s}s.edit.json`);
    const videoUrl = new URL(`../demo/videos/nbox-${options.duration_s}s.mp4`,import.meta.url);
    const response = await fetch(videoUrl, {method:'HEAD'});
    if (!response.ok) throw Error('The packaged MP4 is missing.');
    const job = {id:'demo-'+crypto.randomUUID().slice(0,8),status:'done',progress:100,
      plan:{...options,edit_decisions:saved},video_url:videoUrl.href,
      events:[
        {elapsed_s:0,stage:'context',text:`Loaded sanitized Story snapshot · ${s.items.length} ordered items`},
        {elapsed_s:0,stage:'plan',text:`Loaded saved ${options.duration_s}s edit decisions · ${saved.cuts.length} cuts`},
        {elapsed_s:0,stage:'media',text:'Confirmed packaged 1080 × 1920 MP4 is available'},
        {elapsed_s:0,stage:'done',text:'Ready for offline playback · no new render or model call'}]};
    try { sessionStorage.setItem('vga-public-'+job.id,JSON.stringify(job)); } catch {}
    return job;
  }
  if (path.startsWith('/api/jobs/')) {
    const job = sessionStorage.getItem('vga-public-'+path.split('/').at(-1));
    if (!job) throw Error('This demo run has expired. Load the packaged export again.');
    return JSON.parse(job);
  }
  throw Error('Unsupported offline demo action.');
}
