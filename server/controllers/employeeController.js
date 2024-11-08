const db = require("../config/db");

// Get All Employees
exports.getEmployees = (req, res) => {
  const query = "SELECT * FROM Employees";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};

// Add Employee
exports.addEmployee = (req, res) => {
  const employeeData = req.body;
  db.query("INSERT INTO Employees SET ?", employeeData, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Employee added successfully" });
  });
};

// Update Employee Salary
exports.updateSalary = (req, res) => {
  const { employee_id, salary } = req.body;
  db.query(
    "UPDATE Salaries SET salary = ? WHERE employee_id = ?",
    [salary, employee_id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json({ message: "Salary updated successfully" });
    }
  );
};
