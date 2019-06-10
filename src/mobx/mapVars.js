import { observable, action } from 'mobx'
import { getProviders } from '../services/wsConect'

export default class MapVars {
  @observable clientsDsWS = null
  @observable clientIdWS = null
  @observable providerDsWS = null
  @observable providerWS = observable([])
  @observable WSData = observable([])

  @action.bound setClients(client) {
    if (client !== null) {
      this.clientIdWS = client
    }
    //console.log('client', client)
  }
  @action.bound disconectClient(clientId) {
    if (clientId !== null) {
      //console.log('client diconect', clientId)
      this.clientsDsWS = clientId
    }
  }
  @action.bound initProvider = async (appID, country) => {
    const providers = await getProviders(appID, country)
    await Promise.all(providers.data)
    //console.log('initProvider providers.data', providers.data)
    this.providerWS.push({
      appID,
      country,
      providers: providers.data,
    })
    return true
  }
  @action.bound setProvider(provider) {
    if (provider !== null) {
      this.providerWS = provider
    }
    //console.log('provider', provider)
  }
  @action.bound onProviderLocation = async (data, APP_ID, country) => {
    let WSActive = false
    let providerExistGlobal = false

    data.connected = true

    let ProvidersActiveServices = []

    const providerWS = this.providerWS.map(item => {
      if (item.appID === APP_ID && item.country === country) {
        WSActive = true
        item.providers = item.providers.map(provider => {
          if (provider.id === data.id) {
            providerExistGlobal = true
            provider = data
          }

          provider.info.services.map(service => {
            if (ProvidersActiveServices.indexOf(service.servicio) === -1) {
              ProvidersActiveServices.push(service.servicio)
            }
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

    await Promise.all(providerWS)

    if (WSActive) {
      this.providerWS = providerWS
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
    console.log('$$$------------------- entrada data', data)
    console.log('entrada APP_ID', APP_ID)
    console.log('entrada country', country)
    if (providerId !== null) {
      let WSActive = false
      const WSData = this.WSData.map(item => {
        console.log('Bucle 1 WSData item', item)
        if (item.APP_ID === APP_ID && item.country === country) {
          console.log(
            'Bucle 1 WSData pasa if item.APP_ID === APP_ID && item.country',
            item.APP_ID === APP_ID && item.country
          )
          WSActive = true
          item.providers = item.providers.map(provider => {
            console.log('Bucle 2 item.providers provider', provider)
            if (provider.id === providerId) {
              console.log(
                'Bucle 2 pasa if provider.id === providerId',
                provider.id === providerId
              )
              provider.inService = inService
            }
            console.log('return rovider', provider)
            return provider
          })
        }
        return item
      })

      await Promise.all(WSData)

      if (WSActive) {
        console.log(
          '$$$-------------------- salida pasa if (WSActive)',
          WSActive
        )
        this.WSData = WSData
        this.providerDsWS = providerId
      }
    }
  }
  @action.bound setWSData(data) {
    if (data !== null) {
      this.WSData.push(data)
    }
    //console.log('WSData', data)
  }
}
