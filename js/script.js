document.addEventListener('DOMContentLoaded', () => {
    const buildings = [
        { address: "пр-кт Дериглазова 55", entrances: 3, floors: 16, apartmentsPerFloor: 4, startFloor: 1 },
        { address: "пр-кт Дериглазова 57", entrances: 3, floors: 17, apartmentsPerFloor: 6, startFloor: 1 },
        { address: "пр-кт Дериглазова 61", entrances: 2, floors: 17, apartmentsPerFloor: 4, startFloor: 1 },
        { address: "пр-кт Дериглазова 63", entrances: 2, floors: 16, apartmentsPerFloor: 7, startFloor: 2 },
        { address: "пр-кт Дериглазова 65", entrances: 3, floors: 17, apartmentsPerFloor: 6, startFloor: 1 },
        { address: "пр-кт Дериглазова 69", entrances: 3, floors: 17, apartmentsPerFloor: 6, startFloor: 1 },
        { address: "пр-кт Дериглазова 71", entrances: 2, floors: 17, apartmentsPerFloor: 4, startFloor: 1 },
        { address: "пр-кт Дериглазова 73", entrances: 3, floors: 16, apartmentsPerFloor: 5, startFloor: 2 },
        { address: "пр-кт Дериглазова 75", entrances: 4, floors: 17, apartmentsPerFloor: 6, startFloor: 1 },
        { address: "пр-кт Дериглазова 79", entrances: 2, floors: 17, apartmentsPerFloor: 6, startFloor: 1 },
        { address: "пр-кт Дериглазова 81", entrances: 2, floors: 17, apartmentsPerFloor: 6, startFloor: 1 },
        { address: "пр-кт Дериглазова 83", entrances: 4, floors: 17, apartmentsPerFloor: 4, startFloor: 2 },
        { address: "пр-кт Дериглазова 85", entrances: 3, floors: 17, apartmentsPerFloor: 6, startFloor: 1 },
        { address: "пр-кт Дериглазова 87", entrances: 2, floors: 17, apartmentsPerFloor: 4, startFloor: 1 },
        { address: "пр-кт Дериглазова 89", entrances: 4, floors: 17, apartmentsPerFloor: 4, startFloor: 2 },
        { address: "пр-кт Дериглазова 91", entrances: 3, floors: 17, apartmentsPerFloor: 6, startFloor: 1 },
        { address: "пр-кт Дериглазова 93", entrances: 4, floors: 17, apartmentsPerFloor: 6, startFloor: 1 },
        { address: "пр-кт Дериглазова 95", entrances: 2, floors: 17, apartmentsPerFloor: 6, startFloor: 2 },
        { address: "пр-кт Дериглазова 97", entrances: 2, floors: 17, apartmentsPerFloor: 6, startFloor: 1 },
        { address: "пр-кт Дериглазова 50", entrances: 3, floors: 17, apartmentsPerFloor: 6, startFloor: 2 },
        { address: "пр-кт Дериглазова 52", entrances: 3, floors: 17, apartmentsPerFloor: 6, startFloor: 2 },
        { address: "пр-кт Дериглазова 54", entrances: 3, floors: 17, apartmentsPerFloor: 6, startFloor: 2 },
        { address: "пр-кт Дериглазова 56", entrances: 3, floors: 17, apartmentsPerFloor: 6, startFloor: 2 },
        { address: "пр-кт Дериглазова 107", entrances: 2, floors: 16, apartmentsPerFloor: 7, startFloor: 2 },
    ];

    const buildingSelect = document.getElementById('buildingSelect');
    const apartmentNumberInput = document.getElementById('apartmentNumberInput');
    const findApartmentButton = document.getElementById('findApartmentButton');
    const resultsDiv = document.getElementById('results');

    const arrowContainer = document.getElementById('arrowContainer');
    const leftArrow = document.getElementById('leftArrow');
    const rightArrow = document.getElementById('rightArrow');

    function resetArrowState() {
        arrowContainer.classList.remove('visible');
        leftArrow.classList.remove('active');
        rightArrow.classList.remove('active');
    }

    function populateBuildingSelect() {
        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = "Выберите дом";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        buildingSelect.appendChild(defaultOption);

        buildings.forEach(building => {
            const option = document.createElement('option');
            option.value = building.address;
            option.textContent = building.address;
            buildingSelect.appendChild(option);
        });
    }

    function displayResult(message, isError = false) {
        resultsDiv.innerHTML = `<p class="${isError ? 'error' : ''}">${message}</p>`;
        resetArrowState();
    }

    function findApartmentDetails() {
        const selectedAddress = buildingSelect.value;
        const apartmentNumber = parseInt(apartmentNumberInput.value);

        if (!selectedAddress) {
            displayResult("Пожалуйста, выберите дом из списка.", true);
            return;
        }

        if (isNaN(apartmentNumber) || apartmentNumber <= 0) {
            displayResult("Пожалуйста, введите корректный номер квартиры (положительное число).", true);
            return;
        }

        const selectedBuilding = buildings.find(b => b.address === selectedAddress);

        if (!selectedBuilding) {
            displayResult("Ошибка: Данные по выбранному дому не найдены.", true);
            return;
        }

        const { entrances, floors, apartmentsPerFloor, startFloor } = selectedBuilding;

        const maxRealFloor = startFloor + floors - 1;
        const maxAllowedFloor = Math.min(17, maxRealFloor);
        const realFloorBlocks = maxAllowedFloor - startFloor + 1;
        const apartmentsPerEntrance = realFloorBlocks * apartmentsPerFloor;
        const maxApartmentNumber = entrances * apartmentsPerEntrance;

        if (apartmentNumber > maxApartmentNumber) {
            displayResult(`Квартира №${apartmentNumber} не существует в этом доме. Максимальный номер квартиры: ${maxApartmentNumber}.`, true);
            return;
        }

        const entranceNumber = Math.ceil(apartmentNumber / apartmentsPerEntrance);
        const apartmentNumberInEntrance = apartmentNumber - ((entranceNumber - 1) * apartmentsPerEntrance);
        const floorOffset = Math.ceil(apartmentNumberInEntrance / apartmentsPerFloor);
        const actualFloor = startFloor + (floorOffset - 1);
        
        let apartmentIndexOnFloor = apartmentNumberInEntrance % apartmentsPerFloor;
        if (apartmentIndexOnFloor === 0) {
            apartmentIndexOnFloor = apartmentsPerFloor;
        }

        let positionString = "";
        let arrowDir = null;

        if (selectedBuilding.address === "пр-кт Дериглазова 107") {
            if (apartmentIndexOnFloor >= 5) {
                positionString = `${apartmentIndexOnFloor}-я справа`;
                arrowDir = 'right';
            } else {
                positionString = `${apartmentIndexOnFloor}-я слева`;
                arrowDir = 'left';
            }
        } else if (apartmentsPerFloor === 6) {
            if (apartmentIndexOnFloor <= 3) {
                positionString = `${apartmentIndexOnFloor}-я слева`;
                arrowDir = 'left';
            } else {
                positionString = `${apartmentIndexOnFloor - 3}-я справа`;
                arrowDir = 'right';
            }
        } else if (apartmentsPerFloor === 4) {
            if (apartmentIndexOnFloor <= 2) {
                positionString = `${apartmentIndexOnFloor}-я слева`;
                arrowDir = 'left';
            } else {
                positionString = `${apartmentIndexOnFloor - 2}-я справа`;
                arrowDir = 'right';
            }
        } else {
            positionString = `Позиция ${apartmentIndexOnFloor}`;
        }

        resultsDiv.innerHTML = `
            <p>Позиция на этаже: <strong>${positionString}</strong></p>
            <p>Этаж: <strong>${actualFloor}</strong></p>
            <p>Подъезд: <strong>${entranceNumber}</strong></p>
        `;

        resetArrowState();

        if (arrowDir === 'left') {
            leftArrow.classList.add('active');
            arrowContainer.classList.add('visible');
        } else if (arrowDir === 'right') {
            rightArrow.classList.add('active');
            arrowContainer.classList.add('visible');
        }
    }

    populateBuildingSelect();
    findApartmentButton.addEventListener('click', findApartmentDetails);
    apartmentNumberInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            findApartmentDetails();
        }
    });

    resetArrowState();
});

console.log(arrowContainer, leftArrow, rightArrow)