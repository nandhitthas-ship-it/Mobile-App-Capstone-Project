# SpendWise test cases

| ID | Scenario | Input | Expected result | Actual result | Status |
|---|---|---|---|---|---|
| TC-01 | Demo authentication | Click demo account | Dashboard opens with profile | Dashboard opens | Pass |
| TC-02 | Registration validation | Password under 6 chars | Validation toast appears | Validation toast appears | Pass |
| TC-03 | Create expense | Amount, category, date, note | New expense is persisted and listed | Created in browser smoke test | Pass |
| TC-04 | Edit transaction | Change amount and note | Existing record updates, no duplicate | Updated in browser smoke test | Pass |
| TC-05 | Delete transaction | Delete action | Record disappears and storage updates | Deleted in browser smoke test | Pass |
| TC-06 | Search/filter | Query and category | Only matching records display | Search returned only matching transaction | Pass |
| TC-07 | Empty result | Unknown search term | Friendly empty state displays | Empty state displayed | Pass |
| TC-08 | API success | Open Insights, refresh rates | Loading then parsed exchange rates | Verify with network | Pending |
| TC-09 | API failure | Disconnect network | Explicit unavailable state | Verify with offline mode | Pending |
| TC-10 | Notification permission | Enable reminders | Permission requested; denial is safe | Verify on HTTPS | Pending |
| TC-11 | Camera permission | Add receipt photo | Capture/file picker opens; denial is safe | Verify on device | Pending |
| TC-12 | Responsive UI | 360px viewport | Drawer navigation and readable cards | Verify with device emulator | Pending |
| TC-13 | Logout | Click logout | Auth screen returns; app data remains local | User key removed; transaction data remained | Pass |
| TC-14 | Syntax check | `npm test` | JavaScript parses successfully | Automated | Pass |

## Test strategy

Unit tests should cover totals, filtering, validation, and serialization. UI tests should cover auth, modal CRUD, drawer navigation, and empty states. Integration tests should mock the rates endpoint and storage. Device tests should run on Android emulator and a physical device for capture and notification permissions.
