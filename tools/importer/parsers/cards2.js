/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per specification
  const headerRow = ['Cards (cards2)'];
  const rows = [];

  // Helper: extract full text content, preserving nodes
  function extractTextContent(container) {
    const children = [];
    Array.from(container.childNodes).forEach(node => {
      if (node.nodeType === 1) {
        // Element
        children.push(node);
      } else if (node.nodeType === 3 && node.textContent.trim()) {
        // Wrap plain text in a <span> for safety
        const span = document.createElement('span');
        span.textContent = node.textContent.trim();
        children.push(span);
      }
    });
    if (children.length === 1) return children[0];
    if (children.length > 1) return children;
    return '';
  }

  // Find static cards (PDF resources)
  const rightSection = element.querySelector('.learn-more-right');
  if (rightSection) {
    const staticCards = rightSection.querySelectorAll('.div-block-88 > div');
    staticCards.forEach(card => {
      // Image: first <img> inside a link
      const imgLink = card.querySelector('a');
      const img = imgLink ? imgLink.querySelector('img') : null;
      // Text: get all rich text content and CTA link(s) (not image-link)
      const content = [];
      // Rich text description/title
      card.querySelectorAll('.rich-text-block-14, .w-richtext, .rtf').forEach(rich => {
        const richNodes = extractTextContent(rich);
        if (Array.isArray(richNodes)) content.push(...richNodes);
        else if (richNodes) content.push(richNodes);
      });
      // CTA link(s)
      card.querySelectorAll('a').forEach(a => {
        if (!a.querySelector('img')) content.push(a);
      });
      if (img && content.length) {
        rows.push([img, content.length === 1 ? content[0] : content]);
      }
    });
    // Find slider cards (carousel)
    const slider = rightSection.querySelector('.learn-more-slider');
    if (slider) {
      const slides = slider.querySelectorAll('.learn-more-slide');
      slides.forEach(slide => {
        // Image
        let img = null;
        const imgAnchor = slide.querySelector('a');
        if (imgAnchor) img = imgAnchor.querySelector('img');
        // Text (find .slide2 or fallback to all text blocks, plus CTA links)
        const content = [];
        let foundTextBlock = false;
        const slide2 = slide.querySelector('.slide2');
        if (slide2) {
          foundTextBlock = true;
          // Actual text (rtf/w-richtext inside slide2)
          const txtBlock = slide2.querySelector('.rtf, .w-richtext') || slide2;
          const txtNodes = extractTextContent(txtBlock);
          if (Array.isArray(txtNodes)) content.push(...txtNodes);
          else if (txtNodes) content.push(txtNodes);
          // CTA(s)
          slide2.querySelectorAll('a').forEach(a => {
            if (!a.querySelector('img')) content.push(a);
          });
        }
        if (!foundTextBlock) {
          // Fallback: add all <div> with text inside slide (not images)
          slide.querySelectorAll('div').forEach(div => {
            if (div.textContent.trim() && !div.querySelector('img')) {
              content.push(div);
            }
          });
        }
        // Also add CTA links outside slide2 (not image links)
        slide.querySelectorAll('a').forEach(a => {
          if (!a.querySelector('img') && !content.includes(a)) content.push(a);
        });
        if (img && content.length) {
          rows.push([img, content.length === 1 ? content[0] : content]);
        }
      });
    }
  }

  // Compose table and replace
  if (rows.length) {
    const cells = [headerRow, ...rows];
    const block = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(block);
  }
}
