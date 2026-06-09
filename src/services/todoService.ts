// /src/services/todoService.ts

import { Locator, Page } from "@playwright/test";
import { WebService } from "./webService";
import { TestRecord } from "../records/testRecord";

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
     *
     * ページ遷移、クリック、テキスト入力、テキスト取得などの
     * 共通操作は WebService に委譲する。
     */
    private readonly webService: WebService;

    /**
     * TodoService のインスタンスを生成する。
     *
     * @param page Playwright の Page インスタンス
     */
    constructor(page: Page) {
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
     * TODOを追加する。
     *
     * @param todo 追加するTODOの内容
     */
    async addTodo(todo: string): Promise<void> {
        await this.webService.waitForVisible(".new-todo", TestRecord.timeout.short);
        await this.webService.inputText(".new-todo", todo);
        await this.webService.press("Enter");
    }

    /**
     * 指定したTODO項目を取得する。
     *
     * @param todoText TODOの内容
     * @returns 指定したTODO項目の Locator
     */
    getTodoItem(todoText: string): Locator {
        return this.webService.getNode(".todo-list li").filter({
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
        return this.getTodoItem(todoText).locator("label");
    }

    /**
     * TODO件数表示を取得する。
     *
     * @returns TODO件数表示の Locator
     */
    getTodoCount(): Locator {
        return this.webService.getNode(".todo-count");
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
        return this.getTodoItem(todoText).locator("input[type='checkbox']");
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
     * TODOをすべて絞り込む。
     *
     * @param filter 絞り込み条件
     */
    async filterTodos(filter: Filter): Promise<void> {
        await this.webService.getNode(".filters li").filter({
            hasText: filter,
        }).click();
    }
}