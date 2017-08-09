 const connection = ({
     user: 'etours',
     password: "$Son01627335534",
     server: "etours2.database.windows.net",
     driver: 'tedious',
     database: 'etours',
     options: {
         encrypt: true
     }
 })

 module.exports = dbconfig;