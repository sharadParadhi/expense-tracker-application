export interface Transaction {
  _id?: string; // optional because sometimes new ones may not have _id yet
  type: string;
  amount: number;
  description: string;
  category: string;
  date: string;
}
