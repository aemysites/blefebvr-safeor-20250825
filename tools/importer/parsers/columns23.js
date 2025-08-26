/* global WebImporter */
export default function parse(element, { document }) {
  // Define table header as in the requirements
  const headerRow = ['Columns (columns23)'];

  // Get the row that contains the columns
  const columnsRow = element.querySelector('.features-content');
  const columnDivs = columnsRow
    ? Array.from(columnsRow.children).filter(child => child.classList.contains('column-52'))
    : [];

  // Extract content per column
  const columns = columnDivs.map(col => {
    const colContent = [];
    // Heading
    const heading = col.querySelector('h3');
    if (heading) {
      colContent.push(heading);
    }
    // List (ul)
    const featuresColumn = col.querySelector('.features-column');
    if (featuresColumn) {
      const ul = featuresColumn.querySelector('ul');
      if (ul) {
        colContent.push(ul);
      }
    }
    // Button/link
    const button = col.querySelector('a');
    if (button) {
      colContent.push(button);
    }
    return colContent.length === 1 ? colContent[0] : colContent;
  });

  // Check for a call-to-action link after the .features-content, for the last row
  let ctaRow = null;
  const lastCta = element.querySelector('a.accordion-cta');
  if (lastCta && columns.length > 0) {
    // Only the last cell gets the CTA, rest are empty
    ctaRow = columns.map((_, idx) => (idx === columns.length - 1 ? lastCta : ''));
  }

  // Build the cells array for the table
  const cells = [headerRow, columns];
  if (ctaRow) cells.push(ctaRow);

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
