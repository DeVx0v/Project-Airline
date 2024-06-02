document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.querySelector('table tbody');
    const passengerIdInput = document.querySelector('#passenger-id');

    // Fetch and display all flights on page load
    async function fetchFlights() {
        try {
            const response = await fetch('http://localhost:8800/api/flights', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            });
            const flights = await response.json();
            populateTable(flights);
        } catch (error) {
            console.error('Error fetching flights:', error);
        }
    }

    // Populate the flights table
    async function populateTable(flights) {
        tbody.innerHTML = '';

        for (const flight of flights) {
            try {
                const responseC = await fetch(`http://localhost:8800/api/intermediate/${flight.FlightNum}`);
                let intermCitiesHtml = '';
                if (responseC.ok) {
                    const intermcity = await responseC.json();
                    for (const interm of intermcity) {
                        intermCitiesHtml += `<span>${interm.CityName}</span><br/>`;
                    }
                }

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${flight.FlightNum}</td>
                    <td>${flight.Date}</td>
                    <td>${flight.Origin}</td>
                    <td>${intermCitiesHtml || 'N/A'}</td>
                    <td>${flight.Destination}</td>
                    <td>${flight.ArrTime}</td>
                    <td>${flight.DepTime}</td>
                    <td>${flight.SerNum}</td>
                    <td><button class="book-btn" data-id="${flight.FlightNum}">Book</button></td>
                `;
                tbody.appendChild(row);

            } catch (error) {
                console.error('Error fetching intermediate cities:', error);
            }
        }

        document.querySelectorAll('.book-btn').forEach(button => {
            button.addEventListener('click', handleBookButtonClick);
        });
    }

    // Handle the Book button click
    async function handleBookButtonClick(event) {
        const flightNum = event.target.getAttribute('data-id');
        const passengerId = passengerIdInput.value.trim();

        if (!passengerId) {
            alert('Please enter a Passenger ID.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8800/api/passenger-flight/${passengerId}/${flightNum}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                alert('Passenger successfully booked on flight.');
            } else {
                const error = await response.json();
                console.error('Error booking passenger:', error);
                alert(`Error: ${error.message}`);
            }
        } catch (error) {
            console.error('Error booking passenger:', error);
            alert('Error booking passenger');
        }
    }

    fetchFlights();
});
