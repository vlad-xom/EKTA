//contacts header
function togglePhoneMenu() {
    const phoneBlock = document.getElementById('phoneClickArea');
    phoneBlock.classList.toggle('is--active');
}

// Закриваємо список, якщо користувач клікнув повз нього
window.onclick = function(event) {
    if (!event.target.closest('#phoneClickArea')) {
        const dropdown = document.getElementById('phoneClickArea');
        if (dropdown.classList.contains('is--active')) {
            dropdown.classList.remove('is--active');
        }
    }
}
//
function toggleMainMenu() {
    const btn = document.getElementById('menuBtn');
    const dropdown = document.getElementById('menuDropdown');
    
    // Перемикаємо класи для анімації кнопки та показу меню
    btn.classList.toggle('is--active');
    dropdown.classList.toggle('is--open');
}

// Закриття меню, якщо клікнути за його межами
window.addEventListener('click', function(e) {
    const btn = document.getElementById('menuBtn');
    const dropdown = document.getElementById('menuDropdown');
    
    if (!btn.contains(e.target) && !dropdown.contains(e.target)) {
        btn.classList.remove('is--active');
        dropdown.classList.remove('is--open');
    }
});
//
function toggleLangMenu() {
    const container = document.getElementById('langContainer');
    container.classList.toggle('is--open');
}

// Закриваємо меню, якщо клікнули в іншому місці сторінки
window.addEventListener('click', function(event) {
    const container = document.getElementById('langContainer');
    if (!container.contains(event.target)) {
        container.classList.remove('is--open');
    }
});
//
function toggleAccordion(header) {
    const item = header.parentElement;
    const container = item.parentElement;
    
    // Якщо хочеш, щоб одночасно був відкритий лише один пункт:
    const allItems = container.querySelectorAll('.accordion--item');
    allItems.forEach(i => {
        if (i !== item) i.classList.remove('is--open');
    });

    // Перемикаємо поточний
    item.classList.toggle('is--open');
}
//
function showVideo(videoId) {
    const container = document.getElementById('videoContainer');
    container.innerHTML = `
<iframe width="560" height="315" src="https://www.youtube.com/embed/vs-xEc1AlLw?si=AtTQ4rm94NKr9uqW" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    `;
}
//
function toggleFAQ(element) {
    const parent = element.parentElement;
    parent.classList.toggle('is--open');
    
    const body = parent.querySelector('.faq-list--body');
    if (parent.classList.contains('is--open')) {
        body.style.maxHeight = body.scrollHeight + "px";
    } else {
        body.style.maxHeight = null;
    }
}
////
const promoToggle = document.getElementById('promo-toggle');
const promoField = document.getElementById('promo-field');

promoToggle.addEventListener('change', function() {
  if (this.checked) {
    promoField.style.display = 'block';
  } else {
    promoField.style.display = 'none';
  }
});
////
document.addEventListener('DOMContentLoaded', function() {
    // 1. Ініціалізація календаря
    const fp = flatpickr("#f_date", {
        mode: "range",
        dateFormat: "d.m.Y",
        locale: "ru",
        onClose: function() { document.getElementById('f_date').closest('.field-group').classList.remove('invalid'); }
    });
    document.getElementById('cal-trigger').addEventListener('click', () => fp.open());

    // 2. Перемикання кроків
    let currentStep = 1;
    const btnNext = document.getElementById('btnNext');
    const btnBack = document.getElementById('btnBack');

    function validate() {
        const panel = document.getElementById(`panel-${currentStep}`);
        const inputs = panel.querySelectorAll('.validate');
        let valid = true;

        inputs.forEach(el => {
            const group = el.closest('.field-group') || el.parentElement;
            // Пусте поле
            if (!el.value.trim() || (el.id === 'f_date' && el.value.split(' — ').length < 2)) {
                group.classList.add('invalid');
                valid = false;
            } 
            // Латиниця (Step 2)
            else if (el.classList.contains('latin') && /[^a-zA-Z\s]/.test(el.value)) {
                group.classList.add('invalid');
                valid = false;
            } else {
                group.classList.remove('invalid');
            }
        });

        if (currentStep === 1) {
            const agree = document.getElementById('agree_check');
            if (!agree.checked) {
                document.getElementById('agree-area').classList.add('invalid');
                valid = false;
            } else {
                document.getElementById('agree-area').classList.remove('invalid');
            }
        }
        return valid;
    }

    function syncSummary() {
        document.getElementById('res_date').innerText = document.getElementById('f_date').value;
        document.getElementById('res_country').innerText = document.getElementById('f_country').value;
        document.getElementById('res_name').innerText = document.getElementById('f_name').value;
        document.getElementById('res_pass').innerText = document.getElementById('f_pass').value;
        document.getElementById('res_full_name').innerText = document.getElementById('f_name').value + " " + document.getElementById('f_surname').value;
        document.getElementById('res_p_num').innerText = document.getElementById('f_pass').value;
        document.getElementById('res_dob_val').innerText = document.getElementById('f_dob').value;
    }

    btnNext.addEventListener('click', () => {
        if (!validate()) return;

        if (currentStep < 4) {
            document.getElementById(`panel-${currentStep}`).classList.remove('active');
            document.getElementById(`st-${currentStep}`).classList.remove('active');
            document.getElementById(`st-${currentStep}`).classList.add('done');
            currentStep++;
            document.getElementById(`panel-${currentStep}`).classList.add('active');
            document.getElementById(`st-${currentStep}`).classList.add('active');

            if (currentStep === 3) syncSummary();
            btnBack.style.display = 'block';
            if (currentStep === 4) btnNext.innerText = "Оплатить";
        } else {
            alert("Успішно!");
        }
    });

    btnBack.addEventListener('click', () => {
        document.getElementById(`panel-${currentStep}`).classList.remove('active');
        document.getElementById(`st-${currentStep}`).classList.remove('active');
        currentStep--;
        document.getElementById(`panel-${currentStep}`).classList.add('active');
        document.getElementById(`st-${currentStep}`).classList.add('active');
        document.getElementById(`st-${currentStep + 1}`).classList.remove('done');
        if (currentStep === 1) btnBack.style.display = 'none';
        btnNext.innerText = "Далее";
    });

    // Оплата таби
    document.querySelectorAll('.p-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.p-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            const type = this.dataset.pay;
            if (type === 'card') {
                document.getElementById('view-card').classList.add('active');
                document.getElementById('view-digital').classList.remove('active');
            } else {
                document.getElementById('view-card').classList.remove('active');
                document.getElementById('view-digital').classList.add('active');
                document.getElementById('fast-pay-name').innerText = type === 'apple' ? 'Apple Pay' : 'G Pay';
            }
        });
    });

    // Промокод
    //document.getElementById('promo-check').addEventListener('change', function() {
      //  document.getElementById('promo-field').classList.toggle('show', this.checked);
    //});
});
//
// --- 1. Логіка вибору країн (Мультиселект) ---
const countryTrigger = document.querySelector('.multiselect--trigger');
const countryDropdown = document.querySelector('.multiselect--dropdown');
const countryPlaceholder = document.querySelector('.multiselect--placeholder');
const countryCheckboxes = document.querySelectorAll('.multiselect--option input');

