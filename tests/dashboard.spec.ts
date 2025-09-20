import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/');
    await page.click('text=Iniciar Sesión');
    await page.fill('input[type="email"]', 'andrewjruss7@gmail.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('should display dashboard with user profile', async ({ page }) => {
    // Check if dashboard loads correctly
    await expect(page.locator('h1')).toContainText('ROGERBOX');
    
    // Check if user menu is visible
    await expect(page.locator('text=Mi Perfil')).toBeVisible();
    await expect(page.locator('text=Cerrar sesión')).toBeVisible();
  });

  test('should display user information in dashboard', async ({ page }) => {
    // Check if user name is displayed
    await expect(page.locator('text=Andrew')).toBeVisible();
    
    // Check if user email is displayed
    await expect(page.locator('text=andrewjruss7@gmail.com')).toBeVisible();
  });

  test('should display My Courses section', async ({ page }) => {
    // Check if My Courses section is visible
    await expect(page.locator('text=Mis Cursos')).toBeVisible();
    
    // Check if course cards are displayed
    await expect(page.locator('[data-testid="course-card"]').first()).toBeVisible();
  });

  test('should display Complementos section', async ({ page }) => {
    // Check if Complementos section is visible
    await expect(page.locator('text=Complementos')).toBeVisible();
    await expect(page.locator('text=Nuevo contenido diario')).toBeVisible();
    
    // Check if complement cards are displayed
    await expect(page.locator('[data-testid="complement-card"]').first()).toBeVisible();
  });

  test('should navigate to profile page', async ({ page }) => {
    // Click on user menu
    await page.click('[data-testid="user-menu-button"]');
    
    // Click on "Mi Perfil"
    await page.click('text=Mi Perfil');
    
    // Verify we're on profile page
    await page.waitForURL('/profile');
    await expect(page.locator('h1')).toContainText('MI PERFIL');
  });

  test('should logout successfully', async ({ page }) => {
    // Click on user menu
    await page.click('[data-testid="user-menu-button"]');
    
    // Click on "Cerrar sesión"
    await page.click('text=Cerrar sesión');
    
    // Verify we're redirected to home page
    await page.waitForURL('/');
    await expect(page.locator('h1')).toContainText('ROGERBOX');
  });

  test('should display loading screen initially', async ({ page }) => {
    // This test should run before login
    await page.goto('/dashboard');
    
    // Check if loading screen is displayed
    await expect(page.locator('text=Cargando dashboard...')).toBeVisible();
  });

  test('should handle complement carousel navigation', async ({ page }) => {
    // Check if navigation arrows are visible
    await expect(page.locator('[data-testid="prev-complement"]')).toBeVisible();
    await expect(page.locator('[data-testid="next-complement"]')).toBeVisible();
    
    // Click next button
    await page.click('[data-testid="next-complement"]');
    
    // Click previous button
    await page.click('[data-testid="prev-complement"]');
  });

  test('should display NEW badge on recent complements', async ({ page }) => {
    // Check if NEW badge is visible on recent complements
    await expect(page.locator('text=NUEVO').first()).toBeVisible();
  });
});
