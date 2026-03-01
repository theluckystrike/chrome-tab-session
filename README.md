# chrome-tab-session — Tab Session Manager for Extensions
> **Built by [Zovo](https://zovo.one)** | `npm i chrome-tab-session`

Save, restore, export/import tab sessions and window layouts.

```typescript
import { SessionManager } from 'chrome-tab-session';
const mgr = new SessionManager();
await mgr.saveCurrent('Work Tabs');
await mgr.restore(sessionId);
```
MIT License
