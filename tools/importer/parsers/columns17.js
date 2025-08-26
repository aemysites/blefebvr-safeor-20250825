/* global WebImporter */
export default function parse(element, { document }) {
  // Ensure header text matches exactly and is a single cell
  const headerRow = ['Columns (columns17)'];

  // Gather columns from each <li>
  const items = Array.from(element.querySelectorAll(':scope > li'));
  const columns = items.map((li) => {
    const a = li.querySelector('a');
    const wrapper = document.createElement('div');

    // Add the check image div
    const imgCheckDiv = a.querySelector('.img-check');
    if (imgCheckDiv) wrapper.appendChild(imgCheckDiv);

    // Add heading (h3)
    const heading = a.querySelector('h3');
    if (heading) wrapper.appendChild(heading);

    // Add all non-empty <p> elements except those containing only the heading
    Array.from(a.querySelectorAll('p')).forEach(p => {
      if (p.textContent.trim() === '') return;
      if (heading && p.textContent.trim() === heading.textContent.trim()) return;
      wrapper.appendChild(p);
    });

    return wrapper;
  });

  // Compose table: header as single cell, then columns as one row with multiple cells
  const cells = [
    headerRow, // first row: single cell
    columns    // second row: N cells (columns)
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
