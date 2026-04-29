import db from "../database/db.js";

export function createExpense(req, res) {
    const { category_id, title, amount, date } = req.body;
    const user_id = 1;
   
      const [dia, mes, ano] = date.split('/');
    const dataFormatada = `${ano}-${mes}-${dia}`;

    const sql = 'INSERT INTO expenses (user_id, category_id, title, amount, date) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [user_id, category_id, title, amount, dataFormatada], (err) => {
    if (err) {
        console.log(err);
        return res.status(500).json({ message: "Erro ao salvar gasto" });
    }

    return res.status(201).json({ message: "Gasto salvo com sucesso" });
});
}

