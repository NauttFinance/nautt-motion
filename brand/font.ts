import {loadFont} from '@remotion/google-fonts/Sora';

// Nautt design system: Sora only (400 body, 500 titles/labels, 600 figures).
export const {fontFamily} = loadFont('normal', {weights: ['400', '500', '600'], subsets: ['latin']});
