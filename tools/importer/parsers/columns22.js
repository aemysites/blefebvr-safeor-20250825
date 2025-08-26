/* global WebImporter */
export default function parse(element, { document }) {
  // Columns block: two columns, first content, second image
  const columns = element.querySelectorAll(':scope > div');
  if (columns.length < 2) return;

  // Left column: all content (intro, highlights)
  const leftCol = columns[0];
  const leftContent = [];
  // Find the intro (first .rich-text-block-5)
  const intro = leftCol.querySelector('.rich-text-block-5');
  if (intro) leftContent.push(intro);
  // Find all highlight blocks
  const highlights = leftCol.querySelectorAll('.flex-hightlights');
  highlights.forEach(h => leftContent.push(h));

  // Right column: main image (not icon images)
  const rightCol = columns[1];
  let mainImage = null;
  // Find img with class image-47, which is the product image
  mainImage = rightCol.querySelector('img.image-47');

  // Table header
  const headerRow = ['Columns (columns22)'];
  // Table content row (two columns)
  const contentRow = [leftContent, mainImage];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);
  element.replaceWith(table);
}
