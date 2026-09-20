# Service contracts

Native port adapters should keep the UI independent of storage and cloud details:

- `AuthService.signIn(email, password)`
- `AuthService.register(name, email, password)`
- `AuthService.resetPassword(email)`
- `StorageService.listTransactions(userId)`
- `StorageService.upsertTransaction(userId, transaction)`
- `StorageService.deleteTransaction(userId, transactionId)`
- `RatesService.getLatest(baseCurrency)`
- `DeviceService.requestCamera()`
- `DeviceService.requestNotifications()`

The current `app.js` provides browser implementations of these behaviors.
