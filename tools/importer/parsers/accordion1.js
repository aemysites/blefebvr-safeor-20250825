/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion wrapper
  const accordion = element.querySelector('.accordion');
  if (!accordion) return;

  // Table rows setup
  const rows = [ ['Accordion (accordion1)'] ];

  // Find all top-level accordion items
  const items = accordion.querySelectorAll(':scope > .accordion-item');
  items.forEach(item => {
    // Title cell
    let title = item.querySelector('.accordion-title');
    // fallback to empty div if not found or empty
    if (!title || !title.textContent.trim()) {
      title = document.createElement('div');
    }

    // Content cell: includes all from .accordion-detail
    let detail = item.querySelector('.accordion-detail');
    // fallback to empty div if not found
    if (!detail) {
      detail = document.createElement('div');
    }

    rows.push([title, detail]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
