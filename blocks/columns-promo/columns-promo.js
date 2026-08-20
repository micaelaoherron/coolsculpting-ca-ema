export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-promo-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');

      // image-only column (picture is the sole content of the cell)
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-promo-img-col');
          return;
        }
      }

      // content column: classify CTA, trailing disclaimers, and logo
      const cta = [...col.querySelectorAll(':scope > p')].find((p) => p.querySelector('a'));
      if (cta) {
        cta.classList.add('columns-promo-cta');
        let el = cta.nextElementSibling;
        while (el) {
          if (el.tagName === 'P') {
            if (el.querySelector('picture')) el.classList.add('columns-promo-logo');
            else el.classList.add('columns-promo-disclaimer');
          }
          el = el.nextElementSibling;
        }
      }
    });
  });
}
