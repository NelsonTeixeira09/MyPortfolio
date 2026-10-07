/**
 * Turns `content.js` into the page's static HTML. Runs at build time (and on
 * every request in dev) via the plugin in vite.config.js, so the published
 * page is plain semantic HTML that works before any JavaScript loads.
 */

const PLACEHOLDER = /\[([^\]]+)\]/g;
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);

/** Escaped text with [placeholders] highlighted. */
const t = (s) => esc(s).replace(PLACEHOLDER, '<span class="ph" title="Placeholder — edit src/content.js">[$1]</span>');

const isPlaceholder = (s) => /\[[^\]]+\]/.test(s ?? '');

function linkAttrs(href) {
  const attrs = [`href="${esc(href)}"`];
  if (isPlaceholder(href)) attrs.push('data-placeholder');
  else if (/^https?:/.test(href)) attrs.push('target="_blank"', 'rel="noopener noreferrer"');
  return attrs.join(' ');
}

function formatMonth(iso) {
  const m = /^(\d{4})-(\d{2})$/.exec(iso ?? '');
  return m ? `${MONTHS[Number(m[2]) - 1]} ${m[1]}` : t(iso);
}

/* ── Icons ─────────────────────────────────────────────────────────────── */

const svg = (body, cls = 'icon', viewBox = '0 0 24 24') =>
  `<svg class="${cls}" viewBox="${viewBox}" aria-hidden="true" focusable="false">${body}</svg>`;

const stroke = (d) => `<path d="${d}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`;

const ICONS = {
  arrow: svg(stroke('M5 12h14M13 6l6 6-6 6')),
  arrowUpRight: svg(stroke('M7 17L17 7M9 7h8v8')),
  arrowUp: svg(stroke('M12 19V5M6 11l6-6 6 6')),
  mail: svg(stroke('M3 6.5A1.5 1.5 0 0 1 4.5 5h15A1.5 1.5 0 0 1 21 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5zM3.5 6l8.5 7 8.5-7')),
  copy: svg(stroke('M9 9h10v11H9zM5 15V4h10')),
  lock: svg(stroke('M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3')),
  platform: svg(stroke('M12 3l8.5 4.5L12 12 3.5 7.5zM3.5 12L12 16.5 20.5 12M3.5 16.5L12 21l8.5-4.5')),
  code: svg(stroke('M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16')),
  plug: svg(stroke('M9 3v5M15 3v5M6.5 8h11v3a5.5 5.5 0 0 1-11 0zM12 16.5V21')),
  tools: svg(stroke('M14.5 6.5a4 4 0 0 0 5 5L12 19a2.1 2.1 0 0 1-3-3l7.5-7.5zM4 4l4.5 4.5M3 7l4-4')),
  cap: svg(stroke('M2.5 9L12 4.5 21.5 9 12 13.5zM6.5 11v4.5c0 1.4 2.5 3 5.5 3s5.5-1.6 5.5-3V11M21.5 9v5')),
  github: svg('<path fill="currentColor" d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.82-.26.82-.57v-2.04c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.5 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22v3.29c0 .32.21.69.82.57A12 12 0 0 0 12 .3"/>'),
  linkedin: svg('<path fill="currentColor" d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13M7.12 20.45H3.56V9h3.56zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0"/>'),
};

/* ── Project card illustrations ────────────────────────────────────────── */

