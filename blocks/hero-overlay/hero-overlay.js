/*
 * hero-overlay
 * Full-bleed hero: background image (row 1) with an overlaid, centered
 * headline + description + play-icon CTA, and a bottom disclaimer bar
 * (snowflake icon left, fine print right). Restructures the flat authored
 * rows into: .hero-overlay-bg / .hero-overlay-content > (body + disclaimer).
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // --- Row 1: background image ---
  const imageRow = rows[0];
  imageRow.classList.add('hero-overlay-bg');
  if (!imageRow.querySelector('picture, img')) {
    block.classList.add('no-image');
  }

  // --- Row 2: overlay content ---
  const contentRow = rows[1];
  if (!contentRow) return;
  contentRow.classList.add('hero-overlay-content');
  const cell = contentRow.querySelector(':scope > div') || contentRow;
  cell.classList.add('hero-overlay-content-inner');

  const paras = [...cell.querySelectorAll(':scope > p')];

  // Snowflake icon lives in the only picture-bearing paragraph.
  const snowflakeP = paras.find((p) => p.querySelector('picture, img'));
  // Disclaimer fine print is the paragraph right after the snowflake.
  const disclaimerTextP = snowflakeP ? snowflakeP.nextElementSibling : null;
  // CTA is the text paragraph immediately before the snowflake block.
  let ctaP = null;
  if (snowflakeP) {
    const prev = snowflakeP.previousElementSibling;
    if (prev && prev.tagName === 'P' && !prev.querySelector('picture, img')) {
      ctaP = prev;
    }
  }

  // Convert the CTA text paragraph into a play-icon button.
  if (ctaP) {
    const label = ctaP.textContent.trim();
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'hero-overlay-cta';
    const icon = document.createElement('span');
    icon.className = 'hero-overlay-cta-icon';
    icon.setAttribute('aria-hidden', 'true');
    const text = document.createElement('span');
    text.textContent = label;
    btn.append(icon, text);
    ctaP.replaceWith(btn);
  }

  // Build the bottom disclaimer bar (moved out of normal flow order).
  let disclaimer = null;
  if (snowflakeP || disclaimerTextP) {
    disclaimer = document.createElement('div');
    disclaimer.className = 'hero-overlay-disclaimer';
    [snowflakeP, disclaimerTextP].forEach((el) => {
      if (el) disclaimer.append(el);
    });
  }

  // Wrap the remaining content (headline, description, CTA) so it can be
  // vertically centered while the disclaimer pins to the bottom.
  const body = document.createElement('div');
  body.className = 'hero-overlay-body';
  [...cell.children].forEach((el) => body.append(el));

  cell.append(body);
  if (disclaimer) cell.append(disclaimer);
}
