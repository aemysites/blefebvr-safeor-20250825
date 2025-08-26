/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the hero section with background image
  const hero = element.querySelector('.safeair-section-product-hero');
  if (!hero) return;

  // Extract the background image from inline style
  let bgImageUrl = null;
  if (hero.style && hero.style.backgroundImage) {
    const match = hero.style.backgroundImage.match(/url\(["']?([^"')]+)["']?\)/);
    if (match) bgImageUrl = match[1];
  }
  let imageCell = null;
  if (bgImageUrl) {
    // Reference an existing image if possible
    // If not present as an <img>, create new (since it's only a style background)
    const img = document.createElement('img');
    img.src = bgImageUrl;
    img.alt = '';
    imageCell = img;
  }

  // Find the desktop container with heading and call-to-action
  let headerContainer = hero.querySelector('.desktop .safeair-header_container');
  // Fallback to mobile if not found
  if (!headerContainer) {
    headerContainer = hero.querySelector('.safeair-header_container.mobile') || hero.querySelector('.safeair-header_container');
  }

  // Compose content elements: heading, text, CTA
  const contentCell = [];
  if (headerContainer) {
    // Heading (h1)
    let headingElement = null;
    const embed = headerContainer.querySelector('.w-embed h1');
    if (embed) headingElement = embed;
    if (headingElement) contentCell.push(headingElement);

    // Rich text block
    const richText = headerContainer.querySelector('.rich-text-block-4.header-text.smokeevac.w-richtext');
    if (richText) contentCell.push(richText);

    // CTA buttons (filter out invisible)
    const ctas = Array.from(headerContainer.querySelectorAll('a.cta:not(.w-condition-invisible)'));
    if (ctas.length) contentCell.push(...ctas);
  }

  // Build the table rows
  const headerRow = ['Hero (hero4)'];
  const rows = [
    headerRow,
    [imageCell],
    [contentCell]
  ];

  // Only create the block if at least background or content is present
  if (imageCell || contentCell.length) {
    const block = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(block);
  }
}
