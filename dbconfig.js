/* for local */
const connection = ({
    user: 'admin',
    password: 'evil001',
    server: 'localhost',
    driver: 'tedious',
    database: 'etours',
    port: '61762',
    dialectOptions: {
        "instanceName": "SQLEXPRESS"
    },
    options: {
        encrypt: true
    }

})

/* for azure 
 const connection = ({
     user: 'etours',
     password: "$Son01627335534",
     server: "etours2.database.windows.net",
     driver: 'tedious',
     database: 'etours',
     options: {
         encrypt: true
     }
 })*/



module.exports = dbconfig