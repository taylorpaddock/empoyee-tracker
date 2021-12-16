const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username
      user: 'root',
      // Add MySQL password here
      password: 'Glassy@gb2',
      database: 'business_db'
    },
    console.log(`Connected to the business_db database.`)
);

db.connect((err) => {
    if(err) {
        return err;
    }
    menuPrompt();
})

function menuPrompt() {
    inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'Select from the following...',
        choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add A Department', 'Add A Role', 'Add An Employee', 'Update An Employee Role', 'Quit']
    }).then(answer => {
        console.log(answer.action)
        if(answer.action === "View All Departments"){
            viewAllDepartments();
        } else if(answer.action == "View All Roles"){
            viewAllRoles();
        } else if(answer.action == "View All Employees"){
            viewAllEmployees();
        } else if(answer.action == "Add A Department"){
            addDepartment();
        } else if(answer.action == "Add A Role"){
            addRole();
        } else if(answer.action == "Add An Employee"){
            addEmployee();
        } else if(answer.action == "Update An Employee Role"){
            updateEmployee();
        } else if (answer.action == "Quit") {
            db.end();
        }
    });
};

function viewAllDepartments() {
    const sql = 'SELECT * FROM department';
    db.query(sql, (err, res) => {
        if(err) {
            return err;
        }
        console.table(res);
        menuPrompt();
    });
};

// job title, role id, the department that role belongs to, and the salary for that role
function viewAllRoles() {
    const sql = 'SELECT role.title, role.id, department.department_name AS department, role.salary FROM role JOIN department ON role.department_id = department.id ORDER BY role.id';
    db.query(sql, (err, res) => {
        if(err) {
            return err;
        } 
        console.table(res);
        menuPrompt();
    });
};

// employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
function viewAllEmployees() {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id LEFT JOIN employee AS manager ON employee.manager_id = manager.id ORDER BY employee.id`;
    db.query(sql, (err, res) => {
        if(err) {
            console.log(err);
            return err;
        }
        console.table(res);
        menuPrompt();
    });
};


// enter the name of the department and that department is added to the database
function addDepartment() {
    inquirer.prompt([{
        type: 'input',
        name: 'department',
        message: 'Enter the new department name you would like to add.'
    }])
    .then(answer => {
        console.log(`Added ${answer.department} to departments.`);
        db.query(`INSERT INTO department SET ?`,
        {
            department_name: `${answer.department}`
        },
        (err, res) => {
            if(err) {
                return err;
            }
        menuPrompt();
        });
    })
};

// enter the name, salary, and department for the role and that role is added to the database
function addRole() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter your new role title.'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter the salary for this role.'
        },
        {
            type: 'input',
            name: 'department_id',
            message: 'Type the department id.'
        }
    ])
    .then(answer => {
        console.log(`Added ${answer.name} to roles.`);
        db.query(`INSERT INTO role SET ?`,
        {
            title: `${answer.name}`,
            salary: `${answer.salary}`,
            department_id: `${answer.department_id}`
        },
        (err, res) => {
            if(err) {
                return err;
            }
        menuPrompt();
        });
    })
};

// enter the employee’s first name, last name, role, and manager, and that employee is added to the database
function addEmployee() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'Enter the new employees first name.'
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'Enter the new employees last name.'
        },
        {
            type: 'input',
            name: 'role_id',
            message: 'Enter their role id.'
        },
        {
            type: 'input',
            name: 'manager_id',
            message: 'Enter their manager id.'
        }
    ])
    .then(answer => {
        console.log(`Added ${answer.first_name} to employees.`);
        db.query(`INSERT INTO employee SET ?`,
        {
            first_name: `${answer.first_name}`,
            last_name: `${answer.last_name}`,
            role_id: `${answer.role_id}`,
            manager_id: `${answer.manager_id}`
        },
        (err, res) => {
            if(err) {
                console.log(err);
                return err;
            }
        menuPrompt();
        });
    })
};

// select an employee to update and their new role and this information is updated in the database 
function updateEmployee() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'employee',
            message: 'Enter employee id.'
        },
        {
            type: 'input',
            name: 'role',
            message: 'Enter their new role id.'
        }
    ])
    .then(answer => {
        console.log('Employee role updated.');
        db.query(`UPDATE employee SET role_id = ? WHERE id = ?`, [`${answer.role}`, `${answer.employee}`],
        (err, res) => {
            if(err) {
                return err;
            }
        menuPrompt();
        });
    })
};