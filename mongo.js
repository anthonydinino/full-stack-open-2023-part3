const e = require("express");
const mongoose = require("mongoose");

const connect = () => {
    const password = process.argv[2];
    const url = `mongodb+srv://adinino:${password}@cluster0.cj7s1ht.mongodb.net/phonebookApp?retryWrites=true&w=majority`;
    mongoose.set("strictQuery", false);
    mongoose.connect(url);
};

const createNumberModel = () => {
    const numberSchema = new mongoose.Schema({
        name: String,
        number: String,
    });
    return mongoose.model("Person", numberSchema);
};

if (process.argv.length === 3) {
    connect();
    createNumberModel()
        .find({})
        .then((numbers) => {
            numbers.forEach((number) => {
                console.log(number);
                mongoose.connection.close();
            });
        });
} else if (process.argv.length === 5) {
    connect();
    const Number = createNumberModel();
    const number = new Number({
        name: process.argv[3],
        number: process.argv[4],
    });
    number.save().then((result) => {
        console.log("number saved!");
        mongoose.connection.close();
    });
} else {
    console.log("usage [password] or [name] [number]");
    process.exit(1);
}
