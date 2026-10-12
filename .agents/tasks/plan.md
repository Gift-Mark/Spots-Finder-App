# Implementation Plan — Connect Authenticated Features

## Exploration findings

| Finding | Detail |
|---|---|
| Token keys | `localStorage.getItem('token') \|\| localStorage.getItem('jos_pulse_token')` — both written by Login.jsx |
| User object | `localStorage.getItem('user')` (JSON) |
| HTTP client | `src/api/client.js` — axios instance with auth interceptor already attached; **do not add a second interceptor** |
| Confirmed backend routes | POST `/api/places`, POST `/api/reviews`, GET `/api/reviews?placeId=`, POST `/api/saves/toggle`, GET `/api/saves/my-saves`, GET `/api/saves/check/:placeId`, GET `/api/users/profile`, PUT `/api/users/profile` |
| No `/api/spots` | Use `/api/places` and `/api/saves/*` throughout — never `/api/spots` |
| "My Spots" gap | The `Place` model has **no `createdBy`/`userId` field** and `placeController.js` exposes no `?createdBy=` filter. Therefore "My Spots" panel cannot show submissions; it will render the same data as "Saved Spots" (via `getMySavedSpots`) and display a one-line note: "Submitted spots tracking coming soon." Document this gap in a `// TODO` comment. |
| CSS classes | `miniLogList` and `subtext` appear in `UserDashboard.jsx` markup but are **not** in `userDashboard.module.css` — they currently produce invisible elements. Add them when adding the new dashboard classes. |
| Header "Plateau Explorer" | Already correct: `<strong>…name…</strong>` followed by `<small>Plateau Explorer</small>` as siblings inside one `<div>` inside `.userInfo`. No structural change needed; confirm and leave as-is. |
| CreateHotspot | Uses raw `fetch`, not the `api` axios instance. Keep raw `fetch` but replace `alert()` with inline state-driven UI and add the auth-guard check. |
| PlaceCard stylesheet | Uses `discover.module.css` with `position` set by `.place-card`. The bookmark button must use `style={{ position: 'absolute', top: '8px', right: '8px' }}` inline, and the wrapping Link/div must already have `position: relative` (add it if missing). |
| SaveCard props | `SaveCard` accepts `{ image, title }`. Pass `place.heroImage || place.coverImage || place.image` as `image` and `place.title || place.name` as `title`. |

---

## Ordered implementation steps

Dependencies: Step 1 must be done first — all other steps import from `src/api/client.js`. Steps 2–4 are independent of each other once Step 1 is done. Step 5 depends on Step 1 only. The two CSS additions in Step 6 are required before Step 5 renders correctly but can be done alongside Step 5.

---

- [ ] 1. **Add seven new exported functions to `src/api/client.js`**

  Append the following exports after the existing `logUserBehavior` function. Do NOT add a new interceptor — the existing one already attaches the token.

  ```js
  // --- REVIEWS API ---
  export const postReview = async (placeId, data) => {
    const response = await api.post('/reviews', { placeId, ...data });
    return response.data;
  };

  export const fetchReviews = async (placeId) => {
    const response = await api.get('/reviews', { params: { placeId } });
    return response.data;
  };

  // --- SAVES / BOOKMARKS API ---
  export const toggleSaveSpot = async (placeId) => {
    const response = await api.post('/saves/toggle', { placeId });
    return response.data;
  };

  export const getMySavedSpots = async () => {
    const response = await api.get('/saves/my-saves');
    return response.data;
  };

  export const checkIsSaved = async (placeId) => {
    const response = await api.get(`/saves/check/${placeId}`);
    return response.data;
  };

  // --- USER PROFILE API ---
  export const getUserProfile = async () => {
    const response = await api.get('/users/profile');
    return response.data;
  };

  export const updateUserProfile = async (data) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  };
  ```

  Files: `src/api/client.js`

  Verify: `npm run dev` (or `vite build`) — no console import errors. No unit test file exists for this module; verify by confirming the dev build compiles without errors.

---

