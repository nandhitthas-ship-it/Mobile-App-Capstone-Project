# Firebase integration guide

1. Create a Firebase project and enable Email/Password Authentication.
2. Create a Firestore database in production mode.
3. Store client configuration in deployment environment variables, never in a committed secret file.
4. Map `state.user` to `onAuthStateChanged`.
5. Map transactions to `users/{uid}/transactions/{transactionId}`.
6. Use Firebase Security Rules so `request.auth.uid == userId` for every user-owned document.
7. Add password reset through `sendPasswordResetEmail`.

The current demo deliberately uses local demo auth and does not claim to be a secure production identity system. Replace the adapter before handling real financial data.
