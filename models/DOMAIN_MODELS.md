# Domain models

```ts
type TransactionType = "income" | "expense";
type Category = "Food" | "Transport" | "Housing" | "Shopping" | "Health" | "Entertainment" | "Salary" | "Other";

interface Transaction {
  id: string | number;
  type: TransactionType;
  amount: number;
  category: Category;
  note: string;
  date: string;
}
```
