import { test, expect } from '@playwright/test';

test('login flow', async ({ page }) => {
  await page.goto('/');
  
  // Verifica se está na página de login
  await expect(page.getByText('Login')).toBeVisible();
  
  // Tenta login com credenciais inválidas
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Senha').fill('wrong');
  await page.getByRole('button', { name: 'Entrar' }).click();
  
  // Deve mostrar erro
  await expect(page.getByText('Credenciais inválidas')).toBeVisible();
  
  // Login com credenciais corretas
  await page.getByLabel('Email').fill('admin@cleanwork.local');
  await page.getByLabel('Senha').fill('admin123');
  await page.getByRole('button', { name: 'Entrar' }).click();
  
  // Deve redirecionar para dashboard
  await expect(page).toHaveURL('/dashboard');
});