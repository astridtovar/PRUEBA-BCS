import { test, expect } from "@playwright/test";
import { fillBasicData, fillFinancialData } from "./helpers";

test.describe("Happy path — complete credit application", () => {
  test("user can complete the full wizard and submit the application", async ({
    page,
  }) => {
    // 1. Landing page
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    const ctaLink = page.getByRole("link", { name: /solicitar ahora/i }).first();
    await ctaLink.click();
    await page.waitForURL("**/applications/new");

    // 2. Step 1 — Channel selection
    await expect(page.getByText(/¿cómo deseas continuar/i)).toBeVisible();
    await page.getByRole("radio", { name: /autogestión/i }).click();
    await page.getByRole("button", { name: /continuar/i }).click();

    // 3. Step 2 — Basic data
    await expect(page.getByText(/información personal/i)).toBeVisible();
    await fillBasicData(page);
    await page.getByRole("button", { name: /continuar/i }).click();

    // 4. Step 3 — Financial data
    await expect(page.getByText(/información financiera/i)).toBeVisible();
    await fillFinancialData(page, "2000000"); // < 5M → VIABLE
    await page.getByRole("button", { name: /simular oferta/i }).click();

    // 5. Step 4 — Simulation (VIABLE)
    await expect(page.getByText(/oferta preliminar/i)).toBeVisible();
    await expect(
      page.getByRole("region", { name: /oferta aprobada/i })
    ).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/felicitaciones/i)).toBeVisible();
    await page.getByRole("button", { name: /ver resumen/i }).click();

    // 6. Step 5 — Summary + confirm
    await expect(page.getByText(/resumen de la solicitud/i)).toBeVisible();
    await page.getByRole("button", { name: /enviar solicitud/i }).click();

    // 7. Post-submit — redirected to list or detail with success status
    await page.waitForURL(/\/applications(\/[^/]+)?$/, { timeout: 15_000 });
  });
});
