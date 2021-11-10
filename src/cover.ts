import {appendFrame, appendTextNode, findChildByName} from './helpers';
import {COVER_PAGE_NAME, TOC_PAGE_NAME} from './STATIC_DATA';

const COVER_FRAME_NAME = 'cover';
const LAST_UPDATED_NAME = 'Last updated';
const COVER_DIMENSIONS = [1024, 576];
const PADDING = 16;

export function renderCover(): FrameNode {
  const coverPage = findChildByName(COVER_PAGE_NAME);

  let coverFrame = coverPage.findChild((node) => node.type === 'FRAME' && node.name === COVER_FRAME_NAME) as FrameNode;
  if (!coverFrame) {
    coverFrame = appendFrame(coverPage, COVER_FRAME_NAME);
    coverFrame.resize(COVER_DIMENSIONS[0], COVER_DIMENSIONS[1]);
    renderCoverFrame(coverFrame);
  }
  updateLastUpdated(coverFrame);

  return coverFrame;
}

function updateLastUpdated(frame: FrameNode): void {
  const textNode = frame.findChild((node) => node.name === LAST_UPDATED_NAME) as TextNode || appendTextNode(frame, LAST_UPDATED_NAME);
  textNode.name = LAST_UPDATED_NAME;
  textNode.characters = `${LAST_UPDATED_NAME}: ${new Date().toLocaleDateString()}`;
  textNode.x = COVER_DIMENSIONS[0] - textNode.width - PADDING;
  textNode.y = COVER_DIMENSIONS[1] - textNode.height - PADDING;
}

function renderCoverFrame(frame: FrameNode): void {
  const placeholderNode = appendTextNode(frame, 'Put your cover here');
  placeholderNode.fontSize = 60;

  placeholderNode.x = (COVER_DIMENSIONS[0] - placeholderNode.width) / 2;
  placeholderNode.y = (COVER_DIMENSIONS[1] - placeholderNode.height) / 2;

  const tocPage = findChildByName(TOC_PAGE_NAME);
  if (tocPage) {
    const tocNode = appendTextNode(frame, 'Table of contents', tocPage.id);
    tocNode.x = COVER_DIMENSIONS[0] - tocNode.width - PADDING;
    tocNode.y = COVER_DIMENSIONS[1] - tocNode.height * 2 - PADDING * 2;
  }
}
