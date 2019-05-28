import React, { Component } from 'react'
import axios from 'axios'
import { getUser } from '../../services/auth'
import Select from 'react-select'
import styled from 'styled-components'
import star from '../../images/star-full.svg'
import { changeOrderProvider } from '../../services/helpers'

const Error = styled.div`
  color: red;
  font-size: 12px;
  position: absolute;
  top: 34px;
  left: 0;
`

const ProviderItemSearch = styled.div`
  overflow: auto;
  height: 340px;
  .providerItemSearch {
    width: 90%;
    border: 1px solid #eee;
    padding: 10px;
    margin-left: 1%;
    font-size: 12px;
    line-height: 13px;
    h3 {
      font-size: 15px;
    }
  }
`
const InputContainer = styled.div``
export default class AsignProvider extends Component {
  validations = {
    category: { required: true },
    service: { required: true },
  }
  constructor(props) {
    super(props)
    this.state = {
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
      lat: {
        value: '',
        error: '',
      },
      lnt: {
        value: '',
        error: '',
      },
      providers: [],
    }
  }

  componentDidMount() {
    this.getCategories()
  }

  getCategories = async () => {
    const data = await axios({
      url: `${process.env.API_URL}/categories/app-id/` + this.props.appId,
      method: 'get',
    })
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
        console.log('result.data.providers', result.data.providers)

        await this.setState({ providers: result.data.providers })
      })
      .catch(er => {
        console.log(er)
      })

    return data
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

  sendTask = async (e, providerId) => {
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
      await changeOrderProvider(this.props.orderId, providerId)
      await this.props.updateActivateTask('provider', this.props.orderId)

      this.setState({
        isSending: false,
        errorSending: false,
        service: { value: '' },
        provider: { value: '' },
      })
      //await this.props.getMyTasks()
      //this.props.setModal(this.props.orderId)
      //this.props.activateProviderTools()
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

  render() {
    return (
      <form className="form ProviderAsignsV2">
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
        <h1>Asigna un proveedor</h1>

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
          <ProviderItemSearch>
            <div>
              {typeof this.state.providers !== undefined &&
              this.state.providers.length > 0
                ? this.state.providers.map((provider, key) => (
                    <div key={key} className={'providerItemSearch'}>
                      <h3>{provider.Provider.busnessName}</h3>
                      <div>
                        Representante:{' '}
                        {provider.Provider.user.name +
                          ' ' +
                          provider.Provider.user.lastName}
                      </div>
                      <div>
                        Rate:{' '}
                        {((rows, i) => {
                          const context = provider
                          while (++i <= context.Provider.rate - 1) {
                            rows.push(
                              <div className="stars" key={i}>
                                <img src={star} alt="rate" />
                              </div>
                            )
                          }
                          return rows
                        })([], 0, 10)}
                      </div>
                      <div>Telefono: {provider.Provider.user.phone}</div>
                      <div>Estado: {provider.Provider.user.appState}</div>
                      <div>País: {provider.Provider.user.country}</div>
                      <div>
                        Ciudad:{' '}
                        {provider.Provider.user.city !== null
                          ? provider.Provider.user.city
                          : 'Sin definir'}
                      </div>
                      <div className="text-left">
                        {/*<button className="btn ma-right-5">Mapa</button>
                        <button className="btn ma-right-5">Contactar</button>*/}
                        <button
                          onClick={e => {
                            e.preventDefault()
                            this.sendTask(e, provider.providerId)
                          }}
                          className="btn b-verde"
                        >
                          Asignar
                        </button>
                      </div>
                    </div>
                  ))
                : ''}
            </div>
          </ProviderItemSearch>
        ) : (
          ''
        )}
      </form>
    )
  }
}
