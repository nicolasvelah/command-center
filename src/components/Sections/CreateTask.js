import React, { Component } from 'react'
import axios from 'axios'
import { getUser } from '../../services/auth'
import Select, { Async } from 'react-select'
import styled from 'styled-components'
import MapServiceLocator from '../Maps/MapServiceLocator'

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
const Error = styled.div`
  color: red;
  font-size: 12px;
  position: absolute;
  top: 34px;
  left: 0;
`
const InputContainer = styled.div`
  position: relative;
`
export default class CreateTask extends Component {
  validations = {
    operator: { required: true },
    client: { required: true },
    category: { required: true },
    service: { required: true },
    provider: { required: true },
  }
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
      operator: {
        value: '',
        error: '',
      },
      client: {
        value: '',
        error: '',
      },
      category: {
        value: '',
        error: '',
      },
      service: {
        value: '',
        error: '',
      },
      provider: {
        value: 0,
        error: '',
      },
      comment: {
        value: '',
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
      priority: {
        value: 3,
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
              return {
                id: client.id,
                label:
                  client.name +
                  ' ' +
                  client.lastName +
                  ' / Telf: ' +
                  client.phone,
                value: client.id,
              }
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
        const options = await result.data.providers.map(provider => {
          return {
            id: provider.providerId,
            label: provider.Provider.busnessName,
            value: provider.providerId,
          }
        })

        this.setState({ providers: options })
      })
      .catch(er => {
        console.log(er)
      })

    return data
  }
  handleClientTypeInputSearch = inputValue => {
    if (this.state.firstTyping) {
      this.setState({ firstTyping: false })
    }
    if (inputValue) {
      this.setState({ keyWord: inputValue })
    }
  }
  handleClientAutoCompleteChange = async option => {
    if (option) {
      await this.setState({
        keyWord: option.label,
        mapShow: true,
        clientId: option.value,
        client: { value: option.value },
      })
    } else {
      await this.setState({ keyWord: '' })
    }

    return option.label
  }
  handleOperatorChange = async option => {
    this.setState({
      operator: { value: option.value },
    })
  }
  handleCategoryChange = async option => {
    this.getServices(option.value)
    this.setState({
      servicesShow: true,
      providerShow: false,
      category: { value: option.value },
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
    await this.setState({
      provider: { value: option.value },
    })
  }
  handlePriorityChange = async option => {
    this.setState({
      priority: { value: option.value },
    })
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
  sendTask = async e => {
    e.preventDefault()
    this.clearFormErrors()
    const newState = this.state
    let hasError = false
    const context = this
    Object.keys(this.validations).forEach(field => {
      for (let rule in this.validations[field]) {
        if (rule === 'required') {
          if (this.validations[field].required === true) {
            if (context.state[field].value === '') {
              hasError = true
              newState[field].error = 'Campo Obligatorio'
              break
            }
          }
        }
      }
    })
    this.setState(newState)

    if (hasError) {
      this.setState({ isSending: false })
      console.log('Tiene errores')
      return
    }
    try {
      await axios.post(
        `${process.env.API_URL}/orders/addOrder`,
        {
          clientId: this.state.clientId,
          serviceId: this.state.service.value,
          providerId: this.state.provider.value,
          comment: this.state.comment.value,
          operatorId: this.state.operator.value,
          priority: this.state.priority.value,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': getUser().token,
            lat: this.state.lat.value,
            len: this.state.lnt.value,
          },
        }
      )
      this.setState({
        isSending: false,
        errorSending: false,
        clientId: '',
        service: { value: '' },
        provider: { value: '' },
        comment: { value: '' },
        operator: { value: '' },
      })
    } catch (err) {
      console.log(err)
      this.setState({ isSending: false, errorSending: true })
    }
    return true
  }
  clearFormErrors = async () => {
    const newState = this.state
    await Object.keys(this.validations).forEach(field => {
      newState[field].error = ''
    })
    await this.setState(newState)
  }
  setComment = e => {
    this.setState({
      comment: { value: e.target.value },
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
        <h1 className="newTaskTitle">Nueva Taréa</h1>
        <InputContainer>
          <Select
            className="input"
            classNamePrefix="operator"
            placeholder="Operador"
            isClearable={true}
            isSearchable={true}
            name="operator"
            options={this.state.operators}
            onChange={this.handleOperatorChange}
          />
          <Error>{this.state.operator.error}</Error>
        </InputContainer>
        <InputContainer>
          <StyledAutocomplete
            name="client"
            autosize={true}
            noResultsText="No se han encontrado clientes"
            placeholder="Buscar Cliente"
            clearValueText="Limpiar Campo"
            onChange={this.handleClientAutoCompleteChange}
            onInputChange={this.handleClientTypeInputSearch}
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
          <Error>{this.state.client.error}</Error>
        </InputContainer>
        <InputContainer>
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
          <Error>{this.state.category.error}</Error>
        </InputContainer>
        {this.state.servicesShow ? (
          <InputContainer>
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
            <Error>{this.state.service.error}</Error>
          </InputContainer>
        ) : (
          ''
        )}
        {this.state.providerShow ? (
          <InputContainer>
            <Select
              className="input"
              classNamePrefix="provider"
              placeholder="Proveedor"
              isClearable={true}
              isSearchable={true}
              name="provider"
              onChange={this.handleProviderChange}
              options={this.state.providers}
            />
            <Error>{this.state.provider.error}</Error>
          </InputContainer>
        ) : (
          ''
        )}
        <InputContainer>
          <Select
            className="input"
            classNamePrefix="priority"
            placeholder="Prioridad"
            isClearable={true}
            isSearchable={true}
            name="priority"
            onChange={this.handlePriorityChange}
            options={[
              { value: 1, label: 'Alta' },
              { value: 2, label: 'Media' },
              { value: 3, label: 'Baja' },
            ]}
            defaultValue={{ value: 3, label: 'Baja' }}
          />
          <Error>{this.state.category.error}</Error>
        </InputContainer>
        <textarea onChange={this.setComment} placeholder="Comentario" />
        {this.state.mapShow ? (
          <MapServiceLocator
            userId={this.state.clientId}
            providerId={this.state.provider.value}
            provider={this.state.provider}
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
