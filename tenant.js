

const tenantForm = document.getElementById("tenantForm");

function getTenants() {
    return JSON.parse(localStorage.getItem("tenants")) || [];
}

function addTenant() {
    const name = document.getElementById("tenantName").value.trim();
    const email = document.getElementById("tenantEmail").value.trim();
    const phone = document.getElementById("tenantPhone").value.trim();
    const property = document.getElementById("tenantProperty").value.trim();
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const indexValue = document.getElementById("editTenantIndex").value;

    if (!name || !email || !phone || !property || !startDate || !endDate) {
        alert("Please fill all fields.");
        return;
    }

    if (endDate < startDate) {
        alert("Lease end date must be after the start date.");
        return;
    }

    const tenants = getTenants();

    const tenant = {
        name: name,
        email: email,
        phone: phone,
        property: property,
        startDate: startDate,
        endDate: endDate
    };

    if (indexValue !== "") {
        tenants[Number(indexValue)] = tenant;
    } else {
        tenants.push(tenant);
    }

    localStorage.setItem("tenants", JSON.stringify(tenants));

    clearTenantForm();
    displayTenants();
}

function displayTenants() {
    const tbody = document.getElementById("tenantTableBody");
    tbody.innerHTML = "";

    const tenants = getTenants();

    tenants.forEach(function(tenant, index) {
        const row = tbody.insertRow();

        row.insertCell(0).textContent = tenant.name;
        row.insertCell(1).textContent = tenant.email;
        row.insertCell(2).textContent = tenant.phone;
        row.insertCell(3).textContent = tenant.property;
        row.insertCell(4).textContent = tenant.startDate;
        row.insertCell(5).textContent = tenant.endDate;

        const actionCell = row.insertCell(6);

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.type = "button";
        editButton.onclick = function() {
            editTenant(index);
        };

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.type = "button";
        deleteButton.onclick = function() {
            deleteTenant(index);
        };

        actionCell.append(editButton, document.createTextNode(" "), deleteButton);
    });
}

function editTenant(index) {
    const tenants = getTenants();
    const tenant = tenants[index];

    if (!tenant) return;

    document.getElementById("tenantName").value = tenant.name;
    document.getElementById("tenantEmail").value = tenant.email;
    document.getElementById("tenantPhone").value = tenant.phone;
    document.getElementById("tenantProperty").value = tenant.property;
    document.getElementById("startDate").value = tenant.startDate;
    document.getElementById("endDate").value = tenant.endDate;

    document.getElementById("editTenantIndex").value = index;
    document.getElementById("formTitle").textContent = "Update Tenant";
    document.getElementById("tenantSubmit").textContent = "Update Tenant";
    document.getElementById("cancelEdit").hidden = false;

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteTenant(index) {
    if (!confirm("Are you sure you want to delete this tenant?")) return;

    const tenants = getTenants();
    tenants.splice(index, 1);

    localStorage.setItem("tenants", JSON.stringify(tenants));

    clearTenantForm();
    displayTenants();
}

function clearTenantForm() {
    tenantForm.reset();

    document.getElementById("editTenantIndex").value = "";
    document.getElementById("formTitle").textContent = "Add Tenant";
    document.getElementById("tenantSubmit").textContent = "Add Tenant";
    document.getElementById("cancelEdit").hidden = true;
}

tenantForm.addEventListener("submit", function(event) {
    event.preventDefault();
    addTenant();
});

displayTenants();
