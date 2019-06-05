import React from 'react'
import Svg from './svg'

export default class ProviderItemSearchFilter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      favorite: this.props.favorite,
    }
    this.setFavorite = this.setFavorite.bind(this)
  }

  setFavorite = async id => {
    const favorite = !this.state.favorite
    this.props.addRemoveFavorite(this.props.orderId, id, favorite)
    this.props.updateProvidersFavorite(id, favorite)
    this.setState({ favorite })
  }

  render() {
    const {
      item,
      centerActor,
      calculateAndDisplayRoute,
      setActiveProvider,
      activeProvider,
      activeProviderChat,
    } = this.props

    if (!item.inService) {
      item.inService = false
    }
    return (
      <div
        style={{ color: '#333' }}
        id={'providerItem_' + item.id}
        className={
          (activeProvider === item.id ? 'activeProv' : 'inactiveProv') +
          ' providerItem'
        }
        onClick={e => {
          setActiveProvider(item.id)
          centerActor(item.lat, item.lng)
          activeProviderChat(item.id)
        }}
      >
        <div>
          <span className="rateStart">
            <span className="rateNumber">{item.info.rate}</span>
            <Svg
              title={'Rate'}
              svgClass="ocupyIcon"
              svgFill={'#ffc200'}
              viewBox="0 0 512 512"
              svgPathOne_d={
                'M512 198.525l-176.89-25.704-79.11-160.291-79.108 160.291-176.892 25.704 128 124.769-30.216 176.176 158.216-83.179 158.216 83.179-30.217-176.176 128.001-124.769z'
              }
            />
          </span>
          <b>{item.info.name + ' ' + item.info.lastName}</b>{' '}
          <button
            onClick={e => {
              e.preventDefault()
              this.setFavorite(item.id)
            }}
            className="btnicon btnFavorito"
          >
            <Svg
              title="Favorito"
              svgClass="svgIcon"
              viewBox="0 0 512 512"
              svgFill={!this.state.favorite ? '#333' : '#ed1848'}
              svgPathOne_d={
                !this.state.favorite
                  ? 'M416 149c0-70.25-47.5-85-87.5-85-37.25 0-79.25 40.25-92.25 55.75-6 7.25-18.5 7.25-24.5 0-13-15.5-55-55.75-92.25-55.75-40 0-87.5 14.75-87.5 85 0 45.75 46.25 88.25 46.75 88.75l145.25 140 145-139.75c0.75-0.75 47-43.25 47-89zM448 149c0 60-55 110.25-57.25 112.5l-155.75 150c-3 3-7 4.5-11 4.5s-8-1.5-11-4.5l-156-150.5c-2-1.75-57-52-57-112 0-73.25 44.75-117 119.5-117 43.75 0 84.75 34.5 104.5 54 19.75-19.5 60.75-54 104.5-54 74.75 0 119.5 43.75 119.5 117z'
                  : 'M224 416c-4 0-8-1.5-11-4.5l-156-150.5c-2-1.75-57-52-57-112 0-73.25 44.75-117 119.5-117 43.75 0 84.75 34.5 104.5 54 19.75-19.5 60.75-54 104.5-54 74.75 0 119.5 43.75 119.5 117 0 60-55 110.25-57.25 112.5l-155.75 150c-3 3-7 4.5-11 4.5z'
              }
            />
          </button>
        </div>
        <div id={'ProviderRouteDataButton_' + item.id} className="GetTheRoute">
          <span
            onClick={e =>
              calculateAndDisplayRoute(item.lat, item.lng, item.id, false)
            }
          >
            Datos de ruta
          </span>
        </div>
        <div
          className={
            (item.timeColorClass ? item.timeColorClass : '') +
            ' ProviderRouteData'
          }
          id={'ProviderRouteData_' + item.id}
          style={{ display: 'none' }}
        >
          <span className="time">{item.time}</span>
          {' / '}
          <span className="km">{item.km} km</span>
          {' / '}
          <span
            style={{
              background: item.colorRoute,
              color: '#fff',
              padding: '2px 5px',
              fontSize: '9px',
              fontWeight: 'normal',
            }}
          >
            Ruta
          </span>
        </div>
        <Svg
          title={item.connected ? 'conectado' : 'desconectado'}
          svgClass="conectIcon"
          viewBox="0 0 512 512"
          svgFill={item.connected ? '#53a93f' : '#c62b20'}
          svgPathOne_d="M416 368h-96v80h-128v-80h-96v-192h64v-128h64v128h64v-128h64v128h64v192z"
        />
        {'/ '}
        <Svg
          title={item.inService ? 'Ocupado' : 'Libre'}
          svgClass="ocupyIcon"
          svgFill={item.inService ? '#c62b20' : '#53a93f'}
          viewBox="0 0 512 512"
          svgPathOne_d={
            item.inService
              ? 'M256 0c-141.385 0-256 114.615-256 256s114.615 256 256 256 256-114.615 256-256-114.615-256-256-256zM329.372 374.628l-105.372-105.373v-141.255h64v114.745l86.628 86.627-45.256 45.256z'
              : 'M432 64l-240 240-112-112-80 80 192 192 320-320z'
          }
        />

        {'/  '}
        <b>{item.distance} m de dist.</b>
        <div>
          {item.info.services.map(service => (
            <span key={service.serviceId}>
              <img
                src={service.icon}
                alt={service.category}
                className="cateoryImageProviderItem"
              />
              {service.servicio + ', '}
            </span>
          ))}
        </div>
        <div className="ProviderItemTools">
          <button
            onClick={e => {
              e.preventDefault()
              activeProviderChat(item.id)
            }}
            className="btnicon"
          >
            <Svg
              title={'Chat'}
              svgClass="svgIcon"
              svgFill={activeProvider === item.id ? '#53a93f' : '#333'}
              viewBox="0 0 512 512"
              svgPathOne_d={
                'M256 32c141.385 0 256 93.125 256 208s-114.615 208-256 208c-13.578 0-26.905-0.867-39.912-2.522-54.989 54.989-120.625 64.85-184.088 66.298v-13.458c34.268-16.789 64-47.37 64-82.318 0-4.877-0.379-9.665-1.082-14.348-57.898-38.132-94.918-96.377-94.918-161.652 0-114.875 114.615-208 256-208z'
              }
            />
          </button>
          <button
            onClick={e => {
              e.preventDefault()
              this.props.activeProviderCall(
                item.info.name + ' ' + item.info.lastName,
                item.info.phone
              )
            }}
            className="btnicon"
          >
            <Svg
              title={'Llamada'}
              svgClass="svgIcon"
              svgFill={'#333'}
              viewBox="0 0 512 512"
              svgPathOne_d={
                'M352 320c-32 32-32 64-64 64s-64-32-96-64-64-64-64-96 32-32 64-64-64-128-96-128-96 96-96 96c0 64 65.75 193.75 128 256s192 128 256 128c0 0 96-64 96-96s-96-128-128-96z'
              }
            />
          </button>
          <button
            onClick={e => {
              e.preventDefault()
              this.props.activeProviderNotification(item.id)
            }}
            className="btnicon"
          >
            <Svg
              title={'Notificar'}
              svgClass="svgIcon"
              svgFill={'#333'}
              viewBox="0 0 512 512"
              svgPathOne_d={
                'M512.75 400c0-144-128-112-128-224 0-9.28-0.894-17.21-2.524-23.964-8.415-56.509-46.078-101.86-94.886-115.68 0.433-1.974 0.66-4.016 0.66-6.105 0-16.639-14.4-30.251-32-30.251s-32 13.612-32 30.25c0 2.090 0.228 4.132 0.66 6.105-54.735 15.499-95.457 70.649-96.627 136.721-0.020 0.96-0.033 1.932-0.033 2.923 0 112.001-128 80.001-128 224.001 0 38.113 85.295 69.998 199.485 78.040 10.762 20.202 32.028 33.96 56.515 33.96s45.754-13.758 56.515-33.96c114.19-8.042 199.485-39.927 199.485-78.040 0-0.114-0.013-0.228-0.014-0.341l0.764 0.341zM413.123 427.048c-27.115 7.235-59.079 12.438-93.384 15.324-2.852-32.709-30.291-58.372-63.739-58.372s-60.887 25.663-63.739 58.372c-34.304-2.886-66.269-8.089-93.384-15.324-37.315-9.957-55.155-21.095-61.684-27.048 6.529-5.953 24.369-17.091 61.684-27.048 43.386-11.576 99.186-17.952 157.123-17.952s113.737 6.376 157.123 17.952c37.315 9.957 55.155 21.095 61.684 27.048-6.529 5.953-24.369 17.091-61.684 27.048z'
              }
            />
          </button>
          <button
            onClick={e => {
              e.preventDefault()
              this.props.asignProvider(item.id)
            }}
            className="btnicon btnassign"
          >
            <Svg
              title={'Asignar esta Historia a este proveedor.'}
              svgClass="svgIcon"
              svgFill={'#999'}
              viewBox="0 0 512 512"
              svgPathOne_d={'M480 304l-144 144-48-48-32 32 80 80 176-176z'}
              svgPathTow_d={
                'M224 384h160v-57.564c-33.61-19.6-78.154-33.055-128-37.13v-26.39c35.249-19.864 64-69.386 64-118.916 0-79.529 0-144-96-144s-96 64.471-96 144c0 49.53 28.751 99.052 64 118.916v26.39c-108.551 8.874-192 62.21-192 126.694h224v-32'
              }
            />
          </button>
        </div>
      </div>
    )
  }
}
