# Authenticated feature wiring across spot submission, reviews, bookmarks, and dashboard

This change connects five previously unlinked surfaces to their backend counterparts: the spot creation form now posts through the shared axios instance with auth headers, the review modal calls `postReview`, the place card gains a bookmark toggle gated on authentication, the dashboard's Saved panel fetches real data via `getMySavedSpots`, and a Profile Settings panel is added with load/save against the user profile API. The approach is consistent — all mutations go through `src/api/client.js`, which holds a single axios instance with a token interceptor, so every authenticated call inherits the auth header automatically.

Watch for: the `toggleSaveSpot` function in `client.js` hits `/saves/toggle` rather than the task-specified `POST /api/users/favorites/:spotId` — a route mismatch that could fail silently at runtime if the backend doesn't expose that alias. The `postReview` function also hits `/spots/:id/reviews` while `fetchReviews` hits `/reviews?placeId=` — two different resource paths for the same domain, which is worth confirming against the backend. The "My Spots" sidebar item listed in the review goals is absent.

**Verdict**: NEEDS_CHANGES

---

## High-level view

The `client.js` additions are clean and all use the existing `api` instance, so the auth interceptor is inherited without duplication. The new exports cover reviews, saves, and profile exactly as specified. The one structural concern is that `toggleSaveSpot` calls `/saves/toggle` rather than `POST /api/users/favorites/:spotId` as called out in the task.

`CreateHotspot` fully implements the required UX contract — token check before submit, `isLoading` disabling the button with label feedback, error display, and a success confirmation before redirecting. No gaps here.

`UserReviewModal` wires `postReview` correctly and handles the unauthenticated case with a visible prompt rather than a silent failure. Loading and error states are both surfaced. One behavioral asymmetry: `reviewerName` is sent as both `guestName` and `guestHandle` and is required by the HTML form, but for authenticated users the backend likely already has their identity — this may cause a redundant name field in production, though it is not a blocker.

`PlaceCard` meets all the structural requirements: bookmark button is conditionally rendered on `isAuthenticated && onToggleSave`, calls `e.stopPropagation()` (and also `e.preventDefault()` to suppress the wrapping `<Link>`), and the card div carries `position: relative`.

The dashboard header correctly renders `<small>Plateau Explorer</small>` directly below the `<strong>` name. The Saved panel calls `getMySavedSpots()` inside a top-level `useEffect` gated on `activeNav === 'Saved'`, and the Profile panel is fully implemented with load and save. Both `useEffect` hooks are at the top level of the component, not inside JSX. The sidebar includes Saved Spots and Profile Settings. However, the "My Spots" sidebar entry called out in the review goals is not present — there is no panel or navigation item for the user's submitted spots.

<details>
<summary>Issues (3)</summary>

1. **Favorite endpoint mismatch** — `toggleSaveSpot` in `client.js` posts to `/saves/toggle` instead of `POST /api/users/favorites/:spotId` as specified. If the backend only exposes the specified route, saves will silently 404. Align the client path with the actual backend route, or confirm the backend supports `/saves/toggle`.

