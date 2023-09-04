if (process.env.NODE_ENV !== "production") { //if we are in development mode, require dotenv package ,
    ////////////////////////////////// which is going to take the variables defined in this file and add them into process
    require('dotenv').config();
}




const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utilities/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user')
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelp-camp'
const secret = process.env.SECRET || 'thisshouldbeabettersecret!'

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

const MongoStore = require('connect-mongo');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log('mongo connection open')
    })
    .catch(err => {
        console.log('mongo conn Error')
        console.log(err)
    })

const app = express();

app.use(express.urlencoded({ extended: true })); //this is a middleware that parses the body of the request
app.use(methodOverride('_method'));
app.use(mongoSanitize({ //this is a middleware that will prevent mongo injection
    replaceWith: '_'
}))
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = []; //we are not using any fonts
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
                "https://res.cloudinary.com/dlx9ufwpz/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.engine('ejs', ejsMate); //there are many engines used to run ejs, we are telling express that we are using ejs - mate
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: secret
    }
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    store: store,
    name: 'sessionlol',
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, //this means that the cookie cannot be accessed by javascript
        // secure: true, //this means that the cookie will only be sent over https, which is only true if we are in production
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7 //this is in millisecond
    }
}
app.use(session(sessionConfig))


app.use(passport.initialize());
app.use(passport.session()); //MAKE SURE THIS IS AFTER SESSION

passport.use(new LocalStrategy(User.authenticate())); //the authenticate method comes from passportLocalMongoose
passport.serializeUser(User.serializeUser()); //store the user in the session
passport.deserializeUser(User.deserializeUser()); //unstore the user in the session

app.use(flash());
app.use((req, res, next) => { //this is a middleware that will run for every single request
    //we have access to these on every single template
    res.locals.currentUser = req.user; //this is the user that is logged in
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.get('/fakeUser', async (req, res) => {
    const user = new User({ email: 'andra@gmail.com', username: 'andra' });
    const registeredUser = await User.register(user, 'chicken'); //this is a method that comes from passportLocalMongoose
    /////////////////////////////////it will take the password and hash it and store it in the database
    res.send(registeredUser);
})

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use(express.static(path.join(__dirname, 'public'))); //this is like using absolute path instead of relative path (better)

app.get('/', (req, res) => {
    res.render('home.ejs')
});

app.all('*', (req, res, next) => { //this will only run if nothing else has matched before it
    next(new ExpressError('Page Not Found', 404))
});

app.use((err, req, res, next) => { //this is the generic error handler
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh no smth went wrong!'
    res.status(statusCode).render('error', { err });
    // res.send('Oh no smth went wrong!')
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));


