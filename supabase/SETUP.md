# Supabase Setup — Gul Printer Admin CMS

This folder contains the database/security foundation for the Gul Printer admin panel.

## Phase 1 setup

1. Create a Supabase project on the Free plan.
2. Open **SQL Editor** in Supabase.
3. Run `schema.sql`.
4. In **Authentication → Users**, create the single admin user.
5. Copy that user's UUID and run:

```sql
insert into public.admin_users (user_id)
values ('PASTE-ADMIN-USER-UUID-HERE');
```

6. From **Project Settings → API**, copy:
   - Project URL
   - Publishable/anon key

These two public client values will be connected to the website in the next coding phase. Never place the Supabase service-role key in browser code.

## Security model

- Public visitors can only read visible/published website content.
- Only the authenticated user listed in `admin_users` can create, update or delete CMS content.
- Media uploads use the public `site-media` bucket, while upload/edit/delete permissions remain admin-only.
- The existing public website remains unchanged during Phase 1.
