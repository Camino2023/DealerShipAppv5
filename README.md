Vehicle Dealership App
A web application that manages vehicle listings with a complete authentication system for users, staff, and admins. Supports CRUD operations on vehicles with image uploads, role-based access control, and search functionality.

Features
1. User, staff, and admin registration with role differentiation
2. Session-based login system
3. Staff/Admin roles require a Staff ID for access
4. Add, edit, delete, and view vehicle listings with images
5. Search vehicles by name, description, or owner
6. Support for image uploads (via multer)
7. Flash messages for user feedback
8. Role-based route protection
9. Basic validation and middleware

Tech Stack
1. Backend: Node.js, Express.js
2. Frontend: EJS templating
3. Database: MySQL (mysql2)
4. Middleware: express-session, connect-flash, multer


Project Structure

├── app.js                   # Main application file
├── routes/
│   └── dealership.js        # Vehicle-related routes
├── views/                   # EJS templates
│   ├── carList.ejs
│   ├── create.ejs
│   ├── deletevehicle.ejs
│   ├── edit.ejs
│   ├── editvehicle.ejs
│   ├── forget-password.ejs
│   ├── index.ejs
│   ├── login.ejs
│   ├── navbar.ejs
│   └── register.ejs
├── public/
│   └── images/              # Uploaded vehicle images


file.io
const connection = mysql.createConnection({
    port:61002,
    host: 'ffjb66.h.filess.io',
    user: 'DealerShip_areacorngo',
    password: '3ff74d2b5bcb76948d37561a4a2524581ee09c6b',
    database: 'DealerShip_areacorngo'
});
