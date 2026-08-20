import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment — prefer the migrated fragment under /content,
  // fall back to page metadata (DA/EDS production) then the EDS default.
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta
    ? new URL(footerMeta, window.location).pathname
    : '/content/footer';
  const fragment = await loadFragment(footerPath);

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
