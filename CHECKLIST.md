# Check list for doing anything

## Creating new model

- `src/models/name.models.js` Create model -> avoid setting unique field, do it in validation middleware
- `src/controllers/name.controllers.js` Create controllers
- `src/routes/name.routes.js` Create routes
- Apply controllers to routes
- `src/validations/nameValidations.js` Create validations -> all unique data set here
- Apply validations to routes
- `src/app.js` Apply the routes in the index file

## Create validations

- new data validation
- get single data validation -> check exist data and invalid ID
- update data validation -> all fields optional
- delete many validation -> check invalid IDs and array length

## Permissions

- check current user id with the author id
- check the
