import {FONTS_MAP, TOC_PAGE_NAME, DEFAULT_SECTION_TITLES} from './STATIC_DATA';
import {renderToc} from './toc';
import {renderCover} from './cover';
import {createPageSections, parseExistingPages} from './page_sections';
import {focusToPage} from './helpers';

interface PostMessageData {
  initialSectionTitles?: string[];
  error?: string;
}

const CLIENT_STORAGE_SECTIONS_KEY = 'sections';

(async function init() {
  await Promise.all(Array.from(FONTS_MAP.values()).map((font) => figma.loadFontAsync(font)));

  try {
    const existingSections = parseExistingPages();

    figma.showUI(__html__);

    const initialSectionTitles = await getInitialTitleList(existingSections);

    figma.ui.postMessage({initialSectionTitles} as PostMessageData);

    figma.ui.onmessage = (message) => {
      try {
        createAndUpdate(message);
        figma.closePlugin();
      } catch (error) {
        console.log(error.message)
        figma.ui.postMessage({error: error.message} as PostMessageData);
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

  focusToPage(TOC_PAGE_NAME);
  figma.clientStorage.setAsync(CLIENT_STORAGE_SECTIONS_KEY, sectionTitles);
}

async function getInitialTitleList(existingSections: string[]): Promise<string[]> {
  if (existingSections?.length) return existingSections;

  const savedValue = await figma.clientStorage.getAsync(CLIENT_STORAGE_SECTIONS_KEY);
  if (savedValue) return savedValue;

  return DEFAULT_SECTION_TITLES;
}
