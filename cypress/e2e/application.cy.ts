describe('application', () => {
  const columns = ['Todo', 'Doing', 'Done'];

  it('Should test entire application', () => {
    cy.visit('http://localhost:3000');

    // Create New Board
    cy.contains(/create new board/i).click();

    cy.get('[id="modal"]').within(() => {
      cy.get('[id="name"]').type('Web Design');

      cy.contains(/add new column/i).click();

      columns.forEach((column, i) => {
        cy.get(`[id="column${i + 1}"]`).type(column);
      });

      cy.contains(/create new board/i).click();
    });

    cy.get('h1').contains('Web Design').should('exist');

    // Create New Task
    cy.contains(/add new task/i).click();

    cy.get('[id="modal"]').within(() => {
      cy.get('[id="title"]').type('Header of a page');
      cy.get('[id="description"]').type('Design of the main header.');
      cy.get('[id="subtask1"]').type('Logo');
      cy.get('[id="subtask2"]').type('Navigation');
      cy.contains(/add new subtask/i).click();
      cy.get('[id="subtask3"]').type('Cart');
      cy.get('[id="status"]').click();

      cy.get('[id="dropdown"]').within(() => {
        columns.forEach((column) => {
          cy.get(`[value="${column}"]`);
        });

        cy.get(`[value="${columns[1]}"]`).click();
      });

      cy.contains(/create task/i).click();
    });

    // View Created Task
    cy.get(`[id="${columns[1]}"]`).within(() => {
      cy.contains('Header of a page').click();
    });

    cy.get('[id="modal"]').within((modal) => {
      // Complete Subtasks
      cy.contains(/subtasks \(0 of 3\)/i);
      cy.contains('Logo').click();
      cy.contains(/subtasks \(1 of 3\)/i);
      cy.contains('Navigation').click();
      cy.contains(/subtasks \(2 of 3\)/i);
      cy.contains('Cart').click();
      cy.contains(/subtasks \(3 of 3\)/i);

      // Change Task Status
      cy.get('[id="status"]').click();
      cy.get(`[value="${columns[2]}"]`).click();

      // Close Modal
      cy.get('div').first().trigger('keydown', { key: 'Escape' });
    });

    // Search for the task inside its new status column and view it
    cy.get(`[id="${columns[2]}"]`).within(() => {
      cy.contains('Header of a page').click();
    });

    cy.get('[id="modal"]').within(() => {
      // Edit Task
      cy.get('[id="ellipsis"]').click();
      cy.get('[value="Edit Task"]').click();

      cy.get('[id="title"]').type('{selectall} {backspace}Page header');
      cy.contains(/save changes/i).click();

      cy.contains('Page header').should('exist');

      // Delete Task
      cy.get('[id="ellipsis"]').click();
      cy.get('[value="Delete Task"]').click();
      cy.get('button')
        .contains(/delete/i)
        .click();
    });

    cy.contains('Page header').should('not.exist');

    // Edit Board
    cy.get('[aria-label="More"]').click();
    cy.get('[value="Edit Board"]').click();

    cy.get('[id="modal"]').within(() => {
      cy.get('[id="name"]').type('{selectall} {backspace}Website Design');
      cy.get(`[title="Remove '${columns[0]}'"]`).click();
      cy.contains(/save changes/i).click();
    });

    cy.get(`[id="${columns[0]}"]`).should('not.exist');
    cy.get(`[id="${columns[1]}"]`).should('exist');
    cy.get(`[id="${columns[2]}"]`).should('exist');

    // Delete Board
    cy.get('[aria-label="More"]').click();
    cy.get('[value="Delete Board"]').click();

    cy.get('[id="modal"]').within(() => {
      cy.get('button')
        .contains(/delete/i)
        .click();
    });

    cy.get('h1').contains('Website Design').should('not.exist');
  });
});
