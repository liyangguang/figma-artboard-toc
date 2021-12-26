'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

// Page names
const COVER_PAGE_NAME = '🌌 Cover';
const TOC_PAGE_NAME = '📖 Table of contents';
const UNCATEGORIZED_PAGE_NAME = 'Un-categorized pages';
const DIVIDE_LING_PAGE_NAME = '________________________________________';
const PAGE_PREFIX = '↳';
const PAGE_NAMES_TO_IGNORE = [COVER_PAGE_NAME, TOC_PAGE_NAME, UNCATEGORIZED_PAGE_NAME, DIVIDE_LING_PAGE_NAME];
const DEFAULT_SECTION_TITLES = [
    '🏁 Ready',
    '✏️ Work in progress',
    '🔎 Research',
    '_💡 Ideas',
];
// Styles
const FONT_SIZE_BASE = 14;
const INDENTATION_WIDTH = FONT_SIZE_BASE * 2;
var FontEnum;
(function (FontEnum) {
    FontEnum[FontEnum["NORMAL"] = 0] = "NORMAL";
    FontEnum[FontEnum["TITLE"] = 1] = "TITLE";
    FontEnum[FontEnum["NOTE"] = 2] = "NOTE";
})(FontEnum || (FontEnum = {}));
const FONTS_MAP = new Map([
    [FontEnum.NORMAL, { fontSize: FONT_SIZE_BASE, fontName: { family: 'Roboto', style: 'Regular' } }],
    [FontEnum.TITLE, { fontSize: FONT_SIZE_BASE * 1.2, fontName: { family: 'Roboto', style: 'Bold' } }],
    [FontEnum.NOTE, { fontSize: FONT_SIZE_BASE * .8, fontName: { family: 'Roboto', style: 'Regular' } }],
]);

function createPage(name, checkExisting = true) {
    const existingPage = findChildByName(name);
    if (checkExisting && existingPage)
        return existingPage;
    const page = figma.createPage();
    page.name = name;
    return page;
}
function movePage(page, index) {
    const pageNode = typeof page === 'string' ? findChildByName(page) : page;
    figma.root.insertChild(index, pageNode);
}
function findChildByName(name, parent = figma.root) {
    return parent.findChild((node) => node.name === name);
}
function appendFrame(parent, name, isAutoLayout = false) {
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
    return frame;
}
function appendTextNode(parent, name, linkId = null, font = FontEnum.NORMAL) {
    const textNode = figma.createText();
    textNode.characters = name.trim();
    const fontValue = FONTS_MAP.get(font);
    textNode.fontSize = fontValue.fontSize;
    textNode.fontName = fontValue.fontName;
    if (linkId) {
        textNode.hyperlink = { type: 'NODE', value: linkId };
        textNode.textDecoration = 'UNDERLINE';
    }
    parent.appendChild(textNode);
    return textNode;
}
function focusToPage(name) {
    figma.currentPage = findChildByName(name);
    figma.viewport.scrollAndZoomIntoView(figma.currentPage.children);
}

