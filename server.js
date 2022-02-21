const db = require('./db/connection');
const figlet = require('figlet');
const inquirer = require('inquirer');
const table = require('console.table');
const validate = require('./validate');

// database connection
db.connect((err) => {
  if (err) throw err;
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
        'View all Employees by Department',
        'View Department Budgets',
        'Add Department', 
        'Add Role', 
        'Add Employee', 
        'Update an Employee Role',
        'Update an Employees Manager', // needs coded
        'Delete Department', // needs coded
        'Delete Employee Role', // needs coded
        'Delete Employee', // needs coded
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

      if (choices === 'View all Employees by Department') {
        viewAllEmpDepart();
      }

      if (choices === 'View Department Budgets') {
        viewDeptBudget();
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

      if (choices === 'Update an Employees Manager') {
        updateEmpManager();
      }

      if (choices === 'Delete Department') {
        deleteDept();
      }

      if (choices === 'Delete Employee Role') {
        deleteEmpRole();
      }

      if (choices === 'Delete Employee') {
        deleteEmp();
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

  db.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
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

  db.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
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
  db.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    promptUser();
  });
};

// view all employees by department
viewAllEmpDepart = () => {
  const sql = `SELECT employee.first_name, employee.last_name, department.name AS department
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id`;
  db.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    promptUser();
  });
};

// view all departments by budget
viewDeptBudget = () => {
  console.log(`Budget By Department:`);
  const sql = `SELECT department_id AS id,
    department.name AS department,
    SUM(salary) AS budget
    FROM role
    INNER JOIN department ON role.department_id = department.id GROUP BY role. department_id`
  
  db.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    promptUser();
  })
}

// add a department
addDepartment = () => {
  inquirer
    .prompt([
      {
        name: 'newDepartment',
        type: 'input',
        message: 'What is the name of the new Department?',
        validate: validate.validateString
      }
    ])
    .then((answer) => {
      const sql = `INSERT INTO department (name) 
        VALUES (?)`
      
      db.query(sql, answer.newDepartment, (err, res) => {
        if (err) throw err;
        console.log(answer.newDepartment + ` department created successfully!`);
        viewAllDepartments();
      });
    });
};

// add a role
addRole = () => {
  const sql = `SELECT * FROM department`
  db.query(sql, (err, res) => {
    if (err) throw err;
    const deptNameArray = [];
    res.forEach((department) => {deptNameArray.push(department.name);});
    deptNameArray.push('Create Department');
    inquirer
      .prompt([
        {
          name: 'departmentName',
          type: 'list',
          message: 'Which department is this new role in?',
          choices: deptNameArray
        }
      ])
      .then((answer) => {
        if (answer.departName === 'Create Department') {
          this.addDepartment();
        } else {
          addRoleResume(answer);
        }
      });

      const addRoleResume = (departmentData) => {
        inquirer
          .prompt([
            {
              name: 'newRole',
              type: 'input',
              message: 'What is the name of the new Role?',
              validate: validate.validateString
            },
            {
              name: 'salary',
              type: 'input',
              message: 'What is the salary of this new Role?',
              vladiate: validate.validateSalary
            }
          ])
          .then((answer) => {
            const createRole = answer.newRole;

            res.forEach((department) => {
              if (departmentData.departmentName === department.name) {departmentId = department.id;}
            });

            const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
            const cret = [createRole, answer.salary, departmentId];

            db.query(sql, cret, (err) => {
              if (err) throw err;
              console.log(answer.newRole + ` role created successfully!`);
              viewAllRoles();
            });
          });  
      };
  });
}

