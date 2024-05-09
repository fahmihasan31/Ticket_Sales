//inisiasi library
const express = require('express');
const app = express();
app.use(express.json());
const { midOne } = require('../middlewares/simple_middleware');
const { validateUser } = require(`../middlewares/user.validation`)
const { authorize } = require(`../Controllers/auth.controller`)
const { IsUser, IsAdmin } = require(`../middlewares/role-validation`)
const userController = require('../Controllers/user.controller');

// app.get("/", [midOne], userController.getAllUser)
app.get("/", [midOne], authorize, IsAdmin, userController.getAllUser)
app.get("/:key", authorize, IsAdmin, userController.findUser)
app.post("/", validateUser, userController.addUser)
app.put("/:id", validateUser, userController.updateUser)
app.delete("/:id", userController.deleteUser)
app.put("/reset/:id", userController.resetPass)
app.post("/registrasi", validateUser, userController.Registerasi)

module.exports = app