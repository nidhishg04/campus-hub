import {
  GraduationCap,
  Bell,
  Calendar,
  Users,
  ArrowRight,
  BookOpen,
  Megaphone,
  ChevronRight,
  Rocket,
  Star,
  Target,
  MapPin,
  Clock,
  Award,
  FileText,
  Globe,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState } from "react";

const features = [
  { icon: Megaphone, title: "Announcements", desc: "Pin priorities, tag departments, and ensure every student sees what matters.", css: "brutal-yellow", emoji: "📢" },
  { icon: Calendar, title: "Events & Fests", desc: "Hackathons, fests, workshops — create, promote, and manage them all.", css: "brutal-blue", emoji: "🎪" },
  { icon: BookOpen, title: "Assignments", desc: "Submit work, get feedback, track grades. Faculty reviews in one click.", css: "brutal-coral", emoji: "📝" },
  { icon: Users, title: "People & Clubs", desc: "Find your people, join clubs, and build teams effortlessly.", css: "brutal-lavender", emoji: "🤝" },
  { icon: Target, title: "Placements", desc: "Dream jobs land in your dashboard. Apply, track status, upload resume.", css: "brutal-mint", emoji: "💼" },
  { icon: Bell, title: "Smart Alerts", desc: "Deadlines, events, alerts — never miss anything important again.", css: "brutal-yellow", emoji: "🔔" },
  { icon: MapPin, title: "Campus Map", desc: "Interactive campus map with building hours, directions, and room finder.", css: "brutal-blue", emoji: "🗺️" },
  { icon: Clock, title: "Academic Calendar", desc: "Exam schedules, holidays, add-drop deadlines — all synced and on time.", css: "brutal-coral", emoji: "📅" },
  { icon: Award, title: "Grades & Results", desc: "View semester grades, GPA calculator, and academic progress tracking.", css: "brutal-lavender", emoji: "🏆" },
  { icon: FileText, title: "Study Resources", desc: "Course materials, past papers, and shared notes — organized by subject.", css: "brutal-mint", emoji: "📂" },
  { icon: BarChart3, title: "Analytics", desc: "Attendance trends, department performance, and placement statistics.", css: "brutal-yellow", emoji: "📊" },
  { icon: Globe, title: "Multi-Dept Support", desc: "Works across all departments with customizable views and filters.", css: "brutal-blue", emoji: "🌐" },
];

const stats = [
  { value: "10K+", label: "Happy Students", emoji: "🎓", css: "brutal-yellow" },
  { value: "500+", label: "Faculty Members", emoji: "👩‍🏫", css: "brutal-blue" },
  { value: "200+", label: "Events / Month", emoji: "🎉", css: "brutal-coral" },
  { value: "99.9%", label: "Always-On Uptime", emoji: "⚡", css: "brutal-lavender" },
];

const testimonials = [
  { name: "Priya Sharma", role: "Computer Science, 4th Year", quote: "Replaced five WhatsApp groups and a shared spreadsheet. Everything I need is in one place!", emoji: "😍" },
  { name: "Dr. Rajesh Kumar", role: "Faculty, Electronics", quote: "Posting an announcement used to mean emails and printouts. Now it takes thirty seconds!", emoji: "🤩" },
  { name: "Ananya Patel", role: "Student Coordinator", quote: "Event registrations tripled after we switched to Campus Hub. The QR system saved us hours!", emoji: "🥳" },
];

const steps = [
  { emoji: "1️⃣", title: "Sign Up", desc: "Quick email login — you're in before you finish your coffee!", css: "brutal-yellow" },
  { emoji: "2️⃣", title: "Pick Your Role", desc: "Student, Faculty, Coordinator, or Admin — we tailor everything.", css: "brutal-blue" },
  { emoji: "3️⃣", title: "Explore & Enjoy", desc: "Announcements, events, grades — all in one beautiful dashboard.", css: "brutal-coral" },
];

const campusHighlights = [
  { icon: "🏛️", title: "Library Hours", desc: "Mon–Sat: 8 AM – 10 PM · Sun: 10 AM – 6 PM", css: "brutal-yellow" },
  { icon: "🍽️", title: "Cafeteria Menu", desc: "Today's Special: Paneer Butter Masala + Naan", css: "brutal-blue" },
  { icon: "🚌", title: "Shuttle Schedule", desc: "Next bus: 12:30 PM → City Center · Every 30 min", css: "brutal-coral" },
  { icon: "🏋️", title: "Sports Complex", desc: "Open 6 AM – 9 PM · Badminton courts available now", css: "brutal-lavender" },
  { icon: "💊", title: "Health Center", desc: "Dr. Mehta available 10 AM – 2 PM · Emergency: ext 112", css: "brutal-mint" },
  { icon: "🖨️", title: "Print Shop", desc: "0.50/page B&W · 2/page Color · Open till 5 PM", css: "brutal-yellow" },
];

