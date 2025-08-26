/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header: must be exact
  const headerRow = ['Hero (hero8)'];

  // 2. Background image row (NOT present in this HTML, so cell is empty)
  const bgImageRow = [''];

  // 3. Content row: must contain all text (from header-text) and all CTAs (from prod-button_flex) from the right column
  // Find right column (column-cta)
  let rightCol = null;
  const rowDivs = element.querySelectorAll(':scope > .w-container > .columns-11.w-row > div');
  if (rowDivs.length > 1) {
    rightCol = rowDivs[1];
  }

  const contentCell = [];
  if (rightCol) {
    // Get header-text (text block)
    const headerText = rightCol.querySelector('.header-text');
    if (headerText) contentCell.push(headerText);
    // Get CTAs
    const ctaContainer = rightCol.querySelector('.prod-button_flex');
    if (ctaContainer) contentCell.push(ctaContainer);
  }
  // If nothing found, return empty cell
  const bodyRow = [contentCell.length ? contentCell : ''];

  // 4. Compose table
  const cells = [headerRow, bgImageRow, bodyRow];

  const table = WebImporter.DOMUtils.createTable(cells, document);

  // 5. Replace
  element.replaceWith(table);
}
