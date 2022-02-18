INSERT INTO department(name)
VALUES
    ("Marketing"), 
    ("Operations"), 
    ("Product"), 
    ("IT"), 
    ("Engineering"), 
    ("Sales"), 
    ("Human Resources");

INSERT INTO role(title, salary, department_id)
VALUES
    ("Specialist", 50000, 1),
    ("Manager", 95000, 2),
    ("Technician", 65000, 2),
    ("Adviser", 55000, 3),
    ("Developer", 80000, 4),
    ("Lead Engineer", 85000, 5),
    ("Sales Specialist", 60000, 6),
    ("HR Associate", 50000, 7);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES
    ("Jason", "Moore", 2, null),
    ("Jon", "Moore", 2, 1),
    ("Amanda", "Moore", 1, 1),
    ("Madeline", "Moore", 4, 1);