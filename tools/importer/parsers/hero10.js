/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: must match example exactly
  const headerRow = ['Hero (hero10)'];

  // Background image row: no image in this HTML, so blank string
  const bgImgRow = [''];

  // Third row: block content, should include all visible text content from the section
  // Find all direct children with class 'section-title-bg' and not w-condition-invisible
  const contentSections = Array.from(element.children).filter(
    (child) => child.classList && child.classList.contains('section-title-bg') && !child.classList.contains('w-condition-invisible')
  );

  // Collect all child nodes (preserving elements and formatting) from all .features-heading within visible sections
  let blockContent = [];
  contentSections.forEach(section => {
    const featuresHeading = section.querySelector('.features-heading');
    if (featuresHeading) {
      // Push the actual element reference for .features-heading, preserving structure
      blockContent.push(featuresHeading);
    }
  });

  // If no visible content, use empty string to avoid an empty cell
  if (blockContent.length === 0) blockContent = [''];

  const contentRow = [blockContent.length === 1 ? blockContent[0] : blockContent];

  // Compose the block table
  const cells = [headerRow, bgImgRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
