/* global WebImporter */
export default function parse(element, { document }) {
  // Build table rows as per the markdown example:
  // - First row: ['Table (striped)'] (single cell)
  // - Second row: column headers (Device, Height, ...)
  // - Third row: sub-headers (Top to bottom..., ...)
  // - Fourth row: data (Neptune SafeAir, ...)

  const cells = [ ['Table (striped)'] ];

  // Find the grid-table div (the tabular content)
  const grid = element.querySelector('.grid-table.products');
  if (!grid) return;

  // Gather all grid-heading, grid-sub-heading, grid-row, in order
  const gridChildren = Array.from(grid.children);
  const columns = 6;

  // Column headers (Device, Height...)
  const headingEls = gridChildren.filter(el => el.classList.contains('grid-heading')).slice(0, columns);
  const headerRow = headingEls.map(heading => {
    // Use the inner div if present for formatting, else heading
    const div = heading.querySelector('div');
    return div ? div : heading;
  });

  // Sub-headers (Top to bottom just in front..., ...)
  const subHeadingEls = gridChildren.filter(el => el.classList.contains('grid-sub-heading')).slice(0, columns);
  const subRow = subHeadingEls.map(sub => {
    const div = sub.querySelector('div');
    return div ? div : sub;
  });

  // Data row (Neptune SafeAir, 0.488 in, ...)
  const dataEls = gridChildren.filter(el => el.classList.contains('grid-row')).slice(0, columns);
  const dataRow = dataEls.map(row => {
    const div = row.querySelector('div');
    return div ? div : row;
  });

  // Now push each row as an array of cells
  cells.push(headerRow);
  cells.push(subRow);
  cells.push(dataRow);

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
