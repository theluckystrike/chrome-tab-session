/**
 * Session Manager — Save and restore tab sessions
 */
export interface TabSession { id: string; name: string; tabs: Array<{ url: string; title: string; pinned?: boolean }>; createdAt: number; windowCount?: number; }

export class SessionManager {
    private storageKey: string;
    constructor(storageKey: string = '__tab_sessions__') { this.storageKey = storageKey; }

    /** Save current window as session */
    async saveCurrent(name: string): Promise<TabSession> {
        const tabs = await chrome.tabs.query({ currentWindow: true });
        const session: TabSession = {
            id: Date.now().toString(36), name, createdAt: Date.now(),
            tabs: tabs.filter((t) => t.url).map((t) => ({ url: t.url!, title: t.title || '', pinned: t.pinned })),
        };
        const sessions = await this.getAll();
        sessions.push(session);
        await chrome.storage.local.set({ [this.storageKey]: sessions });
        return session;
    }

    /** Save all windows as session */
    async saveAllWindows(name: string): Promise<TabSession> {
        const windows = await chrome.windows.getAll({ populate: true });
        const allTabs = windows.flatMap((w) => (w.tabs || []).filter((t) => t.url).map((t) => ({ url: t.url!, title: t.title || '', pinned: t.pinned })));
        const session: TabSession = { id: Date.now().toString(36), name, createdAt: Date.now(), tabs: allTabs, windowCount: windows.length };
        const sessions = await this.getAll();
        sessions.push(session);
        await chrome.storage.local.set({ [this.storageKey]: sessions });
        return session;
    }

    /** Restore a session */
    async restore(sessionId: string, newWindow: boolean = true): Promise<void> {
        const sessions = await this.getAll();
        const session = sessions.find((s) => s.id === sessionId);
        if (!session) throw new Error('Session not found');
        if (newWindow) {
            const win = await chrome.windows.create({ url: session.tabs[0]?.url });
            for (let i = 1; i < session.tabs.length; i++) {
                await chrome.tabs.create({ windowId: win.id, url: session.tabs[i].url, pinned: session.tabs[i].pinned });
            }
        } else {
            for (const tab of session.tabs) await chrome.tabs.create({ url: tab.url, pinned: tab.pinned });
        }
    }

    /** Get all saved sessions */
    async getAll(): Promise<TabSession[]> {
        const result = await chrome.storage.local.get(this.storageKey);
        return (result[this.storageKey] as TabSession[]) || [];
    }

    /** Delete a session */
    async delete(sessionId: string): Promise<void> {
        const sessions = await this.getAll();
        await chrome.storage.local.set({ [this.storageKey]: sessions.filter((s) => s.id !== sessionId) });
    }

    /** Export sessions as JSON */
    async export(): Promise<string> { return JSON.stringify(await this.getAll(), null, 2); }

    /** Import sessions */
    async import(json: string): Promise<number> {
        const imported = JSON.parse(json) as TabSession[];
        const sessions = await this.getAll();
        sessions.push(...imported);
        await chrome.storage.local.set({ [this.storageKey]: sessions });
        return imported.length;
    }
}
