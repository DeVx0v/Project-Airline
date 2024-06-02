document.addEventListener('DOMContentLoaded', () => {
    function checkStaffType() {
        var ratingGroup = document.getElementById('rating-group');
        var staffType = document.getElementById('stafftype').value;
        if (staffType === 'Pilot') {
            ratingGroup.style.display = 'block';
        } else {
            ratingGroup.style.display = 'none';
        }
    }
    // Hide the rating group initially
    document.getElementById('rating-group').style.display = 'none';
        
    // Check the staff type value every 500 milliseconds (adjust as needed)
    setInterval(checkStaffType, 100);


    const searchButton = document.querySelector('.search-btn');
    const EmpNumInput = document.querySelector('#employee-number-search');
    const tbody = document.querySelector('table tbody');

    // Form input fields
    const EmpNumField = document.querySelector('#employee-number');
    const surnameField = document.querySelector('#surname');
    const nameField = document.querySelector('#name');
    const addressField = document.querySelector('#address');
    const phoneField = document.querySelector('#phone');
    const salaryField = document.querySelector('#salary');
    const staffTypeField = document.querySelector('#stafftype');
    const ratingField = document.querySelector('#rating');

    const saveButton = document.querySelector('.save-btn');
    const updateButton = document.querySelector('.update-btn');
    const deleteButton = document.querySelector('.delete-btn');
    const cancelButton = document.querySelector('.cancel-btn');

    // Add event listener for the update button
    updateButton.addEventListener('click', async (event) => {
        event.preventDefault();

        const EmpNum = EmpNumField.value.trim();

        if (!EmpNum) {
            alert('Please select a staff member to update.');
            return;
        }

        const updatedStaff = {
            EmpNum: EmpNumField.value.trim(),
            Surname: surnameField.value.trim(),
            Name: nameField.value.trim(),
            Address: addressField.value.trim(),
            Phone: phoneField.value.trim(),
            Salary: salaryField.value.trim(),
            StaffType: staffTypeField.value.trim(),
            
        };
        
        const updatedPilotRating = {
            EmpNum: EmpNumField.value.trim(),
            Rating: ratingField.value.trim()
        };

        const rating = ratingField.value.trim();

        try {
            const response = await fetch(`http://localhost:8800/api/staff/${EmpNum}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedStaff),
            });

            if (response.ok) {
                if (rating) {
                    const responseR = await fetch(`http://localhost:8800/api/staff-rating/${EmpNum}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedPilotRating),
                });
                const updatedRating = await responseR.json();
                console.log('Rating was updated:', updatedRating);
                }
                alert('Staff updated successfully!');
                // Optionally, refresh the staff table or clear the form
                EmpNumField.value = '';
                surnameField.value = '';
                nameField.value = '';
                addressField.value = '';
                phoneField.value = '';
                salaryField.value = '';
                staffTypeField.value = '';
                ratingField.value = '';

                // Hide update, delete, and cancel buttons
                updateButton.style.display = 'none';
                deleteButton.style.display = 'none';
                cancelButton.style.display = 'none';

                // Show save button
                saveButton.style.display = 'block';

                // Optionally, refresh the staff table
                searchButton.click();
            } else {
                const error = await response.json();
                console.error('Error updating staff:', error);
                alert(`Error: ${error.message}`);
            }
        } catch (error) {
            console.error('Error updating staff:', error);
            alert('Error updating staff');
        }
    });

    // Add event listener for the delete button
    deleteButton.addEventListener('click', async () => {
        const EmpNum = EmpNumField.value.trim();
        const rating = ratingField.value.trim();

        if (EmpNum === '') {
            alert('Please select a staff member to delete.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8800/api/staff/${EmpNum}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                if (rating) {
                    await fetch(`http://localhost:8800/api/staff-rating/${EmpNum}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                }
                alert('Staff deleted successfully!');
                // Clear input fields
                EmpNumField.value = '';
                surnameField.value = '';
                nameField.value = '';
                addressField.value = '';
                phoneField.value = '';
                salaryField.value = '';
                staffTypeField.value = '';
                ratingField.value = '';

                // Hide update, delete, and cancel buttons
                updateButton.style.display = 'none';
                deleteButton.style.display = 'none';
                cancelButton.style.display = 'none';

                // Show save button
                saveButton.style.display = 'block';

                // Optionally, refresh the staff table
                searchButton.click();
            } else {
                const error = await response.json();
                console.error('Error deleting staff:', error);
                alert(`Error: ${error.message}`);
            }
        } catch (error) {
            console.error('Error deleting staff:', error);
            alert('Error deleting staff');
        }
    });

    cancelButton.addEventListener('click', () => {
        // Clear input fields
        EmpNumField.value = '';
        surnameField.value = '';
        nameField.value = '';
        addressField.value = '';
        phoneField.value = '';
        salaryField.value = '';
        staffTypeField.value = '';
        ratingField.value = '';

        // Hide update, delete, and cancel buttons
        updateButton.style.display = 'none';
        deleteButton.style.display = 'none';
        cancelButton.style.display = 'none';

        // Show save button
        saveButton.style.display = 'block';
    });

    searchButton.addEventListener('click', async () => {
        const EmpNum = EmpNumInput.value.trim();

        // Check if the input is empty
        if (EmpNum === '') {
            // Fetch all staff information
            try {
                const response = await fetch('http://localhost:8800/api/getallstaff', {
                    method: "GET",
                    headers: {'Content-Type': 'application/json;charset=UTF-8'}
                });
                const staff = await response.json();
                populateTable(staff);
            } catch (error) {
                console.error('Error fetching staff:', error);
            }
        } else {
            // Fetch specific staff information by employee number
            try {
                const response = await fetch(`http://localhost:8800/api/getstaff/${EmpNum}`);
                if (response.ok) {
                    const staffMember = await response.json();
                    populateTable([staffMember]);
                } else {
                    console.error('Staff not found');
                    alert(`Error: Staff not found`);
                }
            } catch (error) {
                console.error('Error fetching staff:', error);
            }
        }
    });

    async function populateTable(staff) {
        // Clear previous table rows
        tbody.innerHTML = '';
    
        for (const member of staff) {
            try {
                
                const response = await fetch(`http://localhost:8800/api/staff-rating/${member.EmpNum}`);
                
                
                const row = document.createElement('tr');
                if (response.ok) {
                    const rating = await response.json();
                    
                    
                    row.innerHTML = `
                        <td>${member.EmpNum}</td>
                        <td>${member.Surname}</td>
                        <td>${member.Name}</td>
                        <td>${member.Address}</td>
                        <td>${member.Phone}</td>
                        <td>${member.Salary}</td>
                        <td>${member.StaffType}</td>
                        <td>${rating.Rating}</td>
                        <td><button class="view-btn" data-id="${member.EmpNum}">View</button></td>
                    `;
                } else {
                    
                    row.innerHTML = `
                        <td>${member.EmpNum}</td>
                        <td>${member.Surname}</td>
                        <td>${member.Name}</td>
                        <td>${member.Address}</td>
                        <td>${member.Phone}</td>
                        <td>${member.Salary}</td>
                        <td>${member.StaffType}</td>
                        <td>N/A</td>
                        <td><button class="view-btn" data-id="${member.EmpNum}">View</button></td>
                    `;
                }
    
                tbody.appendChild(row);
            } catch (error) {
                console.error('Error fetching Rating:', error);
            }
        }
    
        // Add event listeners to the view buttons
        document.querySelectorAll('.view-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const EmpNum = event.target.getAttribute('data-id');
                viewStaffDetails(EmpNum);
                saveButton.style.display = 'none';
                updateButton.style.display = 'block';
                deleteButton.style.display = 'block';
                cancelButton.style.display = 'block';
            });
        });
    }
    

    async function viewStaffDetails(EmpNum) {
        try {
            const response = await fetch(`http://localhost:8800/api/getstaff/${EmpNum}`);
            if (response.ok) {
                const responseR = await fetch(`http://localhost:8800/api/staff-rating/${EmpNum}`);
                if (responseR.ok) {
                    const rating = await responseR.json();
                    const staffMember = await response.json();
                    // Populate the form with staff details
                    EmpNumField.value = staffMember.EmpNum;
                    surnameField.value = staffMember.Surname;
                    nameField.value = staffMember.Name;
                    addressField.value = staffMember.Address;
                    phoneField.value = staffMember.Phone;
                    salaryField.value = staffMember.Salary;
                    staffTypeField.value = staffMember.StaffType;
                    ratingField.value = rating.Rating;
                } else {
                    const staffMember = await response.json();
                    // Populate the form with staff details
                    EmpNumField.value = staffMember.EmpNum;
                    surnameField.value = staffMember.Surname;
                    nameField.value = staffMember.Name;
                    addressField.value = staffMember.Address;
                    phoneField.value = staffMember.Phone;
                    salaryField.value = staffMember.Salary;
                    staffTypeField.value = staffMember.StaffType;
                    ratingField.value = '';
                }
            } else {
                console.error('Staff not found');
            }
        } catch (error) {
            console.error('Error fetching staff details:', error);
        }
    }
    
    saveButton.addEventListener('click', async (event) => {
        event.preventDefault();

        if (!EmpNumField.value.trim() || !surnameField.value.trim() || !nameField.value.trim() || !addressField.value.trim() || !phoneField.value.trim() || !salaryField.value.trim() || !staffTypeField.value.trim()) {
            alert('Please fill in all fields');
            return;
        }

        const newStaff = {
            EmpNum: EmpNumField.value.trim(),
            Surname: surnameField.value.trim(),
            Name: nameField.value.trim(),
            Address: addressField.value.trim(),
            Phone: phoneField.value.trim(),
            Salary: salaryField.value.trim(),
            StaffType: staffTypeField.value.trim(),
        };

        const PilotRating = {
            EmpNum: EmpNumField.value.trim(),
            Rating: ratingField.value.trim()
        };

        const rating = ratingField.value.trim();

        try {
            const response = await fetch('http://localhost:8800/api/staff', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newStaff),
            });

            if (response.ok) {
                if (rating) {
                    const responseR = await fetch('http://localhost:8800/api/staff-rating', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(PilotRating),
                });
                const createdRating = await responseR.json();
                console.log('Rating was recorded:', createdRating);
                }

                const createdStaff = await response.json();
                console.log('Staff created:', createdStaff);
                // refresh the staff table and clear the form
                EmpNumField.value = '';
                surnameField.value = '';
                nameField.value = '';
                addressField.value = '';
                phoneField.value = '';
                salaryField.value = '';
                staffTypeField.value = '';
                ratingField.value = '';
                
                alert('Staff created successfully!');
                
                searchButton.click();
            } else {
                const createdStaff = await response.json();
                console.error('Error creating staff:', createdStaff);
                alert(`Error: ${createdStaff.message}`);
            }
        } catch (error) {
            console.error('Error creating staff:', error);
            alert('Error creating staff');
        }
    });
});