function projectArt(kind, id) {
  const g = `art-g-${id}`;
  const defs = `<defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4de1ff"/><stop offset=".5" stop-color="#3d7bff"/><stop offset="1" stop-color="#8b5cf6"/></linearGradient></defs>`;
  const faint = 'fill="rgba(255,255,255,.025)" stroke="rgba(255,255,255,.16)"';
  const hot = `fill="rgba(77,225,255,.06)" stroke="url(#${g})" stroke-width="1.6"`;
  let body = '';

  if (kind === 'commerce') {
    for (let r = 0; r < 2; r++)
      for (let c = 0; c < 4; c++) {
        const x = 52 + c * 76, y = 48 + r * 78, active = r === 0 && c === 2;
        body += `<rect x="${x}" y="${y}" width="64" height="66" rx="10" ${active ? hot : faint}/>`;
        body += `<rect x="${x + 10}" y="${y + 10}" width="44" height="28" rx="6" fill="${active ? `url(#${g})` : 'rgba(255,255,255,.06)'}" opacity="${active ? 0.55 : 1}"/>`;
        body += `<path d="M${x + 10} ${y + 48}h30M${x + 10} ${y + 56}h18" stroke="rgba(255,255,255,${active ? 0.5 : 0.18})" stroke-width="3" stroke-linecap="round"/>`;
      }
    body += `<path class="art-flow" d="M30 210 C 120 170, 260 230, 372 150" fill="none" stroke="url(#${g})" stroke-width="1.4" stroke-dasharray="4 7"/>`;
  } else if (kind === 'gov') {
    body += `<rect x="70" y="34" width="260" height="172" rx="14" ${faint}/>`;
    body += `<path d="M70 66h260" stroke="rgba(255,255,255,.12)"/><circle cx="90" cy="50" r="5" fill="url(#${g})"/><path d="M104 50h70" stroke="rgba(255,255,255,.3)" stroke-width="4" stroke-linecap="round"/>`;
    [150, 110, 180, 90, 140].forEach((w, i) => {
      const y = 88 + i * 22, active = i === 2;
      body += `<rect x="88" y="${y - 7}" width="12" height="12" rx="3" ${active ? hot : faint}/>`;
      body += `<path d="M112 ${y - 1}h${w}" stroke="${active ? `url(#${g})` : 'rgba(255,255,255,.18)'}" stroke-width="4" stroke-linecap="round"/>`;
      body += `<path d="M${282} ${y - 1}h28" stroke="rgba(255,255,255,.1)" stroke-width="4" stroke-linecap="round"/>`;
    });
    body += `<path class="art-flow" d="M345 70 l22 8 v24 c0 18-10 28-22 34 c-12-6-22-16-22-34 v-24z" fill="rgba(139,92,246,.08)" stroke="url(#${g})" stroke-width="1.6" stroke-dasharray="5 5"/>`;
  } else if (kind === 'portal') {
    body += `<rect x="46" y="30" width="308" height="182" rx="14" ${faint}/>`;
    body += `<path d="M46 56h308" stroke="rgba(255,255,255,.12)"/>`;
    [62, 76, 90].forEach((x) => (body += `<circle cx="${x}" cy="43" r="4" fill="rgba(255,255,255,.2)"/>`));
    body += `<rect x="58" y="68" width="66" height="132" rx="8" fill="rgba(255,255,255,.035)"/>`;
    [86, 106, 126, 146].forEach((y, i) => (body += `<path d="M70 ${y}h${i === 1 ? 42 : 32}" stroke="${i === 1 ? `url(#${g})` : 'rgba(255,255,255,.2)'}" stroke-width="4" stroke-linecap="round"/>`));
    body += `<circle cx="160" cy="92" r="16" ${hot}/><path d="M186 86h80M186 100h52" stroke="rgba(255,255,255,.25)" stroke-width="4" stroke-linecap="round"/>`;
    body += `<rect x="138" y="124" width="98" height="76" rx="10" ${faint}/><rect x="244" y="124" width="98" height="76" rx="10" ${hot}/>`;
    body += `<path class="art-flow" d="M256 180 l18 -18 l16 10 l28 -30" fill="none" stroke="url(#${g})" stroke-width="1.6" stroke-dasharray="4 5"/>`;
  } else if (kind === 'integrations') {
    const nodes = [[80, 62], [76, 174], [324, 58], [330, 170], [200, 206]];
    nodes.forEach(([x, y]) => {
      body += `<path class="art-flow" d="M200 120 Q ${(x + 200) / 2} ${y < 120 ? y + 40 : y - 40} ${x} ${y}" fill="none" stroke="url(#${g})" stroke-width="1.3" stroke-dasharray="3 6" opacity=".8"/>`;
    });
    nodes.forEach(([x, y]) => (body += `<circle cx="${x}" cy="${y}" r="15" ${faint}/><circle cx="${x}" cy="${y}" r="4" fill="url(#${g})"/>`));
    body += `<path d="M200 82l33 19v38l-33 19-33-19v-38z" ${hot}/><path d="M188 114l-8 6 8 6M212 114l8 6-8 6" fill="none" stroke="#e8f4ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
  } else if (kind === 'ai') {
    const cols = [[110, [80, 120, 160]], [200, [60, 100, 140, 180]], [290, [80, 120, 160]]];
    for (let c = 0; c < cols.length - 1; c++)
      for (const y1 of cols[c][1])
        for (const y2 of cols[c + 1][1])
          body += `<path d="M${cols[c][0]} ${y1} L${cols[c + 1][0]} ${y2}" stroke="rgba(255,255,255,.08)"/>`;
    body += `<path class="art-flow" d="M110 120 L200 100 L290 80" fill="none" stroke="url(#${g})" stroke-width="1.6" stroke-dasharray="4 5"/>`;
    cols.forEach(([x, ys]) =>
      ys.forEach((y) => {
        const active = (x === 110 && y === 120) || (x === 200 && y === 100) || (x === 290 && y === 80);
        body += `<circle cx="${x}" cy="${y}" r="${active ? 9 : 7}" ${active ? hot : faint}/>`;
      }),
    );
    body += `<path d="M330 44 q2 12 14 14 q-12 2 -14 14 q-2 -12 -14 -14 q12 -2 14 -14z" fill="url(#${g})" opacity=".85"/>`;
  } else if (kind === 'cap') {
    ['app', 'srv', 'db'].forEach((label, i) => {
      const y = 62 + i * 46, active = i === 1;
      body += `<path d="M200 ${y - 30} L292 ${y} L200 ${y + 30} L108 ${y} Z" ${active ? hot : faint}/>`;
      body += `<text x="306" y="${y + 4}" fill="${active ? '#4de1ff' : 'rgba(255,255,255,.4)'}" font-family="ui-monospace, monospace" font-size="12">${label}/</text>`;
    });
    body += `<path class="art-flow" d="M200 48 V 196" stroke="url(#${g})" stroke-width="1.4" stroke-dasharray="3 5"/>`;
  }

  return `<svg class="project-svg" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">${defs}${body}</svg>`;
}

/* ── Sections ──────────────────────────────────────────────────────────── */

const NAV = [
  ['about', 'About'],
  ['experience', 'Experience'],
  ['projects', 'Projects'],
  ['skills', 'Skills'],
  ['credentials', 'Credentials'],
  ['contact', 'Contact'],
];

const sectionHead = (index, id, eyebrow, heading, lead = '') => `
      <header class="section-head" data-reveal>
        <p class="section-eyebrow"><span class="section-index">${index}</span>${esc(eyebrow)}</p>
        <h2 class="section-title" id="${id}-title">${t(heading)}</h2>
        ${lead ? `<p class="section-lead">${t(lead)}</p>` : ''}
      </header>`;

const tags = (list = []) =>
  list.length ? `<ul class="tag-list" aria-label="Technologies">${list.map((x) => `<li>${t(x)}</li>`).join('')}</ul>` : '';

function header(c) {
  return `
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header" data-header>
  <nav class="nav container" aria-label="Primary">
    <a class="brand" href="#top" aria-label="${esc(c.person.name)} — back to top">
      <span class="brand-mark" aria-hidden="true">NT</span>
      <span class="brand-name">${esc(c.person.name)}</span>
    </a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-menu" data-nav-toggle>
      <span class="sr-only">Menu</span>
      <span class="nav-toggle-bars" aria-hidden="true"></span>
    </button>
    <ul class="nav-menu" id="nav-menu" data-nav-menu>
      ${NAV.map(([id, label]) => `<li><a class="nav-link${id === 'contact' ? ' nav-link--cta' : ''}" href="#${id}" data-nav-link>${label}</a></li>`).join('\n      ')}
    </ul>
  </nav>
</header>`;
}

function hero(c) {
  const [first, ...rest] = c.person.name.split(' ');
  return `
  <section class="hero" id="top" aria-labelledby="hero-title">
    <div class="hero-visual" aria-hidden="true" data-hero-visual>
      <div class="orb-fallback" data-orb-anchor><span class="orb-float"><span class="orb-body"></span><span class="orb-ring"></span><span class="orb-ring orb-ring--2"></span></span></div>
      <canvas class="hero-canvas" data-hero-canvas></canvas>
    </div>
    <div class="container hero-inner">
      <div class="hero-content">
        <p class="eyebrow hero-eyebrow" data-hero-in><span class="pulse" aria-hidden="true"></span>${esc(c.person.role)} · ${esc(c.person.location)}</p>
        <h1 class="hero-title" id="hero-title" data-hero-in>
          <span class="hero-title-line">${esc(first)}</span>
          <span class="hero-title-line hero-title-line--accent">${esc(rest.join(' '))}</span>
        </h1>
        <p class="hero-lead" data-hero-in>${t(c.person.intro)}</p>
        <div class="hero-actions" data-hero-in>
          <a class="btn btn--primary" href="#projects">View my work ${ICONS.arrow}</a>
          <a class="btn btn--ghost" href="#contact">Contact me</a>
        </div>
        <ul class="hero-focus" aria-label="Focus areas" data-hero-in>
          ${c.person.focus.map((f) => `<li>${t(f)}</li>`).join('')}
        </ul>
      </div>
    </div>
    <a class="scroll-cue" href="#about"><span class="scroll-cue-line" aria-hidden="true"></span>Scroll</a>
  </section>`;
}

function about(c) {
  const a = c.about;
  return `
  <section class="section about" id="about" aria-labelledby="about-title">
    <div class="container">
      ${sectionHead('01', 'about', 'About', a.heading)}
      <div class="about-grid">
        <div class="about-text" data-reveal>
          ${a.paragraphs.map((p) => `<p>${t(p)}</p>`).join('\n          ')}
        </div>
        <dl class="about-facts">
          ${a.facts.map((f, i) => `<div class="fact" data-reveal style="--i:${i}"><dt>${t(f.label)}</dt><dd>${t(f.value)}</dd></div>`).join('\n          ')}
        </dl>
      </div>
    </div>
  </section>`;
}

function experience(c) {
  const items = c.experience
    .map(
      (e, i) => `
        <li class="timeline-item${e.learning ? ' timeline-item--learning' : ''}" data-reveal style="--i:${i}">
          <span class="timeline-node" aria-hidden="true"></span>
          <article class="timeline-card card">
            <header class="timeline-head">
              <p class="timeline-date">${t(e.start)} <span aria-hidden="true">—</span><span class="sr-only">to</span> ${t(e.end)}</p>
              <h3 class="timeline-role">${t(e.role)}${e.learning ? ' <span class="badge badge--learning">Learning</span>' : ''}</h3>
              <p class="timeline-org">${t(e.company)}${e.location ? ` <span class="dot" aria-hidden="true">·</span> ${t(e.location)}` : ''}</p>
            </header>
            ${e.summary ? `<p class="timeline-summary">${t(e.summary)}</p>` : ''}
            ${e.highlights?.length ? `<ul class="timeline-points">${e.highlights.map((h) => `<li>${t(h)}</li>`).join('')}</ul>` : ''}
            ${tags(e.tags)}
          </article>
        </li>`,
    )
    .join('');
  return `
  <section class="section experience" id="experience" aria-labelledby="experience-title">
    <div class="container">
      ${sectionHead('02', 'experience', 'Experience', 'Where I’ve been building.')}
      <ol class="timeline">${items}
      </ol>
    </div>
  </section>`;
}

function projects(c) {
  const cards = c.projects
    .map(
      (p, i) => `
        <li class="project" data-reveal style="--i:${i % 3}">
          <article class="project-card card project-card--${esc(p.art)}" data-tilt>
            <div class="project-art">${projectArt(p.art, i)}</div>
            <div class="project-body">
              <p class="project-meta">
                <span class="badge badge--${p.status === 'learning' ? 'learning' : 'pro'}">${p.status === 'learning' ? 'Learning' : 'Professional'}</span>
                ${p.confidential ? `<span class="badge badge--muted">${ICONS.lock}Confidential</span>` : ''}
              </p>
              <h3 class="project-title">${t(p.title)}</h3>
              <p class="project-summary">${t(p.summary)}</p>
              ${tags(p.tags)}
              ${p.link ? `<a class="project-link" ${linkAttrs(p.link)}>View project ${ICONS.arrowUpRight}<span class="sr-only"> — ${esc(p.title)}</span></a>` : ''}
            </div>
            <span class="card-glare" aria-hidden="true"></span>
          </article>
        </li>`,
    )
    .join('');
  return `
  <section class="section projects" id="projects" aria-labelledby="projects-title">
    <div class="container">
      ${sectionHead('03', 'projects', 'Projects', 'Selected work.', 'Several projects were built for clients under confidentiality, so they are described by the kind of work rather than by name.')}
      <ul class="project-grid">${cards}
      </ul>
    </div>
  </section>`;
}

function skills(c) {
  const groups = c.skills
    .map(
      (g, i) => `
        <article class="skill-group card" data-reveal style="--i:${i}">
          <header class="skill-group-head">
            <span class="skill-icon">${ICONS[g.icon] ?? ICONS.code}</span>
            <h3>${t(g.name)}</h3>
          </header>
          <p class="skill-group-desc">${t(g.description)}</p>
          <ul class="chip-list">
            ${g.items.map((s) => `<li class="chip chip--${s.level === 'learning' ? 'learning' : 'pro'}">${t(s.name)}<span class="sr-only"> (${s.level === 'learning' ? 'learning / practice' : 'professional experience'})</span></li>`).join('\n            ')}
          </ul>
        </article>`,
    )
    .join('');
  return `
  <section class="section skills" id="skills" aria-labelledby="skills-title">
    <div class="container">
      ${sectionHead('04', 'skills', 'Skills', 'Toolkit.')}
      <div class="skills-legend" data-reveal>
        <span class="legend-item"><span class="legend-swatch legend-swatch--pro" aria-hidden="true"></span>Professional experience</span>
        <span class="legend-item"><span class="legend-swatch legend-swatch--learning" aria-hidden="true"></span>Learning / practice</span>
      </div>
      <div class="skills-grid">${groups}
      </div>
    </div>
  </section>`;
}

function credentials(c) {
  const certs = c.certifications
    .map(
      (cert, i) => `
          <li class="cred-card" data-reveal style="--i:${i}">
            <span class="cred-badge" aria-hidden="true">
              <svg viewBox="0 0 64 64"><defs><linearGradient id="cred-g-${i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4de1ff"/><stop offset="1" stop-color="#8b5cf6"/></linearGradient></defs><path d="M32 4l24 14v28L32 60 8 46V18z" fill="rgba(77,225,255,.06)" stroke="url(#cred-g-${i})" stroke-width="2"/><path d="M22 32.5l7 7 13-14" fill="none" stroke="#e8f4ff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </span>
            <div class="cred-info">
              <p class="cred-issuer">${t(cert.issuer)}</p>
              <h4 class="cred-name">${t(cert.name)}</h4>
              <p class="cred-date">Issued <time datetime="${esc(cert.issued)}">${formatMonth(cert.issued)}</time></p>
              ${cert.credentialUrl ? `<a class="cred-link" ${linkAttrs(cert.credentialUrl)}>Verify credential ${ICONS.arrowUpRight}<span class="sr-only"> — ${esc(cert.name)}</span></a>` : ''}
            </div>
            <span class="cred-sheen" aria-hidden="true"></span>
          </li>`,
    )
    .join('');
  const edu = c.education
    .map(
      (e, i) => `
          <li class="edu-card card" data-reveal style="--i:${i}">
            <span class="skill-icon">${ICONS.cap}</span>
            <div>
              <h4 class="edu-title">${t(e.title)}</h4>
              <p class="edu-institution">${t(e.institution)}</p>
              <p class="edu-period">${t(e.period)}</p>
              ${e.note ? `<p class="edu-note">${t(e.note)}</p>` : ''}
            </div>
          </li>`,
    )
    .join('');
  return `
  <section class="section credentials" id="credentials" aria-labelledby="credentials-title">
    <div class="container">
      ${sectionHead('05', 'credentials', 'Certifications & education', 'Credentials.')}
      <div class="creds-layout">
        <div>
          <h3 class="sub-head" data-reveal>Certifications</h3>
          <ul class="cred-grid">${certs}
          </ul>
        </div>
        <div>
          <h3 class="sub-head" data-reveal>Education</h3>
          <ul class="edu-list">${edu}
          </ul>
        </div>
      </div>
    </div>
  </section>`;
}

function contact(c) {
  const k = c.contact;
  return `
  <section class="section contact" id="contact" aria-labelledby="contact-title">
    <div class="container">
      <div class="contact-panel" data-reveal>
        <div class="contact-glow" aria-hidden="true"></div>
        <p class="section-eyebrow"><span class="section-index">06</span>Contact</p>
        <h2 class="contact-title" id="contact-title">${t(k.heading)}</h2>
        <p class="contact-text">${t(k.text)}</p>
        <div class="contact-email">
          <a class="contact-email-link" ${linkAttrs(`mailto:${k.email}`)}>${ICONS.mail}<span>${t(k.email)}</span></a>
          <button class="btn btn--ghost btn--sm" type="button" data-copy="${esc(k.email)}">${ICONS.copy}<span data-copy-label>Copy email</span></button>
        </div>
        <ul class="contact-links">
          ${k.links
            .map(
              (l) => `<li><a class="contact-link" ${linkAttrs(l.href)}>${ICONS[l.icon] ?? ICONS.arrowUpRight}<span class="contact-link-text"><span class="contact-link-label">${t(l.label)}</span><span class="contact-link-handle">${t(l.handle)}</span></span>${ICONS.arrowUpRight}</a></li>`,
            )
            .join('\n          ')}
        </ul>
      </div>
    </div>
  </section>`;
}

function footer(c) {
  return `
<footer class="site-footer">
  <div class="container footer-inner">
    <p class="footer-brand"><span class="brand-mark" aria-hidden="true">NT</span>${esc(c.person.name)}</p>
    <p class="footer-note">© <span data-year>${new Date().getFullYear()}</span> ${esc(c.person.name)}. ${t(c.footer.note)}</p>
    <a class="footer-top" href="#top">Back to top ${ICONS.arrowUp}</a>
  </div>
</footer>
<div class="toast" role="status" aria-live="polite" data-toast></div>`;
}

export function render(c) {
  const body = [
    header(c),
    '<main id="main">',
    hero(c),
    about(c),
    experience(c),
    projects(c),
    skills(c),
    credentials(c),
    contact(c),
    '</main>',
    footer(c),
  ].join('\n');
  return { title: esc(c.meta.title), description: esc(c.meta.description), body };
}
