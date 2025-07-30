// Aathithyan's part is to combine and edit the code from everyone and make sure it works together
const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const flash = require('connect-flash');
const multer = require('multer');
const app = express();

// vicknesh's part to import the dealership routes
const dealershipRoutes = require('./routes/dealership');

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images'); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); 
    }
});

const upload = multer({ storage: storage });


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'RP738964$',
    database: 'ca2_dealeshipapp'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
// Ensure public/images is accessible
app.use('/images', express.static('public/images'));

app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    // Session expires after 1 week of inactivity
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 } 
}));

app.use(flash());
// vicknesh's part to use the dealership routes
app.use('/dealership', dealershipRoutes);

// Root route: redirect to car page
app.get('/', (req, res) => {
    res.redirect('/carList');
});


// Justin's part (get)
// Backend validation: No input required for login page, just render
app.get('/login', (req, res) => {
    // Note: Only renders login page, no validation needed
    res.render('login', { messages: req.flash('success'), errors: req.flash('error') });
});

// Backend validation: No input required for register page, just render
app.get('/register', (req, res) => {
    // Note: Only renders register page, no validation needed
    res.render('register', { messages: req.flash('error'), formData: req.flash('formData')[0] });
});

// Backend validation: No input required for forget-password page, just render
app.get('/forget-password', (req, res) => {
    // Note: Only renders forget-password page, no validation needed
    res.render('forget-password', {
        messages: req.flash('success'),
        errors: req.flash('error'),
        formData: { email: '' }
    });
});

// Logout route
// Backend validation: No input required, just destroy session
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

// Middleware to pass user to all EJS views (except login, register, forget-password)
// Backend validation: Checks if user is logged in for protected routes
app.use((req, res, next) => {
    const skipPaths = ['/login', '/register', '/forget-password', '/adminlogin'];
    if (!skipPaths.includes(req.path) && req.session.user) {
        res.locals.user = req.session.user;
    } else {
        res.locals.user = null;
    }
    next();
});

// Route to render the create vehicle form
// Backend validation: No input required, just fetch images
app.get('/dealership/create', (req, res) => {
    const imagesDir = 'public/images';
    let existingImages = [];
    try {
        existingImages = fs.readdirSync(imagesDir).filter(file => file.match(/\.(jpg|jpeg|png|gif)$/i));
    } catch (err) {
        existingImages = [];
    }
    res.render('create', { existingImages });
});

// Swathi's part (get)
// Route to display vehicles for deletion
// Backend validation: No input required, just fetch vehicles
app.get('/dealership/delete', (req, res) => {
    connection.query('SELECT id, vehicle_name AS name FROM dealership', (error, results) => { 
        if (error) {
            console.error("Error fetching vehicle information:", error); // Update error message
            return res.status(500).send('Error fetching vehicle information');
        } else {
            res.render('deletevehicle', { items: results }); 
        }
    });
});

// Lingesh's part (get)
// EDIT FORM 
// Backend validation: Checks session and user ID
app.get('/edit/:id', (req, res) => {
    if (!req.session.user) {
        req.flash('error', 'Please log in first.');
        return res.redirect('/login');
    }
    const id = req.params.id;
    // Only allow user to edit their own profile
    if (!id || isNaN(id)) {
        req.flash('error', 'Invalid user ID.');
        return res.redirect('/index');
    }
    if (parseInt(id) !== req.session.user.id) {
        req.flash('error', 'You can only edit your own profile.');
        return res.redirect('/index');
    }
    const sql = 'SELECT * FROM `customer_info` WHERE id = ?';
    connection.query(sql, [id], (err, results) => {
        if (err || results.length === 0) {
            console.error(err);
            req.flash('error', 'User not found.');
            return res.redirect('/index');
        }
        res.render('edit', {
            customer: results[0],
            messages: req.flash('success'),
            errors: req.flash('error')
        });
    });
});

// Aathithyan's part (get)
// GET: Edit vehicle info
// Backend validation: Checks vehicle ID
app.get('/editvehicle/:id', (req, res) => {
    const id = req.params.id;
    if (!id || isNaN(id)) {
        req.flash('error', 'Invalid vehicle ID.');
        return res.redirect('/carList');
    }
    const sql = 'SELECT * FROM dealership WHERE id = ?';
    connection.query(sql, [id], (err, results) => {
        if (err || results.length === 0) {
            console.error(err);
            req.flash('error', 'Vehicle not found.');
            return res.redirect('/carList');
        }
        res.render('editvehicle', {
            vehicle: results[0],
            messages: req.flash('success'), 
            errors: req.flash('error')
        });
    });
});

