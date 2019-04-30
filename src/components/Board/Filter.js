import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  width: 50%;
  margin-left: 20px;
  font-family: 'Yantramanav', sans-serif;
`

/*const FilterOption = styled.div`
  padding-top: 10px;

  .sortFilter {
    float: right;
    width: 100%;
    max-width: 300px;
  }

  label {
    text-align: left;
    font-weight: normal;
  }
`*/
const OperatorsContainer = styled.div`
  display: inline-block;
  position: relative;
  button {
    width: 43px;
    height: 43px;
    background: #dedede;
    color: #999;
    border: none;
    border-radius: 50%;
    border: 3px solid #fff;
    text-transform: uppercase;
    margin-right: -5px;
    cursor: pointer;
  }
  .FilterReset {
    background: rgba(185, 30, 30, 0.616);
    color: #fff;
  }
  .btnActive {
    background: rgba(0, 204, 255, 0.767);
    color: #fff;
  }

  .btnAll {
    width: 75px;
    height: 43px;
    border-radius: 20px;
  }
`
const Filter = ({
  filterOption,
  onFilterChange,
  handleFilterOperatorChange,
  operators,
  idClick,
}) => {
  console.log('operators', operators)
  return (
    <Container>
      {/*<FilterOption>
        <label htmlFor="branchFilter">Filtrar:</label>
        <input
          name="branchFilter"
          id="branchFilter"
          defaultValue={filterOption}
          onChange={onFilterChange}
          placeholder="Buscar Tarea"
        />
      </FilterOption>*/}
      <label htmlFor="branchFilter">Operadores: </label>
      {operators.map(operator => (
        <OperatorsContainer key={operator.id}>
          <button
            onClick={() => handleFilterOperatorChange(operator.id)}
            className={
              'operatorFilter' + (idClick === operator.id ? ' btnActive' : '')
            }
          >
            {operator.name.charAt(0) + operator.lastName.charAt(0)}
            <div className="dropdownOperatorDataFilter">
              {operator.name + ' ' + operator.lastName} <br />
              <b>Email:</b> {operator.email} <br />
              <b>Teléfono:</b> {operator.phone}
              <br />
              <b>Tipo:</b> {operator.type}
            </div>
          </button>
        </OperatorsContainer>
      ))}
      <OperatorsContainer>
        {idClick !== null ? (
          <button
            onClick={() => handleFilterOperatorChange(null)}
            className={
              'FilterReset' + (idClick === null ? ' btnActive' : '') + ' '
            }
          >
            X
          </button>
        ) : (
          ''
        )}
      </OperatorsContainer>
    </Container>
  )
}

export default Filter
