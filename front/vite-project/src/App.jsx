import { useState,useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [message,setMessage] = useState('')
  const [data, setData] = useState([])
  const [oldPrice,setOldPrice] = useState('')

useEffect(() => {
  fetch('http://localhost:3000/api/main')
  .then(res => res.json())
  .then(data => setData(data))
}, [])

  // useEffect(()=>{
  //   axios.get('http://localhost:3000/api/main')
  //   .then(response => { 
  //     setData(response.data)
  //   })
  //   .catch(error => { 
  //     console.error("Error",error)
  //   })
  // }, [])

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
  return (
    <>
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

export default App
