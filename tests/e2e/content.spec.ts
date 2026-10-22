import { expect, test } from '@playwright/test';
import lessonData from '../../data/lessons.json' with { type: 'json' };

for (const locale of ['en'] as const) {
  test(`every complete ${locale} lesson renders its diagram and original content`, async ({
    page,
  }) => {
    test.setTimeout(180_000);
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const published = lessonData.filter((lesson) => lesson.status === 'published');
    expect(published.length).toBeGreaterThanOrEqual(3);
    for (const lesson of published) {
      await page.goto(`/${locale}/lessons/${lesson.id}`);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(lesson.title[locale]);
      await expect(page.locator('.diagram-canvas svg')).toBeVisible();
      await expect(page.locator('.prose h2')).toHaveCount(11);
      await expect(
        page.getByRole('button', {
          name: 'Mark as completed',
        }),
      ).toBeEnabled();
    }
    expect(errors).toEqual([]);
  });
}
