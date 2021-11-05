import {SUMMARY_PAGE_NAME, INDENTATION_WIDTH} from './styles';
import {appendFrame, appendTextNode, getStartPage} from './helpers';

const TOC_FRAME_NAME = 'Table of contents';

export function renderToc(x: number, y: number): FrameNode {
  const startPage = getStartPage();

  const tocFrame = startPage.findChild((node) => node.type === 'FRAME' && node.name === TOC_FRAME_NAME) as FrameNode;
  if (tocFrame) {
    tocFrame.remove();
  }
  

  const newTocFrame = appendFrame(startPage, TOC_FRAME_NAME, true);
  newTocFrame.x = x;
  newTocFrame.y = y;
  renderTocContent(newTocFrame);

  return newTocFrame;
}

function renderTocContent(tocFrame: FrameNode): void {
  const pages = figma.root.children.filter((page) => page.name !== SUMMARY_PAGE_NAME);
  for (const page of pages) {
    const pageAutoLayoutFrame = appendFrame(tocFrame, `${page.name} page`, true);
    appendTextNode(pageAutoLayoutFrame, page.name, {type: 'NODE', value: page.id}, true);

    const artboardListAutoLayoutFrame = appendFrame(pageAutoLayoutFrame, `${page.name} artboards`, true);
    artboardListAutoLayoutFrame.paddingLeft = INDENTATION_WIDTH;
    // TODO: More flexible filtering: include, exclude with name of the frame (name starts with some emojis)
    for (const frame of page.children.filter((node) => node.type === 'FRAME')) {
      const artboardNode = appendTextNode(artboardListAutoLayoutFrame, frame.name, {type: 'NODE', value: frame.id});
      artboardNode.x = INDENTATION_WIDTH;
    }
  }
}
