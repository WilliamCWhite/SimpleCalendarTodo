const weekClassName = "week";
const dayClassName = "day";
const selectedDateCellClass = "selected-day";
const otherMonthClass = "non-month-day";
const dateContainer = document.getElementById("date-container");
const taskContainer = document.getElementById("task-container");

const taskClass = "task";
const taskIconClass = "task-icon";
const taskContentClass = "task-content";
const taskDeleteIconClass = "task-delete-icon";
const checkedTaskClass = "checked-task";
const checkedTaskIconClass = "checked-task-icon";

let firstDatetimeInGrid = new Date();
let globalSelectedDatetime = new Date();
let currentMonth = -1;

function addTask() {
    let newTask = document.createElement("div");
    newTask.classList.add(taskClass);

    let taskIcon = document.createElement("div");
    let taskContent = document.createElement("div");
    let taskDeleteIcon = document.createElement("div");
    taskIcon.classList.add(taskIconClass);
    taskContent.classList.add(taskContentClass);
    taskDeleteIcon.classList.add(taskDeleteIconClass);
    taskContent.placeholder = "Add text here";
    taskContent.contentEditable = true;

    taskIcon.addEventListener("click", function(e) { checkTask(e.target.parentElement); }, false);
    taskDeleteIcon.addEventListener("click", function(e) { deleteTask(e.target.parentElement); }, false);

    newTask.appendChild(taskIcon);
    newTask.appendChild(taskContent);
    newTask.appendChild(taskDeleteIcon);

    taskContainer.appendChild(newTask);
}

function checkTask(taskElement) {
    taskElement.classList.toggle(checkedTaskClass);
    taskElement.children[0].classList.toggle(checkedTaskIconClass);
} 

function deleteTask(taskElement) {
    taskElement.remove();
}

dateContainer.addEventListener("click", function(e) {
    
    if (e.target.classList[0] !== "day") return;

    let dayString = e.target.classList[1];
    let weekString = e.target.parentElement.classList[1];

    let dayNumber = +dayString.slice(3);
    let weekNumber = +weekString.slice(4);
    
    let clickedDatetime = translateGridToDatetime(weekNumber, dayNumber);

    selectDate(clickedDatetime);

}, false);

function selectDate(selectedDatetime) {
    let oldCell = getCellByDatetime(globalSelectedDatetime);
    oldCell.classList.remove(selectedDateCellClass);
    globalSelectedDatetime.setTime(selectedDatetime.getTime());

    if (selectedDatetime.getMonth() !== currentMonth) {
        updateGrid(selectedDatetime);
        return;
    }

    let selectedCell = getCellByDatetime(selectedDatetime);
    selectedCell.classList.add(selectedDateCellClass);
}

function updateGrid(selectedDatetime) {
    currentMonth = selectedDatetime.getMonth();

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

let today = new Date();
selectDate(today);
today.setDate(today.getDate() + 13);
selectDate(today);