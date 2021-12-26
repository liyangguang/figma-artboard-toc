import {COVER_PAGE_NAME, TOC_PAGE_NAME, UNCATEGORIZED_PAGE_NAME, PAGE_NAMES_TO_IGNORE, DIVIDE_LING_PAGE_NAME, PAGE_PREFIX} from './STATIC_DATA';
import {createPage, focusToPage, appendTextNode, findChildByName, movePage} from './helpers';

const EMPTY_PAGE_MESSAGE = 'This page is intentionally empty.';
const _PLUGIN_DATA_KEY = 'sectionName';

export function createPageSections(sectionTitle: string[]) {
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

export function parseExistingPages(): string[] {
  let currentGroup = '';
  let isPreviousDividingLine = false;
  const titles: string[] = [];
  for (const page of figma.root.children) {
    if (!currentGroup && [TOC_PAGE_NAME, COVER_PAGE_NAME].includes(page.name)) continue;

    if (page.name === DIVIDE_LING_PAGE_NAME) {
      isPreviousDividingLine = true;
      continue;
    } else {
      if (isPreviousDividingLine) {
        titles.push(page.name);
      }

      if (currentGroup) {
        // TODO: This doesn't seem to work.
        page.setPluginData(_PLUGIN_DATA_KEY, currentGroup);
      }

      isPreviousDividingLine = false;
    }
  }
  return titles;
}

function checkEmptyFile(): string|null {
  const isEmptyFile = figma.root.children.length === 1 && !figma.root.children[0].children.length;
  return isEmptyFile ? figma.root.children[0].name : null;
}

function insertCoverAndToc(): void {
  createPage(COVER_PAGE_NAME);
  createPage(TOC_PAGE_NAME);

  movePage(COVER_PAGE_NAME, 0);
  movePage(TOC_PAGE_NAME, 1);
}

function insertSections(sectionTitle: string[]): void {
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
