/*
 * Accordion FAQ Block (accordion-faq variant)
 *
 * Filterable FAQ accordion migrated from coolsculpting.com/how-it-works/faq.
 * Category filter pills switch between grouped question/answer panels; an
 * "Expand all / Collapse all" toggle operates on the visible panel; each item
 * expands/collapses with a circular +/- icon.
 *
 * Content model (authored table):
 *   - A category-header row: cell 1 contains the category name (usually bold),
 *     cell 2 is EMPTY. This starts a new category group.
 *   - A Q&A row: cell 1 = question label, cell 2 = answer body.
 *   - If no category-header rows are present (e.g. a single-category FAQ on the
 *     treatment-journey page), every row is a Q&A and no filter bar is shown.
 */

function cellIsEmpty(cell) {
  if (!cell) return true;
  if (cell.querySelector('img, picture, svg, ul, ol, a')) return false;
  return cell.textContent.replace(/\s+/g, '') === '';
}

function moveChildren(from, to) {
  if (from) to.append(...from.childNodes);
}

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // --- Parse rows into ordered categories, each with its Q&A items. ---
  const categories = [];
  let current = null;

  rows.forEach((row) => {
    const cells = [...row.children];
    const labelCell = cells[0];
    const bodyCell = cells[1];
    const isHeader = labelCell
      && labelCell.textContent.trim()
      && cellIsEmpty(bodyCell);

    if (isHeader) {
      current = { name: labelCell.textContent.trim(), items: [] };
      categories.push(current);
      return;
    }
    if (!labelCell) return;
    if (!current) {
      current = { name: '', items: [] };
      categories.push(current);
    }
    current.items.push({ labelCell, bodyCell });
  });

  if (!categories.length) return;

  const named = categories.filter((c) => c.name);
  const showFilters = named.length > 1;

  block.textContent = '';

  // --- Build a panel of <details> items per category. ---
  const panels = categories.map((cat, index) => {
    const panel = document.createElement('div');
    panel.className = 'accordion-faq-panel';
    if (cat.name) panel.dataset.category = cat.name;
    if (index === 0) panel.classList.add('accordion-faq-panel-active');

    cat.items.forEach(({ labelCell, bodyCell }) => {
      const details = document.createElement('details');
      details.className = 'accordion-faq-item';

      const summary = document.createElement('summary');
      summary.className = 'accordion-faq-summary';
      const question = document.createElement('span');
      question.className = 'accordion-faq-question';
      moveChildren(labelCell, question);
      const icon = document.createElement('span');
      icon.className = 'accordion-faq-icon';
      icon.setAttribute('aria-hidden', 'true');
      summary.append(question, icon);

      const answer = document.createElement('div');
      answer.className = 'accordion-faq-answer';
      moveChildren(bodyCell, answer);

      details.append(summary, answer);
      panel.append(details);
    });

    return { cat, panel };
  });

  // --- Filters (optional) + expand-all toggle. ---
  let filterBar = null;
  if (showFilters) {
    filterBar = document.createElement('div');
    filterBar.className = 'accordion-faq-filters';
    filterBar.setAttribute('role', 'tablist');
    categories.forEach((cat, index) => {
      if (!cat.name) return;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'accordion-faq-filter';
      btn.textContent = cat.name;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
      if (index === 0) btn.classList.add('accordion-faq-filter-active');
      btn.addEventListener('click', () => {
        filterBar.querySelectorAll('.accordion-faq-filter').forEach((b) => {
          b.classList.remove('accordion-faq-filter-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('accordion-faq-filter-active');
        btn.setAttribute('aria-selected', 'true');
        panels.forEach(({ cat: c, panel }) => {
          panel.classList.toggle('accordion-faq-panel-active', c === cat);
        });
      });
      filterBar.append(btn);
    });
  }

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'accordion-faq-toggle';
  toggle.setAttribute('aria-pressed', 'false');
  const toggleIcon = document.createElement('span');
  toggleIcon.className = 'accordion-faq-toggle-icon';
  toggleIcon.setAttribute('aria-hidden', 'true');
  const toggleLabel = document.createElement('span');
  toggleLabel.className = 'accordion-faq-toggle-label';
  toggleLabel.textContent = 'Expand all';
  toggle.append(toggleIcon, toggleLabel);
  toggle.addEventListener('click', () => {
    const activePanel = block.querySelector('.accordion-faq-panel-active');
    if (!activePanel) return;
    const items = [...activePanel.querySelectorAll('details')];
    const expand = items.some((d) => !d.open);
    items.forEach((d) => { d.open = expand; });
    toggle.classList.toggle('accordion-faq-toggle-open', expand);
    toggle.setAttribute('aria-pressed', expand ? 'true' : 'false');
    toggleLabel.textContent = expand ? 'Collapse all' : 'Expand all';
  });

  // --- Assemble. On desktop CSS lays this out as two columns: the aside
  // (heading area handled by the section + filters) on the left, the list on
  // the right. Here we emit: [filters] [toggle] [list]. ---
  const aside = document.createElement('div');
  aside.className = 'accordion-faq-aside';
  if (filterBar) aside.append(filterBar);

  const main = document.createElement('div');
  main.className = 'accordion-faq-main';
  const toggleRow = document.createElement('div');
  toggleRow.className = 'accordion-faq-toggle-row';
  toggleRow.append(toggle);
  const list = document.createElement('div');
  list.className = 'accordion-faq-list';
  panels.forEach(({ panel }) => list.append(panel));
  main.append(toggleRow, list);

  block.append(aside, main);
  if (showFilters) block.classList.add('accordion-faq-filtered');
}
