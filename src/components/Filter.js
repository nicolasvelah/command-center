import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  width: 50%;
  margin-left: 20px;
  font-family: 'Yantramanav', sans-serif;
`

const FilterOption = styled.div`
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
`

const Filter = ({ filterOption, onFilterChange }) => {
  return (
    <Container>
      <FilterOption>
        <label htmlFor="branchFilter">Filtrar:</label>
        <input
          name="branchFilter"
          id="branchFilter"
          defaultValue={filterOption}
          onChange={onFilterChange}
          placeholder="Buscar Tarea"
        />
      </FilterOption>
    </Container>
  )
}

export default Filter
