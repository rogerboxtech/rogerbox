import { test, expect } from '@playwright/test';

test.describe('User Onboarding', () => {
  test.beforeEach(async ({ page }) => {
    // Register a new user and go to onboarding
    await page.goto('/');
    
    const timestamp = Date.now();
    const testEmail = `onboarding${timestamp}@example.com`;
    
    // Fill registration form
    await page.fill('input[placeholder*="nombre"]', 'Onboarding Test User');
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', 'password123');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for redirect to onboarding
    await page.waitForURL('/onboarding');
  });

  test('should display onboarding form', async ({ page }) => {
    // Check if onboarding page loads correctly
    await expect(page.locator('h1')).toContainText('ONBOARDING');
    
    // Check if form fields are visible
    await expect(page.locator('input[placeholder*="peso"]')).toBeVisible();
    await expect(page.locator('input[placeholder*="altura"]')).toBeVisible();
    await expect(page.locator('select')).toBeVisible();
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Check for validation errors
    await expect(page.locator('text=El peso es requerido')).toBeVisible();
    await expect(page.locator('text=La altura es requerida')).toBeVisible();
    await expect(page.locator('text=El género es requerido')).toBeVisible();
  });

  test('should validate weight input', async ({ page }) => {
    // Fill invalid weight
    await page.fill('input[placeholder*="peso"]', '0');
    await page.fill('input[placeholder*="altura"]', '170');
    await page.selectOption('select', 'male');
    
    await page.click('button[type="submit"]');
    
    // Check for weight validation error
    await expect(page.locator('text=El peso debe ser mayor a 0')).toBeVisible();
  });

  test('should validate height input', async ({ page }) => {
    // Fill invalid height
    await page.fill('input[placeholder*="peso"]', '70');
    await page.fill('input[placeholder*="altura"]', '50');
    await page.selectOption('select', 'male');
    
    await page.click('button[type="submit"]');
    
    // Check for height validation error
    await expect(page.locator('text=La altura debe ser mayor a 50 cm')).toBeVisible();
  });

  test('should successfully complete onboarding', async ({ page }) => {
    // Fill valid form data
    await page.fill('input[placeholder*="peso"]', '70');
    await page.fill('input[placeholder*="altura"]', '175');
    await page.selectOption('select', 'male');
    
    // Select goals (assuming there are checkboxes or similar)
    await page.check('input[value="lose_weight"]');
    await page.check('input[value="build_muscle"]');
    
    // Set target weight
    await page.fill('input[placeholder*="peso objetivo"]', '65');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for redirect to dashboard
    await page.waitForURL('/dashboard');
    
    // Verify we're on dashboard
    await expect(page.locator('h1')).toContainText('ROGERBOX');
  });

  test('should display loading state during onboarding', async ({ page }) => {
    // Fill form data
    await page.fill('input[placeholder*="peso"]', '70');
    await page.fill('input[placeholder*="altura"]', '175');
    await page.selectOption('select', 'male');
    
    // Submit form and check loading state
    await page.click('button[type="submit"]');
    
    // Check if loading state is shown
    await expect(page.locator('text=Actualizando perfil...')).toBeVisible();
  });

  test('should handle gender selection', async ({ page }) => {
    // Test male selection
    await page.selectOption('select', 'male');
    await expect(page.locator('select')).toHaveValue('male');
    
    // Test female selection
    await page.selectOption('select', 'female');
    await expect(page.locator('select')).toHaveValue('female');
    
    // Test other selection
    await page.selectOption('select', 'other');
    await expect(page.locator('select')).toHaveValue('other');
  });

  test('should handle multiple goal selection', async ({ page }) => {
    // Select multiple goals
    await page.check('input[value="lose_weight"]');
    await page.check('input[value="build_muscle"]');
    await page.check('input[value="improve_endurance"]');
    
    // Verify goals are selected
    await expect(page.locator('input[value="lose_weight"]')).toBeChecked();
    await expect(page.locator('input[value="build_muscle"]')).toBeChecked();
    await expect(page.locator('input[value="improve_endurance"]')).toBeChecked();
  });

  test('should calculate and display target weight', async ({ page }) => {
    // Fill form data
    await page.fill('input[placeholder*="peso"]', '80');
    await page.fill('input[placeholder*="altura"]', '180');
    await page.selectOption('select', 'male');
    await page.check('input[value="lose_weight"]');
    
    // Check if target weight is calculated and displayed
    await expect(page.locator('text=Peso objetivo recomendado:')).toBeVisible();
  });

  test('should show error for invalid target weight', async ({ page }) => {
    // Fill form data
    await page.fill('input[placeholder*="peso"]', '70');
    await page.fill('input[placeholder*="altura"]', '175');
    await page.selectOption('select', 'male');
    await page.check('input[value="lose_weight"]');
    
    // Set invalid target weight (higher than current weight for weight loss)
    await page.fill('input[placeholder*="peso objetivo"]', '80');
    
    await page.click('button[type="submit"]');
    
    // Check for target weight validation error
    await expect(page.locator('text=El peso objetivo debe ser menor al peso actual para perder peso')).toBeVisible();
  });
});
