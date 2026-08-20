const listeners = new Set();

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emitChatEvent(event) {
  listeners.forEach((listener) => {
    try {
      listener(event);
    } catch (error) {
      console.error("Chat event listener failed:", error);
    }
  });
}

module.exports = {
  subscribe,
  emitChatEvent,
};
