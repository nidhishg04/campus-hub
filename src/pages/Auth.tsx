import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { useAuth } from "@/hooks/use-auth";
import {
  ArrowRight,
  ArrowLeft,
  Loader2,
  Mail,
  UserX,
  GraduationCap,
  User,
  Phone,
  BookOpen,
  Hash,
  CalendarDays,
} from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

type AuthStep =
  | "signIn"
  | { email: string }
  | "registration"
  | "roleSelection";

interface AuthProps {
  redirectAfterAuth?: string;
}

const departments = [
  "Computer Science & Engineering",
  "Electronics & Communication",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Chemical Engineering",
  "Information Technology",
  "Biotechnology",
  "Physics",
  "Mathematics",
  "Business Administration",
  "Other",
];

function resolveRedirectAfterAuth(
  returnTo: string | null,
  fallback = "/dashboard",
) {
  if (returnTo?.startsWith("/") && !returnTo.startsWith("//")) {
    return returnTo;
  }
  return fallback;
}

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { isLoading: authLoading, isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = resolveRedirectAfterAuth(
    searchParams.get("returnTo"),
    redirectAfterAuth,
  );

  const [step, setStep] = useState<AuthStep>("signIn");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Registration form state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [semester, setSemester] = useState("");
  const [regErrors, setRegErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(redirect);
    }
  }, [authLoading, isAuthenticated, navigate, redirect]);

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      await signIn("email-otp", formData);
      setStep({ email: formData.get("email") as string });
      setIsLoading(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to send verification code. Please try again.",
      );
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      await signIn("email-otp", formData);
      setStep("registration");
      setIsLoading(false);
    } catch {
      setError("That verification code is incorrect. Please try again.");
      setIsLoading(false);
      setOtp("");
    }
  };

  const validateRegistration = (): boolean => {
    const errors: Record<string, string> = {};
    if (!fullName.trim()) errors.fullName = "Full name is required";
    if (!phone.trim()) errors.phone = "Phone number is required";
    else if (!/^[6-9]\d{9}$/.test(phone.replace(/\s/g, "")))
      errors.phone = "Enter a valid 10-digit Indian phone number";
    if (!department) errors.department = "Please select your department";
    if (!rollNumber.trim()) errors.rollNumber = "Roll number is required";
    if (!semester) errors.semester = "Please select your semester";
    setRegErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegistrationSubmit = () => {
    if (!validateRegistration()) return;
    const params = new URLSearchParams({
      fullName: fullName.trim(),
      phone: phone.trim(),
      department,
      rollNumber: rollNumber.trim(),
      semester,
    });
    navigate(`/role-selection?${params.toString()}`);
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn("anonymous");
      navigate(redirect);
    } catch (err) {
      setError(
        `Unable to continue as guest: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="flex items-center justify-center h-full flex-col w-full max-w-md">
          {/* ── Step 1: Email ── */}
          {step === "signIn" && (
            <Card className="w-full brutal-card border-2 border-border brutal-shadow-lg">
              <CardHeader className="text-center">
                <div className="flex justify-center">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-xl brutal-yellow border-2 border-border brutal-shadow-sm mb-3 cursor-pointer"
                    onClick={() => navigate("/")}
                  >
                    <GraduationCap className="h-7 w-7" />
                  </div>
                </div>
                <CardTitle className="text-xl font-extrabold uppercase">Welcome to Campus Hub</CardTitle>
                <CardDescription className="font-bold">
                  Enter your college email to sign in or create an account
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleEmailSubmit}>
                <CardContent>
                  <div className="relative flex items-center gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        name="email"
                        placeholder="you@university.edu"
                        type="email"
                        className="pl-9 border-2 border-border"
                        disabled={isLoading}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      variant="outline"
                      size="icon"
                      disabled={isLoading}
                      className="brutal-btn border-2 border-border shrink-0"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ArrowRight className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {error && (
                    <p className="mt-2 text-sm text-red-500 font-bold">{error}</p>
                  )}

                  <div className="mt-4">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t-2 border-border" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase font-bold">
                        <span className="bg-background px-2 text-muted-foreground">
                          Or
                        </span>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full mt-4 brutal-btn border-2 border-border font-bold uppercase"
                      onClick={handleGuestLogin}
                      disabled={isLoading}
                    >
                      <UserX className="mr-2 h-4 w-4" />
                      Continue as Guest
                    </Button>
                  </div>
                </CardContent>
              </form>
            </Card>
          )}

          {/* ── Step 2: OTP Verification ── */}
          {step !== "signIn" && step !== "registration" && step !== "roleSelection" && (
            <Card className="w-full brutal-card border-2 border-border brutal-shadow-lg">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl brutal-blue border-2 border-border brutal-shadow-sm">
                    <Mail className="h-6 w-6" />
                  </div>
                </div>
                <CardTitle className="text-xl font-extrabold uppercase">Check your email</CardTitle>
                <CardDescription className="font-bold">
                  We sent a 6-digit verification code to{" "}
                  <span className="font-extrabold text-foreground">{(step as { email: string }).email}</span>
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleOtpSubmit}>
                <CardContent className="pb-4">
                  <input
                    type="hidden"
                    name="email"
                    value={(step as { email: string }).email}
                  />
                  <input type="hidden" name="code" value={otp} />

                  <div className="flex justify-center">
                    <InputOTP
                      value={otp}
                      onChange={setOtp}
                      maxLength={6}
                      disabled={isLoading}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && otp.length === 6 && !isLoading) {
                          const form = (e.target as HTMLElement).closest("form");
                          if (form) form.requestSubmit();
                        }
                      }}
                    >
                      <InputOTPGroup>
                        {Array.from({ length: 6 }).map((_, index) => (
                          <InputOTPSlot key={index} index={index} />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  {error && (
                    <p className="mt-2 text-sm text-red-500 text-center font-bold">
                      {error}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground text-center mt-4 font-bold">
                    Didn&apos;t receive a code?{" "}
                    <Button
                      variant="link"
                      className="p-0 h-auto font-bold"
                      onClick={() => setStep("signIn")}
                    >
                      Try a different email
                    </Button>
                  </p>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                  <Button
                    type="submit"
                    className="w-full brutal-primary border-2 border-border brutal-shadow font-extrabold uppercase"
                    disabled={isLoading || otp.length !== 6}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying…
                      </>
                    ) : (
                      <>
                        Verify & Continue
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setStep("signIn")}
                    disabled={isLoading}
                    className="w-full font-bold"
                  >
                    Use a different email
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}

          {/* ── Step 3: Registration Details ── */}
          {step === "registration" && (
            <Card className="w-full brutal-card border-2 border-border brutal-shadow-lg">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl brutal-coral border-2 border-border brutal-shadow-sm">
                    <User className="h-6 w-6" />
                  </div>
                </div>
                <CardTitle className="text-xl font-extrabold uppercase">Complete Your Profile</CardTitle>
                <CardDescription className="font-bold">
                  Tell us about yourself to personalize your Campus Hub experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="fullName" className="text-sm font-extrabold uppercase">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="fullName"
                        placeholder="e.g. Aarav Sharma"
                        className="pl-9 border-2 border-border"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (regErrors.fullName)
                            setRegErrors((p) => ({ ...p, fullName: "" }));
                        }}
                      />
                    </div>
                    {regErrors.fullName && (
                      <p className="text-xs text-red-500 font-bold">{regErrors.fullName}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-sm font-extrabold uppercase">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        placeholder="e.g. 98765 43210"
                        type="tel"
                        className="pl-9 border-2 border-border"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (regErrors.phone)
                            setRegErrors((p) => ({ ...p, phone: "" }));
                        }}
                      />
                    </div>
                    {regErrors.phone && (
                      <p className="text-xs text-red-500 font-bold">{regErrors.phone}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="department" className="text-sm font-extrabold uppercase">
                      Department <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <select
                        id="department"
                        value={department}
                        onChange={(e) => {
                          setDepartment(e.target.value);
                          if (regErrors.department)
                            setRegErrors((p) => ({ ...p, department: "" }));
                        }}
                        className="flex h-10 w-full rounded-md border-2 border-border bg-background pl-9 pr-3 py-2 text-sm font-bold"
                      >
                        <option value="">Select your department</option>
                        {departments.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                    {regErrors.department && (
                      <p className="text-xs text-red-500 font-bold">{regErrors.department}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="rollNumber" className="text-sm font-extrabold uppercase">
                      Roll Number <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="rollNumber"
                        placeholder="e.g. CSE2022045"
                        className="pl-9 border-2 border-border"
                        value={rollNumber}
                        onChange={(e) => {
                          setRollNumber(e.target.value);
                          if (regErrors.rollNumber)
                            setRegErrors((p) => ({ ...p, rollNumber: "" }));
                        }}
                      />
                    </div>
                    {regErrors.rollNumber && (
                      <p className="text-xs text-red-500 font-bold">{regErrors.rollNumber}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="semester" className="text-sm font-extrabold uppercase">
                      Semester <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <CalendarDays className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <select
                        id="semester"
                        value={semester}
                        onChange={(e) => {
                          setSemester(e.target.value);
                          if (regErrors.semester)
                            setRegErrors((p) => ({ ...p, semester: "" }));
                        }}
                        className="flex h-10 w-full rounded-md border-2 border-border bg-background pl-9 pr-3 py-2 text-sm font-bold"
                      >
                        <option value="">Select semester</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                          <option key={s} value={s}>
                            Semester {s}
                          </option>
                        ))}
                      </select>
                    </div>
                    {regErrors.semester && (
                      <p className="text-xs text-red-500 font-bold">{regErrors.semester}</p>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-2">
                <Button
                  type="button"
                  onClick={handleRegistrationSubmit}
                  className="w-full brutal-primary border-2 border-border brutal-shadow font-extrabold uppercase"
                >
                  Continue to Role Selection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep("signIn")}
                  disabled={isLoading}
                  className="w-full font-bold"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to sign in
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="py-3 px-6 text-xs text-center text-muted-foreground border-t-2 border-border bg-muted/30 font-bold">
        Secured by{" "}
        <a
          href="https://freebuff.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground transition-colors font-extrabold"
        >
          freebuff.com
        </a>
      </div>
    </div>
  );
}

export default function AuthPage(props: AuthProps) {
  return (
    <Suspense>
      <Auth {...props} />
    </Suspense>
  );
}
