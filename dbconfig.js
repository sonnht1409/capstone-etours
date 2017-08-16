"use strict"
/* for local */
/*
const connection = ({
    user: 'sa',
    password: 'Anhphuong11',
    server: 'localhost',
    driver: 'tedious',
    database: 'etours',
    port: '67854',
    dialectOptions: {
        "instanceName": "SQLEXPRESS"
    },
    options: {
        encrypt: true
    }

})
*/
/* for azure */
const connection = ({
    user: 'etours',
    password: "$Son01627335534",
    server: "etours3.database.windows.net",
    driver: 'tedious',
    database: 'etours',
    options: {
        encrypt: true
    }
})

class DatabaseConfig {
    get option() {
        return connection;
    }
}




module.exports = DatabaseConfig;