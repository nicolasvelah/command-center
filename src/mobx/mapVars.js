import { observable, action } from 'mobx'

export default class MapVars {
  @observable clientsDsWS = null
  @observable clientIdWS = null
  @observable providerDsWS = null
  @observable providerWS = null

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
    console.log('provider XXXXXX', provider)
  }
  @action.bound disconectProvider(providerId) {
    if (providerId !== null) {
      console.log('provider diconect', providerId)
      this.providerDsWS = providerId
    }
  }
}
