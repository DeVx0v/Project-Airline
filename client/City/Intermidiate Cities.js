document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.querySelector('.search-btn');
    const flightNumInput = document.querySelector('#passenger-id');
    const tbody = document.querySelector('table tbody');

    searchButton.addEventListener('click', async () => {
        const flightNum = flightNumInput.value.trim();

        if (flightNum === '') {
            alert('Input field is empty: Please insert a flight number in the field');
        } else {
            try {
                const response = await fetch(`http://localhost:8800/api/intermediate/${flightNum}`);
                if (response.ok) {
                    const intermediateCities = await response.json();
                    populateTable(intermediateCities);
                } else {
                    alert('No intermediate cities found for this flight');
                }
            } catch (error) {
                console.error('Error fetching intermediate cities:', error);
            }
        }
    });

    function populateTable(intermediateCities) {
        tbody.innerHTML = '';

        for (const city of intermediateCities) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${city.FlightNum}</td>
                <td>${city.CityName}</td>
            `;
            tbody.appendChild(row);
        }
    }
});
