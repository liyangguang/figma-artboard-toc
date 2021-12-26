import {FONTS_MAP, TOC_PAGE_NAME, DEFAULT_SECTION_TITLES} from './STATIC_DATA';
import {renderToc} from './toc';
import {renderCover} from './cover';
import {createPageSections, parseExistingPages} from './page_sections';
import {focusToPage} from './helpers';

enum LoadType {
  SAVED = 'SAVED',
  DEFAULT = 'DEFAULT',
  PARSED = 'PARSED',
}

interface PostMessageData {
  titles?: string[];
  error?: string;
  loadTitles?: LoadType;
}

const CLIENT_STORAGE_SECTIONS_KEY = 'sections';

(async function init() {
  await Promise.all(Array.from(FONTS_MAP.values()).map((font) => figma.loadFontAsync(font.fontName)));

  try {
    figma.showUI(__html__, {width: 320, height: 400});

    const initialTitles = await getTitles(LoadType.PARSED, true);
    figma.ui.postMessage({titles: initialTitles} as PostMessageData);

    figma.ui.onmessage = async (message: PostMessageData) => {
      try {
        if (message.titles) {
          createAndUpdate(message.titles || []);
          figma.closePlugin();
        }

        if (message.loadTitles) {
          figma.ui.postMessage({titles: await getTitles(message.loadTitles)} as PostMessageData);
        }
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

async function getTitles(loadType: LoadType, withFallback = false): Promise<string[]> {
  switch (loadType) {
    case LoadType.DEFAULT: return DEFAULT_SECTION_TITLES;
    case LoadType.PARSED:
      const parsedSections = cleanTitles(parseExistingPages());
      return parsedSections?.length || !withFallback ? parsedSections : DEFAULT_SECTION_TITLES;
    case LoadType.SAVED:
      const savedValue = cleanTitles(await figma.clientStorage.getAsync(CLIENT_STORAGE_SECTIONS_KEY));
      return savedValue?.length || !withFallback ? savedValue : DEFAULT_SECTION_TITLES;
  }
}

function cleanTitles(titles: string[] = []): string[] {
  return titles.map((title) => title.trim()).filter(String);
}
