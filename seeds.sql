USE companyABC_db;

INSERT INTO department (id, name)
VALUES (6001,"Management"),
       (6002,"Production"),
       (6003,"Shipping"),
       (6004,"sales");


INSERT INTO roles (id,title, salary, department_id)
VALUES (100,"Manager",5000.0, 6001),
       (101,"Management Assistant",3000.0,6001),
       (102,"Management Secretarty",3000.0,6001),
       (103,"Manager", 4000.0,6002),
       (104,"Engineer", 4000,6002),
       (105,"Operator", 3000,6002),
       (106,"Production Assistant", 3000,6002),
       (107,"Manager", 4000, 6003),
       (108,"Shipper", 3000,6003),
       (109,"Truck driver", 3000,6003),
       (110,"Manager", 4000,6004),
       (111,"vendor", 3500,6004);

INSERT INTO employee (id, first_name, last_name, roles, manager_id)
VALUES (1,"John","Senna",100, 1),
       (2,"Robert","Zenesky",101, 1),
       (3,"Darlene","Lehman",102, 1),
       (4,"Bob", "Stein",103, 4),
       (5,"Julieth", "Graham",104, 4),
       (6,"Sebastian", "Vohnn",105, 4),
       (7,"Patricia", "Connor",106, 4),
       (8,"Glenn", "Mcmullin",107, 8),
       (9,"Patrik", "Dennis",108, 8),
       (10,"Julian", "Griffin",109, 8),
       (11,"Steve","Russo", 110, 11),
       (12,"Oscar", "Wild",111, 11);
      