/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: matches example exactly and is a single column
  const headerRow = ['Columns (columns18)'];

  // 2. Find the .w-row containing columns
  const wRow = element.querySelector('.w-row');
  let cols = [];
  if (wRow) {
    // Only take immediate children with .w-col
    cols = Array.from(wRow.querySelectorAll(':scope > .w-col'));
  }
  // Fallback to all children (for robustness)
  if (!cols.length && wRow) {
    cols = Array.from(wRow.children);
  }
  // Defensive: at least 2 columns
  while (cols.length < 2) {
    cols.push(document.createElement('div'));
  }

  // 3. Left column: gather ALL content (not just specific tags)
  let leftCell = [];
  const leftCol = cols[0];
  if (leftCol) {
    // Collect all block elements for semantic meaning
    const children = Array.from(leftCol.childNodes);
    // If leftCol is empty, fallback to textContent
    let hasContent = false;
    children.forEach(child => {
      if (child.nodeType === 1) { // Element node
        // Only add elements with visible text or semantic meaning (heading, p)
        if (child.textContent && child.textContent.trim()) {
          leftCell.push(child);
          hasContent = true;
        }
      } else if (child.nodeType === 3) { // Text node
        if (child.textContent && child.textContent.trim()) {
          leftCell.push(child.textContent.trim());
          hasContent = true;
        }
      }
    });
    if (!hasContent && leftCol.textContent && leftCol.textContent.trim()) {
      leftCell.push(leftCol.textContent.trim());
    }
  }

  // 4. Right column: all content from the original, including form and iframes
  let rightCell = [];
  const rightCol = cols[1];
  if (rightCol) {
    const children = Array.from(rightCol.childNodes);
    let hasContent = false;
    children.forEach(child => {
      if (child.nodeType === 1) { // Element node
        // If element contains iframe: add a link to it
        const iframe = child.querySelector && child.querySelector('iframe');
        if (iframe && iframe.src) {
          const link = document.createElement('a');
          link.href = iframe.src;
          link.textContent = iframe.src;
          rightCell.push(link);
          hasContent = true;
        }
        // If element contains form: add the form element (preserve)
        const form = child.querySelector && child.querySelector('form');
        if (form) {
          rightCell.push(form);
          hasContent = true;
        }
        // Add element itself if it has visible text or semantic children
        if (child.textContent && child.textContent.trim() &&
            !iframe && !form) {
          rightCell.push(child);
          hasContent = true;
        }
      } else if (child.nodeType === 3) { // Text node
        if (child.textContent && child.textContent.trim()) {
          rightCell.push(child.textContent.trim());
          hasContent = true;
        }
      }
    });
    // If all else fails, also grab textContent
    if (!hasContent && rightCol.textContent && rightCol.textContent.trim()) {
      rightCell.push(rightCol.textContent.trim());
    }
  }

  // 5. Build the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    [leftCell, rightCell]
  ], document);
  element.replaceWith(table);
}
