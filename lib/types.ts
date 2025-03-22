export interface User {
  id: string;
  name: string;
  phoneNumber: string;
  address: string;
  email: string;
  password: string;
  country: string;
  city: string;
  pinCode: string;
}

export interface Agency {
  id: string;
  name: string;
  phoneNumber: string;
  address: string;
  email: string;
  password: string;
  country: string;
  city: string;
  pinCode: string;
}

export interface Volunteer {
  id: string;
  name: string;
  phoneNumber: string;
  address: string;
  email: string;
  password: string;
  country: string;
  city: string;
  pinCode: string;
}

  
  export interface Admin {
    id: string;
    name: string;
    email: string;
    password: string;
  }
  export interface Database {
    users: User[];
    admins: Admin[];
    volunteers: Volunteer[];
    agencies: Agency[];
  }
  
  export type Role = 'user' | 'admin' | 'volunteer' | 'agency';

