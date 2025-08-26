/* global WebImporter */
export default function parse(element, { document }) {
  // Extract background image from element style
  let bgImgUrl = '';
  if (element.style && element.style.backgroundImage) {
    const match = element.style.backgroundImage.match(/url\(["']?([^"')]+)["']?\)/);
    if (match) {
      bgImgUrl = match[1];
    }
  }

  let bgImgEl = null;
  if (bgImgUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgImgUrl;
    bgImgEl.alt = '';
  }

  // Gather content for the hero block
  const contentBlocks = [];
  const container = element.querySelector('.container-915');
  if (container) {
    // Grab all the immediate child rows; these contain the heading/subheading blocks
    const rows = container.querySelectorAll(':scope > div');
    rows.forEach(row => {
      // Some of these rows have nested interesting content
      // For each row, collect all direct children that might contain text or heading info
      // We'll include the entire row so as to be resilient and capture all semantic elements
      contentBlocks.push(row);
    });
  }

  // If no .container-915, fallback: extract all children that aren't video
  if (!container) {
    const fallbackBlocks = [];
    element.childNodes.forEach(child => {
      if (child.nodeType === 1 && !child.classList.contains('w-background-video')) {
        fallbackBlocks.push(child);
      }
    });
    if (fallbackBlocks.length) {
      contentBlocks.push(...fallbackBlocks);
    }
  }

  // Table structure as per instructions
  const headerRow = ['Hero (hero3)'];
  const bgRow = [bgImgEl ? bgImgEl : ''];
  const contentRow = [contentBlocks.length === 1 ? contentBlocks[0] : contentBlocks];
  const cells = [headerRow, bgRow, contentRow];

  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
