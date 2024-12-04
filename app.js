const express= require('express')
const app=express();
app.use(express.json())
const cron=require('node-cron')
const port=3000;

let expenses=[]
const categories=['travel','food','other']

app.post('/expenses', (req, res) => {
    const { category, amount, date } = req.body;
    if (!category || !categories.includes(category) || !amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ status: 'error', error: 'Invalid data provided.' });
    }
    const expenseDate = date ? new Date(date) : new Date();
    if (isNaN(expenseDate.getTime())) {
        return res.status(400).json({ status: 'error', error: 'Invalid date format.' });
    }
    expenses.push({ category, amount: Number(amount), date: expenseDate.toISOString() });
    res.status(201).json({ status: 'success', message: 'Expense added successfully.' });
});
app.get('/getexpenses', (req, res) => {
    const { category } = req.query;
    let filteredExpenses = expenses;

    if (category) {
        if (!categories.includes(category)) {
            return res.status(400).json({ status: 'error', error: 'Invalid category.' });
        }
        filteredExpenses = filteredExpenses.filter(e => e.category === category);
    }

    res.status(200).json({ status: 'success', data: filteredExpenses });
});

app.get('/expenses/analysis', (req, res) => {
    const analysis = expenses.reduce((acc, { category, amount }) => {
        acc[category] = (acc[category] || 0) + amount;
        return acc;
    },{});
    res.json({ status: 'success', data: analysis });
});
// cron.schedule('0 0 * * *',()=>{
//     console.log('Daily Summary',expenses)
// })
cron.schedule('*/1 * * * *',()=>{ 
    console.log('Daily Expenses',expenses)
})
app.listen(port,()=>{
    console.log(`Server running on ${port}`)
})
