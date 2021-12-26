import {FONTS_MAP, TOC_PAGE_NAME, DEFAULT_SECTION_TITLES} from './STATIC_DATA';
import {renderToc} from './toc';
import {renderCover} from './cover';
import {createPageSections, parseExistingPages} from './page_sections';
import {focusToPage} from './helpers';

(async function init() {
  await Promise.all(Array.from(FONTS_MAP.values()).map((font) => figma.loadFontAsync(font)));

  try {
    const existingSections = parseExistingPages();

    figma.showUI(__html__);

    figma.ui.postMessage({existingSections: existingSections.length ? existingSections : DEFAULT_SECTION_TITLES});

    figma.ui.onmessage = (message) => {
      try {
        createAndUpdate(message);
        figma.closePlugin();
      } catch (error) {
        console.log(error.message)
        figma.ui.postMessage({error: error.message});
      }
    }
  } catch (error) {
    console.error(error);
  }
})();

function createAndUpdate(sectionTitles: string[]): void {
  createPageSections(sectionTitles);
  renderCover();
  renderToc(sectionTitles);

  focusToPage(TOC_PAGE_NAME)
}
