// figma.currentPage.selection = nodes;
// figma.viewport.scrollAndZoomIntoView(nodes);
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const TOC_PAGE_NAME = 'Table of contents';
const FONT_SIZE_BASE = 14;
const INDENTATION_WIDTH = 20;
var FontEnum;
(function (FontEnum) {
    FontEnum[FontEnum["REGULAR"] = 0] = "REGULAR";
    FontEnum[FontEnum["BOLD"] = 1] = "BOLD";
})(FontEnum || (FontEnum = {}));
const FONTS_MAP = new Map([
    [FontEnum.REGULAR, { family: 'Roboto', style: 'Regular' }],
    [FontEnum.BOLD, { family: 'Roboto', style: 'Bold' }],
]);
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        yield Promise.all(Array.from(FONTS_MAP.values()).map((font) => figma.loadFontAsync(font)));
        renderToc();
        figma.closePlugin();
    });
}
function renderToc() {
    let tocPage = figma.root.findChild((page) => page.name === TOC_PAGE_NAME);
    if (!tocPage) {
        tocPage = figma.createPage();
        tocPage.name = TOC_PAGE_NAME;
    }
    tocPage.appendChild(getTocFrame());
}
function getTocFrame() {
    const tocFrame = figma.createFrame();
    tocFrame.name = new Date().toLocaleString(); // Not sure what else to use for the name
    let yPosition = 0;
    let widest = 0;
    const pages = figma.root.children.filter((page) => page.name !== TOC_PAGE_NAME);
    for (const page of pages) {
        const node = createTextNode(page);
        node.y = yPosition;
        tocFrame.appendChild(node);
        yPosition += node.height;
        widest = Math.max(node.width, widest);
        for (const frame of page.children.filter((node) => node.type === 'FRAME')) {
            const node = createTextNode(frame);
            node.y = yPosition;
            tocFrame.appendChild(node);
            yPosition += node.height;
            node.x = INDENTATION_WIDTH;
            widest = Math.max(node.width + INDENTATION_WIDTH, widest);
        }
    }
    tocFrame.resize(widest, yPosition + FONT_SIZE_BASE);
    return tocFrame;
}
function createTextNode(node) {
    const textNode = figma.createText();
    textNode.hyperlink = { type: 'NODE', value: node.id };
    textNode.textDecoration = 'UNDERLINE';
    textNode.characters = node.name;
    textNode.fontSize = FONT_SIZE_BASE * (node.type === 'PAGE' ? 1.5 : 1);
    textNode.fontName = FONTS_MAP.get(node.type === 'PAGE' ? FontEnum.BOLD : FontEnum.REGULAR);
    return textNode;
}
start();