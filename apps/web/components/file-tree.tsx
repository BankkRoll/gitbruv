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
    <div>
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
            className="flex items-center h-9 px-4 border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
          >
            <div className="flex items-center justify-center w-5 h-5 shrink-0 mr-2.5">
              <Icon
                className={cn(
                  "h-4 w-4",
                  file.type === "tree" ? "text-primary" : "text-muted-foreground"
                )}
              />
            </div>
            
            <div className="flex-1 flex items-center min-w-0">
              <Link
                to={route}
                params={{ username, repo: repoName, _splat: splat }}
                className="text-sm hover:text-primary hover:underline truncate"
              >
                {file.name}
              </Link>
            </div>

            <div className="text-xs text-muted-foreground shrink-0 tabular-nums ml-4">
              last month
            </div>
          </div>
        )
      })}
    </div>
  )
}
