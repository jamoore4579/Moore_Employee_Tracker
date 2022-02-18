const db = require('./db/connection');
const figlet = require('figlet');
const inquirer = require('inquirer');
const cTable = require('console.table')

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
        'Update an Employee Role',
        'Exit'
      ]
    }
  ])

// provide the action of choices
  .then((answers) => {
    const {choices} = answers;
      if (choices === 'View all Departments') {
        viewAllDepartments();
      }

      if (choices === 'View all Roles') {
        viewAllRoles();
      }

      if (choices === 'View all Employees') {
        viewAllEmployees();
      }

      if (choices === 'Add Department') {
        addDepartment();
      }

      if (choices === 'Add Role') {
        addRole();
      }

      if (choices === 'Add Employee') {
        addEmployee();
      }

      if (choices === 'Update an Employee Role') {
        updateEmployeeRole();
      }

      if(choices === 'Exit') {
        db.end();
      }

  });  

};

// view all departments
viewAllDepartments = () => {
  const sql = `SELECT department.id 
    AS id, department.name 
    AS department 
    FROM department`;

  db.query(sql, (error, response) => {
    if (error) throw error;
    console.table(response);
    promptUser();
  });
};

// view all roles
viewAllRoles = () => {
  const sql = `SELECT 
    role.id, 
    role.title, 
    department.name 
    AS department 
    FROM role 
    INNER JOIN department ON role.department_id = department.id`;

  db.query(sql, (error, response) => {
    if (error) throw error;
    console.table(response);
    promptUser();
  });
};

// view all employees
viewAllEmployees = () => {
  const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS 'department', 
    role.salary
    FROM employee, role, department
    WHERE department.id = role.department_id
    AND role.id = employee.role_id
    ORDER BY employee.id ASC`;
  db.query(sql, (error, response) => {
    if (error) throw error;
    console.table(response);
    promptUser();
  });
};