const TOC_FRAME_NAME = 'table of contents';
function renderToc(sectionTitles) {
    const tocPage = findChildByName(TOC_PAGE_NAME);
    const tocFrame = tocPage.findChild((node) => node.type === 'FRAME' && node.name === TOC_FRAME_NAME);
    if (tocFrame) {
        tocFrame.remove();
    }
    const newTocFrame = appendFrame(tocPage, TOC_FRAME_NAME, true);
    renderTocContent(newTocFrame, sectionTitles);
    if (!newTocFrame.children.length) {
        appendTextNode(newTocFrame, 'No ToC. All your pages are empty', null, FontEnum.TITLE);
        appendTextNode(newTocFrame, `All page sections are created. Now it's design time!`);
        appendTextNode(newTocFrame, `Use the pages with arrow prefix for your design. You can add/remove those pages as well.`);
        appendTextNode(newTocFrame, `Your page names and artboard names will be used on the ToC.`);
    }
    else {
        appendTextNode(newTocFrame, `Click on each item to go to the page/artboard`, null, FontEnum.NOTE);
    }
    appendTextNode(newTocFrame, 'Re-run ToC+ anytime to refresh ToC.', null, FontEnum.NOTE);
    return newTocFrame;
}
function renderTocContent(tocFrame, sectionTitles) {
    const sections = groupsPagesIntoSections(sectionTitles);
    for (const section of sections) {
        if (section.title.startsWith('_'))
            continue;
        const nonHiddenPagesInThisSection = section.pages.filter((page) => !page.name.startsWith('_'));
        if (!nonHiddenPagesInThisSection.length)
            continue;
        // Add section frame and title
        const sectionFrame = appendFrame(tocFrame, `${section.title} section`, true);
        appendTextNode(sectionFrame, section.title, null, FontEnum.TITLE);
        for (const page of nonHiddenPagesInThisSection) {
            // Ignore empty page, and pages under hidden sections
            const artboardsInThisPage = page.children.filter((node) => node.type === 'FRAME' && !node.name.startsWith('_'));
            if (!artboardsInThisPage.length)
                continue;
            // Add page frame and title
            const pageAutoLayoutFrame = appendFrame(sectionFrame, `${page.name} page`, true);
            appendTextNode(pageAutoLayoutFrame, page.name.replace(PAGE_PREFIX, ''), page.id);
            // Add all the artboards
            const artboardListAutoLayoutFrame = appendFrame(pageAutoLayoutFrame, `${page.name} artboards`, true);
            artboardListAutoLayoutFrame.paddingLeft = INDENTATION_WIDTH;
            for (const frame of artboardsInThisPage) {
                const artboardNode = appendTextNode(artboardListAutoLayoutFrame, frame.name, frame.id);
                artboardNode.x = INDENTATION_WIDTH;
            }
        }
        removeFrameWithoutChildren(sectionFrame);
    }
}
function groupsPagesIntoSections(sectionTitles) {
    const result = [];
    let currentSection;
    for (const page of figma.root.children.filter((page) => !PAGE_NAMES_TO_IGNORE.includes(page.name))) {
        if (sectionTitles.includes(page.name)) {
            currentSection = { title: page.name, pages: [] };
            result.push(currentSection);
            continue;
        }
        if (!currentSection) {
            currentSection = { title: 'Ungrouped pages', pages: [] };
            result.push(currentSection);
        }
        currentSection.pages.push(page);
    }
    return result;
}
function removeFrameWithoutChildren(node) {
    if (!node)
        return;
    if (node.children.length === 1 && node.children[0].type === 'TEXT') {
        node.remove();
    }
}

