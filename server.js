const express = require('express'),
http          = require('http'),
ejs           = require('ejs'),
path          = require('path'),
app           = express(),
router		  = require('./application/routes/index'),
port          = '8910';

global.app = app;

app.use(express.static(__dirname +''));
app.set('views',path.join(__dirname, 'application/views'));
app.set('view engine', 'ejs');

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});


router.init(app);