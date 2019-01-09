import React, { Component } from 'react'
import axios from 'axios'
import { getUser } from '../services/auth'
import Select, { Async } from 'react-select'
import styled from 'styled-components'

const StyledAutocomplete = styled(Async)`
  width: 87%;
  float: left;

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
    }
  }

  componentDidMount() {
    this.getOperators()
  }

  getOptions = (inputValue, callback) => {
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
        console.log('Operatorts')
        console.log(result)
        const options = await result.data.users.map(user => {
          return { id: user.id, label: user.name, value: user.id }
        })

        this.setState({ operators: options })
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
      await this.setState({ keyWord: option.label })
    } else {
      await this.setState({ keyWord: '' })
    }

    return option.label
  }

  render() {
    return (
      <form>
        Formulario de tareas
        <Select
          className="basic-single"
          classNamePrefix="Busca Operador"
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
          loadOptions={this.getOptions}
          loadingPlaceholder="Buscando..."
          searchPromptText="Escriba una frase o palabra para realizar una búsqueda"
          ignoreAccents={false}
        />
        <Select
          className="basic-single"
          classNamePrefix="Busca Categoría"
          isClearable={true}
          isSearchable={true}
          name="category"
          options={this.state.categories}
        />
      </form>
    )
  }
}
