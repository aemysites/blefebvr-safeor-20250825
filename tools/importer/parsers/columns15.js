/* global WebImporter */
export default function parse(element, { document }) {
  // Always use a single cell for the header row
  const headerRow = ['Columns (columns15)'];

  // Find the columns block
  const columnsRow = element.querySelector('.columns-15.w-row');
  if (!columnsRow) return;
  const cols = columnsRow.querySelectorAll(':scope > .w-col');
  if (cols.length < 2) return;

  // --- LEFT COLUMN ---
  const leftCol = cols[0];
  const leftColDiv = document.createElement('div');

  // Main text block
  const descBlock = leftCol.querySelector('.rich-text-block-5.learn-more-text');
  if (descBlock) leftColDiv.appendChild(descBlock);

  // All highlight sections
  const highlightGroups = leftCol.querySelectorAll('.flex-hightlights');
  highlightGroups.forEach(group => {
    const rows = group.querySelectorAll('.flex-highlight_row-wrapper');
    rows.forEach(row => {
      const rowDiv = document.createElement('div');
      const iconWrapper = row.querySelector('.grid-hightlight_icon-wrapper');
      if (iconWrapper) rowDiv.appendChild(iconWrapper);
      const infoWrapper = row.querySelector('.grid-hightlight_info-wrapper');
      if (infoWrapper) rowDiv.appendChild(infoWrapper);
      leftColDiv.appendChild(rowDiv);
    });
  });

  // Also include any additional visible text blocks and CTA buttons that are direct children
  Array.from(leftCol.childNodes).forEach(node => {
    if (node.nodeType === 1 &&
        !leftColDiv.contains(node) &&
        !node.classList.contains('flex-hightlights')) {
      leftColDiv.appendChild(node);
    }
    if (node.nodeType === 3 && node.textContent.trim()) {
      leftColDiv.appendChild(document.createTextNode(node.textContent));
    }
  });

  // --- RIGHT COLUMN ---
  const rightCol = cols[1];
  const rightColDiv = document.createElement('div');
  Array.from(rightCol.childNodes).forEach(node => {
    if (node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim())) {
      rightColDiv.appendChild(node);
    }
  });

  // Compose table so that the header row is a single cell, and the content row has two columns
  const cells = [
    headerRow,
    [leftColDiv, rightColDiv]
  ];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block
  element.replaceWith(block);
}
