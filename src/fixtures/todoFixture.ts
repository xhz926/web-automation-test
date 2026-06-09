// /src/fixtures/todoFixture.ts

import { test as base, expect } from "@playwright/test";
import { TodoService } from "../services/todoService";

type TodoFixtures = {
    todoService: TodoService;
};

/**
 * TODO画面用のカスタム fixture。
 *
 * 各テストで TodoService を直接生成せず、
 * fixture 経由で受け取れるようにする。
 *
 * これにより、テストコード側では Service の初期化処理を意識せず、
 * テスト手順と期待結果に集中できる。
 */
const test = base.extend<TodoFixtures>({
    todoService: async ({ page }, use) => {
        const todoService = new TodoService(page);

        await use(todoService);
    },
});

export { test, expect };