//inisiasi library
const express = require('express');
const app = express();

app.use(express.json());
const userController = require('../Controllers/user.controller');
app.get("/:key", userController.findUser);
app.get("/", userController.getAllUser);
app.post("/", userController.addUser);
app.put("/:id", userController.updateUser);
app.delete("/:id", userController.deleteUser);

module.exports = app