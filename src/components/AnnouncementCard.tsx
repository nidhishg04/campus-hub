import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pin, Trash2, Clock } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import type { Id } from "@/convex/_generated/dataModel";

interface Announcement {
  _id: Id<"announcements">;
  title: string;
  content: string;
  authorName: string;
  authorRole: string;
  department?: string;
  priority: "low" | "normal" | "high" | "urgent";
  isPinned?: boolean;
  createdAt: number;
  updatedAt: number;
}

const priorityConfig: Record<string, { label: string; className: string }> = {
  low: {
    label: "Low",
    className:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
  normal: {
    label: "Normal",
    className:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
  },
  high: {
    label: "High",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  },
  urgent: {
    label: "Urgent",
    className:
      "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  },
};

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function AnnouncementCard({
  announcement,
  canDelete,
}: {
  announcement: Announcement;
  canDelete: boolean;
}) {
  const removeAnnouncement = useMutation(api.announcements.remove);

  const handleDelete = async () => {
    try {
      await removeAnnouncement({ id: announcement._id });
      toast.success("Announcement removed");
    } catch {
      toast.error("Failed to delete announcement");
    }
  };

  const priority = priorityConfig[announcement.priority] ?? priorityConfig.normal;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border/50 bg-card p-5 transition-colors hover:border-violet-500/20"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {announcement.isPinned && (
              <Pin className="h-3.5 w-3.5 text-violet-500 shrink-0" />
            )}
            <h3 className="font-semibold text-foreground leading-tight">
              {announcement.title}
            </h3>
          </div>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {announcement.content}
          </p>
        </div>
        {canDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
            title="Delete announcement"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className={priority.className}>
          {priority.label}
        </Badge>
        {announcement.department && (
          <Badge variant="outline">{announcement.department}</Badge>
        )}
        <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {timeAgo(announcement.createdAt)}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-500/10 text-violet-600 text-[10px] font-bold">
          {announcement.authorName[0]?.toUpperCase()}
        </div>
        <span>{announcement.authorName}</span>
        <span className="text-muted-foreground/50">&middot;</span>
        <span className="capitalize">{announcement.authorRole}</span>
      </div>
    </motion.div>
  );
}
