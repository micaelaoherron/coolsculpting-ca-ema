// eslint-disable-next-line import/no-unresolved
import { toClassName } from '../../scripts/aem.js';

/**
 * tabs-plan — numbered treatment-plan tabs.
 * Authored structure: each block row is `[tab-label cell, content cell]`.
 * The content cell holds: h3 title, description, CTA link, a note, and an image.
 * We build a tablist of buttons and turn each row into a tabpanel split into a
 * text column (title/description/CTA/note) and an asset column (image).
 */
export default async function decorate(block) {
  const tablist = document.createElement('div');
  tablist.className = 'tabs-plan-tablist';
  tablist.setAttribute('role', 'tablist');

  const rows = [...block.children];

  rows.forEach((row, i) => {
    const label = row.children[0];
    const contentCell = row.children[1];
    if (!label || !contentCell) return;
    const id = toClassName(label.textContent);

    // turn the row into a tabpanel
    row.className = 'tabs-plan-panel';
    row.id = `tabpanel-${id}`;
    row.setAttribute('role', 'tabpanel');
    row.setAttribute('aria-labelledby', `tab-${id}`);
    row.setAttribute('aria-hidden', i === 0 ? 'false' : 'true');

    // split content into a text column and an asset (image) column
    const textCol = document.createElement('div');
    textCol.className = 'tabs-plan-text';
    const asset = document.createElement('div');
    asset.className = 'tabs-plan-asset';

    [...contentCell.children].forEach((el) => {
      if (el.querySelector('picture, img')) asset.append(el);
      else textCol.append(el);
    });

    // style the CTA link as a filled button
    const ctaLink = textCol.querySelector('p a');
    if (ctaLink) {
      ctaLink.classList.add('button');
      const p = ctaLink.closest('p');
      if (p) p.className = 'tabs-plan-cta';
    }

    // the trailing paragraph is a fine-print note
    const paras = [...textCol.querySelectorAll(':scope > p')];
    const note = paras.filter((p) => !p.classList.contains('tabs-plan-cta')).pop();
    if (note) note.classList.add('tabs-plan-note');

    contentCell.replaceWith(textCol, asset);
    label.remove();

    // build the tab button
    const button = document.createElement('button');
    button.className = 'tabs-plan-tab';
    button.id = `tab-${id}`;
    button.type = 'button';
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    button.textContent = label.textContent.trim();
    button.addEventListener('click', () => {
      block.querySelectorAll('[role=tabpanel]').forEach((panel) => {
        panel.setAttribute('aria-hidden', 'true');
      });
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', 'false');
      });
      row.setAttribute('aria-hidden', 'false');
      button.setAttribute('aria-selected', 'true');
    });
    tablist.append(button);
  });

  block.prepend(tablist);
}
