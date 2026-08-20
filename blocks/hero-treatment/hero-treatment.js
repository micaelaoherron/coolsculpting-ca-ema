/*
 * hero-treatment
 * Treatment-area hero. An eyebrow line (e.g. "TREATMENT AREAS"), a large area
 * title, an intro paragraph, a full-bleed "before" model photo, and a small
 * disclaimer caption with a snowflake icon.
 *
 * Authored EDS structure (2 rows):
 *   row 1: image cell (picture)
 *   row 2: content cell (h3 eyebrow, h1 title, p description, p snowflake, p disclaimer)
 *
 * Desktop: content overlays the photo, eyebrow+title pinned to the top and
 * description+disclaimer pinned to the bottom (content-bottom style).
 * Mobile: rounded image card on top, text stacked below.
 */
export default function decorate(block) {
  const rows = [...block.children];
  const imageRow = rows.find((r) => r.querySelector('picture'));
  const contentRow = rows.find(
    (r) => r !== imageRow && r.querySelector('h1, h2, h3, h4, h5, h6, p'),
  );

  if (imageRow) {
    imageRow.classList.add('hero-treatment-image');
  } else {
    block.classList.add('no-image');
  }

  if (!contentRow) return;
  contentRow.classList.add('hero-treatment-content');

  const cell = contentRow.firstElementChild;
  if (!cell) return;

  const eyebrow = cell.querySelector(
    ':scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6',
  );
  const title = cell.querySelector(':scope > h1');
  if (eyebrow) eyebrow.classList.add('hero-treatment-eyebrow');
  if (title) title.classList.add('hero-treatment-title');

  const paras = [...cell.querySelectorAll(':scope > p')];
  // description: first paragraph with text and no image
  const descP = paras.find(
    (p) => p.textContent.trim() && !p.querySelector('picture, img'),
  );
  if (descP) descP.classList.add('hero-treatment-description');

  // everything else (icon paragraph + caption text) is the disclaimer
  const discParas = paras.filter(
    (p) => p !== descP && (p.textContent.trim() || p.querySelector('picture, img')),
  );

  // top group: eyebrow + title
  const top = document.createElement('div');
  top.className = 'hero-treatment-top';
  if (eyebrow) top.append(eyebrow);
  if (title) top.append(title);

  // bottom group: description + disclaimer
  const bottom = document.createElement('div');
  bottom.className = 'hero-treatment-bottom';
  if (descP) bottom.append(descP);
  if (discParas.length) {
    const disc = document.createElement('div');
    disc.className = 'hero-treatment-disclaimer';
    discParas.forEach((p) => disc.append(p));
    bottom.append(disc);
  }

  cell.textContent = '';
  if (top.childElementCount) cell.append(top);
  if (bottom.childElementCount) cell.append(bottom);
}
