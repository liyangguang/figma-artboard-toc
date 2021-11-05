import {SUMMARY_PAGE_NAME, FONT_SIZE_BASE, FontEnum, FONTS_MAP} from './styles';

export function getOurPage(): PageNode {
  const foundPage = figma.root.findChild((page) => page.name === SUMMARY_PAGE_NAME);
  if (foundPage) return foundPage;

  const newPage = figma.createPage();
  newPage.name = SUMMARY_PAGE_NAME;
  return newPage;
} 

export function createAutoLayoutFrame(name): FrameNode {
  const frame = figma.createFrame();
  frame.name = name;
  frame.layoutMode = 'VERTICAL';
  frame.counterAxisSizingMode = 'AUTO';
  frame.itemSpacing = FONT_SIZE_BASE * .5;
  frame.verticalPadding = FONT_SIZE_BASE * .4;
  frame.horizontalPadding = FONT_SIZE_BASE * .8;
  return frame
}

export function createTextNode(node): TextNode {
  const textNode = figma.createText();
  textNode.hyperlink = { type: 'NODE', value: node.id };
  textNode.textDecoration = 'UNDERLINE';
  textNode.characters = node.name;
  textNode.fontSize = FONT_SIZE_BASE * (node.type === 'PAGE' ? 1.2 : 1);
  textNode.fontName = FONTS_MAP.get(node.type === 'PAGE' ? FontEnum.BOLD : FontEnum.REGULAR);

  return textNode;
}
