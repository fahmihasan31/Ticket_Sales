const seatModel = require(`../models/index`).seat
const userModel = require(`../models/index`).user
const eventModel = require(`../models/index`).event
const ticketModel = require(`../models/index`).ticket

const Op = require(`sequelize`).Op

/** create function for add new ticket */
exports.addTicket = async (request, response) => {
  /** prepare date for bookedDate */
  const today = new Date()
  const bookedDate = `${today.getFullYear()}
    ${today.getMonth() + 1}-${today.getDate()} 
    ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()
    }`
  /** prepare data from request */
  const { eventID, userID, seats } = request.body;
  try {
    // Create seat records for the chosen seats 

    const seatIDs = await Promise.all(seats.map(async seat => {
      const { rowNum, seatNum } = seat;
      const createdSeat = await seatModel.create({
        eventID,
        rowNum,
        seatNum,
        status: 'true'
      });
      return createdSeat.seatID;
    }));

    // Create ticket records associating the chosen seats 
    const tickets = await
      ticketModel.bulkCreate(seatIDs.map(seatID => ({
        eventID,
        userID,
        seatID,
        bookedDate
      })));

    response.status(201).json(tickets);
  } catch (error) {
    return response.json({
      success: false,
      message: error.message
    })
  }
}

/** create function for add new ticket */
exports.buyTicket = async (request, response) => {
  /** prepare date for bookedDate */
  const today = new Date()
  const bookedDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}
             ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`

  const { eventID, userID, seats } = request.body;

  try {
    // Check available seat for the chosen seats
    const seatIDs = await Promise.all(seats.map(async seat => {
      const { rowNum, seatNum } = seat;
      const checkedSeat = await seatModel.findOne({
        where: {
          eventID,
          rowNum,
          seatNum,
          status: 'false'
        }
      });
      if (!checkedSeat) {
        return response.json({
          success: false,
          message: "seats have been booked"
        })
      }
      else {
        return checkedSeat.seatID;
      }
    }));

    // Create ticket records associating the chosen seats
    const tickets = await ticketModel.bulkCreate(seatIDs.map(seatID => ({
      eventID,
      userID,
      seatID,
      bookedDate
    })));

    seatIDs.map(async seat => {
      seatModel.update({ status: "true" }, { where: { seatID: seat } })
    })

    response.status(201).json(tickets);
  } catch (error) {
    return response.json({
      success: false,
      message: error.message
    })
  }
}

exports.getAllTicket = async (request, response) => {
  let tickets = await ticketModel.findAll(
    {
      include: [
        { model: eventModel, attributes: ['eventName', `eventDate`, 'venue'] },
        { model: userModel, attributes: ['firstName', `lastName`] },
        { model: seatModel, attributes: ['rowNum', `seatNum`] },
      ]
    }
  )
  return response.json({
    success: true,
    data: tickets,
    messaage: `All tickets have been loaded`
  })
}

exports.findTicket = async (request, response) => {
  let ticketID = request.params.id
  let tickets = await ticketModel.findAll({
    where: {
      ticketID: { [Op.substring]: ticketID },
    }
  },
    {
      include: [
        { model: eventModel, attributes: ['eventName', `eventDate`, 'venue'] },
        { model: userModel, attributes: ['firstName', `lastName`] },
        { model: seatModel, attributes: ['rowNum', `seatNum`] },
      ]
    }
  )
  return response.json({
    success: true,
    data: tickets,
    messaage: `Tickets have been loaded`
  })
}

exports.showTicketbyUser = async (request, response) => {
  const userId = request.user.userID; // Mengambil ID pengguna dari sesi atau token, sesuaikan dengan implementasi autentikasi Anda
  try {
    const tickets = await ticketModel.findAll({
      where: {
        userId: { [Op.substring]: userId } // Mengambil tiket yang dimiliki oleh pengguna dengan ID yang sesuai
      },
      include: [
        { model: eventModel, attributes: ['eventName', 'eventDate', 'venue'] },
        { model: userModel, attributes: ['firstName', 'lastName'] },
        { model: seatModel, attributes: ['rowNum', 'seatNum'] }
      ]
    });
    return response.json({
      success: true,
      data: tickets,
      message: `User's tickets have been loaded`
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      success: false,
      message: `Failed to load user's tickets`
    });
  }
};

exports.getTicketsSoldByEvent = async (req, res) => {
  try {
    const events = await eventModel.findAll();
    console.log("testing getsold by event")
    const ticketCounts = await Promise.all(
      events.map(async (event) => {
        const { eventID } = event;
        const soldTicketsCount = await ticketModel.count({
          where: { eventID },
        });
        return {
          eventID: eventID,
          eventName: event.eventName,
          ticketsSold: soldTicketsCount,
        };
      })
    );

    return res.json({
      success: true,
      data: ticketCounts,
      message: "Tickets sold by event have been loaded",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};


exports.getTop5SellingEvents = async (req, res) => {
  try {
    const currentDate = new Date();

    const ongoingEvents = await eventModel.findAll({
      where: {
        eventDate: { [Op.gte]: currentDate },
      },
    });

    const eventWithTicketCount = await Promise.all(
      ongoingEvents.map(async (event) => {
        const ticketSoldCount = await ticketModel.count({
          where: { eventID: event.eventID }
        })

        return {
          eventID: event.eventID,
          eventName: event.eventName,
          eventDate: event.eventDate,
          venue: event.venue,
          ticketsSold: ticketSoldCount,
        }
      })
    )

    eventWithTicketCount.sort((a, b) => b.ticketsSold - a.ticketsSold);

    const top5Events = eventWithTicketCount.slice(0, 5);

    return res.json({
      success: true,
      data: top5Events,
      message: "Top 5 selling ongoing events have been loaded",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};