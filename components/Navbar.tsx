"use client"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/app/auth/AuthContext"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  User, LogOut, LayoutDashboard, Rss,
  Home, Hash, Bell, Mail, Bookmark, List, Search
} from "lucide-react"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const { user, signOut } = useAuth()
  const pathname = usePathname()

  return (
    <header className="px-2 lg:px-4 h-16 flex items-center fixed top-0 left-0 z-50 backdrop-blur-md border-b border-zinc-800 bg-black/80 w-full">
      <Link href="/" className="flex items-center gap-2 justify-center flex-shrink-0" prefetch={false}>
        <Image src="/logo.png" alt="AuraFlow Logo" width={32} height={32} priority />
        <span className="text-lg font-semibold af-text-gradient hidden sm:inline">AuraFlow</span>
      </Link>

      {user && (
        <nav className="flex-1 flex justify-center items-center gap-1 sm:gap-2 px-4">
          <NavIcon href="/home" icon={<Home className="h-5 w-5" />} active={pathname === '/home'} />
          <NavIcon href="/feed" icon={<Hash className="h-5 w-5" />} active={pathname === '/feed'} />
          <NavIcon href="/notifications" icon={<Bell className="h-5 w-5" />} active={pathname === '/notifications'} />
          <NavIcon href="/messages" icon={<Mail className="h-5 w-5" />} active={pathname === '/messages'} />
          <NavIcon href="/bookmarks" icon={<Bookmark className="h-5 w-5" />} active={pathname === '/bookmarks'} />
          <NavIcon href="/lists" icon={<List className="h-5 w-5" />} active={pathname === '/lists'} />
        </nav>
      )}

      <div className="flex items-center gap-4 flex-shrink-0 ml-auto">
        <div className="hidden md:flex bg-zinc-900 rounded-full items-center px-3 py-1.5 gap-2 border border-zinc-800 focus-within:border-af-cyan transition-all">
          <Search className="h-4 w-4 text-zinc-500" />
          <input className="bg-transparent border-none focus:ring-0 text-xs text-white w-32" placeholder="Search Auras" />
        </div>

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full bg-af-blue/20 border border-af-border/30 p-0 overflow-hidden">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Me" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <User className="h-5 w-5 text-af-blue" />
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 af-panel border-zinc-800 bg-black text-af-text" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.firstName} {user.lastName}</p>
                  <p className="text-xs leading-none text-af-muted">
                    @{user.handle || `${user.firstName}${user.lastName ? `_${user.lastName}` : ''}`.toLowerCase().replace(/\s+/g, '_')}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className="cursor-pointer flex items-center">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/home" className="cursor-pointer flex items-center">
                  <Rss className="mr-2 h-4 w-4" />
                  <span>Your Space</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem
                className="cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-500/10"
                onClick={() => signOut()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/auth">
            <Button className="af-btn-primary rounded-full px-5 h-9 text-sm font-bold">Login</Button>
          </Link>
        )}
      </div>
    </header>
  )
}

function NavIcon({ icon, href, active = false }: { icon: React.ReactNode, href: string, active?: boolean }) {
  return (
    <Link href={href} className={`p-2.5 rounded-full transition-all hover:bg-zinc-900 ${active ? "text-af-cyan bg-af-cyan/5" : "text-zinc-400 hover:text-white"}`}>
      {icon}
    </Link>
  )
}
