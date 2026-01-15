 const brandData = {
  Car:["Maruti","Hyundai","Tata","Mahindra","Honda","skoda","Toyota","Ford","Volkswagen","Kia"],
  HybridCar:["Toyota_Hybrid","Honda_Hybrid","Ford_Hybrid","Hyundai_Hybrid","Kia_Hybrid","Maruti_Hybrid"],
  Bike:["Hero","Bajaj","TVS","Yamaha","Royal Enfield","KTM","honda"],
  CarEV:["Tata EV","MG","mahindra","honda EV","Hundai EV","Volvo EV"],
  BikeEV:["Ola","Ather","TVS","Bounce","Revolt","Hero EV"],
  Truck:["TataTruck","Ashok_Leyland","MahindraTruck","Eicher"],
  Tractor:["Mahindra","Sonalika"]
};

const modelData = {
  // Car Models
  Maruti:["Swift","Baleno","Brezza","Dzire","Ertiga","Alto","WagonR","Celerio"],
  Hyundai:["i20","Creta","Venue","Alcazar","Verna","Grand i10 Nios"],
  Tata:["Nexon","Punch","Altroz","Harrier","Safari","Tiago"],
  Mahindra:["Scorpio","XUV700","Thar","Bolero","XUV300"],
  skoda:["Kushaq","Slavia","Octavia","Rapid"],
  Toyota:["Innova Crysta","Fortuner","Glanza","Urban Cruiser"],
  Ford:["EcoSport","Endeavour","Figo","Mustang"],
  Volkswagen:["Polo","Vento","T-Roc","Taigun"],
  Kia:["Seltos","Sonet","Carnival","Carens"],

  // Bike Models
  Hero:["Splendor","HF Deluxe","Xtreme","Passion Pro","Super Splendor","PLEASURE+","Destiny"],
  Bajaj:["Pulsar","Dominar","CT 100","Avenger","Platina","Discover","PULSOR NS200"],
  honda:["CB Shine","Activa","Unicorn","CBR"],
  TVS:["Apache","Jupiter","Ntorq","Sport"],
  Yamaha:["FZ","R15","MT-15","FZ-S"],
  Royal_Enfield:["Classic 350","Bullet 350","Himalayan","Interceptor 650"],
  KTM:["Duke 200","RC 200","390 Duke","RC 390"],

  // EV Car Models
  Tata_EV:["Nexon EV","Tigor EV","Altroz EV"],
  MG:["ZS EV","Hector EV","Marvel R EV"],
  mahindra:["eKUV100","eXUV300","eVerito"],
  hond_EV:["Honda e","Honda Jazz EV"],
  Hundai_EV:["Kona Electric","Ioniq 5","Ioniq Electric"],
  Volvo_EV:["XC40 Recharge","C40 Recharge"],

  // Bike EV Models
  Ola:["S1","S1 Pro","S1 Air"],
  Ather:["450X","450 Plus","340"],
  TVS:["iQube","Creon","Apache RTR Electric"],
  Bounce:["Infinity E1","Infinity E2"],
  Revolt:["RV400","RV300"],
  Hero_EV:["Optima HX","Photon HX","Zir","Nyx"],

  // Truck Models
  TataTruck:["Signa","Prima","Ultra"],
  Ashok_Leyland:["Captain","Ecomet","Dost"],
  MahindraTruck:["Blazo","Furio","Jeeto"],
  Eicher:["Pro 1049","Pro 1110","Pro 3015"],

  // Hybrid Car Models
  Toyota_Hybrid:["Camry Hybrid","Vellfire Hybrid","Highlander Hybrid"],
  Honda_Hybrid:["Accord Hybrid","CR-V Hybrid","City Hybrid"],
  Ford_Hybrid:["Escape Hybrid","Explorer Hybrid","Fusion Hybrid"],
  Hyundai_Hybrid:["Sonata Hybrid","Tucson Hybrid","Santa Fe Hybrid"],
  Kia_Hybrid:["Sorento Hybrid","Sportage Hybrid","Niro Hybrid"],
  Maruti_Hybrid:["Ciaz Hybrid","Eeco Hybrid","Ertiga Hybrid"],

  // Tractor Models
  Mahindra:["Arjun","Jupiter","Yuvraj","Trakstar"],
  Sonalika:["Sultan RX","Tiger DI","Powertrac Euro 50"]
};

