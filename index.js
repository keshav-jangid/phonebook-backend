const express = require("express");
const app = express();
const morgan = require("morgan");

const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

const persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});
app.get("/info", (request, response) => {
  response.send(
    `the phonebook has info for ${persons.length} people <br/> ${Date()}`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).send({ error: "not found" });
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);

  console.log(`deleted contact with id ${id}`);

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const maxid = persons.length;

  const newperson = request.body;
  newperson.id = String(maxid + 1);

  if (
    persons.some(
      (persons) =>
        persons.name === newperson.name && persons.number === newperson.number
    )
  ) {
    response.status(400).send({ error: "name must be unique" });
  } else if (!newperson.name || !newperson.number) {
    return response.status(400).send({ error: "name and number are required" });
  } else {
    persons.push(newperson);
    console.log(newperson);
    response.json(newperson);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`the server is runnig on port number ${PORT}`);
});
