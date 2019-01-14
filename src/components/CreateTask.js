import React, { Component } from 'react'
import axios from 'axios'
import { getUser } from '../services/auth'
import Select, { Async } from 'react-select'
import styled from 'styled-components'
import MapServiceLocator from './MapServiceLocator'

const StyledAutocomplete = styled(Async)`
  .Select-control {
    border: solid 1px ${props => props.theme.gray};
    border-radius: 0 !important;
    box-shadow: none;
    color: ${props => props.theme.black};
    height: 40px;

    .Select-multi-value-wrapper {
      .Select-placeholder {
        line-height: 40px;
      }

      .Select-value {
        line-height: 40px;
        .Select-value-label {
          color: ${props => props.theme.black} !important;
        }
      }

      .Select-input {
        height: 38px;
        width: 100%;

        input {
          line-height: 18px;
          padding: 10px 0 12px;
        }
      }
    }

    .Select-clear-zone {
      .Select-clear {
        font-size: 30px;
        margin-right: 5px;
      }
    }

    .Select-arrow-zone {
      display: none;
    }
  }
`
export default class CreateTask extends Component {
  constructor(props) {
    super(props)
    this.state = {
      keyWord: '',
      firstTyping: true,
      isLoading: false,
      operators: [],
      categories: [],
      services: [],
      providers: [],
      servicesShow: false,
      providerShow: false,
      mapShow: false,
      clientId: null,
      isSending: false,
      errorSending: false,
      client: {
        value: '',
        error: '',
      },
      service: {
        value: '',
        error: '',
      },
      provider: {
        value: '',
        error: '',
      },
      comment: {
        value: 'Prueba desde CC',
        error: '',
      },
      lat: {
        value: '',
        error: '',
      },
      lnt: {
        value: '',
        error: '',
      },
    }
    this.setLocation = this.setLocation.bind(this)
  }

  componentDidMount() {
    this.getOperators()
    this.getCategories()
  }

