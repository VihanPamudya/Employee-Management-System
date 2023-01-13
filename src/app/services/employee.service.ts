import { Injectable } from "@angular/core";
import { Employee } from "../models/employee.model";
import { HttpClient } from '@angular/common/http';
import { map } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  baseUrl = 'http://localhost:3000/posts';

  constructor(private http: HttpClient) { }

  getEmployees() {
    return this.http.get<any>(`/rest/servicepoint/customers;firstName=vihan`)
    .pipe(map((res:any)=>{
      return res;
    }))
  }

  searchEmployee(data: any) {
    return this.http.get<any[]>(`/rest/servicepoint/customers;firstName=${data};lastName=${data};`);
  }

  postEmployee(data: any) {
    return this.http.post<any>('/rest/servicepoint/customers/', data)
      .pipe(map((res:any)=>{
      return res;
    }))
  }

  editEmployer(id: any, data: any) {
    return this.http.put<any>('/rest/servicepoint/customers' + '/' + id, data)
    .pipe(map((res:any)=>{
      return res;
    }))
  }

  deleteEmployee(id: number) {
    return this.http.delete<any>('/rest/servicepoint/customers' + '/' + id)
    .pipe(map((res:any)=>{
      return res;
    }))
  }
}