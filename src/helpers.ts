import {SUMMARY_PAGE_NAME, FONT_SIZE_BASE, FontEnum, FONTS_MAP} from './styles';

export function getStartPage(): PageNode {
  const foundPage = figma.root.findChild((page) => page.name === SUMMARY_PAGE_NAME);
  if (foundPage) return foundPage;

  const newPage = figma.createPage();
  newPage.name = SUMMARY_PAGE_NAME;
  return newPage;
} 

export function appendFrame(parent: FrameNode|PageNode, name: string, isAutoLayout = false): FrameNode {
  const frame = figma.createFrame();
  frame.name = name;
  if (isAutoLayout) {
    frame.layoutMode = 'VERTICAL';
    frame.counterAxisSizingMode = 'AUTO';
    frame.itemSpacing = FONT_SIZE_BASE * .5;
    frame.verticalPadding = FONT_SIZE_BASE * .4;
    frame.horizontalPadding = FONT_SIZE_BASE * .8;
  }
  parent.appendChild(frame);
  return frame
}

export function appendTextNode(parent: FrameNode, name: string, link: HyperlinkTarget|null = null, isLargerFont = false): TextNode {
  const textNode = figma.createText();
  textNode.characters = name;
  textNode.fontSize = FONT_SIZE_BASE * (isLargerFont ? 1.2 : 1);
  textNode.fontName = FONTS_MAP.get(isLargerFont ? FontEnum.BOLD : FontEnum.REGULAR);
  if (link) {
    textNode.hyperlink = link;
    textNode.textDecoration = 'UNDERLINE';
  }
  parent.appendChild(textNode);

  return textNode;
}
