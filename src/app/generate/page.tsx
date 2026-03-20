"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Status = "idle" | "downloading" | "scanning" | "packaging" | "completed" | "failed";

const steps: Status[] = ["downloading", "scanning", "packaging"];
const statusMessages: Record<Status, string> = {
  idle: "",
  downloading: "Downloading your repository...",
  scanning: "Scanning code & generating documents...",
  packaging: "Packaging MD, HTML, DOCX, PDF...",
  completed: "Your documents are ready!",
  failed: "Something went wrong",
};

export default function GeneratePage() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [repoUrl, setRepoUrl] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [orderId, setOrderId] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [documentCount, setDocumentCount] = useState(0);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "INITIAL_SESSION") {
        if (session?.user?.email) {
          setUser({ email: session.user.email });
        }
        setLoading(false);

        // If ?order=xxx in URL, resume tracking that order
        const params = new URLSearchParams(window.location.search);
        const existingOrder = params.get("order");
        if (existingOrder) {
          setOrderId(existingOrder);
          setStatus("downloading"); // will be updated by polling
        }
      }
    });
    return () => { subscription.unsubscribe(); };
  }, []);

  // Poll for order status
  useEffect(() => {
    if (!orderId || status === "completed" || status === "failed") return;
    const poll = setInterval(async () => {
      try {
        const res = await fetch(`/api/generate/status?id=${orderId}`);
        const row = await res.json();
        if (row.status === "completed" && row.download_url) {
          setDownloadUrl(row.download_url);
          setDocumentCount(row.document_count || 0);
          setStatus("completed");
          clearInterval(poll);
        } else if (row.status === "failed") {
          setError("Document generation failed. Your credits are safe — contact us for help.");
          setStatus("failed");
          clearInterval(poll);
        } else if (row.status) {
          setStatus(row.status as Status);
        }
      } catch {}
    }, 3000);
    return () => clearInterval(poll);
  }, [orderId, status]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setError("");
    setSubmitting(true);

    try {
      // Validate GitHub URL and check if repo is public
      const match = repoUrl.match(/github\.com\/([^/]+\/[^/]+)/);
      if (!match) {
        throw new Error("Please enter a valid GitHub repository URL (e.g., https://github.com/org/repo)");
      }
      const slug = match[1].replace(/\.git$/, "");
      const ghRes = await fetch(`https://api.github.com/repos/${slug}`, {
        headers: { "Accept": "application/vnd.github.v3+json" },
      });
      if (ghRes.status === 404) {
        throw new Error("Repository not found. Please check the URL and make sure the repo exists.");
      }
      if (ghRes.status === 403) {
        throw new Error("GitHub rate limit reached. Please wait a moment and try again.");
      }
      if (ghRes.ok) {
        const ghData = await ghRes.json();
        if (ghData.private) {
          throw new Error("Private repositories are not supported yet. Please use a public GitHub repository.");
        }
      }

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl, companyName, email: user.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setOrderId(data.orderId);
      setStatus("downloading");
      window.history.pushState({}, "", `/generate?order=${data.orderId}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setStatus("failed");
    } finally {
      setSubmitting(false);
    }
  }

  const isGenerating = status !== "idle" && status !== "completed" && status !== "failed";
  const inputClass = "w-full px-[var(--space-4)] py-[var(--space-3)] rounded-lg bg-surface-secondary border border-border-subtle text-ink text-[length:var(--text-sm)] placeholder:text-ink-tertiary focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent";

  if (loading) {
    return (
      <section className="py-[var(--space-24)] px-[var(--space-6)]">
        <div className="max-w-[520px] mx-auto text-center text-ink-secondary">Loading...</div>
      </section>
    );
  }

  return (
    <section className="py-[var(--space-24)] px-[var(--space-6)]">
      <div className="max-w-[520px] mx-auto">
        <h1 className="text-[length:var(--text-xl)] font-bold tracking-tight mb-[var(--space-2)]">
          Generate Compliance Documents
        </h1>
        <p className="text-ink-secondary text-[length:var(--text-sm)] mb-[var(--space-8)]">
          Paste a GitHub repository URL. We&apos;ll scan the code and generate all documents in MD, HTML, DOCX, and PDF.
        </p>

        {!user && (
          <div className="p-[var(--space-4)] rounded-lg border border-border-subtle bg-surface-secondary mb-[var(--space-6)]">
            <p className="text-[length:var(--text-sm)] text-ink-secondary mb-[var(--space-3)]">
              Sign in to generate documents. You need an active subscription.
            </p>
            <a href="/login?redirect=/generate" className="inline-block py-[var(--space-2)] px-[var(--space-4)] rounded-lg text-[length:var(--text-sm)] font-medium bg-brand text-surface-primary hover:bg-brand-hover transition-colors">
              Sign In
            </a>
          </div>
        )}

        {/* Form */}
        {user && status === "idle" && (
          <form onSubmit={handleSubmit} className="space-y-[var(--space-5)]">
            <div>
              <label htmlFor="repoUrl" className="block text-[length:var(--text-sm)] font-medium mb-[var(--space-2)]">
                GitHub Repository URL <span className="text-urgency">*</span>
              </label>
              <input id="repoUrl" type="url" required placeholder="https://github.com/your-org/your-repo"
                value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label htmlFor="companyName" className="block text-[length:var(--text-sm)] font-medium mb-[var(--space-2)]">
                Company Name <span className="text-ink-tertiary font-normal">(optional)</span>
              </label>
              <input id="companyName" type="text" placeholder="Acme Inc"
                value={companyName} onChange={(e) => setCompanyName(e.target.value)} className={inputClass} />
              <p className="text-[length:var(--text-xs)] text-ink-tertiary mt-[var(--space-1)]">Injected into all generated documents</p>
            </div>

            {error && (
              <div className="rounded-lg bg-urgency-muted border border-urgency/20 p-[var(--space-3)] text-[length:var(--text-sm)] text-urgency">{error}</div>
            )}

            <button type="submit" disabled={submitting}
              className="w-full py-[var(--space-3)] rounded-lg text-[length:var(--text-sm)] font-semibold bg-brand text-surface-primary hover:bg-brand-hover transition-colors disabled:opacity-60">
              {submitting ? "Starting..." : "Generate Documents"}
            </button>
            <p className="text-[length:var(--text-xs)] text-ink-tertiary text-center">Uses 1 credit from your subscription.</p>
          </form>
        )}

        {/* Progress */}
        {isGenerating && (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-muted mb-[var(--space-6)]">
              <svg className="w-8 h-8 text-brand animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="15" strokeLinecap="round" />
              </svg>
            </div>
            <h2 className="text-[length:var(--text-lg)] font-bold mb-[var(--space-3)]">{statusMessages[status]}</h2>
            <p className="text-ink-secondary text-[length:var(--text-sm)] mb-[var(--space-8)]">
              This typically takes 1-2 minutes. This page updates in real time.
            </p>
            <div className="flex justify-center gap-[var(--space-4)] mb-[var(--space-6)]">
              {steps.map((step, i) => {
                const currentIdx = steps.indexOf(status as Status);
                return (
                  <div key={step} className="flex flex-col items-center gap-[var(--space-1)]">
                    <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${i < currentIdx ? "bg-brand" : i === currentIdx ? "bg-brand animate-pulse" : "bg-border-subtle"}`} />
                    <span className={`text-[length:var(--text-xs)] ${i <= currentIdx ? "text-ink font-medium" : "text-ink-tertiary"}`}>
                      {step === "downloading" ? "Download" : step === "scanning" ? "Generate" : "Package"}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mx-auto max-w-[320px]">
              <div className="h-1.5 rounded-full bg-surface-secondary overflow-hidden">
                <div className="h-full rounded-full bg-brand transition-all duration-700 ease-out"
                  style={{ width: `${Math.max(10, ((steps.indexOf(status as Status) + 1) / steps.length) * 100)}%` }} />
              </div>
            </div>
          </div>
        )}

        {/* Completed */}
        {status === "completed" && (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-muted mb-[var(--space-6)]">
              <svg className="w-8 h-8 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-[length:var(--text-xl)] font-bold mb-[var(--space-3)]">Your documents are ready!</h2>
            {documentCount > 0 && (
              <p className="text-ink-secondary text-[length:var(--text-sm)] mb-[var(--space-2)]">
                {documentCount} documents in 4 formats (MD, HTML, DOCX, PDF).
              </p>
            )}
            <a href={downloadUrl} download
              className="inline-flex items-center gap-[var(--space-2)] mt-[var(--space-6)] py-[var(--space-4)] px-[var(--space-8)] rounded-lg text-[length:var(--text-base)] font-semibold bg-brand text-surface-primary hover:bg-brand-hover transition-colors">
              Download ZIP
            </a>
            <p className="text-[length:var(--text-xs)] text-ink-tertiary mt-[var(--space-4)]">Link expires in 24 hours.</p>
            <div className="mt-[var(--space-8)]">
              <button onClick={() => { setStatus("idle"); setOrderId(""); setDownloadUrl(""); setError(""); }}
                className="py-[var(--space-2)] px-[var(--space-4)] rounded-lg text-[length:var(--text-sm)] font-medium border border-border-subtle hover:bg-surface-secondary transition-colors">
                Generate Another
              </button>
            </div>
          </div>
        )}

        {/* Failed */}
        {status === "failed" && (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-urgency-muted mb-[var(--space-6)]">
              <svg className="w-8 h-8 text-urgency" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-[length:var(--text-xl)] font-bold mb-[var(--space-3)]">Generation Failed</h2>
            <p className="text-ink-secondary text-[length:var(--text-sm)] mb-[var(--space-8)]">{error || "An unexpected error occurred."}</p>
            <div className="flex justify-center gap-[var(--space-4)]">
              <a href="/contact" className="py-[var(--space-3)] px-[var(--space-6)] rounded-lg text-[length:var(--text-sm)] font-medium bg-brand text-surface-primary hover:bg-brand-hover transition-colors">Contact Support</a>
              <button onClick={() => { setStatus("idle"); setError(""); }}
                className="py-[var(--space-3)] px-[var(--space-6)] rounded-lg text-[length:var(--text-sm)] font-medium border border-border-subtle hover:bg-surface-secondary transition-colors">Try Again</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
