# chrome-tab-session

Manage tab sessions in Chrome extensions.

## Overview

chrome-tab-session provides utilities to save, restore, and manage tab sessions.

## Installation

```bash
npm install chrome-tab-session
```

## Usage

```javascript
import { TabSession } from 'chrome-tab-session';

const session = await TabSession.save();
await TabSession.restore(session);
```

## API

- `save()` - Save current tabs
- `restore(session)` - Restore tabs
- `list()` - List saved sessions

## License

MIT
