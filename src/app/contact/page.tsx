"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

const companySizes = ["1-10", "11-50", "51-200", "200+"] as const;

const serviceTypes = [
  { value: "compliance-review", label: "Compliance Review", price: "$99" },
  { value: "custom-package", label: "Custom Package", price: "$299" },
  { value: "enterprise", label: "Enterprise Consultation", price: "Custom" },
  { value: "other", label: "Other", price: null },
] as const;

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    company_size: "",
    service_type: "compliance-review",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const { error } = await supabase.from("leads").insert({
      name: form.name,
      email: form.email,
      company: form.company || null,
      company_size: form.company_size || null,
      service_type: form.service_type,
      message: form.message,
      source_page: "/contact",
    });

    if (error) {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again or email hello@codepliant.site.");
      return;
    }

    setStatus("success");
  }

  if (status === "success") {
    return (
      <section className="py-[var(--space-24)] px-[var(--space-6)]">
        <div className="max-w-[640px] mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand/10 mb-[var(--space-6)]">
            <svg
              className="w-8 h-8 text-brand"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-[length:var(--text-2xl)] font-bold tracking-tight mb-[var(--space-4)]">
            Thank you!
          </h1>
          <p className="text-[length:var(--text-base)] text-ink-secondary mb-[var(--space-8)]">
            We received your message and will get back to you within one business day.
          </p>
          <a
            href="/"
            className="inline-block py-[var(--space-3)] px-[var(--space-6)] rounded-lg text-[length:var(--text-sm)] font-medium transition-colors duration-150 bg-brand text-surface-primary hover:bg-brand-hover"
            style={{ transitionTimingFunction: "var(--ease-out-quart)" }}
          >
            Back to home
          </a>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-[var(--space-24)] px-[var(--space-6)]">
        <div className="max-w-[640px] mx-auto">
          <div className="text-center mb-[var(--space-16)]">
            <h1 className="text-[length:var(--text-2xl)] font-bold tracking-tight mb-[var(--space-4)]">
              Get Compliance Help
            </h1>
            <p className="text-[length:var(--text-lg)] text-ink-secondary">
              Tell us about your project and compliance needs. We will get back to you within one business day.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-[var(--space-6)]">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-[length:var(--text-sm)] font-medium mb-[var(--space-2)]"
              >
                Name <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-border-subtle bg-surface-primary px-[var(--space-4)] py-[var(--space-3)] text-[length:var(--text-sm)] text-ink placeholder:text-ink-tertiary focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition-colors"
                placeholder="Your name"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-[length:var(--text-sm)] font-medium mb-[var(--space-2)]"
              >
                Email <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-border-subtle bg-surface-primary px-[var(--space-4)] py-[var(--space-3)] text-[length:var(--text-sm)] text-ink placeholder:text-ink-tertiary focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition-colors"
                placeholder="you@company.com"
              />
            </div>

            {/* Company + Company Size row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--space-4)]">
              <div>
                <label
                  htmlFor="company"
                  className="block text-[length:var(--text-sm)] font-medium mb-[var(--space-2)]"
                >
                  Company
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  value={form.company}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border-subtle bg-surface-primary px-[var(--space-4)] py-[var(--space-3)] text-[length:var(--text-sm)] text-ink placeholder:text-ink-tertiary focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition-colors"
                  placeholder="Company name"
                />
              </div>
              <div>
                <label
                  htmlFor="company_size"
                  className="block text-[length:var(--text-sm)] font-medium mb-[var(--space-2)]"
                >
                  Company size
                </label>
                <select
                  id="company_size"
                  name="company_size"
                  value={form.company_size}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border-subtle bg-surface-primary px-[var(--space-4)] py-[var(--space-3)] text-[length:var(--text-sm)] text-ink focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition-colors"
                >
                  <option value="">Select&hellip;</option>
                  {companySizes.map((size) => (
                    <option key={size} value={size}>
                      {size} employees
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Service Type */}
            <fieldset>
              <legend className="block text-[length:var(--text-sm)] font-medium mb-[var(--space-3)]">
                What do you need? <span className="text-red-500" aria-hidden="true">*</span>
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--space-3)]">
                {serviceTypes.map((service) => (
                  <label
                    key={service.value}
                    className={`flex items-center gap-[var(--space-3)] rounded-lg border px-[var(--space-4)] py-[var(--space-3)] cursor-pointer transition-colors ${
                      form.service_type === service.value
                        ? "border-brand bg-brand/5"
                        : "border-border-subtle hover:border-ink-tertiary"
                    }`}
                  >
                    <input
                      type="radio"
                      name="service_type"
                      value={service.value}
                      checked={form.service_type === service.value}
                      onChange={handleChange}
                      className="accent-brand"
                    />
                    <span className="flex-1">
                      <span className="block text-[length:var(--text-sm)] font-medium">
                        {service.label}
                      </span>
                      {service.price && (
                        <span className="block text-[length:var(--text-xs)] text-ink-tertiary">
                          {service.price}
                        </span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="block text-[length:var(--text-sm)] font-medium mb-[var(--space-2)]"
              >
                Message <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={form.message}
                onChange={handleChange}
                className="w-full rounded-lg border border-border-subtle bg-surface-primary px-[var(--space-4)] py-[var(--space-3)] text-[length:var(--text-sm)] text-ink placeholder:text-ink-tertiary focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition-colors resize-y"
                placeholder="Tell us about your project, compliance requirements, and timeline..."
              />
            </div>

            {/* Error message */}
            {status === "error" && (
              <div
                role="alert"
                className="rounded-lg border border-red-300 bg-red-50 px-[var(--space-4)] py-[var(--space-3)] text-[length:var(--text-sm)] text-red-700"
              >
                {errorMessage}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full py-[var(--space-3)] rounded-lg text-[length:var(--text-sm)] font-medium transition-colors duration-150 bg-brand text-surface-primary hover:bg-brand-hover disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ transitionTimingFunction: "var(--ease-out-quart)" }}
            >
              {status === "submitting" ? "Sending..." : "Send message"}
            </button>

            <p className="text-[length:var(--text-xs)] text-ink-tertiary text-center">
              We will respond within one business day. You can also email us at{" "}
              <a href="mailto:hello@codepliant.site" className="text-brand hover:text-brand-hover">
                hello@codepliant.site
              </a>
            </p>
          </form>
        </div>
      </section>
    </>
  );
}
