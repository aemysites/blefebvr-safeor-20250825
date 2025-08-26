/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per block name
  const headerRow = ['Accordion (accordion12)'];

  // Left cell: the Accordion title
  // Right cell: content (images + highlight text)

  // Find the title: .accordion-title (should be block's heading)
  let titleElem = element.querySelector('.accordion-title');
  // Fallback to empty div if not found
  if (!titleElem) {
    titleElem = document.createElement('div');
  }

  // Find the content cell: the associated detail/content
  const detailDiv = element.querySelector('.accordion-detail');
  const contentCell = document.createElement('div');
  if (detailDiv) {
    // Add all images first (preserving order)
    const imgs = detailDiv.querySelectorAll('img');
    imgs.forEach(img => contentCell.appendChild(img));
    // Add highlight text (if any)
    const highlight = detailDiv.querySelector('.accordion-highlight-text');
    if (highlight) {
      contentCell.appendChild(highlight);
    }
    // If there is additional content in detailDiv that is not image or .accordion-highlight-text, add as well
    // This keeps the cell robust if content structure changes
    Array.from(detailDiv.childNodes).forEach(child => {
      if (
        child.nodeType === 1 && // Element
        !child.matches('img') &&
        !child.matches('.accordion-highlight-text') &&
        !child.matches('.swiper, .swiper-wrapper, .swiper-button-next, .swiper-button-prev, .swiper-pagination')
      ) {
        contentCell.appendChild(child);
      }
    });
  }

  // If contentCell is empty, add an empty text node to keep table structure valid
  if (!contentCell.hasChildNodes()) {
    contentCell.appendChild(document.createTextNode(''));
  }

  const rows = [
    headerRow,
    [titleElem, contentCell]
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