- [ ] 2. **Harden `src/CreateHotspot.jsx` — auth guard, loading, success, and error states**

  **Depends on:** Step 1 (imports `postReview` etc. are in the same file, but this step only needs the interceptor to be in place, which it already is).

  Make these targeted changes:

  a. **Auth guard** — Add at the top of the component body (after the `useNavigate`/`useParams` hooks):
  ```js
  const token = localStorage.getItem('token') || localStorage.getItem('jos_pulse_token');
  ```
  Then, before the `return`, add a guard:
  ```jsx
  if (!token) {
    return (
      <div className={styles.adminContainer}>
        <Sidebar />
        <main className={styles.mainContent} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>Please <a href="/login">log in</a> to create a hot spot.</p>
        </main>
      </div>
    );
  }
  ```

  b. **State declarations** — Add three new `useState` declarations alongside the existing ones:
  ```js
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  ```

  c. **Replace `handleSubmit`** — Rewrite the entire function:
  - Remove the `const token = localStorage.getItem("token");` line inside it (token is now read at component top).
  - Set `setIsLoading(true)` and `setSubmitError('')` at the start of the `try` block.
  - Replace `if (response.ok) { navigate("/management"); }` with:
    ```js
    if (response.ok) {
      setSubmitSuccess(true);
      setTimeout(() => navigate('/userDashboard'), 1500);
    }
    ```
  - Replace the `else` branch (currently calls `alert`) with:
    ```js
    } else {
      const err = await response.json();
      setSubmitError(err.message || 'Failed to save hot spot.');
    }
    ```
  - In the `catch` block, add: `setSubmitError('Network error — please try again.');`
  - Add `finally { setIsLoading(false); }` after the catch block.

  d. **Update the submit button** — In the JSX bottom bar, replace the submit button with:
  ```jsx
  <button type="submit" className={styles.saveBtn} disabled={isLoading}>
    {isLoading ? 'Saving…' : (
      <><FontAwesomeIcon icon={faFloppyDisk} /> {isEditMode ? 'Update Hot Spot' : 'Save Hot Spot'}</>
    )}
  </button>
  ```

  e. **Add feedback UI** — Directly above the `<div className={styles.bottomBar}>`, add:
  ```jsx
  {submitError && <p style={{ color: '#dc2626', marginBottom: '0.5rem' }}>{submitError}</p>}
  {submitSuccess && <p style={{ color: '#16a34a', marginBottom: '0.5rem' }}>Hot spot saved! Redirecting…</p>}
  ```

  Files: `src/CreateHotspot.jsx`

  Verify: `npm run dev` — navigate to `/create` (or equivalent) without a token; confirm the "Please log in" message renders. With a valid token, submit the form; confirm button shows "Saving…" and inline error/success messages appear.

---

