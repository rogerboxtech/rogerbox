import { test, expect } from '@playwright/test';

test.describe('Complete User Flow', () => {
  test('should complete full user journey from registration to profile update', async ({ page }) => {
    const timestamp = Date.now();
    const testEmail = `completeflow${timestamp}@example.com`;
    
    // 1. Registration
    await page.goto('/');
    await page.fill('input[placeholder*="nombre"]', 'Complete Flow User');
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to onboarding
    await page.waitForURL('/onboarding');
    
    // 2. Onboarding
    await page.fill('input[placeholder*="peso"]', '75');
    await page.fill('input[placeholder*="altura"]', '180');
    await page.selectOption('select', 'male');
    await page.check('input[value="lose_weight"]');
    await page.fill('input[placeholder*="peso objetivo"]', '70');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to dashboard
    await page.waitForURL('/dashboard');
    
    // 3. Verify dashboard
    await expect(page.locator('h1')).toContainText('ROGERBOX');
    await expect(page.locator('text=Complete Flow User')).toBeVisible();
    await expect(page.locator('text=Mis Cursos')).toBeVisible();
    await expect(page.locator('text=Complementos')).toBeVisible();
    
    // 4. Navigate to profile
    await page.click('[data-testid="user-menu-button"]');
    await page.click('text=Mi Perfil');
    await page.waitForURL('/profile');
    
    // 5. Verify profile page
    await expect(page.locator('h1')).toContainText('MI PERFIL');
    await expect(page.locator('text=Complete Flow User')).toBeVisible();
    await expect(page.locator('text=75 kg')).toBeVisible();
    await expect(page.locator('text=180 cm')).toBeVisible();
    
    // 6. Edit profile
    await page.click('text=Editar Perfil');
    await page.fill('input[placeholder*="nombre"]', 'Complete Flow User Updated');
    await page.click('button[type="submit"]');
    
    // Wait for redirect back to dashboard
    await page.waitForURL('/dashboard');
    
    // 7. Verify updated name on dashboard
    await expect(page.locator('text=Complete Flow User Updated')).toBeVisible();
    
    // 8. Logout
    await page.click('[data-testid="user-menu-button"]');
    await page.click('text=Cerrar sesión');
    await page.waitForURL('/');
    
    // 9. Login with updated credentials
    await page.click('text=Iniciar Sesión');
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
    
    // 10. Verify login successful
    await expect(page.locator('text=Complete Flow User Updated')).toBeVisible();
  });

  test('should handle error scenarios gracefully', async ({ page }) => {
    // 1. Try to register with existing email
    await page.goto('/');
    await page.fill('input[placeholder*="nombre"]', 'Test User');
    await page.fill('input[type="email"]', 'andrewjruss7@gmail.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit']');
    
    // Should show error for existing email
    await expect(page.locator('text=Ya tienes una cuenta registrada')).toBeVisible();
    
    // 2. Navigate to login from error
    await page.click('text=Ir a Iniciar Sesión');
    await expect(page.locator('h1')).toContainText('INICIAR SESIÓN');
    
    // 3. Try login with wrong password
    await page.fill('input[type="email"]', 'andrewjruss7@gmail.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Should show error for wrong credentials
    await expect(page.locator('text=Email o contraseña incorrectos')).toBeVisible();
  });

  test('should maintain session across page refreshes', async ({ page }) => {
    // 1. Login
    await page.goto('/');
    await page.click('text=Iniciar Sesión');
    await page.fill('input[type="email"]', 'andrewjruss7@gmail.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
    
    // 2. Refresh page
    await page.reload();
    
    // 3. Verify still logged in
    await expect(page.locator('h1')).toContainText('ROGERBOX');
    await expect(page.locator('text=Andrew')).toBeVisible();
  });

  test('should handle navigation between all pages', async ({ page }) => {
    // 1. Login
    await page.goto('/');
    await page.click('text=Iniciar Sesión');
    await page.fill('input[type="email"]', 'andrewjruss7@gmail.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
    
    // 2. Navigate to profile
    await page.click('[data-testid="user-menu-button"]');
    await page.click('text=Mi Perfil');
    await page.waitForURL('/profile');
    
    // 3. Navigate back to dashboard
    await page.click('text=Volver al Dashboard');
    await page.waitForURL('/dashboard');
    
    // 4. Logout
    await page.click('[data-testid="user-menu-button"]');
    await page.click('text=Cerrar sesión');
    await page.waitForURL('/');
    
    // 5. Navigate to forgot password
    await page.click('text=Iniciar Sesión');
    await page.click('text=¿Olvidaste tu contraseña?');
    await expect(page.locator('h1')).toContainText('RECUPERAR CONTRASEÑA');
    
    // 6. Navigate back to login
    await page.click('text=Volver al Login');
    await expect(page.locator('h1')).toContainText('INICIAR SESIÓN');
    
    // 7. Navigate back to registration
    await page.click('text=¿No tienes cuenta? Regístrate');
    await expect(page.locator('h1')).toContainText('ROGERBOX');
  });
});
