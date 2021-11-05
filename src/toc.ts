import {SUMMARY_PAGE_NAME, INDENTATION_WIDTH} from './styles';
import {createAutoLayoutFrame, createTextNode, getOurPage} from './helpers';

const TOC_FRAME_NAME = 'Table of contents';

export function renderToc(x: number, y: number): void {
  const ourPage = getOurPage();

  const tocFrame = ourPage.findChild((node) => node.type === 'FRAME' && node.name === TOC_FRAME_NAME);
  if (tocFrame) {
    tocFrame.remove();
  }

  ourPage.appendChild(getTocFrame(x, y));
}

function getTocFrame(x: number, y: number): FrameNode {
  const tocFrame = createAutoLayoutFrame(TOC_FRAME_NAME);
  tocFrame.x = x;
  tocFrame.y = y;

  const pages = figma.root.children.filter((page) => page.name !== SUMMARY_PAGE_NAME);
  for (const page of pages) {
    const pageAutoLayoutFrame = createAutoLayoutFrame(`${page.name} page`);
    pageAutoLayoutFrame.appendChild(createTextNode(page));
    
    const artboardListAutoLayoutFrame = createAutoLayoutFrame(`${page.name} artboards`);
    artboardListAutoLayoutFrame.paddingLeft = INDENTATION_WIDTH;
    for (const frame of page.children.filter((node) => node.type === 'FRAME')) {
      const artboardNode = createTextNode(frame);
      artboardNode.x = INDENTATION_WIDTH;
      artboardListAutoLayoutFrame.appendChild(artboardNode);
    }
    pageAutoLayoutFrame.appendChild(artboardListAutoLayoutFrame);
    tocFrame.appendChild(pageAutoLayoutFrame);
  }
  return tocFrame;
}
