export const SUMMARY_PAGE_NAME = '_START';
export const FONT_SIZE_BASE = 14;
export const INDENTATION_WIDTH = FONT_SIZE_BASE * 1.5;

export enum FontEnum {
  REGULAR,
  BOLD,
}

export const FONTS_MAP = new Map([
  [FontEnum.REGULAR, { family: 'Roboto', style: 'Regular' }],
  [FontEnum.BOLD, { family: 'Roboto', style: 'Bold' }],
]);
