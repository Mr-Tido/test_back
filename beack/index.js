const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const {Pool} = require('pg')

const app = express()    

app.use(cors('http://localhost:5173'))
app.use(express.json())

const pool = new Pool({
    user: "postgres",
    host:"localhost",
    database:"postgres",
    password:"1234",
    port:"5432"
})

const PORT = "3000" || 3000
app.listen(PORT, ()=> { 
    console.log(`Server running on port ${PORT}`)
})

app.get('/api/main', async(req,res) => { 
    try{
        const result = await pool.query('SELECT * FROM catalog_items ')
        res.json(result.rows)
    }catch(error){
        res.status(500).json({error:`Server error:${console.log(error)}`})
    }
})


app.delete('/api/delete/:id', async (req, res) => { 
    try {
        await pool.query('DELETE FROM catalog_items WHERE id = $1', [req.params.id])
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.post('/api/create', async (req, res) => {
  try {
    const { title, price, old_price } = req.body;
    const result = await pool.query(
      'INSERT INTO catalog_items (title, price,old_price) VALUES ($1, $2, $3) RETURNING *',
      [title, price,old_price]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message});
  }
});