const COVER_FRAME_NAME = 'cover';
const LAST_UPDATED_NAME = 'Last updated (auto update by ToC+)';
const COVER_DIMENSIONS = [1024, 576];
const PADDING = 16;
function renderCover() {
    const coverPage = findChildByName(COVER_PAGE_NAME);
    let coverFrame = coverPage.findChild((node) => node.type === 'FRAME' && node.name === COVER_FRAME_NAME);
    if (!coverFrame) {
        coverFrame = appendFrame(coverPage, COVER_FRAME_NAME);
        coverFrame.resize(COVER_DIMENSIONS[0], COVER_DIMENSIONS[1]);
        renderCoverFrame(coverFrame);
    }
    updateLastUpdated(coverFrame);
    return coverFrame;
}
function updateLastUpdated(frame) {
    const textNode = frame.findChild((node) => node.name === LAST_UPDATED_NAME) || appendTextNode(frame, LAST_UPDATED_NAME);
    textNode.name = LAST_UPDATED_NAME;
    textNode.characters = `Last updated: ${new Date().toLocaleDateString()}`;
    textNode.x = COVER_DIMENSIONS[0] - textNode.width - PADDING;
    textNode.y = COVER_DIMENSIONS[1] - textNode.height - PADDING;
}
function renderCoverFrame(frame) {
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

const EMPTY_PAGE_MESSAGE = 'This page is intentionally empty.';
function createPageSections(sectionTitle) {
    // Check before inserting any pages
    const emptyPageName = checkEmptyFile();
    // Insert pages
    insertCoverAndToc();
    insertSections(sectionTitle);
    focusToPage(TOC_PAGE_NAME);
    // Must remove focus first then remove
    if (emptyPageName) {
        findChildByName(emptyPageName).remove();
    }
}
function parseExistingPages() {
    let isPreviousDividingLine = false;
    const titles = [];
    for (const page of figma.root.children) {
        if ([TOC_PAGE_NAME, COVER_PAGE_NAME].includes(page.name))
            continue;
        if (page.name === DIVIDE_LING_PAGE_NAME) {
            isPreviousDividingLine = true;
            continue;
        }
        else {
            if (isPreviousDividingLine) {
                titles.push(page.name);
            }
            isPreviousDividingLine = false;
        }
    }
    return titles;
}
function checkEmptyFile() {
    const isEmptyFile = figma.root.children.length === 1 && !figma.root.children[0].children.length;
    return isEmptyFile ? figma.root.children[0].name : null;
}
function insertCoverAndToc() {
    createPage(COVER_PAGE_NAME);
    createPage(TOC_PAGE_NAME);
    movePage(COVER_PAGE_NAME, 0);
    movePage(TOC_PAGE_NAME, 1);
}
function insertSections(sectionTitle) {
    for (const name of sectionTitle) {
        if (!findChildByName(name)) {
            const dividingPage = createPage(DIVIDE_LING_PAGE_NAME, false);
            appendTextNode(dividingPage, `${EMPTY_PAGE_MESSAGE} It's just a dividing line for page sections.`);
            const titlePage = createPage(name);
            appendTextNode(titlePage, `${EMPTY_PAGE_MESSAGE} It's just a the title of page sections.`);
            createPage(`${PAGE_PREFIX} [Your page 1]`, false);
            createPage(`${PAGE_PREFIX} [Your page 2]`, false);
        }
    }
}

const CLIENT_STORAGE_SECTIONS_KEY = 'sections';
(function init() {
    return __awaiter(this, void 0, void 0, function* () {
        yield Promise.all(Array.from(FONTS_MAP.values()).map((font) => figma.loadFontAsync(font.fontName)));
        try {
            const existingSections = parseExistingPages();
            figma.showUI(__html__, { width: 360, height: 500 });
            const initialSectionTitles = yield getInitialTitleList(existingSections);
            figma.ui.postMessage({ initialSectionTitles });
            figma.ui.onmessage = (message) => {
                try {
                    createAndUpdate(message);
                    figma.closePlugin();
                }
                catch (error) {
                    console.log(error.message);
                    figma.ui.postMessage({ error: error.message });
                }
            };
        }
        catch (error) {
            console.error(error);
        }
    });
})();
function createAndUpdate(sectionTitles) {
    const validTitles = cleanTitles(sectionTitles);
    createPageSections(validTitles);
    renderCover();
    renderToc(validTitles);
    focusToPage(TOC_PAGE_NAME);
    figma.clientStorage.setAsync(CLIENT_STORAGE_SECTIONS_KEY, validTitles);
}
function getInitialTitleList(existingSections) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if ((_a = cleanTitles(existingSections)) === null || _a === void 0 ? void 0 : _a.length)
            return cleanTitles(existingSections);
        const savedValue = yield figma.clientStorage.getAsync(CLIENT_STORAGE_SECTIONS_KEY);
        if (cleanTitles(savedValue))
            return cleanTitles(savedValue);
        return cleanTitles(DEFAULT_SECTION_TITLES);
    });
}
function cleanTitles(titles) {
    return titles.map((title) => title.trim()).filter(String);
}
