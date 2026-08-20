const VIEW_IDS = ['home-view', 'view-drum', 'view-istanbul', 'view-thassos'];
const renderedViews = new Set();

document.getElementById('enter-btn').addEventListener('click', () => {
  document.getElementById('start-screen').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  if (!renderedViews.has('home-view')) {
    renderHome();
    renderedViews.add('home-view');
  }
  showView('home-view');
});

document.getElementById('home-btn').addEventListener('click', () => showView('home-view'));

document.querySelectorAll('.nav-card').forEach((btn) => {
  btn.addEventListener('click', () => {
    const zone = btn.dataset.view;
    const viewId = `view-${zone}`;
    if (!renderedViews.has(viewId)) {
      renderZone(zone, viewId);
      renderedViews.add(viewId);
    }
    showView(viewId);
  });
});

function showView(targetId) {
  VIEW_IDS.forEach((id) => {
    document.getElementById(id).classList.toggle('hidden', id !== targetId);
  });
}

function hasAllCoords(day) {
  return day.stops.every((s) => s.lat != null && s.lng != null);
}

function buildGoogleMapsUrl(stops) {
  const coords = stops.map((s) => `${s.lat},${s.lng}`).join('/');
  return `https://www.google.com/maps/dir/${coords}`;
}

/*
 * Punctul 5 — drumul ca ax al paginii.
 * Traseul auto trece prin 4 țări. Țara fiecărei opriri e derivată din
 * geografia reală a coordonatelor (nu e în data.js — e logică de prezentare).
 * Ziua 8 (Keramoti → București) nu are încă traseul real trimis, deci
 * doar sosirea (RO) e cunoscută cu certitudine.
 */
const STOP_COUNTRY = {
  '1-1': 'RO', '1-2': 'RO', '1-3': 'BG', '1-4': 'TR', '1-5': 'TR',
  '5-1': 'TR', '5-2': 'TR', '5-3': 'GR', '5-4': 'GR', '5-5': 'GR',
  '8-1': 'GR', '8-2': 'GR', '8-3': 'GR', '8-4': 'BG', '8-5': 'BG', '8-6': 'RO'
};

const COUNTRY_COLOR = {
  RO: '#C89B3C', // gold
  BG: '#3AA6A0', // turquoise
  TR: '#10395E', // cobalt
  GR: '#0A2540'  // deep
};

const COUNTRY_TEXT = {
  RO: '#0A2540', // deep text pe gold — contrast
  BG: '#0A2540', // deep text pe turcoaz
  TR: '#F2EFE6', // chalk text pe cobalt
  GR: '#F2EFE6'  // chalk text pe deep
};

const COUNTRY_END_OF_DAY = {
  1: 'TR',
  5: 'GR',
  8: 'RO'
};

function renderDay(day) {
  const article = document.createElement('article');
  article.className = 'day-card card';

  const header = document.createElement('header');
  header.className = 'day-header';
  header.innerHTML = `
    <span class="day-weekday">${day.weekday}</span>
    <span class="day-date">${day.date}</span>
    <span class="day-zone zone-${day.zone}">${day.zoneLabel}</span>
  `;
  article.appendChild(header);

  const title = document.createElement('h2');
  title.className = 'day-title';
  title.textContent = day.title;
  article.appendChild(title);

  const timeline = document.createElement('ol');
  timeline.className = 'timeline';

  let prevCountry = null;
  let prevItem = null;
  day.stops.forEach((stop) => {
    const item = document.createElement('li');
    item.className = 'timeline-item';

    let chip = '';
    if (day.zone === 'drum') {
      const country = STOP_COUNTRY[`${day.id}-${stop.order}`];
      if (country && prevCountry && country !== prevCountry && prevItem) {
        // granița se trece ÎNTRE oprirea anterioară și asta — se colorează
        // conectorul opririi anterioare (cel care duce spre oprirea curentă).
        prevItem.style.setProperty('--border-color', COUNTRY_COLOR[country]);
        prevItem.classList.add('is-border-crossing');
        chip = `<span class="border-chip" style="background:${COUNTRY_COLOR[country]};color:${COUNTRY_TEXT[country]}">${country}</span>`;
      }
      if (country) prevCountry = country;
    }

    item.innerHTML = `
      <span class="timeline-time">${stop.time ? stop.time : ''}</span>
      <span class="timeline-dot">${stop.order}</span>
      <div class="timeline-body">
        ${chip}
        <p class="timeline-title">${stop.title}</p>
        <p class="timeline-detail">${stop.detail}</p>
        ${stop.story ? `<p class="timeline-story">${stop.story}</p>` : ''}
      </div>
    `;
    timeline.appendChild(item);
    prevItem = item;
  });

  article.appendChild(timeline);

  if (hasAllCoords(day)) {
    const mapEl = document.createElement('div');
    mapEl.className = 'day-map';
    mapEl.id = `map-day-${day.id}`;
    article.appendChild(mapEl);

    const gmapsBtn = document.createElement('a');
    gmapsBtn.className = 'btn-gmaps';
    gmapsBtn.textContent = 'Deschide traseul zilei în Google Maps';
    gmapsBtn.href = buildGoogleMapsUrl(day.stops);
    gmapsBtn.target = '_blank';
    gmapsBtn.rel = 'noopener';
    article.appendChild(gmapsBtn);
  }

  return article;
}

