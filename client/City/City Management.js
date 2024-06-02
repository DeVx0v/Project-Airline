document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.querySelector('.search-btn');
    const cityNameInput = document.querySelector('#city-name-search');
    const tbody = document.querySelector('table tbody');

    // Form input fields
    const cityNameField = document.querySelector('#city-name');

    const saveButton = document.querySelector('.save-btn');
    const updateButton = document.querySelector('.update-btn');
    const deleteButton = document.querySelector('.delete-btn');
    const cancelButton = document.querySelector('.cancel-btn');

    // Variable to hold the selected city name
    let selectedCityName = '';

    // Add event listener for the update button
    updateButton.addEventListener('click', async (event) => {
        event.preventDefault();

        if (!selectedCityName) {
            alert('Please select a city to update.');
            return;
        }


        const updatedCity = {
            CityName: cityNameField.value.trim(),
        };

        try {
            const response = await fetch(`http://localhost:8800/api/cities/${selectedCityName}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedCity),
            });

            if (response.ok) {
                alert('City updated successfully!');
                cityNameField.value = '';

                // Hide update, delete, and cancel buttons
                updateButton.style.display = 'none';
                deleteButton.style.display = 'none';
                cancelButton.style.display = 'none';

                // Show save button
                saveButton.style.display = 'block';

                // Optionally, refresh the city table
                searchButton.click();
            } else {
                const error = await response.json();
                console.error('Error updating city:', error);
                alert(`Error: ${error.message}`);
            }
        } catch (error) {
            console.error('Error updating city:', error);
            alert('Error updating city');
        }
    });

    // Add event listener for the delete button
    deleteButton.addEventListener('click', async () => {
        const cityName = cityNameField.value.trim();

        if (cityName === '') {
            alert('Please select a city to delete.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8800/api/cities/${cityName}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                alert('City deleted successfully!');
                cityNameField.value = '';

                // Hide update, delete, and cancel buttons
                updateButton.style.display = 'none';
                deleteButton.style.display = 'none';
                cancelButton.style.display = 'none';

                // Show save button
                saveButton.style.display = 'block';

                // Optionally, refresh the city table
                searchButton.click();
            } else {
                const error = await response.json();
                console.error('Error deleting city:', error);
                alert(`Error: ${error.message}`);
            }
        } catch (error) {
            console.error('Error deleting city:', error);
            alert('Error deleting city');
        }
    });

    cancelButton.addEventListener('click', () => {
        cityNameField.value = '';

        // Hide update, delete, and cancel buttons
        updateButton.style.display = 'none';
        deleteButton.style.display = 'none';
        cancelButton.style.display = 'none';

        // Show save button
        saveButton.style.display = 'block';
    });

    searchButton.addEventListener('click', async () => {
        const cityName = cityNameInput.value.trim();

        // Check if the input is empty
        if (cityName === '') {
            // Fetch all cities information
            try {
                const response = await fetch('http://localhost:8800/api/cities', {
                    method: "GET",
                    headers: {'Content-Type': 'application/json;charset=UTF-8'}
                });
                const cities = await response.json();
                populateTable(cities);
            } catch (error) {
                console.error('Error fetching cities:', error);
            }
        } else {
            // Fetch specific city information by name
            try {
                const response = await fetch(`http://localhost:8800/api/cities/${cityName}`);
                if (response.ok) {
                    const city = await response.json();
                    populateTable([city]);
                } else {
                    console.error('City not found');
                    alert(`Error: City not found`);
                }
            } catch (error) {
                console.error('Error fetching city:', error);
            }
        }
    });

    function populateTable(cities) {
        // Clear previous table rows
        tbody.innerHTML = '';

        cities.forEach(city => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${city.CityName}</td>
                <td><button class="view-btn" data-name="${city.CityName}">View</button></td>
            `;

            tbody.appendChild(row);
        });

        // Add event listeners to the view buttons
        document.querySelectorAll('.view-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const cityName = event.target.getAttribute('data-name');
                selectedCityName = cityName; // Set the selected city name
                viewCityDetails(cityName);
                saveButton.style.display = 'none';
                updateButton.style.display = 'block';
                deleteButton.style.display = 'block';
                cancelButton.style.display = 'block';
            });
        });
    }

    async function viewCityDetails(cityName) {
        try {
            const response = await fetch(`http://localhost:8800/api/cities/${cityName}`);
            if (response.ok) {
                const city = await response.json();
                cityNameField.value = city.CityName;
            } else {
                console.error('City not found');
            }
        } catch (error) {
            console.error('Error fetching city details:', error);
        }
    }

    saveButton.addEventListener('click', async (event) => {
        event.preventDefault();

        if (!cityNameField.value.trim()) {
            alert('Please fill in the city name');
            return;
        }

        const newCity = {
            CityName: cityNameField.value.trim(),
        };

        try {
            const response = await fetch('http://localhost:8800/api/cities', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCity),
            });

            if (response.ok) {
                const createdCity = await response.json();
                console.log('City created:', createdCity);
                cityNameField.value = '';
                alert('City created successfully!');
                // Optionally, refresh the city table
                searchButton.click()
            } else {
                const createdCity = await response.json();
                console.error('Error creating city:', createdCity);
                alert(`Error: ${createdCity.message}`);
            }
        } catch (error) {
            console.error('Error creating city:', error);
            alert('Error creating city');
        }
    });
});
