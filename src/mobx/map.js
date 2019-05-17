import { observable, action } from 'mobx'

export default class Map {
  id = Math.random()
  @observable clientsWS = []
  @observable providerWS = []

  @action setClients(clients) {
    this.clientsWS = clients
  }
  @action setProviders(providers) {
    this.providerWS = providers
  }
}
