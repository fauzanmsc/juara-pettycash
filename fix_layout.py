import os

filepath = "src/app/(dashboard)/layout.tsx"
with open(filepath, "r") as f:
    content = f.read()

start_link = content.find('<Link href="/pengajuan/baru">')
end_link = content.find('</Link>', start_link) + len('</Link>')
if start_link != -1:
    content = content[:start_link] + content[end_link:]

prof_start = content.find('<DropdownMenu>', content.find('absolute inset-0 bg-gradient-to-r from-blue-500/0'))
prof_end = content.find('</DropdownMenu>', prof_start) + len('</DropdownMenu>')
profile_block = content[prof_start:prof_end]

work_start = content.find('<DropdownMenu>', content.find('<HelpCircle className="w-5 h-5" />'))
work_end = content.find('</DropdownMenu>', work_start) + len('</DropdownMenu>')
workspace_block = content[work_start:work_end]

header_profile = """<DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="relative cursor-pointer flex items-center justify-center outline-none">
                  <Avatar className="h-9 w-9 cursor-pointer bg-slate-100 dark:bg-slate-800 shadow-sm ring-2 ring-white dark:ring-[#151921] hover:scale-105 transition-transform duration-300">
                    <AvatarImage src="/images/default-avatar.png" className="object-cover object-top" />
                    <AvatarFallback className="bg-transparent text-slate-700 dark:text-white font-bold text-xs">
                      {user?.name?.substring(0, 2).toUpperCase() || "BS"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center">
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500 border-2 border-white dark:border-[#151921]"></span>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={12} className="w-64 rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] bg-white/95 dark:bg-white/5 dark:backdrop-blur-xl dark:border-white/10 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] backdrop-blur-xl p-2 animate-in slide-in-from-top-2 fade-in duration-200">
                <div className="px-3 py-3 mb-2 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl">
                  <Avatar className="h-10 w-10 shadow-sm border border-slate-200/50 dark:border-slate-700/50 bg-slate-100 dark:bg-slate-800">
                    <AvatarImage src="/images/default-avatar.png" className="object-cover object-top" />
                    <AvatarFallback className="bg-transparent text-slate-700 dark:text-white font-bold">
                       {user?.name?.substring(0, 2).toUpperCase() || "BS"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-slate-900 dark:text-white leading-tight truncate">{user?.name}</span>
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">{user?.email || "user@jefgroup.com"}</span>
                  </div>
                </div>
                
                <DropdownMenuGroup className="px-1">
                  <Link href="/pengaturan">
                    <DropdownMenuItem className="py-2.5 px-3 rounded-xl cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <Settings className="mr-3 h-4 w-4" /> Pengaturan Akun
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem className="py-2.5 px-3 rounded-xl cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <HelpCircle className="mr-3 h-4 w-4" /> Bantuan & Support
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <div className="my-1 border-t border-slate-100 dark:border-slate-800/50" />
                <DropdownMenuItem className="py-2.5 px-3 rounded-xl cursor-pointer text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 mt-1 transition-colors" onClick={() => signOut()}>
                  <LogOut className="mr-3 h-4 w-4" /> Keluar dari Sistem
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>"""

sidebar_workspace = """<DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className={cn("flex items-center outline-none relative z-10 w-full", sidebarOpen ? "gap-2.5" : "justify-center")}>
                <div className={cn("bg-gradient-to-tr from-slate-100 to-white dark:from-slate-800 dark:to-slate-700 rounded-lg shadow-sm border border-slate-200/50 dark:border-slate-600/50 flex items-center justify-center group-hover:shadow-md group-hover:border-blue-200 dark:group-hover:border-blue-500/30 transition-all duration-300", sidebarOpen ? "w-8 h-8 shrink-0" : "w-10 h-10")}>
                  <span className={cn("text-sm", !sidebarOpen && "text-xl")}>🏢</span>
                </div>
                {sidebarOpen && (
                  <>
                    <div className="flex flex-col flex-1 min-w-0 text-left">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider leading-tight">Workspace</span>
                      <span className="text-sm font-bold truncate text-slate-800 dark:text-slate-200 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">JEF GROUP ID</span>
                    </div>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-400 shrink-0 group-hover:text-blue-500 transition-colors"><path d="M4.18179 6.18181C4.35753 6.00608 4.64245 6.00608 4.81819 6.18181L7.49999 8.86362L10.1818 6.18181C10.3575 6.00608 10.6424 6.00608 10.8182 6.18181C10.9939 6.35755 10.9939 6.64247 10.8182 6.81821L7.81819 9.81821C7.73379 9.9026 7.61934 9.95013 7.49999 9.95013C7.38064 9.95013 7.26618 9.9026 7.18179 9.81821L4.18179 6.81821C4.00605 6.64247 4.00605 6.35755 4.18179 6.18181Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                  </>
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="right" sideOffset={12} className="w-56 rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] bg-white/95 dark:bg-white/5 dark:backdrop-blur-xl dark:border-white/10 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] backdrop-blur-xl p-2 animate-in slide-in-from-left-2 fade-in duration-200">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 py-2">Pilih Workspace</DropdownMenuLabel>
                <DropdownMenuItem className="py-2.5 px-3 rounded-xl cursor-pointer bg-[#E8F5E9] dark:bg-[#B2F082]/10 text-[#0F3D29] dark:text-[#B2F082] font-semibold mb-1 focus:bg-[#E8F5E9] dark:focus:bg-[#B2F082]/20">
                  <span className="mr-2">🏢</span> JEF GROUP ID
                  <CheckSquare className="ml-auto h-4 w-4 text-[#B2F082]" />
                </DropdownMenuItem>
                <DropdownMenuItem className="py-2.5 px-3 rounded-xl cursor-pointer text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white transition-colors mb-1">
                  <span className="mr-2">🌍</span> JEF GROUP SG
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="my-1 border-slate-100 dark:border-slate-800/50" />
              <DropdownMenuItem className="py-2.5 px-3 rounded-xl cursor-pointer text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-50 dark:hover:bg-blue-500/10 mt-1 transition-colors">
                <div className="w-5 h-5 rounded-full border-2 border-dashed border-blue-400 flex items-center justify-center mr-3">
                  <span className="text-xs">+</span>
                </div>
                Tambah Workspace
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>"""

if workspace_block and profile_block:
    content = content.replace(workspace_block, header_profile, 1)
    content = content.replace(profile_block, sidebar_workspace, 1)

with open(filepath, "w") as f:
    f.write(content)
