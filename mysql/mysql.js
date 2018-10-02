var mysql = require('promise-mysql');
var dbConfigs = require('./configs');

const CONSTRAINTS = {
    UNIQUE: 'UNIQUE',
    PRIMARY: 'PRIMARY',
    NUMBER: 'NUMBER',
    STRING: 'STRING',
    ISSOURCEDBY: 'ISSOURCEDBY'
};

const SORTORDER = {
    ASCEND: 'ASC',
    DESC: 'DESC'
}

const createConnection = mysql.createConnection(
    dbConfigs.configs
);

const executeGenericSelect = (queryObject = {}) => {


    let finalQuery = `SELECT ${cols} FROM ${tableName} ORDER BY ${sortColumn} ${sortOrder} where ${condition}.`;
    console.log('finalQuery', finalQuery);
    mysql.createConnection(
        dbConfigs.configs
    ).then((conn) => {
        var results = conn.query('select * from t1');
        conn.end();
        return results;
    }).then((results) => {
        console.log('inhere2', results);
        console.log(results);
    });
}

module.exports = {
    createConnection,
    CONSTRAINTS,
    executeGenericSelect,
}