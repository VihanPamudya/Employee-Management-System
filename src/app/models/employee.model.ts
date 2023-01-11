export class Employee {
  id?: number = 0;
  firstName: string = '';
  lastName: string = '';
  properties: {
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
  } = {
      email: '',
      phoneNumber: '',
      dateOfBirth: ''
    }
}