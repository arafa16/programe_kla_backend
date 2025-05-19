const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');
const fileUpload = require('express-fileupload')
const sequelizeStore = require('connect-session-sequelize');
const db = require('./models/index.js');
const authRoute = require('./routes/auth.route.js');
const menuRoute = require('./routes/menu.route.js');
const companyRoute = require('./routes/company.route.js');
const userRoute = require('./routes/user.route.js');

dotenv.config();

const app = express();

const sessionStore = sequelizeStore(session.Store);

const store = new sessionStore({
    db:db.sequelize
});

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store:store,
    cookie: {
        secure: 'auto',
        expires: 1000 * 60 * 60 * process.env.SESS_EXPIRES
    }
}))

app.use(cors({
    credentials: true,
    origin: [process.env.LINK_FRONTEND]
}));

app.use(express.json());
app.use(fileUpload());

//setup public folder
app.use(express.static('public'));
app.use('/auth', authRoute); // User authentication routes
app.use('/menu', menuRoute); // Menu routes
app.use('/company', companyRoute); // Company routes
app.use('/user', userRoute); // User management routes

app.listen(process.env.BACKEND_PORT, ()=>{
    console.log(`server running at port ${process.env.BACKEND_PORT}`);
});