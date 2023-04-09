
const homeModel = require('../models/home_model');

let home  = {};

home.index  = async (req ,res) => {

    res.render('home');

}

module.exports = home;