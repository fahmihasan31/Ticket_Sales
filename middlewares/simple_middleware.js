const midOne = async (request, response, next) => {
  console.log('Run Middleware One')
  next()
}
module.exports = { midOne }