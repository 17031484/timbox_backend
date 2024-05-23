const app = require("./app");
const db = require("./config/db");
const bcrypt = require('bcrypt');

const port = 3000;

app.listen(port, () => {
    console.log(`Server listening on port http://localhost:${port}`);
});

app.get('/', async (req, res) => {
    res.send('Hola mundo!');
});

app.post('/registerUser', async (req, res) => {
    console.log('registerUser');
    const { username, email, pass, rfc } = req.body;

    try {
        //CIFRANDO CONTRASEÑA
        const hashedPassword = await hashPassword(pass);
        const result = await db.query(`INSERT INTO users(username, email, pass, rfc) VALUES ($1, $2, $3, $4) 
        RETURNING *`, [username, email, hashedPassword, rfc]);
        res.status(201).send('Usuario registrado con éxito');
    }
    catch (error) {
        console.log('Error en registerUser ' + error);
        res.status(500).json({ error: 'Internal server error ' + error });
    }
});

app.post('/login', async (req, res) => {
    console.log('login');
    const { email, pass } = req.body;

    try {
        //COMPROBAMOS QUE EL USUARIO EXISTE
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length > 0) {
            const user = result.rows[0];
            const match = await bcrypt.compare(pass, user.pass); // Comparar contraseñas encriptadas

            if (match) {
                res.status(200).json({ message: 'Autenticación exitosa', user });
            } else {
                res.status(401).json({ error: 'Contraseña incorrecta' });
            }
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    }
    catch (error) {
        console.log('Error en login ' + error);
        res.status(500).json({ error: 'Internal server error ' + error });
    }
});




//CIFRAR CONTRASEÑA
const saltRounds = 10;

// Función para cifrar la contraseña
async function hashPassword(plainPassword) {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(plainPassword, salt);
        return hashedPassword;
    } catch (err) {
        console.error('Error al cifrar la contraseña:', err);
        throw err;
    }
}

app.post('/uploadFile', async (req, res) => {
    console.log('uploadFile');
    const { nombre, extension, fecha } = req.body;

    try {
        const result = await db.query(`INSERT INTO files(nombre, extension, fecha) VALUES ($1, $2, $3) 
        RETURNING *`, [nombre, extension, fecha]);
        res.status(200).send('Datos del archivo registrados con éxito');
    }
    catch (error) {
        console.log('Error en uploadFile ' + error);
        res.status(500).json({ error: 'Internal server error ' + error });
    }
});

app.get('/getFiles', async (req, res) => {
    console.log('getFiles');
    const { email, pass } = req.body;

    try {
        const result = await db.query('SELECT * FROM files');
        res.status(200).json({ message: 'Registros:', result });

    }
    catch (error) {
        console.log('Error en getFiles ' + error);
        res.status(500).json({ error: 'Internal server error ' + error });
    }
});

app.post('/addColaborator', async (req, res) => {
    console.log('addColaborator');
    const { nombre, correo, rfc, domfiscal, curp, nss, fechainicio, tipocontrato, depto, puesto, salariodiario, salario, clventidad, estado } = req.body;

    try {
        const result = await db.query(`INSERT INTO colaborator(name, correo, rfc, domfiscal, curp, nss, fechainicio, tipocontrato, depto, puesto, salariodia, salario, clventidad, estado) 
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) 
        RETURNING *`, [nombre, correo, rfc, domfiscal, curp, nss, fechainicio, tipocontrato, depto, puesto, salariodiario, salario, clventidad, estado]);
        res.status(200).send('Datos registrados con éxito');
    }
    catch (error) {
        console.log('Error en addColaborator ' + error);
        res.status(500).json({ error: 'Internal server error ' + error });
    }
});

app.get('/getColaborators', async (req, res) => {
    console.log('getColaborators');
    try {
        const result = await db.query('SELECT * FROM colaborator');
        res.status(200).json({ message: 'Colaborators:', result });

    }
    catch (error) {
        console.log('Error en getColaborators ' + error);
        res.status(500).json({ error: 'Internal server error ' + error });
    }
});

app.delete('/deleteColaborator', async (req, res) => {
    console.log('deleteColaborator');
    const {id_colaborator}=req.body;
    try {
        const result = await db.query('DELETE FROM colaborator WHERE id_colaborator = $1', [id_colaborator] );
        res.status(200).send('Datos eliminados con éxito');

    }
    catch (error) {
        console.log('Error en deleteColaborator ' + error);
        res.status(500).json({ error: 'Internal server error ' + error });
    }
});

app.post('/addUser', async (req, res) => {
    console.log('addUser');
    const { username, email, pass, rfc} = req.body;

    try {
        const result = await db.query(`INSERT INTO users(username, email, pass, rfc) 
        VALUES ($1,$2,$3,$4) 
        RETURNING *`, [username, email, pass, rfc]);
        res.status(201).send('Usuario registrado con éxito');
    }
    catch (error) {
        console.log('Error en addUser ' + error);
        res.status(500).json({ error: 'Internal server error ' + error });
    }
});