  getClient = (inputValue, callback) => {
    //this.setState({ isLoading: true })
    if (!this.state.isLoading && inputValue) {
      let options = []
      if (this.state.keyWord !== '') {
        axios
          .post(
            `${process.env.API_URL}/clients/searchClients`,
            {
              searchText: this.state.keyWord,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'x-access-token': getUser().token,
              },
            }
          )
          .then(async result => {
            options = await result.data.clients.map(client => {
              return { id: client.id, label: client.name, value: client.id }
            })

            setTimeout(() => {
              callback(options)
              this.setState({ isLoading: false })
            }, 500)
          })
      } else {
        setTimeout(() => {
          callback(options)
          this.setState({ isLoading: false })
        }, 500)
      }
    }
    return
  }
  getOperators = async () => {
    try {
      const data = await axios
        .post(
          `${process.env.API_URL}/getOperators`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': getUser().token,
            },
          }
        )
        .then(async result => {
          const options = await result.data.users.map(user => {
            return { id: user.id, label: user.name, value: user.id }
          })

          this.setState({ operators: options })
        })
        .catch(er => {
          console.log(er)
        })

      return data
    } catch (err) {
      console.log(err.message)
      return []
    }
  }
  getCategories = async () => {
    const data = await axios
      .get(
        `${process.env.API_URL}/categories`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': getUser().token,
          },
        }
      )
      .then(async result => {
        const options = await result.data.categories.map(category => {
          return { id: category.id, label: category.name, value: category.id }
        })

        this.setState({ categories: options })
      })
      .catch(er => {
        console.log(er)
      })

    return data
  }
  getServices = async id => {
    const data = await axios
      .get(
        `${process.env.API_URL}/services/` + id,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': getUser().token,
          },
        }
      )
      .then(async result => {
        const options = await result.data.services.map(service => {
          return { id: service.id, label: service.name, value: service.id }
        })

        this.setState({ services: options })
      })
      .catch(er => {
        console.log(er)
      })

    return data
  }
  getProvider = async id => {
    const data = await axios
      .get(
        `${process.env.API_URL}/providers/` + id,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': getUser().token,
          },
        }
      )
      .then(async result => {
        console.log('Proiveedores')
        console.log(result)
        const options = await result.data.providers.map(provider => {
          return {
            id: provider.id,
            label: provider.Provider.busnessName,
            value: provider.id,
          }
        })

        this.setState({ providers: options })
      })
      .catch(er => {
        console.log(er)
      })

    return data
  }
  handleTypeInputSearch = inputValue => {
    if (this.state.firstTyping) {
      this.setState({ firstTyping: false })
    }
    if (inputValue) {
      this.setState({ keyWord: inputValue })
    }
  }
  handleAutoCompleteChange = async option => {
    if (option) {
      await this.setState({
        keyWord: option.label,
        mapShow: true,
        clientId: option.value,
      })
    } else {
      await this.setState({ keyWord: '' })
    }

    return option.label
  }
  handleCategoryChange = async option => {
    this.getServices(option.value)
    this.setState({
      servicesShow: true,
      providerShow: false,
    })
  }
  handleServiceChange = async option => {
    this.getProvider(option.value)
    this.setState({
      providerShow: true,
      service: { value: option.value },
    })
  }
  handleProviderChange = async option => {
    this.setState({
      provider: { value: option.value },
    })
  }
  sendTask = async e => {
    e.preventDefault()
    this.setState({ isSending: true })
    try {
      await axios.post(
        `${process.env.API_URL}/orders/addOrder`,
        {
          clientId: this.state.clientId,
          serviceId: this.state.service.value,
          providerId: this.state.provider.value,
          comment: this.state.comment.value,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'x-access-token': getUser().token,
            lat: this.state.lat.value,
            len: this.state.lnt.value,
          },
        }
      )
      this.setState({ isSending: false, errorSending: false })
    } catch (err) {
      console.log(err)
      this.setState({ isSending: false, errorSending: true })
    }
    return true
  }
  setLocation = (lat, lnt) => {
    this.setState({
      lat: {
        value: lat,
      },
      lnt: {
        value: lnt,
      },
    })
  }

  render() {
    return (
      <form className="form">
        <div
          className={
            this.state.errorSending ? 'errorSending' : 'noErrorSending'
          }
        >
          No hemos podido insertar la tarea vuelva a intentar.
        </div>
        <div className={this.state.isSending ? 'sending' : 'nosending'}>
          Creando la tarea....
        </div>
        <h1>Nueva Taréa</h1>
        <Select
          className="input"
          classNamePrefix="operator"
          placeholder="Operador"
          isClearable={true}
          isSearchable={true}
          name="operator"
          options={this.state.operators}
        />
        <StyledAutocomplete
          name="client"
          autosize={true}
          noResultsText="No se han encontrado clientes"
          placeholder="Buscar Cliente"
          clearValueText="Limpiar Campo"
          onChange={this.handleAutoCompleteChange}
          onInputChange={this.handleTypeInputSearch}
          onSelectResetsInput={false}
          onBlurResetsInput={false}
          onCloseResetsInput={false}
          inputProps={{ autoComplete: 'on' }}
          isLoading={this.state.isLoading}
          cache={false}
          loadOptions={this.getClient}
          loadingPlaceholder="Buscando..."
          searchPromptText="Escriba una frase o palabra para realizar una búsqueda"
          ignoreAccents={false}
          className="input"
        />
        <Select
          className="input"
          classNamePrefix="category"
          placeholder="Categoría"
          isClearable={true}
          isSearchable={true}
          name="category"
          onChange={this.handleCategoryChange}
          options={this.state.categories}
        />
        {this.state.servicesShow ? (
          <Select
            className="input"
            classNamePrefix="services"
            placeholder="Servicios"
            isClearable={true}
            isSearchable={true}
            name="services"
            onChange={this.handleServiceChange}
            options={this.state.services}
          />
        ) : (
          ''
        )}
        {this.state.providerShow ? (
          <Select
            className="input"
            classNamePrefix="provider"
            placeholder="Proiveedor"
            isClearable={true}
            isSearchable={true}
            name="provider"
            onChange={this.handleProviderChange}
            options={this.state.providers}
          />
        ) : (
          ''
        )}
        {this.state.mapShow ? (
          <MapServiceLocator
            userId={this.state.clientId}
            setLocation={this.setLocation}
          />
        ) : (
          ''
        )}
        <div className="text-right">
          <button onClick={this.sendTask} className="btn">
            Crear Tarea
          </button>
        </div>
      </form>
    )
  }
}
