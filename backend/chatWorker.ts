import { EventEmitter } from "events";
import { PromisePool } from "./promisePool";
import { processChatMessage } from "./chat/process-chat-message";

export const CHAT_MESSAGE_EVENT = "chat_message";
export const ChatWorkerPool = new PromisePool(200);
export const ChatWorker = new EventEmitter();

ChatWorker.on(CHAT_MESSAGE_EVENT, async (payload) => {
  await ChatWorkerPool.waitForFreeSlot();
  ChatWorkerPool.add(processChatMessage, payload);
});
