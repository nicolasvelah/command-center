import React, { Component } from 'react'
import moment from 'moment'
import { DatePickerInput } from 'rc-datepicker'
import InfiniteScroll from 'react-infinite-scroller'
import axios from 'axios'
import { getUser } from '../services/auth'
import Modal from './modal'
import Task from './Task'
//import ExcelDownload from './ExcelDownload'

import 'moment/locale/es.js'
import 'rc-datepicker/lib/style.css'
import '../assets/css/deliveries.css'

export default class Deliveries extends Component {
  constructor(props) {
    super(props)
    this.state = {
      items: [],
      page: 1,
      pages: 0,
      count: 0,
      date: moment().format('YYYY-MM-DDT00:00:20.719Z'),
      firstDate: moment()
        .startOf('month')
        .format('YYYY-MM-DDT00:00:20.719Z'),
      hasMoreItems: true,
    }
  }

  async componentDidMount() {
    await this.nextPage(false)
  }
  onChange = async (jsDate, type) => {
    console.log(type)
    console.log(moment(jsDate).format('YYYY-MM-DDT00:00:20.719Z'))
    if (type === 'from') {
      await this.setState({
        firstDate: moment(jsDate).format('YYYY-MM-DDT00:00:20.719Z'),
      })
    } else {
      await this.setState({
        date: moment(jsDate).format('YYYY-MM-DDT00:00:20.719Z'),
      })
    }

    this.nextPage(false)

    return true
  }

