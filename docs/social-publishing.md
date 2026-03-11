# Social Media Publishing

The rescue platform includes a built-in social media publisher that lets editors post animal profiles, blog posts, and resources directly to **Facebook**, **Bluesky**, **Threads**, **Mastodon**, and **Instagram** — with AI-generated, platform-appropriate copy and automatic image handling.

---

## How It Works

1. Navigate to **`/admin/social-publish`** on your site.
2. Choose a content type (Animals, Blog, Resources) and select the item to post.
3. Select which platforms to publish to.
4. Click **Generate Copy** — the AI will write platform-optimised text for each platform based on the content's details.
5. Review and edit each platform's copy in the text boxes.
6. Click **Publish Now** to post to all selected platforms simultaneously.

---

## Platform Specifications

| Platform | Max Characters | Max Images | Notes |
| :--- | :--- | :--- | :--- |
| **Facebook** | 63,206 | 10 | Long-form post with all images; no hashtags |
| **Bluesky** | 300 | 4 | Short punchy post with 2–3 hashtags |
| **Threads** | 500 | 20 | Friendly, conversational; 3–5 hashtags |
| **Mastodon** | 500 | 4 | Community-focused; 3–5 hashtags |
| **Instagram** | 2,200 | 10 | Attention-grabbing opener; 15–20 hashtags |

---

## Setting Up Credentials

All credentials are stored in `.env.local` (local development) or your hosting provider's environment variables (production). **Never commit credentials to Git.**

### Bluesky

The easiest platform to set up — no app approval required.

1. Log in to [bsky.app](https://bsky.app)
2. Go to **Settings → App Passwords → Add App Password**
3. Name it `rescue-platform` and copy the generated password
4. Set in `.env.local`:
   ```
   BLUESKY_HANDLE=yourhandle.bsky.social
   BLUESKY_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx
   ```

### Mastodon

Works with any Mastodon instance (mastodon.social, fosstodon.org, etc.).

1. Log in to your Mastodon instance
2. Go to **Settings → Development → New Application**
3. Name it `rescue-platform`, enable `write:statuses` and `write:media` scopes
4. Copy the **Access Token**
5. Set in `.env.local`:
   ```
   MASTODON_INSTANCE_URL=https://mastodon.social
   MASTODON_ACCESS_TOKEN=your_token_here
   ```

### Facebook

Requires a Facebook Page and a Meta Developer App.

1. Go to [developers.facebook.com](https://developers.facebook.com) and create an app
2. Add the **Pages API** product
3. Under **Tools → Graph API Explorer**, generate a User Access Token with these permissions:
   - `pages_manage_posts`
   - `pages_read_engagement`
4. Exchange for a **long-lived User Access Token** (60 days):
   ```
   GET https://graph.facebook.com/oauth/access_token
     ?grant_type=fb_exchange_token
     &client_id={app-id}
     &client_secret={app-secret}
     &fb_exchange_token={short-lived-token}
   ```
5. Get your **Page Access Token** (never expires):
   ```
   GET https://graph.facebook.com/{user-id}/accounts
     ?access_token={long-lived-user-token}
   ```
   Find your page in the response and copy its `access_token` and `id`.
6. Set in `.env.local`:
   ```
   FACEBOOK_PAGE_ID=123456789
   FACEBOOK_PAGE_ACCESS_TOKEN=EAAxxxxx...
   ```

### Threads

Requires a Meta Developer App with the Threads API product.

1. Go to [developers.facebook.com](https://developers.facebook.com) and create or use an existing app
2. Add the **Threads API** product
3. Under **Threads API → User Token Generator**, generate a token with:
   - `threads_basic`
   - `threads_content_publish`
4. Exchange for a long-lived token (60 days) via the Threads token exchange endpoint
5. Your **User ID** is the numeric ID shown in the token generator
6. Set in `.env.local`:
   ```
   THREADS_USER_ID=123456789
   THREADS_ACCESS_TOKEN=THQxxxxx...
   ```

> **Note:** As of September 2025, Threads accounts no longer require a linked Instagram account.

### Instagram

Requires an Instagram Business or Creator account linked to a Facebook Page.

1. Ensure your Instagram account is set to **Business** or **Creator** in the Instagram app
2. Link it to a Facebook Page (Instagram → Settings → Account → Linked Accounts)
3. Go to [developers.facebook.com](https://developers.facebook.com) and create an app
4. Add the **Instagram Graph API** product
5. Generate a User Access Token with:
   - `instagram_basic`
   - `instagram_content_publish`
6. Get your Instagram Business Account ID:
   ```
   GET https://graph.facebook.com/me/accounts?access_token={token}
   ```
   Then:
   ```
   GET https://graph.facebook.com/{page-id}?fields=instagram_business_account&access_token={token}
   ```
7. Set in `.env.local`:
   ```
   INSTAGRAM_USER_ID=123456789
   INSTAGRAM_ACCESS_TOKEN=EAAxxxxx...
   ```

---

## Content-Specific Behaviour

### Animals

The AI uses the following fields to generate copy:
- Name, species, breed, age, sex, colour
- Bio (body text)
- Good with / Not good with
- Lifecycle status (Available for Adoption, Sanctuary, etc.)
- Link to the animal's profile page

**Facebook** gets a long, story-like post with all images attached.
**Bluesky / Mastodon / Threads** get a short teaser with up to 4 images and hashtags.
**Instagram** gets a caption with 15–20 hashtags and up to 10 images as a carousel.

### Blog Posts & Resources

The AI uses the title, body excerpt, and tags to generate appropriate copy for each platform.

---

## Troubleshooting

| Error | Cause | Fix |
| :--- | :--- | :--- |
| `BLUESKY_HANDLE or BLUESKY_APP_PASSWORD not configured` | Missing env vars | Add credentials to `.env.local` |
| `upstream image resolved to private ip` | Image URL is `localhost:8888` | Ensure `NEXT_PUBLIC_DRUPAL_BASE_URL` is set to the public Drupal URL |
| Facebook `(#200) The user hasn't authorized the application` | Token missing `pages_manage_posts` | Re-generate token with correct permissions |
| Instagram `Media posted before publishing step` | Container not published | Check `INSTAGRAM_USER_ID` is correct |
| Threads `Invalid OAuth access token` | Token expired | Refresh the long-lived token (valid 60 days) |

---

## Production Deployment

In production, set all social credentials as environment variables in your hosting provider (Vercel, Railway, etc.) — **do not** put them in `.env.local` for production builds.

On Vercel: **Project Settings → Environment Variables**
On Railway: **Service → Variables**
