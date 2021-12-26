import {FONTS_MAP, TOC_PAGE_NAME, DEFAULT_SECTION_TITLES} from './STATIC_DATA';
import {renderToc} from './toc';
import {renderCover} from './cover';
import {createPageSections, parseExistingPages} from './page_sections';
import {focusToPage} from './helpers';

(async function start() {
  await Promise.all(Array.from(FONTS_MAP.values()).map((font) => figma.loadFontAsync(font)));

  try {
    const existingSections = parseExistingPages();
    const sectionsToUse = existingSections.length ? existingSections : DEFAULT_SECTION_TITLES;

    // TODO: Add an UI to edit those
    console.log(sectionsToUse);

    createPageSections(sectionsToUse);
    renderCover();
    renderToc(sectionsToUse);
  
    focusToPage(TOC_PAGE_NAME)
  } catch (error) {
    console.error(error);
  } finally {
    figma.closePlugin();
  }
})();
