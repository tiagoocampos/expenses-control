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

export function deleteCategory(req, res) {
    const { id } = req.params;

   
    const deleteExpensesSql = "DELETE FROM expenses WHERE category_id = ?";
    db.query(deleteExpensesSql, [id], (err, deleteExpensesResult) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Erro ao deletar gastos da categoria" });
        }

       
        const deleteCategorySql = "DELETE FROM categories WHERE id = ?";
        db.query(deleteCategorySql, [id], (err2, deleteCategoryResult) => {
            if (err2) {
                console.log(err2);
                return res.status(500).json({ message: "Erro ao deletar categoria" });
            }

            if (deleteCategoryResult.affectedRows === 0) {
                return res.status(404).json({ message: "Categoria não encontrada" });
            }

            return res.status(200).json({
                message: "Categoria e gastos deletados com sucesso",
                deletedExpenses: deleteExpensesResult?.affectedRows ?? 0,
            });
        });
    });
}

