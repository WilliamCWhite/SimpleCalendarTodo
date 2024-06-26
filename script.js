const dateContainer = document.getElementById("date-container");
const taskContainer = document.getElementById("task-container");
const monthTitle = document.getElementById("month-title");
const previousMonthButton = document.getElementById("previous-month-button");
const nextMonthButton = document.getElementById("next-month-button");
const bodyElement = document.getElementById("body");
const everythingContainer = document.getElementById("everything-container");
const blurPopup = document.getElementById("blur-popup");
const monthSelectorPopup = document.getElementById("month-selector-popup");
const previousYearButton = document.getElementById("previous-year-button");
const nextYearButton = document.getElementById("next-year-button");
const yearTitle = document.getElementById("year-title");
const monthCellContainer = document.getElementById("month-cell-container");
const taskDayTitle = document.getElementById("day-title");

const monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const weekdayArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const autosaveTimerMS = 5000;

const taskClass = "task";
const taskIconClass = "task-icon";
const taskContentClass = "task-content";
const taskDeleteIconClass = "task-delete-icon";
const checkedTaskClass = "checked-task";
const checkedTaskIconClass = "checked-task-icon";
const hiddenPopupClass = "hidden-popup";

const weekClassName = "week";
const dayClassName = "day";
const selectedDateCellClass = "selected-day";
const otherMonthClass = "non-month-day";

const monthCellClass = "month-cell";
const monthRowClass = "month-row";
const selectedMonthCellClass = "selected-month-cell";

const lastInTaskSection = document.getElementById("last-in-task-section");


let firstDatetimeInGrid = new Date();
let globalSelectedDatetime = new Date();
let currentMonth = -1;
let currentYear = -1;
let initialzed = false;
let justSwitchedMonth = false;
let monthSelectorYear = currentYear;

monthCellContainer.addEventListener("click", function(e) {
    if (e.target.classList[0] != monthCellClass) return;

    let monthRowString = e.target.parentElement.classList[1];
    let monthColumnString = e.target.classList[1];

    let rowNumber = +monthRowString.slice(monthRowClass.length);
    let columnNumber = +monthColumnString.slice(monthCellClass.length);

    let selectedMonthIndex = (rowNumber - 1) * 3 + columnNumber - 1;


    selectMonth(selectedMonthIndex, monthSelectorYear);
    toggleMonthSelectorPopup();

}, false);

previousYearButton.addEventListener("click", function(e) {
    monthSelectorYear--;
    yearTitle.innerHTML = monthSelectorYear;
    updateMonthSelectorGrid();
}, false);

nextYearButton.addEventListener("click", function(e) {
    monthSelectorYear++;
    yearTitle.innerHTML = monthSelectorYear;
    updateMonthSelectorGrid();
}, false);

function updateMonthSelectorGrid() {

    let monthIndex = 0;
    for (let i = 1; i <= 4; i++) {
        for (let j = 1; j <= 3; j++) {
            let monthCell = selectMonthCell(i, j);
            if (currentMonth === monthIndex && currentYear === monthSelectorYear) {
                monthCell.classList.add(selectedMonthCellClass);
            }
            else {
                monthCell.classList.remove(selectedMonthCellClass);
            }
            monthIndex++;
        }
    }
}

function selectMonthCell(row, column) {
    return document.querySelector(`.${monthRowClass}${row}>.${monthCellClass}${column}`);
}

function toggleMonthSelectorPopup() {
    blurPopup.classList.toggle(hiddenPopupClass);
    monthSelectorPopup.classList.toggle(hiddenPopupClass);
    monthSelectorYear = currentYear;
    yearTitle.innerHTML = monthSelectorYear;
    updateMonthSelectorGrid();
}

monthTitle.addEventListener("click", function(e) {
    toggleMonthSelectorPopup();
}, false);

blurPopup.addEventListener("click", function(e) {
    toggleMonthSelectorPopup();
}, false);

function addTask() {
    let newTask = document.createElement("div");
    newTask.classList.add(taskClass);

    let taskIcon = document.createElement("div");
    let taskContent = document.createElement("div");
    let taskDeleteIcon = document.createElement("div");
    taskIcon.classList.add(taskIconClass);
    taskContent.classList.add(taskContentClass);
    taskDeleteIcon.classList.add(taskDeleteIconClass);
    taskContent.contentEditable = true;

    taskIcon.setAttribute('onclick', 'checkTask(this)');
    taskDeleteIcon.setAttribute('onclick', 'deleteTask(this)');

    newTask.appendChild(taskIcon);
    newTask.appendChild(taskContent);
    newTask.appendChild(taskDeleteIcon);

    taskContainer.appendChild(newTask);
    saveTaskData(globalSelectedDatetime);
}

function checkTask(taskIconElement) {
    let taskElement = taskIconElement.parentElement;
    taskElement.classList.toggle(checkedTaskClass);
    taskElement.children[0].classList.toggle(checkedTaskIconClass);
    saveTaskData(globalSelectedDatetime);
} 

