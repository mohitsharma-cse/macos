const store = {
  visitors: new Map(),
  messages: [],
};

function isDbReady(mongoose) {
  return mongoose?.connection?.readyState === 1;
}

function upsertVisitor(payload) {
  const existing = store.visitors.get(payload.sessionId) || {
    sessionId: payload.sessionId,
    appsOpened: [],
    commandsTyped: [],
    gamesPlayed: [],
    visitedAt: new Date(),
  };

  const merged = {
    ...existing,
    country: payload.country ?? existing.country,
    device: payload.device ?? existing.device,
    browser: payload.browser ?? existing.browser,
    timeSpent: payload.timeSpent ?? existing.timeSpent ?? 0,
    updatedAt: new Date(),
  };

  merged.appsOpened = [...new Set([...(existing.appsOpened || []), ...(payload.appsOpened || [])])];
  merged.commandsTyped = [...new Set([...(existing.commandsTyped || []), ...(payload.commandsTyped || [])])];
  merged.gamesPlayed = [...new Set([...(existing.gamesPlayed || []), ...(payload.gamesPlayed || [])])];

  store.visitors.set(payload.sessionId, merged);
  return merged;
}

function getVisitorSummary() {
  const visitors = [...store.visitors.values()].sort((a, b) => new Date(b.visitedAt) - new Date(a.visitedAt));
  const todayStart = new Date(new Date().setHours(0, 0, 0, 0));
  const weekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const appCounts = {};

  visitors.forEach(visitor => {
    (visitor.appsOpened || []).forEach(app => {
      appCounts[app] = (appCounts[app] || 0) + 1;
    });
  });

  return {
    total: visitors.length,
    today: visitors.filter(v => new Date(v.visitedAt) >= todayStart).length,
    week: visitors.filter(v => new Date(v.visitedAt) >= weekStart).length,
    recent: visitors.slice(0, 20),
    appCounts,
  };
}

function addMessage(payload) {
  const msg = {
    _id: String(Date.now() + Math.random()),
    name: payload.name,
    email: payload.email,
    company: payload.company,
    message: payload.message,
    type: payload.type,
    ip: payload.ip,
    read: false,
    timestamp: new Date(),
  };
  store.messages.unshift(msg);
  return msg;
}

function getMessages() {
  return [...store.messages].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

module.exports = {
  store,
  isDbReady,
  upsertVisitor,
  getVisitorSummary,
  addMessage,
  getMessages,
};
