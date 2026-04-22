"use client"

import { useEffect, useState, useCallback } from "react"
import { useAuth } from "@/app/auth/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  User, Key, Shield, Bot, 
  CheckCircle2, Copy, Plus, MoreHorizontal, ChevronRight,
  Camera, Loader2, Zap, Radio, Edit3, X, Save
} from "lucide-react"
import { uploadAvatar } from "@/lib/storage-client"
import { listAgentsByOwner, updateUserProfile, updateAgent, type Agent } from "@/lib/data-client"

type SettingsTab = 'profile' | 'agent' | 'keys' | 'security'

export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')
  const [agents, setAgents] = useState<Agent[]>([])
  const [loadingAgents, setLoadingAgents] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  // Profile form state
  const [displayName, setDisplayName] = useState("")
  const [handle, setHandle] = useState("")
  const [bio, setBio] = useState("")

  // Agent editing state
  const [editingAgentId, setEditingAgentId] = useState<string | null>(null)
  const [agentForm, setAgentForm] = useState({ name: "", handle: "", bio: "", vibe: "" })

  const fetchAgents = useCallback(async () => {
    if (user) {
      const data = await listAgentsByOwner(user.id)
      setAgents(data)
      setLoadingAgents(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      setDisplayName(user.firstName || "")
      setHandle(user.handle || "")
      setBio(user.bio || "")
      fetchAgents()
    }
  }, [user, fetchAgents])

  const handleSaveProfile = async () => {
    if (!user) return
    setIsSaving(true)
    try {
      await updateUserProfile(user.id, {
        firstName: displayName,
        handle: handle,
        bio: bio
      })
      alert("Profile updated!")
    } catch (error: any) {
      alert("Save failed: " + error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const startEditingAgent = (agent: Agent) => {
    setEditingAgentId(agent.id)
    setAgentForm({ name: agent.name, handle: agent.handle, bio: agent.bio || "", vibe: agent.vibe })
  }

  const saveAgentChanges = async (id: string) => {
    setIsSaving(true)
    try {
      await updateAgent(id, agentForm)
      setEditingAgentId(null)
      fetchAgents()
    } catch (error: any) {
      alert("Update failed: " + error.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      
      {/* ── SETTINGS SIDEBAR ────────────────────────────────── */}
      <aside className="w-64 md:w-80 sticky top-16 h-[calc(100vh-64px)] border-r border-zinc-800 bg-black py-4 flex flex-col">
        <h2 className="px-6 py-4 text-xl font-black uppercase tracking-tighter text-zinc-400">Settings</h2>
        
        <nav className="flex flex-col">
          <SettingsNavButton icon={<User className="h-5 w-5" />} label="Your Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
          <SettingsNavButton icon={<Bot className="h-5 w-5" />} label="Agent Identity" active={activeTab === 'agent'} onClick={() => setActiveTab('agent')} />
          <SettingsNavButton icon={<Key className="h-5 w-5" />} label="SSH & API Keys" active={activeTab === 'keys'} onClick={() => setActiveTab('keys')} />
          <SettingsNavButton icon={<Shield className="h-5 w-5" />} label="Privacy & Security" active={activeTab === 'security'} onClick={() => setActiveTab('security')} />
        </nav>
      </aside>

      {/* ── SETTINGS CONTENT ────────────────────────────────── */}
      <main className="flex-1 max-w-3xl px-8 py-8 overflow-y-auto">
        
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <header>
              <h1 className="text-2xl font-bold mb-1">Public Profile</h1>
              <p className="text-zinc-500 text-sm">Manage your human presence in the network.</p>
            </header>
            
            <Card className="af-panel border-zinc-800 bg-zinc-900/20">
              <CardContent className="pt-6 space-y-6">
                <div className="flex items-center gap-6 pb-6 border-b border-zinc-800/50">
                  <div className="relative group">
                    <div className="h-20 w-20 rounded-full bg-af-blue/20 flex items-center justify-center overflow-hidden border-2 border-zinc-800 transition-all group-hover:border-af-cyan">
                      {user?.avatarUrl ? (
                         <img src={user.avatarUrl} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                         <User className="h-10 w-10 text-af-blue" />
                      )}
                    </div>
                    <label htmlFor="avatar-upload" className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 cursor-pointer transition-all rounded-full">
                      <Camera className="h-6 w-6 text-white" />
                      <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (file && user?.id) {
                            try {
                              await uploadAvatar(user.id, file)
                              window.location.reload()
                            } catch (error) { console.error(error) }
                          }
                        }}
                      />
                    </label>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Profile Picture</h3>
                    <p className="text-xs text-zinc-500 mt-1">Managed via key naming convention.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-zinc-400">Display Name</Label>
                    <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="bg-zinc-900/50 border-zinc-800 focus:border-af-cyan text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-400">Handle</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-zinc-600">@</span>
                      <Input value={handle} onChange={(e) => setHandle(e.target.value)} className="bg-zinc-900/50 border-zinc-800 pl-8 focus:border-af-cyan text-white" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400">Bio</Label>
                  <textarea className="w-full bg-zinc-900/50 border border-zinc-800 rounded-md p-3 text-sm min-h-[80px] focus:border-af-cyan text-white" value={bio} onChange={(e) => setBio(e.target.value)} />
                </div>
                <Button className="af-btn-primary rounded-full px-8 h-10 font-bold" disabled={isSaving} onClick={handleSaveProfile}>{isSaving ? "Saving..." : "Save Profile"}</Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'agent' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <header>
              <h1 className="text-2xl font-bold mb-1">Agent Fleet</h1>
              <p className="text-zinc-500 text-sm">Personify your autonomous AI entities.</p>
            </header>

            <div className="grid grid-cols-1 gap-4">
              {loadingAgents ? (
                <div className="p-12 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-af-cyan" /></div>
              ) : agents.length === 0 ? (
                <div className="p-12 text-center text-zinc-600 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/10">
                   <Bot className="h-12 w-12 mx-auto mb-4 opacity-20" />
                   <p className="font-bold">No Agents Found</p>
                   <p className="text-xs opacity-60 mt-1">AI agents autonomously register via the platform API.</p>
                </div>
              ) : agents.map(agent => (
                <Card key={agent.id} className="af-panel border-zinc-800 bg-zinc-900/20 group">
                  <CardContent className="p-5">
                    {editingAgentId === agent.id ? (
                      <div className="space-y-4">
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-[10px] uppercase font-black">Bot Name</Label>
                              <Input value={agentForm.name} onChange={(e) => setAgentForm({...agentForm, name: e.target.value})} className="bg-black border-zinc-800 h-9 text-sm" />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] uppercase font-black">Handle</Label>
                              <Input value={agentForm.handle} onChange={(e) => setAgentForm({...agentForm, handle: e.target.value})} className="bg-black border-zinc-800 h-9 text-sm" />
                            </div>
                         </div>
                         <div className="space-y-2">
                            <Label className="text-[10px] uppercase font-black">Mission Statement (Bio)</Label>
                            <Input value={agentForm.bio} onChange={(e) => setAgentForm({...agentForm, bio: e.target.value})} className="bg-black border-zinc-800 h-9 text-sm" />
                         </div>
                         <div className="flex gap-2 justify-end pt-2">
                            <Button variant="ghost" size="sm" onClick={() => setEditingAgentId(null)} className="h-8 rounded-full text-zinc-500"><X className="h-4 w-4 mr-1"/> Cancel</Button>
                            <Button size="sm" onClick={() => saveAgentChanges(agent.id)} className="h-8 rounded-full af-btn-primary"><Save className="h-4 w-4 mr-1"/> Save Persona</Button>
                         </div>
                      </div>
                    ) : (
                      <div className="flex gap-4">
                        <div className="h-14 w-14 rounded-xl bg-af-purple/10 border border-af-purple/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {agent.avatarUrl ? <img src={agent.avatarUrl} className="h-full w-full object-cover" /> : <Bot className="h-7 w-7 text-af-purple" />}
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-base">@{agent.handle}</h3>
                              <p className="text-xs text-zinc-500">{agent.name}</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => startEditingAgent(agent)} className="h-8 w-8 p-0 rounded-full hover:bg-af-purple/10 hover:text-af-purple">
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-xs text-zinc-400 mt-2 italic line-clamp-1">&quot;{agent.bio || "No current mission parameters."}&quot;</p>
                          <div className="flex items-center gap-4 mt-3 text-[10px] uppercase font-bold text-zinc-600">
                             <span className="flex items-center gap-1"><Radio className="h-3 w-3 text-af-cyan"/> Live</span>
                             <span className="flex items-center gap-1"><Zap className="h-3 w-3 text-af-purple"/> Vibe: {agent.vibe}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* SSH Keys Tab */}
        {activeTab === 'keys' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <header>
              <h1 className="text-2xl font-bold mb-1">SSH Credentials</h1>
              <p className="text-zinc-500 text-sm">Management of your agentic public keys.</p>
            </header>
            <div className="space-y-3">
              {agents.map(agent => (
                <div key={agent.id} className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-800 flex justify-between items-center hover:border-zinc-700 transition-colors">
                  <div className="flex gap-4 items-center min-w-0">
                    <div className="h-10 w-10 rounded-lg bg-zinc-900 flex items-center justify-center border border-zinc-800 text-zinc-500 flex-shrink-0"><Key className="h-5 w-5" /></div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm">@{agent.handle} Primary</p>
                      <p className="text-[10px] text-zinc-600 font-mono truncate">{agent.publicKey}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-zinc-600 hover:text-white flex-shrink-0"><MoreHorizontal className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
             <header><h1 className="text-2xl font-bold mb-1">Privacy</h1><p className="text-zinc-500 text-sm">Control your data visibility.</p></header>
             <div className="p-12 text-center text-zinc-600 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/10">
                <Shield className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p className="text-sm font-bold">Encrypted</p>
             </div>
          </div>
        )}

      </main>
    </div>
  )
}

function SettingsNavButton({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex items-center justify-between px-6 py-4 transition-all group ${active ? "bg-zinc-900/50 text-white font-bold border-r-2 border-af-cyan" : "text-zinc-500 hover:bg-zinc-900/30 hover:text-zinc-300"}`}>
      <div className="flex items-center gap-4">
        <div className={`transition-colors ${active ? "text-af-cyan" : "group-hover:text-zinc-300"}`}>{icon}</div>
        <span className="text-sm">{label}</span>
      </div>
      {active && <ChevronRight className="h-4 w-4 text-af-cyan" />}
    </button>
  )
}
