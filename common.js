// common.js: shared JS logic used by all pages (nav, mobile nav, data renderers)

// Logo fallback: if local image fails, inject inline svg
function fallbackLucidLogo(){
  const img = document.getElementById('lucidLogoImg');
  const fallback = document.getElementById('lucidSvgFallback');
  if(img && fallback && !fallback.isConnected){
    img.style.display = 'none';
    const parent = img.parentElement;
    parent.insertAdjacentElement('beforeend', fallback);
    fallback.style.display = 'block';
  }
}

// Mobile nav toggle + lock scroll
const mobileMenuBtn = document.getElementById && document.getElementById('mobileMenuBtn');
const mobileNavOverlay = document.getElementById && document.getElementById('mobileNavOverlay');
const mobileNavPane = document.getElementById && document.getElementById('mobileNavPane');
const mobileNavClose = document.getElementById && document.getElementById('mobileNavClose');

function openMobileNav(){
  if(!mobileNavOverlay || !mobileNavPane) return;
  mobileNavOverlay.classList.add('show');
  mobileNavPane.classList.add('open');
  mobileNavOverlay.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
}
function closeMobileNav(){
  if(!mobileNavOverlay || !mobileNavPane) return;
  mobileNavOverlay.classList.remove('show');
  mobileNavPane.classList.remove('open');
  mobileNavOverlay.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
}

if(mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileNav);
if(mobileNavClose) mobileNavClose.addEventListener('click', closeMobileNav);
if(mobileNavOverlay) mobileNavOverlay.addEventListener('click', function(e){
  if(e.target === mobileNavOverlay) closeMobileNav();
});

// SPA-like nav handling for inline nav elements on each page
function gotoPage(page){
  // navigation across files is handled via links in this separated setup.
  // But keep helper to adjust nav-item active class when included.
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(i => {
    if(i.dataset.page === page) i.classList.add('active'); else i.classList.remove('active');
  });
  closeMobileNav();
}

// attach click events to nav items (desktop + mobile) to allow intra-page activation
document.querySelectorAll && document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    const page = item.dataset.page;
    if(page) {
      // If current page file has an element with id 'page-<page>', display style is handled in each page
      // For separate files we just update active state and close mobile nav.
      gotoPage(page);
      // If the nav is linking to a different file, a normal <a href="..."> should be used in the HTML.
    }
  });
});

// accounts and contacts demo data (shared)
const demoAccounts = [
  {name:'Lucid Motors', record:'OEM', country:'USA', city:'Newark', industry:'Automotive', owner:'lucid-sales'},
  {name:'Lucid Fleet Services', record:'Partner', country:'USA', city:'Palo Alto', industry:'Automotive', owner:'fleet-team'},
  {name:'Acme Partners', record:'Partner', country:'USA', city:'San Mateo', industry:'Technology', owner:'vchannel'},
  {name:'Allied Technologies', record:'End User', country:'USA', city:'Multnomah', industry:'Technology', owner:'bwest'},
  {name:'Global Systems', record:'Partner', country:'USA', city:'San Francisco', industry:'Manufacturing', owner:'bwest'}
];

const contactsData = {
  'Lucid Motors': [
    {name:'Peter Rawlinson', role:'CEO', email:'p.rawlinson@lucidmotors.com', phone:'+1-555-0101'},
    {name:'Maya Patel', role:'VP Sales', email:'maya.patel@lucidmotors.com', phone:'+1-555-0102'}
  ],
  'Lucid Fleet Services': [
    {name:'Daniel Kim', role:'Fleet Ops', email:'d.kim@lucidfleet.com', phone:'+1-555-0201'},
    {name:'Olivia Chen', role:'Service Lead', email:'olivia.chen@lucidfleet.com', phone:'+1-555-0202'}
  ],
  'default': [
    {name:'Sarah Connor', role:'Account Manager', email:'s.connor@example.com', phone:'+1-555-0301'}
  ]
};

// utility to fill accounts table when present
function renderAccountsToTable(tbodyId){
  const tbody = document.getElementById(tbodyId);
  if(!tbody) return;
  tbody.innerHTML = '';
  demoAccounts.forEach((a,i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${i+1}</td><td>${a.name}</td><td>${a.record}</td><td>${a.country}</td><td>${a.city}</td><td>${a.industry}</td><td>${a.owner}</td>`;
    tbody.appendChild(tr);
  });
}

// utility to render contacts list
function renderContactsFor(accountName, containerId){
  const contactsListEl = document.getElementById(containerId);
  if(!contactsListEl) return;
  contactsListEl.innerHTML = '';
  const list = contactsData[accountName] || contactsData['default'];
  list.forEach(c => {
    const div = document.createElement('div');
    div.className = 'lead-item';
    div.innerHTML = `
      <div style="width:44px;height:44px;border-radius:8px;background:#eef7ff;display:flex;align-items:center;justify-content:center;font-weight:700;color:var(--lucid-primary)"> ${c.name.split(' ').map(n=>n[0]).join('')} </div>
      <div style="flex:1">
        <div style="font-weight:700">${c.name}</div>
        <div class="muted">${c.role} • ${c.email}</div>
      </div>
      <div style="text-align:right">
        <div class="muted">${c.phone}</div>
        <button class="btn" onclick="alert('Open contact: ${c.name}')">Open</button>
      </div>
    `;
    contactsListEl.appendChild(div);
  });
  const note = document.createElement('div');
  note.className = 'muted';
  note.style.marginTop = '8px';
  note.textContent = `Showing contacts for: ${accountName}`;
  contactsListEl.appendChild(note);
}

// keyboard shortcut for search (global)
document.addEventListener('keydown', (e)=> {
  if(e.key === '/') {
    if(document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA'){
      e.preventDefault();
      const input = document.getElementById('globalSearch');
      if(input) input.focus();
    }
  }
});
