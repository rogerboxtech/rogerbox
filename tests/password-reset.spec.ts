import { test, expect } from '@playwright/test';

test.describe('Password Reset', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate to forgot password page', async ({ page }) => {
    // Navigate to login page
    await page.click('text=Iniciar Sesión');
    
    // Click forgot password link
    await page.click('text=¿Olvidaste tu contraseña?');
    
    // Verify we're on forgot password page
    await expect(page.locator('h1')).toContainText('RECUPERAR CONTRASEÑA');
  });

  test('should show validation error for empty email', async ({ page }) => {
    // Navigate to forgot password page
    await page.click('text=Iniciar Sesión');
    await page.click('text=¿Olvidaste tu contraseña?');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Check for validation error
    await expect(page.locator('text=Por favor, ingresa tu email')).toBeVisible();
  });

  test('should show validation error for invalid email', async ({ page }) => {
    // Navigate to forgot password page
    await page.click('text=Iniciar Sesión');
    await page.click('text=¿Olvidaste tu contraseña?');
    
    // Fill invalid email
    await page.fill('input[type="email"]', 'invalid-email');
    await page.click('button[type="submit"]');
    
    // Check for validation error
    await expect(page.locator('text=El formato del email no es válido')).toBeVisible();
  });

  test('should successfully send reset email', async ({ page }) => {
    // Navigate to forgot password page
    await page.click('text=Iniciar Sesión');
    await page.click('text=¿Olvidaste tu contraseña?');
    
    // Fill valid email
    await page.fill('input[type="email"]', 'andrewjruss7@gmail.com');
    await page.click('button[type="submit"]');
    
    // Check for success message
    await expect(page.locator('text=¡Email enviado!')).toBeVisible();
    await expect(page.locator('text=Revisa tu bandeja de entrada')).toBeVisible();
  });

  test('should navigate back to login from forgot password', async ({ page }) => {
    // Navigate to forgot password page
    await page.click('text=Iniciar Sesión');
    await page.click('text=¿Olvidaste tu contraseña?');
    
    // Click back to login
    await page.click('text=Volver al Login');
    
    // Verify we're back on login page
    await expect(page.locator('h1')).toContainText('INICIAR SESIÓN');
  });

  test('should show loading state during email send', async ({ page }) => {
    // Navigate to forgot password page
    await page.click('text=Iniciar Sesión');
    await page.click('text=¿Olvidaste tu contraseña?');
    
    // Fill email and submit
    await page.fill('input[type="email"]', 'andrewjruss7@gmail.com');
    await page.click('button[type="submit"]');
    
    // Check if loading state is shown
    await expect(page.locator('text=ENVIANDO...')).toBeVisible();
  });

  test('should handle reset password page with valid tokens', async ({ page }) => {
    // This test would require a valid reset token
    // For now, we'll test the page structure
    await page.goto('/reset-password?access_token=test&refresh_token=test');
    
    // Check if reset password page loads
    await expect(page.locator('h1')).toContainText('Establecer Nueva Contraseña');
  });

  test('should show error for invalid reset tokens', async ({ page }) => {
    // Navigate to reset password with invalid tokens
    await page.goto('/reset-password?access_token=invalid&refresh_token=invalid');
    
    // Check for error message
    await expect(page.locator('text=El enlace de recuperación no es válido')).toBeVisible();
  });

  test('should validate new password length', async ({ page }) => {
    // Navigate to reset password page (assuming valid tokens)
    await page.goto('/reset-password?access_token=test&refresh_token=test');
    
    // Fill short password
    await page.fill('input[placeholder*="nueva contraseña"]', '123');
    await page.fill('input[placeholder*="confirmar contraseña"]', '123');
    await page.click('button[type="submit"]');
    
    // Check for password length error
    await expect(page.locator('text=La nueva contraseña debe tener al menos 6 caracteres')).toBeVisible();
  });

  test('should validate password confirmation', async ({ page }) => {
    // Navigate to reset password page
    await page.goto('/reset-password?access_token=test&refresh_token=test');
    
    // Fill different passwords
    await page.fill('input[placeholder*="nueva contraseña"]', 'newpassword123');
    await page.fill('input[placeholder*="confirmar contraseña"]', 'differentpassword');
    await page.click('button[type="submit"]');
    
    // Check for password mismatch error
    await expect(page.locator('text=Las contraseñas no coinciden')).toBeVisible();
  });

  test('should toggle password visibility in reset form', async ({ page }) => {
    // Navigate to reset password page
    await page.goto('/reset-password?access_token=test&refresh_token=test');
    
    // Fill password field
    await page.fill('input[placeholder*="nueva contraseña"]', 'newpassword123');
    
    // Check that password is hidden by default
    await expect(page.locator('input[type="password"]').first()).toHaveAttribute('type', 'password');
    
    // Click toggle button
    await page.click('button[type="button"]:has(svg)').first();
    
    // Check that password is now visible
    await expect(page.locator('input[type="text"]').first()).toHaveValue('newpassword123');
  });
});
