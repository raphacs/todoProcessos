import { useState } from 'react'

const TodoForm = ({addTodo}) => {
  const [processo, setProcesso] = useState('')
  const [contribuidor, setContribuidor] = useState('')
  const [data, setData] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if(!processo || !contribuidor || !data) {
      alert('Preencha todos os campos')
      return
    }
    addTodo(processo, contribuidor, data)
    setProcesso('')
    setContribuidor('')
    setData('')

    console.log(processo, contribuidor, data)
  }
  return (
    <div className='todo-form'>
      <h2>Criar Processo</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder='Digite o Processo' value={processo} onChange={(e) => setProcesso(e.target.value)}/>
        <input type="text" placeholder='Digite o Contribuidor' value={contribuidor} onChange={(e) => setContribuidor(e.target.value)}/>
        <input type="date" value={data} onChange={(e) => setData(e.target.value)}/>
        <button type="submit">Criar</button>
      </form>
    </div>
  )
}

export default TodoForm