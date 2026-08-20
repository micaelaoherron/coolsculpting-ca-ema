// eslint-disable-next-line import/no-unresolved
import { toClassName } from '../../scripts/aem.js';

/**
 * tabs-bodyarea — body-area silhouette tabs.
 * Authored structure (per row): [ tab-label cell, content cell ].
 * The content cell holds: <p><picture>…</picture></p>, <h2>, <p>.
 * We build a tablist of buttons and turn each row into an image-teaser
 * panel with the picture as a full-bleed layer and the heading/copy
 * overlaid (desktop) or stacked (mobile).
 */
export default async function decorate(block) {
  const tablist = document.createElement('div');
  tablist.className = 'tabs-bodyarea-list';
  tablist.setAttribute('role', 'tablist');

  const rows = [...block.children];

  rows.forEach((panel, i) => {
    const labelCell = panel.firstElementChild;
    const label = labelCell ? labelCell.textContent.trim() : `Tab ${i + 1}`;
    const id = toClassName(label) || `tab-${i}`;

    // the remaining content cell (after the label cell)
    const contentCell = panel.children[1] || panel.children[0];

    // configure the panel
    panel.className = 'tabs-bodyarea-panel';
    panel.id = `tabpanel-${id}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `tab-${id}`);
    panel.setAttribute('aria-hidden', i !== 0 ? 'true' : 'false');

    // split the content cell into an image layer + a text layer
    if (contentCell) {
      const picture = contentCell.querySelector('picture');
      const imageLayer = document.createElement('div');
      imageLayer.className = 'tabs-bodyarea-image';
      if (picture) {
        // move the picture (unwrap its <p>) into the image layer
        imageLayer.append(picture);
      }

      const content = document.createElement('div');
      content.className = 'tabs-bodyarea-content';
      // move whatever remains (heading, copy) into the content layer
      [...contentCell.children].forEach((child) => {
        // skip now-empty paragraphs left over from the moved picture
        if (child.tagName === 'P' && !child.textContent.trim() && !child.querySelector('img, picture')) {
          child.remove();
          return;
        }
        content.append(child);
      });

      panel.textContent = '';
      panel.append(imageLayer, content);
    }

    // build the tab button
    const button = document.createElement('button');
    button.className = 'tabs-bodyarea-tab';
    button.id = `tab-${id}`;
    button.type = 'button';
    button.textContent = label;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    button.addEventListener('click', () => {
      block.querySelectorAll('[role="tabpanel"]').forEach((p) => p.setAttribute('aria-hidden', 'true'));
      tablist.querySelectorAll('button').forEach((b) => b.setAttribute('aria-selected', 'false'));
      panel.setAttribute('aria-hidden', 'false');
      button.setAttribute('aria-selected', 'true');
    });
    tablist.append(button);
  });

  block.prepend(tablist);
}
