import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { RoleSelection } from "@/components/RoleSelection";
import { AnnouncementCard } from "@/components/AnnouncementCard";
import { AnnouncementForm } from "@/components/AnnouncementForm";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  GraduationCap, LogOut, Bell, Megaphone, Search, CalendarDays,
  BookOpen, Briefcase, ClipboardCheck, Users, BarChart3, Settings,
  Plus, X, Check, MapPin, Clock, Building2, Trash2, UserCog, Shield,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router";

type Tab =
  | "home" | "announcements" | "attendance" | "assignments"
  | "events" | "placements" | "notifications" | "admin" | "search" | "settings";

const tabConfig: Record<string, { label: string; icon: typeof Megaphone }> = {
  home: { label: "Home", icon: GraduationCap },
  announcements: { label: "Announcements", icon: Megaphone },
  attendance: { label: "Attendance", icon: ClipboardCheck },
  assignments: { label: "Assignments", icon: BookOpen },
  events: { label: "Events", icon: CalendarDays },
  placements: { label: "Placements", icon: Briefcase },
  notifications: { label: "Notifications", icon: Bell },
  admin: { label: "Admin Panel", icon: BarChart3 },
  search: { label: "Search", icon: Search },
  settings: { label: "Settings", icon: Settings },
};

const studentTabs = ["home","announcements","attendance","assignments","events","placements","notifications"] as const;
const facultyTabs = ["home","announcements","attendance","assignments","events","placements","notifications"] as const;
const coordinatorTabs = ["home","announcements","attendance","assignments","events","placements","notifications"] as const;
const adminTabs = ["home","announcements","attendance","assignments","events","placements","notifications","admin"] as const;

