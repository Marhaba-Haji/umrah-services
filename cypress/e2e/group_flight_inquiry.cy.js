describe("Group Flight Inquiry Flow", () => {
  it("should submit a group flight inquiry and show success", () => {
    cy.visit("/group-flights");
    cy.get('input[placeholder="Enter departure city"]').type("Karachi");
    cy.get('input[placeholder="Enter destination city"]').type("Jeddah");
    cy.get('input[type="date"]').first().type("2024-12-01");
    cy.get('input[type="email"]').type("test@example.com");
    cy.get('input[type="tel"]').type("1234567890");
    cy.get("button").contains("Enquire Now").click();
    cy.contains("Your group flight inquiry has been submitted").should("exist");
  });
});
