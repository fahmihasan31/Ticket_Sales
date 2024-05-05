const userModel = require(`../models/index`).user
const md5 = require(`md5`)
const jwt = require('jsonwebtoken');
const secret = 'your_secret_key_here'; // Ganti dengan secret yang benar


const authenticate = async (request, response) => {
  let dataLogin = {
    email: request.body.email,
    password: md5(request.body.password)
  }
  let dataUser = await userModel.findOne({
    where: dataLogin
  })
  if (dataUser) {
    let payload = JSON.stringify(dataUser)
    console.log(payload)
    let token = jwt.sign(payload, secret)
    return response.json({
      success: true,
      logged: true,
      message: `Authentication Success`,
      token: token,
      data: dataUser
    })
  }

  return response.json({
    success: false,
    logged: false,
    message: `Authentication Failed. Invalid username or password`
  })
}
const authorize = (request, response, next) => {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    return response.status(401).json({
      success: false,
      auth: false,
      message: 'Authorization header is missing'
    });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return response.status(401).json({
      success: false,
      auth: false,
      message: 'Token is missing'
    });
  }

  try {
    const verifiedUser = jwt.verify(token, secret);
    if (!verifiedUser) {
      return response.status(401).json({
        success: false,
        auth: false,
        message: 'Invalid token'
      });
    }

    request.user = verifiedUser;
    next();
  } catch (error) {
    return response.status(401).json({
      success: false,
      auth: false,
      message: 'Failed to authenticate token'
    });
  }
}
module.exports = { authenticate, authorize }