document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.querySelector('.search-btn');
    const flightNumInput = document.querySelector('#passenger-id');
    const tbody = document.querySelector('table tbody');

    // Event listener for the search button
    searchButton.addEventListener('click', async () => {
        const flightNum = flightNumInput.value.trim();
        
        if (!flightNum) {
            alert('Please enter a Flight Number.');
            return;
        }

        await fetchPassengersOnFlight(flightNum);
    });

    // Fetch and display passengers on the specified flight
    async function fetchPassengersOnFlight(flightNum) {
        try {
            const response = await fetch(`http://localhost:8800/api/flights/passengers/${flightNum}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            });
            
            if (!response.ok) {
                const errorM = await response.text();
                alert(`Error: ${errorM}`);
            }

            const passengers = await response.json();
            await populateTable(passengers);
        } catch (error) {
            console.error('Error fetching passengers on flight:', error);
        }
    }

    // Populate the table with passenger details
    async function populateTable(passengers) {
        tbody.innerHTML = '';

        for (const passenger of passengers) {
            try {
                const passengerResponse = await fetch(`http://localhost:8800/api/passengers/${passenger.PassengerID}`);
                
                if (!passengerResponse.ok) {
                    throw new Error('Failed to fetch passenger details');
                }
                
                const passengerDetails = await passengerResponse.json();

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${passengerDetails.PassengerID}</td>
                    <td>${passengerDetails.Surname}</td>
                    <td>${passengerDetails.Name}</td>
                    <td>${passengerDetails.Address}</td>
                    <td>${passengerDetails.Phone}</td>
                `;
                tbody.appendChild(row);

            } catch (error) {
                console.error('Error fetching passenger details:', error);
            }
        }
    }
});
