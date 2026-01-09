import { Link } from "@tanstack/react-router"
import { Folder, FileCode, FileText, FileJson, File, FileImage, FileAudio, FileVideo } from "lucide-react"
import { cn } from "@/lib/utils"

type FileEntry = {
  name: string
  type: "blob" | "tree"
  oid: string
  path: string
}

const FILE_ICONS: Record<string, React.ElementType> = {
  ts: FileCode,
  tsx: FileCode,
  js: FileCode,
  jsx: FileCode,
  py: FileCode,
  rb: FileCode,
  go: FileCode,
  rs: FileCode,
  java: FileCode,
  c: FileCode,
  cpp: FileCode,
  h: FileCode,
  hpp: FileCode,
  cs: FileCode,
  php: FileCode,
  sh: FileCode,
  md: FileText,
  txt: FileText,
  json: FileJson,
  yaml: FileJson,
  yml: FileJson,
  toml: FileJson,
  png: FileImage,
  jpg: FileImage,
  jpeg: FileImage,
  gif: FileImage,
  svg: FileImage,
  webp: FileImage,
  mp3: FileAudio,
  wav: FileAudio,
  mp4: FileVideo,
  mov: FileVideo,
}

function getFileIcon(name: string, type: "blob" | "tree") {
  if (type === "tree") return Folder
  const ext = name.split(".").pop()?.toLowerCase() || ""
  return FILE_ICONS[ext] || File
}

export function FileTree({
  files,
  username,
  repoName,
  branch,
  basePath = "",
}: {
  files: FileEntry[]
  username: string
  repoName: string
  branch: string
  basePath?: string
}) {
  return (
    <div className="bg-background">
      {files.map((file) => {
        const Icon = getFileIcon(file.name, file.type)
        const route =
          file.type === "tree"
            ? ("/$username/$repo/tree/$" as const)
            : ("/$username/$repo/blob/$" as const)
        const splat = `${branch}/${file.path}`

        return (
          <div
            key={file.oid + file.name}
            className="flex items-center h-10 px-4 border-b border-border/50 last:border-0 hover:bg-secondary/50 transition-colors group"
          >
            <div className="flex items-center justify-center w-5 h-5 shrink-0 mr-3">
              <Icon
                className={cn(
                  "h-4 w-4",
                  file.type === "tree" ? "text-accent fill-accent/20" : "text-muted-foreground"
                )}
              />
            </div>
            
            <div className="flex-1 flex items-center min-w-0">
              <Link
                to={route}
                params={{ username, repo: repoName, _splat: splat }}
                className="text-sm text-foreground hover:text-accent hover:underline truncate mr-4"
              >
                {file.name}
              </Link>
              
              <span className="hidden md:block text-sm text-muted-foreground truncate flex-1 font-normal opacity-80 group-hover:opacity-100 transition-opacity">
                {file.name === ".kamal" ? "well" : file.name.includes("apps/web") ? "fix webhook" : file.name === "cmd" ? "fix" : "hmm"}
              </span>
            </div>

            <div className="text-sm text-muted-foreground shrink-0 tabular-nums font-normal ml-4">
              last month
            </div>
          </div>
        )
      })}
    </div>
  )
}
