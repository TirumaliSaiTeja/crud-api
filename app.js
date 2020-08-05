const express = require("express");
const { string, validate } = require("joi");
const Joi = require("@hapi/joi");
const app = express();

app.use(express.json());

const customers = [
  { title: "John", id: 1 },
  { title: "Tom", id: 2 },
  { title: "Robert", id: 3 },
  { title: "Ken", id: 4 },
  { title: "Joe", id: 5 },
];

app.get("/", (req, res) => {
  res.send("Welcome to the server");
});

app.get("/api/customers", (req, res) => {
  res.send(customers);
});

app.get("/api/customers/:id", (req, res) => {
  const customer = customers.find((c) => c.id === parseInt(req.params.id));
  if (!customer) res.status(404).send("Sorry, invalid request");
  res.send(customer);
});

app.post("/api/customers", (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const customer = {
    id: customers.length + 1,
    title: req.body.title,
  };

  customers.push(customer);
  res.send(customer);
});

app.put("/api/customers/:id", (req, res) => {
  const customer = customers.find((c) => c.id === parseInt(req.params.id));
  if (!customer) res.status(404).send("Sorry, invalid request");
  const { error } = validateCustomer(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  customer.title = req.body.title;
  res.send(customer);
});

app.delete("/api/customers/:id", (req, res) => {
  const customer = customers.find((c) => c.id === parseInt(req.params.id));
  if (!customer) res.status(404).send("Sorry, invalid request");

  const index = customers.indexOf(customer);
  customers.splice(index, 1);

  res.send(customer);
});

// Validate Information

function validateCustomer(customer) {
  const schema = {
    title: Joi.string().min(3).required(),
  };

  return Joi.validate(customer, schema);
}

app.listen(3000, function () {
  console.log("Server is running at port 3000.");
});
