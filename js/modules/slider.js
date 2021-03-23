   function slider() {
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
               if (offset == stringToNumber(wrapperWidth) * (images.length - 1)) {
                   offset = 0;
               } else {
                   offset += stringToNumber(wrapperWidth);
               }
               inner.style.transform = `translateX(-${offset}px)`;
               changeSlideIndex("next", images, dots, "data-order");
               showSlideInd(images, dots);
           });


           prevBtn.addEventListener('click', () => {
               if (offset == 0) {
                   offset = stringToNumber(wrapperWidth) * (images.length - 1);
               } else {
                   offset -= stringToNumber(wrapperWidth);
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
                   offset = stringToNumber(wrapperWidth) * (targetInd - 1);
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
       // Функция получения числа из строки
       function stringToNumber(str) {
           let num = +str.replace(/\D/g, '');
           return num;
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

   }

   module.exports = slider;