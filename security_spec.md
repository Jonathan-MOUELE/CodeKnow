# Security Specification - CodeKnow RPG Academy

## Data Invariants
1. A user profile (`/users/{uid}`) must be created by the user themselves.
2. XP and Level are strictly increasing or stable; they cannot be decreased by the client.
3. User Mentor Progress (`/users/{uid}/mentors/{mentorId}`) must match the authenticated user's ID.
4. User Quest Progress (`/users/{uid}/quests/{questId}`) must be owned by the user.
5. Quests (`/quests/{questId}`) are read-only for students.

## The Dirty Dozen Payloads (Rejected)
1. `CREATE /users/attacker_id` while authenticated as `user_id`.
2. `UPDATE /users/user_id` setting `xp: 999999` directly.
3. `UPDATE /users/user_id` setting `level: 100` directly.
4. `CREATE /quests/new_quest` by a student.
5. `UPDATE /users/user_id/quests/quest_id` setting `status: 'completed'` without feedback.
6. `UPDATE /users/user_id` changing `uid` field.
7. `GET /users/other_user_id` (Private data).
8. `LIST /users` (Scraping user list).
9. `CREATE /users/user_id` with `admin: true` (Shadow field).
10. `UPDATE /users/user_id/mentors/mentor_id` with invalid `level` type (string instead of int).
11. `DELETE /quests/quest_id` by a student.
12. `WRITE /users/user_id` with 1MB of junk data in `displayName`.

## Test Runner logic (Conceptual)
The following rules will ensure all above are blocked.
