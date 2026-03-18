export type UserRole = "MANAGER" | "AUTO DETAILER" | "CUSTOMER SERVICE AGENT";

export interface User {
  name: string; // We added this later, not exist in Flok-V1
  userId: string;
  token: string;
  tokenExpTime: string;
  isLoggedIn: boolean;
  userRole: UserRole;
}

export interface Vehicle {
  id: number;
  vin: string;
  make: string;
  model: string;
  color: string;
  mileage: number;
  class: string;
  classCode: string;
  state: string;
  licensePlate: string;
  isRented: boolean;
  inProduction: boolean;
}

export interface RentalService {
  id: number;
  contactName: string;
  contactEmail: string;
  contactNum: string;
  pickUpTime: string;
  returnTime: string;
  make: string;
  model: string;
  vin: string;
  color: string;
}
