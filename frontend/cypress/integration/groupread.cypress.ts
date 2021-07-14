describe('groupread', function() {
  beforeEach(function() {
    cy.visit('http://localhost:3000')
  })

  it('opens the homepage', function() {
    cy.contains('Read books with your friends.')
  })
})