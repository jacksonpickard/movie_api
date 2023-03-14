const express = require("express"),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    uuid = require('uuid');

const app = express();

app.use(bodyParser.json());

let topMovies = [
    {   id: 1,
        title: 'The Shawshank Redemption',
        director: 
        {
            name: 'Frank Darabont',
            bio: 'Frank Árpád Darabont is an American film director, screenwriter and producer. He has been nominated for three Academy Awards and a Golden Globe Award.' ,
            birthyear: '1959'
        }
    },
    {
        id: 2,
        title: 'The Godfather',
        director: 
        {
            name: 'Francis Ford Coppola',
            bio: 'Francis Ford Coppola is an American film director, producer, and screenwriter. He is considered one of the major figures of the New Hollywood filmmaking movement of the 1960s and 1970s.',
            birthyear: '1939'
        }
    },
    {
        id: 3,
        title: 'The Dark Knight',
        director:
        {
            name: 'Christopher Nolan',
            bio: 'Christopher Edward Nolan CBE is a British-American filmmaker. Known for his Hollywood blockbusters with complex storytelling, Nolan is considered a leading filmmaker of the 21st century.',
            birthyear: '1970'
        }
    },
    {
        id: 4, 
        title: 'The Godfather Part II',
        director: 
        {
            name: 'Francis Ford Coppola',
            bio: 'Francis Ford Coppola is an American film director, producer, and screenwriter. He is considered one of the major figures of the New Hollywood filmmaking movement of the 1960s and 1970s.',
            birthyear: '1930'
        }
    },
    {   id: 5,
        title: 'Schindlers List',
        director: 
        {
            name: 'Steven Spielberg',
            bio: 'Steven Allan Spielberg KBE is an American film director, writer and producer. A major figure of the New Hollywood era and pioneer of the modern blockbuster, he is the most commercially successful director of all time.',
            birthyear: '1946'
        } 
    },
    {
        id: 6,
        title: 'The Lord of the Rings: The Return of the King',
        director: 
        {
            name: 'Peter Jackson',
            bio: 'Sir Peter Robert Jackson ONZ KNZM is a New Zealand film director, screenwriter and producer. He is best known as the director, writer and producer of the Lord of the Rings trilogy and the Hobbit trilogy, both of which are adapted from the novels of the same name by J. R. R. Tolkien.',
            birthyear: '1961'
        }
    },
    {
        id: 7,
        title: 'Pulp Fiction',
        director: 
        {
            name: 'Quentin Tarantino',
            bio: 'Quentin Jerome Tarantino is an American film director, writer, producer, and actor. His films are characterized by frequent references to popular culture and film genres, non-linear storylines, dark humor, stylized violence, extended dialogue, pervasive use of profanity, cameos and ensemble casts.',
            birthyear: '1963'
        }
    },
    {
        id: 8,
        title: 'The Lord of the Rings: The Fellowship of the Ring',
        director: 
        {
            name: 'Peter Jackson',
            bio: 'Sir Peter Robert Jackson ONZ KNZM is a New Zealand film director, screenwriter and producer. He is best known as the director, writer and producer of the Lord of the Rings trilogy and the Hobbit trilogy, both of which are adapted from the novels of the same name by J. R. R. Tolkien.',
            birthyear: '1961'
        }
    },
    {
        id: 9,
        title: 'Forrest Gump',
        director: 
        {
            name: 'Robert Zemeckis',
            bio: 'Robert Lee Zemeckis is an American filmmaker. He first came to public attention as the director of the action-adventure romantic comedy Romancing the Stone, the science-fiction comedy Back to the Future film trilogy, and the live-action/animated comedy Who Framed Roger Rabbit.',
            birthyear: '1952'
        }
    },
    {
        id: 10,
        title: 'Fight Club',
        director: 
        {
            name: 'David Fincher',
            bio: 'David Andrew Leo Fincher is an American film director. His films, mostly psychological thrillers, have received 40 nominations at the Academy Awards, including three for him as Best Director. Born in Denver, Colorado, Fincher was interested in filmmaking at an early age.',
            birthyear: '1962'
        }
    },
];

//get request to get a list of data about all movies
app.get('/movies', (req, res) => {
    res.json(topMovies);
});

app.get('/', (req, res) => {
    res.send('This is my practice for backend development');
});

//gets data about director
app.get('/movies/:director', (req, res) => {
    res.json(topMovies.find( (topMovies) =>
        {return topMovies.director === req.params.director }));
});

//post request that allows movies to be added to top movie array
app.post('/movies', (req, res) => {
    let newMovie = req.body;

    if (!newMovie.title) {
        const message = 'Missing "title" in request body';
        res.status(400).send(message);
    } else {
        newMovie.id = uuid.v4();
        topMovies.push(newMovie);
        res.status(201).send(newMovie);
    }
});


app.use(express.static('public'));

app.use(morgan('common'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(8080, () => console.log("listening on port 8080"))