/* ────────── Home Overview ────────── */
function HomeOverview() {
  const { user } = useAuth();
  const announcements = useQuery(api.announcements.list, {});
  const events = useQuery(api.events.list, {});
  const assignments = useQuery(api.assignments.list, {});
  const placements = useQuery(api.placements.list, {});
  const hour = new Date().getHours();
  const dayOfWeek = new Date().getDay();
  const weekDays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const timeSlots = ["8:00","9:00","10:00","11:00","12:00","14:00","15:00","16:00"];
  const subjects = ["","Data Structures","Algorithms","DBMS","Math","CN","OS","Lab"];
  const stats = [
    { label: "Announcements", value: announcements?.length ?? 0, color: "bg-[#FFEF00]" },
    { label: "Assignments", value: assignments?.length ?? 0, color: "bg-[#90E0EF]" },
    { label: "Events", value: events?.length ?? 0, color: "bg-[#FF6B6B]" },
    { label: "Placements", value: placements?.length ?? 0, color: "bg-[#CDB4DB]" },
  ];
  const facilities = [
    { name: "Library", status: hour >= 8 && hour <= 20 ? "Open" : "Closed", icon: "📚" },
    { name: "Cafeteria", status: hour >= 7 && hour <= 21 ? "Open" : "Closed", icon: "🍽️" },
    { name: "Gym", status: hour >= 6 && hour <= 22 ? "Open" : "Closed", icon: "🏋️" },
    { name: "Shuttle", status: hour >= 7 && hour <= 18 ? "Running" : "Stopped", icon: "🚌" },
    { name: "Print Shop", status: hour >= 9 && hour <= 17 ? "Open" : "Closed", icon: "🖨️" },
    { name: "Health Center", status: hour >= 8 && hour <= 20 ? "Open" : "Closed", icon: "🏥" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className={`border-2 border-border p-4 brutal-shadow-sm ${s.color}`}>
            <p className="text-xs font-extrabold uppercase text-muted-foreground">{s.label}</p>
            <p className="text-2xl font-black">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="border-2 border-border p-4 brutal-shadow bg-card">
            <h3 className="mb-3 font-extrabold uppercase flex items-center gap-2"><CalendarDays className="h-4 w-4" /> Weekly Timetable</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr>
                  <th className="pb-2 pr-2 text-left font-bold uppercase">Time</th>
                  {weekDays.slice(1,6).map((d) => <th key={d} className={`pb-2 px-2 text-center font-bold uppercase ${dayOfWeek === weekDays.indexOf(d) ? "text-[#FF6B6B]" : ""}`}>{d}</th>)}
                </tr></thead>
                <tbody>{timeSlots.map((t, i) => (
                  <tr key={t} className="border-t border-border/50">
                    <td className="py-1.5 pr-2 font-medium whitespace-nowrap">{t}</td>
                    {weekDays.slice(1,6).map((d) => <td key={d} className={`py-1.5 px-2 text-center ${dayOfWeek === weekDays.indexOf(d) ? "bg-[#90E0EF]/20 font-medium" : ""}`}>{subjects[i+1] || "—"}</td>)}
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
          <div className="border-2 border-border p-4 brutal-shadow bg-card">
            <h3 className="mb-3 font-extrabold uppercase flex items-center gap-2"><BookOpen className="h-4 w-4" /> Upcoming Assignments</h3>
            <div className="space-y-2">
              {!assignments ? <Skeleton className="h-12 rounded-lg" /> : assignments.length === 0 ? <p className="text-xs text-muted-foreground">No assignments</p> :
              assignments.slice(0,3).map((a) => <div key={a._id} className="flex items-center justify-between border border-border/50 p-2"><div><p className="text-sm font-bold">{a.title}</p><p className="text-[10px] text-muted-foreground">{a.subject}</p></div><span className="text-[10px] font-bold bg-[#FFEF00] px-2 py-0.5 border border-border">Due {a.deadline}</span></div>)}
            </div>
          </div>
          <div className="border-2 border-border p-4 brutal-shadow bg-card">
            <h3 className="mb-3 font-extrabold uppercase flex items-center gap-2"><CalendarDays className="h-4 w-4" /> Upcoming Events</h3>
            <div className="space-y-2">
              {!events ? <Skeleton className="h-12 rounded-lg" /> : events.length === 0 ? <p className="text-xs text-muted-foreground">No events</p> :
              events.slice(0,3).map((e) => <div key={e._id} className="flex items-center justify-between border border-border/50 p-2"><div><p className="text-sm font-bold">{e.title}</p><p className="text-[10px] text-muted-foreground">{e.venue}</p></div><span className="text-[10px] font-bold bg-[#90E0EF] px-2 py-0.5 border border-border">{e.date}</span></div>)}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="border-2 border-border p-4 brutal-shadow bg-card">
            <h3 className="mb-3 font-extrabold uppercase flex items-center gap-2"><Users className="h-4 w-4" /> Profile</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground font-bold">Name</span><span className="font-bold">{user?.name || "—"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground font-bold">Role</span><span className="font-bold capitalize">{user?.role || "—"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground font-bold">Dept</span><span className="font-bold">{user?.department || "—"}</span></div>
              {user?.rollNumber && <div className="flex justify-between"><span className="text-muted-foreground font-bold">Roll</span><span className="font-bold">{user.rollNumber}</span></div>}
              {user?.semester && <div className="flex justify-between"><span className="text-muted-foreground font-bold">Sem</span><span className="font-bold">{user.semester}</span></div>}
            </div>
          </div>
          <div className="border-2 border-border p-4 brutal-shadow bg-card">
            <h3 className="mb-3 font-extrabold uppercase flex items-center gap-2"><CalendarDays className="h-4 w-4" /> Academic Calendar</h3>
            <div className="space-y-2 text-xs">
              {[
                { event: "Mid-Sem Exams", date: "Sep 15-20", type: "Exam", color: "bg-[#FF6B6B] text-white" },
                { event: "Assignment Due", date: "Sep 10", type: "Deadline", color: "bg-[#FFEF00]" },
                { event: "Tech Fest", date: "Oct 5-7", type: "Event", color: "bg-[#90E0EF]" },
                { event: "Placement Drive", date: "Oct 15", type: "Placement", color: "bg-[#CDB4DB]" },
                { event: "Diwali Holiday", date: "Oct 20-25", type: "Holiday", color: "bg-[#A8DADC]" },
                { event: "End-Sem Exams", date: "Dec 1-15", type: "Exam", color: "bg-[#FF6B6B] text-white" },
                { event: "Project Submission", date: "Dec 10", type: "Deadline", color: "bg-[#FFEF00]" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between border border-border/50 p-2">
                  <div><p className="font-bold">{item.event}</p><p className="text-[10px] text-muted-foreground">{item.date}</p></div>
                  <span className={`px-2 py-0.5 font-extrabold uppercase text-[9px] border border-border ${item.color}`}>{item.type}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="border-2 border-border p-4 brutal-shadow bg-card">
            <h3 className="mb-3 font-extrabold uppercase flex items-center gap-2"><Building2 className="h-4 w-4" /> Campus Info</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {facilities.map((f) => (
                <div key={f.name} className="border border-border/50 p-2 text-center">
                  <span className="text-lg">{f.icon}</span>
                  <p className="font-bold mt-1">{f.name}</p>
                  <p className={`text-[10px] font-extrabold ${f.status === "Open" || f.status === "Running" ? "text-emerald-600" : "text-red-500"}`}>{f.status}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────── Announcements Tab ────────── */
function AnnouncementsTab() {
  const { user } = useAuth();
  const isFaculty = user?.role === "faculty" || user?.role === "admin" || user?.role === "coordinator";
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const announcements = useQuery(api.announcements.list, filterDept ? { department: filterDept } : {});
  const searchResults = useQuery(api.announcements.search, searchQuery.length > 0 ? { query: searchQuery } : "skip");
  const display = searchQuery.length > 0 ? searchResults : announcements;
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder="Search announcements..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground" />
        </div>
        <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)} className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
          <option value="">All Departments</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Electronics">Electronics</option>
          <option value="Mechanical">Mechanical</option>
        </select>
      </div>
      {isFaculty && <AnnouncementForm />}
      <div className="space-y-3">
        {!display ? <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="border border-border/50 bg-card p-5"><Skeleton className="mb-2 h-5 w-48" /><Skeleton className="h-3 w-full" /></div>)}</div>
        : display.length === 0 ? <div className="flex flex-col items-center justify-center border border-dashed border-border/70 py-12"><Megaphone className="mb-2 h-9 w-9 text-muted-foreground/50" /><p className="text-sm text-muted-foreground">{searchQuery ? "No results" : "No announcements yet"}</p></div>
        : display.map((a) => <AnnouncementCard key={a._id} announcement={a} canDelete={isFaculty} />)}
      </div>
    </div>
  );
}

/* ────────── Attendance Tab ────────── */
function AttendanceTab() {
  const { user } = useAuth();
  const isFaculty = user?.role === "faculty" || user?.role === "admin" || user?.role === "coordinator";
  const [showCreate, setShowCreate] = useState(false);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Attendance</h2>
        {isFaculty && <Button size="sm" onClick={() => setShowCreate(!showCreate)} className="gap-1.5">{showCreate ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}{showCreate ? "Cancel" : "New Session"}</Button>}
      </div>
      {isFaculty && showCreate && <AttendanceCreateForm onDone={() => setShowCreate(false)} />}
      {isFaculty ? <FacultyAttendanceView /> : <StudentAttendanceView />}
    </div>
  );
}

function AttendanceCreateForm({ onDone }: { onDone: () => void }) {
  const createSession = useMutation(api.attendance.createSession);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [dept, setDept] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !subject) return;
    setSubmitting(true);
    try { await createSession({ title, subject, date, department: dept || undefined }); onDone(); } catch {} finally { setSubmitting(false); }
  };
  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border/50 bg-card p-4 space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div><label className="mb-1 block text-xs font-medium text-muted-foreground">Session Title</label><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Morning Lecture" className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm" required /></div>
        <div><label className="mb-1 block text-xs font-medium text-muted-foreground">Subject</label><input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Data Structures" className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm" required /></div>
        <div><label className="mb-1 block text-xs font-medium text-muted-foreground">Date</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm" required /></div>
        <div><label className="mb-1 block text-xs font-medium text-muted-foreground">Department</label>
          <select value={dept} onChange={(e) => setDept(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm">
            <option value="">All</option><option value="Computer Science">Computer Science</option><option value="Electronics">Electronics</option><option value="Mechanical">Mechanical</option>
          </select>
        </div>
      </div>
      <Button type="submit" size="sm" disabled={submitting}>{submitting ? "Creating..." : "Create Session"}</Button>
    </form>
  );
}

function FacultyAttendanceView() {
  const sessions = useQuery(api.attendance.listSessions);
  const students = useQuery(api.users.listStudents);
    const markAttendance = useMutation(api.attendance.markAttendance);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [marks, setMarks] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const selected = sessions?.find((s) => s._id === selectedSession);

  const handleToggle = (studentId: string) => {
    setMarks((prev) => ({ ...prev, [studentId]: prev[studentId] === false ? true : prev[studentId] === true ? false : false }));
  };
  const markAll = (present: boolean) => {
    if (!students) return;
    const m: Record<string, boolean> = {};
    students.forEach((s: { _id: string }) => { m[s._id] = present; });
    setMarks(m);
  };
  const handleSave = async () => {
    if (!selectedSession || !students) return;
    setSaving(true);
    try {
      const attendanceList = students.map((s: { _id: string; name?: string; email?: string }) => ({ studentId: s._id as any, studentName: s.name || s.email || "Student", present: marks[s._id] ?? true }));
      await markAttendance({ sessionId: selectedSession as any, records: attendanceList });
      setSelectedSession(null); setMarks({});
    } catch {} finally { setSaving(false); }
  };

  if (selected && selectedSession) {
    const presentCount = students ? Object.values(marks).filter((v) => v === true).length : 0;
    const totalCount = students?.length ?? 0;
    return (
      <div className="space-y-4">
        <button onClick={() => { setSelectedSession(null); setMarks({}); }} className="flex items-center gap-1 text-sm font-bold cursor-pointer hover:underline">Back to sessions</button>
        <div className="rounded-xl border border-border/50 bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div><p className="font-medium">{selected.title}</p><p className="text-xs text-muted-foreground">{selected.subject} &middot; {selected.date}</p></div>
            <span className="rounded-full bg-violet-500/10 px-2.5 py-0.5 text-xs font-medium text-violet-600">{presentCount}/{totalCount} Present</span>
          </div>
          <div className="flex gap-2 mb-3">
            <Button size="sm" variant="outline" onClick={() => markAll(true)}>Mark All Present</Button>
            <Button size="sm" variant="outline" onClick={() => markAll(false)}>Mark All Absent</Button>
          </div>
        </div>
        {!students ? <Skeleton className="h-32 rounded-xl" /> : students.length === 0 ? <p className="text-sm text-muted-foreground text-center py-8">No students registered</p> : (
          <div className="space-y-2">
            {students.map((s: { _id: string; name?: string; email?: string; rollNumber?: string }) => (
              <div key={s._id} className="flex items-center justify-between rounded-xl border border-border/50 bg-card p-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center font-bold text-xs">{(s.name || s.email || "S")[0].toUpperCase()}</div>
                  <div><p className="text-sm font-medium">{s.name || "—"}</p><p className="text-[10px] text-muted-foreground">{s.rollNumber || s.email || "—"}</p></div>
                </div>
                <button onClick={() => handleToggle(s._id)} className={`px-4 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${marks[s._id] === true ? "bg-emerald-500 text-white" : marks[s._id] === false ? "bg-red-500 text-white" : "bg-muted text-muted-foreground"}`}>
                  {marks[s._id] === true ? "Present" : marks[s._id] === false ? "Absent" : "Mark"}
                </button>
              </div>
            ))}
          </div>
        )}
        {students && students.length > 0 && <Button onClick={handleSave} disabled={saving} className="w-full">{saving ? "Saving..." : "Save Attendance"}</Button>}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {!sessions ? [1,2].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />) : sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-border/70 py-12"><ClipboardCheck className="mb-2 h-9 w-9 text-muted-foreground/50" /><p className="text-sm text-muted-foreground">No sessions yet</p></div>
      ) : sessions.map((s) => (
        <button key={s._id} onClick={() => { setSelectedSession(s._id); setMarks({}); }} className="w-full text-left rounded-xl border border-border/50 bg-card p-4 cursor-pointer hover:bg-muted/50 transition-colors">
          <div className="flex items-center justify-between">
            <div><p className="font-medium">{s.title}</p><p className="text-xs text-muted-foreground">{s.subject} &middot; {s.date}{s.department ? ` &middot; ${s.department}` : ""}</p></div>
            <span className="rounded-full bg-[#FF6B6B]/10 px-2.5 py-0.5 text-xs font-medium text-violet-600">Open</span>
          </div>
        </button>
      ))}
    </div>
  );
}

function StudentAttendanceView() {
  const myStats = useQuery(api.attendance.myStats);
  const myAttendance = useQuery(api.attendance.myAttendance);
  const sessions = useQuery(api.attendance.listSessions);
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border/50 bg-card p-4">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 shrink-0">
            <svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36"><circle cx="18" cy="18" r="15.915" fill="none" stroke="currentColor" className="text-muted/50" strokeWidth="2.5" /><circle cx="18" cy="18" r="15.915" fill="none" stroke="currentColor" className="text-violet-500" strokeWidth="2.5" strokeDasharray={`${myStats?.percentage ?? 0} 100`} strokeLinecap="round" /></svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">{myStats?.percentage ?? 0}%</span>
          </div>
          <div><p className="text-sm text-muted-foreground">Overall Attendance</p><p className="text-sm">{myStats?.present ?? 0} present out of {myStats?.total ?? 0} sessions</p></div>
        </div>
      </div>
      <h3 className="text-sm font-medium text-muted-foreground">Session History</h3>
      <div className="space-y-2">
        {!sessions ? [1,2].map((i) => <Skeleton key={i} className="h-16 rounded-xl" />) : sessions.length === 0 ? <p className="text-sm text-muted-foreground text-center py-8">No sessions yet</p> :
        sessions.map((s) => { const record = myAttendance?.find((r) => r.sessionId === s._id); return (
          <div key={s._id} className="rounded-xl border border-border/50 bg-card p-3">
            <div className="flex items-center justify-between">
              <div><p className="text-sm font-medium">{s.title}</p><p className="text-xs text-muted-foreground">{s.subject} &middot; {s.date}</p></div>
              {record ? <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${record.present ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"}`}>{record.present ? "Present" : "Absent"}</span> : <span className="text-xs text-muted-foreground">Not marked</span>}
            </div>
          </div>
        );})}
      </div>
    </div>
  );
}

/* ────────── Assignments Tab ────────── */
function AssignmentsTab() {
  const { user } = useAuth();
  const isFaculty = user?.role === "faculty" || user?.role === "admin" || user?.role === "coordinator";
  const [showCreate, setShowCreate] = useState(false);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Assignments</h2>{isFaculty && <Button size="sm" onClick={() => setShowCreate(!showCreate)} className="gap-1.5">{showCreate ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}{showCreate ? "Cancel" : "New Assignment"}</Button>}</div>
      {isFaculty && showCreate && <AssignmentCreateForm onDone={() => setShowCreate(false)} />}
      <AssignmentList isFaculty={isFaculty} />
    </div>
  );
}

function AssignmentCreateForm({ onDone }: { onDone: () => void }) {
  const create = useMutation(api.assignments.create);
  const [title, setTitle] = useState(""); const [description, setDescription] = useState(""); const [subject, setSubject] = useState(""); const [deadline, setDeadline] = useState(""); const [submitting, setSubmitting] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); if (!title || !description || !subject || !deadline) return; setSubmitting(true); try { await create({ title, description, subject, deadline }); onDone(); } catch {} finally { setSubmitting(false); } };
  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border/50 bg-card p-4 space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2"><label className="mb-1 block text-xs font-medium text-muted-foreground">Title</label><input value={title} onChange={(e) => setTitle(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm" required /></div>
        <div className="sm:col-span-2"><label className="mb-1 block text-xs font-medium text-muted-foreground">Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="flex w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm" required /></div>
        <div><label className="mb-1 block text-xs font-medium text-muted-foreground">Subject</label><input value={subject} onChange={(e) => setSubject(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm" required /></div>
        <div><label className="mb-1 block text-xs font-medium text-muted-foreground">Deadline</label><input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm" required /></div>
      </div>
      <Button type="submit" size="sm" disabled={submitting}>{submitting ? "Posting..." : "Post Assignment"}</Button>
    </form>
  );
}

function AssignmentList({ isFaculty }: { isFaculty: boolean }) {
  const assignments = useQuery(api.assignments.list);
  const mySubmissions = useQuery(api.assignments.mySubmissions);
  const [submittingFor, setSubmittingFor] = useState<string | null>(null);
  const [submissionUrl, setSubmissionUrl] = useState("");
  const submitMutation = useMutation(api.assignments.submit);
  const handleSubmit = async (assignmentId: string) => { if (!submissionUrl) return; try { await submitMutation({ assignmentId: assignmentId as Parameters<typeof submitMutation>[0]["assignmentId"], submissionUrl }); setSubmittingFor(null); setSubmissionUrl(""); } catch {} };
  return (
    <div className="space-y-3">
      {!assignments ? [1,2].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />) : assignments.length === 0 ? <div className="flex flex-col items-center justify-center border border-dashed border-border/70 py-12"><BookOpen className="mb-2 h-9 w-9 text-muted-foreground/50" /><p className="text-sm text-muted-foreground">No assignments yet</p></div> :
      assignments.map((a) => { const submission = mySubmissions?.find((s) => s.assignmentId === a._id); const isOverdue = Date.now() > new Date(a.deadline).getTime(); return (
        <div key={a._id} className="rounded-xl border border-border/50 bg-card p-4 space-y-3">
          <div className="flex items-start justify-between"><div className="flex-1 min-w-0"><p className="font-medium">{a.title}</p><p className="text-xs text-muted-foreground">{a.subject} &middot; by {a.facultyName}</p><p className="mt-1 text-xs text-muted-foreground line-clamp-2">{a.description}</p></div><span className={`ml-3 text-xs ${isOverdue ? "text-red-500 font-medium" : "text-muted-foreground"}`}>Due {a.deadline}</span></div>
          {!isFaculty && <div>{submission ? <span className="text-xs font-medium text-emerald-600">{submission.status === "graded" ? `Graded: ${submission.marks}/100` : "Submitted"}</span> : submittingFor === a._id ? <div className="flex gap-2"><input value={submissionUrl} onChange={(e) => setSubmissionUrl(e.target.value)} placeholder="Paste submission URL" className="flex h-9 flex-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm" autoFocus /><Button size="sm" onClick={() => handleSubmit(a._id)} disabled={!submissionUrl}><Check className="h-3.5 w-3.5" /></Button><Button size="sm" variant="outline" onClick={() => { setSubmittingFor(null); setSubmissionUrl(""); }}><X className="h-3.5 w-3.5" /></Button></div> : <Button size="sm" variant="outline" onClick={() => setSubmittingFor(a._id)}>Submit Solution</Button>}</div>}
        </div>
      );})}
    </div>
  );
}

/* ────────── Events Tab ────────── */
function EventsTab() {
  const { user } = useAuth();
  const isOrganizer = user?.role === "admin" || user?.role === "coordinator" || user?.role === "faculty";
  const [showCreate, setShowCreate] = useState(false);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Events</h2>{isOrganizer && <Button size="sm" onClick={() => setShowCreate(!showCreate)} className="gap-1.5">{showCreate ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}{showCreate ? "Cancel" : "New Event"}</Button>}</div>
      {isOrganizer && showCreate && <EventCreateForm onDone={() => setShowCreate(false)} />}
      <EventsList />
    </div>
  );
}

function EventCreateForm({ onDone }: { onDone: () => void }) {
  const createEvent = useMutation(api.events.create);
  const [title, setTitle] = useState(""); const [description, setDescription] = useState(""); const [venue, setVenue] = useState(""); const [date, setDate] = useState(""); const [deadline, setDeadline] = useState(""); const [seats, setSeats] = useState("100"); const [submitting, setSubmitting] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); if (!title || !description || !venue || !date || !deadline) return; setSubmitting(true); try { await createEvent({ title, description, venue, date, registrationDeadline: deadline, totalSeats: parseInt(seats, 10) }); onDone(); } catch {} finally { setSubmitting(false); } };
  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border/50 bg-card p-4 space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2"><label className="mb-1 block text-xs font-medium text-muted-foreground">Title</label><input value={title} onChange={(e) => setTitle(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm" required /></div>
        <div className="sm:col-span-2"><label className="mb-1 block text-xs font-medium text-muted-foreground">Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="flex w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm" required /></div>
        <div><label className="mb-1 block text-xs font-medium text-muted-foreground">Venue</label><input value={venue} onChange={(e) => setVenue(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm" required /></div>
        <div><label className="mb-1 block text-xs font-medium text-muted-foreground">Seats</label><input type="number" value={seats} onChange={(e) => setSeats(e.target.value)} min="1" className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm" required /></div>
        <div><label className="mb-1 block text-xs font-medium text-muted-foreground">Date</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm" required /></div>
        <div><label className="mb-1 block text-xs font-medium text-muted-foreground">Reg Deadline</label><input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm" required /></div>
      </div>
      <Button type="submit" size="sm" disabled={submitting}>{submitting ? "Creating..." : "Create Event"}</Button>
    </form>
  );
}

function EventsList() {
  const events = useQuery(api.events.list);
  const myRegistrations = useQuery(api.events.myRegistrations);
  const register = useMutation(api.events.register);
  const cancelReg = useMutation(api.events.cancelRegistration);
  const { user } = useAuth();
  const isStudent = user?.role === "student";
  return (
    <div className="space-y-3">
      {!events ? [1,2].map((i) => <Skeleton key={i} className="h-28 rounded-xl" />) : events.length === 0 ? <div className="flex flex-col items-center justify-center border border-dashed border-border/70 py-12"><CalendarDays className="mb-2 h-9 w-9 text-muted-foreground/50" /><p className="text-sm text-muted-foreground">No events</p></div> :
      events.map((e) => { const registered = myRegistrations?.some((r) => r.eventId === e._id); const isFull = e.registeredCount >= e.totalSeats; return (
        <div key={e._id} className="rounded-xl border border-border/50 bg-card p-4 space-y-3">
          <div className="flex items-start justify-between"><div className="flex-1 min-w-0"><p className="font-medium">{e.title}</p><div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground"><span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {e.venue}</span><span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" /> {e.date}</span></div><p className="mt-1 text-xs text-muted-foreground line-clamp-2">{e.description}</p></div><span className={`ml-3 text-xs font-medium ${isFull ? "text-red-500" : "text-muted-foreground"}`}>{e.registeredCount}/{e.totalSeats}</span></div>
          {isStudent && <div>{registered ? <Button size="sm" variant="outline" onClick={() => cancelReg({ eventId: e._id })} className="gap-1 text-destructive"><X className="h-3.5 w-3.5" /> Cancel</Button> : <Button size="sm" variant="outline" disabled={isFull} onClick={() => register({ eventId: e._id })} className="gap-1"><Check className="h-3.5 w-3.5" /> {isFull ? "Full" : "Register"}</Button>}</div>}
        </div>
      );})}
    </div>
  );
}

/* ────────── Placements Tab ────────── */
function PlacementsTab() {
  const { user } = useAuth();
  const isFaculty = user?.role === "admin" || user?.role === "faculty";
  const [showCreate, setShowCreate] = useState(false);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Placements</h2>{isFaculty && <Button size="sm" onClick={() => setShowCreate(!showCreate)} className="gap-1.5">{showCreate ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}{showCreate ? "Cancel" : "Post Listing"}</Button>}</div>
      {isFaculty && showCreate && <PlacementCreateForm onDone={() => setShowCreate(false)} />}
      <PlacementsList />
    </div>
  );
}

