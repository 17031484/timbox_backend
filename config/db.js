const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'timbox',
    password: '12345678',
    port: 5432
});



client.connect((err, client, release) => {
    if (err)
        return console.error('Error al obtener cliente de la base de datos', err);

    console.log('Conexión exitosa a la base de datos');
    //console.log(release);
    //FALTA CERRAR LA CONEXION, ESTO NO SE HARÁ AQUÍ

});
module.exports = client;