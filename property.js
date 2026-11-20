

const propertyForm = document.getElementById("propertyForm");

function getProperties() {
    return JSON.parse(localStorage.getItem("properties")) || [];
}

function addProperty() {
    const name = document.getElementById("propertyName").value.trim();
    const location = document.getElementById("location").value.trim();
    const type = document.getElementById("propertyType").value;
    const rent = document.getElementById("rent").value;
    const status = document.getElementById("status").value;

    if (!name || !location || !type || rent === "" || Number(rent) < 0 || !status) {
        alert("Please fill all fields correctly.");
        return;
    }

    const properties = getProperties();
    const indexValue = document.getElementById("editPropertyIndex").value;

    const property = { name, location, type, rent, status };

    if (indexValue !== "") {
        properties[Number(indexValue)] = property;
    } else {
        properties.push(property);
    }

    localStorage.setItem("properties", JSON.stringify(properties));

    clearPropertyForm();
    displayProperties();
    updatePropertyCount();
}

function displayProperties() {
    const tbody = document.getElementById("propertyTableBody");
    tbody.innerHTML = "";

    const properties = getProperties();

    properties.forEach(function(property, index) {
        const row = tbody.insertRow();

        row.insertCell(0).textContent = property.name;
        row.insertCell(1).textContent = property.location;
        row.insertCell(2).textContent = property.type;
        row.insertCell(3).textContent = "৳" + property.rent;
        row.insertCell(4).textContent = property.status;

        const actionCell = row.insertCell(5);

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.type = "button";
        editButton.onclick = function() {
            editProperty(index);
        };

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.type = "button";
        deleteButton.onclick = function() {
            deleteProperty(index);
        };

        actionCell.append(editButton, document.createTextNode(" "), deleteButton);
    });
}

function editProperty(index) {
    const properties = getProperties();
    const property = properties[index];

    if (!property) return;

    document.getElementById("propertyName").value = property.name;
    document.getElementById("location").value = property.location;
    document.getElementById("propertyType").value = property.type;
    document.getElementById("rent").value = property.rent;
    document.getElementById("status").value = property.status;
    document.getElementById("editPropertyIndex").value = index;

    document.getElementById("formTitle").textContent = "Update Property";
    document.getElementById("propertySubmit").textContent = "Update Property";
    document.getElementById("cancelEdit").hidden = false;

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteProperty(index) {
    if (!confirm("Are you sure you want to delete this property?")) return;

    const properties = getProperties();
    properties.splice(index, 1);

    localStorage.setItem("properties", JSON.stringify(properties));

    clearPropertyForm();
    displayProperties();
    updatePropertyCount();
}

function clearPropertyForm() {
    propertyForm.reset();

    document.getElementById("editPropertyIndex").value = "";
    document.getElementById("formTitle").textContent = "Add Property";
    document.getElementById("propertySubmit").textContent = "Add Property";
    document.getElementById("cancelEdit").hidden = true;
}

function updatePropertyCount() {
    const properties = getProperties();

    const available = properties.filter(p => p.status === "Available").length;
    const occupied = properties.filter(p => p.status === "Occupied").length;

    localStorage.setItem("totalProperties", properties.length);
    localStorage.setItem("availableProperties", available);
    localStorage.setItem("occupiedProperties", occupied);
}

propertyForm.addEventListener("submit", function(event) {
    event.preventDefault();
    addProperty();
});

displayProperties();
updatePropertyCount();
