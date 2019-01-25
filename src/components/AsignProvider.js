import React, { Component } from 'react'
import axios from 'axios'
import { getUser } from '../services/auth'
import Select from 'react-select'
import styled from 'styled-components'

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
export default class AsignProvider extends Component {
  validations = {
    category: { required: true },
    service: { required: true },
    provider: { required: true },
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
    }
  }

  componentDidMount() {
    this.getCategories()
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
      console.log('this.props.orderId', this.props.orderId)
      console.log('this.state.provider.value', this.state.provider.value)
      await axios.post(
        `${process.env.API_URL}/orders/changeOrderProvider`,
        {
          orderId: this.props.orderId,
          providerId: this.state.provider.value,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': getUser().token,
          },
        }
      )
      this.setState({
        isSending: false,
        errorSending: false,
        service: { value: '' },
        provider: { value: '' },
      })
      await this.props.getMyTasks()
      this.props.setModal(this.props.orderId)
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

        <div className="text-right">
          <button onClick={this.sendTask} className="btn">
            Asignar
          </button>
        </div>
      </form>
    )
  }
}
