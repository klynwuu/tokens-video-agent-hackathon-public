export const FPS = 30;
export const WIDTH = 1600;
export const HEIGHT = 1200;
export const SCENES = [
  {id: 'start', start: 0, duration: 12, label: 'PRESS START', title: 'Turn footage into a playable story.',
    notes: 'We shoot a lot of video. Making something worth watching is the hard part. What if editing felt like playing a game? Meet Video Gaming Agents: two agents, one adventure.'},
  {id: 'chaos', start: 12, duration: 14, label: 'THE FOOTAGE DUNGEON', title: 'Great moments. Buried in footage.',
    notes: 'Here is a real example: a visit to an AI data center. Server rooms, corridors, conversations, and one unexpected arcade. The good story is in there. First, we need to find the clues.'},
  {id: 'context', start: 26, duration: 20, label: 'CONTEXT AGENT', title: 'Collect the clues.',
    notes: 'Our Context Agent sees what is on screen, hears what people say, and reads the file facts. Those clues come together in a searchable metadata index, linked back to the original footage. Now we can find a moment by what it means, instead of remembering its file name.'},
  {id: 'story', start: 46, duration: 16, label: 'STORY UNLOCKED', title: 'Give the clues a direction.',
    notes: 'Add your context: what happened, what matters, and who the video is for. The agent combines that intent with the footage to suggest a hook and story beats. Here is our twist: an arcade hiding inside an AI data center. Save that story as a cartridge.'},
  {id: 'cartridge', start: 62, duration: 12, label: 'LOAD YOUR QUEST', title: 'Every story is a cartridge.',
    notes: 'Pick a Story cartridge and plug it in. The Video Agent receives the story and its source references. You bring the creative direction. The cartridge brings the context, so you do not have to explain everything again.'},
  {id: 'edit', start: 74, duration: 20, label: 'VIDEO AGENT', title: 'Say the edit. Start the quest.',
    notes: 'Ask for a thirty-second short, and lead with the arcade surprise. The Video Agent finds the relevant moments, plans the sequence, and assembles the edit. You can ask for tighter pacing, captions, or a different opening. Chat becomes your controller, and the preview becomes your feedback.'},
  {id: 'gameon', start: 94, duration: 16, label: 'GAME ON', title: 'From story to screen.',
    notes: 'Game on! The planned result moves from the server room to the arcade reveal, then lands on a playful payoff. This preview illustrates the concept; the editing backend is our next step. One Story cartridge could power several different cuts.'},
  {id: 'finish', start: 110, duration: 10, label: 'QUEST COMPLETE', title: 'Two agents. One creative adventure.',
    notes: 'The Context Agent finds the meaning. The Video Agent makes the movie. Same footage, more stories. Less time lost searching, more time spent creating. Pick a cartridge. Press start.'},
] as const;
export const DURATION = SCENES.reduce((sum, scene) => sum + scene.duration, 0) * FPS;
export const getSceneIndex = (frame: number) => Math.max(0, SCENES.findIndex(s => frame >= s.start * FPS && frame < (s.start + s.duration) * FPS));