function PlacementCreateForm({ onDone }: { onDone: () => void }) {
  const create = useMutation(api.placements.create);
  const [company, setCompany] = useState(""); const [jobRole, setJobRole] = useState(""); const [description, setDescription] = useState(""); const [eligibility, setEligibility] = useState(""); const [ctc, setCtc] = useState(""); const [deadline, setDeadline] = useState(""); const [submitting, setSubmitting] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); if (!company || !jobRole || !description || !eligibility || !ctc || !deadline) return; setSubmitting(true); try { await create({ company, jobRole, description, eligibility, ctc, deadline }); onDone(); } catch {} finally { setSubmitting(false); } };
  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border/50 bg-card p-4 space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div><label className="mb-1 block text-xs font-medium text-muted-foreground">Company</label><input value={company} onChange={(e) => setCompany(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm" required /></div>
        <div><label className="mb-1 block text-xs font-medium text-muted-foreground">Job Role</label><input value={jobRole} onChange={(e) => setJobRole(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm" required /></div>
        <div className="sm:col-span-2"><label className="mb-1 block text-xs font-medium text-muted-foreground">Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="flex w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm" required /></div>
        <div><label className="mb-1 block text-xs font-medium text-muted-foreground">Eligibility</label><input value={eligibility} onChange={(e) => setEligibility(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm" required /></div>
        <div><label className="mb-1 block text-xs font-medium text-muted-foreground">CTC</label><input value={ctc} onChange={(e) => setCtc(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm" required /></div>
        <div><label className="mb-1 block text-xs font-medium text-muted-foreground">Deadline</label><input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm" required /></div>
      </div>
      <Button type="submit" size="sm" disabled={submitting}>{submitting ? "Posting..." : "Post Listing"}</Button>
    </form>
  );
}

function PlacementsList() {
  const placements = useQuery(api.placements.list);
  const myApplications = useQuery(api.placements.myApplications);
  const applyMutation = useMutation(api.placements.apply);
  const { user } = useAuth();
  const isStudent = user?.role === "student";
  return (
    <div className="space-y-3">
      {!placements ? [1,2].map((i) => <Skeleton key={i} className="h-28 rounded-xl" />) : placements.length === 0 ? <div className="flex flex-col items-center justify-center border border-dashed border-border/70 py-12"><Briefcase className="mb-2 h-9 w-9 text-muted-foreground/50" /><p className="text-sm text-muted-foreground">No placements yet</p></div> :
      placements.map((p) => { const applied = myApplications?.some((a) => a.placementId === p._id); const appStatus = myApplications?.find((a) => a.placementId === p._id)?.status; return (
        <div key={p._id} className="rounded-xl border border-border/50 bg-card p-4 space-y-3">
          <div className="flex items-start justify-between"><div className="flex-1 min-w-0"><p className="font-medium">{p.company} - {p.jobRole}</p><div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground"><span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {p.ctc}</span><span className="flex items-center gap-1"><Users className="h-3 w-3" /> {p.eligibility}</span><span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {p.deadline}</span></div><p className="mt-1 text-xs text-muted-foreground line-clamp-2">{p.description}</p></div></div>
          {isStudent && <div>{applied ? <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${appStatus === "selected" ? "bg-emerald-500/10 text-emerald-600" : "bg-violet-500/10 text-violet-600"}`}>{appStatus === "selected" ? "Selected!" : "Applied"}</span> : <Button size="sm" variant="outline" onClick={() => applyMutation({ placementId: p._id })} className="gap-1"><Briefcase className="h-3.5 w-3.5" /> Apply</Button>}</div>}
        </div>
      );})}
    </div>
  );
}

/* ────────── Notifications Tab ────────── */
function NotificationsTab() {
  const notifications = useQuery(api.notifications.list);
  const unreadCount = useQuery(api.notifications.unreadCount);
  const markRead = useMutation(api.notifications.markRead);
  const markAllRead = useMutation(api.notifications.markAllRead);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Notifications</h2><div className="flex items-center gap-2">{unreadCount !== undefined && unreadCount > 0 && <span className="rounded-full bg-[#FF6B6B]/10 px-2.5 py-0.5 text-xs font-medium text-violet-600">{unreadCount} unread</span>}{unreadCount !== undefined && unreadCount > 0 && <Button size="sm" variant="outline" onClick={() => markAllRead()} className="text-xs">Mark all read</Button>}</div></div>
      {!notifications ? <div className="space-y-3">{[1,2,3].map((i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div> : notifications.length === 0 ? <div className="flex flex-col items-center justify-center border border-dashed border-border/70 py-12"><Bell className="mb-2 h-9 w-9 text-muted-foreground/50" /><p className="text-sm text-muted-foreground">No notifications</p></div> :
      notifications.map((n) => <div key={n._id} className={`rounded-xl border p-4 cursor-pointer transition-colors ${n.read ? "border-border/50 bg-card" : "border-violet-500/20 bg-[#FF6B6B]/5 hover:bg-[#FF6B6B]/10"}`} onClick={() => { if (!n.read) markRead({ id: n._id }); }}><div className="flex items-start justify-between"><div><p className="text-sm font-medium">{n.title}</p><p className="mt-1 text-xs text-muted-foreground">{n.message}</p></div><div className="flex items-center gap-2 shrink-0">{!n.read && <span className="h-2 w-2 rounded-full bg-[#FF6B6B]" />}<span className="text-[10px] text-muted-foreground">{new Date(n.createdAt).toLocaleDateString()}</span></div></div></div>)}
    </div>
  );
}

/* ────────── Admin Panel ────────── */
function AdminPanel() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const stats = useQuery(api.users.getStats);
  const allUsers = useQuery(api.users.listAll);
  const removeUser = useMutation(api.users.removeUser);
  const updateRole = useMutation(api.users.updateRole);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  if (!isAdmin) return <div className="flex flex-col items-center justify-center py-12"><Shield className="mb-2 h-9 w-9 text-muted-foreground/50" /><p className="text-sm text-muted-foreground">Admin access required</p></div>;
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Admin Panel</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[{ label: "Students", value: stats?.students ?? 0 },{ label: "Faculty", value: stats?.faculty ?? 0 },{ label: "Coordinators", value: stats?.coordinators ?? 0 },{ label: "Total", value: stats?.total ?? 0 }].map((s) => <div key={s.label} className="rounded-xl border border-border/50 bg-card p-3 text-center"><div className="text-xl font-bold">{s.value}</div><div className="text-[10px] text-muted-foreground">{s.label}</div></div>)}
      </div>
      <div className="rounded-xl border border-border/50 bg-card p-4">
        <h3 className="mb-3 font-medium flex items-center gap-2"><UserCog className="h-4 w-4" /> User Management</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm"><thead><tr className="border-b border-border/50 text-left text-xs text-muted-foreground"><th className="pb-2 pr-4">Name</th><th className="pb-2 pr-4">Email</th><th className="pb-2 pr-4">Role</th><th className="pb-2">Actions</th></tr></thead>
            <tbody>{!allUsers ? <tr><td colSpan={4} className="py-4 text-center text-muted-foreground">Loading...</td></tr> : allUsers.length === 0 ? <tr><td colSpan={4} className="py-4 text-center text-muted-foreground">No users</td></tr> :
            allUsers.slice(0, 50).map((u) => (<tr key={u._id} className="border-b border-border/30"><td className="py-2 pr-4 font-medium">{u.name || "—"}</td><td className="py-2 pr-4 text-muted-foreground">{u.email || "—"}</td><td className="py-2 pr-4"><span className="rounded-full bg-[#FF6B6B]/10 px-2 py-0.5 text-xs font-medium capitalize text-violet-600">{u.role || "—"}</span></td><td className="py-2"><div className="flex items-center gap-1"><Button size="sm" variant="outline" className="h-7 px-2" onClick={() => setExpandedUser(expandedUser === u._id ? null : u._id)}><UserCog className="h-3 w-3" /></Button>{u._id !== user?._id && <Button size="sm" variant="outline" className="h-7 px-2 text-destructive hover:text-destructive" onClick={() => { if (confirm(`Delete ${u.name || u.email}?`)) removeUser({ targetUserId: u._id }); }}><Trash2 className="h-3 w-3" /></Button>}</div></td></tr>))}
            {expandedUser && allUsers?.filter((u) => u._id === expandedUser).map((u) => <tr key={`${u._id}-edit`}><td colSpan={4} className="py-2 px-4 bg-muted/30"><div className="flex items-center gap-3"><span className="text-xs text-muted-foreground">Change role:</span>{(["student","faculty","coordinator","admin"] as const).map((role) => <Button key={role} size="sm" variant={u.role === role ? "default" : "ghost"} className="h-7 text-xs capitalize" onClick={() => updateRole({ targetUserId: u._id, role })}>{role}</Button>)}</div></td></tr>)}
          </tbody></table>
        </div>
      </div>
    </div>
  );
}

/* ────────── Global Search ────────── */
function GlobalSearchPanel() {
  const [query, setQuery] = useState("");
  const announcements = useQuery(api.announcements.search, query.length > 1 ? { query } : "skip");
  const events = useQuery(api.events.list); const placements = useQuery(api.placements.list); const assignments = useQuery(api.assignments.list);
  const q = query.toLowerCase();
  const matchedEvents = events?.filter((e) => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q));
  const matchedPlacements = placements?.filter((p) => p.company.toLowerCase().includes(q) || p.jobRole.toLowerCase().includes(q));
  const matchedAssignments = assignments?.filter((a) => a.title.toLowerCase().includes(q) || a.subject.toLowerCase().includes(q));
  const totalResults = (announcements?.length ?? 0) + (matchedEvents?.length ?? 0) + (matchedPlacements?.length ?? 0) + (matchedAssignments?.length ?? 0);
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Global Search</h2>
      <div className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><input type="text" placeholder="Search everything..." value={query} onChange={(e) => setQuery(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm" autoFocus /></div>
      {query.length > 1 && <p className="text-xs text-muted-foreground">{totalResults} result{totalResults !== 1 ? "s" : ""}</p>}
      {announcements && announcements.length > 0 && <div><h3 className="mb-2 text-sm font-medium text-muted-foreground">Announcements ({announcements.length})</h3><div className="space-y-2">{announcements.slice(0,5).map((a) => <div key={a._id} className="rounded-lg border border-border/50 bg-card p-3"><p className="text-sm font-medium">{a.title}</p></div>)}</div></div>}
      {matchedEvents && matchedEvents.length > 0 && <div><h3 className="mb-2 text-sm font-medium text-muted-foreground">Events ({matchedEvents.length})</h3><div className="space-y-2">{matchedEvents.slice(0,5).map((e) => <div key={e._id} className="rounded-lg border border-border/50 bg-card p-3"><p className="text-sm font-medium">{e.title}</p><p className="text-xs text-muted-foreground">{e.venue} &middot; {e.date}</p></div>)}</div></div>}
      {matchedPlacements && matchedPlacements.length > 0 && <div><h3 className="mb-2 text-sm font-medium text-muted-foreground">Placements ({matchedPlacements.length})</h3><div className="space-y-2">{matchedPlacements.slice(0,5).map((p) => <div key={p._id} className="rounded-lg border border-border/50 bg-card p-3"><p className="text-sm font-medium">{p.company} - {p.jobRole}</p></div>)}</div></div>}
      {matchedAssignments && matchedAssignments.length > 0 && <div><h3 className="mb-2 text-sm font-medium text-muted-foreground">Assignments ({matchedAssignments.length})</h3><div className="space-y-2">{matchedAssignments.slice(0,5).map((a) => <div key={a._id} className="rounded-lg border border-border/50 bg-card p-3"><p className="text-sm font-medium">{a.title}</p></div>)}</div></div>}
      {query.length > 1 && totalResults === 0 && <div className="flex flex-col items-center justify-center border border-dashed border-border/70 py-12"><Search className="mb-2 h-9 w-9 text-muted-foreground/50" /><p className="text-sm text-muted-foreground">No results for "{query}"</p></div>}
    </div>
  );
}

/* ────────── Settings Panel ────────── */
function SettingsPanel({ onSignOut }: { onSignOut: () => void }) {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Settings</h2>
      <div className="rounded-xl border border-border/50 bg-card p-5 space-y-4"><h3 className="font-medium flex items-center gap-2"><Users className="h-4 w-4" /> Profile</h3><div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-sm"><div><span className="text-muted-foreground">Name:</span> {user?.name || "Not set"}</div><div><span className="text-muted-foreground">Email:</span> {user?.email || "Not set"}</div><div><span className="text-muted-foreground">Role:</span> <span className="capitalize">{user?.role || "Not set"}</span></div><div><span className="text-muted-foreground">Department:</span> {user?.department || "Not set"}</div></div></div>
      <div className="rounded-xl border border-border/50 bg-card p-5 space-y-4"><h3 className="font-medium flex items-center gap-2"><Settings className="h-4 w-4" /> Preferences</h3><div className="flex items-center justify-between text-sm"><span>Dark Mode</span><ThemeToggle /></div></div>
      <div className="rounded-xl border border-border/50 bg-card p-5 space-y-4"><h3 className="font-medium flex items-center gap-2"><Shield className="h-4 w-4" /> Account</h3><Button variant="outline" className="text-destructive hover:text-destructive" onClick={onSignOut}><LogOut className="mr-2 h-4 w-4" /> Sign Out</Button></div>
    </div>
  );
}

/* ────────── Tab Panels Map ────────── */
function tabPanels(activeTab: Tab): ReactNode {
  switch (activeTab) {
    case "home": return <HomeOverview />;
    case "announcements": return <AnnouncementsTab />;
    case "attendance": return <AttendanceTab />;
    case "assignments": return <AssignmentsTab />;
    case "events": return <EventsTab />;
    case "placements": return <PlacementsTab />;
    case "notifications": return <NotificationsTab />;
    case "admin": return <AdminPanel />;
    case "search": return <GlobalSearchPanel />;
    case "settings": return <SettingsPanel onSignOut={() => {}} />;
    default: return <HomeOverview />;
  }
}

/* ────────── Main Dashboard ────────── */
export default function Dashboard() {
  const { user, signOut, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const unreadCount = useQuery(api.notifications.unreadCount);

  const handleSignOut = async () => { await signOut(); navigate("/"); };

  if (authLoading || !user) return <div className="min-h-screen bg-background p-6"><div className="mx-auto max-w-5xl space-y-6"><Skeleton className="h-8 w-48" /><Skeleton className="h-9 w-20" /></div></div>;
  if (!user.role) return <RoleSelection />;

  let availableTabs: readonly string[];
  switch (user.role) {
    case "admin": availableTabs = adminTabs; break;
    case "coordinator": availableTabs = coordinatorTabs; break;
    case "faculty": availableTabs = facultyTabs; break;
    default: availableTabs = studentTabs;
  }
  const roleLabel = user.role === "admin" ? "Administrator" : user.role === "coordinator" ? "Coordinator" : user.role === "faculty" ? "Faculty" : "Student";

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center brutal-yellow border-2 border-border brutal-shadow-sm"><GraduationCap className="h-4 w-4" /></div>
            <span className="text-sm font-bold tracking-tight hidden sm:inline uppercase">Campus Hub</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="hidden sm:inline text-xs text-muted-foreground">{roleLabel}</span>
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="relative h-8 w-8" onClick={() => setActiveTab("notifications")}><Bell className="h-4 w-4" />{unreadCount !== undefined && unreadCount > 0 && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#FF6B6B]" />}</Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setActiveTab("search")}><Search className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" onClick={handleSignOut} className="h-8 w-8" title="Sign out"><LogOut className="h-4 w-4" /></Button>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
        <nav className="mb-6 flex gap-1 overflow-x-auto rounded-xl bg-muted/50 p-1">
          {availableTabs.map((tab) => { const cfg = tabConfig[tab]; if (!cfg) return null; const Icon = cfg.icon; return (
            <button key={tab} onClick={() => setActiveTab(tab as Tab)} className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors ${activeTab === tab ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}><Icon className="h-3.5 w-3.5" />{cfg.label}{tab === "notifications" && unreadCount !== undefined && unreadCount > 0 && <span className="ml-1 h-4 w-4 rounded-full bg-[#FF6B6B] text-[9px] font-bold text-white flex items-center justify-center">{unreadCount > 9 ? "9+" : unreadCount}</span>}</button>
          );})}
          <button onClick={() => setActiveTab("search")} className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors ${activeTab === "search" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}><Search className="h-3.5 w-3.5" />Search</button>
          <button onClick={() => setActiveTab("settings")} className={`ml-auto flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors ${activeTab === "settings" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}><Settings className="h-3.5 w-3.5" />Settings</button>
        </nav>
        <div>{tabPanels(activeTab)}</div>
      </div>
    </div>
  );
}


