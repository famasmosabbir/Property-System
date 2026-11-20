
function getStoredData(key) {
    try {
        const data = JSON.parse(localStorage.getItem(key) || "[]");
        return Array.isArray(data) ? data : [];
    } catch (error) {
        return [];
    }
}

function refreshDashboard() {
    // Load saved properties
    const properties = getStoredData("properties");

    // Calculate property counts
    const total = properties.length;

    const available = properties.filter(function(property) {
        return property.status &&
            property.status.toLowerCase() === "available";
    }).length;

    const occupied = properties.filter(function(property) {
        return property.status &&
            property.status.toLowerCase() === "occupied";
    }).length;

    // Load saved maintenance requests
    const requests = getStoredData("maintenanceRequests");

    const pending = requests.filter(function(request) {
        return request.status &&
            request.status.toLowerCase() === "pending";
    }).length;

    // Update dashboard cards
    document.getElementById("totalProperties").textContent = total;
    document.getElementById("availableProperties").textContent = available;
    document.getElementById("occupiedProperties").textContent = occupied;
    document.getElementById("pendingMaintenance").textContent = pending;

    // Display recent maintenance requests
    displayRecentMaintenance(requests);
}

function displayRecentMaintenance(requests) {
    const container = document.getElementById("recentMaintenance");
    container.innerHTML = "";

    if (requests.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No maintenance requests yet.";
        container.appendChild(message);
        return;
    }

    // Show the latest five requests first
    const recentRequests = requests.slice(-5).reverse();

    recentRequests.forEach(function(request) {
        const item = document.createElement("div");
        item.className = "recent-maintenance-item";

        const title = document.createElement("h3");
        title.textContent = request.problem || "Maintenance Request";

        const property = document.createElement("p");
        property.textContent = "Property: " + (request.property || "N/A");

        const status = document.createElement("span");
        status.className = "maintenance-status";
        status.textContent = request.status || "Pending";

        item.appendChild(title);
        item.appendChild(property);
        item.appendChild(status);

        container.appendChild(item);
    });
}

// Load data when the dashboard opens
document.addEventListener("DOMContentLoaded", function() {
    refreshDashboard();
});
