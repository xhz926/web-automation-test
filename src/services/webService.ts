// /src/services/webService.ts

import { Locator, Page } from "@playwright/test";
import { TestRecord } from "../records/testRecord";

/**
 * Webページに対する基本操作をまとめたサービスクラス。
 *
 * Playwright の Page オブジェクトを直接テストコードから操作するのではなく、
 * よく使う操作をこのクラスにまとめることで、テストコード側の可読性を高める。
 *
 * 注意：
 * このクラスはあくまで「汎用的なWeb操作」を担当する。
 * Todo追加・Todo削除など、画面固有の業務操作は TodoService など別クラスに分ける。
 */
export class WebService {
    /**
     * Playwright の Page インスタンス。
     */
    private readonly page: Page;

    /**
     * WebService のインスタンスを生成する。
     *
     * @param page Playwright の Page インスタンス
     */
    constructor(page: Page) {
        this.page = page;
    }

    /**
     * 指定したURLのページを開く。
     *
     * @param url 遷移先のURL
     */
    async goto(url: string): Promise<void> {
        await this.page.goto(url);
    }

    /**
     * 現在表示しているページのタイトルを取得する。
     *
     * @returns ページタイトル
     */
    async getTitle(): Promise<string> {
        return await this.page.title();
    }

    /**
     * 現在のページを閉じる。
     */
    async close(): Promise<void> {
        await this.page.close();
    }

    /**
     * 現在表示しているページのスクリーンショットを撮影する。
     *
     * @param path スクリーンショットの保存先パス
     */
    async screenshot(path: string): Promise<void> {
        await this.page.screenshot({ path });
    }

    /**
     * 指定したセレクターに一致する Locator を取得する。
     *
     * @param selector CSSセレクター、または Playwright が対応するセレクター
     * @returns 指定した要素を表す Locator
     */
    getNode(selector: string): Locator {
        return this.page.locator(selector);
    }

    /**
     * 指定したセレクターに一致する要素のテキストを取得する。
     *
     * @param selector テキストを取得したい要素のセレクター
     * @returns 要素のテキスト。存在しない場合や空の場合は null
     */
    async getText(selector: string): Promise<string | null> {
        return await this.page.locator(selector).textContent();
    }

    /**
     * 指定したセレクターに一致する入力要素へテキストを入力する。
     *
     * @param selector 入力対象の要素セレクター
     * @param text 入力する文字列
     */
    async inputText(selector: string, text: string): Promise<void> {
        await this.page.locator(selector).fill(text);
    }

    /**
     * 指定したセレクターに一致する要素をクリックする。
     *
     * @param selector クリック対象の要素セレクター
     */
    async click(selector: string): Promise<void> {
        await this.page.locator(selector).click();
    }

    /**
     * 指定したセレクターに一致する要素が表示されているかどうかを確認する。
     *
     * @param selector 確認対象の要素セレクター
     * @returns 要素が表示されている場合は true、表示されていない場合は false
     */
    async isVisible(selector: string): Promise<boolean> {
        return await this.page.locator(selector).isVisible();
    }

    /**
     * 指定したセレクターに一致する要素が有効かどうかを確認する。
     *
     * @param selector 確認対象の要素セレクター
     * @returns 要素が有効な場合は true、有効でない場合は false
     */
    async isEnabled(selector: string): Promise<boolean> {
        return await this.page.locator(selector).isEnabled();
    }

    /**
     * 指定したセレクターに一致する要素が表示されるまで待機する。
     *
     * @param selector 待機対象の要素セレクター
     * @param timeout 最大待機時間。単位はミリ秒。
     */
    async waitForVisible(
        selector: string,
        timeout: number = TestRecord.timeout.medium
    ): Promise<void> {
        await this.page.locator(selector).waitFor({
            state: "visible",
            timeout,
        });
    }

    /**
     * 指定した要素に対してキー入力を行う。
     *
     * page.keyboard.press() ではなく Locator.press() を使用することで、
     * どの要素に対するキー操作なのかを明確にする。
     *
     * @param selector キー入力対象の要素セレクター
     * @param key 入力するキー
     */
    async press(selector: string, key: string): Promise<void> {
        await this.page.locator(selector).press(key);
    }
}