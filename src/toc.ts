import {PAGE_NAMES_TO_IGNORE, INDENTATION_WIDTH, TOC_PAGE_NAME, PAGE_PREFIX, FontEnum} from './STATIC_DATA';
import {appendFrame, appendTextNode, findChildByName} from './helpers';

const TOC_FRAME_NAME = 'table of contents';

export function renderToc(sectionTitles: string[]): FrameNode {
  const tocPage = findChildByName(TOC_PAGE_NAME);

  const tocFrame = tocPage.findChild((node) => node.type === 'FRAME' && node.name === TOC_FRAME_NAME) as FrameNode;
  if (tocFrame) {
    tocFrame.remove();
  }  

  const newTocFrame = appendFrame(tocPage, TOC_FRAME_NAME, true);
  renderTocContent(newTocFrame, sectionTitles);

  if (!newTocFrame.children.length) {
    appendTextNode(newTocFrame, 'No ToC. All your pages are empty', null, FontEnum.TITLE);
    appendTextNode(newTocFrame, `All page sections are created. Now it's design time!`);
    appendTextNode(newTocFrame, `Use the pages with arrow prefix for your design. You can add/remove those pages as well.`);
    appendTextNode(newTocFrame, `Your page names and artboard names will be used on the ToC.`);
  } else {
    appendTextNode(newTocFrame, `Click on each item to go to the page/artboard`, null, FontEnum.NOTE);
  }
  appendTextNode(newTocFrame, 'Re-run ToC+ anytime to refresh ToC.', null, FontEnum.NOTE);

  return newTocFrame;
}

function renderTocContent(tocFrame: FrameNode, sectionTitles: string[]): void {
  const sections = groupsPagesIntoSections(sectionTitles);

  for (const section of sections) {
    if (section.title.startsWith('_')) continue;

    const nonHiddenPagesInThisSection = section.pages.filter((page) => !page.name.startsWith('_'));
    if (!nonHiddenPagesInThisSection.length) continue;

    // Add section frame and title
    const sectionFrame = appendFrame(tocFrame, `${section.title} section`, true);
    appendTextNode(sectionFrame, section.title, null, FontEnum.TITLE);

    for (const page of nonHiddenPagesInThisSection) {
      // Ignore empty page, and pages under hidden sections
      const artboardsInThisPage = page.children.filter((node) => node.type === 'FRAME' && !node.name.startsWith('_'));
      if (!artboardsInThisPage.length) continue;
  
      // Add page frame and title
      const pageAutoLayoutFrame = appendFrame(sectionFrame, `${page.name} page`, true);
      appendTextNode(pageAutoLayoutFrame, page.name.replace(PAGE_PREFIX, ''), page.id);
  
      // Add all the artboards
      const artboardListAutoLayoutFrame = appendFrame(pageAutoLayoutFrame, `${page.name} artboards`, true);
      artboardListAutoLayoutFrame.paddingLeft = INDENTATION_WIDTH;
      for (const frame of artboardsInThisPage) {
        const artboardNode = appendTextNode(artboardListAutoLayoutFrame, frame.name, frame.id);
        artboardNode.x = INDENTATION_WIDTH;
      }
    }
    removeFrameWithoutChildren(sectionFrame)
  }
}

interface PageSection {
  title: string;
  pages: PageNode[];
}

function groupsPagesIntoSections(sectionTitles: string[]): PageSection[] {
  const result = [];
  let currentSection;
  for (const page of figma.root.children.filter((page) => !PAGE_NAMES_TO_IGNORE.includes(page.name))) {
    if (sectionTitles.includes(page.name)) {
      currentSection = {title: page.name, pages: []};
      result.push(currentSection);
      continue;
    }

    if (!currentSection) {
      currentSection = {title: 'Ungrouped pages', pages: []};
      result.push(currentSection);
    }

    currentSection.pages.push(page);
  }
  return result;
}

function removeFrameWithoutChildren(node): void {
  if (!node) return;

  if (node.children.length === 1 && node.children[0].type === 'TEXT') {
    node.remove();
  }
}