// --- UI data ---

// (brandData and modelData unchanged)

// --- Helpers ---
function el(id){ return document.getElementById(id); }

// Centralized widget initializer — binds controls when present.
window.initWidgets = function(){
  const vehicleType = el('vehicleType');
  const brand = el('brand');
  const model = el('model');
  const bookingForm = el('bookingForm');
  const contactForm = el('contactForm');
  const loginModal = el('loginModal');

  if(vehicleType && brand && vehicleType.dataset.bound !== 'true'){
    vehicleType.dataset.bound = 'true';
    vehicleType.addEventListener('change', () => {
      brand.innerHTML = "<option value=''>Brand</option>";
      model && (model.innerHTML = "<option value=''>Model</option>");
      (brandData[vehicleType.value] || []).forEach(b => brand.innerHTML += `<option>${b}</option>`);
    });
  }

  if(brand && model && brand.dataset.bound !== 'true'){
    brand.dataset.bound = 'true';
    brand.addEventListener('change', () => {
      model && (model.innerHTML = "<option value=''>Model</option>");
      (modelData[brand.value] || []).forEach(m => model && (model.innerHTML += `<option>${m}</option>`));
    });
  }

  if(bookingForm && bookingForm.dataset.bound !== 'true'){
    bookingForm.dataset.bound = 'true';
    bookingForm.addEventListener('submit', async e => {
      e.preventDefault();
      const formData = new FormData(bookingForm);
      const payload = Object.fromEntries(formData.entries());
      clearFieldErrors(bookingForm);
      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      const origDisabled = submitBtn ? submitBtn.disabled : false;
      if(submitBtn){ setButtonLoading(submitBtn); submitBtn.disabled = true; }
      showToast('info','Submitting booking...');
      try{
        const res = await fetch('/api/booking/', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        });
        const data = await res.json().catch(()=>({}));
        if(res.ok){
          showToast('success','Booking submitted! Reference: ' + (data.id || 'n/a'));
          showInlineSuccess(bookingForm, 'Booking submitted — ref: ' + (data.id || 'n/a'));
          bookingForm.reset();
          if(submitBtn){ clearButtonLoading(submitBtn, true); submitBtn.disabled = false; }
          return;
        }
        if(data && data.error === 'validation' && data.fields){
          showFieldErrors(bookingForm, data.fields);
          showToast('error','Please fix form errors.');
        } else if(data && data.error === 'rate_limited'){
          showToast('error','Too many requests — please wait.');
        } else {
          showToast('error','Submission failed.');
        }
      }catch(err){
        console.warn('Backend booking submit failed', err);
        showToast('error','Network error — could not submit booking.');
      } finally{
        if(submitBtn){ clearButtonLoading(submitBtn, false); submitBtn.disabled = origDisabled; }
      }
    });
  }

  // realtime validation bindings
  const emailEl = el('email');
  const phoneEl = el('phone');
  if(emailEl && emailEl.dataset.bound !== 'true'){
    emailEl.dataset.bound = 'true';
    emailEl.addEventListener('input', ()=>{
      const err = emailEl.closest('.form-group')?.querySelector('.field-error');
      if(!validateEmailVal(emailEl.value)) err && (err.textContent = 'Email looks invalid');
      else err && (err.textContent = '');
    });
  }
  if(phoneEl && phoneEl.dataset.bound !== 'true'){
    phoneEl.dataset.bound = 'true';
    phoneEl.addEventListener('input', ()=>{
      const err = phoneEl.closest('.form-group')?.querySelector('.field-error');
      if(!validatePhoneVal(phoneEl.value)) err && (err.textContent = 'Phone looks invalid');
      else err && (err.textContent = '');
    });
  }

  if(contactForm && contactForm.dataset.bound !== 'true'){
    contactForm.dataset.bound = 'true';
    contactForm.addEventListener('submit', async e => {
      e.preventDefault();
      clearFieldErrors(contactForm);
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const origDisabled = submitBtn ? submitBtn.disabled : false;
      if(submitBtn){ setButtonLoading(submitBtn); submitBtn.disabled = true; }
      showToast('info','Sending message...');
      const formData = new FormData(contactForm);
      const payload = Object.fromEntries(formData.entries());
      try{
        const res = await fetch('/api/contact/', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
        const data = await res.json().catch(()=>({}));
        if(res.ok){
          showToast('success','Thanks — we received your message.');
          showInlineSuccess(contactForm,'Message sent — we will reply shortly.');
          contactForm.reset();
          if(submitBtn){ clearButtonLoading(submitBtn, true); submitBtn.disabled = false; }
          return;
        }
        if(data && data.error === 'validation' && data.fields){
          showFieldErrors(contactForm, data.fields);
          showToast('error','Please fix the form errors.');
        } else if(data && data.error === 'rate_limited'){
          showToast('error','Too many requests — please wait.');
        } else {
          showToast('error','Submission failed.');
        }
      }catch(err){
        console.warn('Contact submit failed', err);
        showToast('error','Network error — could not send message.');
      } finally{
        if(submitBtn){ clearButtonLoading(submitBtn, false); submitBtn.disabled = origDisabled; }
      }
    });
  }
  // expose loginModal to other helpers
  window.__loginModal = loginModal;
};

