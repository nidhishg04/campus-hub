import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  GraduationCap,
  BookOpen,
  Users,
  Shield,
  Loader2,
  ArrowLeft,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "framer-motion";

type RoleChoice = "student" | "faculty" | "coordinator" | "admin";

const roles: {
  value: RoleChoice;
  label: string;
  desc: string;
  icon: typeof GraduationCap;
  color: string;
  emoji: string;
}[] = [
  {
    value: "student",
    label: "Student",
    desc: "View announcements, register for events, track attendance, and submit assignments.",
    icon: GraduationCap,
    color: "from-indigo-500 to-violet-500",
    emoji: "🎓",
  },
  {
    value: "faculty",
    label: "Faculty",
    desc: "Post announcements, manage attendance, create assignments, and review submissions.",
    icon: BookOpen,
    color: "from-violet-500 to-pink-500",
    emoji: "👩‍🏫",
  },
  {
    value: "coordinator",
    label: "Coordinator",
    desc: "Manage events, handle club registrations, approve students, and post campus-wide notices.",
    icon: Users,
    color: "from-amber-500 to-orange-500",
    emoji: "🎯",
  },
  {
    value: "admin",
    label: "Admin",
    desc: "Full platform access — manage users, assign roles, view analytics, and configure settings.",
    icon: Shield,
    color: "from-emerald-500 to-teal-500",
    emoji: "🛡️",
  },
];

export function RoleSelection() {
  const setRole = useMutation(api.users.setRole);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Read registration details from URL
  const regFullName = searchParams.get("fullName") || "";
  const regPhone = searchParams.get("phone") || "";
  const regDepartment = searchParams.get("department") || "";
  const regRollNumber = searchParams.get("rollNumber") || "";
  const regSemester = parseInt(searchParams.get("semester") || "0", 10);

  const [loading, setLoading] = useState(false);
  const [role, setRoleChoice] = useState<RoleChoice | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!role) return;
    setLoading(true);
    try {
      await setRole({
        role,
        fullName: regFullName || undefined,
        phone: regPhone || undefined,
        department: regDepartment || undefined,
        rollNumber: role === "student" ? regRollNumber || undefined : undefined,
        semester: role === "student" && regSemester ? regSemester : undefined,
      });
      setSuccess(true);
      toast.success("Welcome to Campus Hub!", {
        description: `Your ${role} account is ready. Let's go! 🎉`,
      });
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (error) {
      toast.error("Something went wrong", {
        description:
          error instanceof Error ? error.message : "Unable to save your profile.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ──
  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="text-center"
        >
          <motion.div
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-xl shadow-emerald-500/30"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Check className="h-10 w-10 text-white" strokeWidth={3} />
          </motion.div>
          <motion.h1
            className="mt-6 text-3xl font-bold"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            You&apos;re all set! 🎉
          </motion.h1>
          <motion.p
            className="mt-2 text-muted-foreground"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Redirecting you to your dashboard…
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // ── Role selection screen ──
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-violet-500/5 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-pink-500/5 blur-[100px]" />
      </div>

      <Card className="w-full max-w-lg border shadow-lg relative">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <motion.div
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-pink-500 to-amber-400 shadow-lg shadow-violet-500/20"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <GraduationCap className="h-6 w-6 text-white" />
            </motion.div>
          </div>
          <CardTitle className="text-2xl">Almost there!</CardTitle>
          <CardDescription>
            {regFullName ? (
              <>
                Welcome, <span className="font-medium text-foreground">{regFullName}</span>!
                {" "}Pick your role to get started.
              </>
            ) : (
              "Pick your role to get started with Campus Hub"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <AnimatePresence mode="wait">
            {!role ? (
              <motion.div
                key="roles"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-3"
              >
                {roles.map((r, i) => {
                  const Icon = r.icon;
                  return (
                    <motion.button
                      key={r.value}
                      type="button"
                      onClick={() => setRoleChoice(r.value)}
                      className="flex w-full items-center gap-4 rounded-xl border border-border/70 p-4 text-left transition-all hover:border-violet-400/50 hover:bg-violet-500/5 hover:shadow-md hover:shadow-violet-500/5"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08, type: "spring", stiffness: 300 }}
                      whileHover={{ x: 4, scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${r.color} text-white shadow-md`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{r.label}</span>
                          <span className="text-base">{r.emoji}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {r.desc}
                        </div>
                      </div>
                      <ArrowLeft className="h-4 w-4 text-muted-foreground rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.button>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                {/* Summary card */}
                <div className="rounded-xl border border-border/50 bg-muted/30 p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    {(() => {
                      const r = roles.find((x) => x.value === role)!;
                      const Icon = r.icon;
                      return (
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${r.color} text-white`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                      );
                    })()}
                    <div>
                      <div className="font-semibold">
                        {roles.find((x) => x.value === role)?.label}{" "}
                        {roles.find((x) => x.value === role)?.emoji}
                      </div>
                      <div className="text-xs text-muted-foreground">Your selected role</div>
                    </div>
                  </div>

                  <div className="h-px bg-border" />

                  {/* Collected details */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {regFullName && (
                      <div>
                        <span className="text-muted-foreground">Name:</span>{" "}
                        <span className="font-medium">{regFullName}</span>
                      </div>
                    )}
                    {regPhone && (
                      <div>
                        <span className="text-muted-foreground">Phone:</span>{" "}
                        <span className="font-medium">{regPhone}</span>
                      </div>
                    )}
                    {regDepartment && (
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Department:</span>{" "}
                        <span className="font-medium">{regDepartment}</span>
                      </div>
                    )}
                    {regRollNumber && (
                      <div>
                        <span className="text-muted-foreground">Roll No:</span>{" "}
                        <span className="font-medium">{regRollNumber}</span>
                      </div>
                    )}
                    {regSemester > 0 && (
                      <div>
                        <span className="text-muted-foreground">Semester:</span>{" "}
                        <span className="font-medium">{regSemester}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setRoleChoice(null)}
                    disabled={loading}
                    className="flex-1"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-violet-600 via-pink-500 to-amber-400 text-white hover:from-violet-700 hover:via-pink-600 hover:to-amber-500 shadow-lg shadow-violet-500/20"
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="mr-2 h-4 w-4" />
                    )}
                    {loading ? "Setting up…" : "Confirm & Enter"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
