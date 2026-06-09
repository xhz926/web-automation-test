// /tests/todo.spec.ts
import { test, expect } from "../src/fixtures/todoFixture";
import { TestRecord } from "../src/records/testRecord";
import { Filter } from "../src/services/todoService";

test.describe("TODO MVC の基本操作テスト", () => {
    test.beforeEach(async ({ todoService }) => {
        await test.step("TODO画面を開く", async () => {
            await todoService.open(TestRecord.testUrl);
        });

        await test.step("初期表示時にTODO画面のタイトルが正しいことを確認する", async () => {
            const title = await todoService.getTitle();

            expect(
                title,
                `初期表示時にTODO画面のタイトルが「${TestRecord.expectedTitle}」であること`
            ).toBe(TestRecord.expectedTitle);
        });

        await test.step("初期表示時にTODO件数が表示されていないことを確認する", async () => {
            const todoCount = todoService.getTodoCount();

            await expect(
                todoCount,
                "初期表示時にTODO件数が表示されていないこと"
            ).not.toBeVisible();
        });
    });

    /**
    * TODOを新規追加できることを確認する。
    *
    * 追加前に対象TODOが存在しないことを確認したうえで、
    * TODOを1件追加し、追加後に対象TODOが表示されること、
    * および未完了TODO件数が1件になることを確認する。
    */
    test(TestRecord.testCaseTitle.addTodo, async ({ todoService }) => {
        const todoText = TestRecord.todoItems.first;
        const todoLabel = todoService.getTodoLabel(todoText);

        await test.step("追加前に対象TODOが表示されていないことを確認する", async () => {
            await expect(
                todoLabel,
                `追加前に「${todoText}」が表示されていないこと`
            ).not.toBeVisible();
        });

        await test.step("TODOを新規追加する", async () => {
            await todoService.addTodo(todoText);
        });

        await test.step("追加後に対象TODOが正しく表示されることを確認する", async () => {
            await expect(
                todoLabel,
                `追加後に「${todoText}」が表示されること`
            ).toBeVisible();
        });

        await test.step("TODO件数表示が正しく表示されていることを確認する", async () => {
            const todoCount = todoService.getTodoCount();
            await expect(todoCount, "TODO件数表示が正しく表示されていない").toContainText("1 item left");
        });
    });


    /**
     * TODOを完了状態に変更できることを確認する。
     *
     * 事前条件としてTODOを1件追加し、
     * 対象TODOを完了状態に変更した後、
     * チェックボックスがチェック済みになること、
     * および未完了TODO件数が0件になることを確認する。
     */
    test(TestRecord.testCaseTitle.completeTodo, async ({ todoService }) => {
        const todoText = TestRecord.todoItems.second;
        await test.step("事前条件としてTODOを1件追加する", async () => {
            await todoService.addTodo(todoText);

            await expect(
                todoService.getTodoLabel(todoText),
                `事前条件として「${todoText}」が追加されていること`
            ).toBeVisible();
        });

        await test.step("TODOを完了状態に変更する", async () => {
            await todoService.completeTodo(todoText);
        });

        await test.step("TODOが完了状態になっていることを確認する", async () => {
            await expect(
                todoService.getTodoCheckbox(todoText),
                `「${todoText}」が完了状態になっていること`
            ).toBeChecked();
        });

        await test.step("未完了TODO件数が0件になることを確認する", async () => {
            await expect(
                todoService.getTodoCount(),
                "未完了TODO件数が正しく更新されていない"
            ).toHaveText("0 items left");
        });
    });

    /**
     * TODOを状態別に絞り込み表示できることを確認する。
     *
     * 事前条件としてTODOを2件追加し、そのうち1件を完了状態に変更する。
     * All、Active、Completed の各フィルターを切り替え、
     * 表示対象と非表示対象が正しく制御されていることを確認する。
     */
    test(TestRecord.testCaseTitle.filterTodos, async ({ todoService }) => {
        await test.step("事前条件としてTODOを2件追加する", async () => {
            await todoService.addTodo(TestRecord.todoItems.first);
            await todoService.addTodo(TestRecord.todoItems.second);
            await todoService.completeTodo(TestRecord.todoItems.second);
            await expect(
                todoService.getTodoLabel(TestRecord.todoItems.first),
                `事前条件として「${TestRecord.todoItems.first}」が追加されていること`
            ).toBeVisible();
            await expect(
                todoService.getTodoLabel(TestRecord.todoItems.second),
                `事前条件として「${TestRecord.todoItems.second}」が追加されていること`
            ).toBeVisible();

            await expect(
                todoService.getTodoCheckbox(TestRecord.todoItems.second),
                `事前条件として「${TestRecord.todoItems.second}」が完了状態になっていること`
            ).toBeChecked();
        });

        await test.step("TODOをすべて絞り込む", async () => {
            await todoService.filterTodos(Filter.All);
        })

        await test.step("TODOがすべて表示されていることを確認する", async () => {
            await expect(
                todoService.getTodoLabel(TestRecord.todoItems.first),
                TestRecord.todoItems.first + "がAllで表示されていること"
            ).toBeVisible();
            await expect(
                todoService.getTodoLabel(TestRecord.todoItems.second),
                TestRecord.todoItems.second + "がAllで表示されていること"
            ).toBeVisible();
        });

        await test.step("TODOを未完了で絞り込む", async () => {
            await todoService.filterTodos(Filter.Active);
        });

        await test.step("TODOが未完了で表示されていることを確認する", async () => {
            await expect(
                todoService.getTodoLabel(TestRecord.todoItems.first),
                TestRecord.todoItems.first + "が未完了で表示されていること"
            ).toBeVisible();

            await expect(
                todoService.getTodoLabel(TestRecord.todoItems.second),
                TestRecord.todoItems.second + "が未完了で表示されていないこと"
            ).not.toBeVisible();
        });

        await test.step("TODOを完了済みで絞り込む", async () => {
            await todoService.filterTodos(Filter.Completed);
        });

        await test.step("TODOが完了済みで表示されていることを確認する", async () => {
            await expect(
                todoService.getTodoLabel(TestRecord.todoItems.second),
                TestRecord.todoItems.second + "が完了済みで表示されていること"
            ).toBeVisible();

            await expect(
                todoService.getTodoLabel(TestRecord.todoItems.first),
                TestRecord.todoItems.first + "が完了済みで表示されていないこと"
            ).not.toBeVisible();

        });
    })
});
