document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.querySelector('.search-btn');
    const passengerIdInput = document.querySelector('#passenger-id-search');
    const tbody = document.querySelector('table tbody');

    // Form input fields
    const passengerIdField = document.querySelector('#passenger-id');
    const surnameField = document.querySelector('#surname');
    const nameField = document.querySelector('#name');
    const addressField = document.querySelector('#address');
    const phoneField = document.querySelector('#phone');

    const saveButton = document.querySelector('.save-btn');
    const updateButton = document.querySelector('.update-btn');
    const deleteButton = document.querySelector('.delete-btn');
    const cancelButton = document.querySelector('.cancel-btn');

    // Add event listener for the update button
    updateButton.addEventListener('click', async (event) => {
        event.preventDefault();

        const passengerId = passengerIdField.value.trim();

        if (!passengerId) {
            alert('Please select a passenger to update.');
            return;
        }

        const updatedPassenger = {
            PassengerID: passengerIdField.value.trim(),
            Surname: surnameField.value.trim(),
            Name: nameField.value.trim(),
            Address: addressField.value.trim(),
            Phone: phoneField.value.trim(),
        };

        try {
            const response = await fetch(`http://localhost:8800/api/passengers/${passengerId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedPassenger),
            });

            if (response.ok) {
                alert('Passenger updated successfully!');
                // Optionally, refresh the passenger table or clear the form
                passengerIdField.value = '';
                surnameField.value = '';
                nameField.value = '';
                addressField.value = '';
                phoneField.value = '';

                // Hide update, delete, and cancel buttons
                updateButton.style.display = 'none';
                deleteButton.style.display = 'none';
                cancelButton.style.display = 'none';

                // Show save button
                saveButton.style.display = 'block';

                // Optionally, refresh the passenger table
                searchButton.click();
            } else {
                const error = await response.json();
                console.error('Error updating passenger:', error);
                alert(`Error: ${error.message}`);
            }
        } catch (error) {
            console.error('Error updating passenger:', error);
            alert('Error updating passenger');
        }
    });

    // Add event listener for the delete button
    deleteButton.addEventListener('click', async () => {
        const passengerId = passengerIdField.value.trim();

        if (passengerId === '') {
            alert('Please select a passenger to delete.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8800/api/passengers/${passengerId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                alert('Passenger deleted successfully!');
                // Clear input fields
                passengerIdField.value = '';
                surnameField.value = '';
                nameField.value = '';
                addressField.value = '';
                phoneField.value = '';

                // Hide update, delete, and cancel buttons
                updateButton.style.display = 'none';
                deleteButton.style.display = 'none';
                cancelButton.style.display = 'none';

                // Show save button
                saveButton.style.display = 'block';

                // Optionally, refresh the passenger table
                searchButton.click();
            } else {
                const error = await response.json();
                console.error('Error deleting passenger:', error);
                alert(`Error: ${error.message}`);
            }
        } catch (error) {
            console.error('Error deleting passenger:', error);
            alert('Error deleting passenger');
        }
    });

    cancelButton.addEventListener('click', () => {
        // Clear input fields
        passengerIdField.value = '';
        surnameField.value = '';
        nameField.value = '';
        addressField.value = '';
        phoneField.value = '';

        // Hide update, delete, and cancel buttons
        updateButton.style.display = 'none';
        deleteButton.style.display = 'none';
        cancelButton.style.display = 'none';

        // Show save button
        saveButton.style.display = 'block';
    });

    searchButton.addEventListener('click', async () => {
        const passengerId = passengerIdInput.value.trim();

        // Check if the input is empty
        if (passengerId === '') {
            // Fetch all passengers information
            try {
                const response = await fetch('http://localhost:8800/api/passengers', {
                    method: "GET",
                    headers: {'Content-Type': 'application/json;charset=UTF-8'}
                });
                const passengers = await response.json();
                populateTable(passengers);
            } catch (error) {
                console.error('Error fetching passengers:', error);
            }
        } else {
            // Fetch specific passenger information by ID
            try {
                const response = await fetch(`http://localhost:8800/api/passengers/${passengerId}`);
                if (response.ok) {
                    const passenger = await response.json();
                    populateTable([passenger]);
                } else {
                    console.error('Passenger not found');
                    alert(`Error: Passenger not found`);
                }
            } catch (error) {
                console.error('Error fetching passenger:', error);
            }
        }
    });

    function populateTable(passengers) {
        // Clear previous table rows
        tbody.innerHTML = '';

        passengers.forEach(passenger => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${passenger.PassengerID}</td>
                <td>${passenger.Surname}</td>
                <td>${passenger.Name}</td>
                <td>${passenger.Address}</td>
                <td>${passenger.Phone}</td>
                <td><button class="view-btn" data-id="${passenger.PassengerID}">View</button></td>
            `;

            tbody.appendChild(row);
        });

        // Add event listeners to the view buttons
        document.querySelectorAll('.view-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const passengerId = event.target.getAttribute('data-id');
                viewPassengerDetails(passengerId);
                saveButton.style.display = 'none';
                updateButton.style.display = 'block';
                deleteButton.style.display = 'block';
                cancelButton.style.display = 'block';
            });
        });
    }

    async function viewPassengerDetails(passengerId) {
        try {
            const response = await fetch(`http://localhost:8800/api/passengers/${passengerId}`);
            if (response.ok) {
                const passenger = await response.json();
                // Populate the form with passenger details
                passengerIdField.value = passenger.PassengerID;
                surnameField.value = passenger.Surname;
                nameField.value = passenger.Name;
                addressField.value = passenger.Address;
                phoneField.value = passenger.Phone;
            } else {
                console.error('Passenger not found');
            }
        } catch (error) {
            console.error('Error fetching passenger details:', error);
        }
    }
    saveButton.addEventListener('click', async (event) => {
        event.preventDefault();

        if (!passengerIdField.value.trim() || !surnameField.value.trim() || !nameField.value.trim() || !addressField.value.trim() || !phoneField.value.trim()) {
            alert('Please fill in all fields');
            return;
        }

        const newPassenger = {
            PassengerID: passengerIdField.value.trim(),
            Surname: surnameField.value.trim(),
            Name: nameField.value.trim(),
            Address: addressField.value.trim(),
            Phone: phoneField.value.trim(),
        };

        try {
            const response = await fetch('http://localhost:8800/api/passengers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPassenger),
            });

            if (response.ok) {
                const createdPassenger = await response.json();
                console.log('Passenger created:', createdPassenger);
                // Optionally, refresh the passenger table or clear the form
                passengerIdField.value = '';
                surnameField.value = '';
                nameField.value = '';
                addressField.value = '';
                phoneField.value = '';
                alert('Passenger created successfully!');
            } else {
                const createdPassenger = await response.json();
                console.error('Error creating passenger:', createdPassenger);
                alert(`Error: ${createdPassenger.message}`);
            }
        } catch (error) {
            console.error('Error creating passenger:', error);
            alert('Error creating passenger');
        }
    });
});

