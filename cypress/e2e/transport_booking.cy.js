describe('Transport Booking Flow', () => {
  it('should load vehicles, filter, add to cart, and show cart modal', () => {
    cy.visit('/TransportBooking');
    // Wait for vehicles to load
    cy.contains('Available Transport Vehicles');
    // Check filter sidebar
    cy.contains('Filters');
    // Select a vehicle type filter if available
    cy.get('aside').within(() => {
      cy.get('input[type="checkbox"]').first().check({ force: true });
    });
    // Add first vehicle to cart
    cy.get('button').contains('Add to Cart').first().click();
    // Open cart modal
    cy.get('button').contains('Cart').click();
    // Check cart modal content
    cy.contains('Your Ziarath Cart');
    cy.get('input[type="number"]').should('exist');
    cy.get('button').contains('Proceed to Booking').should('exist');
  });
}); 