  nextPage = async plus => {
    console.log('cargar mas', this.state.page)
    try {
      let page = this.state.page
      if (plus) {
        page = this.state.page + 1
      } else {
        page = 1
      }
      const url = `${
        process.env.API_URL
      }/orders/getOrdersDeliveries/${page}/limit/20`
      console.log(url)
      const data = await axios.post(
        url,
        {
          from: this.state.firstDate,
          to: this.state.date,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': getUser().token,
          },
        }
      )

      let items = data.data.tasks

      console.log('data.data.tasks', data.data.tasks)
      if (plus) {
        items = this.state.items.concat(data.data.tasks)
      }

      console.log('hojas', data.data.pages)
      let hasMoreItems = true
      if (data.data.pages === this.state.page || data.data.tasks.length === 0) {
        hasMoreItems = false
        console.log('esta fue la ultima hoja', data.data.pages)
      }
      this.setState({
        items: items,
        page: page,
        pages: data.data.pages,
        count: data.data.count,
        hasMoreItems: hasMoreItems,
        showModal: false,
        curTask: [],
        messagesTask: [],
        notesTask: [],
      })

      console.log('this.state.items', this.state.items)

      return data
    } catch (err) {
      console.log(err.message)
      return []
    }
  }

  reopenTask = async id => {
    console.log('update status for order ID:', id)
    try {
      await axios.post(
        `${process.env.API_URL}/orders/updateStatus`,
        {
          statusName: 'asigned',
          orderId: id,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': getUser().token,
          },
        }
      )
      let { items } = this.state

      var index = items
        .map(x => {
          return x.id
        })
        .indexOf(id)

      items.splice(index, 1)
      this.setState({
        items,
      })
      return true
    } catch (err) {
      console.log(err.message)
      return false
    }
  }

  setModal = async id => {
    let task = []
    await this.state.items.filter(item => {
      console.log('item', item)
      if (item.id === id) {
        task.push(item)
      }
      return item
    })
    console.log('task', task)
    await this.getMessages(task[0].id)
    await this.getNotes(task[0].id)
    this.setState({ curTask: task, showModal: !this.state.showModal })

    console.log('cur task', task)
  }

  //CHAT
  getMessages = async id => {
    const messages = await axios.post(
      `${process.env.API_URL}/getMessages`,
      {
        orderId: id,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': getUser().token,
        },
      }
    )
    console.log('messages ------------- ', messages)
    this.setState({
      messagesTask: messages.data,
    })
    return messages
  }

  //NOTES
  getNotes = async id => {
    const notes = await axios.post(
      `${process.env.API_URL}/orders/getNotes`,
      {
        orderId: id,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': getUser().token,
        },
      }
    )
    this.setState({
      notesTask: notes.data.notes,
    })
    return notes
  }
  closeModal = () => {
    this.setState({
      curTask: [],
      showModal: false,
    })
  }

  render() {
    const loader = (
      <div key="loader" className="loader">
        Cargando mas órdenes...
      </div>
    )

    var items = []
    if (this.state.items.length > 0) {
      this.state.items
        .sort((a, b) => {
          return b.id - a.id
        })
        .map((item, i) => {
          items.push(
            <tr key={i}>
              <td>{item.id}</td>
              <td>{item.createdAt}</td>
              <td>{item.service.categories.name}</td>
              <td>{item.service.name}</td>
              <td>
                {item.client.name + ' ' + item.client.lastName}
                <div className="columDetails">
                  Pais:{' '}
                  {item.client.country !== null
                    ? item.client.country
                    : 'Sin datos'}{' '}
                  <br />
                  Ciudad:{' '}
                  {item.client.city !== null ? item.client.city : 'Sin datos'}
                </div>
              </td>
              <td>
                {item.provider.busnessName}
                <div className="columDetails">
                  Pais:{' '}
                  {item.provider.user.country !== null
                    ? item.provider.user.country
                    : 'Sin datos'}{' '}
                  <br />
                  Ciudad:{' '}
                  {item.provider.user.city !== null
                    ? item.provider.user.city
                    : 'Sin datos'}
                </div>
              </td>
              <td>
                {item.operator.name + ' ' + item.operator.lastName}
                <div className="columDetails">
                  Pais:{' '}
                  {item.operator.country !== null
                    ? item.operator.country
                    : 'Sin datos'}{' '}
                  <br />
                  Ciudad:{' '}
                  {item.operator.city !== null
                    ? item.operator.city
                    : 'Sin datos'}
                </div>
              </td>
              <td>Pais</td>
              <td>Ciudad</td>
              <td>Direccion</td>
              <td>
                <div className="btmContainer">
                  <div onClick={() => this.setModal(item.id)} className="btm">
                    Ver
                  </div>
                  <div onClick={() => this.reopenTask(item.id)} className="btm">
                    Reabrir
                  </div>
                </div>
              </td>
            </tr>
          )
          return item
        })
    } else {
      items.push(
        <tr key="SinResultados">
          <td colSpan="9">
            <div>Sin resultados</div>
          </td>
        </tr>
      )
    }
    return (
      <div className="deliveries">
        <h1>Entregas</h1>
        <div className="filters">
          <div className="inputContainer">
            <span>Desde:</span>
            <DatePickerInput
              onChange={jsDate => this.onChange(jsDate, 'from')}
              value={this.state.firstDate}
              className="my-custom-datepicker-component"
            />
          </div>
          <div className="inputContainer">
            <span>Hasta:</span>
            <DatePickerInput
              onChange={jsDate => this.onChange(jsDate, 'to')}
              value={this.state.date}
              className="my-custom-datepicker-component"
            />
          </div>
          <div className="inputGroupContainer">
            <div>Columna</div>
            <div>Keyword</div>
            <button className="btm addFilter">Añadir Filtro</button>
          </div>
          <div />
        </div>
        <div>
          {this.state.items !== null ? (
            <InfiniteScroll
              pageStart={0}
              loadMore={() => this.nextPage(true)}
              hasMore={this.state.hasMoreItems}
              loader={loader}
            >
              <table>
                <tbody>
                  <tr>
                    <th>Id</th>
                    <th>Fecha</th>
                    <th>Categoria</th>
                    <th>Servicio</th>
                    <th>Cliente</th>
                    <th>Proveedor</th>
                    <th>Operador</th>
                    <th>Pais</th>
                    <th>Ciudad</th>
                    <th>Direccion</th>
                    <th>Aciones</th>
                  </tr>
                  {items}
                </tbody>
              </table>
            </InfiniteScroll>
          ) : (
            ''
          )}
        </div>
        {this.state.showModal ? (
          <Modal closeModal={this.closeModal} showModal={this.state.showModal}>
            <Task
              task={this.state.curTask}
              messagesTask={this.state.messagesTask}
              getMessages={this.getMessages}
              addMensages={null}
              addNote={null}
              notesTask={this.state.notesTask}
              getMyTasks={null}
              setModal={this.setModal}
              getNotes={this.getNotes}
              chageProvider={null}
              chageProviderVal={false}
              update911state={null}
            />
          </Modal>
        ) : (
          ''
        )}
      </div>
    )
  }
}
