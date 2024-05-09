const express = require(`express`)
const app = express()
app.use(express.json())
const ticketController = require(`../Controllers/ticket.controller`)
const { authorize } = require("../Controllers/auth.controller")
const { IsUser, IsAdmin } = require("../middlewares/role-validation")

app.post("/", ticketController.addTicket)
app.post("/buy", ticketController.buyTicket)
app.get("/", ticketController.getAllTicket)
app.get("/find/:id", ticketController.findTicket)
app.get("/showTicketUser", authorize, IsUser, ticketController.showTicketbyUser)
app.get("/getTicketbyEvent", ticketController.getTicketsSoldByEvent)
app.get("/top5Event", ticketController.getTop5SellingEvents)


module.exports = app