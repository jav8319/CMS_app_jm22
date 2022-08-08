const mysql = require('mysql2');
const consoletable = require('console.table');
const inquirer = require('inquirer');


const db = mysql.createConnection(
  {
    host: 'localhost',
     
    user: 'root',
     
    password: '***********',//enter mysql password//
    database: 'companyabc_db'
  },
  console.log(`Connected to companyabc_db database.`)
);

function init_() {
  
  inquirer
    .prompt([
      {
      type: 'list',
      name: 'selection',
      message: 'Choose an option',
      choices: ["view all departments","view all roles","view all employees","add a department","add a role","add an employee","update an employee role","exit"]
    },

    ])
    .then((data) => {

      var choice=data.selection;

      if(choice==="view all departments")
      v_depts();

      if (choice==="view all roles") {
        v_roles();
      }

      if (choice==="view all employees") {
        v_emp();
      }
      if (choice==="add a department") {
        add_dept();
      }
      if (choice==="add a role") {
        add_role();
      }
      if (choice==="add an employee") {
        add_emp();
      }
      if (choice==="update an employee role") {
        upd_emp_role();
      }

      if (choice==="exit") {

        quit();   
      }
    });
}

function v_depts() {
  db.query('SELECT * FROM department;', function (err, results) {
    console.log("-------------------------------------------------------------------View all departments---------------------------------------------------------------") 
    console.log("------------------------------------------------------------------------------------------------------------------------------------------------------") 
    console.table(results);
    console.log("-------------------------------------------------------------------fin View all departments-----------------------------------------------------------") 
    console.log("------------------------------------------------------------------------------------------------------------------------------------------------------") 
    init_();
  });   
}

function v_roles() {

  db.query('select * from roles;', function (err, results) {
    console.log("-------------------------------------------------------------------View all Roles----------------------------------------------------------------------") 
    console.log("-------------------------------------------------------------------------------------------------------------------------------------------------------") 
    console.table(results);
    console.log("-------------------------------------------------------------------------------------------------------------------------------------------------------") 
    console.log("-------------------------------------------------------------------fin View all Roles------------------------------------------------------------------") 
    init_();
  });

}

function v_emp() {
  db.query('drop view if exists employee_display;', function (err, results) {
    console.log(results.affectedRows)
    db.query('drop view if exists manager;', function (err, results) {
      console.log(results.affectedRows)
      db.query('create view manager as select employee.id as id, concat(employee.first_name," ",employee.last_name,"-","dept:", department.name) as name from employee join (roles, department) on employee.roles = roles.id and roles.department_id = department.id where locate("manager",roles.title)>0;', function (err, results) {
        console.log(results.affectedRows)
        db.query(('create view employee_display as select employee.id, employee.first_name, employee.last_name, roles.title, department.name as department, roles.salary, manager.name as manager from employee join (roles, department, manager) on employee.roles = roles.id and roles.department_id = department.id and employee.manager_id = manager.id;'), function (err, results) {
          db.query('Select * from employee_display;', function (err, results) {
            console.log("-------------------------------------------------------------------View all employees-------------------------------------------------------------") 
            console.log("--------------------------------------------------------------------------------------------------------------------------------------------------")   
            console.table(results);
            console.log("--------------------------------------------------------------------------------------------------------------------------------------------------") 
            console.log("--------------------------------------------------------------------fin view all employees--------------------------------------------------------")
            init_();
          })
        });
      }) 
    })
  })   
}


function add_dept() {

  inquirer
    .prompt([
      {
        type: 'input',
        name: 'NewDept',
        message: 'Add new department name',
      },  
      ])

      .then((data) => {
        var choice=data.NewDept;
        db.query('INSERT INTO department (name) VALUES (?);',choice, (err, result) => {
          if (choice) {
            console.table(result.affectedRows)
            db.query('SELECT * FROM department;', function (err, results) {
              console.log("-------------------------------------------------------------------View all departments---------------------------------------------------------------") 
              console.log("------------------------------------------------------------------------------------------------------------------------------------------------------") 
              console.table(results);
              console.log("-------------------------------------------------------------------fin View all departments-----------------------------------------------------------") 
              console.log("------------------------------------------------------------------------------------------------------------------------------------------------------") 
              init_();
            });
             
            }else{
              process.exit();
            }
        });
      });
}  

function add_role() {
      
  db.query('select * from department;',(err, result) => {
    const dp= result
    
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'RoleName',
          message: 'Enter new role name',
        },
        {
          type: 'input',
          name: 'Rolesalary',
          message: 'Enter Salary',
        },
        {
          type: 'list',
          name: 'mDept',
          message: 'please choose department for new role',
          choices:  dp,
        }

        ])

        .then((data) => {

          var index =dp.findIndex((dp0) => dp0.name === data.mDept);
          const roleData=[data.RoleName, data.Rolesalary, (dp[index].id)]
          
          db.query('INSERT INTO roles (title,salary,department_id) VALUES (?,?,?);',roleData,(err, result1) => {
            console.log(result1.affectedRows)
  
            db.query('select * from roles;', function (err, results) {
              console.log("-------------------------------------------------------------------View all Roles----------------------------------------------------------------------") 
              console.log("-------------------------------------------------------------------------------------------------------------------------------------------------------") 
              console.table(results);
              console.log("-------------------------------------------------------------------------------------------------------------------------------------------------------") 
              console.log("-------------------------------------------------------------------fin View all Roles------------------------------------------------------------------") 
              init_();
            });          
          })
          
        })
  })
}

