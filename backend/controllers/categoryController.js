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

export function getCategories(req, res) {
    const sql = "SELECT * FROM categories";
    db.query(sql, (err, results) =>{
        if(err){
            console.log(err)
            return res.status(500).json({ message: "Erro ao buscar categorias"});
        }
        return res.status(200).json(results);
    })
}

export function deleteCategory(req, res){
    const { id } = req.params;
    const sql = "DELETE FROM categories WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if(err){
            console.log(err)
            return res.status(500).json({ message: "Erro ao deletar categoria"});
        }
        if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }
        return res.status(200).json({ message: "Categoria deletada com sucesso"});
    })
}
