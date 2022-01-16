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

interface UpdateIncomingMessageData {
  titles: string[];
  includePrefix: string;
  excludePrefix: string;
}

interface LoadTitleIncomingMessageData {
  loadTitles: LoadType;
}

interface LoadTitleOutgoingMessageData {
  titles: string[];
}

interface ErrorOutgoingMessageData {
  error: string;
}

type IncomingMessageData = UpdateIncomingMessageData | LoadTitleIncomingMessageData;

const CLIENT_STORAGE_SECTIONS_KEY = 'sections';

(async function init() {
  await Promise.all(Array.from(FONTS_MAP.values()).map((font) => figma.loadFontAsync(font.fontName)));

  try {
    figma.showUI(__html__, {width: 420, height: 500});

    const initialTitles = await getTitles(LoadType.PARSED, true);
    figma.ui.postMessage({titles: initialTitles} as LoadTitleOutgoingMessageData);

    figma.ui.onmessage = async (message: IncomingMessageData) => {
      try {
        if (checkIsUpdateMessage(message)) {
          createAndUpdate(message.titles || [], message.includePrefix, message.excludePrefix);
          figma.closePlugin();
        }

        if (checkIsLoadTitleMessage(message)) {
          figma.ui.postMessage({titles: await getTitles(message.loadTitles)} as LoadTitleOutgoingMessageData);
        }
      } catch (error) {
        console.error(error.message)
        figma.ui.postMessage({error: error.message} as ErrorOutgoingMessageData);
      }
    }
  } catch (error) {
    console.error(error);
  }
})();

function checkIsLoadTitleMessage(message: IncomingMessageData): message is LoadTitleIncomingMessageData {
  return !!(message as LoadTitleIncomingMessageData).loadTitles;
}

function checkIsUpdateMessage(message: IncomingMessageData): message is UpdateIncomingMessageData {
  return !!(message as UpdateIncomingMessageData).titles;
}

function createAndUpdate(sectionTitles: string[], includePrefix = '', excludePrefix = ''): void {
  const validTitles = cleanTitles(sectionTitles);
  createPageSections(validTitles);
  renderCover();
  renderToc(validTitles, includePrefix, excludePrefix);

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
