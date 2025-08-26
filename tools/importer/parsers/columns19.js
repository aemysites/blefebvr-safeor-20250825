/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare header row - follow the block name exactly as required
  const headerRow = ['Columns (columns19)'];

  // Gather the column content
  // Left: the main title and highlight text
  // Right: the main image and detail images

  // Safe default to not break if structure is partial
  let leftColContent = [];
  let rightColContent = [];

  // --- LEFT COLUMN --- //
  // Get the title
  const title = element.querySelector('.accordion-title');
  if (title) leftColContent.push(title);

  // Get the highlight/description text (from detail)
  const detail = element.querySelector('.accordion-detail');
  if (detail) {
    const highlight = detail.querySelector('.accordion-highlight-text');
    if (highlight) leftColContent.push(highlight);
  }

  // --- RIGHT COLUMN --- //
  // Get the main image (from accordion-content)
  const mainImg = element.querySelector('.accordion-image-container img');
  if (mainImg) rightColContent.push(mainImg);

  // Get additional images from detail (avoiding duplicates)
  if (detail) {
    const detailImgs = [...detail.querySelectorAll('img')].filter(img => img !== mainImg);
    rightColContent.push(...detailImgs);
  }

  // Remove empty columns if both are empty (should not happen, but safe)
  if (leftColContent.length === 0) leftColContent = [''];
  if (rightColContent.length === 0) rightColContent = [''];

  // Build the cells array (header row, then one row with two columns)
  const cells = [
    headerRow,
    [leftColContent, rightColContent]
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
