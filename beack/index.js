require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const {Pool} = require('pg')

const app = express()    

app.use(cors('http://localhost:5173'))
app.use(express.json())

const pool = new Pool({
    user: process.env.DB_USER,
    host:process.env.DB_HOST,
    database:process.env.DB_NAME,
    password:process.env.DB_PASSWORD,
    port:process.env.DB_PORT,
    dialect: 'postgres',
})
const JWT_SECRET = process.env.DB_SECRET || 'supersecretkey123'

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


app.post('/api/auth/register', async (req, res) => {
  console.log('BODY:', req.body); 
  
  const { name_user, password,age_user } = req.body;
  
  if (!name_user || !password || !age_user) {
    return res.status(400).json({ error: 'Заполни все поля' });
  }
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Хэш создан');
    const result = await pool.query(
      'INSERT INTO users (name_user, password,age_user) VALUES ($1, $2, $3) RETURNING id, name_user',
      [name_user, hashedPassword,age_user]
    );
  } catch (error) {
    console.error('ОШИБКА:', error); 
  }
});