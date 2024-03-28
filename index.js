const express = require('express');
const app = express();
const cors = require('cors')
const port = 3000;

const userRoute = require('./Routes/user.routes');
app.use(cors())
app.use('/user', userRoute)
app.listen(port, () => console.log(`Server of ticket sales started on port ${port}`))