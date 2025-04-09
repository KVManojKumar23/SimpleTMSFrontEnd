export class UserRegister {
    constructor(
        public fullName: string,
        public email: string,
        public password: string,
        public phoneNumber: string,
        public address: string,
        public gender: 'MALE' | 'FEMALE' | 'OTHER',
      ) {}
    
      // Static factory method
      public static fromForm(formValue: any): UserRegister {
        return new UserRegister(
          formValue.fullName,
          formValue.email,
          formValue.password,
          formValue.phoneNumber,
          formValue.address,
          formValue.gender
        );
      }
    
      // Instance method to convert to payload
      public toPayload(): any {
        return {
          fullName: this.fullName,
          email: this.email,
          password: this.password,
          phoneNumber: this.phoneNumber,
          address: this.address,
          gender: this.gender
        };
      }
  }