const faqs = [
  { q: "Is Campus Hub really free?", a: "Yes! Free for students and faculty. Institutions can upgrade for premium analytics and custom branding." },
  { q: "Can I use it on my phone?", a: "Absolutely! Fully responsive and works beautifully on phones, tablets, and laptops." },
  { q: "How secure is my data?", a: "Industry-standard encryption, secure authentication, and role-based permissions keep everything safe." },
  { q: "What roles are supported?", a: "Students, Faculty, Coordinators, and Admins — each gets a unique dashboard with tailored permissions." },
  { q: "Can faculty take attendance online?", a: "Yes! Faculty can create attendance sessions, mark each student present or absent, and reports auto-generate." },
  { q: "How do placements work?", a: "Admins post listings, students apply with their resume, and everyone tracks application status in real-time." },
];

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const goToAuth = () => navigate(isAuthenticated ? "/dashboard" : "/auth");

  return (
    <div className="min-h-screen bg-background">
      {/* ── Navigation ── */}
      <nav className="sticky top-0 z-50 border-b-2 border-border bg-background">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg brutal-yellow border-2 border-border brutal-shadow-sm">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-lg font-extrabold tracking-tight uppercase">Campus Hub</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="outline" className="hidden sm:flex brutal-btn font-bold" onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}>
              Log In
            </Button>
            <Button onClick={goToAuth} className="brutal-yellow border-2 border-border brutal-shadow-sm font-extrabold uppercase">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section>
        <div className="mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6 sm:pt-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-lg brutal-yellow border-2 border-border brutal-shadow-sm px-5 py-2 text-sm font-extrabold uppercase">
              🎓 DevFusion 4.0 — PS-1
            </div>

            <h1 className="text-5xl font-black leading-[1.05] tracking-tight uppercase sm:text-7xl lg:text-8xl">
              Your Campus,
              <br />
              <span className="inline-block brutal-blue border-2 border-border brutal-shadow px-3 py-1 mt-2">
                One Platform
              </span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl max-w-xl mx-auto">
              Manage attendance, assignments, events, placements, and notifications — all from a single, beautifully designed platform.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="brutal-yellow border-2 border-border brutal-shadow px-8 py-6 text-lg font-extrabold uppercase" onClick={goToAuth}>
                Start Free <ChevronRight className="ml-1 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg font-bold brutal-btn uppercase" onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>
                View Demo
              </Button>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mx-auto mt-14 max-w-3xl">
            <div className="rounded-xl brutal-card border-2 border-border brutal-shadow-lg p-5 sm:p-6">
              <div className="mb-5 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[#FF6B6B] border border-border" />
                <div className="h-3 w-3 rounded-full bg-[#FFEF00] border border-border" />
                <div className="h-3 w-3 rounded-full bg-[#4ADE80] border border-border" />
                <div className="ml-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Campus Hub Dashboard
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { label: "Attendance", value: "92%", css: "brutal-yellow", icon: "✅" },
                  { label: "Assignments", value: "12 Active", css: "brutal-blue", icon: "📚" },
                  { label: "Events", value: "5 Up", css: "brutal-coral", icon: "🎉" },
                ].map((card) => (
                  <div key={card.label} className={`${card.css} border-2 border-border brutal-shadow-sm p-5`}>
                    <span className="text-2xl">{card.icon}</span>
                    <div className="text-sm font-bold uppercase text-foreground/70 mt-2">{card.label}</div>
                    <div className="text-2xl font-black mt-1">{card.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 border-y-2 border-border bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black tracking-tight uppercase sm:text-4xl">
              Getting started is{" "}
              <span className="brutal-blue border-2 border-border brutal-shadow-sm px-2 inline-block">ridiculously easy</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.title} className={`${step.css} border-2 border-border brutal-shadow p-8 text-center`}>
                <div className="text-5xl mb-4">{step.emoji}</div>
                <h3 className="text-xl font-black uppercase">{step.title}</h3>
                <p className="mt-2 text-sm font-bold text-foreground/70">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black tracking-tight uppercase sm:text-4xl">
              Everything your campus needs,{" "}
              <span className="brutal-yellow border-2 border-border brutal-shadow-sm px-2 inline-block">and more</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground font-bold">Ditch the scattered tools. Campus Hub brings it all together.</p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className={`${feature.css} border-2 border-border brutal-shadow p-6`}>
                <div className="flex items-center gap-3 mb-3">
                  <feature.icon className="h-6 w-6" />
                  <span className="text-2xl">{feature.emoji}</span>
                </div>
                <h3 className="text-lg font-black uppercase">{feature.title}</h3>
                <p className="mt-2 text-sm font-bold text-foreground/70 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Campus Info ── */}
      <section className="py-20 border-y-2 border-border bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black tracking-tight uppercase sm:text-4xl">
              Campus at your{" "}
              <span className="brutal-coral border-2 border-border brutal-shadow-sm px-2 inline-block">fingertips</span>
            </h2>
            <p className="mt-3 text-lg text-muted-foreground font-bold">Quick access to everything happening on campus right now</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {campusHighlights.map((item) => (
              <div key={item.title} className={`${item.css} border-2 border-border brutal-shadow-sm p-5`}>
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <div className="font-black uppercase text-sm">{item.title}</div>
                    <div className="text-sm font-bold text-foreground/70 mt-1">{item.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 border-y-2 border-border">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 sm:grid-cols-4 sm:px-6">
          {stats.map((stat) => (
            <div key={stat.label} className={`${stat.css} border-2 border-border brutal-shadow-sm p-5 text-center`}>
              <div className="text-3xl mb-2">{stat.emoji}</div>
              <div className="text-3xl font-black">{stat.value}</div>
              <div className="mt-1 text-xs font-bold uppercase text-foreground/70">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black tracking-tight uppercase sm:text-4xl">
              People <span className="brutal-coral border-2 border-border brutal-shadow-sm px-2 inline-block">love</span> Campus Hub
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="brutal-card border-2 border-border brutal-shadow p-6">
                <div className="text-3xl mb-2">{t.emoji}</div>
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-[#FFEF00] border border-border" />
                  ))}
                </div>
                <p className="text-sm font-bold leading-relaxed text-foreground/80">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg brutal-yellow border-2 border-border brutal-shadow-sm text-sm font-black">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-black">{t.name}</div>
                    <div className="text-xs font-bold text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 border-y-2 border-border bg-muted/30">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black tracking-tight uppercase sm:text-4xl">
              Got questions?{" "}
              <span className="brutal-yellow border-2 border-border brutal-shadow-sm px-2 inline-block">We&apos;ve got answers!</span>
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={faq.q} className="brutal-card border-2 border-border brutal-shadow-sm overflow-hidden">
                <button
                  className="flex w-full items-center justify-between p-5 text-left font-black uppercase text-sm"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{faq.q}</span>
                  <span className={`text-xl font-black transition-transform duration-200 ${openFaq === i ? "rotate-45" : ""}`}>+</span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm font-bold text-muted-foreground border-t-2 border-border pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="brutal-yellow border-2 border-border brutal-shadow-lg p-10 text-center sm:p-16 rounded-xl">
            <div className="text-6xl mb-4">🎊</div>
            <h2 className="text-3xl font-black uppercase sm:text-4xl">Ready to make campus awesome?</h2>
            <p className="mt-4 text-lg font-bold text-foreground/70">Deploy Campus Hub for your institution in minutes, not months. Free to start!</p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="brutal-primary border-2 border-border brutal-shadow px-8 py-6 text-lg font-extrabold uppercase" onClick={goToAuth}>
                Let&apos;s Go — It&apos;s Free! <Rocket className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <p className="mt-4 text-sm font-bold text-foreground/60">No credit card required · Free for students & faculty · Set up in 2 minutes</p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t-2 border-border py-12 bg-background">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 sm:flex-row sm:justify-between sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg brutal-yellow border-2 border-border">
              <GraduationCap className="h-4 w-4" />
            </div>
            <span className="font-extrabold uppercase">Campus Hub</span>
          </div>
          <p className="text-sm font-bold text-muted-foreground">
            © 2026 Campus Hub. Made with ❤️ for campus communities.
          </p>
          <div className="flex gap-6 text-sm font-bold text-muted-foreground">
            {["Privacy", "Terms", "Contact"].map((link) => (
              <a key={link} href="#" className="hover:text-foreground transition-colors">{link}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
