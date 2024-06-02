document.addEventListener('DOMContentLoaded', () => {

    const searchButton = document.querySelector('.search-btn');
    const flightNumInput = document.querySelector('#flight-number-search');
    const tbody = document.querySelector('table tbody');

    // Form input fields
    const flightNumField = document.querySelector('#flight-number');
    const originField = document.querySelector('#origin');
    const destinationField = document.querySelector('#destination');
    const dateField = document.querySelector('#date');
    const arrivalTimeField = document.querySelector('#arrival-time');
    const departureTimeField = document.querySelector('#departure-time');
    const SerNumField = document.querySelector('#airplane-id');
    
    const saveButton = document.querySelector('.save-btn');
    const updateButton = document.querySelector('.update-btn');
    const deleteButton = document.querySelector('.delete-btn');
    const cancelButton = document.querySelector('.cancel-btn');

    async function UpdateIntermCities(flightNum,cityValue){
        try{

            const responseC = await fetch(`http://localhost:8800/api/intermediate/${cityValue}/${flightNum}`);
            if (responseC.ok) {
                try{
                    const updatePromise = await fetch(`http://localhost:8800/api/intermediate/${flightNum}/${cityValue}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
              

                intermediateUpdatePromises.push(updatePromise);

                } catch(error) {
                    console.error('Error updating intermediate city:', error);
                }
            } else {
                const intermcity = {
                    FlightNum: flightNum,
                    CityName: cityValue
                };
                try{
                    const updatePromise = await fetch(`http://localhost:8800/api/intermediate`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(intermcity),
                    })

                    intermediateUpdatePromises.push(updatePromise);
                   

                } catch(error) {
                    console.error('Error updating intermediate city:', error);
                }
            }
        } catch (error) {
            console.error('Error fetching flight:', error);
        }
    }

    async function cityExists(cityName) {
        try {
            const response = await fetch(`http://localhost:8800/api/cities/${cityName}`);
            if (response.ok) {
                const city = await response.json();
                return city !== null;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error checking city existence:', error);
            return false;
        }
    }

    // Add event listener for the update button
    updateButton.addEventListener('click', async (event) => {
        event.preventDefault();

        const flightNum = flightNumField.value.trim();

        if (!flightNum) {
            alert('Please select a flight to update.');
            return;
        }

        const origin = originField.value.trim();
        const destination = destinationField.value.trim();

        const originExists = await cityExists(origin);
        const destinationExists = await cityExists(destination);

        if (!originExists) {
            alert(`Error: Origin city '${origin}' does not exist.`);
            return;
        }

        if (!destinationExists) {
            alert(`Error: Destination city '${destination}' does not exist.`);
            return;
        }


        const updatedFlight = {
            FlightNum: flightNumField.value.trim(),
            Origin: originField.value.trim(),
            Destination: destinationField.value.trim(),
            Date: dateField.value.trim(),
            ArrTime: arrivalTimeField.value.trim(),
            DepTime: departureTimeField.value.trim(),
            SerNum: SerNumField.value.trim()
        };

        // Check for intermediate fields
        const intermediateFields = document.querySelectorAll('.intermediate-stop input');
        const intermediateUpdatePromises = [];

        // For each intermediate field, send a update request
        intermediateFields.forEach(intermediateField => {
            const cityValue = intermediateField.value.trim();
            if (cityValue) {
                
                UpdateIntermCities(flightNum,cityValue)
                
            }
        });

        try {
            // Wait for all intermediate city requests to complete
            await Promise.all(intermediateUpdatePromises);
            // Update the flight after updating all intermediate cities
            const response = await fetch(`http://localhost:8800/api/flights/${flightNum}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedFlight),
            });

            if (response.ok) {
                alert('Flight updated successfully!');
                clearForm();
                // Clear existing intermediate stops
                document.querySelectorAll('.intermediate-stop').forEach(stop => stop.remove());
                searchButton.click();
            } else {
                const error = await response.json();
                console.error('Error updating flight:', error);
                alert(`Error: ${error.message}`);
            }
        } catch (error) {
            console.error('Error updating flight:', error);
            alert('Error updating flight');
        }
    });

    // Add event listener for the delete button
    deleteButton.addEventListener('click', async () => {
        const FlightNum = flightNumField.value.trim();

        if (FlightNum === '') {
            alert('Please select a flight to delete.');
            return;
        }
        // Check for intermediate fields
        const intermediateFields = document.querySelectorAll('.intermediate-stop input');
        const intermediateDeletePromises = [];

        // For each intermediate field, send a delete request
        intermediateFields.forEach(intermediateField => {
            const cityValue = intermediateField.value.trim();
            if (cityValue) {
                const deletePromise = fetch(`http://localhost:8800/api/intermediate/${FlightNum}/${cityValue}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }).then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to delete intermediate city ${cityValue}`);
                    }
                }).catch(error => {
                    console.error('Error deleting intermediate city:', error);
                    alert(`Error deleting intermediate city: ${cityValue}`);
                });
                intermediateDeletePromises.push(deletePromise);
            }
        });

        try {
            // Wait for all intermediate city delete requests to complete
            await Promise.all(intermediateDeletePromises);
            // Delete the flight after deleting all intermediate cities
            const response = await fetch(`http://localhost:8800/api/flights/${FlightNum}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                alert('Flight deleted successfully!');
                clearForm();
                searchButton.click();
                // Clear existing intermediate stops
                document.querySelectorAll('.intermediate-stop').forEach(stop => stop.remove());
            } else {
                const error = await response.json();
                console.error('Error deleting flight:', error);
                alert(`Error: ${error.message}`);
            }
        } catch (error) {
            console.error('Error deleting flight:', error);
            alert('Error deleting flight');
        }
    });

    document.getElementById('citybtn').addEventListener('click', function() {
        const newDiv = `
            <div class="form-group intermediate-stop">
                <label for="stop">Intermidiate Stop:</label>
                <input type="text" id="stop">
            </div>
        `;
        this.insertAdjacentHTML('beforebegin', newDiv);
    });

    document.getElementById('removeCitybtn').addEventListener('click', function() {
        const cityBtn = document.getElementById('citybtn');
        const lastStopDiv = cityBtn.previousElementSibling;
        if (lastStopDiv && lastStopDiv.classList.contains('intermediate-stop')) {
            lastStopDiv.remove();
        }
    });

    cancelButton.addEventListener('click', () => {
        clearForm();
        // Clear existing intermediate stops
        document.querySelectorAll('.intermediate-stop').forEach(stop => stop.remove());
    });

    searchButton.addEventListener('click', async () => {
        const flightNum = flightNumInput.value.trim();

        if (flightNum === '') {
            try {
                const response = await fetch('http://localhost:8800/api/flights', {
                    method: "GET",
                    headers: {'Content-Type': 'application/json;charset=UTF-8'}
                });
                const flights = await response.json();
                populateTable(flights);
            } catch (error) {
                console.error('Error fetching flights:', error);
            }
        } else {
            try {
                const response = await fetch(`http://localhost:8800/api/flights/${flightNum}`);
                if (response.ok) {
                    const flight = await response.json();
                    populateTable([flight]);
                } else {
                    console.error('Flight not found');
                    alert(`Error: Flight not found`);
                }
            } catch (error) {
                console.error('Error fetching flight:', error);
            }
        }
    });

    async function populateTable(flights) {
        tbody.innerHTML = '';

        for (const flight of flights) {
            try{
                const responseC = await fetch(`http://localhost:8800/api/intermediate/${flight.FlightNum}`);
                if (responseC.ok) {
                    const intermcity = await responseC.json();
                    // Generate the intermediate cities HTML content
                    let intermCitiesHtml = '';
                    for (const interm of intermcity) {
                        intermCitiesHtml += `<span>${interm.CityName}</span><br/>`;
                    }
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${flight.FlightNum}</td>
                        <td>${flight.Origin}</td>
                        <td>${intermCitiesHtml}</td>
                        <td>${flight.Destination}</td>
                        <td>${flight.Date}</td>
                        <td>${flight.DepTime}</td>
                        <td>${flight.ArrTime}</td>
                        <td>${flight.SerNum}</td>
                        <td><button class="view-btn" data-id="${flight.FlightNum}">View</button></td>
                    `;
            
                    tbody.appendChild(row);
                    

                } else {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${flight.FlightNum}</td>
                        <td>${flight.Origin}</td>
                        <td>N/A</td>
                        <td>${flight.Destination}</td>
                        <td>${flight.Date}</td>
                        <td>${flight.DepTime}</td>
                        <td>${flight.ArrTime}</td>
                        <td>${flight.SerNum}</td>
                        <td><button class="view-btn" data-id="${flight.FlightNum}">View</button></td>
                    `;
            
                    tbody.appendChild(row);
                }
            } catch (error) {
                console.error('Error fetching flight:', error);
            }
             
        }

        document.querySelectorAll('.view-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const flightNum = event.target.getAttribute('data-id');
                viewFlightDetails(flightNum);
                saveButton.style.display = 'none';
                updateButton.style.display = 'block';
                deleteButton.style.display = 'block';
                cancelButton.style.display = 'block';
            });
        });
    }

    async function viewFlightDetails(flightNum) {
        try {
            const response = await fetch(`http://localhost:8800/api/flights/${flightNum}`);
            if (response.ok) {
                const flight = await response.json();
                flightNumField.value = flight.FlightNum;
                originField.value = flight.Origin;
                destinationField.value = flight.Destination;
                dateField.value = flight.Date;
                arrivalTimeField.value = flight.ArrTime;
                departureTimeField.value = flight.DepTime;
                SerNumField.value = flight.SerNum;

                // Fetch intermediate cities
                const intermediateResponse = await fetch(`http://localhost:8800/api/intermediate/${flightNum}`);
                if (intermediateResponse.ok) {
                    const intermediateCities = await intermediateResponse.json();

                    // Clear existing intermediate stops
                    document.querySelectorAll('.intermediate-stop').forEach(stop => stop.remove());

                    // Click the citybtn for each intermediate city
                    for (const city of intermediateCities) {
                        document.getElementById('citybtn').click();
                        const intermediateStops = document.querySelectorAll('.intermediate-stop');
                        const lastStopDiv = intermediateStops[intermediateStops.length - 1]; // Select the last added intermediate stop
                        if (lastStopDiv) {
                            const inputField = lastStopDiv.querySelector('input');
                            if (inputField) {
                                inputField.value = city.CityName;
                            }
                        }
                    }
                }else {
                    console.error('No intermediate cities found');
                }    
            } else {
                console.error('Flight not found');
            }
        } catch (error) {
            console.error('Error fetching flight details:', error);
        }
    }

    saveButton.addEventListener('click', async (event) => {
        event.preventDefault();

        if (!flightNumField.value.trim() || !originField.value.trim() || !destinationField.value.trim() || !dateField.value.trim() || !arrivalTimeField.value.trim() || !departureTimeField.value.trim() || !SerNumField.value.trim()) {
            alert('Please fill in all fields');
            return;
        }

        const origin = originField.value.trim();
        const destination = destinationField.value.trim();

        const originExists = await cityExists(origin);
        const destinationExists = await cityExists(destination);

        if (!originExists) {
            alert(`Error: Origin city '${origin}' does not exist.`);
            return;
        }

        if (!destinationExists) {
            alert(`Error: Destination city '${destination}' does not exist.`);
            return;
        }

        const newFlight = {
            FlightNum: flightNumField.value.trim(),
            Origin: originField.value.trim(),
            Destination: destinationField.value.trim(),
            Date: dateField.value.trim(),
            ArrTime: arrivalTimeField.value.trim(),
            DepTime: departureTimeField.value.trim(),
            SerNum: SerNumField.value.trim()
        };

        // Check for intermediate fields
        const intermediateFields = document.querySelectorAll('.intermediate-stop input');
        const intermediateUpdatePromises = [];
        const FlightNum = flightNumField.value.trim();

        // For each intermediate field, send a update request
        intermediateFields.forEach(intermediateField => {
            const cityValue = intermediateField.value.trim();
            if (cityValue) {
                
                UpdateIntermCities(FlightNum,cityValue)
                
            }
        });

        try {
            // Wait for all intermediate city requests to complete
            await Promise.all(intermediateUpdatePromises);
            const response = await fetch('http://localhost:8800/api/flights', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newFlight),
            });

            if (response.ok) {
                const createdFlight = await response.json();
                console.log('Flight created:', createdFlight);
                clearForm();
                // Clear existing intermediate stops
                document.querySelectorAll('.intermediate-stop').forEach(stop => stop.remove());
                alert('Flight created successfully!');
                searchButton.click();
            } else {
                const error = await response.json();
                console.error('Error creating flight:', error);
                alert(`Error: ${error.message}`);
            }
        } catch (error) {
            console.error('Error creating flight:', error);
            alert('Error creating flight');
        }
    });

    function clearForm() {
        flightNumField.value = '';
        originField.value = '';
        destinationField.value = '';
        dateField.value = '';
        arrivalTimeField.value = '';
        departureTimeField.value = '';
        SerNumField.value = '';

        updateButton.style.display = 'none';
        deleteButton.style.display = 'none';
        cancelButton.style.display = 'none';

        saveButton.style.display = 'block';
    }
});
