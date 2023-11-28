const Filter = ({filter, setFilter, ordenarCompletas, ordenarIncompletas}) => {
  return (
    <div className="filter">
        <h2>Filtrar:</h2>
        <div className="filter-options">
            <div>
                <p>Status:</p>
                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="All">Todos</option>
                    <option value="Completed">Concluídos</option>
                    <option value="Incompleto">Não Concluídos</option>
                </select>
            </div>
            <div>
                <p>Ordenar:</p>
                <button onClick={() => ordenarCompletas()}>Completas</button>
                <button onClick={() => ordenarIncompletas()}>Incompletas</button>
            </div>
        </div>
    </div>
  )
}

export default Filter