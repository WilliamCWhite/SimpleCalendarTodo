const weekClassName = "week";
const dayClassName = "day";
const selectedDateCellClass = "selected-day";

let initializing = true;
let firstDatetimeInGrid = new Date();
let currentMonth = -1;

function selectDate(selectedDatetime) {
    if (selectedDatetime.getMonth() !== currentMonth) {
        updateGrid(selectedDatetime);
        return;
    }

    let distanceFromFirstCell = selectedDatetime.getDate() - firstDatetimeInGrid.getDate() + 1;
    let week = distanceFromFirstCell / 7 + 1;
    let day = distanceFromFirstCell % 7;

    let dateCell = translateCoordinatesToElement(week, day);
    dateCell.classList.add(selectedDateCellClass);
}

function updateGrid(selectedDatetime) {
    currentMonth = selectedDatetime.getMonth();

    console.log(findFirstSunday(selectedDatetime).getDate());

    console.log(firstDatetimeInGrid);

    firstDatetimeInGrid.setDate(findFirstSunday(selectedDatetime).getDate());

    console.log(firstDatetimeInGrid);

    for (let week = 1; week <= 6; week++) {
        for (let day = 1; day <= 7; day++) {
            updateGridCell(week, day);
        }
    }
}

function updateGridCell(week, day) {
    let gridDatetime = translateGridToDatetime(week, day);
    let dateCell = translateCoordinatesToElement(week, day);
    let dateText = dateCell.children[0];
    let dateContent = dateCell.children[1];

    dateText.innerHTML = gridDatetime.getDate();

    //! Access database for content

    
    
}

function findFirstSunday(selectedDatetime) {
    console.log(selectedDatetime);

    let workingDatetime = new Date();
    let currentDate = selectedDatetime.getDate();
    workingDatetime.setDate(selectedDatetime.getDate() - (currentDate - 1));

    console.log(workingDatetime);

    let currentDay = workingDatetime.getDay();
    workingDatetime.setDate(workingDatetime.getDate() - currentDay);

    console.log(workingDatetime);

    return workingDatetime;
}

function translateGridToDatetime(week, day) {
    let output = new Date();
    output.setDate(firstDatetimeInGrid.getDate() + ( (week - 1) * 7) + day - 1);
    return output;
}

function translateCoordinatesToElement(week, day) {
    return document.querySelector(`.${weekClassName}${week}>.${dayClassName}${day}`);
}

selectDate(new Date(Date.now()));