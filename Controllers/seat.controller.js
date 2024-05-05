const seatModel = require(`../models/index`).seat
const Op = require(`sequelize`).Op

exports.getAllSeat = async (request, response) => {
  let seats = await seatModel.findAll()
  return response.json({
    success: true,
    data: seats,
    message: `All Seats have been loaded`
  })
}

exports.findSeat = async (request, response) => {
  let keyword = request.params.key
  let seats = await seatModel.findAll({
    where: {
      [Op.or]: [
        { rowNum: { [Op.substring]: keyword } },
        { seatNum: { [Op.substring]: keyword } },
        { status: { [Op.substring]: keyword } }
      ]
    }
  })
  return response.json({
    success: true,
    data: seats,
    message: `All Seats have been loaded`
  })
}

exports.addSeat = (request, response) => {

  let newSeat = {
    rowNum: request.body.rowNum,
    seatNum: request.body.seatNum,
    status: request.body.status,
    eventID: request.body.eventID
  }

  seatModel.create(newSeat)
    .then(result => {
      return response.json({
        success: true,
        data: result,
        message: `New seat has been inserted`
      })
    })
    .catch(error => {
      return response.json({
        success: false,
        message: error.message
      })
    })
}
exports.updateSeat = (request, response) => {
  let dataSeat = {
    eventID: request.body.eventID,
    rowNum: request.body.rowNum,
    seatNum: request.body.seatNum,
    status: request.body.status
  }

  let seatID = request.params.id

  seatModel.update(dataSeat, { where: { seatID: seatID } })
    .then(result => {
      return response.json({
        success: true,
        message: `Seat has been updated`
      })
    })
    .catch(eror => {
      return response.json({
        success: false,
        message: error.message
      })
    })
}

exports.deleteSeat = (request, response) => {
  let seatID = request.params.id

  seatModel.destroy({
    where: {
      seatID: seatID
    }
  })
    .then(result => {
      return response.json({
        success: true,
        message: `Event has been deleted`
      })
    })
    .catch(error => {
      return response.json({
        success: false,
        message: message.error
      })
    })
}