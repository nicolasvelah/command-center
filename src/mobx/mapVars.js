import { observable, action } from 'mobx'

export default class MapVars {
  @observable clientsDsWS = null
  @observable clientIdWS = null
  @observable providerDsWS = null
  @observable providerWS = null
  @observable WSData = observable([])

  @action.bound setClients(client) {
    if (client !== null) {
      this.clientIdWS = client
    }
    console.log('client', client)
  }
  @action.bound disconectClient(clientId) {
    if (clientId !== null) {
      console.log('client diconect', clientId)
      this.clientsDsWS = clientId
    }
  }
  @action.bound setProvider(provider) {
    if (provider !== null) {
      this.providerWS = provider
    }
    console.log('provider', provider)
  }
  @action.bound onProviderLocation = async (data, APP_ID, country) => {
    let WSActive = false
    let providerExistGlobal = false

    data.connected = true

    let ProvidersActiveServices = []
    const WSData = this.WSData.map(item => {
      if (item.APP_ID === APP_ID && item.country === country) {
        WSActive = true
        item.providers = item.providers.map(provider => {
          if (provider.id === data.id) {
            providerExistGlobal = true
            provider = data
          }

          provider.info.services.map(service => {
            ProvidersActiveServices.indexOf(service.servicio) === -1
              ? ProvidersActiveServices.push(service.servicio)
              : console.log(
                  '2. Ya existe en la lista ProvidersActiveServices',
                  service.servicio
                )
            return service
          })
          return provider
        })
        item.ProvidersActiveServices = ProvidersActiveServices
        if (!providerExistGlobal) {
          item.providers.push(data)
        }
      }
      return item
    })

    await Promise.all(WSData)

    if (WSActive) {
      this.WSData = WSData
    }
  }
  @action.bound disconectProvider = async (providerId, APP_ID, country) => {
    if (providerId !== null) {
      let WSActive = false
      const WSData = this.WSData.map(item => {
        if (item.APP_ID === APP_ID && item.country === country) {
          WSActive = true
          item.providers = item.providers.map(provider => {
            if (provider.id === providerId) {
              provider.connected = false
            }
            return provider
          })
        }
        return item
      })

      await Promise.all(WSData)

      if (WSActive) {
        this.WSData = WSData
        this.providerDsWS = providerId
      }
    }
  }
  @action.bound inServiceProvider = async (data, APP_ID, country) => {
    const { id, inService } = data
    const providerId = id
    if (providerId !== null) {
      let WSActive = false
      const WSData = this.WSData.map(item => {
        if (item.APP_ID === APP_ID && item.country === country) {
          WSActive = true
          item.providers = item.providers.map(provider => {
            if (provider.id === providerId) {
              provider.inService = inService
            }
            return provider
          })
        }
        return item
      })

      await Promise.all(WSData)

      if (WSActive) {
        this.WSData = WSData
        this.providerDsWS = providerId
      }
    }
  }
  @action.bound setWSData(data) {
    if (data !== null) {
      this.WSData.push(data)
    }
    console.log('WSData', data)
  }
}
