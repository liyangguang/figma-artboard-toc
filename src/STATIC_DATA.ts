// Page names
export const COVER_PAGE_NAME = '🌌 Cover';
export const TOC_PAGE_NAME = '📖 Table of contents';
export const UNCATEGORIZED_PAGE_NAME = 'Un-categorized pages';
export const DIVIDE_LING_PAGE_NAME = '________________________________________';
export const PAGE_PREFIX = '↳';
export const PAGE_NAMES_TO_IGNORE = [COVER_PAGE_NAME, TOC_PAGE_NAME, UNCATEGORIZED_PAGE_NAME, DIVIDE_LING_PAGE_NAME];

export const DEFAULT_SECTION_TITLES = [
  '🏁 Ready',
  '✏️ Work in progress',
  '🔎 Research',
  '_💡 Ideas',
];

// Styles
export const FONT_SIZE_BASE = 14;
export const INDENTATION_WIDTH = FONT_SIZE_BASE * 2;
export const COVER_SIZE = [1920, 1080];

export enum FontEnum {
  NORMAL,
  TITLE,
  NOTE,
}

interface Font {
  fontName: FontName;
  fontSize: number;
}

export const FONTS_MAP = new Map<FontEnum, Font>([
  [FontEnum.NORMAL, {fontSize: FONT_SIZE_BASE, fontName: {family: 'Roboto', style: 'Regular'}}],
  [FontEnum.TITLE, {fontSize: FONT_SIZE_BASE * 1.2, fontName: {family: 'Roboto', style: 'Bold'}}],
  [FontEnum.NOTE, {fontSize: FONT_SIZE_BASE * .8, fontName: {family: 'Roboto', style: 'Regular'}}],
]);
