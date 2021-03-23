import tabs from './modules/tabs';
import calculator from './modules/calculator';
import forms from './modules/forms';
import modal from './modules/modal';
import slider from './modules/slider';
import cards from './modules/cards';
import timer from './modules/timer';
import {
    openModal
} from './modules/modal';


window.addEventListener('DOMContentLoaded', function () {
    const modalTimerId = setTimeout(() => openModal('.modal', modalTimerId), 50000);


    tabs('.tabheader__item', '.tabcontent', '.tabheader__items', 'tabheader__item_active');
    calculator();
    forms('form', modalTimerId);
    modal('[data-modal]', '.modal', modalTimerId);
    cards();
    timer('.timer', "2022-06-11");
    slider({
        sliderParent: '.offer__slider',
        sliderWrapper: '.offer__slider-wrapper',
        sliderInner: '.offer__slider-inner',
        sliderNext: '.offer__slider-next',
        sliderPrev: '.offer__slider-prev',
        currentSlide: '#current',
        totalSlides: '#total',
        slides: '.offer__slide',
        imgUrl: "http://localhost:3000/slidersrc",
        dotsClass: 'carousel-indicators'
    });
});