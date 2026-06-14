import { test, expect } from "@playwright/test";
import { fillBasicData, fillFinancialData } from "./helpers";

test.describe("Simulation error — high amount", () => {
  test("shows TECHNICAL_ERROR UI when requested amount exceeds 20M", async ({
    page,
  }) => {
    await page.goto("/applications/new");

    // Step 1 — channel
    await page.getByRole("radio", { name: /autogestión/i }).click();
    await page.getByRole("button", { name: /continuar/i }).click();

    // Step 2 — basic data
    await fillBasicData(page);
    await page.getByRole("button", { name: /continuar/i }).click();

    // Step 3 — financial data with amount > 20M to trigger TECHNICAL_ERROR
    await fillFinancialData(page, "25000000");
    await page.getByRole("button", { name: /simular oferta/i }).click();

    // Step 4 — simulation should show TECHNICAL_ERROR
    await expect(page.getByText(/oferta preliminar/i)).toBeVisible();

    const errorRegion = page.getByRole("alert", { name: /error técnico/i });
    await expect(errorRegion).toBeVisible({ timeout: 15_000 });
    await expect(errorRegion.getByText("Error técnico temporal", { exact: true })).toBeVisible();

    // Retry button should be present
    await expect(page.getByRole("button", { name: /intentar de nuevo/i })).toBeVisible();
  });

  test("shows NOT_VIABLE message for medium amounts (5M to 20M)", async ({
    page,
  }) => {
    await page.goto("/applications/new");

    await page.getByRole("radio", { name: /autogestión/i }).click();
    await page.getByRole("button", { name: /continuar/i }).click();

    await fillBasicData(page);
    await page.getByRole("button", { name: /continuar/i }).click();

    await fillFinancialData(page, "10000000"); // 10M → NOT_VIABLE
    await page.getByRole("button", { name: /simular oferta/i }).click();

    await expect(page.getByText(/oferta preliminar/i)).toBeVisible();
    const notViableRegion = page.getByRole("region", { name: /solicitud no viable/i });
    await expect(notViableRegion).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/no fue posible generar una oferta/i)).toBeVisible();
  });
});
