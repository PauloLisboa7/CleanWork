import { test, expect } from '@playwright/test';

test('obras flow', async ({ page }) => {
  // Login primeiro
  await page.goto('/');
  await page.getByLabel('Email').fill('admin@cleanwork.local');
  await page.getByLabel('Senha').fill('admin123');
  await page.getByRole('button', { name: 'Entrar' }).click();
  
  // Ir para página de obras
  await page.getByRole('link', { name: 'Obras' }).click();
  await expect(page).toHaveURL('/obras');
  
  // Verificar se a lista está visível
  await expect(page.getByRole('heading', { name: 'Obras' })).toBeVisible();
  
  // Testar paginação
  await expect(page.getByRole('button', { name: 'Próxima página' })).toBeVisible();
  
  // Testar criação de obra
  await page.getByRole('button', { name: 'Nova Obra' }).click();
  await page.getByLabel('Título').fill('Obra de Teste E2E');
  await page.getByLabel('Descrição').fill('Descrição da obra de teste');
  await page.getByLabel('Bairro').fill('Centro');
  await page.getByRole('button', { name: 'Salvar' }).click();
  
  // Verificar se obra foi criada
  await expect(page.getByText('Obra de Teste E2E')).toBeVisible();
});