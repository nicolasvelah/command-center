import React from 'react'
import ReactExport from 'react-data-export'

const ExcelFile = ReactExport.ExcelFile
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn

export default class ExcelDownload extends React.Component {
  render() {
    const items = this.props.items
      .filter(item => this.props.filterItems(item))
      .map(item => {
        return item
      })
    return (
      <ExcelFile
        element={<button className="downloadExcel">Descargar Excel</button>}
        filename="ComandCenter-Orders-PasHq"
      >
        <ExcelSheet data={items} name="Ordenes">
          <ExcelColumn label="Id" value="id" />
          <ExcelColumn label="Creada el" value="createdAt" />
          <ExcelColumn label="Latitud" value="lat" />
          <ExcelColumn label="Logitud" value="len" />
          <ExcelColumn label="Prioridad" value="priority" />
          <ExcelColumn
            label="Cliente"
            value={col => col.client.name + ' ' + col.client.lastName}
          />
          <ExcelColumn
            label="Cliente nacimiento"
            value={col => col.client.birthday}
          />
          <ExcelColumn
            label="Cliente tipo de sangre"
            value={col => col.client.bloodType}
          />
          <ExcelColumn label="Cliente pais" value={col => col.client.country} />
          <ExcelColumn
            label="Cliente provincia"
            value={col => col.client.province}
          />
          <ExcelColumn label="Cliente ciudad" value={col => col.client.city} />
          <ExcelColumn label="Cliente email" value={col => col.client.email} />
          <ExcelColumn label="Cliente CI" value={col => col.client.idCard} />
          <ExcelColumn
            label="Cliente telefono"
            value={col => col.client.phone}
          />
          <ExcelColumn
            label="Proveedor"
            value={col => col.provider.busnessName}
          />
          <ExcelColumn label="Provider rate" value={col => col.provider.rate} />
          <ExcelColumn
            label="Proveedor usuario"
            value={col =>
              col.provider.user.name + ' ' + col.provider.user.lastName
            }
          />
          <ExcelColumn
            label="Proveedor usuario email"
            value={col => col.provider.user.email}
          />
          <ExcelColumn
            label="Proveedor usuario pais"
            value={col => col.provider.user.country}
          />
          <ExcelColumn
            label="Operador"
            value={col => col.operator.name + ' ' + col.operator.lastName}
          />
          <ExcelColumn
            label="Operador email"
            value={col => col.operator.email}
          />
          <ExcelColumn
            label="Operador pais"
            value={col => col.operator.country}
          />
          <ExcelColumn label="Servicio" value={col => col.service.name} />
          <ExcelColumn
            label="Servicio Categoria"
            value={col => col.service.categories.name}
          />
          <ExcelColumn label="Estado" value={col => col.status.name} />
        </ExcelSheet>
      </ExcelFile>
    )
  }
}
