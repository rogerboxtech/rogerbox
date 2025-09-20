import { test, expect } from '@playwright/test';

test.describe('User Registration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display registration form', async ({ page }) => {
    // Check if registration form is visible
    await expect(page.locator('h1')).toContainText('ROGERBOX');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Check for validation errors
    await expect(page.locator('text=El email es requerido')).toBeVisible();
    await expect(page.locator('text=La contraseña es requerida')).toBeVisible();
  });

  test('should show validation error for invalid email', async ({ page }) => {
    // Fill form with invalid email
    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('input[type="password"]', 'password123');
    await page.fill('input[placeholder*="nombre"]', 'Test User');
    
    await page.click('button[type="submit"]');
    
    // Check for email validation error
    await expect(page.locator('text=El formato del email no es válido')).toBeVisible();
  });

  test('should show validation error for short password', async ({ page }) => {
    // Fill form with short password
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', '123');
    await page.fill('input[placeholder*="nombre"]', 'Test User');
    
    await page.click('button[type="submit"]');
    
    // Check for password validation error
    await expect(page.locator('text=La contraseña debe tener al menos 6 caracteres')).toBeVisible();
  });

  test('should successfully register new user', async ({ page }) => {
    const timestamp = Date.now();
    const testEmail = `test${timestamp}@example.com`;
    
    // Fill registration form
    await page.fill('input[placeholder*="nombre"]', 'Test User');
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', 'password123');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for redirect to onboarding
    await page.waitForURL('/onboarding');
    
    // Verify we're on onboarding page
    await expect(page.locator('h1')).toContainText('ONBOARDING');
  });

  test('should show error for existing email', async ({ page }) => {
    // Try to register with existing email
    await page.fill('input[placeholder*="nombre"]', 'Test User');
    await page.fill('input[type="email"]', 'andrewjruss7@gmail.com');
    await page.fill('input[type="password"]', 'password123');
    
    await page.click('button[type="submit"]');
    
    // Check for existing email error
    await expect(page.locator('text=Ya tienes una cuenta registrada')).toBeVisible();
    
    // Check if "Go to Login" button is present
    await expect(page.locator('text=Ir a Iniciar Sesión')).toBeVisible();
  });

  test('should navigate to login when clicking "Go to Login" button', async ({ page }) => {
    // Try to register with existing email
    await page.fill('input[placeholder*="nombre"]', 'Test User');
    await page.fill('input[type="email"]', 'andrewjruss7@gmail.com');
    await page.fill('input[type="password"]', 'password123');
    
    await page.click('button[type="submit"]');
    
    // Wait for error message
    await expect(page.locator('text=Ya tienes una cuenta registrada')).toBeVisible();
    
    // Click "Go to Login" button
    await page.click('text=Ir a Iniciar Sesión');
    
    // Verify we're on login page
    await expect(page.locator('h1')).toContainText('INICIAR SESIÓN');
  });
});
