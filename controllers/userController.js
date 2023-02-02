const User = require('../models/User');

const getUsers = async (req, res, next) => {
  try{
    //query parameter
    const filter= {};
    const options = {};

    //check if the req query is empty?
    if(Object.keys(req.query).length){
        const {
            sortByFirstName,
            limit
        } = req.query

        //set up our pagination
        if(limit) options.limit = limit

        if(sortByFirstName) options.sort = {
            firstName: sortByFirstName === 'asc' ? 1 : -1 
        }
    }


      const result = await User.find({}, {}, options);

      res
      .status(200)
      .setHeader('Content-Type', 'application/json')
      .json(result)
  } catch(error){
      throw new Error(`Error getting all users: ${error.message}`)
  }
}

const createUser = async (req, res, next) => {
    try {
        const user = await User.create(req.body)
        const token = getSignedJwtToken()

        const options = {
            expires: new Date(Date.now()+ process.env.JWT_COOKIE_EXPIRE * 1000 * 60)
        }

        res
        .status(200)
        .setHeader('Content-Type', 'application/json')
        .cookie('token', token, options)
        .json({ success: true, token, user})
    } catch (error) {
        throw new Error(`Error creating a users: ${error.message}`)
    }
}

// const deleteUsers = async (req, res, next) => {
  
// }

// const getUsers = async (req, res, next) => {
  
// }

module.exports = {
  getUsers,
  createUser
}