2. **Missing "My Spots" panel** — The sidebar has no entry for "My Spots" (the user's submitted spots), and no corresponding panel exists in `UserDashboard.jsx`. The task explicitly requires displaying the user's submitted spots. Add a sidebar button for `activeNav === 'MySpots'` and a panel that fetches the user's own place submissions.

3. **`postReview` vs `fetchReviews` path asymmetry** — `postReview` writes to `/spots/:id/reviews` while `fetchReviews` reads from `/reviews?placeId=`. These are different URL shapes for the same resource. Confirm both endpoints exist on the backend; if reviews live under `/spots/:id/reviews`, `fetchReviews` should use `/spots/:id/reviews` as well to avoid a broken read path.

</details>

<details>
<summary>Details</summary>

### Auth interceptor integrity in client.js

The `api` axios instance is created once and the interceptor is attached once. All new exports — `postReview`, `fetchReviews`, `toggleSaveSpot`, `getMySavedSpots`, `checkIsSaved`, `getUserProfile`, `updateUserProfile` — call through `api`, so they all inherit the token header. There is no second interceptor, no duplicate instance, and no manual `Authorization` header construction in any of the new exports.

### Favorite/bookmark route mismatch (confirmed)

`toggleSaveSpot` in `client.js` (line ~98) sends `POST /saves/toggle` with `{ placeId }` in the body. The task specification calls for `POST /api/users/favorites/:spotId`. These are structurally different: one is a generic toggle endpoint with a body parameter, the other is a RESTful route with the ID in the path. Whether this is a problem depends entirely on the backend, but the frontend doesn't match the stated contract. If the backend only handles the `/users/favorites/:spotId` pattern, all bookmark actions will fail.

### CreateHotspot submit flow (confirmed)

Token check: `if (!localStorage.getItem('token') && !localStorage.getItem('jos_pulse_token'))` — runs before the API call and sets `submitError` with a user-visible message. `isLoading` is set to `true` before the call and `false` in `finally`. The submit button carries `disabled={isLoading}` and its label switches to `'Saving...'`. A 201 (or any 2xx) response triggers `setSubmitSuccess(true)` followed by a 1500ms redirect. Errors populate `submitError`, displayed in red below the form. All four requirements are met.

### Review modal unauthenticated path (confirmed)

When `isAuthenticated` is false the modal renders a "Please log in to post a review" message with a Close button rather than the form. This gates the review flow correctly. The form is only rendered for authenticated users, and `handleSubmit` is only reachable via that form, so there is no code path where `postReview` fires without a token.

The `reviewerName` field is marked `required` in the HTML and is sent to the API as both `guestName` and `guestHandle`. For authenticated users this is a UX redundancy — they're already identified by their token — but it is not a blocking defect unless the backend rejects the extra fields.

### PlaceCard bookmark button (confirmed)

The button renders only when `isAuthenticated && onToggleSave` are both truthy. The click handler calls `e.preventDefault()` (suppresses `<Link>` navigation) and `e.stopPropagation()` (stops event bubbling). The wrapping `<div>` carries `style={{ position: 'relative' }}` inline, and the button is positioned `absolute` at `top: 8, right: 8` with `zIndex: 1`. All structural requirements are satisfied.

### Dashboard: Plateau Explorer label (confirmed)

In the `userInfo` div inside the header:
```jsx
<strong>{currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName || ''}`.trim() : 'Explorer'}</strong>
<small>Plateau Explorer</small>
```
`<small>Plateau Explorer</small>` is a direct sibling of `<strong>`, rendered below the name. Requirement met.

### Dashboard: Missing My Spots panel (confirmed)

The sidebar renders six buttons: Overview, Bookings, Saved Spots, Profile Settings, Live Feed, Map Engine. There is no "My Spots" button and no `activeNav === 'MySpots'` branch in the main content area. The task requires displaying the user's submitted spots; this panel is entirely absent.

### Dashboard useEffect placement (confirmed)

Both new `useEffect` hooks — one for `activeNav === 'Saved'` and one for `activeNav === 'Profile'` — are declared unconditionally at the top level of the `Dashboard` component, above the `return` statement. No hooks are inside JSX conditionals.

</details>

---

## File map

<details>
<summary>Files reviewed</summary>

- `src/api/client.js` — Added `postReview`, `fetchReviews`, `toggleSaveSpot`, `getMySavedSpots`, `checkIsSaved`, `getUserProfile`, `updateUserProfile`; existing interceptor and instance unchanged.
- `src/CreateHotspot.jsx` — `handleSubmit` now checks token, uses `createPlace`/`updatePlace` from client, sets loading/error/success states, disables button during submission.
- `src/Components/UserReviewModal.jsx` — New component; wires `postReview`, gates form on auth, handles loading/error/success states.
- `src/Components/PlaceCard.jsx` — Added conditionally-rendered bookmark button with `stopPropagation`; card div set to `position: relative`.
- `src/UserDashboard.jsx` — Added Saved Spots and Profile Settings sidebar buttons and panels; "Plateau Explorer" `<small>` added under user name; `getMySavedSpots`, `getUserProfile`, `updateUserProfile` all wired.

