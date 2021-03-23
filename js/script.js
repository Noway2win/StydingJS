window.addEventListener('DOMContentLoaded', function () {
    const tabs = require('./modules/cards'),
        calculator = require('./modules/calculator'),
        forms = require('./modules/forms'),
        modal = require('./modules/modal'),
        slider = require('./modules/slider'),
        cards = require('./modules/cards'),
        timer = require('./modules/timer');

    tabs();
    calculator();
    forms();
    modal();
    slider();
    cards();
    timer();
});