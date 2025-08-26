/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified
  const headerRow = ['Cards (cards6)'];
  // Find all card elements
  const cardEls = Array.from(element.querySelectorAll(':scope > .flex2col'));
  const rows = cardEls.map(cardEl => {
    // Find icon image
    const iconWrap = cardEl.querySelector('.highlight-icon-wrap');
    const img = iconWrap ? iconWrap.querySelector('img') : null;
    // Find the text content
    const textWrap = cardEl.querySelector('.highlight-text');
    let contents = [];
    if (textWrap) {
      // All block children (preserve paragraphs, bold, superscript, etc.)
      contents = Array.from(textWrap.childNodes).filter(n => {
        return (
          (n.nodeType === 1 && (n.tagName !== 'STYLE' && n.tagName !== 'SCRIPT')) ||
          (n.nodeType === 3 && n.textContent.trim())
        );
      });
      // If everything is whitespace or empty, fallback to empty
      if (contents.length === 0) contents = [''];
      // If there's a single <p> that is just a blank character, skip it
      if (contents.length === 1 && contents[0].nodeType === 1 && contents[0].tagName === 'P' && !contents[0].textContent.trim()) {
        contents = [''];
      }
    } else {
      contents = [''];
    }
    return [img || '', contents.length === 1 ? contents[0] : contents];
  });
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
