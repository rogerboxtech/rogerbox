# E2E Tests for RogerBox

This directory contains end-to-end tests for the RogerBox fitness platform using Playwright.

## Test Files

- `register.spec.ts` - User registration flow tests
- `login.spec.ts` - User login flow tests
- `dashboard.spec.ts` - Dashboard functionality tests
- `profile.spec.ts` - User profile management tests
- `onboarding.spec.ts` - User onboarding flow tests
- `password-reset.spec.ts` - Password reset functionality tests
- `complete-flow.spec.ts` - Complete user journey tests

## Running Tests

### Run all tests
```bash
npm run test
```

### Run tests with UI
```bash
npm run test:ui
```

### Run tests in headed mode (see browser)
```bash
npm run test:headed
```

### Debug tests
```bash
npm run test:debug
```

### Run specific test file
```bash
npx playwright test tests/register.spec.ts
```

### Run tests in specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Test Data

Tests use dynamic email addresses to avoid conflicts:
- Format: `test{timestamp}@example.com`
- Example: `test1703123456789@example.com`

## Prerequisites

1. Make sure the development server is running:
   ```bash
   npm run dev
   ```

2. Ensure you have valid test credentials in Supabase:
   - Email: `andrewjruss7@gmail.com`
   - Password: `password123`

## Test Coverage

### Registration Flow
- ✅ Form validation
- ✅ Email format validation
- ✅ Password length validation
- ✅ Successful registration
- ✅ Existing email error handling
- ✅ Navigation to login

### Login Flow
- ✅ Form validation
- ✅ Email format validation
- ✅ Successful login
- ✅ Invalid credentials error
- ✅ Password visibility toggle
- ✅ Navigation to forgot password

### Dashboard
- ✅ User profile display
- ✅ My Courses section
- ✅ Complementos section
- ✅ User menu navigation
- ✅ Logout functionality
- ✅ Loading states

### Profile Management
- ✅ Profile information display
- ✅ Edit profile modal
- ✅ Form validation
- ✅ Password update validation
- ✅ Profile update success
- ✅ Navigation back to dashboard

### Onboarding
- ✅ Form validation
- ✅ Weight/height validation
- ✅ Gender selection
- ✅ Goals selection
- ✅ Target weight calculation
- ✅ Successful completion

### Password Reset
- ✅ Email validation
- ✅ Reset email sending
- ✅ Reset password page
- ✅ New password validation
- ✅ Password confirmation
- ✅ Navigation between pages

### Complete Flow
- ✅ Full user journey
- ✅ Error handling
- ✅ Session persistence
- ✅ Navigation between all pages

## Notes

- Tests are designed to be independent and can run in parallel
- Each test cleans up after itself
- Tests use realistic user data and scenarios
- All text assertions are in Spanish to match the application language
