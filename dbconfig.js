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

 module.exports = dbconfig