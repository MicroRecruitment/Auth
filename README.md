# Auth

## Installation
npm install

## Running the application
The application natively runs on port 8081.
You start it by running npm start.

## Modifying the code
The code consists of multiple parts, the application is split up into different parts using MVC structure.

MQ/ - This folder contains all code for the message queue connection.
controller.js - Controller for managing the queue message requests.
-- Adding new functions for calling from the queue is done in the controller.
model.js - This is the model layer and contains all code for business logic.
integration.js - The integration file manages the database connection and the functionality associated with this service.


## [The project wiki](https://microrecruitment.github.io/)
The Auth is the microservice for authenticating users. e.g. when a user registers or logs in to the website.

app.js starts the application
