# chrome-tab-session

Tab session management for Chrome extensions. Save, restore, export, and import tab sessions across windows. Built for Manifest V3.

Save your current tab workspace and bring it back later. Built for developers, researchers, and anyone who juggles dozens of tabs at once.


INSTALL

```bash
npm install chrome-tab-session
```


QUICK START

```typescript
import { SessionManager } from 'chrome-tab-session';

const sessions = new SessionManager();

const session = await sessions.saveCurrent('My Research');

await sessions.restore(session.id);
```


FEATURES

- Save all tabs from the current window or every open window
- Restore sessions into a new window or the current one
- Export and import sessions as JSON for backup or sharing
- Sessions persist in chrome.storage.local across browser restarts
- Pinned tab state is preserved on save and restore
- Fully compatible with Chrome Manifest V3


API

SessionManager accepts an optional storage key. Defaults to `__tab_sessions__`.

```typescript
const sessions = new SessionManager();
const sessions = new SessionManager('custom-key');
```

saveCurrent(name) returns Promise<TabSession>

Saves all tabs from the active window as a named session.

```typescript
const session = await sessions.saveCurrent('Morning Work');
console.log(session.id);
```

saveAllWindows(name) returns Promise<TabSession>

Saves tabs from every open window into one session. The returned object includes a windowCount field.

```typescript
const full = await sessions.saveAllWindows('Full Backup');
console.log(full.tabs.length, full.windowCount);
```

restore(sessionId, newWindow?) returns Promise<void>

Restores a saved session. Pass `true` (default) to open in a new window, or `false` to open tabs in the current window. Throws if the session ID is not found.

```typescript
await sessions.restore(session.id);
await sessions.restore(session.id, false);
```

getAll() returns Promise<TabSession[]>

Returns every saved session from storage.

```typescript
const all = await sessions.getAll();
for (const s of all) {
  console.log(s.name, s.tabs.length);
}
```

delete(sessionId) returns Promise<void>

Removes a session from storage by ID.

```typescript
await sessions.delete('m5kd2p');
```

export() returns Promise<string>

Serializes all sessions to a JSON string.

```typescript
const json = await sessions.export();
```

import(json) returns Promise<number>

Parses a JSON string and appends the sessions to storage. Returns the number of sessions imported.

```typescript
const count = await sessions.import(json);
console.log(count);
```


TABSESSION INTERFACE

```typescript
interface TabSession {
  id: string
  name: string
  tabs: Array<{
    url: string
    title: string
    pinned?: boolean
  }>
  createdAt: number
  windowCount?: number
}
```


PERMISSIONS

Your manifest.json needs tabs and storage.

```json
{
  "permissions": ["tabs", "storage"]
}
```


FULL EXAMPLE

```typescript
import { SessionManager } from 'chrome-tab-session';

const sessions = new SessionManager('my-workspace');

async function run() {
  const work = await sessions.saveCurrent('Work Tabs');

  const all = await sessions.getAll();
  console.log('Saved sessions', all.length);

  await sessions.restore(work.id);

  const backup = await sessions.export();

  await sessions.delete(work.id);
}

run();
```


LICENSE

MIT. See LICENSE for the full text.


ABOUT

chrome-tab-session is maintained by theluckystrike and published through zovo.one, a small studio focused on Chrome extensions and browser tooling.

https://github.com/theluckystrike/chrome-tab-session
