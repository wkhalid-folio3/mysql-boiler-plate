var app = require('express')();
var bodyParser = require('body-parser');
const mySqlConnection = require('./mysql/mysql');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var server = app.listen(3003, function() {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port);
    mySqlConnection.executeGenericSelect('ac');
})

app.get('/', (req, res) => {
    res.send('ok');
}, (message) => {
    console.log(message);
});