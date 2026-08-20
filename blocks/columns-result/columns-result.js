/*
 * columns-result
 * Static before/after result gallery: a text column (optional pretitle,
 * name/age or treatment title, subtitle, optional CTA + trailing disclaimer)
 * paired with a vertical stack of before/after images. Each image carries a
 * small pill label (BEFORE / AFTER) overlaid in its top-right corner.
 * On desktop the image stack sits to the left of the text; on mobile the text
 * stacks above the images. Not a rotating carousel (that is carousel-patient).
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pictures = [...col.querySelectorAll('picture')];

      // Image column: wrap each picture (+ its trailing BEFORE/AFTER label)
      // into a positioned figure so the label can overlay the image.
      if (pictures.length) {
        col.classList.add('columns-result-img-col');
        pictures.forEach((pic) => {
          const picWrap = pic.closest('p') || pic.parentElement;
          const label = picWrap.nextElementSibling;
          const fig = document.createElement('div');
          fig.className = 'columns-result-figure';
          picWrap.replaceWith(fig);
          fig.append(picWrap);
          if (label && label.tagName === 'P') {
            const text = label.textContent.trim().toLowerCase();
            if (text === 'before' || text === 'after') {
              label.classList.add('columns-result-label', `columns-result-label-${text}`);
              fig.append(label);
            }
          }
        });
        return;
      }

      // Text column: tag the leading pretitle, any CTA link and the trailing
      // disclaimer so they can be styled distinctly.
      col.classList.add('columns-result-text');

      const first = col.firstElementChild;
      if (first && first.tagName === 'P') first.classList.add('columns-result-pretitle');

      const cta = [...col.querySelectorAll(':scope > p')].find((p) => p.querySelector('a'));
      if (cta) cta.classList.add('columns-result-cta');

      const last = col.lastElementChild;
      if (last && last.tagName === 'P' && last !== first && last !== cta) {
        last.classList.add('columns-result-disclaimer');
      }
    });
  });
}
