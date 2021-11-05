import {getOurPage} from './helpers';

const COVER_FRAME_NAME = 'Cover';

export function renderCover(width: number, height: number): void {
  const ourPage = getOurPage();

  const coverFrame = ourPage.findChild((node) => node.type === 'FRAME' && node.name === COVER_FRAME_NAME);
  if (coverFrame) {
    coverFrame.remove();
  }

  ourPage.appendChild(getCoverFrame(width, height));
}

function getCoverFrame(width: number, height: number): FrameNode {
  const frame = figma.createFrame();
  frame.name = COVER_FRAME_NAME;
  frame.resize(width, height);
  return frame;
}
