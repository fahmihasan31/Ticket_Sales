const express = require(`express`)
const app = express()

app.use(express.json())

const eventController = require(`../Controllers/event.controller`)
const { authorize } = require(`../Controllers/auth.controller`)
const { IsUser, IsAdmin } = require(`../middlewares/role-validation`)

app.get("/", authorize, IsUser, eventController.getAllEvent)
app.get("/:key", eventController.findEvent)
app.post("/", eventController.addEvent)
app.put("/:id", eventController.updateEvent)
app.delete("/:id", eventController.deleteEvent)

module.exports = app