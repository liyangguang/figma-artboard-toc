import {FONTS_MAP} from './styles';
import {renderToc} from './toc';

async function start() {
  await Promise.all(Array.from(FONTS_MAP.values()).map((font) => figma.loadFontAsync(font)));

  renderToc();

  figma.closePlugin();
}

start();
