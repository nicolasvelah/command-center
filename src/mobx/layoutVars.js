import { observable, action } from 'mobx'

export default class LayoutVars {
  @observable paddingLeftContent = 50
  @observable menuActive = false

  @action.bound setGlobalPaddingLeftContent() {
    if (this.menuActive) {
      this.paddingLeftContent = 50
    } else {
      this.paddingLeftContent = 180
    }
    this.menuActive = !this.menuActive
  }
}
