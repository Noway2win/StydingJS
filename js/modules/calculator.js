function calculator() {
    // Калькулятор активности

    const calcul = document.querySelector('.calculating__field'),
        resultCcal = calcul.querySelector('.calculating__result span');
    let gender, height, weight, age, rat;



    localStorageDefault('#gender div', '.calculating__choose_big div', 'calculating__choose-item_active');
    totalCalc();

    getDivInfo('#gender', 'calculating__choose-item_active');
    getDivInfo('.calculating__choose_big', 'calculating__choose-item_active');
    getInputInfo('#height');
    getInputInfo('#weight');
    getInputInfo('#age');
    // Функция общего рассчета
    function totalCalc() {
        if (!gender || !height || !weight || !age || !rat) {
            resultCcal.textContent = 'No data';
            return;
        }

        if (gender === 'female') {
            resultCcal.textContent = Math.round((447, 6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * rat);
        } else {
            resultCcal.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * rat);
        }
    }

    // Функция получения данных из блоков
    function getDivInfo(parent, activeClass) {
        const elements = document.querySelectorAll(`${parent} div`);

        elements.forEach(elem => {
            elem.addEventListener('click', (e) => {
                if (e.target.getAttribute('data-rat')) {
                    rat = +e.target.getAttribute('data-rat');
                    localStorage.setItem('rat', +e.target.getAttribute('data-rat'));
                } else {
                    gender = e.target.getAttribute('id');
                    localStorage.setItem('gender', e.target.getAttribute('id'));
                }

                elements.forEach(elem => {
                    elem.classList.remove(activeClass);
                });
                e.target.classList.add(activeClass);
                totalCalc();
            });
        });
    }

    //Получение данных из инпута
    function getInputInfo(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {

            if (input.value.match(/\D/g)) {
                input.style.border = '1px solid red';
            } else {
                input.style.border = 'none';
            }

            switch (input.getAttribute('id')) {
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
            }
            totalCalc();
        });
    }

    // Функция работы с локальным хранилищем при входе
    function localStorageDefault(genderSelector, ratSelector, activeClass) {
        if (localStorage.getItem('gender')) {
            gender = localStorage.getItem('gender');
        } else {
            gender = 'female';
            localStorage.setItem('gender', 'female');
        }
        if (localStorage.getItem('rat')) {
            rat = localStorage.getItem('rat');
        } else {
            rat = 1.375;
            localStorage.setItem('rat', 1.375);
        }
        initLocalActive(genderSelector, activeClass);
        initLocalActive(ratSelector, activeClass);
    }
    // Функция установки первоначальных классов активности
    function initLocalActive(selector, activeClass) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(elem => {
            elem.classList.remove(activeClass);
            if (elem.getAttribute('id') === localStorage.getItem('gender')) {
                elem.classList.add(activeClass);
            }
            if (elem.getAttribute('data-rat') === localStorage.getItem('rat')) {
                elem.classList.add(activeClass);
            }
        });
    }
}

export default calculator;