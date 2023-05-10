
const homeModel = require('../models/home_model');

let home  = {};

home.index  = async (req ,res) => {

    res.render('home');

}


home.videoPlyer  = async (req ,res) => {

    res.render('video_player');

}

module.exports = home;