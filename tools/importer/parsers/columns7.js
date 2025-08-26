/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required
  const headerRow = ['Columns (columns7)'];

  // Find columns row
  const columnsRow = element.querySelector('.columns-17.w-row');
  if (!columnsRow) return;
  // Only immediate children that are w-col columns
  const columns = Array.from(columnsRow.children).filter(div => div.classList.contains('w-col'));
  if (columns.length !== 2) return;

  // For each column, grab its FULL HTML block as a single cell
  // For robustness and semantic meaning, just put the whole column div in the cell
  // But we also need to process 'src' attributes (iframe) into links (except images)

  function columnCellContent(colDiv) {
    // Clone, so we can safely transform only in this context
    const clone = colDiv.cloneNode(true);
    // Find any iframe (not an image)
    const iframes = clone.querySelectorAll('iframe');
    if (iframes.length) {
      iframes.forEach(iframe => {
        const src = iframe.getAttribute('src');
        if (src) {
          const link = document.createElement('a');
          link.href = src.startsWith('//') ? 'https:' + src : src;
          link.textContent = 'Video';
          iframe.replaceWith(link);
        }
      });
    }
    return clone;
  }

  // Compose the table according to the example: one header row, one content row with 2 columns
  const cells = [
    headerRow,
    [columnCellContent(columns[0]), columnCellContent(columns[1])]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
