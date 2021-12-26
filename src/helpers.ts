import {FONT_SIZE_BASE, FontEnum, FONTS_MAP} from './STATIC_DATA';

export function createPage(name: string, checkExisting = true): PageNode {
  const existingPage = findChildByName(name);
  if (checkExisting && existingPage) return existingPage;

  const page = figma.createPage();
  page.name = name;
  return page;
}

export function movePage(page: string|PageNode, index: number): void {
  const pageNode = typeof page === 'string' ? findChildByName(page) : page;
  figma.root.insertChild(index, pageNode);
}

export function findChildByName(name: string, parent = figma.root) {
  return parent.findChild((node) => node.name === name);
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

export function appendTextNode(parent: FrameNode|PageNode, name: string, linkId: string|null = null, font = FontEnum.NORMAL): TextNode {
  const textNode = figma.createText();
  textNode.characters = name.trim();

  const fontValue = FONTS_MAP.get(font);
  textNode.fontSize = fontValue.fontSize;
  textNode.fontName = fontValue.fontName;

  if (linkId) {
    textNode.hyperlink = {type: 'NODE', value: linkId};
    textNode.textDecoration = 'UNDERLINE';
  }
  parent.appendChild(textNode);

  return textNode;
}

export function focusToPage(name: string) {
  figma.currentPage = findChildByName(name);
  figma.viewport.scrollAndZoomIntoView(figma.currentPage.children);
}
