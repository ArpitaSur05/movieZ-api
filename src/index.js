const cors = require("cors");
const express = require("express");

const createApplication = require("express/lib/express");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());
app.post("/movies", async (req, res) => {
  const { title, popularity, imageUrl, description } = req.body;
  const movie = await db.movie.findFirst({ where: { title } }); //returns the entire movie whose title matches
  if (movie) {
    return res
      .status(409)
      .json({ error: true, message: "movie already exist" });
  }
  const newMovie = await db.movie.create({
    data: { title, popularity, imageUrl, description },
  });
  return res.status(201).json(newMovie);
});

app.get("/movies", async (req, res) => {
  const movies = await db.movie.findMany();
  return res.status(200).json(movies);
});

app.put("/movies/:id", async (req, res) => {
  const { title, popularity, imageUrl, description } = req.body;
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: true, message: "id not found" });
  }
  const movie = await db.movie.findUnique({ where: { id } });
  if (!movie) {
    return res
      .status(404)
      .json({ error: true, message: "movie with this id does not exist" });
  }
  const updatedMovie = await db.movie.update({
    where: { id },
    data: { title, popularity, imageUrl, description },
  });
  return res.status(200).json(updatedMovie);
});

app.delete("/movies/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: true, message: "id not found" });
  }
  const movie = await db.movie.findUnique({ where: { id } });
  if (!movie) {
    return res
      .status(404)
      .json({ error: true, message: "movie with this id does not exist" });
  }
  await db.movie.delete({ where: { id } });
  return res.status(204).end();
});
// promise is used whenever there r actions which r slow and we want them to run in bg so they wont block the main process
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log("Server has started");
});
