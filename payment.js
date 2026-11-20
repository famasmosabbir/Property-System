
const paymentForm = document.getElementById("paymentForm");

// Get saved payment records
function getPayments() {
    return JSON.parse(localStorage.getItem("payments") || "[]");
}

// Add a new payment or update an existing one
function addPayment() {
    const tenant = document.getElementById("paymentTenant").value.trim();
    const property = document.getElementById("paymentProperty").value.trim();
    const amount = document.getElementById("paymentAmount").value;
    const date = document.getElementById("paymentDate").value;
    const status = document.getElementById("paymentStatus").value;
    const indexValue = document.getElementById("editPaymentIndex").value;

    if (!tenant || !property || amount === "" || !date || !status) {
        alert("Please fill in all fields.");
        return;
    }

    if (Number(amount) <= 0) {
        alert("Payment amount must be greater than zero.");
        return;
    }

    const payments = getPayments();

    if (indexValue !== "") {
        const index = Number(indexValue);

        if (!payments[index]) {
            alert("Payment record not found.");
            return;
        }

        payments[index] = {
            ...payments[index],
            tenant,
            property,
            amount,
            date,
            status
        };

        alert("Payment updated successfully!");
    } else {
        payments.push({
            id: Date.now(),
            tenant,
            property,
            amount,
            date,
            status
        });

        alert("Payment added successfully!");
    }

    localStorage.setItem("payments", JSON.stringify(payments));

    clearPaymentForm();
    displayPayments();
}

// Display payment records in the table
function displayPayments() {
    const tbody = document.getElementById("paymentTableBody");
    tbody.innerHTML = "";

    const payments = getPayments();

    payments.forEach(function(payment, index) {
        const row = tbody.insertRow();

        // Six cells to match the six HTML table headings
        row.insertCell(0).textContent = payment.tenant;
        row.insertCell(1).textContent = payment.property;
        row.insertCell(2).textContent =
            "৳" + Number(payment.amount).toLocaleString("en-BD");
        row.insertCell(3).textContent = payment.date;
        row.insertCell(4).textContent = payment.status;

        const actionCell = row.insertCell(5);

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.type = "button";
        editButton.onclick = function() {
            editPayment(index);
        };

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.type = "button";
        deleteButton.onclick = function() {
            deletePayment(index);
        };

        actionCell.append(
            editButton,
            document.createTextNode(" "),
            deleteButton
        );
    });
}

// Load a payment record into the form
function editPayment(index) {
    const payments = getPayments();
    const payment = payments[index];

    if (!payment) return;

    document.getElementById("paymentTenant").value = payment.tenant;
    document.getElementById("paymentProperty").value = payment.property;
    document.getElementById("paymentAmount").value = payment.amount;
    document.getElementById("paymentDate").value = payment.date;
    document.getElementById("paymentStatus").value = payment.status;

    document.getElementById("editPaymentIndex").value = index;
    document.getElementById("formTitle").textContent = "Update Payment";
    document.getElementById("paymentSubmit").textContent = "Update Payment";
    document.getElementById("cancelEdit").hidden = false;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// Delete a payment record
function deletePayment(index) {
    if (!confirm("Are you sure you want to delete this payment?")) {
        return;
    }

    const payments = getPayments();
    payments.splice(index, 1);

    localStorage.setItem("payments", JSON.stringify(payments));

    clearPaymentForm();
    displayPayments();

    alert("Payment deleted successfully!");
}

// Reset the form
function clearPaymentForm() {
    paymentForm.reset();

    document.getElementById("editPaymentIndex").value = "";
    document.getElementById("formTitle").textContent = "Record New Payment";
    document.getElementById("paymentSubmit").textContent = "Add Payment";
    document.getElementById("cancelEdit").hidden = true;
}

// Handle form submission
paymentForm.addEventListener("submit", function(event) {
    event.preventDefault();
    addPayment();
});

// Display saved payments when the page opens
displayPayments();
