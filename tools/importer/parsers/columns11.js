/* global WebImporter */
export default function parse(element, { document }) {
  // Critical review/edge case: only process if there are li elements
  const items = Array.from(element.querySelectorAll(':scope > li'));
  if (!items.length) return;

  // Each li should contain an anchor. We want to reference all content in the anchor.
  // If anchor is missing, fallback to using the li itself, but this HTML always has anchors.
  const columns = items.map(li => {
    const anchor = li.querySelector('a');
    // If anchor found, reference content in that anchor
    if (anchor) {
      return anchor;
    }
    // fallback: reference li
    return li;
  });

  // Table header: must match example exactly
  const headerRow = ['Columns (columns11)'];
  // Table content row: array of columns
  const contentRow = columns;

  // Create table, referencing DOM elements (not cloning)
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace element with table
  element.replaceWith(table);
}
