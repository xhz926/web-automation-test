// /src/services/todoService.ts

import { Locator, Page } from "@playwright/test";
import { WebService } from "./webService";

/**
 * TODO一覧の絞り込み条件。
 *
 * TODO画面固有の値であり、filterTodos() で使用する。
 */
export enum Filter {
    All = "All",
    Active = "Active",
    Completed = "Completed",
}

/**
 * TODO画面で使用するセレクター。
 *
 * ユーザー操作に近い要素は Playwright の recommended locator を使用し、
 * 画面構造に依存する一部の要素のみ CSS selector を使用する。
 */
const SELECTORS = {
    todoItem: ".todo-list li",
    todoLabel: "label",
    todoCheckbox: "input[type='checkbox']",
    todoCount: ".todo-count",
} as const;

/**
 * TODO画面に関する操作をまとめたサービスクラス。
 *
 * テストコードから直接 Playwright の Page や Locator を操作するのではなく、
 * TODO画面固有の操作をこのクラスにまとめる。
 *
 * これにより、テストケース側では「何をテストしているか」が分かりやすくなり、
 * セレクター変更時の修正範囲も小さくできる。
 */
export class TodoService {
    /**
     * Webページに対する汎用操作を提供するサービス。
     */
    private readonly webService: WebService;

    /**
     * Playwright の Page インスタンス。
     *
     * getByRole や getByPlaceholder など、
     * Playwright が推奨する locator を使用するために保持する。
     */
    private readonly page: Page;

    /**
     * TodoService のインスタンスを生成する。
     *
     * @param page Playwright の Page インスタンス
     */
    constructor(page: Page) {
        this.page = page;
        this.webService = new WebService(page);
    }

    /**
     * TODO画面を開く。
     *
     * @param url TODO画面のURL
     */
    async open(url: string): Promise<void> {
        await this.webService.goto(url);
    }

    /**
     * TODO入力欄を取得する。
     *
     * @returns TODO入力欄の Locator
     */
    private getNewTodoInput(): Locator {
        return this.page.getByPlaceholder("What needs to be done?");
    }

    /**
     * TODOを追加する。
     *
     * 入力欄にTODO名を入力し、Enterキーで追加する。
     *
     * @param todo 追加するTODOの内容
     */
    async addTodo(todo: string): Promise<void> {
        const newTodoInput = this.getNewTodoInput();

        await newTodoInput.fill(todo);
        await newTodoInput.press("Enter");
    }

    /**
     * 指定したTODO項目を取得する。
     *
     * @param todoText TODOの内容
     * @returns 指定したTODO項目の Locator
     */
    getTodoItem(todoText: string): Locator {
        return this.webService.getNode(SELECTORS.todoItem).filter({
            hasText: todoText,
        });
    }

    /**
     * 指定したTODOラベルを取得する。
     *
     * @param todoText TODOの内容
     * @returns 指定したTODOラベルの Locator
     */
    getTodoLabel(todoText: string): Locator {
        return this.getTodoItem(todoText).locator(SELECTORS.todoLabel);
    }

    /**
     * TODO件数表示を取得する。
     *
     * @returns TODO件数表示の Locator
     */
    getTodoCount(): Locator {
        return this.webService.getNode(SELECTORS.todoCount);
    }

    /**
     * TODO画面のタイトルを取得する。
     *
     * @returns ページタイトル
     */
    getTitle(): Promise<string> {
        return this.webService.getTitle();
    }

    /**
     * 指定したTODO項目のチェックボックスを取得する。
     *
     * @param todoText TODOの内容
     * @returns 指定したTODO項目のチェックボックスの Locator
     */
    getTodoCheckbox(todoText: string): Locator {
        return this.getTodoItem(todoText).locator(SELECTORS.todoCheckbox);
    }

    /**
     * 指定したTODOを完了状態に変更する。
     *
     * @param todoText TODOの内容
     */
    async completeTodo(todoText: string): Promise<void> {
        await this.getTodoCheckbox(todoText).check();
    }

    /**
     * 指定したTODOが完了状態かどうかを確認する。
     *
     * @param todoText TODOの内容
     * @returns 完了状態の場合は true、未完了の場合は false
     */
    async isCompleteTodo(todoText: string): Promise<boolean> {
        return this.getTodoCheckbox(todoText).isChecked();
    }

    /**
     * TODO一覧の表示条件を切り替える。
     *
     * All / Active / Completed は画面上のリンクであるため、
     * CSS selector ではなく role と表示名で取得する。
     *
     * @param filter 表示条件
     */
    async filterTodos(filter: Filter): Promise<void> {
        await this.page.getByRole("link", { name: filter }).click();
    }
}