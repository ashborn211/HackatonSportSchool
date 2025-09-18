import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('should render login form', async ({ page }) => {
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Inloggen' })).toBeVisible();
  });

  test('shows error on invalid credentials', async ({ page }) => {
    await page.getByLabel('Email:').fill('wrong@example.com');
    await page.getByLabel('Wachtwoord:').fill('wrongpassword');
    await page.getByRole('button', { name: 'Inloggen' }).click();
    await expect(page.getByText('Ongeldige inloggegevens')).toBeVisible();
  });
 
   test('login succesfull with correct credentials', async ({ page }) => {
    await page.getByLabel('Email:').fill('john@example.com');
    await page.getByLabel('Wachtwoord:').fill('password123');
    await page.getByRole('button', { name: 'Inloggen' }).click();
    await expect(page).toHaveURL('http://localhost:5173/home');
  }); 

});