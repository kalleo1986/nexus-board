# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: todo.spec.ts >> Kanban Tech Avançado com Drag & Drop e Métricas >> Deve adicionar card, validar dashboard de telemetria e mover via Drag & Drop
- Location: tests\e2e\todo.spec.ts:8:3

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator:  getByTestId('pending-count')
Expected: "0"
Received: "1"
Timeout:  5000ms

Call log:
  - Expect "toHaveText" getByTestId('pending-count') with timeout 5000ms
  - waiting for getByTestId('pending-count')
    14 × locator resolved to <span data-testid="pending-count" class="px-2.5 py-1 rounded text-xs font-bold bg-slate-900/50 text-slate-300">1</span>
       - unexpected value "1"

```

```yaml
- text: "1"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Kanban Tech Avançado com Drag & Drop e Métricas', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/');
  6  |   });
  7  | 
  8  |   test('Deve adicionar card, validar dashboard de telemetria e mover via Drag & Drop', async ({ page }) => {
  9  |     // 1. Criar tarefa com prioridade alta via modal
  10 |     await page.getByTestId('todo-input').fill('Deploy no Cluster Kubernetes');
  11 |     await page.getByTestId('add-button').click();
  12 | 
  13 |     // 2. Verificar se o card apareceu em Pendentes e atualizou as métricas
  14 |     const card = page.getByTestId('todo-item').first();
  15 |     await expect(card).toBeVisible();
  16 |     await expect(page.getByTestId('pending-count')).toHaveText('1');
  17 | 
  18 |     // 3. Abrir modal e marcar como prioridade alta
  19 |     await card.click();
  20 |     await page.getByTestId('modal-priority').selectOption('high');
  21 |     await page.getByTestId('close-modal').click();
  22 | 
  23 |     // 4. Testar Arrastar e Soltar (Drag and Drop) de 'pending' para 'column-in-progress'
  24 |     const targetColumn = page.getByTestId('column-in-progress');
  25 |     await card.dragTo(targetColumn);
  26 | 
  27 |     // 5. Validar que o card mudou de coluna
> 28 |     await expect(page.getByTestId('pending-count')).toHaveText('0');
     |                                                     ^ Error: expect(locator).toHaveText(expected) failed
  29 |     await expect(page.getByTestId('in-progress-count')).toHaveText('1');
  30 | 
  31 |     // 6. Arrastar de 'in-progress' para 'completed'
  32 |     const completedColumn = page.getByTestId('column-completed');
  33 |     await card.dragTo(completedColumn);
  34 | 
  35 |     // 7. Validar estado final
  36 |     await expect(page.getByTestId('in-progress-count')).toHaveText('0');
  37 |     await expect(page.getByTestId('completed-count')).toHaveText('1');
  38 |   });
  39 | });
```