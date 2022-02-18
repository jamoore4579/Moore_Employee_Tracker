const db = require('./db/connection');
const table = require('console.table');
const figlet = require('figlet');
const inquirer = require('inquirer');

// database connection
db.connect((error) => {
  if (error) throw error;
  // Figlet opening message
  console.log('=======================================================================================')
  console.log(figlet.textSync('Employee Tracker!', {
      font: 'standard',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 150,
      whitespaceBreak: true
  }));
  console.log('=======================================================================================')
  console.log('')
  promptUser()
});

// prompt user for choice of action
const promptUser = () => {
  inquirer.prompt([
    {
      name: 'choices',
      type: 'list',
      message: 'Please select a choice from the list:',
      choices: [
        'View all Departments',
        'View all Roles', 
        'View all Employees', 
        'Add Department', 
        'Add Role', 
        'Add Employee', 
        'Update an Employee Role'
      ]
    }
  ])
  
};