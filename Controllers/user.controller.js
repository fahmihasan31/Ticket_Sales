/** load model for `users` table */
const userModel = require(`../models/index`).user
const md5 = require(`md5`)
/** load Operation from Sequelize */
const Op = require(`sequelize`).Op

/** create function for read all data */
exports.getAllUser = async (request, response) => {
  /** call findAll() to get all data */
  let users = await userModel.findAll()
  return response.json({
    success: true,
    data: users,
    message: `All users have been loaded`
  })
}

/** create function for filter */
exports.findUser = async (request, response) => {
  /** define keyword to find data */
  let keyword = request.params.key
  /** call findAll() within where clause and operation
  * to find data based on keyword */
  let users = await userModel.findAll({
    where: {
      [Op.or]: [
        { userID: { [Op.substring]: keyword } },
        { firstname: { [Op.substring]: keyword } },
        { lastname: { [Op.substring]: keyword } },
        { email: { [Op.substring]: keyword } },
        { role: { [Op.substring]: keyword } }
      ]
    }
  })
  return response.json({
    success: true,
    data: users,
    message: `All Users have been loaded`
  })
}

/** create function for add new user */
exports.addUser = (request, response) => {
  let newUser = {
    firstname: request.body.firstname,
    lastname: request.body.lastname,
    email: request.body.email,
    password: md5(request.body.password),
    role: request.body.role
  }
  /** execute inserting data to user's table */
  userModel.create(newUser)
    .then(result => {
      /** if insert's process success */
      return response.json({
        success: true,
        data: result,
        message: `New user has been inserted`
      })
    })
    .catch(error => {
      /** if insert's process fail */
      return response.json({
        success: false,
        message: error.message
      })
    })
}

/** create function for update user */
exports.updateUser = (request, response) => {
  let dataUser = {
    firstname: request.body.firstname,
    lastname: request.body.lastname,
    email: request.body.email,
    role: request.body.role
  }
  if (request.body.password) {
    dataUser.password = md5(request.body.password)
  }
  /** define id user that will be update */
  let userID = request.params.id
  /** execute update data based on defined id user */
  userModel.update(dataUser, { where: { userID: userID } })
    .then(result => {
      /** if update's process success */
      return response.json({
        success: true,
        message: `Data user has been updated`
      })
    })
    .catch(error => {
      /** if update's process fail */
      return response.json({
        success: false,
        message: error.message
      })
    })
}

/** create function for delete data */
exports.deleteUser = (request, response) => {
  /** define id user that will be update */
  let userID = request.params.id
  /** execute delete data based on defined id user */
  userModel.destroy({ where: { userID: userID } })
    .then(result => {
      /** if update's process success */
      return response.json({
        success: true,
        message: `Data user has been deleted`
      })
    })
    .catch(error => {
      /** if update's process fail */
      return response.json({
        success: false,
        message: error.message
      })
    })
}

//Registrasi
exports.Registerasi = (request, response) => {
  // Check if the email alaready exists
  userModel.findOne({ where: { email: request.body.email } })
    .then(existingUser => {
      if (existingUser) {
        return response.status(400).json({
          success: false,
          message: 'Email is already registered'
        });
      } else {
        // If email is not registered, proceed with registration
        let newUser = {
          firstname: request.body.firstname,
          lastname: request.body.lastname,
          email: request.body.email,
          password: md5(request.body.password),
          role: "user"
        };

        userModel.create(newUser)
          .then(result => {
            return response.json({
              success: true,
              data: result,
              message: `Registration has been inserted`
            });
          })
          .catch(error => {
            return response.status(500).json({
              success: false,
              message: error.message
            });
          });
      }
    })
    .catch(error => {
      return response.status(500).json({
        success: false,
        message: error.message
      });
    });
};

// Reset Password
exports.resetPass = (request, response) => {
  let dataUser = {
    password: md5("11rpl8")
  }
  let userID = request.params.id

  userModel.update(dataUser, { where: { userID: userID } })
    .then(result => {
      return response.json({
        success: true,
        message: `Password has been reset : 11rpl8`
      })
    })
    .catch(error => {
      return response.json({
        success: false,
        message: error.message
      })
    })
}