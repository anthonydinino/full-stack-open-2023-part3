const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

morgan.token("reqbody", (req, res) => {
    return JSON.stringify(req.body);
});

app.use(
    morgan(
        ":method :url :status :res[content-length] - :response-time ms :reqbody"
    )
);

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456",
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523",
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345",
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        number: "39-23-6423122",
    },
];

const generateId = () => {
    return Math.floor(Math.random() * 100000);
};

app.get("/api/persons", (req, res) => {
    res.json(persons);
});

app.get("/info", (req, res) => {
    res.send(
        `<p>Phonebook has info for ${persons.length}</p><p>${new Date()}</p>`
    );
});

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find((p) => id === p.id);
    person ? res.json(person) : res.status(404).end();
});

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter((p) => p.id !== id);
    return res.status(204).end();
});

app.post("/api/persons", (req, res) => {
    const person = req.body;
    if (!person.number || !person.name) {
        return res.status(400).json({ error: "name or number is missing" });
    }
    if (persons.find((p) => p.name === person.name)) {
        return res.status(400).json({ error: "name must be unique" });
    }
    const newPerson = {
        id: generateId(),
        name: person.name,
        number: person.number,
    };
    persons = persons.concat(newPerson);
    res.status(200).json(newPerson);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}...`);
});
