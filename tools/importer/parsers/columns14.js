/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header must match exactly
  const headerRow = ['Columns (columns14)'];

  // 2. Get columns from .w-row
  const wRow = element.querySelector('.w-row');
  if (!wRow) return;
  const columns = wRow.querySelectorAll(':scope > div');

  // 3. Left column: preserve all text content and semantic elements
  let leftColContent = [];
  if (columns[0]) {
    // Collect all child nodes, include h2, p, and any text nodes (no clones)
    leftColContent = Array.from(columns[0].childNodes)
      .filter(node => {
        // Accept element nodes (headers, paragraphs, etc.)
        if (node.nodeType === Node.ELEMENT_NODE) return true;
        // Accept non-empty text nodes (for spacing or raw text)
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') return true;
        return false;
      })
      .map(node => {
        // Convert text nodes to <span> so they're visible in the table
        if (node.nodeType === Node.TEXT_NODE) {
          const span = document.createElement('span');
          span.textContent = node.textContent.trim();
          return span;
        }
        return node;
      });
  }

  // 4. Right column: if iframe present, create link with href/src and text, else include all content
  let rightColContent = [];
  if (columns[1]) {
    const iframe = columns[1].querySelector('iframe');
    if (iframe && iframe.src) {
      const link = document.createElement('a');
      link.href = iframe.src;
      link.textContent = iframe.src;
      rightColContent = [link];
    } else {
      // If no iframe, include all children and non-empty text
      rightColContent = Array.from(columns[1].childNodes)
        .filter(node => {
          if (node.nodeType === Node.ELEMENT_NODE) return true;
          if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') return true;
          return false;
        })
        .map(node => {
          if (node.nodeType === Node.TEXT_NODE) {
            const span = document.createElement('span');
            span.textContent = node.textContent.trim();
            return span;
          }
          return node;
        });
    }
  }
  // Edge case: if right column would be empty, add an empty span
  if (rightColContent.length === 0) {
    const emptySpan = document.createElement('span');
    emptySpan.textContent = '';
    rightColContent = [emptySpan];
  }

  // 5. Assemble the table: header (1 column), then the row (2 columns)
  const cells = [
    headerRow,
    [leftColContent, rightColContent]
  ];

  // 6. Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
