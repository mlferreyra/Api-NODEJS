const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'roots',
    password: 'rootpass',
    database: 'node20_mysql',
    port: 3306

});

//Route
app.get('/', (req, res)=>{
    res.send('Bienvenido a Mi API')     
});

//All customers
app.get('/allcoustomers', (req, res)=>{
   
    const sql = 'SELECT * FROM clientes';
    connection.query(sql, (error, results)=>{
        console.log("error",error)
        console.log("results",results)
        if (error) throw error;
        if (results.length > 0){
            res.json(results);
        }else{
            res.send('No hay resultados');
        }
    });   
});

app.get('/coustomers/:id', (req, res)=>{
    //res.send('Obtener Clientes por ID')

    //en params viene todos los parametros incluido el ID
    const {id} = req.params

    const sql = `SELECT * FROM clientes WHERE id = ${id}`;

    connection.query(sql, (error, result)=>{
        console.log("error",error)
        console.log("results",result)
        if (error) throw error;
        
        if (result.length > 0){
            res.json(result);
        }else{
            res.send('No hay resultados');
        }
    });   
});

app.post('/nuevocliente', (req, res)=>{
    const sql = 'INSERT INTO clientes SET ?';
    const clienteobjeto = {
        nombre: req.body.nombre,
        ciudad: req.body.ciudad
    };

    connection.query(sql, clienteobjeto, error =>{
        if (error) throw error;
        res.send('Cliente creado');
    });
});

app.put('/update/:id', (req, res)=>{
    const {id} = req.params;
    const {nombre, ciudad} = req.body;
    
    const sql = `UPDATE clientes SET nombre = '${nombre}', 
    ciudad = '${ciudad}' WHERE id = ${id}`;

    connection.query(sql, error =>{
        if (error) throw error;
        res.send('Cliente actualizado');
    });
});

app.delete('/delete/:id', (req, res)=>{
    const {id} = req.params;    
    const sql = `DELETE FROM clientes WHERE id = ${id}`;

    connection.query(sql, error =>{
        if (error) throw error;
        res.send('Cliente Eliminado!');
    });
});

//Check connect
connection.connect(error =>{
    if (error) throw error;
    console.log('Base de Datos OK')
});

app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));


//validad ID para actualizar y eliminar
// que no llegue a undefined