/*
 * Embed Video Block
 * Renders an inline, responsive 16:9 video embed with an optional
 * heading and description above it. Supports Vimeo, YouTube and a
 * generic iframe fallback. The video iframe is inserted lazily when
 * the block scrolls into view (or immediately when a poster is clicked).
 */

const buildIframe = (src, title) => `
  <div class="embed-video-frame">
    <iframe src="${src}" title="${title}"
      frameborder="0" scrolling="no" allowfullscreen
      allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
      loading="lazy"></iframe>
  </div>`;

const vimeoSrc = (url, autoplay) => {
  const [, video] = url.pathname.split('/');
  const params = new URLSearchParams({ byline: '0', portrait: '0', title: '0' });
  if (autoplay) {
    params.set('autoplay', '1');
    params.set('muted', '1');
  }
  return `https://player.vimeo.com/video/${video}?${params.toString()}`;
};

const youtubeSrc = (url, autoplay) => {
  const usp = new URLSearchParams(url.search);
  let vid = usp.get('v') ? encodeURIComponent(usp.get('v')) : '';
  if (url.hostname.includes('youtu.be')) {
    [, vid] = url.pathname.split('/');
  }
  const suffix = autoplay ? '&muted=1&autoplay=1' : '';
  return `https://www.youtube.com/embed/${vid}?rel=0${suffix}`;
};

const embedSrc = (url, autoplay) => {
  const link = url.href;
  if (link.includes('vimeo')) return vimeoSrc(url, autoplay);
  if (link.includes('youtube') || link.includes('youtu.be')) return youtubeSrc(url, autoplay);
  return link;
};

const loadEmbed = (container, url, title, autoplay) => {
  if (container.dataset.embedLoaded === 'true') return;
  container.innerHTML = buildIframe(embedSrc(url, autoplay), title);
  container.dataset.embedLoaded = 'true';
};

export default function decorate(block) {
  // Locate the video link and (optionally) a poster image.
  const anchor = block.querySelector('a[href]');
  if (!anchor) return;
  const url = new URL(anchor.href);
  const title = block.querySelector('h1, h2, h3, h4, h5, h6')?.textContent?.trim() || 'Video';
  const placeholder = block.querySelector('picture');

  // Remove the paragraph that only holds the raw video link.
  const linkParagraph = anchor.closest('p') || anchor;
  linkParagraph.remove();

  // Container that will host the responsive iframe / poster.
  const media = document.createElement('div');
  media.className = 'embed-video-media';

  if (placeholder) {
    const poster = document.createElement('div');
    poster.className = 'embed-video-placeholder';
    poster.append(placeholder);
    const play = document.createElement('button');
    play.type = 'button';
    play.className = 'embed-video-play';
    play.setAttribute('aria-label', `Play ${title}`);
    poster.append(play);
    poster.addEventListener('click', () => loadEmbed(media, url, title, true));
    media.append(poster);
    block.append(media);
  } else {
    block.append(media);
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        observer.disconnect();
        loadEmbed(media, url, title, false);
      }
    });
    observer.observe(media);
  }
}
