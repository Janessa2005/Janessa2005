// Initialize empty arrays for storing cart items and favorites.
let cart = []; // Holds the items currently added to the cart
let favourites = []; // Holds favorite items saved by the user

async function initializeApplication() { 
    // Clear local storage cart data on page load
    localStorage.removeItem("cart");
    cart = []; // Reset the cart array

    await fetchInitialData(); // Fetch initial data like favorites from an external JSON file

    updateCart(); // Ensure the cart table is empty after refreshing

    // Add event listeners to all "Add to Cart" buttons.
    document.querySelectorAll(".add-to-cart").forEach(button => {  
        button.addEventListener("click", () => {
            const movieName = button.getAttribute("data-name"); 
            const price = parseFloat(button.getAttribute("data-price")); 
            const quantity = parseInt(button.previousElementSibling.value); 
            addToCart(movieName, price, quantity); 
        });
    });

    document.getElementById("addToFavourites").addEventListener("click", addToFavourites);
    document.getElementById("applyFavourites").addEventListener("click", applyFavourites);
    document.getElementById("reset-cart").addEventListener("click", resetCart);

    if (document.querySelector("#order-table")) {
        updateCart(); // Ensure the cart table stays empty
    }
}

// Function to fetch initial data from a JSON file
async function fetchInitialData() {
    try {
        const response = await fetch("Filmique.json"); // Fetch data from the JSON file.
        if (!response.ok) { // Check for an error
            throw new Error(`HTTP error! status: ${response.status}`); // Throw error.
        }
        const data = await response.json(); // Parse the response data as JSON.

        // Load favorites data from the fetched JSON object, but NOT the cart
        favourites = data.favourites || []; // Use an empty array if 'favourites' data is unavailable
    } catch (error) {
        console.error("Error fetching initial data:", error); // Log any errors during fetching
    }
}

// Function to add item to the cart
function addToCart(movieName, price, quantity) {
    if (quantity <= 0) { // Check if the quantity selected is valid
        alert(`Please select at least 1 seat for "${movieName}".`); // Alert user to select a valid quantity
        return; // Exit the function
    }

    // Check if the item already exists in the cart
    const existingItemIndex = cart.findIndex(item => item.name === movieName);
    if (existingItemIndex !== -1) {
        // Replace the existing item’s quantity instead of adding to it
        cart[existingItemIndex].quantity = quantity;
    } else {
        cart.push({ name: movieName, price, quantity }); // Add a new item to the cart array
    }

    // Save updated cart data to localStorage.
    localStorage.setItem("cart", JSON.stringify(cart));

    updateCart(); // Refresh the cart.
    alert(`Updated quantity to ${quantity} seat(s) for "${movieName}".`); // Confirm action to the user
}

// Function to update the cart display and calculate total price
function updateCart() {
    const orderTableBody = document.querySelector("#order-table tbody"); // Get the table body for displaying cart items
    const totalPriceElement = document.getElementById("total-price"); // Get the element to display the total price

    orderTableBody.innerHTML = ""; // Clear existing items in the table body
    let totalPrice = 0; // Initialize total price to zero

    // Iterate through each item in the cart.
    cart.forEach(item => {
        const total = item.price * item.quantity; // Calculate total price for the item
        totalPrice += total; // Get the total price

        // Create a new table row.
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>$${item.price}</td>
            <td>$${total}</td>
        `; // Populate the row with item details
        orderTableBody.appendChild(row); // Append the row to the table body
    });

    // Update the displayed total price.
    totalPriceElement.textContent = `$${totalPrice}`;
}

// Function to save current cart items as favorites
function addToFavourites() {
    if (cart.length === 0) { // Check if the cart is empty
        alert("Your cart is empty! Add items before saving to favourites."); // Inform the user to add items first
        return; // Exit the function
    }
    favourites = [...cart]; // Copy the entire cart array to the favourites array
    alert("Your current cart has been saved as favourites!"); // Confirmation to the user
}

// Function to apply favorite items to the cart
function applyFavourites() {
    if (favourites.length === 0) { // Check if there are any saved favourites
        alert("No favourites available! Please save favourites first."); // Inform the user to save favorites first
        return; // Exit the function
    }
    favourites.forEach(fav => {
        // Check if the favourite item already exists in the cart
        const existingItemIndex = cart.findIndex(item => item.name === fav.name);
        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity = fav.quantity; // Replace quantity instead of adding to it
        } else {
            cart.push({ ...fav }); // Add the favourite item as a new entry in the cart
        }
    });

    // Save updated cart data to localStorage.
    localStorage.setItem("cart", JSON.stringify(cart));

    updateCart(); // Refresh the cart display
    alert("Your favourites have been added to the cart."); // Confirmation Message
}

// Function to reset the cart completely
function resetCart() {
    if (cart.length === 0) { // Check if the cart is already empty
        alert("Your cart is already empty."); // Inform the user
        return; // Exit the function
    }
    cart = []; // Clear the cart array
    localStorage.removeItem("cart"); // Remove cart data from localStorage
    updateCart(); // Refresh the cart display
    alert("Your cart has been reset."); // Confirmation Message
}

// Wait until the DOM is fully loaded, then initialize the application
document.addEventListener("DOMContentLoaded", () => {
    initializeApplication(); // Call the initialization function after the DOM is loaded
});
