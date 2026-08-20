export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;
  const cells = [...row.children];
  if (cells.length < 2) return;

  // first cell = anchor image + caption
  const asset = cells[0];
  asset.classList.add('columns-steps-asset');
  const assetParas = [...asset.querySelectorAll(':scope > p')];
  assetParas.forEach((p) => {
    if (!p.querySelector('picture')) p.classList.add('columns-steps-caption');
  });

  // remaining cells = numbered steps (number + heading + description)
  const steps = cells.slice(1);
  steps.forEach((cell) => {
    cell.classList.add('columns-steps-item');
    const num = cell.querySelector(':scope > p');
    if (num) num.classList.add('columns-steps-count');
  });

  // let the image column span all step rows on desktop
  block.style.setProperty('--columns-steps-count', String(steps.length));
}
