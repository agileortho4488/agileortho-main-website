import { useMemo, useState } from "react";
import { apiClient } from "@/lib/api";
import { SUBSPECIALTIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";

const steps = [
  { key: "account", label: "Account" },
  { key: "practice", label: "Practice" },
  { key: "locations", label: "Locations" },
  { key: "uploads", label: "Uploads" },
];

function emptyLocation() {
  return {
    id: crypto.randomUUID(),
    facility_name: "",
    address: "",
    city: "",
    pincode: "",
    opd_timings: "",
    phone: "",
  };
}

export default function JoinSurgeon() {
  const api = useMemo(() => apiClient(), []);
  const [stepIndex, setStepIndex] = useState(0);
  const [subspecialtySet, setSubspecialtySet] = useState(new Set());

  const [account, setAccount] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [profile, setProfile] = useState({
    qualifications: "",
    registration_number: "",
    about: "",
    conditions_treated: "",
    procedures_performed: "",
  });

  const [locations, setLocations] = useState([emptyLocation()]);

  const [docType, setDocType] = useState("registration");
  const [docFiles, setDocFiles] = useState([]);

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  function toggleSub(s) {
    setSubspecialtySet((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  }

  const activeStep = steps[stepIndex];

  function canContinue() {
    if (activeStep.key === "account") {
      return (
        account.name.trim() &&
        account.email.trim().includes("@") &&
        account.mobile.trim().length >= 8 &&
        account.password.trim().length >= 6
      );
    }
    if (activeStep.key === "locations") {
      return locations.every((l) => l.address.trim() && l.pincode.trim().length >= 3);
    }
    if (activeStep.key === "uploads") {
      return docFiles.length >= 1;
    }
    return true;
  }

  async function submit() {
    setSubmitting(true);
    setError("");

    try {
      const signup = await api.post("/auth/surgeon/signup", account);
      const token = signup.data.token;

      const subs = Array.from(subspecialtySet);
      const payload = {
        qualifications: profile.qualifications,
        registration_number: profile.registration_number,
        subspecialties: subs,
        about: profile.about,
        conditions_treated: profile.conditions_treated
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        procedures_performed: profile.procedures_performed
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        locations: locations.map((l) => ({
          id: l.id,
          facility_name: l.facility_name,
          address: l.address,
          city: l.city,
          pincode: l.pincode,
          opd_timings: l.opd_timings,
          phone: l.phone,
        })),
      };

      await api.put("/surgeon/me/profile", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const docsFd = new FormData();
      docsFd.append("doc_type", docType);
      docFiles.forEach((f) => docsFd.append("files", f));

      await api.post("/surgeon/me/profile/documents", docsFd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setResult({ email: account.email, uploadedDocs: docFiles.length });
    } catch (e) {
      setError(e?.response?.data?.detail || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <main data-testid="join-success" className="bg-white">
        <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h1
              data-testid="join-success-title"
              className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl"
            >
              Account created — profile submitted
            </h1>
            <p
              data-testid="join-success-subtext"
              className="mt-3 text-sm leading-relaxed text-slate-600"
            >
              Your profile is currently <b>pending admin approval</b>. Once
              approved, it will appear in public search.
            </p>
            <div
              data-testid="join-success-details"
              className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700"
            >
              <div>Login email: {result.email}</div>
              <div>Documents uploaded: {result.uploadedDocs}</div>
            </div>
            <div
              data-testid="join-success-disclaimer"
              className="mt-5 text-xs text-slate-500"
            >
              This platform does not recommend or rank doctors. No appointment
              booking is provided.
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main data-testid="join-page" className="bg-white">
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1
              data-testid="join-title"
              className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl"
            >
              Join as Surgeon (Free)
            </h1>
            <p
              data-testid="join-subtitle"
              className="mt-2 text-sm leading-relaxed text-slate-600"
            >
              Create an account first, then submit your professional profile.
              Profiles go live only after admin approval.
            </p>
          </div>
          <div
            data-testid="join-step-indicator"
            className="text-xs text-slate-500"
          >
            Step {stepIndex + 1} of {steps.length}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {steps.map((s, idx) => (
            <div
              data-testid={`join-step-${s.key}`}
              key={s.key}
              className={[
                "rounded-2xl border px-4 py-3",
                idx === stepIndex
                  ? "border-sky-200 bg-sky-50"
                  : "border-slate-200 bg-white",
              ].join(" ")}
            >
              <div className="text-xs font-semibold text-slate-900">
                {idx + 1}. {s.label}
              </div>
            </div>
          ))}
        </div>

        {error ? (
          <div
            data-testid="join-error"
            className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
          >
            {error}
          </div>
        ) : null}

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          {activeStep.key === "account" ? (
            <div data-testid="join-step-account" className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-slate-700">Name</div>
                  <Input
                    data-testid="join-account-name"
                    value={account.name}
                    onChange={(e) =>
                      setAccount((a) => ({ ...a, name: e.target.value }))
                    }
                    placeholder="Dr. First Last"
                    className="h-11 rounded-xl border-slate-200 bg-slate-50/60"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-slate-700">Email</div>
                  <Input
                    data-testid="join-account-email"
                    value={account.email}
                    onChange={(e) =>
                      setAccount((a) => ({ ...a, email: e.target.value }))
                    }
                    placeholder="name@clinic.com"
                    className="h-11 rounded-xl border-slate-200 bg-slate-50/60"
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-slate-700">Mobile</div>
                  <Input
                    data-testid="join-account-mobile"
                    value={account.mobile}
                    onChange={(e) =>
                      setAccount((a) => ({ ...a, mobile: e.target.value }))
                    }
                    placeholder="10-digit mobile"
                    className="h-11 rounded-xl border-slate-200 bg-slate-50/60"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-slate-700">Password</div>
                  <Input
                    data-testid="join-account-password"
                    type="password"
                    value={account.password}
                    onChange={(e) =>
                      setAccount((a) => ({ ...a, password: e.target.value }))
                    }
                    className="h-11 rounded-xl border-slate-200 bg-slate-50/60"
                  />
                  <div
                    data-testid="join-account-password-hint"
                    className="text-xs text-slate-500"
                  >
                    Minimum 6 characters.
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {activeStep.key === "practice" ? (
            <div data-testid="join-step-practice" className="grid gap-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-slate-700">
                    Qualification
                  </div>
                  <Input
                    data-testid="join-qualification-input"
                    value={profile.qualifications}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, qualifications: e.target.value }))
                    }
                    placeholder="MS Ortho, DNB, Fellowship…"
                    className="h-11 rounded-xl border-slate-200 bg-slate-50/60"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-slate-700">
                    Medical Registration Number
                  </div>
                  <Input
                    data-testid="join-registration-input"
                    value={profile.registration_number}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, registration_number: e.target.value }))
                    }
                    placeholder="State/MCI Reg. No."
                    className="h-11 rounded-xl border-slate-200 bg-slate-50/60"
                  />
                </div>
              </div>

              <div>
                <div
                  data-testid="join-subspecialty-title"
                  className="text-xs font-semibold text-slate-700"
                >
                  Subspecialty focus
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {SUBSPECIALTIES.map((s) => (
                    <label
                      data-testid={`join-subspecialty-${s.toLowerCase()}`}
                      key={s}
                      className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3"
                    >
                      <Checkbox
                        data-testid={`join-subspecialty-checkbox-${s.toLowerCase()}`}
                        checked={subspecialtySet.has(s)}
                        onCheckedChange={() => toggleSub(s)}
                      />
                      <div className="text-sm font-medium text-slate-800">{s}</div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-slate-700">About</div>
                <Textarea
                  data-testid="join-about-textarea"
                  value={profile.about}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, about: e.target.value }))
                  }
                  placeholder="Short professional bio (no marketing, no pricing, no claims)"
                  className="min-h-[110px] rounded-2xl border-slate-200 bg-slate-50/60"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-slate-700">
                    Conditions treated (comma separated)
                  </div>
                  <Textarea
                    data-testid="join-conditions-textarea"
                    value={profile.conditions_treated}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, conditions_treated: e.target.value }))
                    }
                    placeholder="e.g., knee arthritis, meniscus tear"
                    className="min-h-[110px] rounded-2xl border-slate-200 bg-slate-50/60"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-slate-700">
                    Procedures performed (comma separated)
                  </div>
                  <Textarea
                    data-testid="join-procedures-textarea"
                    value={profile.procedures_performed}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, procedures_performed: e.target.value }))
                    }
                    placeholder="e.g., arthroscopy, joint replacement"
                    className="min-h-[110px] rounded-2xl border-slate-200 bg-slate-50/60"
                  />
                </div>
              </div>
            </div>
          ) : null}

          {activeStep.key === "locations" ? (
            <div data-testid="join-step-locations" className="grid gap-4">
              <div className="flex items-center justify-between">
                <div
                  data-testid="join-locations-title"
                  className="text-sm font-semibold text-slate-900"
                >
                  Clinic / Hospital locations
                </div>
                <Button
                  data-testid="join-add-location"
                  type="button"
                  variant="secondary"
                  onClick={() => setLocations((ls) => [...ls, emptyLocation()])}
                  className="h-9 rounded-full bg-slate-100 text-slate-800 hover:bg-slate-200"
                >
                  Add location
                </Button>
              </div>

              <div className="grid gap-4">
                {locations.map((l, idx) => (
                  <Card
                    data-testid={`join-location-card-${idx}`}
                    key={l.id}
                    className="rounded-3xl border-slate-200 p-5 shadow-none"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-sm font-semibold text-slate-900">
                        Location {idx + 1}
                      </div>
                      {locations.length > 1 ? (
                        <button
                          data-testid={`join-remove-location-${idx}`}
                          type="button"
                          className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                          onClick={() =>
                            setLocations((ls) => ls.filter((x) => x.id !== l.id))
                          }
                        >
                          Remove
                        </button>
                      ) : null}
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <div className="space-y-1.5">
                        <div className="text-xs font-semibold text-slate-700">
                          Clinic/Hospital name
                        </div>
                        <Input
                          data-testid={`join-location-facility-${idx}`}
                          value={l.facility_name}
                          onChange={(e) =>
                            setLocations((ls) =>
                              ls.map((x) =>
                                x.id === l.id
                                  ? { ...x, facility_name: e.target.value }
                                  : x,
                              ),
                            )
                          }
                          className="h-11 rounded-xl border-slate-200 bg-slate-50/60"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <div className="text-xs font-semibold text-slate-700">City</div>
                        <Input
                          data-testid={`join-location-city-${idx}`}
                          value={l.city}
                          onChange={(e) =>
                            setLocations((ls) =>
                              ls.map((x) =>
                                x.id === l.id ? { ...x, city: e.target.value } : x,
                              ),
                            )
                          }
                          className="h-11 rounded-xl border-slate-200 bg-slate-50/60"
                        />
                      </div>
                    </div>

                    <div className="mt-4 space-y-1.5">
                      <div className="text-xs font-semibold text-slate-700">Address</div>
                      <Textarea
                        data-testid={`join-location-address-${idx}`}
                        value={l.address}
                        onChange={(e) =>
                          setLocations((ls) =>
                            ls.map((x) =>
                              x.id === l.id
                                ? { ...x, address: e.target.value }
                                : x,
                            ),
                          )
                        }
                        className="min-h-[90px] rounded-2xl border-slate-200 bg-slate-50/60"
                      />
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-3">
                      <div className="space-y-1.5">
                        <div className="text-xs font-semibold text-slate-700">Pincode</div>
                        <Input
                          data-testid={`join-location-pincode-${idx}`}
                          value={l.pincode}
                          onChange={(e) =>
                            setLocations((ls) =>
                              ls.map((x) =>
                                x.id === l.id
                                  ? { ...x, pincode: e.target.value }
                                  : x,
                              ),
                            )
                          }
                          className="h-11 rounded-xl border-slate-200 bg-slate-50/60"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <div className="text-xs font-semibold text-slate-700">OPD timings</div>
                        <Input
                          data-testid={`join-location-opd-${idx}`}
                          value={l.opd_timings}
                          onChange={(e) =>
                            setLocations((ls) =>
                              ls.map((x) =>
                                x.id === l.id
                                  ? { ...x, opd_timings: e.target.value }
                                  : x,
                              ),
                            )
                          }
                          className="h-11 rounded-xl border-slate-200 bg-slate-50/60"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <div className="text-xs font-semibold text-slate-700">Phone</div>
                        <Input
                          data-testid={`join-location-phone-${idx}`}
                          value={l.phone}
                          onChange={(e) =>
                            setLocations((ls) =>
                              ls.map((x) =>
                                x.id === l.id
                                  ? { ...x, phone: e.target.value }
                                  : x,
                              ),
                            )
                          }
                          className="h-11 rounded-xl border-slate-200 bg-slate-50/60"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div
                data-testid="join-locations-note"
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600"
              >
                You can add multiple clinics/hospitals. Search will match you if
                any location is nearby.
              </div>
            </div>
          ) : null}

          {activeStep.key === "uploads" ? (
            <div data-testid="join-step-uploads" className="grid gap-5">
              <Card className="rounded-2xl border-slate-200 p-4 shadow-none">
                <div
                  data-testid="join-docs-title"
                  className="text-sm font-semibold text-slate-900"
                >
                  Verification documents (upload at least 1)
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  Examples: medical registration proof, degree certificate.
                </div>

                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div>
                    <div className="text-xs font-semibold text-slate-700">Type</div>
                    <div className="mt-2 flex gap-2">
                      {["registration", "degree", "other"].map((t) => (
                        <button
                          data-testid={`join-doc-type-${t}`}
                          key={t}
                          type="button"
                          onClick={() => setDocType(t)}
                          className={[
                            "rounded-full border px-3 py-1.5 text-xs",
                            "transition-[background-color,border-color,color]",
                            docType === t
                              ? "border-sky-200 bg-sky-50 text-sky-900"
                              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                          ].join(" ")}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-slate-700">Files</div>
                    <Input
                      data-testid="join-docs-input"
                      className="mt-2"
                      type="file"
                      multiple
                      onChange={(e) => setDocFiles(Array.from(e.target.files || []))}
                    />
                    <div
                      data-testid="join-docs-count"
                      className="mt-2 text-xs text-slate-500"
                    >
                      Selected: {docFiles.length}
                    </div>
                  </div>
                </div>
              </Card>

              <div
                data-testid="join-uploads-note"
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600"
              >
                Document uploads are used only for admin verification and are not
                publicly visible.
              </div>
            </div>
          ) : null}

          <div className="mt-6 flex items-center justify-between gap-3">
            <Button
              data-testid="join-back-button"
              variant="secondary"
              disabled={stepIndex === 0 || submitting}
              onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
              className="h-10 rounded-full bg-slate-100 text-slate-800 hover:bg-slate-200"
            >
              Back
            </Button>

            {stepIndex < steps.length - 1 ? (
              <Button
                data-testid="join-next-button"
                disabled={!canContinue() || submitting}
                onClick={() =>
                  setStepIndex((i) => Math.min(steps.length - 1, i + 1))
                }
                className="h-10 rounded-full bg-sky-700 px-6 text-white hover:bg-sky-800 disabled:opacity-50"
              >
                Continue
              </Button>
            ) : (
              <Button
                data-testid="join-submit-button"
                disabled={!canContinue() || submitting}
                onClick={submit}
                className="h-10 rounded-full bg-slate-900 px-6 text-white hover:bg-slate-800 disabled:opacity-50"
              >
                {submitting ? "Submitting…" : "Create account & submit"}
              </Button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
