const departments = [
  { id: 1, title: "management", employees: [] },
  { id: 2, title: "kitchen", employees: [] },
  { id: 3, title: "hall", employees: [] },
];

const positions = [
  { id: 1, title: "manager" },
  { id: 2, title: "cook" },
  { id: 3, title: "waiter" },
  { id: 4, title: "cleaner" },
];
class Restaurant {
  constructor(departments, positions) {
    this.departments = departments || [];
    this.positions = positions || [];
  }

  addDepartment(id, title) {
    const department = { id, title, employees: [] };
    this.departments.push(department);

    return department;
  }

  addPosition(id, title) {
    const position = { id, title };
    this.positions.push(position);

    return position;
  }

  findDepartment(id) {
    return this.departments.find((department) => department.id === id);
  }

  findPosition(id) {
    for (let position of this.positions) {
      if (position.id === id) {
        return position.title;
      }
    }
  }

  addEmployee(name, surname, departmentId, positionId, salary, isFired) {
    const employee = {
      name,
      surname,
      departmentId,
      position: this.findPosition(positionId),
      salary,
      isFired,
    };
    const selectedDepartment = this.findDepartment(departmentId);

    return selectedDepartment.employees.push(employee);
  }

  getSumSalary(departmentId) {
    let res = 0;
    for (let department of this.departments) {
      if (department.id === departmentId) {
        for (let employee of department.employees) {
          if (!employee.isFired) {
            res += employee.salary;
          }
        }
      }
    }
    return res;
  }

  getMeanSalary(departmentId) {
    let res = 0;
    let counter = 0;
    for (let department of this.departments) {
      if (department.id === departmentId) {
        for (let employee of department.employees) {
          if (!employee.isFired) {
            res += employee.salary;
            counter++;
          }
        }
      }
    }
    return Math.round(res / counter);
  }

  getExtremumSalary(departmentId, positionId, extremum) {
    let res = [];

    for (let department of this.departments) {
      if (department.id === departmentId) {
        for (let employee of department.employees) {
          if (
            !employee.isFired &&
            employee.position === this.findPosition(positionId)
          ) {
            res.push(employee.salary);
          }
        }
      }
    }

    if (extremum === "min") {
      return Math.min(...res);
    }

    if (extremum === "max") {
      return Math.max(...res);
    }
  }

  getFiredEmployees() {
    let res = 0;

    for (let department of this.departments) {
      for (let employee of department.employees) {
        if (employee.isFired) {
          res++;
        }
      }
    }

    return res;
  }

  getDepartmentsWithoutPosition(positionId) {
    let res = [];

    for (let department of this.departments) {
      let counter = 0;

      for (let employee of department.employees) {
        if (
          !employee.isFired &&
          employee.position === this.findPosition(positionId)
        ) {
          counter++;
        }
      }
      if (counter === 0) {
        res.push(department.title);
      }
    }

    return res;
  }
}
const restaurant = new Restaurant(departments, positions);

restaurant.addDepartment(4, "security");


restaurant.addEmployee("Max", "Planck", 2, 2, 2000, false);
restaurant.addEmployee("Katherine", "Blodgett", 2, 1, 1500, false);
restaurant.addEmployee("Ada", "Lovelace", 3, 3, 1000, false);
restaurant.addEmployee("Johannes", "Kepler", 4, 4, 500, false);
restaurant.addEmployee("Bob", "Marvel", 2, 1, 500, false);

