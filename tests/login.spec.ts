import { test, expect } from '@playwright/test';

test.describe('User Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate to login page', async ({ page }) => {
    // Click on login button (assuming there's a way to access login)
    // This might need to be adjusted based on your UI
    await page.click('text=Iniciar Sesión');
    
    // Verify we're on login page
    await expect(page.locator('h1')).toContainText('INICIAR SESIÓN');
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    // Navigate to login page
    await page.click('text=Iniciar Sesión');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Check for validation errors
    await expect(page.locator('text=El email es requerido')).toBeVisible();
    await expect(page.locator('text=La contraseña es requerida')).toBeVisible();
  });

  test('should show validation error for invalid email', async ({ page }) => {
    // Navigate to login page
    await page.click('text=Iniciar Sesión');
    
    // Fill form with invalid email
    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('input[type="password"]', 'password123');
    
    await page.click('button[type="submit"]');
    
    // Check for email validation error
    await expect(page.locator('text=El email no es válido')).toBeVisible();
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    // Navigate to login page
    await page.click('text=Iniciar Sesión');
    
    // Fill login form with valid credentials
    await page.fill('input[type="email"]', 'andrewjruss7@gmail.com');
    await page.fill('input[type="password"]', 'password123');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for redirect to dashboard
    await page.waitForURL('/dashboard');
    
    // Verify we're on dashboard
    await expect(page.locator('h1')).toContainText('ROGERBOX');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    // Navigate to login page
    await page.click('text=Iniciar Sesión');
    
    // Fill form with invalid credentials
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    
    await page.click('button[type="submit"]');
    
    // Check for invalid credentials error
    await expect(page.locator('text=Email o contraseña incorrectos')).toBeVisible();
  });

  test('should navigate to forgot password page', async ({ page }) => {
    // Navigate to login page
    await page.click('text=Iniciar Sesión');
    
    // Click forgot password link
    await page.click('text=¿Olvidaste tu contraseña?');
    
    // Verify we're on forgot password page
    await expect(page.locator('h1')).toContainText('RECUPERAR CONTRASEÑA');
  });

  test('should navigate back to registration from login', async ({ page }) => {
    // Navigate to login page
    await page.click('text=Iniciar Sesión');
    
    // Click back to registration
    await page.click('text=¿No tienes cuenta? Regístrate');
    
    // Verify we're back on registration page
    await expect(page.locator('h1')).toContainText('ROGERBOX');
  });

  test('should toggle password visibility', async ({ page }) => {
    // Navigate to login page
    await page.click('text=Iniciar Sesión');
    
    // Fill password field
    await page.fill('input[type="password"]', 'password123');
    
    // Check that password is hidden by default
    await expect(page.locator('input[type="password"]')).toHaveAttribute('type', 'password');
    
    // Click toggle button
    await page.click('button[type="button"]:has(svg)');
    
    // Check that password is now visible
    await expect(page.locator('input[type="text"]')).toHaveValue('password123');
  });
});
