import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment. Prefer explicit page metadata; otherwise try the
  // published root fragment (/footer) and fall back to /content/footer (local dev).
  const footerMeta = getMetadata('footer');
  let footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  let fragment = await loadFragment(footerPath);
  if (!fragment && !footerMeta) {
    footerPath = '/content/footer';
    fragment = await loadFragment(footerPath);
  }
  if (!fragment) return;

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // tag sections for styling: brand+social, link list, copyright
  const sections = [...footer.children];
  const classes = ['footer-brand', 'footer-links', 'footer-copyright'];
  sections.forEach((section, i) => {
    if (classes[i]) section.classList.add(classes[i]);
  });

  block.append(footer);
}
