document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.querySelector(".search-btn");
    const inputField = document.getElementById("passenger-id");
    const tableBody = document.querySelector("table tbody");

    searchButton.addEventListener("click", async () => {
        const SerNum = inputField.value.trim();

        if (SerNum === "") {
            try {
                const response = await fetch("http://localhost:8800/api/getallassigned");
                const data = await response.json();
                populateTable(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        } else {
            try {
                const response = await fetch(`http://localhost:8800/api/getassigned/${SerNum}`);
                if (response.ok){
                    const data = await response.json();
                    populateTable(data);
                } else {
                    alert("This Airplane is not Assigned to any flight OR does not exist in the database!")
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
    });

    function populateTable(data) {
        tableBody.innerHTML = ""; // Clear existing table rows

        if (Array.isArray(data)) {
            data.forEach(airplane => {
                const row = createTableRow(airplane);
                tableBody.appendChild(row);
            });
        } else if (data) {
            const row = createTableRow(data);
            tableBody.appendChild(row);
        } else {
            const row = document.createElement("tr");
            const cell = document.createElement("td");
            cell.colSpan = 8;
            cell.textContent = "No data found";
            row.appendChild(cell);
            tableBody.appendChild(row);
        }
    }

    function createTableRow(airplane) {
        const row = document.createElement("tr");

        const serialCell = document.createElement("td");
        serialCell.textContent = airplane.SerNum || "N/A";
        row.appendChild(serialCell);

        const flightNumberCell = document.createElement("td");
        flightNumberCell.textContent = airplane.FlightNum || "N/A";
        row.appendChild(flightNumberCell);

        const originCell = document.createElement("td");
        originCell.textContent = airplane.Origin || "N/A";
        row.appendChild(originCell);

        const stopsCell = document.createElement("td");
        stopsCell.textContent = airplane.Stops || "N/A";
        row.appendChild(stopsCell);

        const destinationCell = document.createElement("td");
        destinationCell.textContent = airplane.Destination || "N/A";
        row.appendChild(destinationCell);

        const dateCell = document.createElement("td");
        dateCell.textContent = airplane.Date || "N/A";
        row.appendChild(dateCell);

        const arrivalTimeCell = document.createElement("td");
        arrivalTimeCell.textContent = airplane.ArrTime || "N/A";
        row.appendChild(arrivalTimeCell);

        const departureTimeCell = document.createElement("td");
        departureTimeCell.textContent = airplane.DepTime || "N/A";
        row.appendChild(departureTimeCell);

        return row;
    }
});
