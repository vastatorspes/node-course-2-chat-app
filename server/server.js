const path = require('path');
const express = require('express');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000; 
var app = express();

//middleware buat arahin static web ada di folder public
app.use(express.static(publicPath));

app.listen(port, ()=> {
    console.log('server is running on port ' + port);
});

