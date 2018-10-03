var app = require('express')();
var bodyParser = require('body-parser');
const mySqlConnection = require('./mysql/mysql');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var server = app.listen(3003, function() {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port);
    // mySqlConnection.executeGenericSelect({
    //     table: 't1',
    //     sortColumn: '_col1',
    //     debug: true,
    //     sortOrder: mySqlConnection.SORTORDER.DESC
    // }).then((results) => { console.log(results); });

    // mySqlConnection.executeGenericInsert({
    //     table: 't1',
    //     values: {
    //         _col1: '31',
    //         _col2: '32',
    //         _col3: '33'
    //     }
    // }).then((results) => { console.log(results); });
    mySqlConnection.executeGenericUpdate({
        table: 't1',
        values: {
            _col1: '-1'
        },
        condition: '`id`=3'
    }).then((results) => {
        console.log('update', results);
    });
})

app.get('/', (req, res) => {
    res.send('ok');
}, (message) => {
    console.log(message);
});