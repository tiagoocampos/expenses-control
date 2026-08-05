import db from "../database/db.js";

export function createExpense(req, res) {
    const { category_id, title, amount, date } = req.body;
    const user_id = 1;

      const [dia, mes, ano] = date.split('/');
    const dataFormatada = `${ano}-${mes}-${dia}`;

    const sql = 'INSERT INTO expenses (user_id, category_id, title, amount, date) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [user_id, category_id, title, amount, date], (err) => {

    if (err) {
        console.log(err);
        return res.status(500).json({ message: "Erro ao salvar gasto" });
    }

    return res.status(201).json({ message: "Gasto salvo com sucesso" });
});
}

export function getExpense(req, res) {
    const sql = `
        SELECT 
            e.id,
            e.title,
            e.amount,
            e.date,
            c.name AS category_name
        FROM expenses e
        JOIN categories c ON e.category_id = c.id
    `
    db.query(sql, (err, results) => {
        if(err){
            console.log(err);
            return res.status(500).json({ message: "Erro ao buscar gastos"})
        }
        return res.status(200).json(results);
    })
}

export function getTotalExpenses(req , res) {
    const user_id = 1;

    const sql = `
    SELECT COALESCE(SUM(amount), 0) AS total
    FROM expenses
    WHERE user_id = ?
    
    `

    db.query(sql, [user_id], (err, results) => {
        if(err){
            console.log(err);
            return res.status(500).json({ message: "Erro ao calcular total de gastos"})
        }

        const total = results?.[0]?.total ?? 0;
        return res.status(200).json({ total })
    })

}

export function getExpensesByCategory(req, res) {
    const user_id = 1;

    const sql = `
        SELECT
        c.id AS category_id,
        c.name AS category_name,
        e.id,
        e.title,
        e.amount,
        e.date
        FROM expenses e
        JOIN categories c ON e.category_id = c.id
        WHERE e.user_id = ?
        ORDER BY c.name
    `

    db.query(sql, [user_id], (err, results) =>{
        if(err){
            console.log(err)
            return res.status(500).json({ message: "Erro ao buscar gastos por categoria"})
        }

        const grouped = new Map();

        for (const row of results){
            const categoryKey = row.category_id;
            if(!grouped.has(categoryKey)) {
                grouped.set(categoryKey, {
                    category_id: row.category_id,
                    category_name: row.category_name,
                    total: 0,
                    expenses: []
                })
            }
            
            const category = grouped.get(categoryKey);

            category.expenses.push({
                id: row.id,
                title: row.title,
                amount: row.amount,
                date: row.date
            });

            category.total += Number(row.amount) || 0;
        }
        return res.status(200).json(Array.from(grouped.values()))
    })
}

export function deleteExpense(req, res){
  const { id } = req.params;
  const sql = "DELETE FROM expenses WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Erro ao deletar gasto" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Gasto não encontrado" });
    }

    return res.status(200).json({ message: "Gasto deletado com sucesso" });
  });
}

export function updateExpense(req, res){
    const { id } = req.params;
    const { category_id, title, amount, date } = req.body;
    const sql = "UPDATE expenses SET category_id=?, title=?, amount=?, date=? WHERE id=?";

    db.query(sql, [category_id, title, amount, date, id], (err, result)=>{
        if(err){
            console.log(err)
            return res.status(500).json({ message: "Erro ao atualizar gasto"});
        }

        if(result.affectedRows === 0){
            return res.status(404).json({ message: "Gasto não encontrado "});
        }

        return res.status(200).json({ message: "Gasto atualizado com sucesso"});
    } )
}
