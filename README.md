Angular Auth Weather Application
This application implements a user authentication system with registration, login, and a dashboard that displays the current time (IST & EST) and weather conditions.

Features
User Registration with validations
User Login authentication

SetUp
Install Angular 11th version (11.1.4 used in this project)
Install Node 14th version which is compatible with Angular 11 (14.20.0)
Use npm 6th version (6.14.17 used in this project)

Create project using ng new project-name
Create folders like components,modules,services to hold respective files

To create component inside components folder, use:
ng g c components/login

To generate module with lazy loading, use:
ng generate module modules/dashboard --route dashboard --module app

To create a service, use:
ng generate service services/user

To create a guard inside services folder, use:
ng generate guard services/auth

Register everything that is being used in the AppModule

Include the behaviour/functionality in respective components, guards, services,modules

Then run the application using:
ng serve
