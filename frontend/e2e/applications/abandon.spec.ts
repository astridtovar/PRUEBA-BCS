import { test, expect } from "@playwright/test";
import { fillBasicData, fillFinancialData } from "./helpers";

test.describe("Abandon with reason", () => {
  test("user can abandon an application and must provide a valid reason", async ({
    page,
  }) => {
    // 1. Reach the summary step (step 5)
    await page.goto("/applications/new");

    await page.getByRole("radio", { name: /autogestión/i }).click();
    await page.getByRole("button", { name: /continuar/i }).click();

    await fillBasicData(page);
    await page.getByRole("button", { name: /continuar/i }).click();

    await fillFinancialData(page, "2000000");
    await page.getByRole("button", { name: /simular oferta/i }).click();

    // Wait for simulation
    await expect(
      page.getByRole("region", { name: /oferta aprobada/i })
    ).toBeVisible({ timeout: 15_000 });
    await page.getByRole("button", { name: /ver resumen/i }).click();

    // 2. Click "Abandonar" on the summary step
    await page.getByRole("button", { name: /abandonar/i }).click();

    // 3. Dialog should appear
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText(/abandonar solicitud/i)).toBeVisible();

    // 4. Try to confirm without a reason → validation error
    await page.getByRole("button", { name: /confirmar abandono/i }).click();
    await expect(page.getByRole("alert")).toBeVisible();
    await expect(page.getByText(/al menos 5 caracteres/i)).toBeVisible();

    // 5. Enter a valid reason and confirm
    await page
      .getByLabel(/motivo del abandono/i)
      .fill("Cambié de opinión, solicitaré más adelante con otro monto.");
    await page.getByRole("button", { name: /confirmar abandono/i }).click();

    // 6. Redirected away after abandonment
    await page.waitForURL(/\/applications(\/[^/]+)?$/, { timeout: 15_000 });
  });
});
