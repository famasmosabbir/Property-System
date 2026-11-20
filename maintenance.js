


const maintenanceForm = document.getElementById("maintenanceForm");

// Get all maintenance requests from localStorage
function getMaintenanceRequests() {
    return JSON.parse(
        localStorage.getItem("maintenanceRequests") || "[]"
    );
}

// Save requests and update pending count
function saveMaintenanceRequests(requests) {
    localStorage.setItem(
        "maintenanceRequests",
        JSON.stringify(requests)
    );

    const pendingCount = requests.filter(
        request => request.status === "Pending"
    ).length;

    localStorage.setItem(
        "pendingMaintenance",
        pendingCount
    );
}

// Add a new request or update an existing request
function addMaintenanceRequest() {
    const property = document
        .getElementById("maintenanceProperty").value.trim();

    const problem = document
        .getElementById("problemType").value;

    const description = document
        .getElementById("description").value.trim();

    const priority = document
        .getElementById("priority").value;

    const status = document
        .getElementById("maintenanceStatus").value;

    const indexValue = document
        .getElementById("editMaintenanceIndex").value;

    if (!property || !problem || !description || !priority || !status) {
        alert("Please fill in all fields.");
        return;
    }

    const requests = getMaintenanceRequests();

    if (indexValue !== "") {
        const index = Number(indexValue);

        if (!requests[index]) {
            alert("Maintenance request not found.");
            return;
        }

        requests[index] = {
            ...requests[index],
            property,
            problem,
            description,
            priority,
            status
        };

        alert("Maintenance request updated successfully!");
    } else {
        requests.push({
            id: Date.now(),
            property,
            problem,
            description,
            priority,
            status
        });

        alert("Maintenance request added successfully!");
    }

    saveMaintenanceRequests(requests);
    clearMaintenanceForm();
    displayMaintenanceRequests();
}

// Display all requests in the table
function displayMaintenanceRequests() {
    const tbody = document.getElementById("maintenanceTableBody");
    tbody.innerHTML = "";

    const requests = getMaintenanceRequests();

    requests.forEach(function(request, index) {
        const row = tbody.insertRow();

        // Six cells to match the six HTML table headings
        row.insertCell(0).textContent = request.property;
        row.insertCell(1).textContent = request.problem;
        row.insertCell(2).textContent = request.description;
        row.insertCell(3).textContent = request.priority;
        row.insertCell(4).textContent = request.status;

        const actionCell = row.insertCell(5);

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.type = "button";
        editButton.onclick = function() {
            editMaintenanceRequest(index);
        };

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.type = "button";
        deleteButton.onclick = function() {
            deleteMaintenanceRequest(index);
        };

        actionCell.append(
            editButton,
            document.createTextNode(" "),
            deleteButton
        );
    });
}

// Load request information into the form for editing
function editMaintenanceRequest(index) {
    const requests = getMaintenanceRequests();
    const request = requests[index];

    if (!request) return;

    document.getElementById("maintenanceProperty").value =
        request.property;

    document.getElementById("problemType").value =
        request.problem;

    document.getElementById("description").value =
        request.description;

    document.getElementById("priority").value =
        request.priority;

    document.getElementById("maintenanceStatus").value =
        request.status;

    document.getElementById("editMaintenanceIndex").value = index;

    document.getElementById("formTitle").textContent =
        "Update Maintenance Request";

    document.getElementById("maintenanceSubmit").textContent =
        "Update Request";

    document.getElementById("cancelEdit").hidden = false;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// Delete a request after confirmation
function deleteMaintenanceRequest(index) {
    const confirmed = confirm(
        "Are you sure you want to delete this maintenance request?"
    );

    if (!confirmed) return;

    const requests = getMaintenanceRequests();
    requests.splice(index, 1);

    saveMaintenanceRequests(requests);
    clearMaintenanceForm();
    displayMaintenanceRequests();

    alert("Maintenance request deleted successfully!");
}

// Reset the form
function clearMaintenanceForm() {
    maintenanceForm.reset();

    document.getElementById("editMaintenanceIndex").value = "";

    document.getElementById("formTitle").textContent =
        "Create Maintenance Request";

    document.getElementById("maintenanceSubmit").textContent =
        "Add Request";

    document.getElementById("cancelEdit").hidden = true;
}

// Handle form submission
maintenanceForm.addEventListener("submit", function(event) {
    event.preventDefault();
    addMaintenanceRequest();
});

// Show saved requests when the page opens
displayMaintenanceRequests();

// Refresh the pending count using saved data
saveMaintenanceRequests(getMaintenanceRequests());