// add a new employee
addEmployee = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'firstName',
      message: 'What is the employees first name?',
      validate: addFirstName => {
        if (addFirstName) {
          return true;
        } else {
          console.log('Please enter a first name');
          return false;
        }
      }
    },
    {
      type: 'input',
      name: 'lastName',
      message: 'What is the employees last name?',
      validate: addLastName => {
        if (addLastName) {
          return true;
        } else {
          console.log('Please enter a last name');
          return false;
        }
      }
    }
  ])
  .then(answer => {
    const roleSql = `SELECT role.id, role.title
      FROM role`;
    const cret = [answer.firstName, answer.lastName];

    db.query(roleSql, (err, data) => {
      if (err) throw err;
      const roles = data.map(({ id, title}) => ({ name: title, value: id }));
      inquirer.prompt([
        {
          type: 'list',
          name: 'role',
          message: 'What is the employees role?',
          choices: roles
        }
      ])
      .then(roleChoice => {
        const role = roleChoice.role;
        cret.push(role);
        const managerSql = 'SELECT * FROM employee';

        db.query(managerSql, (err, data) => {
          if (err) throw err;
          const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
          inquirer.prompt([
            {
              type: 'list',
              name: 'manager',
              message: 'Who is the employees manager?',
              choices: managers
            }
          ])
          .then(managerChoice => {
            const manager = managerChoice.manager;
            const sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
            cret.push(manager);
            db.query(sql, cret, (err) => {
              if (err) throw err;
              console.log('Employee has been added!')
              viewAllEmployees();
            })
          })
        })
      })
    })
  })
}

// update an employees role
updateEmployeeRole = () => {
  const sql = 'SELECT employee.id, employee.first_name, employee.last_name, role.id AS "role_id" FROM employee, role, department WHERE department.id = role.department_id AND role.id = employee.role_id';
  db.query(sql, (err, res) => {
    if(err) throw err;
    const employeeNamesArray = [];
    res.forEach((employee) => {employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`);});

    const sql = `SELECT role.id, role.title FROM role`;
    db.query(sql, (err, res) => {
      if (err) throw err;
      const rolesArray = [];
      res.forEach((role) => {rolesArray.push(role.title);});

      inquirer
        .prompt([
          {
            name: 'chosenEmployee',
            type: 'list',
            message: 'Which employee has a new role?',
            choices: employeeNamesArray
          },
          {
            name: 'chosenRole',
            type: 'list',
            message: 'What is their role?',
            choices: rolesArray
          }
        ])
        .then ((answer) => {
          let newTitleId, employeeId;

          res.forEach((role) => {
            if (answer.chosenRole === role.title) {
              newTitleId = role.id;
            }
          });

          res.forEach((employee) => {
            if (
              answer.chosenEmployee ===
              `${employee.first_name} ${employee.last_name}`
            ) {
              employeeId = employee.id;
            }
          });

          const sqls = `UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`;
          db.query(
            sqls,
            [newTitleId, employeeId],
            (err) => {
              console.log(`Employee Role Updated`);
              promptUser();
            }
          );
        });
    });
  });
};

// update an employees manager
updateEmpManager = () => {
  const sql = `SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id
    FROM employee`;
  db.query(sql, (err, res) => {
    const employeeNamesArray = [];
    res.forEach((employee) => {employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`);});

    inquirer
      .prompt([
        {
          name: 'chosenEmployee',
          type: 'list',
          message: 'Which employee has a new manager?',
          choices: employeeNamesArray
        },
        {
          name: 'newManager',
          type: 'list',
          message: 'Who is their manager?',
          choices: employeeNamesArray
        }
      ])
      .then ((answer) => {
        let employeeId, managerId;
        res.forEach((employee) => {
          if (
            answer.chosenEmployee === `${employee.first_name} ${employee.last_name}`
          ) {
            employeeId = employee.id;
          }

          if (
            answer.newManager === `${employee.first_name} ${employee.last_name}`
          ) {
            managerId = employee.id;
          }
        });

        if (validate.isSame(answer.chosenEmployee, answer.newManager)) {
          console.log(`Invalid Manager Selection`);
          promptUser;
        } else {
          const sql = `UPDATE employee SET employee.manager_id = ? WHERE employee.id = ?`;

          db.query(sql, [managerId, employeeId], (err) => {
            if (err) throw err;
            console.log(`Employee Manager Updated`);
            promptUser();
          }
          )
        }
      })
  })
}