import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Employee } from 'src/app/models/employee.model';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
})
export class EmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  employees: Employee = new Employee();
  employeeData: any = 0;
  showAdd!: boolean;
  showUpdate!: boolean;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService
  ) {
    this.employeeForm = fb.group({});
  }

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      phoneNumber: [''],
      dateOfBirth: [''],
    });

    this.getAllEmployees();
  }

  searchEmployees(event: any) {
    if (event === '') {
      this.getAllEmployees();
    } else {
      this.employeeService.searchEmployee(event).subscribe((res) => {
        this.employeeData = res;
      });
    }
  }

  addEmployee() {
    this.employees.firstName = this.employeeForm.value.firstName;
    this.employees.lastName = this.employeeForm.value.lastName;
    this.employees.properties = {
      email: this.employeeForm.value.email,
      phoneNumber: this.employeeForm.value.phoneNumber,
      dateOfBirth: this.employeeForm.value.dateOfBirth,
    };

    this.employeeService.postEmployee(this.employees).subscribe(
      (res) => {
        console.log(res);
        alert('Employee Added Successfully!');
        this.employeeForm.reset();
        this.getAllEmployees();
      },
      (err) => {
        alert('Something Went Wrong!');
      }
    );
  }

  getAllEmployees() {
    this.employeeService.getEmployees().subscribe((res) => {
      this.employeeData = res;
    });
  }

  deleteEmployee(row: any) {
    this.employeeService.deleteEmployee(row.id).subscribe((res) => {
      alert('Employee Deleted!');
      this.getAllEmployees();
    });
  }

  editEmployee(row: any) {
    this.showAdd = false;
    this.showUpdate = true;
    this.employees.id = row.id;
    this.employeeForm.controls['firstName'].setValue(row.firstName);
    this.employeeForm.controls['lastName'].setValue(row.lastName);
    this.employeeForm.controls['email'].setValue(row.properties.email);
    this.employeeForm.controls['phoneNumber'].setValue(row.properties.phoneNumber);
    this.employeeForm.controls['dateOfBirth'].setValue(row.properties.dateOfBirth);
  }

  updateEmployee() {
    this.employees.firstName = this.employeeForm.value.firstName;
    this.employees.lastName = this.employeeForm.value.lastName;
    this.employees.properties.email = this.employeeForm.value.email;
    this.employees.properties.dateOfBirth = this.employeeForm.value.dateOfBirth;
    this.employees.properties.phoneNumber = this.employeeForm.value.phoneNumber;
    this.employeeService
      .editEmployer(this.employees.id, this.employees)
      .subscribe((res) => {
        alert('Updated Successfully!');
        this.employeeForm.reset();
        this.getAllEmployees();
      });
  }

  clickAddEmployee() {
    this.employeeForm.reset();
    this.showAdd = true;
    this.showUpdate = false;
  }
}
