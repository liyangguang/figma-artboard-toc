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
  await Promise.all(Array.from(FONTS_MAP.values()).map((font) => figma.loadFontAsync(font.fontName)));

  try {
    const existingSections = parseExistingPages();

    figma.showUI(__html__, {width: 360, height: 500});

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
  const validTitles = cleanTitles(sectionTitles);
  createPageSections(validTitles);
  renderCover();
  renderToc(validTitles);

  focusToPage(TOC_PAGE_NAME);
  figma.clientStorage.setAsync(CLIENT_STORAGE_SECTIONS_KEY, validTitles);
}

async function getInitialTitleList(existingSections: string[]): Promise<string[]> {
  if (cleanTitles(existingSections)?.length) return cleanTitles(existingSections);

  const savedValue = await figma.clientStorage.getAsync(CLIENT_STORAGE_SECTIONS_KEY);
  if (cleanTitles(savedValue)) return cleanTitles(savedValue);

  return cleanTitles(DEFAULT_SECTION_TITLES);
}

function cleanTitles(titles: string[]): string[] {
  return titles.map((title) => title.trim()).filter(String);
}
