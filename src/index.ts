import {FONTS_MAP, COVER_SIZE} from './styles';
import {renderToc} from './toc';
import {renderCover} from './cover';

(async function start() {
  await Promise.all(Array.from(FONTS_MAP.values()).map((font) => figma.loadFontAsync(font)));

  renderCover(COVER_SIZE[0], COVER_SIZE[1]);
  renderToc(COVER_SIZE[0] + 80, 0);

  figma.closePlugin();
})();
