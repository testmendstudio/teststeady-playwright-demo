# Playwright web demo — TestSteady

A small, real regression suite for a public demo store ([saucedemo.com](https://www.saucedemo.com)),
built the way we build suites for clients: page objects, one sign-in shared across tests,
three browsers in CI, and an HTML report on every run.

**Latest report:** _link added once GitHub Pages is on_

## What it covers

| Area | Checks |
|---|---|
| Login | valid sign-in, locked-out user, wrong password, required fields, protected pages |
| Products | sort by price (both ways) and by name, cart badge on add/remove, cart survives reload |
| Checkout | two-item purchase with subtotal + 8% tax + total checked to the cent, required postal code, cancel keeps the cart |

Every test runs in **Chromium, Firefox and WebKit (Safari's engine)**.

## How it's built

```
pages/        Page objects — one class per screen, all locators in one place
fixtures/     Test fixtures that hand each test the pages it needs, plus test data
tests/        auth.setup.ts signs in once; *.spec.ts are the tests
.github/      CI: 3 browsers in parallel → one merged HTML report → GitHub Pages
```

Choices worth noting:

- **Stable locators.** Tests find elements by `data-test` attributes and roles, not CSS paths,
  so a restyle doesn't break them.
- **Sign in once.** A setup project logs in and saves the session; every other test starts signed in.
- **Checks that mean something.** Totals are worked out from the product prices, not hard-coded.
- **Low retries.** CI retries a failed test once at most, and the report flags any test that needed a
  retry, so flaky tests get seen and fixed instead of hidden.
- **Evidence on failure.** Trace, screenshot and video are kept for every failed test.

## Run it yourself

```bash
npm ci
npx playwright install
npm test               # all three browsers
npm run test:chromium  # one browser, quicker
npm run report         # open the HTML report
```

---

Built by **TestSteady**, web + mobile test automation for startups.
[LinkedIn](https://www.linkedin.com/company/teststeady/)
