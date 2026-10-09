import {Composition} from 'remotion';
import {Demo} from './video';
import {DURATION, FPS, HEIGHT, WIDTH} from './content';

export const RemotionRoot = () => <Composition id="VideoGamingAgents" component={Demo} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT}/>;