if (countryTrigger) {
    countryTrigger.addEventListener('click', () => {
        countryDropdown.classList.toggle('is-active');
    });

    countryCheckboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            const selected = Array.from(countryCheckboxes).filter(i => i.checked).map(i => i.value);
            countryPlaceholder.textContent = selected.length > 0 ? selected.join(', ') : "Укажите страну путешествия";
        });
    });
}

// --- 2. Логіка типу відпочинку (Input) ---
const tripWrapper = document.getElementById('trip-type-select');
if (tripWrapper) {
    const tripInput = tripWrapper.querySelector('input');
    const tripDropdown = tripWrapper.querySelector('.select--dropdown');
    
    tripWrapper.addEventListener('click', (e) => {
        if (e.target.closest('.select--option')) {
            tripInput.value = e.target.textContent;
            tripDropdown.classList.remove('is-open');
        } else {
            tripDropdown.classList.toggle('is-open');
        }
    });
}

// --- 3. Валідація кнопки f_date ---
const fDate = document.getElementById('f_date');
const fDateBtn = document.getElementById('f_date_btn'); // Переконайся, що ID кнопки вірний

function validateAll() {
    const isDate = fDate.value.trim() !== "";
    const isCountry = Array.from(countryCheckboxes).some(i => i.checked);
    const isType = tripWrapper.querySelector('input').value.trim() !== "";
    
    // Блокуємо кнопку, якщо щось не вибрано
    if (fDateBtn) fDateBtn.disabled = !(isDate && isCountry && isType);
}
//
// Функція перевірки полів
function validateFields() {
    let isValid = true;
    // Знаходимо всі поля з класом validate__form у поточній панелі
    const fields = document.querySelector('.form-panel.active').querySelectorAll('.validate__form');

    fields.forEach(group => {
        let isGroupValid = true;

        if (group.id === 'countries-select') {
            // Перевірка, чи обрано хоча б один чекбокс
            isGroupValid = group.querySelectorAll('input[type="checkbox"]:checked').length > 0;
        } else if (group.id === 'trip-type-select') {
            // Перевірка, чи не порожній інпут
            isGroupValid = group.querySelector('input').value.trim() !== "";
        }

        // Додаємо або прибираємо клас помилки
        if (!isGroupValid) {
            group.classList.add('group__invalid');
            isValid = false;
        } else {
            group.classList.remove('group__invalid');
        }
    });

    return isValid;
}

// Прив'язка до кнопки "Далее"
document.getElementById('btnNext').addEventListener('click', function() {
    if (validateFields()) {
        // Якщо валідація пройшла, виконуємо перемикання кроку (твій код)
        console.log("Успішно! Переходимо далі.");
        // ... твій код перемикання панелей ...
    } else {
        console.log("Заповніть обов'язкові поля!");
    }
});


// Додаємо слухачі на зміни
[fDate, tripWrapper.querySelector('input')].forEach(el => el.addEventListener('input', validateAll));
countryCheckboxes.forEach(cb => cb.addEventListener('change', validateAll));

