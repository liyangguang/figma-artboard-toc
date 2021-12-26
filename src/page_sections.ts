import {COVER_PAGE_NAME, TOC_PAGE_NAME, DIVIDE_LING_PAGE_NAME, PAGE_PREFIX} from './STATIC_DATA';
import {createPage, focusToPage, appendTextNode, findChildByName} from './helpers';

const EMPTY_PAGE_MESSAGE = 'This page is intentionally empty.';

export function createPageSections(sectionTitle: string[]) {
  const isNewFile = figma.root.children.length === 1 && !figma.root.children[0].children.length;

  createPage(COVER_PAGE_NAME);
  createPage(TOC_PAGE_NAME);
  for (const name of sectionTitle) {
    if (!findChildByName(name)) {
      const dividingPage = createPage(DIVIDE_LING_PAGE_NAME, false);
      appendTextNode(dividingPage, `${EMPTY_PAGE_MESSAGE} It's just a dividing line for page sections.`);
      
      const titlePage = createPage(name);
      appendTextNode(titlePage, `${EMPTY_PAGE_MESSAGE} It's just a the title of page sections.`);

      createPage(`${PAGE_PREFIX} [Your design page 1]`, false);
      createPage(`${PAGE_PREFIX} [Your design page 2]`, false);
    }
  }

  if (isNewFile) {
    focusToPage(TOC_PAGE_NAME);
    figma.root.children[0].remove();
  }
}
