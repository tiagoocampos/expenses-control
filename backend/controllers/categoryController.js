import db from "../database/db.js";


export function createCategory(req, res) {
    const { id, name } = req.body;
    const sql = "INSERT INTO categories (id, name) VALUES (?, ?)";
    db.query(sql, [id, name], (err) => {
        if(err){
            console.log(err);
            return res.status(500).json({ message: "Erro interno do servidor"});
        }
        return res.status(201).json({ message: "Categoria adicionada com sucesso!"});
    });
}