function initDayMap(day) {
  const map = L.map(`map-day-${day.id}`, { scrollWheelZoom: false });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(map);

  const latlngs = day.stops.map((s) => [s.lat, s.lng]);

  day.stops.forEach((stop) => {
    const icon = L.divIcon({
      className: 'map-pin',
      html: `<span>${stop.order}</span>`,
      iconSize: [26, 26],
      iconAnchor: [13, 13]
    });
    L.marker([stop.lat, stop.lng], { icon }).addTo(map);
  });

  L.polyline(latlngs, {
    color: '#3AA6A0',
    weight: 3,
    dashArray: '6, 8'
  }).addTo(map);

  map.fitBounds(latlngs, { padding: [24, 24] });
}

function renderZone(zone, containerId) {
  const container = document.getElementById(containerId);
  const days = TRIP_DAYS.filter((day) => day.zone === zone);
  const mapsToInit = [];

  if (zone === 'istanbul' || zone === 'thassos') {
    const intro = document.createElement('p');
    intro.className = 'zone-intro';
    intro.textContent = zone === 'istanbul' ? TRIP_STORY.turkey : TRIP_STORY.greece;
    container.appendChild(intro);
  }

  const list = document.createElement('div');
  list.className = 'days-list';

  days.forEach((day) => {
    const row = document.createElement('div');
    row.className = 'day-row';

    const spine = document.createElement('span');
    spine.className = 'spine-seg';
    const spineColor = zone === 'drum'
      ? COUNTRY_COLOR[COUNTRY_END_OF_DAY[day.id]]
      : zone === 'istanbul' ? '#3AA6A0' : '#C89B3C';
    spine.style.background = spineColor;
    row.appendChild(spine);

    row.appendChild(renderDay(day));
    list.appendChild(row);

    if (hasAllCoords(day)) {
      mapsToInit.push(day);
    }
  });

  container.appendChild(list);
  mapsToInit.forEach((day) => initDayMap(day));
}

function renderProfile(person) {
  const card = document.createElement('div');
  card.className = 'profile-card card';
  card.innerHTML = `
    <div class="profile-portrait">
      <div class="profile-initial">${person.initial}</div>
      <img class="profile-photo" src="poze/${person.photo}" alt="${person.name}">
      <div class="profile-scrim-top">
        <p class="profile-pname">${person.name}</p>
        <p class="profile-ptitle">${person.title}</p>
      </div>
      <div class="profile-scrim-bottom">
        <p class="profile-pquote">&bdquo;${person.quote}&rdquo;</p>
      </div>
    </div>
    <div class="profile-body">
      <p class="profile-desc">${person.description}</p>
      <p class="profile-role">${person.role}</p>
    </div>
  `;
  const img = card.querySelector('.profile-photo');
  img.addEventListener('error', () => {
    img.style.display = 'none';
  });
  return card;
}

function renderHome() {
  const grid = document.getElementById('profiles-grid-home');
  PROFILES.forEach((person) => grid.appendChild(renderProfile(person)));
}

function initHeroMap() {
  const day1 = TRIP_DAYS.find((d) => d.id === 1);
  const day5 = TRIP_DAYS.find((d) => d.id === 5);
  const day8 = TRIP_DAYS.find((d) => d.id === 8);

  const points = [
    day1.stops[0],
    day1.stops[day1.stops.length - 1],
    day5.stops[day5.stops.length - 1],
    day8.stops[day8.stops.length - 1]
  ];
  const latlngs = points.map((p) => [p.lat, p.lng]);

  const map = L.map('hero-map', {
    scrollWheelZoom: false,
    dragging: false,
    zoomControl: false,
    attributionControl: false,
    tap: false
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
  }).addTo(map);

  const routeLine = L.polyline(latlngs, {
    color: '#3AA6A0',
    weight: 3,
    dashArray: '6, 8'
  }).addTo(map);

  latlngs.forEach((ll) => {
    L.circleMarker(ll, {
      radius: 5,
      color: '#F2EFE6',
      weight: 2,
      fillColor: '#C89B3C',
      fillOpacity: 1
    }).addTo(map);
  });

  map.fitBounds(latlngs, { padding: [20, 20] });

  return routeLine;
}

/*
 * Punctul 6 — animația din hero.
 * Linia se desenează (stroke-dashoffset pe path-ul SVG randat de Leaflet),
 * apoi bornele RO/BG/TR/GR apar pe rând. Fără JS activ sau cu
 * prefers-reduced-motion, totul rămâne vizibil direct (stare default în CSS).
 */
function initHeroAnimation(routeLine) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const path = routeLine.getElement ? routeLine.getElement() : null;
  const borders = document.getElementById('hero-borders');
  if (!path || !borders) return;

  requestAnimationFrame(() => {
    const len = path.getTotalLength();
    path.style.strokeDasharray = String(len);
    path.style.strokeDashoffset = String(len);
    path.getBoundingClientRect();
    path.style.transition = 'stroke-dashoffset 1.6s ease';
    requestAnimationFrame(() => {
      path.style.strokeDashoffset = '0';
    });

    borders.classList.add('will-animate');
    borders.querySelectorAll('.border-marker').forEach((el, i) => {
      setTimeout(() => el.classList.add('is-visible'), 500 + i * 300);
    });
  });
}

const heroRouteLine = initHeroMap();
initHeroAnimation(heroRouteLine);
