DROP DATABASE IF EXISTS companyABC_db;
CREATE DATABASE companyABC_db;

USE companyABC_db;



CREATE TABLE department (

  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  
  name VARCHAR(30) NOT NULL
  );

CREATE TABLE roles (

  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  
  title VARCHAR(30) NOT NULL,

  salary DECIMAL,

  department_id INT,

  FOREIGN KEY (department_id )
  REFERENCES department(id)
  ON DELETE SET NULL  
);

CREATE TABLE employee (

  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,

  first_name VARCHAR(30),

  last_name VARCHAR(30),

  roles INT,

  manager_id INT,

  FOREIGN KEY (roles )
  REFERENCES roles(id)
  ON DELETE SET NULL  
);

