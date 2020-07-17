const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();

const PORT = 3000;
let frenchMovies = [];

app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.set('views', './views');
app.set('view engine', 'ejs');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.get('/movies', (req, res) => {
    
    const title = 'Films français des trente dernières années'

    frenchMovies = [
        { title: 'Le fabuleux destin d\'Amélie Poulain', year: 2001 },
        { title: 'Buffet froid', year: 1979 },
        { title: 'Le diner de cons', year: 1998 },
        { title: 'De rouille et d\'os', year: 2012 },
    ]
    res.render('movies', { movies: frenchMovies, title: title })
});

// app.post('/movies', (req, res) => {
//     console.log('le titre : ', req.body.movietitle);
//     console.log('année : ', req.body.movieyear);
//     const newMovies = { title : req.body.movietitle, year: req.body.movieyear };
//     frenchMovies = [...frenchMovies, newMovies];
//     console.log(frenchMovies);
//     res.sendStatus(201);
// })

app.post('/movies', upload.fields([]), (req, res) => {
    if(!req.body) {
        return res.sendStatus(500);
    } else {
        const formData = req.body;
        console.log('formData: ', formData);
        const newMovies = { title : req.body.movietitle, year: req.body.movieyear };
        frenchMovies = [...frenchMovies, newMovies];
        res.sendStatus(201);
    }
})

app.get('/movies/add', (req, res) => {
    res.send('Prochainement, un formulaire d\'ajout ici');
})

app.get('/movies/:id', (req, res) => {
    const id = req.params.id
    // res.send(`Film numéro ${id}`);
    res.render('movie-details', { movieid: id });
})

// app.get('/movie-details', (req, res) => {
//     res.render('movie-details')
// })

app.get('/', (req, res) => {
    // res.send('Hello World !!!!!');
    res.render('index');
});

app.get('/movie-search', (req, res) => {
    res.render('movie-search');
})

app.get('/login', (req, res) => {
    res.render('login', { title: 'Connexion'});
});

const fakeUser = { email: 'testuser@testmail.fr', password: 'qsd' };

app.post('/login', urlencodedParser, (req, res) => {
    console.log('login post', req.body);
    if (!req.body) {
        return res.sendStatus(500);
    } else {        
        if(fakeUser.email === req.body.email && fakeUser.password === req.body.password) {
            res.json({ 
                        email: 'testuser@testmail.fr', 
                        favoriteMovie: 'Il etait une fois dans l\'Ouest',
                        favoriteMovieTheater: 'Ciné Gaumont, 29 Rue Alain Chartier, 75015 Paris', 
                        lastLoginDate: new Date() 
                    });
        } else {
            res.sendStatus(401);
        } 
    } 
});

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})