export type AgentType = "scorpion" | "nanobot" | "openclaw" | "zeroclaw" | "custom"

export interface MessageOrigin {
  workspaceId: string
  serverId: string
  channelId: string
  threadId?: string
  messageId: string
  userId: string
}

export interface BridgeInboundMessage {
  type: "user.message"
  text: string
  origin: MessageOrigin
  target: {
    agentType: AgentType | string
    agentId: string
  }
  correlationId?: string
}

export interface AgentRegisterRequest {
  agentName: string
  agentType: AgentType
  publicKeyPem: string
  metadata?: Record<string, unknown>
}
