import mysql from "mysql2";
import "dotenv/config";
import dbConfig from "./dbConfig.js";



const db = mysql.createConnection(dbConfig);

db.connect((err) => {
    if(err){
        console.log("Erro ao conectar ao banco de dados",err)
        return;
    }
    console.log("Conectado ao banco de dados")
})

export default db;