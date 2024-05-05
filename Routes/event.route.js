const express = require(`express`)
const app = express()

app.use(express.json())

const eventController = require(`../Controllers/event.controller`)

app.get("/", eventController.getAllEvent)
app.get("/:key", eventController.findEvent)
app.post("/", eventController.addEvent)
app.put("/:id", eventController.updateEvent)
app.delete("/:id", eventController.deleteEvent)

module.exports = app