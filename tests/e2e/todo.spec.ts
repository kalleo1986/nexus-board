import { test, expect } from '@playwright/test';

test.describe('Kanban Tech Avançado com Drag & Drop e Métricas', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Deve adicionar card, validar dashboard de telemetria e mover via Drag & Drop', async ({ page }) => {
    // 1. Criar tarefa com prioridade alta via modal
    await page.getByTestId('todo-input').fill('Deploy no Cluster Kubernetes');
    await page.getByTestId('add-button').click();

    // 2. Verificar se o card apareceu em Pendentes e atualizou as métricas
    const card = page.getByTestId('todo-item').first();
    await expect(card).toBeVisible();
    await expect(page.getByTestId('pending-count')).toHaveText('1');

    // 3. Abrir modal e marcar como prioridade alta
    await card.click();
    await page.getByTestId('modal-priority').selectOption('high');
    await page.getByTestId('close-modal').click();

    // 4. Testar Arrastar e Soltar (Drag and Drop) de 'pending' para 'column-in-progress'
    const targetColumn = page.getByTestId('column-in-progress');
    await card.dragTo(targetColumn);

    // 5. Validar que o card mudou de coluna
    await expect(page.getByTestId('pending-count')).toHaveText('0');
    await expect(page.getByTestId('in-progress-count')).toHaveText('1');

    // 6. Arrastar de 'in-progress' para 'completed'
    const completedColumn = page.getByTestId('column-completed');
    await card.dragTo(completedColumn);

    // 7. Validar estado final
    await expect(page.getByTestId('in-progress-count')).toHaveText('0');
    await expect(page.getByTestId('completed-count')).toHaveText('1');
  });
});