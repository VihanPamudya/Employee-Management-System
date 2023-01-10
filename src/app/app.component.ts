import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Employee } from './models/employee.model';
import { EmployeeService } from './services/employee.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('fileInput') fileInput: any;
  @ViewChild('addEmployeeButton') addEmployeeButton: any;
  title = 'EmployeeCRUD';

  employeeForm: FormGroup;

  employees: Employee[];
  employeesToDisplay: Employee[];

  newReg: boolean = false;
  modal: any;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService
  ) {
    this.employeeForm = fb.group({});
    this.employees = [];
    this.employeesToDisplay = this.employees;
  }

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      firstname: this.fb.control(''),
      lastname: this.fb.control(''),
      email: this.fb.control(''),
      phoneNo: this.fb.control(''),
      birthday: this.fb.control(''),
    });

    this.employeeService.getEmployees().subscribe((res) => {
      for (let emp of res) {
        this.employees.unshift(emp);
      }
      this.employeesToDisplay = this.employees;
    });

    this.newReg = true
    console.log(this.newReg)
  }

  searchEmployees(event: any) {
    let filteredEmployees: Employee[] = [];

    if (event === '') {
      this.employeesToDisplay = this.employees;
    } else {
      filteredEmployees = this.employees.filter((val, index) => {
        let targetKey = val.firstName.toLowerCase() + '' + val.lastName.toLowerCase();
        let searchKey = event.toLowerCase();
        return targetKey.includes(searchKey);
      });
      this.employeesToDisplay = filteredEmployees;
    }
  }

  ngAfterViewInit(): void {
    //this.buttontemp.nativeElement.click();
  }

  addEmployee() {
    let employee: Employee = {
      firstName: this.FirstName.value,
      lastName: this.LastName.value,
      properties: { email: this.Email.value, phoneNumber: this.PhoneNo.value, dateOfBirth: this.BirthDay.value, }
    };
    this.employeeService.postEmployee(employee).subscribe((res) => {
      this.employees.unshift(res);
      this.clearForm();
      this.newReg = false
      console.log(this.newReg)
    });
  }

  Submit() {
    if (this.newReg) {
      this.addEmployee();
    }
    else {
    this.editEmployee(this.employees)
    }
  }

  removeEmployee(event: any) {
    this.employees.forEach((val, index) => {
      if (val.id === parseInt(event)) {
        this.employeeService.deleteEmployee(event).subscribe((res) => {
          this.employees.splice(index, 1);
          alert('Employee Deleted!')
        });
      }
    });
  }

  editEmployee(event: any) {
    let employee: Employee = {
      firstName: this.FirstName.value,
      lastName: this.LastName.value,
      properties: { email: this.Email.value, phoneNumber: this.PhoneNo.value, dateOfBirth: this.BirthDay.value, }
    };
    this.employees.forEach((val, ind) => {
      if (val.id === event) {
        this.employeeService.editEmployer(event, employee).subscribe((res) => {
          console.log(res)
          this.setForm(val);
        })
      }
    });
    this.addEmployeeButton.nativeElement.click();
  }

  setForm(emp: Employee) {
    this.FirstName.setValue(emp.firstName);
    this.LastName.setValue(emp.lastName);
    this.Email.setValue(emp.properties.email);
    this.PhoneNo.setValue(emp.properties.phoneNumber);
    this.BirthDay.setValue(emp.properties.dateOfBirth);
  }

  clearForm() {
    this.FirstName.setValue('');
    this.LastName.setValue('');
    this.Email.setValue('');
    this.PhoneNo.setValue('');
    this.BirthDay.setValue('');
  }

  public get FirstName(): FormControl {
    return this.employeeForm.get('firstname') as FormControl;
  }
  public get LastName(): FormControl {
    return this.employeeForm.get('lastname') as FormControl;
  }
  public get Email(): FormControl {
    return this.employeeForm.get('email') as FormControl;
  }
  public get PhoneNo(): FormControl {
    return this.employeeForm.get('phoneNo') as FormControl;
  }
  public get BirthDay(): FormControl {
    return this.employeeForm.get('birthday') as FormControl;
  }
}