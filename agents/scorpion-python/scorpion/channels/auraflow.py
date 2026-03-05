"""AuraFlow bridge channel implementation using WebSocket."""

from __future__ import annotations

import json
from collections import defaultdict
from datetime import datetime, timezone
from typing import Any

from loguru import logger
from websockets.server import WebSocketServerProtocol, serve

from scorpion.bus.events import OutboundMessage
from scorpion.bus.queue import MessageBus
from scorpion.channels.base import BaseChannel


class AuraFlowChannel(BaseChannel):
    """WebSocket channel that lets AuraFlow exchange messages with scorpion."""

    name = "auraflow"

    def __init__(self, config: Any, bus: MessageBus):
        super().__init__(config, bus)
        self._server = None
        self._connections: set[WebSocketServerProtocol] = set()
        self._chat_clients: dict[str, set[WebSocketServerProtocol]] = defaultdict(set)

    async def start(self) -> None:
        self._server = await serve(self._handle_client, self.config.host, self.config.port)
        self._running = True
        logger.info("AuraFlow channel listening on ws://{}:{}", self.config.host, self.config.port)
        await self._server.wait_closed()

    async def stop(self) -> None:
        self._running = False
        for ws in list(self._connections):
            await ws.close(code=1001, reason="AuraFlow channel shutting down")
        self._connections.clear()
        self._chat_clients.clear()

        if self._server is not None:
            self._server.close()
            await self._server.wait_closed()
            self._server = None

    async def send(self, msg: OutboundMessage) -> None:
        payload = {
            "type": "reply",
            "channel": "auraflow",
            "chatId": msg.chat_id,
            "content": msg.content,
            "metadata": msg.metadata,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
        await self._broadcast(msg.chat_id, payload)

    async def _handle_client(self, websocket: WebSocketServerProtocol) -> None:
        self._connections.add(websocket)
        subscribed_chats: set[str] = set()
        authed = not bool(self.config.token)

        try:
            async for raw in websocket:
                msg = json.loads(raw)
                msg_type = msg.get("type")

                if not authed:
                    if msg_type == "auth" and msg.get("token") == self.config.token:
                        authed = True
                        await websocket.send(json.dumps({"type": "auth.ok"}))
                    else:
                        await websocket.send(json.dumps({"type": "error", "error": "unauthorized"}))
                        await websocket.close(code=4003, reason="Unauthorized")
                        return
                    continue

                if msg_type == "subscribe":
                    chat_id = str(msg.get("chatId") or "").strip()
                    if chat_id:
                        self._chat_clients[chat_id].add(websocket)
                        subscribed_chats.add(chat_id)
                        await websocket.send(json.dumps({"type": "subscribed", "chatId": chat_id}))
                    continue

                if msg_type == "message":
                    await self._handle_aura_message(websocket, msg)
                    continue

                if msg_type == "ping":
                    await websocket.send(json.dumps({"type": "pong"}))
        except Exception as exc:
            logger.warning("AuraFlow socket closed with error: {}", exc)
        finally:
            for chat_id in subscribed_chats:
                clients = self._chat_clients.get(chat_id)
                if clients is not None:
                    clients.discard(websocket)
                    if not clients:
                        self._chat_clients.pop(chat_id, None)
            self._connections.discard(websocket)

    async def _handle_aura_message(self, websocket: WebSocketServerProtocol, data: dict[str, Any]) -> None:
        sender_id = str(data.get("senderId") or "auraflow-user")
        chat_id = str(data.get("chatId") or "default")
        content = str(data.get("content") or "").strip()
        if not content:
            return

        if not self.is_allowed(sender_id):
            await websocket.send(json.dumps({"type": "error", "error": "sender_not_allowed"}))
            return

        self._chat_clients[chat_id].add(websocket)
        metadata = {
            "source": "auraflow",
            "serverId": data.get("serverId"),
            "channelId": data.get("channelId"),
            "requestId": data.get("requestId"),
        }

        await self._handle_message(
            sender_id=sender_id,
            chat_id=chat_id,
            content=content,
            metadata=metadata,
            session_key=f"auraflow:{chat_id}",
        )

        await websocket.send(
            json.dumps(
                {
                    "type": "accepted",
                    "chatId": chat_id,
                    "requestId": data.get("requestId"),
                }
            )
        )

    async def _broadcast(self, chat_id: str, payload: dict[str, Any]) -> None:
        data = json.dumps(payload)
        targets = list(self._chat_clients.get(chat_id, set()))
        if not targets:
            return

        stale: list[WebSocketServerProtocol] = []
        for ws in targets:
            try:
                await ws.send(data)
            except Exception:
                stale.append(ws)

        if stale:
            clients = self._chat_clients.get(chat_id, set())
            for ws in stale:
                clients.discard(ws)
            if not clients:
                self._chat_clients.pop(chat_id, None)
