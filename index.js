const express = require('express');
const app = express();
const cors = require('cors')
const port = 3000;


app.use(cors())
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


//auth
const auth = require(`./Routes/auth.route`)
app.use(`/login`, auth)

//user
const userRoute = require('./Routes/user.route');
app.use('/user', userRoute);

//event
const eventRoute = require('./Routes/event.route');
app.use('/event', eventRoute);

/** route to access uploaded file */
app.use(express.static(__dirname))

//seat
const seatRoute = require(`./Routes/seat.route`)
app.use(`/seat`, seatRoute)

//tiket
const ticketRoute = require('./Routes/ticket.route');
app.use('/ticket', ticketRoute);




app.listen(port, () => console.log(`Server of ticket sales started on port ${port}`))