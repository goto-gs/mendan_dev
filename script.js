document.addEventListener('DOMContentLoaded', function () {
    const API_URL = 'https://script.google.com/macros/s/AKfycby9j3NJCwIeHK6LwCcaFZ7nSGNmM-JwzU-A6U1zTeqGir6_npecsuVF1NwGT46IoGn9/exec';

    document.getElementById('load').addEventListener('click', loadSchedule);

    function loadSchedule() {
        const selectedDate = document.getElementById('date').value;
        if (!selectedDate) {
            alert('日付を選択してください。');
            return;
        }

        fetch(API_URL, { mode: "cors" })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    throw new Error(data.error);
                }
                const filteredData = data.filter(row => row.date === selectedDate);
                displaySchedule(filteredData);
            })
            .catch(error => {
                console.error("Error fetching data from Google Sheets", error);
            });
    }

    function displaySchedule(data) {
        const calendar = document.getElementById('calendar');
        calendar.innerHTML = '';
        const slots = generateTimeSlots();
        const availability = {};

        data.forEach(row => {
            const { date, time, person, reserver } = row;
            if (!availability[time]) availability[time] = {};
            availability[time][person] = reserver;
        });

        slots.forEach(slot => {
            const slotDiv = document.createElement('div');
            slotDiv.classList.add('slot');
            slotDiv.textContent = slot.time;

            const person1 = availability[slot.time]?.['担当者1'] || '';
            const person2 = availability[slot.time]?.['担当者2'] || '';

            if (person1 || person2) {
                slotDiv.classList.add('unavailable');
                slotDiv.textContent += `\n${person1 ? '担当者1: 予約済み' : ''}\n${person2 ? '担当者2: 予約済み' : ''}`;
            } else {
                slotDiv.classList.add('available');
                slotDiv.addEventListener('click', () => reserveSlot(slot.time));
            }

            calendar.appendChild(slotDiv);
        });
    }

    function generateTimeSlots() {
        const slots = [];
        for (let i = 9; i < 18; i++) {
            slots.push({ time: `${i}:00 - ${i}:30` });
            slots.push({ time: `${i}:30 - ${i + 1}:00` });
        }
        return slots;
    }

    function reserveSlot(time) {
        alert(`予約しました: ${time}`);
    }
});
