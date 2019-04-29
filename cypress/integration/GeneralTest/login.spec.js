describe('Test login CC', () => {
  it('Visitar la URL login', () => {
    cy.visit('https://cc.itzam.ec/app/login')
    cy.get('input[type="text"]')
      .type('operador1@pruebas.com')
      .should('have.value', 'operador1@pruebas.com')
    cy.get('input[type="password"]')
      .type('12345')
      .should('have.value', '12345')
    cy.get('input[type="submit"]').click()
  })
})