function deleteTask(taskDeleteIconElement) {
    let taskElement = taskDeleteIconElement.parentElement;
    taskElement.remove();
    saveTaskData(globalSelectedDatetime);
}

function autosave() {
    saveTaskData(globalSelectedDatetime);
    
    setTimeout(autosave, autosaveTimerMS);
}

function saveTaskData(datetime) {
    localStorage.setItem(makeSaveKey(datetime), taskContainer.innerHTML);
}

function loadTaskData(datetime) {
    let saveKey = makeSaveKey(datetime);
    let data = localStorage.getItem(saveKey);
    if (data === null) {
        taskContainer.innerHTML = "";
    }
    else {
        taskContainer.innerHTML = data;
    }
}

function makeSaveKey(datetime) {
    let saveKey = "" + datetime.getFullYear() + "-" + datetime.getMonth() + "-" + datetime.getDate();
    return saveKey;
}

dateContainer.addEventListener("click", function(e) {
    
    if (e.target.classList[0] !== dayClassName) return;

    let dayString = e.target.classList[1];
    let weekString = e.target.parentElement.classList[1];

    let dayNumber = +dayString.slice(3);
    let weekNumber = +weekString.slice(4);
    
    let clickedDatetime = translateGridToDatetime(weekNumber, dayNumber);

    selectDate(clickedDatetime);

}, false);

function selectDate(selectedDatetime) {

    if (!justSwitchedMonth) {
        let oldCell = getCellByDatetime(globalSelectedDatetime);
        oldCell.classList.remove(selectedDateCellClass);
    }
    else {
        justSwitchedMonth = false;
    }
    

    if (initialzed) {
        saveTaskData(globalSelectedDatetime);
    }
    else {
        loadTaskData(globalSelectedDatetime);
        autosave();
        initialzed = true;
    }
    

    if (selectedDatetime.getMonth() !== currentMonth || selectedDatetime.getFullYear() !== currentYear) {
        justSwitchedMonth = true;
        updateGrid(selectedDatetime);
        return;
    }

    globalSelectedDatetime.setTime(selectedDatetime.getTime());
    
    let selectedCell = getCellByDatetime(selectedDatetime);
    selectedCell.classList.add(selectedDateCellClass);
    loadTaskData(globalSelectedDatetime);
    taskDayTitle.innerHTML = parseDatetimeIntoString(globalSelectedDatetime);
}

previousMonthButton.addEventListener("click", function(e) {
    if (currentMonth == 0) {
        selectMonth(11, currentYear - 1);
    }
    else {
        selectMonth(currentMonth - 1, currentYear);
    }
}, false);

nextMonthButton.addEventListener("click", function(e) {
    if (currentMonth == 11) {
        selectMonth(0, currentYear + 1);
    }
    else {
        selectMonth(currentMonth + 1, currentYear);
    }
}, false);

function selectMonth(monthIndex, fullYear) {
    let firstOfTheMonth = new Date(fullYear, monthIndex, 1);
    selectDate(firstOfTheMonth);
}

function updateGrid(selectedDatetime) {
    currentMonth = selectedDatetime.getMonth();
    currentYear = selectedDatetime.getFullYear();
    monthTitle.innerHTML = "" + monthArray[currentMonth] + " " + currentYear;

    firstDatetimeInGrid.setTime(findFirstSunday(selectedDatetime).getTime());

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
    else {
        dateCell.classList.remove(otherMonthClass);
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
    output.setDate(output.getDate() + coordinatesToGridNumber(week, day) - 1);
    return output;
}

function translateCoordinatesToElement(week, day) {
    return document.querySelector(`.${weekClassName}${week}>.${dayClassName}${day}`);
}

function getCellByDatetime(datetime) {
    let gridNumber = translateDatetimeToGridNumber(datetime);

    let cell = translateCoordinatesToElement(
        gridNumberToWeek(gridNumber),
        gridNumberToDay(gridNumber) );
    return cell;
}

function translateDatetimeToGridNumber(datetime) {
    let milliseconds = datetime.getTime() - firstDatetimeInGrid.getTime();
    let days = Math.round(milliseconds / 86400000); // datetime and firstDatetimeInGrid are based on the same milliseconds, but there is some offset within a month
    return days + 1;
}

function gridNumberToWeek(gridNumber) {

    return Math.floor(((gridNumber - 1) / 7)) + 1;
}

function gridNumberToDay(gridNumber) {
    let output = gridNumber % 7;
    if (output === 0) return 7;
    return output;
}

function coordinatesToGridNumber(week, day) {
    return ((week - 1) * 7) + day;
}

function parseDatetimeIntoString(datetime) {
    let options = {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    }
    let output = datetime.toLocaleDateString(undefined, options); 
    console.log(output);
    return output;

}

let today = new Date();
selectDate(today);