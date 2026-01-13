# Changelog

All notable changes to this project are documented here.

## Unreleased (2026-01-13)
- Frontend
  - Redesigned booking form with floating labels and grouped fields (`index.html`).
  - Realistic button styles: gradients, shadows, hover/active states, ripple effect and loading/success animations (`style.css`).
  - Added icons to CTA buttons across `index.html`, `services.html`, and `products.html`.
  - Client-side enhancements: SPA navigation, form submission UX, inline validation, button spinner helpers (`script.js`).

- Backend / Dev
  - Added rate-limit robustness and validation fixes in `server/api/views.py`.
  - Serve additional frontend HTML files in dev via `server/server/urls.py` for convenience.
  - Added migrations and applied locally for models `Booking` and `Contact`.

## Notes
- Dev server: run `python manage.py runserver` from the `server/` folder to test locally.
- Tests: `python manage.py test api` passes locally after these changes.
