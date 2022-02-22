DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS department;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) -- hold department name
);
	
CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL, -- hold role title
    salary DECIMAL NULL, -- hold role salary
    department_id INT NOT NULL, -- hold reference to department role belongs to
    FOREIGN KEY (department_id)
        REFERENCES department(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
	
CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL, -- hold employee first name
    last_name VARCHAR(30) NOT NULL, -- hold employee last name
    role_id INT NOT NULL, -- hold reference to employee role
    FOREIGN KEY (role_id)
        REFERENCES role(id)
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    manager_id INT NULL, -- hold reference to another employee that is the manager of the current employee 
    FOREIGN KEY (manager_id)
        REFERENCES employee(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);