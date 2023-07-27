window.addEventListener("load", () => {
    clock();
    setAlarms();
    function clock() {
            const today = new Date();
            // get time components
            const hours = today.getHours();
            const minutes = today.getMinutes();
            const seconds = today.getSeconds();
            //add '0' to hour, minute & second when they are less 10
            const hour = hours < 10 ? "0" + hours : hours;
            const minute = minutes < 10 ? "0" + minutes : minutes;
            const second = seconds < 10 ? "0" + seconds : seconds;
            //make clock a 12-hour time clock
            const hourTime = hour > 12 ? hour - 12 : hour;
            const ampm = hour < 12 ? "AM" : "PM";
            const time = hourTime + ":" + minute + ":" + second + ampm;
            //time to the DOM
            document.getElementById("clock").innerHTML = time;
            //calling function every second
            setTimeout(clock, 1000);
    }
});


const alarms = [];
const alarmTimeouts = [];

function setAlarm() {
    const hourInput = document.getElementsByName("hour")[0];
    const minuteInput = document.getElementsByName("minute")[0];
    const secondInput = document.getElementsByName("second")[0];
    const ampmInput = document.getElementsByName("AMPM")[0];

    const selectedHour = parseInt(hourInput.value);
    const selectedMinute = parseInt(minuteInput.value);
    const selectedSecond = parseInt(secondInput.value);
    const selectedAMPM = ampmInput.value;

    // Basic validation to ensure valid input
    if (isNaN(selectedHour) || isNaN(selectedMinute) || isNaN(selectedSecond)) {
        alert("Please enter valid numbers for the alarm time.");
        return;
    }

    alarms.push({
        hour: selectedHour,
        minute: selectedMinute,
        second: selectedSecond,
        ampm: selectedAMPM
    });
    updateAlarmsList();
    setAlarms();
}

function deleteAlarm(index) {
    alarms.splice(index, 1);
    updateAlarmsList();
    setAlarms();
}

function updateAlarmsList() {
    const alarmsList = document.getElementById("alarmsList");
    // Clear the current list
    alarmsList.innerHTML = "";
    // Create list items for each alarm and append them to the alarmsList
    alarms.forEach((alarm, index) => {
        const listItem = document.createElement("li");
        listItem.classList.add('list')
        const hour = alarm.hour < 10 ? "0" + alarm.hour : alarm.hour;
        const minute = alarm.minute < 10 ? "0" + alarm.minute : alarm.minute;
        const second = alarm.second < 10 ? "0" + alarm.second : alarm.second;

        listItem.textContent = ` ${hour}:${minute}:${second} ${alarm.ampm}`;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "DEL" ;
        deleteButton.classList.add("btn3"); // Adding a class to the delete button for styling
        deleteButton.onclick = function () {
            deleteAlarm(index);
        };

        listItem.appendChild(deleteButton);
        alarmsList.appendChild(listItem);
    });    
}


function setAlarmTime(alarm) {
    const now = new Date();
    const alarmTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        alarm.hour + (alarm.ampm === "PM" ? 12 : 0),
        alarm.minute,
        alarm.second
    );
    if (alarmTime <= now) {
        // If the alarm time has already passed for today, set it for the next day
        alarmTime.setDate(alarmTime.getDate() + 1);
    }
    return alarmTime.getTime() - now.getTime();
}

function setAlarms() {
    // to Clear previous alarm timeouts
    alarmTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    alarmTimeouts.length = 0;

    alarms.forEach((alarm, index) => {
        const timeUntilAlarm = setAlarmTime(alarm);

        const timeoutId = setTimeout(function () {
            playAlarmSound();
            //alert(`Alarm ${index + 1}: Time's up! Alarm triggered!`);
        }, timeUntilAlarm);

        alarmTimeouts.push(timeoutId);
    });
}

function playAlarmSound() {
    const alarmSound = document.getElementById("alarmSound");
    alarmSound.play();
}
