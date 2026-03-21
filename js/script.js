/* =============================================
   INSURANCE FORM — FULL JS LOGIC
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- STATE ---- */
  const state = {
    currentStep: 1,
    tariff: 'START',
    travelDates: null,
    startDate: null,
    endDate: null,
    countries: [],
    restType: '',
    hasPromo: false,
    promoCode: '',
    yearlyPolicy: false,
    alreadyTraveling: false,
    buyer: { fname: '', lname: '', bdate: '', passport: '', phone: '', email: '' },
    tourists: [],
    extras: { accident: false, baggage: false, alcohol: false, coverage100: false },
    payment: 'card',
    basePrice: 140,
    extraPrice: 0,
    tripDays: 14,
  };

  /* ---- FLATPICKR ---- */
  const today = new Date();
  today.setHours(0,0,0,0);

  const fp = flatpickr('#travel-dates', {
    mode: 'range',
    dateFormat: 'd.m.Y',
    minDate: today,
    locale: 'uk',
    onChange(dates) {
      if (dates.length === 2) {
        state.startDate = dates[0];
        state.endDate = dates[1];
        const diff = Math.round((dates[1]-dates[0])/(1000*60*60*24));
        state.tripDays = diff || 1;
        updatePrices();
        setValid('date-wrap', 'date-error', true);
      } else {
        state.startDate = null;
        state.endDate = null;
      }
    }
  });

  // Buyer birthdate picker (no minDate restriction — past dates)
  const fpBdate = flatpickr('#buyer-bdate', {
    dateFormat: 'd.m.Y',
    maxDate: today,
    locale: 'uk',
    onChange(dates) {
      if (dates.length) {
        state.buyer.bdate = dates[0];
        setValid('bdate-wrap', 'bdate-error', true);
      }
    }
  });

  /* ---- SELECT2 ---- */
  $('#travel-country').select2({
    placeholder: 'Вкажіть країну подорожі',
    allowClear: true,
    width: '100%',
  }).on('change', function() {
    state.countries = $(this).val() || [];
    const ok = state.countries.length > 0;
    setValid('country-wrap', 'country-error', ok, !ok);
    updateInsuranceDetails();
  });

  $('#rest-type').select2({
    placeholder: 'Оберіть тип відпочинку',
    allowClear: true,
    width: '100%',
  }).on('change', function() {
    state.restType = $(this).val() || '';
    const ok = !!state.restType;
    setValid('resttype-wrap', 'resttype-error', ok, !ok);
    updateInsuranceDetails();
  });

  /* ---- HELPERS ---- */
  function setValid(wrapId, errId, valid, invalid) {
    const wrap = document.getElementById(wrapId);
    const err  = document.getElementById(errId);
    if (!wrap) return;
    if (valid) {
      wrap.classList.add('valid');
      wrap.classList.remove('invalid');
      if (err) err.classList.remove('show');
    } else if (invalid) {
      wrap.classList.add('invalid');
      wrap.classList.remove('valid');
      if (err) err.classList.add('show');
    } else {
      wrap.classList.remove('valid','invalid');
      if (err) err.classList.remove('show');
    }
  }

  function liveValidate(inputEl, wrapId, errId, validator) {
    inputEl.addEventListener('input', () => {
      const val = inputEl.value.trim();
      if (!val) { setValid(wrapId, errId, false, false); return; }
      const ok = validator(val);
      setValid(wrapId, errId, ok, !ok);
    });
    inputEl.addEventListener('blur', () => {
      const val = inputEl.value.trim();
      if (!val) { setValid(wrapId, errId, false, true); return; }
      const ok = validator(val);
      setValid(wrapId, errId, ok, !ok);
    });
  }

  function latinName(v) { return /^[A-Z]{2,}$/.test(v.toUpperCase()) && /^[A-Za-z]+$/.test(v); }
  function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
  function validPhone(v) { return /^\+?[\d\s\-()]{10,15}$/.test(v); }
  function validPassport(v) { return v.length >= 6; }
  function validCardNumber(v) { return v.replace(/\s/g,'').length === 16 && /^\d+$/.test(v.replace(/\s/g,'')); }
  function validExpiry(v) {
    if (!/^\d{2}\/\d{2}$/.test(v)) return false;
    const [m,y] = v.split('/').map(Number);
    if (m < 1 || m > 12) return false;
    const now = new Date();
    const expYear = 2000 + y;
    const expMonth = m - 1;
    return new Date(expYear, expMonth + 1, 0) >= now;
  }
  function validCVV(v) { return /^\d{3,4}$/.test(v); }

  function formatCardNumber(v) {
    return v.replace(/\D/g,'').replace(/(.{4})/g,'$1 ').trim().slice(0,19);
  }
  function formatExpiry(v) {
    v = v.replace(/\D/g,'').slice(0,4);
    if (v.length > 2) v = v.slice(0,2)+'/'+v.slice(2);
    return v;
  }

  function updatePrices() {
    const days = state.tripDays;
    const base = state.basePrice * (days / 14);
    const total = Math.round(base + state.extraPrice);
    document.getElementById('trip-duration').textContent = days + ' днів';
    document.getElementById('total-price-1').textContent = total + ' UAH';
    document.getElementById('trip-duration-2').textContent = days + ' днів';
    document.getElementById('total-price-2').textContent = total + ' UAH';
    document.getElementById('trip-duration-3').textContent = days + ' днів';
    document.getElementById('total-price-3').textContent = total + ' UAH';
    document.getElementById('total-price-4').textContent = total + ' UAH';
  }

  function updateInsuranceDetails() {
    const countryEl = document.getElementById('detail-country');
    const datesEl = document.getElementById('detail-dates');
    const rtEl = document.getElementById('detail-resttype');
    // Countries
    const countryTexts = state.countries.map(v => {
      const opt = document.querySelector(`#travel-country option[value="${v}"]`);
      return opt ? opt.textContent : v;
    });
    countryEl.textContent = countryTexts.join(', ') || '—';
    // Dates
    if (state.startDate && state.endDate) {
      datesEl.textContent = formatDate(state.startDate) + ' – ' + formatDate(state.endDate);
    } else {
      datesEl.textContent = '—';
    }
    // Rest type
    const rtOpt = document.querySelector(`#rest-type option[value="${state.restType}"]`);
    rtEl.textContent = rtOpt ? rtOpt.textContent : 'Звичайний відпочинок';
  }

  function formatDate(d) {
    if (!d) return '';
    const dd = String(d.getDate()).padStart(2,'0');
    const mm = String(d.getMonth()+1).padStart(2,'0');
    return dd+'.'+mm+'.'+d.getFullYear();
  }

  /* ---- TARIFF TABS ---- */
  document.querySelectorAll('.tariff-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tariff-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.tariff = btn.dataset.tariff;
    });
  });

  /* ---- STEP NAVIGATION ---- */
  function goToStep(n) {
    document.querySelectorAll('.step-content').forEach(el => el.classList.remove('active'));
    document.getElementById('step-'+n).classList.add('active');
    document.querySelectorAll('.step').forEach(el => {
      const s = parseInt(el.dataset.step);
      el.classList.remove('active','done');
      if (s === n) el.classList.add('active');
      else if (s < n) el.classList.add('done');
    });
    document.querySelectorAll('.step-line').forEach((line, i) => {
      line.classList.toggle('done', i+1 < n);
    });
    state.currentStep = n;
    window.scrollTo({top:0, behavior:'smooth'});
  }

  /* ---- STEP 1 LOGIC ---- */
  document.getElementById('already-traveling').addEventListener('change', function() {
    state.alreadyTraveling = this.checked;
    if (this.checked) {
      fp.set('minDate', null);
    } else {
      fp.set('minDate', today);
    }
  });

  document.getElementById('has-promo').addEventListener('change', function() {
    state.hasPromo = this.checked;
    document.getElementById('promo-wrap').classList.toggle('hidden', !this.checked);
    if (!this.checked) {
      setValid('promo-field-wrap', 'promo-error', false, false);
    }
  });

  const promoInput = document.getElementById('promo-code');
  const VALID_PROMOS = ['TRAVEL10','SAVE20','PROMO2024','12345'];
  promoInput.addEventListener('input', function() {
    state.promoCode = this.value.trim().toUpperCase();
    if (!this.value.trim()) { setValid('promo-field-wrap', 'promo-error', false, false); return; }
    const ok = VALID_PROMOS.includes(state.promoCode);
    setValid('promo-field-wrap', 'promo-error', ok, !ok);
  });

  document.getElementById('yearly-policy').addEventListener('change', function() {
    state.yearlyPolicy = this.checked;
    updatePrices();
  });

  document.getElementById('next-1').addEventListener('click', () => {
    let ok = true;
    // Validate dates
    if (!state.startDate || !state.endDate) {
      setValid('date-wrap', 'date-error', false, true);
      ok = false;
    }
    // Validate country
    if (!state.countries.length) {
      setValid('country-wrap', 'country-error', false, true);
      ok = false;
    }
    // Validate rest type
    if (!state.restType) {
      setValid('resttype-wrap', 'resttype-error', false, true);
      ok = false;
    }
    // Terms
    const terms = document.getElementById('terms-1');
    const termsErr = document.getElementById('terms-1-error');
    if (!terms.checked) {
      termsErr.classList.add('show');
      ok = false;
    } else {
      termsErr.classList.remove('show');
    }
    if (ok) {
      updateInsuranceDetails();
      goToStep(2);
    }
  });

  document.getElementById('terms-1').addEventListener('change', function() {
    if (this.checked) document.getElementById('terms-1-error').classList.remove('show');
  });

  /* ---- STEP 2 — BUYER VALIDATION ---- */
  const buyerFname = document.getElementById('buyer-fname');
  const buyerLname = document.getElementById('buyer-lname');
  const buyerPassport = document.getElementById('buyer-passport');
  const buyerPhone = document.getElementById('buyer-phone');
  const buyerEmail = document.getElementById('buyer-email');

  liveValidate(buyerFname, 'fname-wrap', 'fname-error', v => latinName(v));
  liveValidate(buyerLname, 'lname-wrap', 'lname-error', v => latinName(v));
  liveValidate(buyerPassport, 'passport-wrap', 'passport-error', v => validPassport(v));
  liveValidate(buyerPhone, 'phone-wrap', 'phone-error', v => validPhone(v));
  liveValidate(buyerEmail, 'email-wrap', 'email-error', v => validEmail(v));

  // Force uppercase for names
  buyerFname.addEventListener('input', () => { buyerFname.value = buyerFname.value.toUpperCase(); });
  buyerLname.addEventListener('input', () => { buyerLname.value = buyerLname.value.toUpperCase(); });

  // Phone format
  buyerPhone.addEventListener('input', function() {
    let v = this.value.replace(/[^\d+\s\-()]/g,'');
    this.value = v;
  });

  /* ---- TOURISTS ---- */
  let touristCount = 0;

  function createTouristCard(index) {
    const id = ++touristCount;
    const card = document.createElement('div');
    card.className = 'tourist-card';
    card.dataset.tid = id;
    card.innerHTML = `
      <div class="tourist-card-header">
        <span class="tourist-title">Турист № ${index}</span>
        <button class="tourist-remove" title="Видалити">✕</button>
      </div>
      <div class="tourist-fields">
        <div class="field-group">
          <label class="field-label">Ім'я</label>
          <div class="input-wrap" id="t-fname-wrap-${id}">
            <input type="text" class="field-input t-fname" placeholder="Ім'я" data-tid="${id}" />
            <span class="input-status"></span>
          </div>
          <div class="field-error" id="t-fname-err-${id}">Тільки латинські літери</div>
        </div>
        <div class="field-group">
          <label class="field-label">Прізвище</label>
          <div class="input-wrap" id="t-lname-wrap-${id}">
            <input type="text" class="field-input t-lname" placeholder="Прізвище" data-tid="${id}" />
            <span class="input-status"></span>
          </div>
          <div class="field-error" id="t-lname-err-${id}">Тільки латинські літери</div>
        </div>
        <div class="field-group">
          <label class="field-label">Дата народження</label>
          <div class="input-wrap" id="t-bdate-wrap-${id}">
            <input type="text" class="field-input t-bdate" placeholder="ДД.ММ.РРРР" data-tid="${id}" readonly />
            <span class="input-status"></span>
          </div>
          <div class="field-error" id="t-bdate-err-${id}">Невірна дата</div>
        </div>
        <div class="field-group">
          <label class="field-label">Паспорт</label>
          <div class="input-wrap" id="t-passport-wrap-${id}">
            <input type="text" class="field-input t-passport" placeholder="№ паспорта" data-tid="${id}" />
            <span class="input-status"></span>
          </div>
          <div class="field-error" id="t-passport-err-${id}">Введіть номер паспорта</div>
        </div>
      </div>
    `;
    // Tourist in state
    state.tourists.push({ id, fname: '', lname: '', bdate: '', passport: '' });

    // Flatpickr for tourist bdate
    const bdInput = card.querySelector('.t-bdate');
    flatpickr(bdInput, {
      dateFormat: 'd.m.Y',
      maxDate: today,
      locale: 'uk',
      onChange(dates) {
        if (dates.length) {
          const t = state.tourists.find(t => t.id === id);
          if (t) t.bdate = formatDate(dates[0]);
          setValid(`t-bdate-wrap-${id}`, `t-bdate-err-${id}`, true);
        }
      }
    });

    // Live validate tourist fields
    const fnameEl = card.querySelector('.t-fname');
    const lnameEl = card.querySelector('.t-lname');
    const passEl  = card.querySelector('.t-passport');

    function touristLiveVal(inputEl, wrapId, errId, validator, key) {
      inputEl.addEventListener('input', () => {
        const val = inputEl.value.trim();
        const t = state.tourists.find(t => t.id === id);
        if (t) t[key] = val;
        if (!val) { setValid(wrapId, errId, false, false); return; }
        const ok = validator(val);
        setValid(wrapId, errId, ok, !ok);
      });
    }
    fnameEl.addEventListener('input', () => { fnameEl.value = fnameEl.value.toUpperCase(); });
    lnameEl.addEventListener('input', () => { lnameEl.value = lnameEl.value.toUpperCase(); });
    touristLiveVal(fnameEl,  `t-fname-wrap-${id}`,   `t-fname-err-${id}`,   latinName,    'fname');
    touristLiveVal(lnameEl,  `t-lname-wrap-${id}`,   `t-lname-err-${id}`,   latinName,    'lname');
    touristLiveVal(passEl,   `t-passport-wrap-${id}`,`t-passport-err-${id}`,validPassport,'passport');

    // Remove
    card.querySelector('.tourist-remove').addEventListener('click', () => {
      state.tourists = state.tourists.filter(t => t.id !== id);
      card.remove();
      renumberTourists();
    });

    return card;
  }

  function renumberTourists() {
    document.querySelectorAll('#tourists-list .tourist-title').forEach((el, i) => {
      el.textContent = 'Турист № ' + (i+1);
    });
  }

  document.getElementById('add-tourist-btn').addEventListener('click', () => {
    const list = document.getElementById('tourists-list');
    const count = list.querySelectorAll('.tourist-card').length + 1;
    list.appendChild(createTouristCard(count));
  });

  /* ---- EXTRA INSURANCE ---- */
  document.querySelectorAll('.extra-check').forEach(chk => {
    chk.addEventListener('change', function() {
      const key = this.dataset.key;
      const price = parseInt(this.dataset.price);
      state.extras[key] = this.checked;
      state.extraPrice = Object.entries(state.extras).reduce((sum, [k, v]) => {
        const el = document.querySelector(`.extra-check[data-key="${k}"]`);
        return sum + (v && el ? parseInt(el.dataset.price) : 0);
      }, 0);
      updatePrices();
    });
  });

  /* ---- STEP 2 NEXT ---- */
  document.getElementById('next-2').addEventListener('click', () => {
    let ok = true;
    const fname = buyerFname.value.trim();
    const lname = buyerLname.value.trim();
    const passport = buyerPassport.value.trim();
    const phone = buyerPhone.value.trim();
    const email = buyerEmail.value.trim();
    const bdate = document.getElementById('buyer-bdate').value;

    if (!latinName(fname))    { setValid('fname-wrap','fname-error',false,true); ok=false; }
    if (!latinName(lname))    { setValid('lname-wrap','lname-error',false,true); ok=false; }
    if (!bdate)               { setValid('bdate-wrap','bdate-error',false,true); ok=false; }
    if (!validPassport(passport)) { setValid('passport-wrap','passport-error',false,true); ok=false; }
    if (!validPhone(phone))   { setValid('phone-wrap','phone-error',false,true); ok=false; }
    if (!validEmail(email))   { setValid('email-wrap','email-error',false,true); ok=false; }

    // Validate tourists
    state.tourists.forEach(t => {
      const card = document.querySelector(`.tourist-card[data-tid="${t.id}"]`);
      if (!card) return;
      const fn = card.querySelector('.t-fname').value.trim();
      const ln = card.querySelector('.t-lname').value.trim();
      const ps = card.querySelector('.t-passport').value.trim();
      const bd = card.querySelector('.t-bdate').value;
      if (!latinName(fn))    { setValid(`t-fname-wrap-${t.id}`,`t-fname-err-${t.id}`,false,true); ok=false; }
      if (!latinName(ln))    { setValid(`t-lname-wrap-${t.id}`,`t-lname-err-${t.id}`,false,true); ok=false; }
      if (!bd)               { setValid(`t-bdate-wrap-${t.id}`,`t-bdate-err-${t.id}`,false,true); ok=false; }
      if (!validPassport(ps)){ setValid(`t-passport-wrap-${t.id}`,`t-passport-err-${t.id}`,false,true); ok=false; }
    });

    if (ok) {
      state.buyer = { fname, lname, bdate, passport, phone, email };
      populateReview();
      goToStep(3);
    }
  });
  document.getElementById('back-2').addEventListener('click', () => goToStep(1));

  /* ---- REVIEW (STEP 3) ---- */
  function populateReview() {
    document.getElementById('rev-dates').textContent =
      state.startDate ? formatDate(state.startDate)+' – '+formatDate(state.endDate) : '—';
    document.getElementById('rev-tariff').textContent = state.tariff;
    const cNames = state.countries.map(v => {
      const opt = document.querySelector(`#travel-country option[value="${v}"]`);
      return opt ? opt.textContent : v;
    });
    document.getElementById('rev-country').textContent = cNames.join(', ') || '—';
    document.getElementById('rev-fname').textContent = state.buyer.fname;
    document.getElementById('rev-lname').textContent = state.buyer.lname;
    document.getElementById('rev-bdate').textContent = state.buyer.bdate || '—';
    document.getElementById('rev-passport').textContent = state.buyer.passport;
    document.getElementById('rev-email').textContent = state.buyer.email;
    document.getElementById('rev-phone').textContent = state.buyer.phone;

    // Tourists table
    const tbody = document.getElementById('rev-tourists-list');
    tbody.innerHTML = '';
    if (!state.tourists.length) {
      tbody.innerHTML = '<tr><td colspan="4" style="color:#aaa;text-align:center;padding:12px">Учасників не додано</td></tr>';
      return;
    }
    state.tourists.forEach((t, i) => {
      const card = document.querySelector(`.tourist-card[data-tid="${t.id}"]`);
      if (!card) return;
      const fn = card.querySelector('.t-fname').value.trim();
      const ln = card.querySelector('.t-lname').value.trim();
      const ps = card.querySelector('.t-passport').value.trim();
      const bd = card.querySelector('.t-bdate').value;
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${i+1}</td><td>${fn} ${ln}</td><td>${ps}</td><td>${bd}</td>`;
      tbody.appendChild(tr);
    });
  }

  document.getElementById('next-3').addEventListener('click', () => goToStep(4));
  document.getElementById('back-3').addEventListener('click', () => goToStep(2));

  /* ---- PAYMENT (STEP 4) ---- */
  document.querySelectorAll('.payment-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.payment-tab').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.payment-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      state.payment = btn.dataset.payment;
      document.getElementById('payment-'+state.payment).classList.add('active');
    });
  });

  document.getElementById('back-4').addEventListener('click', () => goToStep(3));

  // Card number formatting & live preview
  const cardNumEl = document.getElementById('card-number');
  const cardExpEl = document.getElementById('card-expiry');
  const cardCvvEl = document.getElementById('card-cvv');

  cardNumEl.addEventListener('input', function() {
    this.value = formatCardNumber(this.value);
    document.getElementById('card-num-display').textContent =
      this.value || '•••• •••• •••• ••••';
    const ok = validCardNumber(this.value);
    setValid('cardnum-wrap', 'cardnum-error', ok, !ok && this.value.length > 0);
  });

  cardExpEl.addEventListener('input', function() {
    this.value = formatExpiry(this.value);
    document.getElementById('card-exp-display').textContent = this.value || 'MM/YY';
    const ok = validExpiry(this.value);
    setValid('cardexp-wrap', 'cardexp-error', ok, !ok && this.value.length >= 4);
  });

  cardCvvEl.addEventListener('input', function() {
    this.value = this.value.replace(/\D/g,'').slice(0,3);
    const ok = validCVV(this.value);
    setValid('cardcvv-wrap', 'cardcvv-error', ok, !ok && this.value.length > 0);
  });

  document.getElementById('pay-btn').addEventListener('click', () => {
    if (state.payment === 'card') {
      const cnOk = validCardNumber(cardNumEl.value);
      const exOk = validExpiry(cardExpEl.value);
      const cvOk = validCVV(cardCvvEl.value);
      if (!cnOk) setValid('cardnum-wrap','cardnum-error',false,true);
      if (!exOk) setValid('cardexp-wrap','cardexp-error',false,true);
      if (!cvOk) setValid('cardcvv-wrap','cardcvv-error',false,true);
      if (cnOk && exOk && cvOk) {
        showSuccess();
      }
    } else {
      showSuccess();
    }
  });

  document.querySelector('.apple-pay-btn').addEventListener('click', showSuccess);
  document.querySelector('.google-pay-btn').addEventListener('click', showSuccess);

  function showSuccess() {
    const card = document.querySelector('.form-card');
    card.innerHTML = `
      <div style="text-align:center;padding:60px 20px">
        <div style="width:72px;height:72px;background:#2da44e;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 24px;box-shadow:0 4px 20px rgba(45,164,78,0.3)">
          <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#fff" stroke-width="3"><polyline points="5,12 10,17 19,7"/></svg>
        </div>
        <h2 style="font-size:1.5rem;font-weight:800;color:#1e2a38;margin-bottom:12px">Оплата успішна!</h2>
        <p style="color:#6b7280;font-size:0.95rem;font-weight:600">Ваш страховий поліс оформлено.<br>Деталі відправлено на email: <strong style="color:#1a6f8a">${state.buyer.email || '—'}</strong></p>
        <button onclick="location.reload()" style="margin-top:32px;background:#1a6f8a;color:#fff;border:none;border-radius:10px;padding:12px 36px;font-family:inherit;font-size:1rem;font-weight:800;cursor:pointer">Нова заявка</button>
      </div>
    `;
  }

  /* ---- TOOLTIP ---- */
  const tooltip = document.getElementById('global-tooltip');
  document.addEventListener('mouseover', e => {
    const icon = e.target.closest('.info-icon');
    if (!icon || !icon.dataset.tooltip) return;
    tooltip.textContent = icon.dataset.tooltip;
    tooltip.classList.add('show');
  });
  document.addEventListener('mousemove', e => {
    tooltip.style.left = (e.clientX + 12) + 'px';
    tooltip.style.top  = (e.clientY - 8) + 'px';
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest('.info-icon')) tooltip.classList.remove('show');
  });

  /* ---- INIT ---- */
  updatePrices();

});
