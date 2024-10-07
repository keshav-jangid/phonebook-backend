const express = require("express");
const app = express();
const Person = require("./models/persons");
const cors = require("cors");
require("dotenv").config();
app.use(cors());
app.use(express.json());
app.use(express.static("dist"));
app.get("/api/persons", (request, response) => {
  Person.find({}).then((result) => {
    response.json(result);
    console.log(result);
  });
});
app.get("/api/persons/info", (request, response) => {
  response.set("Content-Type", "text/html");
  response.send(
    `the phonebook has info for ${Person.length} people <br/> ${Date()}`
  );
});

app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;

  Person.findById(id)
    .then((person) => {
      if (person) {
        console.log(person);
        response.json(person);
      } else {
        response.status(404).send({ error: "not found" }).end();
      }
    })
    .catch((error) => next(error));
  // .catch((err) => {
  //   console.error(err);
  //   response.status(400).send({ error: "malformatted ID" });
  // });
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;

  Person.findByIdAndDelete(id)
    .then((person) => {
      if (person) {
        response.json(person);
        console.log(`deleted contact with id ${id}`);
        response.status(204).end();
      } else {
        response.status(404).send("contact does not exists");
        console.log("contact does not exists");
      }
    })
    .catch((err) => {
      console.log(`error deleting contact with id ${id}`, err);
    });
});

app.put("/api/persons/:_id", (request, response, next) => {
  const id = request.params._id;
  const updatedperson = request.body;

  Person.findByIdAndUpdate(id, { number: updatedperson.number })
    .then((updatedperson) => {
      if (updatedperson) {
        response.json(updatedperson);
        console.log(`updated contact with id ${id}`);
      } else {
        response.status(404).send({ error: "contact not found" });
      }
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const newperson = request.body;
  const person = new Person(newperson);

  if (newperson === undefined) {
    return response.status(400).json({ error: "content missing" });
  }

  Person.findOne({
    name: newperson.name,
    number: newperson.number,
  })

    .then((existingPerson) => {
      if (existingPerson) {
        return response.status(400).json({ error: "person already exists" });
      } else {
        return person.save();
      }
    })
    .then((savedPerson) => {
      response.status(201).json(savedPerson);
      console.log(person);
      console.log(`persons saved`);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`the server is runnig on port number ${PORT}`);
});
