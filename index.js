require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

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

const generateId = () => {
    return Math.floor(Math.random() * 100000);
};

app.get("/api/persons", (req, res) => {
    Person.find({}).then((people) => {
        return res.status(200).json(people);
    });
});

app.get("/info", (req, res) => {
    res.send(
        `<p>Phonebook has info for ${persons.length}</p><p>${new Date()}</p>`
    );
});

app.get("/api/persons/:id", (req, res) => {
    Person.findById(req.params.id).then((person) => {
        person ? res.json(person) : res.status(404).end();
    });
});

app.delete("/api/persons/:id", (req, res) => {
    Person.deleteOne({ _id: req.params.id }).then(() => {
        res.status(204).end();
    });
});

app.post("/api/persons", (req, res) => {
    const body = req.body;
    if (!body.number || !body.name) {
        return res.status(400).json({ error: "name or number is missing" });
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    });

    person.save().then((savedPerson) => {
        return res.status(200).json(savedPerson);
    });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}...`);
});
