import React, { PureComponent } from 'react'
import moment from 'moment'
import { DatePickerInput } from 'rc-datepicker'
import InfiniteScroll from 'react-infinite-scroller'
import axios from 'axios'
import Select from 'react-select'
import { logoutLocal, getAccessToken } from '../../services/auth'
import Modal from '../Tools/modal'
import Task from '../Board/Task'
import ExcelDownload from '../Tools/ExcelDownload'
import { ToastContainer, toast } from 'react-toastify'

import 'moment/locale/es.js'
import 'rc-datepicker/lib/style.css'
import '../../assets/css/deliveries.css'
import 'react-toastify/dist/ReactToastify.css'

const columnsAll = [
  { label: 'Id', value: 'Id', id: 0 },
  { label: 'Fecha', value: 'Fecha', id: 1 },
  { label: 'Categoria', value: 'Categoria', id: 2 },
  { label: 'Servicio', value: 'Servicio', id: 3 },
  { label: 'Cliente', value: 'Cliente', id: 4 },
  { label: 'Proveedor', value: 'Proveedor', id: 5 },
  { label: 'Operador', value: 'Operador', id: 6 },
  { label: 'Pais', value: 'Pais', id: 7 },
  { label: 'Ciudad', value: 'Ciudad', id: 8 },
  { label: 'Direccion', value: 'Direccion', id: 9 },
]
export default class Deliveries extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      items: [],
      page: 1,
      pages: 0,
      count: 0,
      date: moment().format('YYYY-MM-DDT23:59:59.719Z'),
      firstDate: moment()
        .startOf('month')
        .format('YYYY-MM-DDT00:00:00.719Z'),
      hasMoreItems: true,
      showModal: false,
      curTask: [],
      messagesTask: [],
      notesTask: [],
      filterColumn: '',
      filterKeyword: '',
      filterColection: [],
      generatingExcel: false,
      columnsSelect: [
        { label: 'Id', value: 'Id' },
        { label: 'Categoria', value: 'Categoria' },
        { label: 'Servicio', value: 'Servicio' },
        { label: 'Cliente', value: 'Cliente' },
        { label: 'Proveedor', value: 'Proveedor' },
        { label: 'Operador', value: 'Operador' },
        { label: 'Pais', value: 'Pais' },
        { label: 'Ciudad', value: 'Ciudad' },
      ],
      columnSelected: null,
    }
  }

  async componentDidMount() {
    let filterColection = []
    if (
      typeof window !== 'undefined' &&
      window.localStorage.getItem('filtercolection')
    ) {
      filterColection = JSON.parse(
        window.localStorage.getItem('filtercolection')
      )
    }
    if (filterColection.length > 0) {
      this.setState({ filterColection: filterColection })
    }
    await this.nextPage(false)
  }
  onChange = async (jsDate, type) => {
    if (type === 'from') {
      await this.setState({
        firstDate: moment(jsDate).format('YYYY-MM-DDT00:00:20.719Z'),
      })
    } else {
      await this.setState({
        date: moment(jsDate).format('YYYY-MM-DDT23:59:59.719Z'),
      })
    }

    this.nextPage(false)

    return true
  }

  nextPage = async plus => {
    console.log('cargar mas', this.state.page)
    try {
      let { page } = this.state.page
      if (plus) {
        page = this.state.page + 1
      } else {
        page = 1
      }
      const accessToken = await getAccessToken()
      const data = await axios.post(
        `${process.env.API_URL}/orders/getOrdersDeliveries/${page}/limit/20`,
        {
          from: this.state.firstDate,
          to: this.state.date,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': accessToken,
          },
        }
      )
      var CryptoJS = require('crypto-js')
      let decryptedData = CryptoJS.AES.decrypt(
        data.data,
        process.env.CRYPTO_SECRET
      ).toString(CryptoJS.enc.Utf8)

      decryptedData = JSON.parse(decryptedData)
      console.log(decryptedData)
      let items = decryptedData.tasks

      console.log('items.tasks', items)
      if (plus) {
        items = this.state.items.concat(decryptedData.tasks)
      }

      console.log('hojas', decryptedData)
      let hasMoreItems = true
      if (
        decryptedData.pages === this.state.page ||
        decryptedData.tasks.length === 0
      ) {
        hasMoreItems = false
        console.log('esta fue la ultima hoja', decryptedData.pages)
      }
      this.setState({
        items: items,
        page: page,
        pages: decryptedData.pages,
        count: decryptedData.count,
        hasMoreItems: hasMoreItems,
      })

      console.log('this.state.items', this.state.items)

      return data
    } catch (err) {
      if (err.response.status === 403) {
        console.log('logour:', err.response.status)
        logoutLocal()
      }
      return []
    }
  }

  reopenTask = async id => {
    console.log('update status for order ID:', id)
    try {
      const accessToken = await getAccessToken()
      await axios.post(
        `${process.env.API_URL}/orders/updateStatus`,
        {
          statusName: 'asigned',
          orderId: id,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': accessToken,
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
    const accessToken = await getAccessToken()
    const messages = await axios.post(
      `${process.env.API_URL}/getMessages`,
      {
        orderId: id,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': accessToken,
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
    const accessToken = await getAccessToken()
    const notes = await axios.post(
      `${process.env.API_URL}/orders/getNotes`,
      {
        orderId: id,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': accessToken,
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

  addFilter = () => {
    console.log('addFilter')
    console.log(this.state.filterColumn)
    console.log(this.state.filterKeyword)
    if (this.state.filterKeyword !== '' && this.state.filterColumn !== '') {
      let { filterColection } = this.state
      filterColection.push({
        column: this.state.filterColumn,
        keyword: this.state.filterKeyword,
      })
      console.log('filterColection', filterColection)
      window.localStorage.setItem(
        'filtercolection',
        JSON.stringify(filterColection)
      )

      let { columnsSelect } = this.state
      var index = columnsSelect
        .map(x => {
          return x.value
        })
        .indexOf(this.state.filterColumn)

      columnsSelect.splice(index, 1)
      console.log('---------------------columnsSelect', columnsSelect)

      this.setState({
        filterColection,
        columnsSelect,
        columnSelected: null,
        filterColumn: '',
        filterKeyword: '',
      })

      document.getElementById('keywordFilter').value = ''
    } else {
      this.MsmNewTask('Debe llenar los campos')
    }
  }
  setFilter = (option, id) => {
    console.log('setFilter ID', id)
    console.log('setFilter', option)
    if (option) {
      if (id === 'filterColumn') {
        let { filterColumn, columnSelected } = this.state
        filterColumn = option.label
        columnSelected = [
          {
            label: option.label,
            value: option.value,
          },
        ]
        this.setState({
          filterColumn,
          columnSelected,
        })
      } else {
        let { filterKeyword } = this.state
        filterKeyword = option
        this.setState({
          filterKeyword,
        })
      }
      console.log('filterColumn', this.state.filterColumn)
      console.log('filterKeyword', this.state.filterKeyword)
    }
  }
  deleteFilter = (index, column) => {
    let { filterColection } = this.state
    filterColection.map(item => {
      if (index > -1) {
        filterColection.splice(index, 1)
      }
      return item
    })
    window.localStorage.setItem(
      'filtercolection',
      JSON.stringify(filterColection)
    )
    let { columnsSelect } = this.state

    columnsSelect.push({ label: column, value: column })
    this.setState({ filterColection, columnsSelect })
  }

  loadAll = async () => {
    this.setState({ generatingExcel: true })
    let page = this.state.page
    while (page < this.state.pages + 1) {
      await this.nextPage(true)
      page++
    }
    this.setState({ generatingExcel: false })
    return this.state.items
  }

  filterItems = item => {
    const { filterColection } = this.state
    let response = true
    let responseArray = []
    if (filterColection.length > 0) {
      response = false
      filterColection.map(filter => {
        if (filter.column === 'Id') {
          if (Number(item.id) === Number(filter.keyword)) {
            responseArray.push(true)
          }
        } else if (filter.column === 'Categoria') {
          if (item.service.categories.name === filter.keyword) {
            responseArray.push(true)
          }
        } else if (filter.column === 'Servicio') {
          if (item.service.name === filter.keyword) {
            responseArray.push(true)
          }
        } else if (filter.column === 'Cliente') {
          if (
            item.client.name + ' ' + item.client.lastName ===
            filter.keyword
          ) {
            responseArray.push(true)
          }
        } else if (filter.column === 'Proveedor') {
          if (item.provider.busnessName === filter.keyword) {
            responseArray.push(true)
          }
        } else if (filter.column === 'Operador') {
          if (
            item.operator.name + ' ' + item.operator.lastName ===
            filter.keyword
          ) {
            responseArray.push(true)
          }
        } else if (filter.column === 'Pais') {
          if (item.country === filter.keyword) {
            responseArray.push(true)
          }
        } else if (filter.column === 'Ciudad') {
          if (item.city === filter.keyword) {
            responseArray.push(true)
          }
        }
        console.log('responseArray: ', responseArray)
        if (responseArray.length === filterColection.length) {
          responseArray.map(resp => {
            if (resp) {
              response = true
            }
            return resp
          })
        } else {
          response = false
        }

        return filter
      })
    }

    return response
  }

  //ALERTS
  MsmNewTask = title => toast(title)

  render() {
    const loader = (
      <div key="loader" className="loader">
        Cargando mas ??rdenes...
      </div>
    )

    var items = []
    if (this.state.items.length > 0) {
      this.state.items
        .sort((a, b) => {
          return b.id - a.id
        })
        .filter(item => this.filterItems(item))
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
              <td>{item.country !== null ? item.country : 'Sin datos'}</td>
              <td>{item.city !== null ? item.city : 'Sin datos'}</td>
              <td>{item.address !== null ? item.address : 'Sin datos'}</td>
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
          <td colSpan="11">
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
            <div>
              <Select
                className="input"
                classNamePrefix="column"
                placeholder="Columna"
                isClearable={true}
                isSearchable={true}
                name="column"
                onChange={option => this.setFilter(option, 'filterColumn')}
                options={this.state.columnsSelect}
                value={this.state.columnSelected}
              />
            </div>
            <div>
              <input
                defaultValue={''}
                placeholder="Ingresa una palabra clave"
                className="input keywordFilter"
                id="keywordFilter"
                onChange={e => this.setFilter(e.target.value, 'filterKeyword')}
              />
            </div>
            <button className="btm addFilter" onClick={this.addFilter}>
              A??adir Filtro
            </button>
          </div>
          {this.state.page >= this.state.pages ? (
            <ExcelDownload
              items={this.state.items}
              filterItems={this.filterItems}
            />
          ) : !this.state.generatingExcel ? (
            <button onClick={this.loadAll} className="generateExcel">
              Generar Excel
            </button>
          ) : (
            <div className="generatingExcel">
              Trayendo todas las ordenes un momento porfavor...
            </div>
          )}
          <div />
        </div>
        {this.state.filterColection.length > 0 ? (
          <div className="filterTrack">
            <h4>Filtros activos</h4>
            <div className="activesFilters">
              {this.state.filterColection.map((item, i) => (
                <div key={i} className="filterItem">
                  <b>Columna:</b> {item.column} <b>/ Keyword:</b> {item.keyword}{' '}
                  <span
                    className="deleteFilter"
                    onClick={e => this.deleteFilter(i, item.column)}
                  >
                    X
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          ''
        )}
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
                    {columnsAll.map(item => (
                      <th key={item.id}>{item.label}</th>
                    ))}
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
        <ToastContainer />
      </div>
    )
  }
}
