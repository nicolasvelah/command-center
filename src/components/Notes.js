import React from 'react'

export default class Chat extends React.Component {
  render() {
    return (
      <div className="notes">
        <h2>Añade una nota</h2>
        <div className="addNote">
          <textarea onChange={e => this.props.setNote(e)} />
          <div className="text-right">
            <button className="btn" onClick={e => this.props.sendNote(e)}>
              Añadir nota
            </button>
          </div>
        </div>
        <h3>Notas</h3>
        <div className="notesList">
          {this.props.notesTask.map(item => (
            <div key={item.id} className="noteContainer">
              <div className="noteData row">
                <div className="noteOperator">{item.name}</div>
                <div className="date">{item.date}</div>
              </div>
              <div className="note">
                <span className="noteSpan">{item.content}</span>
              </div>
              <div className="tools">
                <div className="edit">Editar - </div>
                <div className="delete">Borrar</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
}
