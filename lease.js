

const leaseForm = document.getElementById("leaseForm");

function getLeases() {
    return JSON.parse(localStorage.getItem("leases")) || [];
}

function addLease() {
    const tenant = document.getElementById("leaseTenant").value.trim();
    const property = document.getElementById("leaseProperty").value.trim();
    const rent = document.getElementById("leaseRent").value;
    const start = document.getElementById("leaseStart").value;
    const end = document.getElementById("leaseEnd").value;
    const status = document.getElementById("leaseStatus").value;
    const indexValue = document.getElementById("editLeaseIndex").value;

    if (!tenant || !property || rent === "" || !start || !end || !status) {
        alert("Please fill all fields.");
        return;
    }

    if (end < start) {
        alert("End date must be after start date.");
        return;
    }

    const leases = getLeases();

    const lease = {
        tenant: tenant,
        property: property,
        rent: rent,
        start: start,
        end: end,
        status: status
    };

    if (indexValue !== "") {
        leases[Number(indexValue)] = lease;
    } else {
        leases.push(lease);
    }

    localStorage.setItem("leases", JSON.stringify(leases));

    clearLeaseForm();
    displayLeases();
}

function displayLeases() {
    const tbody = document.getElementById("leaseTableBody");
    tbody.innerHTML = "";

    const leases = getLeases();

    leases.forEach(function(lease, index) {
        const row = tbody.insertRow();

        row.insertCell(0).textContent = lease.tenant;
        row.insertCell(1).textContent = lease.property;
        row.insertCell(2).textContent = "৳" + lease.rent;
        row.insertCell(3).textContent = lease.start;
        row.insertCell(4).textContent = lease.end;
        row.insertCell(5).textContent = lease.status;

        const actionCell = row.insertCell(6);

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.type = "button";
        editButton.onclick = function() {
            editLease(index);
        };

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.type = "button";
        deleteButton.onclick = function() {
            deleteLease(index);
        };

        actionCell.append(editButton, document.createTextNode(" "), deleteButton);
    });
}

function editLease(index) {
    const leases = getLeases();
    const lease = leases[index];

    if (!lease) return;

    document.getElementById("leaseTenant").value = lease.tenant;
    document.getElementById("leaseProperty").value = lease.property;
    document.getElementById("leaseRent").value = lease.rent;
    document.getElementById("leaseStart").value = lease.start;
    document.getElementById("leaseEnd").value = lease.end;
    document.getElementById("leaseStatus").value = lease.status;

    document.getElementById("editLeaseIndex").value = index;
    document.getElementById("formTitle").textContent = "Update Lease";
    document.getElementById("leaseSubmit").textContent = "Update Lease";
    document.getElementById("cancelEdit").hidden = false;

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteLease(index) {
    if (!confirm("Are you sure you want to delete this lease?")) return;

    const leases = getLeases();
    leases.splice(index, 1);

    localStorage.setItem("leases", JSON.stringify(leases));

    clearLeaseForm();
    displayLeases();
}

function clearLeaseForm() {
    leaseForm.reset();

    document.getElementById("editLeaseIndex").value = "";
    document.getElementById("formTitle").textContent = "Add Lease";
    document.getElementById("leaseSubmit").textContent = "Add Lease";
    document.getElementById("cancelEdit").hidden = true;
}

leaseForm.addEventListener("submit", function(event) {
    event.preventDefault();
    addLease();
});

displayLeases();
