import departments from "./departments.js";

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
    this.restaurant = document.querySelector(".restaurant");
    this.id = 4;
    this.oldEmployee;
    this.render();
  }

  render() {
    this.showForm();

    document
      .querySelector(".departmentSelect")
      .insertAdjacentHTML("beforeend", this.addOptionsToSelect(departments));

    document
      .querySelector(".positionSelect")
      .insertAdjacentHTML("beforeend", this.addOptionsToSelect(positions));

    if (document.querySelector("ul")) {
      document.querySelector("ul").remove();
    }

    const employeesList = this.restaurant.appendChild(
      document.createElement("ul")
    );

    let form = document.querySelector(".form");

    form.addEventListener("submit", this.handleSubmitForm.bind(this, form));

    employeesList.addEventListener("click", this.handleClick);

    this.showEmployeesList(employeesList);
  }

  handleSubmitForm(form, event) {
    event.preventDefault();
    let formData = new FormData(form);
    this.addEmployee(formData);

    form.remove();
  }

  handleSubmitEditForm(editForm, event) {
    event.preventDefault();

    let formData = new FormData(editForm);

    this.addEmployee(formData);

    if (document.querySelector(".form")) {
      document.querySelector(".form").remove();
    }

    editForm.remove();

    departments.forEach((department) => {
      department.employees.forEach((employee, indexEmployee, arr) => {
        if (employee.id === this.oldEmployee) {
          arr.splice(indexEmployee, 1);
        }
      });
    });

    this.render();
  }

  handleClick(event) {
    event.preventDefault();

    if (event.target.nodeName !== "BUTTON") {
      return;
    }

    let selectedEmployeeId = Number(event.target.closest("li").dataset.id);

    if (event.target.dataset.action === "delete") {
      departments.forEach((department) => {
        department.employees.forEach((employee, indexEmployee, arr) => {
          if (employee.id === selectedEmployeeId) {
            arr.splice(indexEmployee, 1);
          }
        });
      });
      event.target.closest("li").remove();
    }

    if (event.target.dataset.action === "edit") {
      departments.forEach((department) => {
        department.employees.forEach((employee) => {
          if (employee.id === selectedEmployeeId) {
            if (document.querySelector(".form")) {
              document.querySelector(".form").remove();
            }

            newRestaurant.editsEmployee(employee);
          }
        });
      });
    }
  }

  addOptionsToSelect(data) {
    let template = "";

    for (let item of data) {
      template += `<option value="${item.id}">${item.title}</option>`;
    }

    return template;
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

  addEmployee(formData) {
    let departmentId = Number(formData.get("department"));
    let positionId = Number(formData.get("position"));

    const employee = {
      id: this.id++,
      name: formData.get("name"),
      surname: formData.get("surname"),
      departmentId: departmentId,
      position: this.findPosition(positionId),
      salary: Number(formData.get("salary")),
      isFired: Boolean(formData.get("isFired")),
    };

    const selectedDepartment = this.findDepartment(departmentId);

    selectedDepartment.employees.push(employee);

    this.render();
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

  editsEmployee(employee) {
    const selectedDepartment = this.findDepartment(employee.departmentId);

    this.oldEmployee = employee.id;

    let selectedPosition;

    for (let position of this.positions) {
      if (position.title === employee.position) {
        selectedPosition = position.id;
      }
    }

    let templateEmployee = `<form class="editForm">
   <label>
   Department
   <select name="department" class="departmentSelect")>
   <option value="${employee.departmentId}">${selectedDepartment.title}</option>
   </select>
   </label>
   <label>
   Name
   <input type="text" name="name" value="${employee.name}"/>
   </label>
   <label>
     Surname
     <input type="text" name="surname" value="${employee.surname}"/>
     </label>
   <label>
   Position
   <select name="position" class="positionSelect">
     <option value="${selectedPosition}">${employee.position}</option>
     </select>
     </label>
     <label>
     Salary
     <input type="text" name="salary" value="${employee.salary}"/>
     </label>
     <label>
     isFired
     <select name="isFired">
     <option value="${employee.isFired}" disabled>${employee.isFired}</option>
     <option value="false">false</option>
        <option value="true">true</option>
     </select>
   </label>
   <button type="submit">Edit</button>
   </form>`;

    newRestaurant.showForm(templateEmployee);

    document
      .querySelector(".departmentSelect")
      .insertAdjacentHTML("beforeend", this.addOptionsToSelect(departments));

    document
      .querySelector(".positionSelect")
      .insertAdjacentHTML("beforeend", this.addOptionsToSelect(positions));

    let editForm = document.querySelector(".editForm");
    editForm.addEventListener(
      "submit",
      this.handleSubmitEditForm.bind(this, editForm)
    );
  }

  showForm(templateEmployee) {
    let template = ``;
    if (templateEmployee) {
      template = templateEmployee;
    } else {
      template = `<form class="form">
      <label>
      Department
      <select name="department" class="departmentSelect")>
      <option></option>
      </select>
      </label>
      <label>
      Name
      <input type="text" name="name" />
      </label>
      <label>
        Surname
        <input type="text" name="surname" />
        </label>
      <label>
      Position
      <select name="position" class="positionSelect">
        <option></option>
        </select>
        </label>
        <label>
        Salary
        <input type="text" name="salary" />
        </label>
        <label>
        isFired
        <select name="isFired">
        <option></option>
        <option value="false">false</option>
        <option value="true">true</option>
        </select>
      </label>
      <button type="submit">Add</button>
      </form>`;
    }

    this.restaurant.insertAdjacentHTML("afterbegin", template);
  }

  showEmployeesList(employeesList) {
    this.departments.forEach((department) => {
      department.employees.forEach(
        ({ id, name, surname, departmentId, position, salary, isFired }) => {
          const template = `<li class="employee-item" data-id=${id} data-department=${departmentId}>
              <span>Department: <span>${department.title}</span> |</span>
              <span>Name: <span>${name}</span> |</span>
              <span>Surname: <span>${surname}</span> |</span>
              <span>Position: <span>${position}</span> |</span>
              <span>Salary: <span>${salary}</span> |</span>
              <span>isFired: <span>${isFired}</span> |</span>
              <button type="button" data-action="edit">edit</button>
              <button type="button" data-action="delete">delete</button>
              </li>`;
          employeesList.insertAdjacentHTML("beforeend", template);
        }
      );
    });
  }
}
const newRestaurant = new Restaurant(departments, positions);

console.log(newRestaurant.departments);