// Login modal helpers (only when modal exists)
let isSignUp = false;
function openLogin(){ if(window.__loginModal) window.__loginModal.style.display = 'flex'; }
function closeLogin(){ if(window.__loginModal) window.__loginModal.style.display = 'none'; }
function toggleSignUp(){ isSignUp = !isSignUp; showMode(); }
function showMode(){
  const loginModal = window.__loginModal;
  if(!loginModal) return;
  const title = el('modalTitle');
  const name = el('loginName');
  const conf = el('loginConfirmPassword');
  const submit = el('submitBtn');
  const toggleText = el('toggleText');
  if(isSignUp){
    title.innerText = 'Sign Up';
    name.style.display = 'block';
    conf.style.display = 'block';
    submit.innerText = 'Sign Up';
    submit.onclick = signUpUser;
    toggleText.innerHTML = 'Already have an account? <span onclick="toggleSignUp()" style="color:#2563eb; cursor:pointer; font-weight:600;">Login</span>';
  } else {
    title.innerText = 'Login';
    name.style.display = 'none';
    conf.style.display = 'none';
    submit.innerText = 'Login';
    submit.onclick = loginUser;
    toggleText.innerHTML = 'Don\'t have an account? <span onclick="toggleSignUp()" style="color:#2563eb; cursor:pointer; font-weight:600;">Sign Up</span>';
  }
}

function loginUser(){
  const email = el('loginEmail')?.value || '';
  const password = el('loginPassword')?.value || '';
  if(!email || !password){ alert('Please fill in all fields!'); return; }
  alert(`Welcome back! 🎉\nLogged in with: ${email}`);
  closeLogin();
}

function signUpUser(){
  const name = el('loginName')?.value || '';
  const email = el('loginEmail')?.value || '';
  if(!name || !email){ alert('Please fill in required fields'); return; }
  alert(`Thanks for signing up, ${name}! Please verify your email: ${email}`);
  closeLogin();
}

// Scroll / navigation helpers: if element present, scroll; otherwise navigate to index with hash
function scrollToHashOrPage(hash){
  const id = hash.replace('#','');
  const target = el(id);
  if(target){ target.scrollIntoView({behavior:'smooth'}); }
  else { window.location.href = 'index.html' + (hash||''); }
}

// Helper: show/hide button loading and success states
function createSpinner(){
  const s = document.createElement('span');
  s.className = 'spinner';
  return s;
}

function setButtonLoading(btn){
  if(!btn) return;
  btn.classList.add('loading');
  // keep icon + text but prepend spinner
  if(!btn.querySelector('.spinner')){
    const sp = createSpinner();
    btn.prepend(sp);
  }
}

function clearButtonLoading(btn, success=false){
  if(!btn) return;
  btn.classList.remove('loading');
  const sp = btn.querySelector('.spinner'); if(sp) sp.remove();
  if(success){
    btn.classList.add('success');
    setTimeout(()=> btn.classList.remove('success'), 1600);
  }
}

