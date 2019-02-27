import React, { Component } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { getUser } from '../services/auth'
import { Async } from 'react-select'

const StyledAutocomplete = styled(Async)`
  .Select-control {
    border: solid 1px ${props => props.theme.gray};
    border-radius: 0 !important;
    box-shadow: none;
    color: ${props => props.theme.black};
    height: 41px;

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

export default class SearchPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      keySearch: {
        value: '',
        error: '',
      },
    }
  }

  getKeySearch = (inputValue, callback) => {
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

  handleKeySearchTypeInputSearch = inputValue => {
    if (this.state.firstTyping) {
      this.setState({ firstTyping: false })
    }
    if (inputValue) {
      this.setState({ keyWord: inputValue })
    }
  }
  handleKeySearchAutoCompleteChange = async option => {
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
  render() {
    return (
      <div>
        <InputContainer>
          <StyledAutocomplete
            name="keySearch"
            autosize={true}
            noResultsText="No se han encontrado resultados"
            placeholder="Buscar"
            clearValueText="Limpiar Campo"
            onChange={this.handleKeySearchAutoCompleteChange}
            onInputChange={this.handleKeySearchTypeInputSearch}
            onSelectResetsInput={false}
            onBlurResetsInput={false}
            onCloseResetsInput={false}
            inputProps={{ autoComplete: 'on' }}
            isLoading={this.state.isLoading}
            cache={false}
            loadOptions={this.getKeySearch}
            loadingPlaceholder="Buscando..."
            searchPromptText="Escriba una frase o palabra para realizar una búsqueda"
            ignoreAccents={false}
            className="input"
          />
          <Error>{this.state.keySearch.error}</Error>
        </InputContainer>
      </div>
    )
  }
}
