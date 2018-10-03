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

// const createConnection = mysql.createConnection(
//     dbConfigs.configs
// );

const executeGenericSelect = (queryObject = {}, callback) => {
    let { query, columns, table, sortColumn, sortOrder, condition, debug } = queryObject;
    if (!columns) {
        columns = '*';
    } else {
        if (typeof columns == 'object' && columns.length > 0) {
            columns = columns.join(',');
        }
    }

    if (!table && !query) {
        throw Error('mySql >> executeGenericSelect >> tablename not specified');
    }

    if (!sortColumn) {
        sortColumn = 'id';
    }

    if (!sortOrder) {
        sortOrder = SORTORDER.DESC;
    } else {
        if ((sortOrder != SORTORDER.ASCEND && sortOrder != SORTORDER.DESC) && !query) {
            console.warn(`mysql >> executeGenericSelect >> ${table}`, 'invalid sort order provided');
        }
    }

    if (!condition) {
        condition = '1';
    }

    let finalQuery = '';
    if (!!query) {
        finalQuery = query;
    } else if (!!columns && !!table && !!condition && !!sortColumn && !!sortOrder) {
        finalQuery = `SELECT ${columns} FROM ${table} where ${condition} ORDER BY ${sortColumn} ${sortOrder};`;
    } else {
        throw Error('mySql >> executeGenericInsert >> unable to create query.');
    }

    return mysql.createConnection(
        dbConfigs.configs
    ).then((conn) => {
        conn.escape(finalQuery);
        if (!!debug) {
            console.log('executeGenericSelect >> finalQuery', finalQuery);
        }
        var results = conn.query(finalQuery);
        conn.end();
        return results;
    }).then((results) => {
        let resultsJson = [];
        for (let i = 0; i < results.length; i++) {
            let resultObj = {};
            for (let keys in results[i]) {
                resultObj[keys] = results[i][keys];
            }
            resultsJson.push(resultObj);
        }
        return new Promise((resolve, reject) => {
            resolve(resultsJson);
        })
    });
};

const executeGenericInsert = (insertObj = {}) => {
    let { values, table, query } = insertObj;
    if (!table && !query) {
        throw Error('mySql >> executeGenericInsert >> tablename not specified');
    }

    if (!values || (typeof values == 'object' && Object.keys(values).length <= 0) && !query) {
        throw Error('mySql >> executeGenericInsert >> no key/values found');
    }

    return mysql.createConnection(
        dbConfigs.configs
    ).then((conn) => {
        let results = null;
        if (!!query) {
            results = conn.query(query);
        } else if (!!values || (typeof values == 'object' && Object.keys(values).length > 0)) {
            results = conn.query(`INSERT INTO ${table} SET ?`, values);
        } else {
            throw Error('mySql >> executeGenericInsert >> query cannot be created for execution');
        }
        conn.end();
        return results;
    }).then((results) => {
        return new Promise((resolve, reject) => {
            resolve(results);
        });
    }).catch((error) => {
        console.error('error in insertion', error);
    });
};

const executeGenericUpdate = (updateObj = {}) => {
    let { query, table, values, condition } = updateObj;
    if (!table && !query) {
        throw Error('mySql >> executeGenericUpdate >> table and query are missing. One should be present for the query');
    }

    if (!values || (typeof values == 'object' && Object.keys(values).length <= 0) && !query) {
        if (!query) {
            throw Error('mySql >> executeGenericUpdate >> no query and key/values found');
        } else {
            throw Error('mySql >> executeGenericInsert >> no key/values found');
        }
    }

    if (!condition) {
        condition = '1';
    }

    return mysql.createConnection(
        dbConfigs.configs
    ).then((conn) => {
        let results = null;
        if (!!query) {
            results = conn.query(query);
        } else if (!!values || (typeof values == 'object' && Object.keys(values).length > 0)) {
            results = conn.query(`UPDATE ${table} SET ? WHERE ${condition}`, values);
        } else {
            throw Error('mySql >> executeGenericUpdate >> query cannot be created for execution');
        }
        return results;
    }).then((results) => {
        return new Promise((resolve, reject) => {
            resolve(results);
        });
    }).catch((error) => {
        console.error('error in insertion', error);
    });
};

module.exports = {
    CONSTRAINTS,
    SORTORDER,
    executeGenericSelect,
    executeGenericInsert,
    executeGenericUpdate
}