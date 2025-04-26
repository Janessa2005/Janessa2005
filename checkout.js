// Wait for the DOM to be fully loaded before executing code
document.addEventListener("DOMContentLoaded", () => {
    // Retrieve cart data from localStorage, or initialize as an empty array if no data exists in the local storage.
    const cartData = JSON.parse(localStorage.getItem("cart")) || [];

    
    const checkoutTableBody = document.querySelector("#checkout-table tbody"); // update content of the checkout table body
    const checkoutTotalPriceElement = document.querySelector("#checkout-total-price");  //Get the total price.

    // Select elements to display booking confirmation details
    const confirmMovieName = document.querySelector("#confirm-movie-name");
    const confirmMovieTime = document.querySelector("#confirm-movie-time");
    const confirmNumberOfSeats = document.querySelector("#confirm-number-of-seats");
    const confirmReference = document.querySelector("#confirm-reference");

    // Function to populate the checkout table with cart data
    function populateCheckoutTable() {
        checkoutTableBody.innerHTML = ""; // Clear existing rows from the table
        let totalPrice = 0; // Initialize total price as 0

        // Loop through each item in the cart data to create table rows
        cartData.forEach(item => {
        const row = document.createElement("tr"); // Create a new table row

            const nameCell = document.createElement("td"); // Create and populate the "name" cell
            nameCell.textContent = item.name; 
            row.appendChild(nameCell); // Add the "name" cell to the row

            const quantityCell = document.createElement("td"); // Create and populate the "quantity" cell
            quantityCell.textContent = item.quantity; 
            row.appendChild(quantityCell); // Add the "quantity" cell to the row

            const priceCell = document.createElement("td"); // Create and populate the "price" cell
            priceCell.textContent = `$.${item.price}`; 
            row.appendChild(priceCell); // Add the "price" cell to the row

            const totalCell = document.createElement("td"); // Create and populate the "total" cell
            const itemTotal = item.price * item.quantity; // Calculate total price for the item
            totalCell.textContent = `$.${itemTotal}`;
            row.appendChild(totalCell); // Add the "total" cell to the row

            checkoutTableBody.appendChild(row); // Append the completed row to the table

            // Get the total price for all items in the cart.
            totalPrice += itemTotal;
        });

        // Display the calculated total price.
        checkoutTotalPriceElement.textContent = `$.${totalPrice}`;
    }

    // Call the function to display the checkout table content and total price
    populateCheckoutTable();

    // Add an event listener for the "Pay Now" button.
    document.querySelector("#pay-now").addEventListener("click", () => {
        // Collect user input data from the form fields
        const buyerName = document.querySelector("#buyer-name").value; // Retrieve buyer name
        const buyerEmail = document.querySelector("#buyer-email").value; // Retrieve buyer email
        const seatPreferences = document.querySelector("#seat-preferences").value; // Retrieve seat preferences
        const paymentMethod = document.querySelector("#payment-method").value; // Retrieve payment method

        // Check whether all the fields are filled. 
        if (!buyerName || !buyerEmail || !seatPreferences || !paymentMethod) {
            alert("Please fill out all required fields!"); //Alert for the user.
            return; // Exit the function if validation fails
        }

        // Generate a unique booking reference number using random string logic
        const referenceNumber = `FC-${Math.random().toString(36).slice(2, 11).toUpperCase()}`;


        // Create booking details.
        const movieNames = cartData.map(item => item.name).join(", "); // Combine all movie names in the cart
        const movieTime = "7:00 PM"; // Set a movie time.
        const numberOfSeats = cartData.reduce((total, item) => total + item.quantity, 0); // Calculate total number of seats

        // Populate the confirmation message.
        confirmMovieName.textContent = movieNames || "No movies selected"; // Display movie names or fallback message
        confirmMovieTime.textContent = movieTime; // Display the movie time
        confirmNumberOfSeats.textContent = numberOfSeats || "0"; // Display total seats or 0
        confirmReference.textContent = referenceNumber; // Display the generated reference number

        // Make the confirmation message visible to the user
        document.querySelector("#confirmation-message").style.display = "block";

        alert(`Payment successful! Reference Number: ${referenceNumber}`);
        localStorage.removeItem("cart"); // Remove cart data from localStorage
        localStorage.removeItem("totalPrice"); // Remove total price from localStorage
    });
});
