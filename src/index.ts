import {FONTS_MAP, TOC_PAGE_NAME} from './STATIC_DATA';
import {renderToc} from './toc';
import {renderCover} from './cover';
import {createPageSections} from './page_sections';
import {focusToPage} from './helpers';

const PAGE_SECTION_TITLES = [
  '🟢 Ready',
  '🟣 Work in progress',
  '🔵 Research',
  '_🟠 Sand box',
];

(async function start() {
  await Promise.all(Array.from(FONTS_MAP.values()).map((font) => figma.loadFontAsync(font)));

  try {
    createPageSections(PAGE_SECTION_TITLES);
    renderCover();
    renderToc(PAGE_SECTION_TITLES);
  
    focusToPage(TOC_PAGE_NAME)
  } catch (error) {
    console.error(error);
  } finally {
    figma.closePlugin();
  }
})();
