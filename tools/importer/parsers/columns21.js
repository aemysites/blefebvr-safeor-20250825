/* global WebImporter */
export default function parse(element, { document }) {
  // The header row should be a single non-bolded cell exactly matching the example
  const headerRow = ['Columns (columns21)'];

  // Find the main columns row
  const featuresRow = element.querySelector('.features-content.w-row');
  if (!featuresRow) return;
  const columnEls = featuresRow.querySelectorAll(':scope > .column-52');

  // Build the columns row
  const columns = [];
  columnEls.forEach((col) => {
    const cellContent = [];
    const heading = col.querySelector('h3');
    if (heading) cellContent.push(heading);
    const richtext = col.querySelector('.features-column');
    if (richtext) cellContent.push(richtext);
    const cta = col.querySelector('a.cta');
    if (cta) cellContent.push(cta);
    columns.push(cellContent.length === 1 ? cellContent[0] : cellContent);
  });

  // If there's a CTA beneath all columns, add a row with CTA in first cell
  const bottomCta = element.querySelector('a.accordion-cta');
  let tableRows = [headerRow, columns];
  if (bottomCta) {
    const ctaRow = Array(columns.length).fill('');
    ctaRow[0] = bottomCta;
    tableRows.push(ctaRow);
  }

  // The header cell should not be bolded; rely on createTable's default
  // Replace the element with the new table block
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
