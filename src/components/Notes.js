import React from 'react'

export default class Chat extends React.Component {
  render() {
    return (
      <div className="notes">
        <h2>Añade una nota</h2>
        <div className="addNote">
          <textarea />
          <div className="text-right">
            <button className="btn">Añadir nota</button>
          </div>
        </div>
        <h3>Notas</h3>
        <div className="notesList">
          <div className="noteContainer">
            <div className="noteData row">
              <div className="noteOperator">Operador</div>
              <div className="date">00/00/00 00:00</div>
            </div>
            <div className="note">
              <span className="noteSpan">
                alskdj laskdjl ;asjd;ajsd ajsd;l jalsdjla ksjd lajsd ;lajsd
                ;lajsd ;ljasd ljas ldfj lsad jf;lajsdfjaslkfjl asjfljasld;fjl
                asjdf lasdjf
              </span>
            </div>
            <div className="tools">
              <div className="edit">Editar - </div>
              <div className="delete">Borrar</div>
            </div>
          </div>
          <div className="noteContainer">
            <div className="noteData row">
              <div className="noteOperator">Operador</div>
              <div className="date">00/00/00 00:00</div>
            </div>
            <div className="note">
              <span className="noteSpan">
                alskdj laskdjl ;asjd;ajsd ajsd;l jalsdjla ksjd lajsd ;lajsd
                ;lajsd ;ljasd ljas ldfj lsad jf;lajsdfjaslkfjl asjfljasld;fjl
                asjdf lasdjf
              </span>
            </div>
            <div className="tools">
              <div className="edit">Editar - </div>
              <div className="delete">Borrar</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
