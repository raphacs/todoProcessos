import { useState, useEffect } from 'react'
import './App.css'
import TodoForm from './components/TodoForm';
import Todo from './components/todo';
import Search from './components/Search';
import Filter from './components/Filter';


function App() {

  const [todos, setTodos] = useState([])

  const [search, setSearch] = useState('')

  const [filter, setFilter] = useState('All')
  useEffect(() => {
    fetch('http://localhost:3000/processos')
      .then(response => response.json())
      .then(data => setTodos(data))
      .catch(error => console.log(error))
  }, [])

  const addTodo = (processo, contribuidor, data) => {
    const newTodos = [...todos, {
      processo,
      contribuidor,
      data,
      isCompleted: false
    }]

    
    const salvarTodos = 
      {
        processo,
        contribuidor,
        data,
        isCompleted: false
      }
    

    console.log(salvarTodos)

    fetch('http://localhost:3000/processos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(salvarTodos)
    })
    .then(response => response.json())
    .then(newTodo => {
      setTodos(prevTodos => [...prevTodos, newTodo.novoProcesso]);
    })
    .catch(error => {
      console.error('Erro ao adicionar novo processo:', error);
    });
  }

  const removeTodo = (processo) => {
    // Envia uma solicitação DELETE para excluir o processo pelo ID
    fetch(`http://localhost:3000/processos/${processo}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao excluir processo');
        }
        return response.json();
      })
      .then(responseData => {
        // Atualiza o estado local para refletir a exclusão
        setTodos(prevTodos => prevTodos.filter(todo => todo.processo !== processo));
        console.log(responseData.message); // Exibe a mensagem do servidor (opcional)
      })
      .catch(error => {
        console.error('Erro ao excluir processo:', error);
      });
  };

  const completeTodo = (processo) => {
    // Envia uma solicitação PUT para atualizar o campo isCompleted
    fetch(`http://localhost:3000/processos/${processo}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        isCompleted: !todos.find(todo => todo.processo === processo).isCompleted,
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao completar processo');
        }
        return response.json();
      })
      .then(responseData => {
        // Atualiza o estado local para refletir a mudança no campo isCompleted
        setTodos(prevTodos => {
          return prevTodos.map(todo => {
            if (todo.processo === processo) {
              return {
                ...todo,
                isCompleted: !todo.isCompleted,
              };
            }
            return todo;
          });
        });
        console.log(responseData.message); // Exibe a mensagem do servidor (opcional)
      })
      .catch(error => {
        console.error('Erro ao completar processo:', error);
      });
  };

  const ordenarCompletas = () => {
    const copiaTodos = [...todos];
    copiaTodos.sort((a, b) => (a.isCompleted === b.isCompleted) ? 0 : a.isCompleted ? -1 : 1);
    setTodos(copiaTodos);
  };

  const ordenarIncompletas = () => {
    const copiaTodos = [...todos];
    copiaTodos.sort((a, b) => (a.isCompleted === b.isCompleted) ? 1 : a.isCompleted ? 1 : -1);
    setTodos(copiaTodos);
  };
  

  return (
    <div className="app" >
      <h1>Lista de Processos</h1>
      <Search search={search} setSearch={setSearch} />
      <Filter filter={filter} setFilter={setFilter} ordenarCompletas={ordenarCompletas} ordenarIncompletas={ordenarIncompletas} />
      <div className="todo-list" id="printable">
        {todos
          .filter((todo) => filter === 'All' ? true : filter === 'Completed' ? todo.isCompleted : !todo.isCompleted)
          .filter((todo) => todo.processo.toLowerCase().includes(search) || todo.contribuidor.toLowerCase().includes(search))
          .map((todo) => (
            <Todo todo={todo} removeTodo={removeTodo} completeTodo={completeTodo} key={todo.processo} />
          ))}
      </div>
      <TodoForm addTodo={addTodo}  />
    </div>
  )
}

export default App
