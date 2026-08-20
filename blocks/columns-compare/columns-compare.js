/*
 * columns-compare
 * Two-column comparison layout (e.g. "How is CoolSculpting different from
 * liposuction?"): a text column (heading + explanatory paragraph + disclaimer)
 * paired with a single image column, on a distinct card background. Static
 * side-by-side, no CTA.
 */
export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-compare-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-compare-img-col');
        }
      }
    });
  });
}
