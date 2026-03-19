"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
type Status = "loading" | "downloading" | "scanning" | "generating" | "packaging" | "completed" | "failed";

const statusMessages: Record<Status, string> = {
  loading: "Verifying payment...",
  downloading: "Downloading your repository...",
  scanning: "Scanning your code...",
  generating: "Generating documents (MD, HTML, DOCX, PDF)...",
  packaging: "Packaging your files...",
  completed: "Your documents are ready!",
  failed: "Something went wrong",
};

const steps: Status[] = ["downloading", "scanning", "generating", "packaging"];

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<Status>("loading");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [documentCount, setDocumentCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const hasStarted = useRef(false);
  const orderId = useRef<string>("");

  useEffect(() => {
    if (!sessionId || hasStarted.current) return;
    hasStarted.current = true;

    async function start() {
      try {
        // 1. Call API — creates order + fires Lambda async, returns immediately
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Generation failed");
        }

        orderId.current = data.orderId;
        setStatus(data.status || "downloading");

        // Poll our own API every 3 seconds for order status
        const poll = setInterval(async () => {
          try {
            const statusRes = await fetch(`/api/generate/status?id=${orderId.current}`);
            const row = await statusRes.json();
            if (row.status === "completed" && row.download_url) {
              setDownloadUrl(row.download_url);
              setDocumentCount(row.document_count || 0);
              setStatus("completed");
              clearInterval(poll);
            } else if (row.status === "failed") {
              setErrorMsg("Document generation failed. Your payment is safe — contact us for help.");
              setStatus("failed");
              clearInterval(poll);
            } else if (row.status) {
              setStatus(row.status as Status);
            }
          } catch {}
        }, 3000);

        // Cleanup after 10 minutes
        setTimeout(() => clearInterval(poll), 600000);

      } catch (err: unknown) {
        setErrorMsg(err instanceof Error ? err.message : "An error occurred");
        setStatus("failed");
      }
    }

    start();
  }, [sessionId]);

  if (!sessionId) {
    return (
      <section className="py-[var(--space-24)] px-[var(--space-6)]">
        <div className="max-w-[560px] mx-auto text-center">
          <h1 className="text-[length:var(--text-xl)] font-bold mb-[var(--space-4)]">
            Missing Session
          </h1>
          <p className="text-ink-secondary mb-[var(--space-8)]">
            No payment session found. Please start from the generate page.
          </p>
          <a
            href="/generate"
            className="inline-block py-[var(--space-3)] px-[var(--space-6)] rounded-lg text-[length:var(--text-sm)] font-medium bg-brand text-surface-primary hover:bg-brand-hover transition-colors"
          >
            Go to Generate
          </a>
        </div>
      </section>
    );
  }

  const isInProgress = status !== "completed" && status !== "failed";

  return (
    <section className="py-[var(--space-24)] px-[var(--space-6)]">
      <div className="max-w-[560px] mx-auto text-center">
        {/* Progress state */}
        {isInProgress && (
          <div className="mb-[var(--space-8)]">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-muted mb-[var(--space-6)]">
              <svg
                className="w-8 h-8 text-brand animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray="60"
                  strokeDashoffset="15"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h1 className="text-[length:var(--text-xl)] font-bold mb-[var(--space-3)]">
              {statusMessages[status]}
            </h1>
            <p className="text-ink-secondary text-[length:var(--text-sm)]">
              This typically takes 1-2 minutes. You can stay on this page — it updates in real time.
            </p>

            {/* Step indicators */}
            <div className="mt-[var(--space-8)] flex justify-center gap-[var(--space-4)]">
              {steps.map((step, i) => {
                const currentIdx = steps.indexOf(status as Status);
                const isDone = i < currentIdx;
                const isActive = i === currentIdx;

                return (
                  <div key={step} className="flex flex-col items-center gap-[var(--space-1)]">
                    <div
                      className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                        isDone
                          ? "bg-brand"
                          : isActive
                          ? "bg-brand animate-pulse"
                          : "bg-border-subtle"
                      }`}
                    />
                    <span
                      className={`text-[length:var(--text-xs)] ${
                        isDone || isActive ? "text-ink font-medium" : "text-ink-tertiary"
                      }`}
                    >
                      {step === "downloading"
                        ? "Download"
                        : step === "scanning"
                        ? "Scan"
                        : step === "generating"
                        ? "Generate"
                        : "Package"}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Progress bar */}
            <div className="mt-[var(--space-6)] mx-auto max-w-[320px]">
              <div className="h-1.5 rounded-full bg-surface-secondary overflow-hidden">
                <div
                  className="h-full rounded-full bg-brand transition-all duration-700 ease-out"
                  style={{
                    width: `${Math.max(5, ((steps.indexOf(status as Status) + 1) / steps.length) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Success state */}
        {status === "completed" && (
          <div>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-muted mb-[var(--space-6)]">
              <svg
                className="w-8 h-8 text-brand"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-[length:var(--text-xl)] font-bold mb-[var(--space-3)]">
              Your documents are ready!
            </h1>
            {documentCount > 0 && (
              <p className="text-ink-secondary text-[length:var(--text-sm)] mb-[var(--space-2)]">
                {documentCount} compliance documents generated in 4 formats (MD, HTML, DOCX, PDF).
              </p>
            )}
            <p className="text-ink-tertiary text-[length:var(--text-xs)] mb-[var(--space-8)]">
              Each document in its own folder with all 4 format versions.
            </p>

            <a
              href={downloadUrl}
              download
              className="inline-flex items-center gap-[var(--space-2)] py-[var(--space-4)] px-[var(--space-8)] rounded-lg text-[length:var(--text-base)] font-semibold bg-brand text-surface-primary hover:bg-brand-hover transition-colors"
              style={{ transitionTimingFunction: "var(--ease-out-quart)" }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download ZIP
            </a>

            <p className="text-[length:var(--text-xs)] text-ink-tertiary mt-[var(--space-4)]">
              Download link expires in 24 hours.
            </p>

            <div className="mt-[var(--space-12)] pt-[var(--space-8)] border-t border-border-subtle">
              <p className="text-[length:var(--text-sm)] text-ink-secondary mb-[var(--space-4)]">
                Need another set of documents?
              </p>
              <a
                href="/generate"
                className="inline-block py-[var(--space-3)] px-[var(--space-6)] rounded-lg text-[length:var(--text-sm)] font-medium border border-border-subtle hover:bg-surface-secondary transition-colors"
              >
                Generate More
              </a>
            </div>
          </div>
        )}

        {/* Error state */}
        {status === "failed" && (
          <div>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-urgency-muted mb-[var(--space-6)]">
              <svg
                className="w-8 h-8 text-urgency"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h1 className="text-[length:var(--text-xl)] font-bold mb-[var(--space-3)]">
              Generation Failed
            </h1>
            <p className="text-ink-secondary text-[length:var(--text-sm)] mb-[var(--space-2)]">
              {errorMsg || "An unexpected error occurred during document generation."}
            </p>
            <p className="text-[length:var(--text-xs)] text-ink-tertiary mb-[var(--space-8)]">
              Your payment is safe. Contact us and we will resolve this immediately.
            </p>
            <div className="flex justify-center gap-[var(--space-4)]">
              <a
                href="/contact"
                className="inline-block py-[var(--space-3)] px-[var(--space-6)] rounded-lg text-[length:var(--text-sm)] font-medium bg-brand text-surface-primary hover:bg-brand-hover transition-colors"
              >
                Contact Support
              </a>
              <button
                onClick={() => window.location.reload()}
                className="py-[var(--space-3)] px-[var(--space-6)] rounded-lg text-[length:var(--text-sm)] font-medium border border-border-subtle hover:bg-surface-secondary transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <section className="py-[var(--space-24)] px-[var(--space-6)]">
          <div className="max-w-[560px] mx-auto text-center">
            <p className="text-ink-secondary">Loading...</p>
          </div>
        </section>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
