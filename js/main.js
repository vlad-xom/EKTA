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
//зміна мови футер 
const langBtn = document.getElementById('lang-trigger');

langBtn.addEventListener('click', function(e) {
    // Щоб вікно не закривалося при натисканні на самі мови всередині
    if (e.target.closest('.language-dropdown--list__container')) return;
    
    this.classList.toggle('active__open');
});

// Закриття, якщо клікнули повз
document.addEventListener('click', (e) => {
    if (!langBtn.contains(e.target)) {
        langBtn.classList.remove('active__open');
    }
});
///////////////////////////////////////////////////////////////