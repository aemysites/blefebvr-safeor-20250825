/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract a background image from inline style
  function extractBackgroundImage(el) {
    const style = el.getAttribute('style') || '';
    const match = style.match(/background-image\s*:\s*url\(["']?([^"')]+)["']?\)/i);
    return match ? match[1] : null;
  }

  // Compose header row (must match the example exactly)
  const headerRow = ['Hero (hero20)'];

  // Compose the background image row
  let bgImageUrl = extractBackgroundImage(element);
  let bgImageElem = null;
  if (bgImageUrl) {
    bgImageElem = document.createElement('img');
    bgImageElem.src = bgImageUrl;
    bgImageElem.setAttribute('loading', 'eager');
    bgImageElem.alt = '';
  }
  const bgImageRow = [bgImageElem ? bgImageElem : ''];

  // Compose the content row
  // The content cell should include all headline, subhead, paragraph, and CTA content, referencing existing elements
  const contentElems = [];

  // Try .desktop > .safeair-header_container (captures desktop view headline, paragraph, CTAs)
  const desktopHeader = element.querySelector('.desktop .safeair-header_container');
  if (desktopHeader) {
    // Use all child elements except empty divs and invisible CTAs
    Array.from(desktopHeader.children).forEach((child) => {
      if (child.classList.contains('div-block-84')) return;
      if (child.matches('a.cta.w-condition-invisible')) return;
      // Avoid adding empty containers
      if (child.textContent.trim() === '' && !child.querySelector('img')) return;
      contentElems.push(child);
    });
  }

  // Try .surgical-smoke_cta .safeair-header_container.mobile (mobile variant)
  const mobileHeader = element.querySelector('.surgical-smoke_cta .safeair-header_container.mobile');
  if (mobileHeader) {
    Array.from(mobileHeader.children).forEach((child) => {
      // Avoid empty divs
      if (child.textContent.trim() === '' && !child.querySelector('img')) return;
      contentElems.push(child);
    });
  }

  // Try .mobile .column-57 .w-embed (mobile heading)
  const mobileHeading = element.querySelector('.mobile .column-57 .w-embed');
  if (mobileHeading) {
    contentElems.push(mobileHeading);
  }

  // As a fallback, if nothing found, include all the text content
  let contentRow = [];
  if (contentElems.length > 0) {
    contentRow = [contentElems];
  } else {
    const fallback = document.createElement('div');
    fallback.textContent = element.textContent.trim();
    contentRow = [fallback];
  }

  // Compose the final block table
  const block = WebImporter.DOMUtils.createTable([
    headerRow,
    bgImageRow,
    contentRow,
  ], document);

  element.replaceWith(block);
}
