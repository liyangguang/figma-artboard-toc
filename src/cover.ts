import {getStartPage, appendFrame, appendTextNode} from './helpers';

const COVER_FRAME_NAME = 'Cover';

export function renderCover(width: number, height: number): FrameNode {
  const startPage = getStartPage();

  const coverFrame = startPage.findChild((node) => node.type === 'FRAME' && node.name === COVER_FRAME_NAME) as FrameNode;
  if (!coverFrame) {
    const coverFrame = appendFrame(startPage, COVER_FRAME_NAME);
    coverFrame.resize(width, height);
    renderCoverFrame(coverFrame, width, height);
    // TODO: Set it as file thumbnail
  }
  return coverFrame;
}

function renderCoverFrame(frame: FrameNode, width: number, height: number): void {
  // TODO: Put some basic cover content
  const textNode = appendTextNode(frame, 'Put a cover here');
  textNode.fontSize = 60;

  textNode.x = (width - textNode.width) / 2;
  textNode.y = (height - textNode.height) / 2;
}
