import { test, expect } from '@playwright/test';

test.describe('User Profile', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/');
    await page.click('text=Iniciar Sesión');
    await page.fill('input[type="email"]', 'andrewjruss7@gmail.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
    
    // Navigate to profile
    await page.click('[data-testid="user-menu-button"]');
    await page.click('text=Mi Perfil');
    await page.waitForURL('/profile');
  });

  test('should display profile page with user information', async ({ page }) => {
    // Check if profile page loads correctly
    await expect(page.locator('h1')).toContainText('MI PERFIL');
    
    // Check if user information is displayed
    await expect(page.locator('text=Andrew')).toBeVisible();
    await expect(page.locator('text=andrewjruss7@gmail.com')).toBeVisible();
  });

  test('should display personal information section', async ({ page }) => {
    // Check if personal information section is visible
    await expect(page.locator('text=Información Personal')).toBeVisible();
    
    // Check if basic info is displayed
    await expect(page.locator('text=Nombre:')).toBeVisible();
    await expect(page.locator('text=Email:')).toBeVisible();
    await expect(page.locator('text=Altura:')).toBeVisible();
    await expect(page.locator('text=Peso:')).toBeVisible();
    await expect(page.locator('text=Género:')).toBeVisible();
  });

  test('should display goals section', async ({ page }) => {
    // Check if goals section is visible
    await expect(page.locator('text=Objetivos')).toBeVisible();
  });

  test('should open edit profile modal', async ({ page }) => {
    // Click edit profile button
    await page.click('text=Editar Perfil');
    
    // Check if modal is opened
    await expect(page.locator('text=Editar Perfil')).toBeVisible();
    
    // Check if form fields are visible
    await expect(page.locator('input[placeholder*="nombre"]')).toBeVisible();
    await expect(page.locator('input[placeholder*="email"]')).toBeVisible();
    await expect(page.locator('input[placeholder*="contraseña"]')).toBeVisible();
  });

  test('should close edit profile modal', async ({ page }) => {
    // Open edit modal
    await page.click('text=Editar Perfil');
    
    // Close modal
    await page.click('[data-testid="close-modal"]');
    
    // Check if modal is closed
    await expect(page.locator('text=Editar Perfil')).not.toBeVisible();
  });

  test('should validate edit form fields', async ({ page }) => {
    // Open edit modal
    await page.click('text=Editar Perfil');
    
    // Clear name field and try to submit
    await page.fill('input[placeholder*="nombre"]', '');
    await page.click('button[type="submit"]');
    
    // Check for validation error
    await expect(page.locator('text=El nombre es requerido')).toBeVisible();
  });

  test('should successfully update profile', async ({ page }) => {
    // Open edit modal
    await page.click('text=Editar Perfil');
    
    // Update name
    await page.fill('input[placeholder*="nombre"]', 'Andrew Updated');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for success and redirect
    await page.waitForURL('/dashboard');
    
    // Verify we're back on dashboard
    await expect(page.locator('h1')).toContainText('ROGERBOX');
  });

  test('should validate password confirmation', async ({ page }) => {
    // Open edit modal
    await page.click('text=Editar Perfil');
    
    // Fill password fields with different values
    await page.fill('input[placeholder*="nueva contraseña"]', 'newpassword123');
    await page.fill('input[placeholder*="confirmar contraseña"]', 'differentpassword');
    
    await page.click('button[type="submit"]');
    
    // Check for password mismatch error
    await expect(page.locator('text=Las contraseñas no coinciden')).toBeVisible();
  });

  test('should validate password length', async ({ page }) => {
    // Open edit modal
    await page.click('text=Editar Perfil');
    
    // Fill password with short value
    await page.fill('input[placeholder*="nueva contraseña"]', '123');
    await page.fill('input[placeholder*="confirmar contraseña"]', '123');
    
    await page.click('button[type="submit"]');
    
    // Check for password length error
    await expect(page.locator('text=La nueva contraseña debe tener al menos 6 caracteres')).toBeVisible();
  });

  test('should navigate back to dashboard', async ({ page }) => {
    // Click back button
    await page.click('text=Volver al Dashboard');
    
    // Verify we're on dashboard
    await page.waitForURL('/dashboard');
    await expect(page.locator('h1')).toContainText('ROGERBOX');
  });

  test('should display loading state during profile update', async ({ page }) => {
    // Open edit modal
    await page.click('text=Editar Perfil');
    
    // Update name
    await page.fill('input[placeholder*="nombre"]', 'Andrew Updated');
    
    // Submit form and check loading state
    await page.click('button[type="submit"]');
    
    // Check if loading state is shown
    await expect(page.locator('text=Actualizando...')).toBeVisible();
  });
});
