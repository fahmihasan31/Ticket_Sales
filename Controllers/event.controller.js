const eventModel = require(`../models/index`).event
const Op = require(`sequelize`).Op
const path = require(`path`)
const fs = require(`fs`)


exports.getAllEvent = async (request, response) => {
  let events = await eventModel.findAll()
  return response.json({
    success: true,
    data: events,
    message: `All Events have been loaded`
  })
}


exports.findEvent = async (request, response) => {
  let keyword = request.params.key
  let events = await eventModel.findAll({
    where: {
      [Op.or]: [
        { eventName: { [Op.substring]: keyword } },
        { eventDate: { [Op.substring]: keyword } },
        { venue: { [Op.substring]: keyword } },
        { price: { [Op.substring]: keyword } }
      ]
    }
  })
  return response.json({
    success: true,
    data: events,
    message: `All Events have been loaded`
  })
}

const upload = require(`./upload-image`).single(`image`)

exports.addEvent = (request, response) => {
  upload(request, response, async error => {
    if (error) {
      return response.json({ message: error })
    }
    if (!request.file) {
      return response.json({ message: `Nothing to Upload` })
    }

    let newEvent = {
      eventName: request.body.eventName,
      eventDate: request.body.eventDate,
      venue: request.body.venue,
      price: request.body.price,
      image: request.file.filename
    }

    eventModel.create(newEvent)
      .then(result => {
        return response.json({
          success: true,
          data: result,
          message: `New event has been inserted`
        })
      })
      .catch(error => {
        return response.json({
          success: false,
          message: error.message
        })
      })
  })
}


exports.updateEvent = async (request, response) => {
  upload(request, response, async error => {
    if (error) {
      return response.json({ message: error })
    }

    let eventID = request.params.id
    let dataEvent = {
      eventName: request.body.eventName,
      eventDate: request.body.eventDate,
      venue: request.body.venue,
      price: request.body.price
    }

    if (request.file) {
      const selectedEvent = await eventModel.findOne({
        where: { eventID: eventID }
      })

      const oldImage = selectedEvent.image
      const pathImage = path.join(__dirname, `../image`, oldImage)
      if (fs.existsSync(pathImage)) {
        fs.unlink(pathImage, error => console.log(error))
      }
      dataEvent.image = request.file.filename
    }

    eventModel.update(dataEvent, { where: { eventID: eventID } })
      .then(result => {
        return response.json({
          success: true,
          message: `Data event has been updated`
        })
      })
      .catch(error => {
        return response.json({
          success: false,
          message: error.message
        })
      })
  })
}


exports.deleteEvent = async (request, response) => {
  const eventID = request.params.id
  const event = await eventModel.findOne({ where: { eventID: eventID } })
  const oldImage = event.image
  const pathImage = path.join(__dirname, `../image`, oldImage)

  if (fs.existsSync(pathImage)) {
    fs.unlink(pathImage, error => console.log(error))
  }
  eventModel.destroy({ where: { eventID: eventID } })
    .then(result => {
      return response.json({
        success: true,
        message: `Data event has been deleted`
      })
    })
    .catch(error => {
      return response.json({
        success: false,
        message: error.message
      })
    })
}