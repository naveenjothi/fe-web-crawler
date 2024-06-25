export interface IClient {
  id?: number;
  companyName: string;
  roC: string;
  companyStatus: string;
  companyActivity: string;
  cin: string;
  registrationDate: string;
  category: string;
  subCategory: string;
  companyClass: string;
  authorisedCapital: number;
  paidUpCapital: number;
  state: string;
  pinCode: string;
  country: string;
  address: string;
  email: string;
  isDeleted?: boolean;
}
