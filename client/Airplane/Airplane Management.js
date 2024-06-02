document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.querySelector('.search-btn');
    const SerNumInput = document.querySelector('#plane-number-search');
    const tbody = document.querySelector('table tbody');

    // Form input fields
    const SerNumField = document.querySelector('#plane-number');
    const manufacturerField = document.querySelector('#manufacturer');
    const modelField = document.querySelector('#model');

    const saveButton = document.querySelector('.save-btn');
    const updateButton = document.querySelector('.update-btn');
    const deleteButton = document.querySelector('.delete-btn');
    const cancelButton = document.querySelector('.cancel-btn');

    // Add event listener for the update button
    updateButton.addEventListener('click', async (event) => {
        event.preventDefault();

        const SerNum = SerNumField.value.trim();

        if (!SerNum) {
            alert('Please select an airplane to update.');
            return;
        }

        const updatedPlane = {
            SerNum: SerNumField.value.trim(),
            Manufacturer: manufacturerField.value.trim(),
            Model: modelField.value.trim(),
        };

        try {
            const response = await fetch(`http://localhost:8800/api/updateairplane/${SerNum}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedPlane),
            });

            if (response.ok) {
                alert('Airplane updated successfully!');
                // Optionally, refresh the airplane table or clear the form
                SerNumField.value = '';
                manufacturerField.value = '';
                modelField.value = '';

                // Hide update, delete, and cancel buttons
                updateButton.style.display = 'none';
                deleteButton.style.display = 'none';
                cancelButton.style.display = 'none';

                // Show save button
                saveButton.style.display = 'block';

                // Optionally, refresh the airplane table
                searchButton.click();
            } else {
                const error = await response.json();
                console.error('Error updating airplane:', error);
                alert(`Error: ${error.message}`);
            }
        } catch (error) {
            console.error('Error updating airplane:', error);
            alert('Error updating airplane');
        }
    });

    // Add event listener for the delete button
    deleteButton.addEventListener('click', async () => {
        const SerNum = SerNumField.value.trim();

        if (SerNum === '') {
            alert('Please select an airplane to delete.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8800/api/deleteairplane/${SerNum}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                alert('Airplane deleted successfully!');
                // Clear input fields
                SerNumField.value = '';
                manufacturerField.value = '';
                modelField.value = '';

                // Hide update, delete, and cancel buttons
                updateButton.style.display = 'none';
                deleteButton.style.display = 'none';
                cancelButton.style.display = 'none';

                // Show save button
                saveButton.style.display = 'block';

                // Optionally, refresh the airplane table
                searchButton.click();
            } else {
                const error = await response.json();
                console.error('Error deleting airplane:', error);
                alert(`Error: ${error.message}`);
            }
        } catch (error) {
            console.error('Error deleting airplane:', error);
            alert('Error deleting airplane');
        }
    });

    cancelButton.addEventListener('click', () => {
        // Clear input fields
        SerNumField.value = '';
        manufacturerField.value = '';
        modelField.value = '';

        // Hide update, delete, and cancel buttons
        updateButton.style.display = 'none';
        deleteButton.style.display = 'none';
        cancelButton.style.display = 'none';

        // Show save button
        saveButton.style.display = 'block';
    });

    searchButton.addEventListener('click', async () => {
        const SerNum = SerNumInput.value.trim();

        // Check if the input is empty
        if (SerNum === '') {
            // Fetch all airplanes information
            try {
                const response = await fetch('http://localhost:8800/api/getallairplanes', {
                    method: "GET",
                    headers: {'Content-Type': 'application/json;charset=UTF-8'}
                });
                const airplanes = await response.json();
                populateTable(airplanes);
            } catch (error) {
                console.error('Error fetching airplanes:', error);
            }
        } else {
            // Fetch specific airplane information by plane number
            try {
                const response = await fetch(`http://localhost:8800/api/getairplane/${SerNum}`);
                if (response.ok) {
                    const airplane = await response.json();
                    populateTable([airplane]);
                } else {
                    console.error('Airplane not found');
                    alert(`Error: Airplane not found`);
                }
            } catch (error) {
                console.error('Error fetching airplane:', error);
            }
        }
    });

    function populateTable(airplanes) {
        // Clear previous table rows
        tbody.innerHTML = '';

        airplanes.forEach(airplane => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${airplane.SerNum}</td>
                <td>${airplane.Manufacturer}</td>
                <td>${airplane.Model}</td>
                <td><button class="view-btn" data-id="${airplane.SerNum}">View</button></td>
            `;

            tbody.appendChild(row);
        });

        // Add event listeners to the view buttons
        document.querySelectorAll('.view-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const SerNum = event.target.getAttribute('data-id');
                viewAirplaneDetails(SerNum);
                saveButton.style.display = 'none';
                updateButton.style.display = 'block';
                deleteButton.style.display = 'block';
                cancelButton.style.display = 'block';
            });
        });
    }

    async function viewAirplaneDetails(SerNum) {
        try {
            const response = await fetch(`http://localhost:8800/api/getairplane/${SerNum}`);
            if (response.ok) {
                const airplane = await response.json();
                // Populate the form with airplane details
                SerNumField.value = airplane.SerNum;
                manufacturerField.value = airplane.Manufacturer;
                modelField.value = airplane.Model;
            } else {
                console.error('Airplane not found');
            }
        } catch (error) {
            console.error('Error fetching airplane details:', error);
        }
    }
    
    saveButton.addEventListener('click', async (event) => {
        event.preventDefault();

        if (!SerNumField.value.trim() || !manufacturerField.value.trim() || !modelField.value.trim()) {
            alert('Please fill in all fields');
            return;
        }

        const newAirplane = {
            SerNum: SerNumField.value.trim(),
            Manufacturer: manufacturerField.value.trim(),
            Model: modelField.value.trim(),
        };

        try {
            const response = await fetch('http://localhost:8800/api/newairplane', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newAirplane),
            });

            if (response.ok) {
                const createdAirplane = await response.json();
                console.log('Airplane created:', createdAirplane);
                // Optionally, refresh the airplane table or clear the form
                SerNumField.value = '';
                manufacturerField.value = '';
                modelField.value = '';
                alert('Airplane created successfully!');
                searchButton.click();
            } else {
                const createdAirplane = await response.json();
                console.error('Error creating airplane:', createdAirplane);
                alert(`Error: ${createdAirplane.message}`);
            }
        } catch (error) {
            console.error('Error creating airplane:', error);
            alert('Error creating airplane');
        }
    });
});
