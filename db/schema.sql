DROP TABLE IF EXISTS department;
DROP TABLE IF EXISTS employee_role;
DROP TABLE is EXISTS employee;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) -- hold department name
);
	
CREATE TABLE employee_role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30), -- hold role title
    salary DECIMAL, -- hold role salary
    department_id INT -- hold reference to department role belongs to
);
	 
CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30), -- hold employee first name
    last_name VARCHAR(30), -- hold employee last name
    role_id INT, -- hold reference to employee role
    manager_id INT -- hold reference to another employee that is the manager of the current employee 
                   -- (null if the employee has no manager)
);