- [ ] 3. **Wire `src/Components/UserReviewModal.jsx` to the real API**

  **Depends on:** Step 1.

  a. **Import** — Add at the top of the file:
  ```js
  import { postReview } from '../api/client';
  ```

  b. **Token check** — Read the token once at the start of the component body:
  ```js
  const token = localStorage.getItem('token') || localStorage.getItem('jos_pulse_token');
  const user = (() => { try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; } })();
  ```

  c. **New state** — Add two new `useState` declarations:
  ```js
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  ```

  d. **Replace `handleSubmit`** — Rewrite the function:
  ```js
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!visitorTip.trim()) {
      setApiError('Please enter a short visitor tip or review.');
      return;
    }
    setApiError('');
    setIsLoading(true);
    try {
      await postReview(spot._id || spot.placeId, {
        rating,
        comment: visitorTip,
        guestName: user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : reviewerName,
        guestHandle: reviewerName,
      });
      setIsSubmitted(true);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  ```

  e. **No-token guard** — In the JSX, before rendering the `<form>`, add a conditional:
  ```jsx
  {!token ? (
    <div className={styles.successState}>
      <p>Please <a href="/login">log in</a> to post a review.</p>
    </div>
  ) : ( /* existing form JSX */ )}
  ```
  The existing success/submitted state block renders independently of this guard (it's controlled by `isSubmitted`).

  f. **Submit button** — Update to show loading state:
  ```jsx
  <button type="submit" className={styles.primaryBtn} disabled={isLoading}>
    {isLoading ? 'Submitting…' : 'Submit Contribution'}
  </button>
  ```

  g. **Error message** — In the `<form>`, just above `<div className={styles.formFooter}>`, add:
  ```jsx
  {apiError && <p style={{ color: '#dc2626', fontSize: '0.85rem' }}>{apiError}</p>}
  ```

  Files: `src/Components/UserReviewModal.jsx`

  Verify: `npm run dev` — open the review modal without a token; confirm "Please log in" message. With a token, submit a review with empty tip; confirm inline error appears. A full end-to-end POST requires the backend running.

---

- [ ] 4. **Add bookmark toggle button to `src/Components/PlaceCard.jsx`**

  **Depends on:** Step 1.

  a. **Extend props signature**:
  ```jsx
  export default function PlaceCard({ place, variant = "recommended", isSaved = false, onToggleSave }) {
  ```

  b. **Token read** — Add inside the component body:
  ```js
  const isLoggedIn = Boolean(localStorage.getItem('token') || localStorage.getItem('jos_pulse_token'));
  ```

  c. **Make the card `<div>` position-relative** — The wrapping `<div className={...}>` must have `position: relative` so the absolute bookmark button is positioned against it. Assign it inline:
  ```jsx
  <div
    className={`${styles["place-card"]} ${styles[variant] || ""}`}
    style={{ position: 'relative' }}
  >
  ```

  d. **Bookmark button** — Add as the first child inside that `<div>` (before the `<img>`):
  ```jsx
  {isLoggedIn && onToggleSave && (
    <button
      type="button"
      aria-label={isSaved ? 'Remove bookmark' : 'Bookmark this spot'}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggleSave(place._id || place.id);
      }}
      style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        zIndex: 10,
        background: 'rgba(255,255,255,0.85)',
        border: 'none',
        borderRadius: '50%',
        width: '32px',
        height: '32px',
        cursor: 'pointer',
        fontSize: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {isSaved ? '❤️' : '🤍'}
    </button>
  )}
  ```

  The `Link` wrapper still handles navigation — the `e.preventDefault()` + `e.stopPropagation()` on the button click prevents the Link from firing.

  Files: `src/Components/PlaceCard.jsx`

  Verify: `npm run dev` — load the Discover/explore page. With a token in localStorage, confirm each card shows a heart button in the top-right corner. Clicking it should not navigate (stopPropagation works). Without a token, button should not appear.

---

- [ ] 5. **Overhaul `src/UserDashboard.jsx` — Plateau Explorer badge placement + three new panels**

  **Depends on:** Step 1. Step 6 (CSS additions) should be done alongside or immediately before this step.

  ### 5a — Verify "Plateau Explorer" badge (no code change needed)

  The header markup already reads:
  ```jsx
  <div>
    <strong>{currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName || ''}`.trim() : 'Explorer'}</strong>
    <small>Plateau Explorer</small>
  </div>
  ```
  `<strong>` and `<small>` are block-level siblings inside a `<div>`, so `<small>` naturally renders below `<strong>`. **No change required here.**

  The sidebar `conciergeBox` block and the `sidebarSection` do **not** currently show the user name or "Plateau Explorer" badge — add it to the sidebar profile section as a new block directly above the `MAIN CONSOLE` nav buttons:
  ```jsx
  {/* Sidebar profile identity */}
  <div style={{ marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>
    <span style={{ fontSize: '1.5rem' }}>👤</span>
    <div style={{ marginTop: '0.25rem' }}>
      <strong style={{ fontSize: '0.85rem', color: '#0f172a' }}>
        {currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName || ''}`.trim() : 'Explorer'}
      </strong>
      <br />
      <small className={styles.sidebarLabel} style={{ color: '#6366f1', fontWeight: 700 }}>Plateau Explorer</small>
    </div>
  </div>
  ```
  This satisfies the requirement: "Plateau Explorer appears directly under the user's display name in the sidebar profile section."

  ### 5b — Add imports

  At the top of the file, add:
  ```js
  import { getMySavedSpots, getUserProfile, updateUserProfile } from './api/client';
  import { SaveCard } from './Components/SaveCard';
  ```

  ### 5c — Add state for the three new panels

  Add these `useState` declarations in the component body (alongside existing ones):
  ```js
  // My Spots panel
  const [mySpots, setMySpots] = useState([]);
  const [mySpotsLoading, setMySpotsLoading] = useState(false);

  // Saved Spots panel
  const [savedSpots, setSavedSpots] = useState([]);
  const [savedSpotsLoading, setSavedSpotsLoading] = useState(false);

  // Profile Settings panel
  const [profileData, setProfileData] = useState({ firstName: '', lastName: '', email: '', profileImage: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  ```

  ### 5d — Add data-fetch effects

  Add three `useEffect` hooks after the existing socket `useEffect`:

  ```js
  // Fetch saved spots when 'Saved' nav is active
  useEffect(() => {
    if (activeNav !== 'Saved') return;
    setSavedSpotsLoading(true);
    getMySavedSpots()
      .then((res) => setSavedSpots(res.data || []))
      .catch((err) => console.error('Failed to load saved spots:', err))
      .finally(() => setSavedSpotsLoading(false));
  }, [activeNav]);

  // Fetch "my spots" when 'MySpots' nav is active
  // NOTE: Place model has no createdBy field; using getMySavedSpots as fallback.
  // TODO: when backend exposes GET /api/places?createdBy=userId, replace this call.
  useEffect(() => {
    if (activeNav !== 'MySpots') return;
    setMySpotsLoading(true);
    getMySavedSpots()
      .then((res) => setMySpots(res.data || []))
      .catch((err) => console.error('Failed to load my spots:', err))
      .finally(() => setMySpotsLoading(false));
  }, [activeNav]);

  // Fetch profile when 'Profile' nav is active
  useEffect(() => {
    if (activeNav !== 'Profile') return;
    setProfileLoading(true);
    getUserProfile()
      .then((res) => {
        const u = res.user || {};
        setProfileData({
          firstName: u.firstName || '',
          lastName: u.lastName || '',
          email: u.email || '',
          profileImage: u.profileImage || '',
        });
      })
      .catch((err) => console.error('Failed to load profile:', err))
      .finally(() => setProfileLoading(false));
  }, [activeNav]);
  ```

  ### 5e — Add three sidebar nav buttons

  In the sidebar `sidebarSection` div, after the existing `🔖 Saved Spots` button, add:
  ```jsx
  <button
    className={`${styles.sideBtn} ${activeNav === 'MySpots' ? styles.sideBtnActive : ''}`}
    onClick={() => setActiveNav('MySpots')}
  >
    📌 My Spots
  </button>
  <button
    className={`${styles.sideBtn} ${activeNav === 'Profile' ? styles.sideBtnActive : ''}`}
    onClick={() => setActiveNav('Profile')}
  >
    ⚙️ Profile Settings
  </button>
  ```
  (The existing `🔖 Saved Spots` button already uses `activeNav === 'Saved'` — keep it unchanged; only wire the panel.)

  ### 5f — Add three content panels

  In the `<main className={styles.content}>` block, add three new panel conditionals after the existing `{activeNav === 'Map' && …}` block:

  **Saved Spots panel** (wires the existing sidebar button):
  ```jsx
  {activeNav === 'Saved' && (
    <section className={styles.panelSection}>
      <h2>🔖 Saved Spots</h2>
      {savedSpotsLoading ? (
        <p className={styles.subtext}>Loading saved spots…</p>
      ) : savedSpots.length === 0 ? (
        <p className={styles.subtext}>You haven't saved any spots yet.</p>
      ) : (
        <div className={styles.cards3Grid}>
          {savedSpots.map((place) => (
            <SaveCard
              key={place._id}
              image={place.heroImage || place.coverImage || place.image || ''}
              title={place.title || place.name}
            />
          ))}
        </div>
      )}
    </section>
  )}
  ```

  **My Spots panel**:
  ```jsx
  {activeNav === 'MySpots' && (
    <section className={styles.panelSection}>
      <h2>📌 My Submitted Spots</h2>
      <p className={styles.subtext} style={{ marginBottom: '1rem' }}>
        {/* TODO: replace with actual submitted-spots endpoint when backend adds createdBy filtering */}
        Showing your saved spots. Submitted spots tracking coming soon.
      </p>
      {mySpotsLoading ? (
        <p className={styles.subtext}>Loading…</p>
      ) : mySpots.length === 0 ? (
        <p className={styles.subtext}>No spots found.</p>
      ) : (
        <div className={styles.cards3Grid}>
          {mySpots.map((place) => (
            <SaveCard
              key={place._id}
              image={place.heroImage || place.coverImage || place.image || ''}
              title={place.title || place.name}
            />
          ))}
        </div>
      )}
    </section>
  )}
  ```

  **Profile Settings panel**:
  ```jsx
  {activeNav === 'Profile' && (
    <section className={styles.panelSection}>
      <h2>⚙️ Profile Settings</h2>
      {profileLoading ? (
        <p className={styles.subtext}>Loading profile…</p>
      ) : (
        <form
          className={styles.profileForm}
          onSubmit={async (e) => {
            e.preventDefault();
            setProfileSaving(true);
            setProfileSuccess('');
            setProfileError('');
            try {
              await updateUserProfile({
                firstName: profileData.firstName,
                lastName: profileData.lastName,
                profileImage: profileData.profileImage,
              });
              setProfileSuccess('Profile updated successfully!');
            } catch (err) {
              setProfileError(err.response?.data?.message || 'Failed to update profile.');
            } finally {
              setProfileSaving(false);
            }
          }}
        >
          <div className={styles.profileField}>
            <label>First Name</label>
            <input
              type="text"
              value={profileData.firstName}
              onChange={(e) => setProfileData((p) => ({ ...p, firstName: e.target.value }))}
              required
            />
          </div>
          <div className={styles.profileField}>
            <label>Last Name</label>
            <input
              type="text"
              value={profileData.lastName}
              onChange={(e) => setProfileData((p) => ({ ...p, lastName: e.target.value }))}
            />
          </div>
          <div className={styles.profileField}>
            <label>Email (read-only)</label>
            <input type="email" value={profileData.email} readOnly style={{ opacity: 0.6, cursor: 'not-allowed' }} />
          </div>
          <div className={styles.profileField}>
            <label>Profile Image URL</label>
            <input
              type="text"
              value={profileData.profileImage}
              onChange={(e) => setProfileData((p) => ({ ...p, profileImage: e.target.value }))}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
          {profileSuccess && <p style={{ color: '#16a34a', fontSize: '0.85rem' }}>{profileSuccess}</p>}
          {profileError && <p style={{ color: '#dc2626', fontSize: '0.85rem' }}>{profileError}</p>}
          <button type="submit" className={styles.primaryDarkBtn} disabled={profileSaving}>
            {profileSaving ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      )}
    </section>
  )}
  ```

  Files: `src/UserDashboard.jsx`

  Verify: `npm run dev` — log in and open `/userDashboard`. Confirm:
  1. Sidebar shows user name with "Plateau Explorer" label directly below it.
  2. Clicking "Saved Spots" renders the saved-spots panel (spinner → SaveCards or empty state).
  3. Clicking "My Spots" renders the my-spots panel with the "coming soon" note.
  4. Clicking "Profile Settings" renders the editable form with the current user's first/last name and read-only email.

---

- [ ] 6. **Add missing CSS classes to `src/CSS/userDashboard.module.css`**

  **Depends on:** none (pure CSS additions).
  **Required by:** Step 5 panels.

  The following classes are referenced in `UserDashboard.jsx` markup but are absent from the stylesheet. Add them at the end of the file:

  ```css
  /* Used in sidebar LIVE LOGSTREAM widget */
  .miniLogList {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  /* Generic muted helper text */
  .subtext {
    color: #94a3b8;
    font-size: 0.78rem;
  }

  /* Profile settings form layout */
  .profileForm {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 480px;
  }

  .profileField {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .profileField label {
    font-size: 0.78rem;
    font-weight: 700;
    color: #475569;
  }

  .profileField input {
    padding: 0.5rem 0.75rem;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    font-size: 0.85rem;
    color: #0f172a;
    background: #ffffff;
  }

  .profileField input:focus {
    outline: 2px solid #6366f1;
    outline-offset: 1px;
  }
  ```

  Files: `src/CSS/userDashboard.module.css`

  Verify: `npm run dev` — open `/userDashboard`; confirm sidebar live-logstream list renders without layout breakage, and the profile form fields render with correct spacing.

---

## Dependency order summary

```
Step 1 (client.js exports)
  └─ Step 2 (CreateHotspot) — independent, can proceed after Step 1
  └─ Step 3 (UserReviewModal) — independent, can proceed after Step 1
  └─ Step 4 (PlaceCard bookmark) — independent, can proceed after Step 1
  └─ Step 5 (UserDashboard panels) — needs Step 1; Step 6 CSS should land first
Step 6 (CSS classes) — no code dependency, but must be done before or with Step 5
```

All steps leave the codebase in a buildable, runnable state when completed individually.

## Known gaps / TODOs

1. **My Spots submitted-spots endpoint** — `Place` model has no `createdBy`/`userId` field. The backend must add this field to `Place` schema and expose `GET /api/places?createdBy=<userId>` before the "My Spots" panel can show actual submitted spots. Until then, it falls back to saved spots with a note.
2. **PlaceCard bookmark state at list level** — `PlaceCard` accepts `isSaved` and `onToggleSave` as props, but the parent pages (Discover, etc.) must be updated separately to pass those props down (tracking a `savedIds` Set and calling `toggleSaveSpot` from `src/api/client.js`). This is out of scope for the current plan; the button simply won't appear on pages that don't pass `onToggleSave`.
3. **`guestName` field in review** — `Reviews.js` backend sends `guestName` only for guests (no token). When a logged-in user posts, the backend populates `userId` from the token and ignores `guestName`. The frontend currently passes the user's display name regardless — this is harmless; the backend ignores it for authenticated requests.
