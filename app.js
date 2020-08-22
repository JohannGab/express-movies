const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();

var expressJwt = require('express-jwt');


// const faker = require('faker');
// faker.locale = "fr";

const config = require('./config');
const movieController = require('./controllers/movieControler');
const authController = require('./controllers/authController');

const mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose.connect(`mongodb+srv://${config.db.user}:${config.db.password}@expressmovie.scuwy.mongodb.net/${config.db.database}?retryWrites=true&w=majority`,
{   useNewUrlParser: true,
    useUnifiedTopology: true, 
    useFindAndModify: false
}) 
//ou
// .then(() => console.log('Connexion à MongoDB réussie !'))
// .catch(() => console.log('Connexion à MongoDB échouée !'));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connexion à MongoDB échouée !'))
db.once('open', () => {
    console.log('Connexion à MongoDB réussie !');
})

// //////FAKE DATA ///////////////////////////
// const title = faker.lorem.sentence(3);
// const year = Math.floor(Math.random() * 80) + 1950;
// const myMovie = new Movie({ movietitle: title, movieyear: year});
// myMovie.save((err, savedMovie) => {
//     if(err) {
//         console.log(err);
//     } else {
//         console.log('savedMovie', savedMovie);
//     }
// })

const PORT = 3000;

app.set('views', './views');
app.set('view engine', 'ejs');

app.use('/public', express.static('public'));

app.use(expressJwt({ secret: config.db.secret, algorithms: ['HS256']}).unless({ path: ['/', '/movies', new RegExp('/movies.*/', 'i'), '/movie-search','/login', new RegExp('/movie-details.*/', 'i')]}));

app.get('/', (req, res) => {
    // res.send('Hello World !!!!!');
    res.render('index');
});

app.get('/movies', movieController.getMovies);
    
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.post('/movies', upload.fields([]), movieController.postMovie);

app.post('/movies-old-browser', urlencodedParser, movieController.getMoviesOldBrowsers);

app.get('/movies/add', movieController.getMoviesAdd)

app.get('/movies/:id', movieController.getMovieById)

app.get('/movie-details/:id', movieController.getMovieDetails)

app.post('/movie-details/:id', urlencodedParser, movieController.postMovieDetails);

app.delete('/movie-details/:id', movieController.deleteMovie);

app.get('/movie-search', movieController.movieSearch)

app.get('/login', authController.login);

app.post('/login', urlencodedParser, authController.postLogin);

app.get('/member-only', authController.getMemberOnly);

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})