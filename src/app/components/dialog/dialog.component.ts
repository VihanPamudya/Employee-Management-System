import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Employee } from 'src/app/models/employee.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
})
export class DialogComponent implements OnInit {
  employees: Employee = new Employee();
  employeeForm!: FormGroup;
  actionBtn: string = 'Save & Add';
  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<DialogComponent>
  ) {
    this.employeeForm = fb.group({});
  }
  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      phoneNumber: [''],
      dateOfBirth: [''],
    });

    console.log(this.editData);

    if (this.editData) {
      this.actionBtn = 'Update';
      this.employees.id = this.editData.id;
      this.employeeForm.controls['firstName'].setValue(this.editData.firstName);
      this.employeeForm.controls['lastName'].setValue(this.editData.lastName);
      this.employeeForm.controls['email'].setValue(
        this.editData.properties.email
      );
      this.employeeForm.controls['phoneNumber'].setValue(
        this.editData.properties.phoneNumber
      );
      this.employeeForm.controls['dateOfBirth'].setValue(
        this.editData.properties.dateOfBirth
      );
    }
  }

  addEmployee() {
    if (!this.editData) {
      if (this.employeeForm.valid) {
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
            this.dialogRef.close('Save');
          },
          (err) => {
            alert('Something Went Wrong!');
          }
        );
      }
    } else {
      this.updateEmployee();
    }
  }

  updateEmployee() {
    console.log(this.employees.id);
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
        this.dialogRef.close('Update');
      });
  }
}
