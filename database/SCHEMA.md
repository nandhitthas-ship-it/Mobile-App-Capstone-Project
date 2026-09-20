# Local database design

The demo uses `localStorage` for zero-install portability. The production mobile mapping is SQLite or AsyncStorage.

## Collections

`users`: `id`, `email`, `displayName`, `createdAt`

`transactions`: `id`, `userId`, `type` (`income|expense`), `amount`, `category`, `note`, `date`, `createdAt`, `updatedAt`

`budgets`: `id`, `userId`, `category`, `limit`, `month`, `createdAt`, `updatedAt`

## Operations

- Create: validate amount/date/type, append transaction, persist.
- Read: load user-scoped transactions, sort by date descending.
- Update: replace by stable `id`.
- Delete: remove by stable `id`.
- Search/filter: apply normalized note/category query and type/category predicates.

For production, add indexes on `(userId, date)`, `(userId, category)`, and `(userId, month)`.
