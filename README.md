# chrome-tab-session

> Tab session management for Chrome extensions — save, restore, export tab sessions, window layouts, and workspace management for Manifest V3.

Save your current tab workspace and restore it later. Perfect for developers, researchers, and power users who work with many tabs.

## Features

- **Save Sessions**: Save all tabs from the current window or all windows
- **Restore Sessions**: Restore tabs to a new window or current window
- **Export/Import**: Export sessions as JSON for backup or sharing
- **Persistent Storage**: Sessions persist across browser restarts
- **Manifest V3**: Fully compatible with Chrome's Manifest V3

## Installation

```bash
npm install chrome-tab-session
```

## Quick Start

```typescript
import { SessionManager } from 'chrome-tab-session';

// Create a session manager (optional custom storage key)
const sessions = new SessionManager();

// Save current window tabs as a session
const session = await sessions.saveCurrent('My Research');

// Later, restore that session in a new window
await sessions.restore(session.id);
```

## API Reference

### Constructor

```typescript
new SessionManager(storageKey?: string)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `storageKey` | `string` | `__tab_sessions__` | Custom key for storing sessions in chrome.storage.local |

### Methods

#### `saveCurrent(name: string): Promise<TabSession>`

Saves all tabs from the current window as a named session.

```typescript
const session = await sessions.saveCurrent('Morning Work');
console.log(session.id); // e.g., "m5kd2p"
```

**Returns:** `Promise<TabSession>` — The created session object

---

#### `saveAllWindows(name: string): Promise<TabSession>`

Saves tabs from all open windows as a single session.

```typescript
const allWindows = await sessions.saveAllWindows('Full Backup');
console.log(allWindows.tabs.length); // Total tabs across all windows
console.log(allWindows.windowCount); // Number of windows saved
```

**Returns:** `Promise<TabSession>` — The created session object

---

#### `restore(sessionId: string, newWindow?: boolean): Promise<void>`

Restores a saved session. By default, opens tabs in a new window.

```typescript
// Restore in a new window (default)
await sessions.restore('session-id-123');

// Restore in current window instead
await sessions.restore('session-id-123', false);
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `sessionId` | `string` | — | The ID of the session to restore |
| `newWindow` | `boolean` | `true` | Whether to open in a new window |

**Throws:** `Error` if session not found

---

#### `getAll(): Promise<TabSession[]>`

Retrieves all saved sessions.

```typescript
const allSessions = await sessions.getAll();

for (const session of allSessions) {
  console.log(`${session.name}: ${session.tabs.length} tabs`);
}
```

**Returns:** `Promise<TabSession[]>` — Array of all saved sessions

---

#### `delete(sessionId: string): Promise<void>`

Deletes a saved session.

```typescript
await sessions.delete('session-id-to-delete');
```

---

#### `export(): Promise<string>`

Exports all sessions as a JSON string. Useful for backups.

```typescript
const json = await sessions.export();

// Save to file or send to server
console.log(json);
// {
//   "sessions": [...]
// }
```

**Returns:** `Promise<string>` — JSON string of all sessions

---

#### `import(json: string): Promise<number>`

Imports sessions from a JSON string.

```typescript
const jsonFromBackup = fs.readFileSync('sessions-backup.json', 'utf-8');
const count = await sessions.import(jsonFromBackup);
console.log(`Imported ${count} sessions`);
```

**Returns:** `Promise<number>` — Number of sessions imported

---

### TypeScript Interfaces

```typescript
interface TabSession {
  id: string;           // Unique session identifier
  name: string;         // User-defined session name
  tabs: Array<{
    url: string;        // Tab URL
    title: string;      // Tab title
    pinned?: boolean;   // Whether tab was pinned
  }>;
  createdAt: number;    // Unix timestamp
  windowCount?: number; // Number of windows (for saveAllWindows)
}
```

## Complete Example

```typescript
import { SessionManager } from 'chrome-tab-session';

// Initialize with optional custom storage key
const sessions = new SessionManager('my-workspace-sessions');

async function demo() {
  // 1. Save current window
  const workSession = await sessions.saveCurrent('Work Tasks');
  console.log('Saved:', workSession.name);

  // 2. List all sessions
  const all = await sessions.getAll();
  console.log('Total sessions:', all.length);

  // 3. Restore a session in a new window
  await sessions.restore(workSession.id);

  // 4. Export for backup
  const backup = await sessions.export();
  
  // 5. Delete old sessions
  await sessions.delete(workSession.id);
}

demo();
```

## Permissions Required

Add the following to your `manifest.json`:

```json
{
  "permissions": [
    "tabs",
    "storage"
  ]
}
```

## License

MIT License — see [LICENSE](LICENSE) for details.
