// If not in production environment, load env variables
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

const User = require('./models/user');
const ExpressError = require('./utils/ExpressError');

const userRoutes = require('./routes/users');
const benchRoutes = require('./routes/benches');
const reviewRoutes = require('./routes/reviews');

// Connect to MongoDB with mongoose
mongoose.connect(process.env.DB_URL);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// Initialize express app
const app = express();
// Set EJS as templating tool and views folder
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
// Encode form data in url
app.use(express.urlencoded({ extended: true }));
// Set up method-override to support put and delete requests
app.use(methodOverride('_method'));
// Serve static folder
app.use(express.static(path.join(__dirname, 'public')));
// Serve favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// Sanitize inputs against query selector injection attacks
app.use(mongoSanitize());

const secret = process.env.SECRET;

// Set up Mongo session store
const store = MongoStore.create({
    mongoUrl: process.env.DB_URL,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e);
});

// Set up session
const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessionConfig));
// Set up flash
app.use(flash());
// Make Moment available in all views
app.locals.moment = require('moment');

// Set up Helmet
// app.use(helmet());
const scriptSrcUrls = [
    "https://cdn.jsdelivr.net/",
    "https://maps.googleapis.com/",
    "https://cdnjs.cloudflare.com/",
];
const styleSrcUrls = [
    "https://cdn.jsdelivr.net/",
    "https://maps.googleapis.com/",
    "https://cdnjs.cloudflare.com/",
    "https://fonts.googleapis.com/"
];
const connectSrcUrls = [
    "https://maps.googleapis.com/"
];
const fontSrcUrls = [
    "https://cdn.jsdelivr.net/",
    "https://cdnjs.cloudflare.com/",
    "https://fonts.googleapis.com/",
    "https://fonts.gstatic.com/"
];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dbx3a0ync/",
                "https://images.unsplash.com/",
                "https://maps.gstatic.com/",
                "https://maps.googleapis.com/"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

// Set up Passport with local strategy
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to make variables accessible in rendered templates
app.use((req, res, next) => {
    // Default bench image
    res.locals.defaultImage = 'https://res.cloudinary.com/dbx3a0ync/image/upload/v1659867275/Benchmate/default_msyo4m.png';
    // Current authenticated user
    res.locals.currentUser = req.user;
    // Flash messages
    res.locals.messages = req.flash();
    res.locals.MapsPublicKey = process.env.MAPS_PUBLIC_API_KEY;
    next();
});

// Set up routes with express router
app.use('/', userRoutes);
app.use('/benches', benchRoutes);
app.use('/benches/:id/reviews', reviewRoutes);

// Route handler to render home page
app.get('/', (req, res) => {
    res.render('home');
});

// Catchall route to handle 404 errors with custom error class
app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
});

// Default error handler
app.use((err, req, res, next) => {
    // Set default status code and message
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something went wrong";
    // Render custom error page
    res.status(statusCode).render('error', { err });
});

// Listen for connections
app.listen(process.env.PORT, () => {
    console.log(`Serving on port ${process.env.PORT}`);
});