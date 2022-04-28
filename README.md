# Alpha-digital-bank

In this code pattern, we will build a dummy digital bank composed of a set of microservices that communicate with each other. 
We'll be using Node.js, Express, MongoDB and more other technologies.

## Flow

When thinking of business capabilities, our imaginary bank will need the following set of microservices:

1. *Portal:* Loads the UI and takes care of user sessions and relies on all other microservices for core functionality.
2. *Authentication:* Handles user profile creation, as well as login & logout.
3. *Accounts:* Handles creation, management, and retrieval of a user’s banking accounts.
4. *Transactions:* Handles creation and retrieval of transactions made against users' bank accounts.
5. *Bills:* Handles creation, payment, and retrieval of bills.
6. *Support:* Handles communication with Alpha Bot to enable a support chat feature.
