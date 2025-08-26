/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required
  const headerRow = ['Cards (cards5)'];

  // Find the cards: all direct children of .collection-list-8 with [role="listitem"]
  const list = element.querySelector('.collection-list-8');
  if (!list) return;
  const items = Array.from(list.children).filter(el => el.getAttribute('role') === 'listitem');

  // Build rows: [image, text-block]
  const rows = items.map(item => {
    // First cell: image (mandatory)
    const img = item.querySelector('img');

    // Second cell: heading, description (if any), CTA, in order
    const content = document.createElement('div');
    // Heading
    const h3 = item.querySelector('h3');
    if (h3) content.appendChild(h3);
    // Description:
    // Look for text nodes, <p>, <div> (not h3, not a.cta), in item
    // For robustness, get all direct children that are not h3 or a.cta or img
    Array.from(item.childNodes).forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName !== 'IMG' && node.tagName !== 'H3' && !(node.tagName === 'A' && node.classList.contains('cta'))) {
          content.appendChild(node);
        }
      } else if (node.nodeType === Node.TEXT_NODE) {
        // If it's a non-empty text, insert as a paragraph
        const text = node.textContent.trim();
        if (text) {
          const p = document.createElement('p');
          p.textContent = text;
          content.appendChild(p);
        }
      }
    });
    // CTA
    const cta = item.querySelector('a.cta');
    if (cta) content.appendChild(cta);
    return [img, content];
  });

  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
