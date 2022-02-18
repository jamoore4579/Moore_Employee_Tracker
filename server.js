const db = require('./db/connection');
const table = require('console.table');
const figlet = require('figlet');

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

