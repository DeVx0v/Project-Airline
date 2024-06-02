document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.querySelector('.search-section table tbody');
    const tbodyStaff = document.querySelector('.form-section table tbody');
    const searchBtn = document.querySelector('.search-btn');
    const employeeSearchInput = document.querySelector('#employee-number-search');

    // Fetch and display all flights when the page loads
    async function loadFlights() {
        try {
            const response = await fetch('http://localhost:8800/api/flights', {
                method: "GET",
                headers: {'Content-Type': 'application/json;charset=UTF-8'}
            });

            if (response.ok) {
                const flights = await response.json();
                populateTable(flights);
            } else {
                console.error('Error fetching flights');
            }
        } catch (error) {
            console.error('Error fetching flights:', error);
        }
    }

    function populateTable(flights) {
        tbody.innerHTML = '';

        flights.forEach(flight => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${flight.FlightNum}</td>
                <td>${flight.Date}</td>
                <td>${flight.Origin}</td>
                <td>${flight.Destination}</td>
                <td>${flight.ArrTime}</td>
                <td>${flight.DepTime}</td>
                <td>${flight.SerNum}</td>
                <td><button class="assign-btn" data-id="${flight.FlightNum}">Assign</button></td>
            `;
            tbody.appendChild(row);
        });

        document.querySelectorAll('.assign-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const flightNum = event.target.getAttribute('data-id');
                assignStaffToFlight(flightNum);
            });
        });
    }

    async function assignStaffToFlight(flightNum) {
        const employeeNumber = document.querySelector('#flight-number-search').value.trim();
        const FlightNum = flightNum;
        if (!employeeNumber) {
            alert('Please enter an employee number.');
            return;
        }
        const asstoflight = {
            EmpNum : employeeNumber,
            FlightNum : FlightNum
        };

        try {
            const response = await fetch(`http://localhost:8800/api/staff-flight/${employeeNumber}/${FlightNum}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(asstoflight),
            });

            if (response.ok) {
                alert('Staff assigned to flight successfully!');
                document.querySelector('#flight-number-search').value = "";
            } else {
                const messageR = await response.json()
                alert(messageR.message)
                console.error('Error assigning staff to flight');
                document.querySelector('#flight-number-search').value = "";
            }
        } catch (error) {
            console.error('Error assigning staff to flight:', error);
        }
    }

    async function loadAssignedStaff(empNum) {
        const url = empNum ? `http://localhost:8800/api/staff-flight/${empNum}` : 'http://localhost:8800/api/staff-flight';
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {'Content-Type': 'application/json;charset=UTF-8'}
            });

            if (response.ok) {
                const staff = await response.json();
                populateStaffTable(staff);
            } else {
                console.error('Error fetching assigned staff');
            }
        } catch (error) {
            console.error('Error fetching assigned staff:', error);
        }
    }

    function populateStaffTable(staff) {
        tbodyStaff.innerHTML = '';

        staff.forEach(member => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${member.EmpNum}</td>
                <td>${member.FlightNum}</td>
            `;
            tbodyStaff.appendChild(row);
        });
    }

    searchBtn.addEventListener('click', () => {
        const empNum = employeeSearchInput.value.trim();
        loadAssignedStaff(empNum);
    });

    // Load all flights when the page loads
    loadFlights();
});
