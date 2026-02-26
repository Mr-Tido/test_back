import { useState,useEffect } from 'react'
import axios from 'axios'
import './App.css'
import { Link } from 'react-router-dom';
 
export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [message,setMessage] = useState('')
  const [data, setData] = useState([])
  const [oldPrice,setOldPrice] = useState('')
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userAge, setUserAge] = useState('')
  const [isError, setIsError] = useState(false);



useEffect(() => {
  fetch('http://localhost:3000/api/main')
  .then(res => res.json())
  .then(data => setData(data))
}, [])


const onDelete = async (itemId) => {
        try {
            await axios.delete(`http://localhost:3000/api/delete/${itemId}`);
            setData(prev => prev.filter(item => item.id !== Number(itemId)));
        } catch (error) {
            console.error('❌ Ошибка:', error.response?.status, error.response?.data);
        }
};
const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/create', { title:String(title), price: Number(price),oldPrice:Number(oldPrice) });
      setMessage('Данные добавлены!');
      setTitle('');
      setPrice('');
      setOldPrice('');
    } catch (error) {
      setMessage('Ошибка: ' + error.response?.data?.error);
    }
};
   const handleSubmits = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/api/auth/register', {
        name_user:username,
        password:password,
        age_user:userAge,
      });

      setMessage(response.data.message);
      setIsError(false);
      setUsername('');
      setPassword('');

    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Ошибка регистрации';
      setMessage(errorMsg);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };


  return (
    <>

    <div className="App">
      <div className="form-container">
        <h2>Регистрация</h2>
        <form onSubmit={handleSubmits}>
          <input
            type="text"
            placeholder="Логин"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input type="text"
            placeholder='Age'
            value={userAge}
            onChange={(e)=> setUserAge(e.target.value)}
            required
          />
          <button type="submit">Зарегистрироваться</button>
        </form>
        {message && (
          <div className={isError ? 'error' : 'success'}>
            {message}
          </div>
        )}
      </div>
    </div>



    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Название" value={title} 
      onChange={(e) => setTitle(e.target.value)} required/>

      <input type="number" placeholder="Цена" value={price} 
      onChange={(e) => setPrice(e.target.value)} required/>
      
      <input type="number" placeholder='Старая цена' value={oldPrice} 
      onChange={(e) => setOldPrice(e.target.value)} required />

      <button type="submit">Добавить</button>
      {message && <p>{message}</p>}
    </form>
       <div>
            {data.map((item) => (
                <div key={item.id}>
                    <ul>
                        <li>ID: {item.id}</li>
                        <li><p>Наименование продукта:</p>{item.title}</li>
                        <li><p>Нынешьняя цена:</p>{item.price}</li>
                        <li><p>Старая цена:</p>{item.oldPrice}</li>
                        <button onClick={() => onDelete(item.id)}>Удалить</button>
                    </ul>
      
                </div>
                
            ))}
        </div>
    </>
  )
}



