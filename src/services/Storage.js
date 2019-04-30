export const save = (varName, data) =>
  window.localStorage.setItem(varName, JSON.stringify(data))

export const get = varName =>
  window.localStorage.getItem(varName) !== ''
    ? JSON.parse(window.localStorage.getItem(varName))
    : []
