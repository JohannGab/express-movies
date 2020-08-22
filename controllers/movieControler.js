const Movie = require('../models/Movie');


exports.getMovies = (req, res) => {
    console.log('depuis movieController.getMovies');

    const title = 'Films français des trente dernières années'
    
    frenchMovies = [];
    Movie.find((err, movies) => {
        if(err) {
            console.error('could not retrieve movies from DB');
            res.sendStatus(500);
        } else {
            frenchMovies = movies;
            res.render('movies', { movies: frenchMovies, title: title })
        }
    })
}


exports.postMovie = (req, res) => {
    console.log('depuis movieController.postMovie');
    
    if(!req.body) {
        return res.sendStatus(500);
    } else {
        const title = req.body.movietitle;
        const year = req.body.movieyear
        const myMovie = new Movie({ movietitle: title, movieyear: year });
        myMovie.save((err, savedMovie) => {
            if(err) {
                console.log(err);
            return;
            } else {
                console.log(savedMovie);
                res.sendStatus(201);
            }
        })
    }
}

exports.getMoviesOldBrowsers = (req, res) => {
    if (!req.body) {
        return res.sendStatus(500);
    } else {    
        frenchMovies = [... frenchMovies, { title: req.body.movietitle, year: req.body.movieyear }];
        res.sendStatus(201);
    } 
};

exports.getMoviesAdd = (req, res) => {
    res.send('prochainement, un formulaire d\'ajout ici');
};

exports.getMovieById = (req, res) => {
    const id = req.params.id
    res.render('movie-details', { movieid: id });
};

exports.postMovieDetails = (req, res) => {
    console.log('movietitle: ', req.body.movietitle, 'movieyear: ', req.body.movieyear);
    if (!req.body) {
        return res.sendStatus(500);
    }
    const id = req.params.id;
    Movie.findByIdAndUpdate(id, { $set : {movietitle: req.body.movietitle, movieyear: req.body.movieyear}}, 
                                { new: true }, (err, movie) => {
        if(err) {
            console.error(err);
            return res.send('le film n\'a pas pu être mis à jour');
        }
        res.redirect('/movies');
    });
};

exports.getMovieDetails = (req, res) => {
    const id = req.params.id;
    Movie.findById(id, (err, movie) => {
        res.render('movie-details', { movie: movie })
    })
};

exports.deleteMovie = (req, res) => {
    const id = req.params.id;
    Movie.findByIdAndRemove(id, (err, movie) => {
        res.sendStatus(202)
    });
};

exports.movieSearch = (req, res) => {
    res.render('movie-search');
};