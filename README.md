# Alpha-digital-bank

In this code pattern, we will build a dummy digital bank composed of a set of microservices that communicate with each other. 
We'll be using Node.js, Express, MongoDB and more other technologies.

## Flow

When thinking of business capabilities, our imaginary bank will need the following set of microservices:

* *Portal:* Loads the UI and takes care of user sessions and relies on all other microservices for core functionality.
* *Authentication:* Handles user profile creation, as well as login & logout.
* *Accounts:* Handles creation, management, and retrieval of a user’s banking accounts.
* *Transactions:* Handles creation and retrieval of transactions made against users' bank accounts.
* *Bills:* Handles creation, payment, and retrieval of bills.
* *Support:* Handles communication with Alpha Bot to enable a support chat feature.
* *Anomaly Detection:* analyzes account transactions against typical transactions conducted by the account owner in real time to identify fraudulent activities and notify the account holder with alerts and persist its findings into a SIEM service.

## Run Locally

### 1. Clone the repo

Clone the `hybrid-digital-bank` repository locally. In a terminal, run:

```bash
$ git clone https://github.com/Snoiman0047/hybrid-digital-bank.git
```

### 2. Create an Instance of MongoDB

This code pattern depends on MongoDB as a session and data store. From the [MongoDB](https://account.mongodb.com/account/login).

**Get your mongo connection string. Almost all your microservices need it; keep it safe!**

### 3. Configure your environment variables

Each of the 7 microservices must have a _**.env**_ file that stores all credentials.

From the directory of each microservice and fill it with the appropriate values.

For example, from within the **/Portal** folder, navigate into the accounts folder

```bash
$ cd Portal
```

Next, create the _**.env**_ file.

Finally, edit your **.env** folder and add your Mongodb connection string

***Repeat these steps for all microservices. In addition to your mongo URL.***

### 4. Configure your environment mode

When running the app locally without Kubernetes, the microservices do not run on the NodePorts specified in our helm chart, so we need to point our portal and userbase microservices to the correct ports.

If you're running on macOS or any linux-based system, run the following in a terminal from the git repo's directory

```bash
$ export NODE_ENV=development
```

if you're running on Windows, edit the NODE_ENV attribute in your .env file from within the **/portal** folder and the **/userbase** folder to the following:

```bash
NODE_ENV=development
```

### 5. Run

Finally, navigate to each microservice folder, and start it. Make sure you run the 7 microservice in 7 separate terminals.

```bash
$ npm start
```

You can now visit `localhost:3100` to access the portal.
Enjoy it :)

