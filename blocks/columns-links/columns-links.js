export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;
  const cells = [...row.children];

  // Left cell = text column (heading + link list)
  const textCell = cells[0];
  if (textCell) textCell.classList.add('columns-links-text');

  // Right cell = image teaser with overlaid title + CTA
  const teaserCell = cells[1];
  if (teaserCell) {
    teaserCell.classList.add('columns-links-teaser');

    const pic = teaserCell.querySelector('picture');
    const picWrapper = pic ? pic.closest('p, div') : null;
    if (picWrapper) picWrapper.classList.add('columns-links-teaser-media');

    // Collect the non-image content (title + cta) into an overlay
    const overlay = document.createElement('div');
    overlay.className = 'columns-links-teaser-overlay';
    [...teaserCell.children].forEach((child) => {
      if (child !== picWrapper) overlay.append(child);
    });
    if (overlay.children.length) teaserCell.append(overlay);
  }
}
