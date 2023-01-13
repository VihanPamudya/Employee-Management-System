import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeService } from 'src/app/services/employee.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
})
export class EmployeeComponent implements OnInit {
  employeeData: any = 0;
  showAdd!: boolean;
  showUpdate!: boolean;
  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'email',
    'dateOfBirth',
    'phoneNumber',
    'action',
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private employeeService: EmployeeService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
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

  getAllEmployees() {
    this.employeeService.getEmployees().subscribe((res) => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.employeeData = res;
    });
  }

  openDialog() {
    this.dialog
      .open(DialogComponent, {
        width: '30%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'Save') {
          this.getAllEmployees();
        }
      });
  }

  editDialog(row: any) {
    this.dialog
      .open(DialogComponent, {
        width: '30%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'Update') {
          this.getAllEmployees();
        }
      });
  }

  deleteEmployee(id: number) {
    if (confirm('Are you sure to delete employee?'))
      this.employeeService.deleteEmployee(id).subscribe((res) => {
        this.getAllEmployees();
        alert('Employee Deleted Successfully!');
      });
  }
}