// Ripple effect for all .btn
document.addEventListener('click', (ev) => {
  const b = ev.target.closest('.btn');
  if(!b) return;
  const rect = b.getBoundingClientRect();
  const r = document.createElement('span'); r.className = 'ripple';
  const size = Math.max(rect.width, rect.height);
  r.style.width = r.style.height = size + 'px';
  r.style.left = (ev.clientX - rect.left - size/2) + 'px';
  r.style.top = (ev.clientY - rect.top - size/2) + 'px';
  b.appendChild(r);
  setTimeout(()=> r.remove(), 700);
});

// Basic realtime validation helpers
function validateEmailVal(v){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}
function validatePhoneVal(v){
  return v.trim() === '' || /^[0-9\+\-\s\(\)]{4,30}$/.test(v);
}


function scrollToHome(){ scrollToHashOrPage('#home'); }
function scrollToServices(){ window.location.href = 'services.html'; }
function scrollToBooking(){ scrollToHashOrPage('#book'); }
function scrollToAbout(){ window.location.href = 'about.html'; }
function scrollToLogin(){ window.location.href = 'index.html#login'; }

// Open login modal if URL has #login
document.addEventListener('DOMContentLoaded', () => {
  // initialize widgets (forms, selects, etc.)
  if(typeof window.initWidgets === 'function') window.initWidgets();

  if(location.hash === '#login'){
    // Only open modal on index page
    openLogin();
    isSignUp = false; showMode();
  }

  // highlight active nav link
  const_navLinks = document.querySelectorAll('nav a');
  navLinks.forEach(a => {
    if(a.getAttribute('href') === window.location.pathname.split('/').pop() || (a.getAttribute('href') === 'index.html' && window.location.pathname.endsWith('index.html')) ){
      a.style.fontWeight = '700';
    }
  });
  
  // Client-side router: intercept internal nav clicks and load <main> from remote pages
  document.body.addEventListener('click', async (ev) => {
    const a = ev.target.closest('a');
    if(!a) return;
    const href = a.getAttribute('href');
    if(!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('#')) return;
    // internal link - prevent full reload
    ev.preventDefault();
    await navigateTo(href);
  });

  // mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if(navToggle && navLinks){
    navToggle.addEventListener('click', ()=> navLinks.classList.toggle('show'));
  }

  window.addEventListener('popstate', (e) => {
    navigateTo(location.pathname.split('/').pop() || 'index.html', {replace:true});
  });
});

async function navigateTo(href, opts={replace:false}){
  try{
    const res = await fetch(href);
    if(!res.ok) { window.location.href = href; return; }
    const text = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    const newMain = doc.querySelector('main');
    if(newMain){
      const curMain = document.querySelector('main');
      if(curMain) curMain.replaceWith(newMain);
      else document.body.appendChild(newMain);
      if(!opts.replace) history.pushState({}, '', href);
      // update document title if present
      if(doc.title) document.title = doc.title;
      // re-run scripts initialization for new content
      if(typeof window.initWidgets === 'function') window.initWidgets();
      return;
    }
    // fallback: go to url
    window.location.href = href;
  }catch(err){ console.error('navigate error', err); window.location.href = href; }
}

// ============ TOAST NOTIFICATIONS ============
function showToast(type = 'info', message = '', duration = 3000) {
  let toast = document.querySelector('.site-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'site-toast';
    document.body.appendChild(toast);
  }
  toast.setAttribute('data-type', type);
  toast.textContent = message;
  toast.style.opacity = '1';
  
  setTimeout(() => {
    toast.style.opacity = '0';
  }, duration);
}

// ============ FORM HELPERS ============
function showFieldErrors(form, fields) {
  Object.entries(fields).forEach(([fieldName, error]) => {
    const errorEl = form.querySelector(`[data-for="${fieldName}"]`);
    if (errorEl) errorEl.textContent = error;
  });
}

function clearFieldErrors(form) {
  form.querySelectorAll('.field-error').forEach(el => el.textContent = '');
}

function showInlineSuccess(form, message) {
  let success = form.querySelector('.inline-success');
  if (!success) {
    success = document.createElement('div');
    success.className = 'inline-success';
    form.appendChild(success);
  }
  success.textContent = message;
}

// initWidgets is defined earlier and will be called after SPA navigation