// Kiefer's part (get)
// Route to display all cars (vehicle listings) at /carList
// Backend validation: No input required, just fetch cars and images
app.get('/carList', (req, res) => {
    const imagesDir = 'public/images';
    let existingImages = [];
    try {
        const fs = require('fs');
        existingImages = fs.readdirSync(imagesDir).filter(file => file.match(/\.(jpg|jpeg|png|gif)$/i));
    } catch (err) {
        existingImages = [];
    }
    // Vicknesh part: search logic
    const searchQuery = req.query.q ? req.query.q.trim() : '';
    let sql = 'SELECT * FROM dealership';
    let params = [];
    if (searchQuery) {
        sql += ' WHERE vehicle_name LIKE ? OR description LIKE ? OR owner LIKE ?';
        params = [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`];
    }
    sql += ' ORDER BY date_of_publish DESC';
    connection.query(sql, params, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error');
        }
        res.render('carList', { cars: results, existingImages, searchQuery, user: req.session.user });
    });
});

// Justin's part (post)
app.post('/login', (req, res) => {
    let { identifier, password, role } = req.body;

    if (!identifier || !password || !role) {
        req.flash('error', 'All fields are required.');
        return res.redirect('/login');
    }

    identifier = identifier.trim();

    let sql;
    let params;

    if (role === 'user') {
        sql = 'SELECT * FROM `customer_info` WHERE email = ? AND role = "user"';
        params = [identifier];
    } else if (role === 'staff') {
        sql = 'SELECT * FROM `customer_info` WHERE (email = ? OR staffid = ?) AND role = "staff"';
        params = [identifier, identifier];
    } else if (role === 'admin') {
        sql = 'SELECT * FROM `customer_info` WHERE (email = ? OR staffid = ?) AND role = "admin"';
        params = [identifier, identifier];
    } else {
        req.flash('error', 'Invalid role selected.');
        return res.redirect('/login');
    }

    connection.query(sql, params, (err, results) => {
        if (err) {
            console.error("Error during login:", err.message);
            req.flash('error', 'An error occurred. Please try again.');
            return res.redirect('/login');
        }

        if (results.length > 0) {
            const user = results[0];
            // Plaintext password check (replace with hashed check in production)
            if (user.password === password) {
                req.session.user = user;
                req.flash('success', 'Login successful!');
                return res.redirect('/index');
            } else {
                req.flash('error', 'Invalid identifier or password.');
                return res.redirect('/login');
            }
        } else {
            req.flash('error', 'Invalid identifier or password.');
            return res.redirect('/login');
        }
    });
});

// Route to render index.ejs (home page)
app.get('/index', (req, res) => {
    if (!req.session.user) {
        req.flash('error', 'Please log in first.');
        return res.redirect('/login');
    }

    // Fetch cars from the database
    connection.query('SELECT * FROM dealership', (error, results) => {
        if (error) {
            console.error("Error fetching vehicles:", error);
            return res.status(500).send('Error fetching vehicles.');
        }
        // Pass the cars to the template
        res.render('index', { cars: results });

    const user = req.session.user; // Assuming user data is stored in session
    });
});

app.post('/register', (req, res) => {
    const { firstName, lastName, username, email, password, dob, contact, license, role, staffid } = req.body;

    // Basic validation for required fields (except staffid)
    if (!firstName || !lastName || !username || !email || !password || !dob || !contact || !license) {
        req.flash('error', 'All fields except Staff ID are required.');
        req.flash('formData', req.body);
        return res.redirect('/register');
    }

    // Require staffid for admin and staff roles
    if ((role === 'admin' || role === 'staff') && (!staffid || staffid.trim() === '')) {
        req.flash('error', 'Staff ID is required for admin and staff registration.');
        req.flash('formData', req.body);
        return res.redirect('/register');
    }

    const userRole = role || 'user';

    const sql = `INSERT INTO customer_info 
        (\`first name\`, \`last name\`, username, email, password, dob, contact, license, role, staffid) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const staffIdValue = staffid && staffid.trim() !== '' ? staffid.trim() : null;

    connection.query(sql, [firstName, lastName, username, email, password, dob, contact, license, userRole, staffIdValue], (error, results) => {
        if (error) {
            console.error("Error registering user:", error.message);
            req.flash('error', 'Registration failed. Please try again.');
            req.flash('formData', req.body);
            return res.redirect('/register');
        }
        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/login');
    });
});

app.post('/forgot-password', (req, res) => {
    const { email } = req.body;
    if (!email) {
        req.flash('error', 'Email is required.');
        return res.redirect('/forget-password');
    }

    const sql = 'SELECT * FROM `customer_info` WHERE email = ?';
    connection.query(sql, [email], (err, results) => {
        if (err) {
            console.error(err);
            req.flash('error', 'An error occurred. Please try again later.');
            return res.redirect('/forget-password');
        }

        if (results.length > 0) {
            req.flash('success', 'Password reset link sent to your email.');
            // TODO: Send reset email here
        } else {
            req.flash('error', 'Email not found.');
        }
        res.redirect('/forget-password');
    });
});

// Swathi's part (post)
// Delete vehicle from database
app.post('/delete/:id', (req, res) => {
  const idToDelete = parseInt(req.params.id);
  connection.query('DELETE FROM dealership WHERE id = ?', [idToDelete], (error, results) => {
    if (error) {
      console.error('Error deleting vehicle:', error);
      return res.render('deletevehicle', {
        items: [],
        successMessage: 'Error deleting vehicle.'
      });
    }

    res.render('deletevehicle', {
      items: [],
      successMessage: `Vehicle with ID ${idToDelete} deleted successfully!`,
      vehicleId: idToDelete
    });
  });
});


// Lingesh's part (post)
// UPDATE 
app.post('/update/:id', (req, res) => {
    if (!req.session.user) {
        req.flash('error', 'Please log in first.');
        return res.redirect('/login');
    }

    const id = req.params.id;
    const { firstName, lastName, username, email, password, dob, contact, license } = req.body;

    // Validation
    if (!firstName || !lastName || !username || !email || !password || !dob || !contact || !license) {
        req.flash('error', 'All fields are required.');
        return res.redirect(`/edit/${id}`);
    }

    const sql = `
        UPDATE \`customer info\`
        SET \`first name\` = ?, \`last name\` = ?, username = ?, email = ?, password = ?, dob = ?, contact = ?, license = ?
        WHERE id = ?
    `;

    connection.query(sql, [firstName, lastName, username, email, password, dob, contact, license, id], (err) => {
        if (err) {
            console.error("Error updating user:", err.message);
            req.flash('error', 'Update failed. Please try again.');
            return res.redirect(`/edit/${id}`);
        }
        req.flash('success', 'Profile updated successfully!');
        res.redirect('/login'); // or wherever you want to redirect after update
    });
});

// POST: Update vehicle info
app.post('/editvehicle/:id', upload.single('image'), (req, res) => {
    const id = req.params.id;
    const { vehicle_name, pricetag, description, owner, date_of_publish } = req.body;
    let image = null;
    if (req.file && req.file.filename) {
        image = req.file.filename;
    }
    // Validation
    if (!vehicle_name || !pricetag || !description || !owner || !date_of_publish) {
        req.flash('error', 'All fields are required.');
        return res.redirect(`/editvehicle/${id}`);
    }
    // Build SQL and params
    let sql, params;
    if (image) {
        sql = 'UPDATE dealership SET vehicle_name = ?, pricetag = ?, description = ?, owner = ?, date_of_publish = ?, image = ? WHERE id = ?';
        params = [vehicle_name, pricetag, description, owner, date_of_publish, image, id];
    } else {
        sql = 'UPDATE dealership SET vehicle_name = ?, pricetag = ?, description = ?, owner = ?, date_of_publish = ? WHERE id = ?';
        params = [vehicle_name, pricetag, description, owner, date_of_publish, id];
    }
    connection.query(sql, params, (err) => {
        if (err) {
            console.error('Error updating vehicle:', err);
            req.flash('error', 'Update failed. Please try again.');
            return res.redirect(`/editvehicle/${id}`);
        }
        req.flash('success', 'Vehicle updated successfully!');
        res.redirect('/carList');
    });
});

// POST route to handle vehicle creation
app.post('/dealership/create', upload.single('image'), (req, res) => {
    const { vehicle_name, pricetag, description, owner, date_of_publish, existingImage } = req.body;
    let image = null;
    if (req.file && req.file.filename) {
        image = req.file.filename;
    } else if (existingImage) {
        image = existingImage;
    }

    // Basic validation
    if (!vehicle_name || !pricetag || !description || !owner || !date_of_publish || !image) {
        req.flash('error', 'All fields are required, including an image.');
        return res.redirect('/dealership/create');
    }

    // Insert vehicle into database
    const sql = 'INSERT INTO dealership (vehicle_name, pricetag, description, owner, date_of_publish, image) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(sql, [vehicle_name, pricetag, description, owner, date_of_publish, image], (error, results) => {
        if (error) {
            console.error('Error adding vehicle:', error);
            req.flash('error', 'Failed to add vehicle. Please try again.');
            return res.redirect('/dealership/create');
        }
        req.flash('success', 'Vehicle added successfully!');
        res.redirect('/index');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}/`));