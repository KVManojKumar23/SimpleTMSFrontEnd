// Define Gender enum to match your Java enum
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export interface UserDTO {
  userId?: number;
  fullName?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  address?: string;
  imageUrl?: string;
  gender?: string; // or enum if you have Gender enum in Angular
  dateOfBirth?: string | Date; // Handle as string for JSON, convert to Date in component
  createdAt?: string | Date;
}
