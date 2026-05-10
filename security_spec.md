# Firebase Security Specification - StudyTravel Simulator

## 1. Data Invariants
- A user can only read/write their own profile at `/users/{userId}`.
- A user can only read/write their own journey logs at `/users/{userId}/history/{journeyId}`.
- XP and sessions are numeric and non-negative.
- Score in a journey record must be between 0 and 100.
- `duration` must be positive.
- Documents are protected from "Identity Spoofing" (setting a field that identifies the owner incorrectly is blocked at the schema/path level since the path itself is {userId}).

## 2. The "Dirty Dozen" Payloads (Deny Cases)
1. **Accessing another user's profile**: `GET /users/victim_uid` as `attacker_uid`.
2. **Accessing another user's journey**: `LIST /users/victim_uid/history` as `attacker_uid`.
3. **Ghost Fields**: Attempting to add an `isAdmin` field to a profile creation.
4. **Invalid Type**: Setting `xp` to a string `"lots"`.
5. **Negative XP**: Setting `xp` to `-500`.
6. **Out of bounds Score**: Setting `score` to `150` in a journey log.
7. **Invalid ID Poisoning**: Using a 2KB string as a journey ID.
8. **Shadow Update**: Updating a profile but also trying to change the `streak` via a "Ghost Field" not allowed in that specific update branch if restricted.
9. **Tampering with Time**: Providing a futuristic `timestamp` in the future from client (though rules will check for valid number, we prefer server time if possible, but here apps use `Date.now()`).
10. **Orphaned Writes**: Writing a journey log for a user that doesn't have a profile yet (checking via `exists`).
11. **Massive Strings**: Setting `subject` to a 1MB string (buffer overflow/wallet attack).
12. **Anonymous PII Leak**: Reading `email` (if it existed) without being the owner.

## 3. The Test Runner Plan
I will generate `firestore.rules` that block all the above.
