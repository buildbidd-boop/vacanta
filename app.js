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

  day.stops.forEach((stop) => {
    const item = document.createElement('li');
    item.className = 'timeline-item';
    item.innerHTML = `
      <span class="timeline-time">${stop.time ? stop.time : ''}</span>
      <span class="timeline-dot">${stop.order}</span>
      <div class="timeline-body">
        <p class="timeline-title">${stop.title}</p>
        <p class="timeline-detail">${stop.detail}</p>
        ${stop.story ? `<p class="timeline-story">${stop.story}</p>` : ''}
      </div>
    `;
    timeline.appendChild(item);
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
    color: '#2E9E9B',
    weight: 3,
    dashArray: '6, 8'
  }).addTo(map);

  map.fitBounds(latlngs, { padding: [24, 24] });
}

function renderZone(zone, containerId) {
  const container = document.getElementById(containerId);
  const days = TRIP_DAYS.filter((day) => day.zone === zone);
  const mapsToInit = [];

  days.forEach((day) => {
    container.appendChild(renderDay(day));
    if (hasAllCoords(day)) {
      mapsToInit.push(day);
    }
  });

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
      <p class="profile-mustdo"><strong>Must-do:</strong> ${person.mustDo ? person.mustDo : 'TODO — de completat'}</p>
    </div>
  `;
  const img = card.querySelector('.profile-photo');
  img.addEventListener('error', () => {
    img.style.display = 'none';
  });
  return card;
}

function renderHome() {
  const storyEl = document.getElementById('trip-story');
  storyEl.innerHTML = `
    <p class="story-p">${TRIP_STORY.intro}</p>
    <p class="story-p">${TRIP_STORY.turkey}</p>
    <p class="story-p">${TRIP_STORY.greece}</p>
  `;

  const grid = document.getElementById('profiles-grid-home');
  PROFILES.forEach((person) => grid.appendChild(renderProfile(person)));
}
