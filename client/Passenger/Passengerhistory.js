document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.querySelector('.search-btn');
    const passengerIdInput = document.querySelector('#passenger-id');
    const tbody = document.querySelector('table tbody');

    // Event listener for the search button
    searchButton.addEventListener('click', async () => {
        const passengerId = passengerIdInput.value.trim();
        
        if (!passengerId) {
            alert('Please enter a Passenger ID.');
            return;
        }

        await fetchPassengerHistory(passengerId);
    });

    // Fetch and display passenger travel history
    async function fetchPassengerHistory(passengerId) {
        try {
            const response = await fetch(`http://localhost:8800/api/passengers/travel-history/${passengerId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            });
            
            if (!response.ok) {
                const errorM = await response.text();
                alert(`Error: ${errorM}`);
            }
            
            const passengerFlights = await response.json();

            await populateTable(passengerFlights);
        } catch (error) {
            console.error('Error fetching passenger travel history:', error);
        }
    }

    // Populate the flights table with passenger travel history
    async function populateTable(passengerFlights) {
        tbody.innerHTML = '';

        for (const passengerFlight of passengerFlights) {
            try {
                const flightResponse = await fetch(`http://localhost:8800/api/flights/${passengerFlight.FlightNum}`);
                const flight = await flightResponse.json();
                
                const intermediateResponse = await fetch(`http://localhost:8800/api/intermediate/${flight.FlightNum}`);
                let intermediateStopsHtml = '';
                
                if (intermediateResponse.ok) {
                    const intermediateCities = await intermediateResponse.json();
                    for (const city of intermediateCities) {
                        intermediateStopsHtml += `<span>${city.CityName}</span><br/>`;
                    }
                }

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${flight.FlightNum}</td>
                    <td>${flight.Date}</td>
                    <td>${flight.Origin}</td>
                    <td>${intermediateStopsHtml || 'N/A'}</td>
                    <td>${flight.Destination}</td>
                    <td>${flight.ArrTime}</td>
                    <td>${flight.DepTime}</td>
                    <td>${flight.SerNum}</td>
                `;
                tbody.appendChild(row);

            } catch (error) {
                console.error('Error fetching flight details:', error);
            }
        }
    }
});
