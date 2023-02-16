// run `node index.js` in the terminal

const express = require('express');
const Joi = require('joi');

const app = express();

app.use(express.json());

let PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log('Server running');
});

let genres = [
  { id: 1, name: 'fantasy' },
  { id: 2, name: 'christian fiction' },
];

const validateGenre = (genre) => {
  let schema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  return schema.validate(genre);
};

// Homepage route handler
app.get('/', (req, res) => {
  res.send('Welcome to my API');
});

// Get all genres
app.get('/api/genres', (req, res) => {
  res.send(genres);
});

// Get genre by ID
app.get('/api/genres/:id', (req, res) => {
  let genre = genres.find((g) => g.id === parseInt(req.params.id));
  if (!genre)
    return res.status(404).send('That genre does not exist on our database');
  res.send(genre);
});

// Post a Genre
app.post('/api/genres', (req, res) => {
  const { error, value } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = {
    id: genres.length + 1,
    name: value,
  };
  genres.push(genre);

  res.send(genre);
});

// Update a genre
app.put('/api/genres/:id', (req, res) => {
  let genre = genres.find((g) => g.id === parseInt(req.params.id));
  if (!genre)
    return res.status(404).send('That genre does not exist on our database');

  const { error, value } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let index = genres.indexOf(genre);
  genres[index] = { ...genre, ...value };

  res.send(genres[index]);
});

// delete a genre

app.delete('/api/genres/:id', (req, res) => {
  let genre = genres.find((g) => g.id === parseInt(req.params.id));
  if (!genre)
    return res.status(404).send('That genre does not exist on our database');

  let index = genres.indexOf(genre);
  genres.slice(index, 1);

  res.send(genre);
});
