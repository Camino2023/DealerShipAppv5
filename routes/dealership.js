//added to handle dealership routes
const express = require('express');
const router = express.Router();

// Home page for dealership
router.get('/', (req, res) => {
   
    res.redirect('/dealership/cars');
});

// Car listing page
router.get('/cars', (req, res) => {
    // The actual DB query is handled in app.js, but you can move it here if you pass the connection
    res.render('carList', { cars: [] }); // Placeholder, actual data comes from app.js
});

// Render create vehicle form
router.get('/create', (req, res) => {
    res.render('create');
});

// Render delete vehicle page
router.get('/delete', (req, res) => {
    res.render('deletevehicle', { items: [] }); // Placeholder
});

// Add more dealership-related routes as needed

module.exports = router;
