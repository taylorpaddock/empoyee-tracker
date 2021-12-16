INSERT INTO department (id, department_name)
VALUES  (1, "Finance"), 
        (2, "Sales"), 
        (3, "Ecommerce"), 
        (4, "Operations"), 
        (5, "Manufacturing");

INSERT INTO role (id, title, salary, department_id)
VALUES  (1, "CFO", 110000, 1), 
        (2, "Controller", 90000, 1), 
        (3, "COO", 105000, 4),
        (4, "Glassblower", 60000, 5);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES  (1, "Maddie", "Smith", 3, 1),
        (2, "Taylor", "Turnip", 1, 1),
        (3, "Amanda", "Brown", 4, 4),
        (4, "Nick", "Jones", 4, 1),
        (5, "Tyler", "Mercury", 1, 1);