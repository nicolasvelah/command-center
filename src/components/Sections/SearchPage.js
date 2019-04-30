import React, { Component } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { getUser } from '../../services/auth'

import '../../assets/css/search.css'

const StyledAutocomplete = styled.input`
  width: 100%;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid hsl(0, 0%, 80%);
  margin-bottom: 30px;
`
const InputContainer = styled.div`
  position: relative;
  margin-left: 50px;
  margin-top: 13px;
`

export default class SearchPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      keyWord: '',
      error: false,
      items: [],
      clienteArray: [],
      providerArray: [],
      operatorArray: [],
    }
  }

  getKeySearch = async () => {
    console.log('Entra a API')
    if (this.state.isLoading && this.state.keyWord !== '') {
      console.log('cumple requisitos inicia consulta')
      try {
        await axios
          .post(
            `${process.env.API_URL}/gs/${this.state.keyWord}`,
            {
              limit: 100,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'x-access-token': getUser().token,
              },
            }
          )
          .then(async result => {
            console.log(
              'this.state.keyWord en result/---------',
              this.state.keyWord
            )
            if (this.state.keyWord !== '') {
              console.log('Result', result.data.results)
              await this.setState({
                items: result.data.results,
                isLoading: false,
                error: false,
                clienteArray: [],
                providerArray: [],
                operatorArray: [],
              })
              console.log('estado items', this.state.items)
            } else {
              console.log('vacio pero consulto/---------')
              this.setState({
                isLoading: false,
                error: false,
                items: [],
                clienteArray: [],
                providerArray: [],
                operatorArray: [],
              })
            }
          })
      } catch (er) {
        console.error(er)
        this.setState({
          items: [],
          isLoading: false,
          error: true,
          clienteArray: [],
          providerArray: [],
          operatorArray: [],
        })
      }
    } else {
      console.log('vacio else/---------')
      this.setState({
        items: [],
        isLoading: false,
        error: false,
        clienteArray: [],
        providerArray: [],
        operatorArray: [],
      })
    }
    return
  }

  handleKeySearchAutoCompleteChange = e => {
    if (e.target.value) {
      this.setState({
        keyWord: e.target.value,
      })
    } else {
      this.setState({ keyWord: '' })
    }
    console.log('keyword: ', e.target.value)

    if (!this.state.isLoading) {
      this.setState({ isLoading: true })
      setTimeout(() => {
        console.log('llama api ahora')
        this.getKeySearch()
      }, 3000)
    }
    return
  }

  setArrays = (id, type) => {
    let { clienteArray, providerArray, operatorArray } = this.state
    let response = false
    switch (type) {
      case 'client':
        if (clienteArray.indexOf(id) === -1) {
          clienteArray.push(id)
          response = true
        }
        break
      case 'provider':
        if (providerArray.indexOf(id) === -1) {
          providerArray.push(id)
          response = true
        }
        break
      case 'operator':
        if (operatorArray.indexOf(id) === -1) {
          operatorArray.push(id)
          response = true
        }
        break
      default:
    }
    console.log('clienteArray', clienteArray)
    return response
  }
  render() {
    return (
      <div>
        <InputContainer>
          <StyledAutocomplete
            name="keySearch"
            placeholder="Buscar"
            onChange={this.handleKeySearchAutoCompleteChange}
          />
          {this.state.isLoading ? (
            <div className="loadingSearch">Cargando...</div>
          ) : (
            ''
          )}
          {this.state.error ? <div>Upps... hubo un Error...</div> : ''}
        </InputContainer>
        <div className="searchResults">
          <div className="resultColumn">
            <h2>Ordenes</h2>
            <div className="resultColumnItems">
              {this.state.items.length > 0
                ? this.state.items.map(item => (
                    <div className="resultItem" key={item.id}>
                      <div>
                        <b>id:</b> {item.id}
                      </div>
                      <div>
                        <b>Categoria:</b> {item.service.categories.name}
                      </div>
                      <div>
                        <b>Servicio:</b> {item.service.name}
                      </div>
                      <div>
                        <b>Creada el:</b> {item.createdAt}
                      </div>
                      <div>
                        <b>Estado:</b> {item.status.name}
                      </div>
                      <div>
                        <b>Cliente:</b>{' '}
                        {item.client.name + ' ' + item.client.lastName}
                      </div>
                      <div>
                        <b>Proveedor:</b> {item.provider.busnessName}
                      </div>
                      <div>
                        <b>Operador:</b>{' '}
                        {item.operator.name + ' ' + item.operator.lastName}
                      </div>
                      <div>
                        <b>Pais:</b>{' '}
                      </div>
                      <div>
                        <b>Ciudad:</b>{' '}
                      </div>
                      <div>
                        <b>Direccion:</b>{' '}
                      </div>
                    </div>
                  ))
                : 'No hay resultados'}
            </div>
          </div>
          <div className="resultColumn">
            <h2>Clientes</h2>
            <div className="resultColumnItems">
              {this.state.items.length > 0
                ? this.state.items
                    .filter(item => {
                      return this.setArrays(item.client.id, 'client')
                    })
                    .map(item => (
                      <div className="resultItem" key={item.id}>
                        <div>
                          <b>id:</b> {item.client.id}
                        </div>
                        <div>
                          <b>Nombre:</b>{' '}
                          {item.client.name + ' ' + item.client.lastName}
                        </div>
                        <div>
                          <b>CI:</b> {item.client.idCard}
                        </div>
                        <div>
                          <b>Fecha de nacimiento:</b> {item.client.birthday}
                        </div>
                        <div>
                          <b>Email:</b> {item.client.email}
                        </div>
                        <div>
                          <b>Telefono:</b> {item.client.phone}
                        </div>
                        <div>
                          <b>Pais:</b> {item.client.country}
                        </div>
                        <div>
                          <b>Ciudad:</b> {item.client.city}
                        </div>
                      </div>
                    ))
                : 'No hay resultados'}
            </div>
          </div>
          <div className="resultColumn">
            <h2>Proveedores</h2>
            <div className="resultColumnItems">
              {this.state.items.length > 0
                ? this.state.items
                    .filter(item => {
                      return this.setArrays(item.provider.user.id, 'provider')
                    })
                    .map(item => (
                      <div className="resultItem" key={item.id}>
                        <div>
                          <b>Id:</b> {item.provider.user.id}
                        </div>
                        <div>
                          <b>Proveedor:</b> {item.provider.busnessName}
                        </div>
                        <div>
                          <b>Nombre:</b>
                          {item.provider.user.name +
                            ' ' +
                            item.provider.user.lastName}
                        </div>
                        <div>
                          <b>Estado:</b> {item.provider.user.appState}
                        </div>
                        <div>
                          <b>Email:</b> {item.provider.user.email}
                        </div>
                        <div>
                          <b>Telefono:</b> {item.provider.user.phone}
                        </div>
                        <div>
                          <b>Pais:</b> {item.provider.user.country}
                        </div>
                        <div>
                          <b>Ciudad:</b> {item.provider.user.city}
                        </div>
                      </div>
                    ))
                : 'No hay resultados'}
            </div>
          </div>
          <div className="resultColumn">
            <h2>Operadores</h2>
            <div className="resultColumnItems">
              {this.state.items.length > 0
                ? this.state.items
                    .filter(item => {
                      return this.setArrays(item.operator.id, 'operator')
                    })
                    .map(item => (
                      <div className="resultItem" key={item.id}>
                        <div>
                          <b>Id:</b> {item.operator.id}
                        </div>
                        <div>
                          <b>Nombre:</b>
                          {item.operator.name + ' ' + item.operator.lastName}
                        </div>
                        <div>
                          <b>Email:</b> {item.operator.email}
                        </div>
                        <div>
                          <b>Telefono:</b> {item.operator.phone}
                        </div>
                        <div>
                          <b>Pais:</b> {item.operator.country}
                        </div>
                        <div>
                          <b>Ciudad:</b> {item.operator.city}
                        </div>
                      </div>
                    ))
                : 'No hay resultados'}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