function add_emp() {

  db.query('select employee.id as id, concat(employee.first_name," ",employee.last_name,"-","dept:", department.name) as name from employee join (roles, department) on employee.roles = roles.id and roles.department_id = department.id where locate("manager",roles.title)>0;',(err, result4) => {
    const dp4= result4
    

    db.query('select roles.id as id, roles.title as name from roles;',(err, result5) => {
      const dp5= result5

      inquirer
        .prompt([
          {
            type: 'input',
            name: 'employeeFname',
            message: 'Enter employee first name',
          },
          {
            type: 'input',
            name: 'employeeLname',
            message: 'Enter employee last name',
          },
          {
            type: 'list',
            name: 'employeeRole',
            message: 'please choose role',
            choices:  dp5,
          },
          {
            type: 'list',
            name: 'employeeM',
            message: 'please choose Manager',
            choices:  dp4,
          }

          ])
          .then((data) => {

            var index1 =dp4.findIndex((dp00) => dp00.name === data.employeeM);
            var index2 =dp5.findIndex((dp000) => dp000.name === data.employeeRole);

            const employeeData=[data.employeeFname, data.employeeLname, (dp5[index2].id), (dp4[index1].id)]

            db.query('INSERT INTO employee (first_name,last_name,roles, manager_id) VALUES (?,?,?,?);',employeeData, (err, result6) => {
              console.log(result6.insertId)
              db.query('drop view if exists employee_display;', function (err, results) {
                console.log(results.affectedRows)
                db.query('drop view if exists manager;', function (err, results) {
                  console.log(results.affectedRows)
                  db.query('create view manager as select employee.id as id, concat(employee.first_name," ",employee.last_name,"-","dept:", department.name) as name from employee join (roles, department) on employee.roles = roles.id and roles.department_id = department.id where locate("manager",roles.title)>0;', function (err, results) {
                    console.log(results.affectedRows)
                    db.query(('create view employee_display as select employee.id, employee.first_name, employee.last_name, roles.title, department.name as department, roles.salary, manager.name as manager from employee join (roles, department, manager) on employee.roles = roles.id and roles.department_id = department.id and employee.manager_id = manager.id;'), function (err, results) {
                      console.log(results.affectedRows)
                      db.query('select * from employee_display', function (err, results) {
                        console.log("-------------------------------------------------------------------View all employees-------------------------------------------------------------") 
                        console.log("--------------------------------------------------------------------------------------------------------------------------------------------------")   
                        console.table(results);
                        console.log("--------------------------------------------------------------------------------------------------------------------------------------------------") 
                        console.log("--------------------------------------------------------------------fin view all employees--------------------------------------------------------") 
                        init_();
                        });
                      })
                    })
                  })
                })                 
              })
          }) 
    })      
  })
}

function upd_emp_role() {

  db.query('select employee.id, concat(employee.first_name, " ", employee.last_name," -- ","Role: ", roles.title) as name from employee join roles on employee.roles = roles.id where locate("manager",roles.title)=0;',(err, result8) => {
    const dp6= result8
    db.query('select roles.id as id, roles.title as name from roles;',(err, result9) => {
      const dp7= result9
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'updateRoleEmp',
            message: 'please choose employee',
            choices:  dp6,
          },
          {
            type: 'list',
            name: 'updateRole',
            message: 'please choose role',
            choices: dp7,
          },

          ])
          .then((data) => {

            var index1 =dp6.findIndex((dp0) => dp0.name === data.updateRoleEmp );
            var index2 =dp7.findIndex((dp0) => dp0.name === data.updateRole);

            const employeeUpData=[(dp7[index2].id), (dp6[index1].id)]
            
         
            db.query('UPDATE employee SET roles = ? WHERE employee.id = ?;',employeeUpData, (err, result10) => {
              console.log(result10.affectedRows)
              db.query('drop view if exists employee_display;', function (err, results) {
                console.log(results.affectedRows)
                db.query('drop view if exists manager;', function (err, results) {
                  console.log(results.affectedRows)
                  db.query('create view manager as select employee.id as id, concat(employee.first_name," ",employee.last_name,"-","dept:", department.name) as name from employee join (roles, department) on employee.roles = roles.id and roles.department_id = department.id where locate("manager",roles.title)>0;', function (err, results) {
                    console.log(results.affectedRows)
                    db.query(('create view employee_display as select employee.id, employee.first_name, employee.last_name, roles.title, department.name as department, roles.salary, manager.name as manager from employee join (roles, department, manager) on employee.roles = roles.id and roles.department_id = department.id and employee.manager_id = manager.id;'), function (err, results) {
                      console.log(results.affectedRows)
                      db.query('select * from employee_display', function (err, results) {
                        console.log("-------------------------------------------------------------------View all employees-------------------------------------------------------------") 
                        console.log("--------------------------------------------------------------------------------------------------------------------------------------------------")   
                        console.table(results);
                        console.log("--------------------------------------------------------------------------------------------------------------------------------------------------") 
                        console.log("--------------------------------------------------------------------fin view all employees--------------------------------------------------------") 
                        init_();
                      });
                    })
                  })
                })
              })  
                   
            })
          }) 
    })      
  })
}


init_();

function quit() {

  process.exit();
  
}