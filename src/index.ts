import {FONTS_MAP, COVER_SIZE} from './styles';
import {renderToc} from './toc';
import {renderCover} from './cover';
import {getStartPage} from './helpers';

(async function start() {
  await Promise.all(Array.from(FONTS_MAP.values()).map((font) => figma.loadFontAsync(font)));

  const startPage = getStartPage();
  // TODO: Move this page to be the 1st in the page list sidebar
  const coverFrame = renderCover(COVER_SIZE[0], COVER_SIZE[1]);
  const tocFrame = renderToc(COVER_SIZE[0] + 80, 0);

  figma.currentPage = startPage;
  figma.viewport.scrollAndZoomIntoView([coverFrame, tocFrame]);

  figma.closePlugin();
})();
