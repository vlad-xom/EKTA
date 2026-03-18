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
    const body = document.body; // Додаємо посилання на body

    btn.classList.toggle('is--active');
    dropdown.classList.toggle('is--open');

    // Якщо меню має клас is--open, додаємо заборону скролу
    if (dropdown.classList.contains('is--open')) {
        body.classList.add('no-scroll');
    } else {
        body.classList.remove('no-scroll');
    }
}

// Оновлюємо також закриття при кліку повз меню
window.addEventListener('click', function(e) {
    const btn = document.getElementById('menuBtn');
    const dropdown = document.getElementById('menuDropdown');
    const body = document.body;
    
    if (!btn.contains(e.target) && !dropdown.contains(e.target)) {
        btn.classList.remove('is--active');
        dropdown.classList.remove('is--open');
        body.classList.remove('no-scroll'); // Повертаємо скрол
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
//faq акордеон <
function toggleAccordion(header) {
    const item = header.parentElement;
    const container = item.parentElement;
    const body = item.querySelector('.accordion--item__body');
    
    // 1. Закриваємо всі інші пункти та скидаємо їхню висоту
    const allItems = container.querySelectorAll('.accordion--item');
    allItems.forEach(i => {
        if (i !== item) {
            i.classList.remove('is--open');
            const iBody = i.querySelector('.accordion--item__body');
            if (iBody) iBody.style.maxHeight = null;
        }
    });

    // 2. Перемикаємо поточний пункт
    const isOpen = item.classList.toggle('is--open');

    // 3. Якщо відкрили — ставимо точну висоту в пікселях, якщо закрили — null
    if (isOpen) {
        body.style.maxHeight = body.scrollHeight + "px";
    } else {
        body.style.maxHeight = null;
    }
}
//Акордеон блок старт стандарт макс <
document.addEventListener('DOMContentLoaded', () => {
    const triggers = document.querySelectorAll('.accordion--trigger');

    triggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            // Зупиняємо розповсюдження події, щоб не було конфліктів
            e.stopPropagation();

            const currentItem = this.parentElement;
            const currentContent = currentItem.querySelector('.accordion--content');
            const parentList = currentItem.closest('.pricing--list');
            
            // КЛЮЧОВИЙ МОМЕНТ: перевіряємо стан ДО того, як все закриємо
            const wasOpen = currentItem.classList.contains('is--open');

            // 1. Закриваємо абсолютно всі відкриті пункти в цій картці
            const allItems = parentList.querySelectorAll('.accordion--item-card');
            allItems.forEach(item => {
                item.classList.remove('is--open');
                const content = item.querySelector('.accordion--content');
                if (content) {
                    content.style.maxHeight = null;
                    content.style.opacity = "0";
                }
            });

            // 2. Якщо пункт НЕ був відкритий — відкриваємо його
            // Якщо ВІН БУВ відкритий — ми його вже закрили вище, і він залишиться закритим
            if (!wasOpen) {
                currentItem.classList.add('is--open');
                currentContent.style.maxHeight = currentContent.scrollHeight + "px";
                currentContent.style.opacity = "1";
            }
        });
    });
});
//Акордеон блок старт стандарт макс >
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
//
//відео екта <
function playLocalVideo() {
    const container = document.getElementById('videoContainer');
    const video = document.getElementById('mainVideo');
    const poster = document.getElementById('videoPoster');
    const btn = document.getElementById('playBtn');

    // Додаємо клас для CSS анімацій
    container.classList.add('is--playing');
    
    // Показуємо відео та запускаємо його
    video.style.display = 'block';
    video.play();
    
    // Додаємо атрибут controls після запуску, щоб з'явилася шкала часу
    video.setAttribute('controls', 'true');

    // Додатково: якщо відео закінчилося — повертаємо постер
    video.onended = function() {
        container.classList.remove('is--playing');
        video.style.display = 'none';
        video.removeAttribute('controls');
    };
}
//відео екта >
document.addEventListener('DOMContentLoaded', () => {
    const orbitUsers = document.querySelectorAll('.orbits--user:not(.user--center)');
    const centerUserBox = document.getElementById('centerUser');
    const centerImg = centerUserBox.querySelector('img');
    const card = document.getElementById('reviewCard');
    const cardText = document.getElementById('reviewText');
    const cardAuthor = document.getElementById('reviewAuthor');

    orbitUsers.forEach(user => {
        user.addEventListener('click', function() {
            // Щоб уникнути зайвих спрацювань під час анімації
            if (centerUserBox.style.opacity === '0') return;

            const clickedImg = this.querySelector('img');
            
            // 1. Починаємо плавне зникнення центру та тексту
            centerUserBox.style.opacity = '0';
            card.classList.add('is--switching');

            setTimeout(() => {
                // 2. Зберігаємо дані старого центру
                const oldCenterSrc = centerImg.src;
                const oldCenterName = cardAuthor.innerText;
                const oldCenterReview = cardText.innerText;

                // 3. Ставимо в центр дані того, на кого натиснули
                centerImg.src = clickedImg.src;
                cardAuthor.innerText = this.getAttribute('data-name');
                cardText.innerText = this.getAttribute('data-review');

                // 4. Повертаємо старого центрального на орбіту (рокіровка)
                clickedImg.src = oldCenterSrc;
                this.setAttribute('data-name', oldCenterName);
                this.setAttribute('data-review', oldCenterReview);

                // 5. Плавно вмикаємо видимість назад
                centerUserBox.style.opacity = '1';
                card.classList.remove('is--switching');
            }, 400); // Час збігається з CSS transition
        });
    });
});
//faq-list випадающі списки 
function toggleFAQ(header) {
    const item = header.parentElement;
    const container = item.parentElement;
    const body = item.querySelector('.faq-list--body');
    
    // 1. Шукаємо всі інші відкриті пункти і закриваємо їх
    const allItems = container.querySelectorAll('.faq-list--item');
    allItems.forEach(i => {
        if (i !== item) {
            i.classList.remove('is--open');
            const iBody = i.querySelector('.faq-list--body');
            if (iBody) iBody.style.maxHeight = null;
        }
    });

    // 2. Перемикаємо стан поточного пункту
    const isOpen = item.classList.toggle('is--open');

    // 3. Якщо відкрили — вираховуємо висоту, якщо закрили — скидаємо в 0
    if (isOpen) {
        body.style.maxHeight = body.scrollHeight + "px";
    } else {
        body.style.maxHeight = null;
    }
}
//скрол в футері до обєктів 
const footerLinks = document.querySelectorAll('.footer--link__basic');

footerLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        // ПЕРЕВІРКА: якщо це не якір (не починається з #), нічого не робимо через цей скрипт
        if (!href || !href.startsWith('#')) {
            return; 
        }

        // Якщо це якір, робимо плавний скрол
        e.preventDefault();
        const targetBlock = document.querySelector(href);
        
        if (targetBlock) {
            targetBlock.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
//футер контакт список вип
document.addEventListener('DOMContentLoaded', () => {
    const trigger = document.getElementById('contactTrigger');
    const dropdown = document.getElementById('contactDropdown');
    const closeBtn = document.getElementById('contactClose');

    trigger.addEventListener('click', (e) => {
        e.stopPropagation(); // Важливо, щоб клік не прокидався далі
        dropdown.classList.toggle('is--visible');
    });

    closeBtn.addEventListener('click', () => {
        dropdown.classList.remove('is--visible');
    });

    // Закриття при кліку в будь-якому іншому місці
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && e.target !== trigger) {
            dropdown.classList.remove('is--visible');
        }
    });
});