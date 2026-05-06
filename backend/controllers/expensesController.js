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
