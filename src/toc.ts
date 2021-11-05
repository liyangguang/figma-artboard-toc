import {SUMMARY_PAGE_NAME, FONT_SIZE_BASE, INDENTATION_WIDTH, FontEnum, FONTS_MAP} from './styles';

const TOC_FRAME_NAME = 'Table of contents';

export function renderToc(): void {
  let tocPage = figma.root.findChild((page) => page.name === SUMMARY_PAGE_NAME);
  if (!tocPage) {
    tocPage = figma.createPage();
    tocPage.name = SUMMARY_PAGE_NAME;
  } else {
    const tocFrame = tocPage.findChild((node) => node.type === 'FRAME' && node.name === TOC_FRAME_NAME);
    if (tocFrame) {
      tocFrame.remove();
    }
  }

  tocPage.appendChild(getTocFrame());
}

function getTocFrame(): FrameNode {
  const tocFrame = createAutoLayoutFrame(TOC_FRAME_NAME);

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

function createAutoLayoutFrame(name) {
  const frame = figma.createFrame();
  frame.name = name;
  frame.layoutMode = 'VERTICAL';
  frame.counterAxisSizingMode = 'AUTO';
  frame.itemSpacing = FONT_SIZE_BASE * .5;
  frame.verticalPadding = FONT_SIZE_BASE * .4;
  frame.horizontalPadding = FONT_SIZE_BASE * .8;
  return frame
}

function createTextNode(node): TextNode {
  const textNode = figma.createText();
  textNode.hyperlink = { type: 'NODE', value: node.id };
  textNode.textDecoration = 'UNDERLINE';
  textNode.characters = node.name;
  textNode.fontSize = FONT_SIZE_BASE * (node.type === 'PAGE' ? 1.2 : 1);
  textNode.fontName = FONTS_MAP.get(node.type === 'PAGE' ? FontEnum.BOLD : FontEnum.REGULAR);

  return textNode;
}
