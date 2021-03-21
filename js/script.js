window.addEventListener('DOMContentLoaded', function () {

    // Tabs

    let tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {

        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', function (event) {
        const target = event.target;
        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    // Timer

    const deadline = '2020-05-11';

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor((t / (1000 * 60 * 60 * 24))),
            seconds = Math.floor((t / 1000) % 60),
            minutes = Math.floor((t / 1000 / 60) % 60),
            hours = Math.floor((t / (1000 * 60 * 60) % 24));

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return '0' + num;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {

        const timer = document.querySelector(selector),
            days = timer.querySelector("#days"),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadline);

    // Modal

    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal');

    modalTrigger.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == "") {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')) {
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 300000);
    // Изменил значение, чтобы не отвлекало

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }
    window.addEventListener('scroll', showModalByScroll);

    // Используем классы для создание карточек меню

    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeToUAH();
        }

        changeToUAH() {
            this.price = this.price * this.transfer;
        }

        render() {
            const element = document.createElement('div');

            if (this.classes.length === 0) {
                this.classes = "menu__item";
                element.classList.add(this.classes);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }

            element.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            `;
            this.parent.append(element);
        }
    }

    const getResource = async (url) => {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`slomavsya ${url}, ${res.status}`);
        }

        return await res.json();
    };

    getResource('http://localhost:3000/menu').
    then(data => {
        data.forEach(({
            img,
            altimg,
            title,
            descr,
            price
        }) => {
            new MenuCard(img, altimg, title, descr, price, ".menu .container").render();
        });
    });

    // Forms

    const forms = document.querySelectorAll('form');
    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        });

        return await res.json();
    };

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));


            postData('http://localhost:3000/requests', json).
            then(data => {
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
            }).catch(() => {
                showThanksModal(message.failure);
            }).finally(() => {
                form.reset();
            });
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;
        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }
});

// Создание слайдера

//переменные
const slider = document.querySelector('.offer__slider'),
    wrapperWidth = window.getComputedStyle(slider.querySelector('.offer__slider-wrapper')).width,
    wrapper = slider.querySelector('.offer__slider-wrapper'),
    inner = slider.querySelector('.offer__slider-inner'),
    nextBtn = slider.querySelector('.offer__slider-next'),
    currentInd = slider.querySelector('#current'),
    totalInd = slider.querySelector('#total'),
    prevBtn = slider.querySelector('.offer__slider-prev');
let count = 1,
    offset = 0;

// Получение картинок с сервера
async function getData(url) {
    const data = await fetch(url);
    if (!data.ok) {
        throw new Error(`Can not get data from${url}, message status ${data.status}`);
    }
    return await data.json();
}

// Создание обьектов на основе данных с сервера и их обработка
let imgData = getData("http://localhost:3000/slidersrc").
then(data => {
    console.log(data);
    data.forEach(({
        src,
        alt
    }) => {
        new SliderImage(src, alt, inner).insertImage();
    });
}).
then(() => {
    const images = slider.querySelectorAll('.offer__slide'),
        dots = [];
    inner.style.cssText = `width:${100 * images.length}%; display: flex; transition: 0.5s all;`;
    images.forEach(image => image.style.width = wrapperWidth);
    const sliderDots = document.createElement('ol');
    sliderDots.classList.add('carousel-indicators');
    wrapper.append(sliderDots);
    placeDots(images, sliderDots, dots);
    dotChange(images, dots, 'data-order');
    nextBtn.addEventListener('click', () => {
        if (offset == +wrapperWidth.slice(0, wrapperWidth.length - 2) * (images.length - 1)) {
            offset = 0;
        } else {
            offset += +wrapperWidth.slice(0, wrapperWidth.length - 2);
        }
        inner.style.transform = `translateX(-${offset}px)`;
        changeSlideIndex("next", images, dots, "data-order");
        showSlideInd(images, dots);
    });


    prevBtn.addEventListener('click', () => {
        if (offset == 0) {
            offset = +wrapperWidth.slice(0, wrapperWidth.length - 2) * (images.length - 1);
        } else {
            offset -= +wrapperWidth.slice(0, wrapperWidth.length - 2);
        }
        inner.style.transform = `translateX(-${offset}px)`;
        changeSlideIndex("prev", images, dots, 'data-order');
        showSlideInd(images, dots);
    });
});
// Функция изменения индекса слайда
function changeSlideIndex(dir, arr) {
    if (dir == 'next') {
        ++count;
    } else if (dir == 'prev') {
        --count;
    }
    if (count > arr.length) {
        count = 1;
    } else if (count < 1) {
        count = arr.length;
    }
}
// Функция изменения индекса слайда по точкам
function dotChange(arr, dotArr, atribute) {
    dotArr.forEach(a => {
        a.addEventListener('click', (e) => {
            const targetInd = e.target.getAttribute(atribute);
            count = targetInd;
            offset = +wrapperWidth.slice(0, wrapperWidth.length - 2) * (targetInd - 1);
            inner.style.transform = `translateX(-${offset}px)`;
            dotArr.forEach(dot => {
                dot.style.opacity = '.5';
            });
            dotArr[count - 1].style.opacity = 1;
            showSlideInd(arr, dotArr);
        });
    });
}
// Функция отображения нового индекса
function showSlideInd(arr, dotArr) {
    if (arr.length < 10) {
        totalInd.textContent = `0${arr.length}`;
        currentInd.textContent = `0${count}`;
    } else {
        totalInd.textContent = arr.length;
        currentInd.textContent = count;
    }
    dotArr.forEach(dot => {
        dot.style.opacity = '.5';
    });
    dotArr[count - 1].style.opacity = 1;

}
//Функция отрисовывания точек
function placeDots(arr, parent, pushArr) {
    for (let i = 0; i < arr.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-order', i + 1);
        dot.classList.add('dot');
        if (i == 0) {
            dot.style.opacity = 1;
        }
        parent.append(dot);
        pushArr.push(dot);
    }
}
// Класс картинки на слайдере
class SliderImage {
    constructor(src, alt, parent) {
        this.src = src;
        this.alt = alt;
        this.parent = parent;
    }
    insertImage() {
        this.parent.insertAdjacentHTML("beforeend", `<div class="offer__slide">
        <img src=${this.src} alt=${this.alt} />
      </div>`);
    }
}