const weekClassName = "week";
const dayClassName = "day";
const selectedDateCellClass = "selected-day";
const otherMonthClass = "non-month-day";

let firstDatetimeInGrid = new Date();
let globalSelectedDatetime = new Date();
let currentMonth = -1;

function selectDate(selectedDatetime) {
    globalSelectedDatetime.setTime(selectedDatetime.getTime());

    if (selectedDatetime.getMonth() !== currentMonth) {
        updateGrid(selectedDatetime);
        return;
    }
}

function updateGrid(selectedDatetime) {
    currentMonth = selectedDatetime.getMonth();

    firstDatetimeInGrid.setTime(findFirstSunday(selectedDatetime).getTime());

    console.log(firstDatetimeInGrid);

    for (let week = 1; week <= 6; week++) {
        for (let day = 1; day <= 7; day++) {
            updateGridCell(week, day);
        }
    }

    selectDate(selectedDatetime);
}

function updateGridCell(week, day) {
    let gridDatetime = translateGridToDatetime(week, day);
    let dateCell = translateCoordinatesToElement(week, day);
    let dateText = dateCell.children[0];
    let dateContent = dateCell.children[1];

    dateText.innerHTML = gridDatetime.getDate();

    if (gridDatetime.getMonth() !== currentMonth) {
        dateCell.classList.add(otherMonthClass);
    }

    if (sameMonthDate(gridDatetime, globalSelectedDatetime)) {
        dateCell.classList.add(selectedDateCellClass);
    }

    //! Access database for content

}

function sameMonthDate(datetime1, datetime2) {
    if (datetime1.getDate() === datetime2.getDate() && datetime1.getMonth() === datetime2.getMonth()) {
        return true;
    }
    return false;
}

function findFirstSunday(selectedDatetime) {
    let workingDatetime = new Date();
    workingDatetime.setTime(selectedDatetime.getTime());
    workingDatetime.setDate(1);

    let dayIndex = workingDatetime.getDay();
    workingDatetime.setDate(workingDatetime.getDate() - dayIndex);

    return workingDatetime;
}

function translateGridToDatetime(week, day) {
    let output = new Date();
    output.setTime(firstDatetimeInGrid.getTime());
    output.setDate(output.getDate() + ( (week - 1) * 7) + day - 1);
    return output;
}

function translateCoordinatesToElement(week, day) {
    return document.querySelector(`.${weekClassName}${week}>.${dayClassName}${day}`);
}

selectDate(new Date(Date.now()));