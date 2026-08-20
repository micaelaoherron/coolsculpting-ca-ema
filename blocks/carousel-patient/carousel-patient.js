/**
 * Patient transformation showcase carousel.
 * Each authored row is a card: image cell + content cell (title, CTA link, disclaimer).
 * Rebuilds into a horizontal scroll-snap track with the title/CTA overlaid on the
 * rounded photo and the disclaimer beneath it, plus prev/next arrows and page dots.
 */
export default function decorate(block) {
  const rows = [...block.children];
  const track = document.createElement('ul');
  track.className = 'carousel-patient-track';

  rows.forEach((row) => {
    const cells = [...row.children];
    const imgCell = cells[0];
    const contentCell = cells[1] || cells[0];
    const picture = imgCell ? imgCell.querySelector('picture') : null;
    const heading = contentCell
      ? contentCell.querySelector('h1, h2, h3, h4, h5, h6')
      : null;
    const link = contentCell ? contentCell.querySelector('a') : null;
    const paras = contentCell ? [...contentCell.querySelectorAll('p')] : [];
    const disc = paras.find((p) => !link || !p.contains(link)) || null;

    const li = document.createElement('li');
    li.className = 'carousel-patient-card';

    const photo = document.createElement('div');
    photo.className = 'carousel-patient-photo';
    if (picture) photo.append(picture);

    const overlay = document.createElement('div');
    overlay.className = 'carousel-patient-overlay';
    if (heading) overlay.append(heading);
    if (link) {
      link.classList.remove('button');
      link.classList.add('carousel-patient-cta');
      overlay.append(link);
    }
    photo.append(overlay);
    li.append(photo);

    if (disc) {
      disc.classList.add('carousel-patient-disc');
      li.append(disc);
    }

    track.append(li);
  });

  block.textContent = '';

  const viewport = document.createElement('div');
  viewport.className = 'carousel-patient-viewport';
  viewport.append(track);

  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'carousel-patient-arrow carousel-patient-prev';
  prev.setAttribute('aria-label', 'Previous');

  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'carousel-patient-arrow carousel-patient-next';
  next.setAttribute('aria-label', 'Next');

  const stage = document.createElement('div');
  stage.className = 'carousel-patient-stage';
  stage.append(viewport, prev, next);

  const dots = document.createElement('div');
  dots.className = 'carousel-patient-dots';

  block.append(stage, dots);

  const pageWidth = () => track.clientWidth;

  const updateState = () => {
    const max = track.scrollWidth - track.clientWidth - 1;
    prev.disabled = track.scrollLeft <= 1;
    next.disabled = track.scrollLeft >= max;
    const page = Math.round(track.scrollLeft / Math.max(1, pageWidth()));
    [...dots.children].forEach((d, i) => d.classList.toggle('active', i === page));
  };

  const buildDots = () => {
    const pages = Math.max(1, Math.round(track.scrollWidth / Math.max(1, pageWidth())));
    dots.innerHTML = '';
    for (let i = 0; i < pages; i += 1) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-patient-dot';
      dot.setAttribute('aria-label', `Go to page ${i + 1}`);
      dot.addEventListener('click', () => {
        track.scrollTo({ left: i * pageWidth(), behavior: 'smooth' });
      });
      dots.append(dot);
    }
    dots.style.display = pages > 1 ? '' : 'none';
    updateState();
  };

  prev.addEventListener('click', () => {
    track.scrollBy({ left: -pageWidth(), behavior: 'smooth' });
  });
  next.addEventListener('click', () => {
    track.scrollBy({ left: pageWidth(), behavior: 'smooth' });
  });

  let ticking = false;
  track.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(() => { updateState(); ticking = false; });
    }
  }, { passive: true });

  window.addEventListener('resize', buildDots);
  buildDots();
  // Recompute once images have loaded and affected scrollWidth.
  window.requestAnimationFrame(buildDots);
}
