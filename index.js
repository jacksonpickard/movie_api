const express = require("express"),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    uuid = require('uuid');

const app = express();

app.use(bodyParser.json());

let topMovies = [
    {   id: 1,
        title: 'The Shawshank Redemption',
        description: 'Andy Dufresne (Tim Robbins) is sentenced to two consecutive life terms in prison for the murders of his wife and her lover and is sentenced to a tough prison. However, only Andy knows he didnt commit the crimes. ',
        genre: 
        {
            name: 'Drama',
            description: 'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.'
        },
        director: 
        {
            name: 'Frank Darabont',
            bio: 'Frank Árpád Darabont is an American film director, screenwriter and producer. He has been nominated for three Academy Awards and a Golden Globe Award.' ,
            birthyear: '1959'
        },
        imageUrl: 'https://www.imdb.com/title/tt0111161/mediaviewer/rm1690056449/?ref_=tt_ov_i',
        year: 'September 22, 1994'
    },
    {
        id: 2,
        title: 'The Godfather',
        description: 'Widely regarded as one of the greatest films of all time, this mob drama, based on Mario Puzos novel of the same name, focuses on the powerful Italian-American crime family of Don Vito Corleone (Marlon Brando).',
        genre: 
        {
            name: 'Crime',
            description: 'Crime films, in the broadest sense, is a film genre inspired by and analogous to the crime fiction literary genre.'
        },
        director: 
        {
            name: 'Francis Ford Coppola',
            bio: 'Francis Ford Coppola is an American film director, producer, and screenwriter. He is considered one of the major figures of the New Hollywood filmmaking movement of the 1960s and 1970s.',
            birthyear: '1939'
        },
        imageUrl: 'https://www.imdb.com/title/tt0068646/mediaviewer/rm746868224/?ref_=tt_ov_i',
        year: '1972'
    },
    {
        id: 3,
        title: 'The Dark Knight',
        description: 'With the help of allies Lt. Jim Gordon (Gary Oldman) and DA Harvey Dent (Aaron Eckhart), Batman (Christian Bale) has been able to keep a tight lid on crime in Gotham City.',
        genre: 
        {
            name: 'Action',
            description: 'Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.'
        },
        director:
        {
            name: 'Christopher Nolan',
            bio: 'Christopher Edward Nolan CBE is a British-American filmmaker. Known for his Hollywood blockbusters with complex storytelling, Nolan is considered a leading filmmaker of the 21st century.',
            birthyear: '1970'
        },
        imageUrl: 'https://www.imdb.com/title/tt0468569/mediaviewer/rm4023877632/?ref_=tt_ov_i',
        year: '2008'
    },
    {
        id: 4, 
        title: 'The Godfather Part II',
        description: '',
        genre: 
        {
            name: 'Crime',
            description: 'Crime films, in the broadest sense, is a film genre inspired by and analogous to the crime fiction literary genre.'
        },
        director: 
        {
            name: 'Francis Ford Coppola',
            bio: 'Francis Ford Coppola is an American film director, producer, and screenwriter. He is considered one of the major figures of the New Hollywood filmmaking movement of the 1960s and 1970s.',
            birthyear: '1930'
        },
        imageUrl: 'https://www.imdb.com/title/tt0071562/mediaviewer/rm4159262464/?ref_=tt_ov_i',
        year: '1974'
    },
    {   id: 5,
        title: 'Schindlers List',
        description: 'Businessman Oskar Schindler (Liam Neeson) arrives in Krakow in 1939, ready to make his fortune from World War II, which has just started. After joining the Nazi party primarily for political expediency, he staffs his factory with Jewish workers for similarly pragmatic reasons.',
        genre: 
        {
            name: 'Biography',
            description: 'A biographical film or biopic is a film that dramatizes the life of a non-fictional or historically-based person or people.'
        },
        director: 
        {
            name: 'Steven Spielberg',
            bio: 'Steven Allan Spielberg KBE is an American film director, writer and producer. A major figure of the New Hollywood era and pioneer of the modern blockbuster, he is the most commercially successful director of all time.',
            birthyear: '1946'
        } ,
        imageUrl: 'https://www.imdb.com/title/tt0108052/mediaviewer/rm1610023168/?ref_=tt_ov_i',
        year: '1993'
    },
    {
        id: 6,
        title: 'The Lord of the Rings: The Return of the King',
        description: 'The Return of the King" presents the final confrontation between the forces of good and evil fighting for control of the future of Middle-earth. Hobbits Frodo and Sam reach Mordor in their quest to destroy the one ring, while Aragorn leads the forces of good against Saurons evil army at the stone city of Minas Tirith.',
        genre: 
        {
            name: 'Adventure',
            description: 'Adventure movies are a genre of movies. They contain many of the same features of action movies, but are usually set in exotic locations.'
        },
        director: 
        {
            name: 'Peter Jackson',
            bio: 'Sir Peter Robert Jackson ONZ KNZM is a New Zealand film director, screenwriter and producer. He is best known as the director, writer and producer of the Lord of the Rings trilogy and the Hobbit trilogy, both of which are adapted from the novels of the same name by J. R. R. Tolkien.',
            birthyear: '1961'
        },
        imageUrl: 'https://www.imdb.com/title/tt0167260/mediaviewer/rm584928512/?ref_=tt_ov_i',
        year: '2003'
    },
    {
        id: 7,
        title: 'Pulp Fiction',
        description: 'Vincent Vega (John Travolta) and Jules Winnfield (Samuel L. Jackson) are hitmen with a penchant for philosophical discussions. ',
        genre: 
        {
            name: 'Crime',
            description: 'Crime films, in the broadest sense, is a film genre inspired by and analogous to the crime fiction literary genre.'
        },
        director: 
        {
            name: 'Quentin Tarantino',
            bio: 'Quentin Jerome Tarantino is an American film director, writer, producer, and actor. His films are characterized by frequent references to popular culture and film genres, non-linear storylines, dark humor, stylized violence, extended dialogue, pervasive use of profanity, cameos and ensemble casts.',
            birthyear: '1963'
        },
        imageUrl: 'https://www.imdb.com/title/tt0110912/mediaviewer/rm1959546112/?ref_=tt_ov_i',
        year: '1994'
    },
    {
        id: 8,
        title: 'The Lord of the Rings: The Fellowship of the Ring',
        description: 'The future of civilization rests in the fate of the One Ring, which has been lost for centuries. Powerful forces are unrelenting in their search for it. But fate has placed it in the hands of a young Hobbit named Frodo Baggins (Elijah Wood), who inherits the Ring and steps into legend.',
        genre: 
        {
            name: 'Adventure',
            description: 'Adventure movies are a genre of movies. They contain many of the same features of action movies, but are usually set in exotic locations.'
        },
        director: 
        {
            name: 'Peter Jackson',
            bio: 'Sir Peter Robert Jackson ONZ KNZM is a New Zealand film director, screenwriter and producer. He is best known as the director, writer and producer of the Lord of the Rings trilogy and the Hobbit trilogy, both of which are adapted from the novels of the same name by J. R. R. Tolkien.',
            birthyear: '1961'
        },
        imageUrl: 'https://www.imdb.com/title/tt0120737/mediaviewer/rm3592958976/?ref_=tt_ov_i',
        year: '2001'
    },
    {
        id: 9,
        title: 'Forrest Gump',
        description: 'Slow-witted Forrest Gump (Tom Hanks) has never thought of himself as disadvantaged, and thanks to his supportive mother (Sally Field), he leads anything but a restricted life.',
        genre: 
        {
            name: 'Drama',
            description: 'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.'
        },
        director: 
        {
            name: 'Robert Zemeckis',
            bio: 'Robert Lee Zemeckis is an American filmmaker. He first came to public attention as the director of the action-adventure romantic comedy Romancing the Stone, the science-fiction comedy Back to the Future film trilogy, and the live-action/animated comedy Who Framed Roger Rabbit.',
            birthyear: '1952'
        },
        imageUrl: 'https://www.imdb.com/title/tt0109830/mediaviewer/rm1954748672/?ref_=tt_ov_i',
        year: '1994'
    },
    {
        id: 10,
        title: 'Fight Club',
        description: 'A depressed man (Edward Norton) suffering from insomnia meets a strange soap salesman named Tyler Durden (Brad Pitt) and soon finds himself living in his squalid house after his perfect apartment is destroyed.',
        genre: 
        {
            name: 'Drama',
            description: 'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.'
        },
        director: 
        {
            name: 'David Fincher',
            bio: 'David Andrew Leo Fincher is an American film director. His films, mostly psychological thrillers, have received 40 nominations at the Academy Awards, including three for him as Best Director. Born in Denver, Colorado, Fincher was interested in filmmaking at an early age.',
            birthyear: '1962'
        },
        imageUrl: 'https://www.imdb.com/title/tt0137523/mediaviewer/rm2110056193/?ref_=tt_ov_i',
        year: '1999'
    },
];

//get request to get a list of data about all movies
app.get('/movies', (req, res) => {
    Movies.find()
        .then((Movies) => {
            res.status(201).json(Movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
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