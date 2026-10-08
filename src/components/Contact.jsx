import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Phone, Mail, MapPin, ArrowRight, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const API_URL =
  (typeof process !== "undefined" && process.env?.REACT_APP_BACKEND_URL
    ? `${process.env.REACT_APP_BACKEND_URL}/api`
    : (typeof import.meta !== "undefined" && import.meta.env?.VITE_BACKEND_URL
        ? `${import.meta.env.VITE_BACKEND_URL}/api`
        : "/api"));

const initial = {
  full_name: "",
  email: "",
  phone: "",
  country: "",
  company: "",
  message: "",
};

export default function Contact() {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);

  const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.message) {
      toast.error("Please share your name, email and a short message.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/contact`, form);
      toast.success(
        "Thank you for contacting Sara Official. We will get back to you shortly."
      );
      setForm(initial);
    } catch (err) {
      toast.error(
        err?.response?.data?.detail ||
          "Could not send message. Please try again in a moment."
      );
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { icon: User, label: "Owner", value: "Sara Scarlet", link: null, testid: "contact-owner" },
    {
      icon: Phone,
      label: "Phone",
      value: "+91 8432772521",
      link: "tel:+918432772521",
      testid: "contact-phone",
    },
    {
      icon: Mail,
      label: "Email",
      value: "sarascarlet@gmail.com",
      link: "mailto:sarascarlet@gmail.com",
      testid: "contact-email",
    },
    {
      icon: MapPin,
      label: "Office",
      value: "WNC Officers Mess Road, Navy Nagar, Colaba, Mumbai 400005",
      link: "https://www.google.com/maps?q=WNC+Officers+Mess+Road+Navy+Nagar+Colaba+Mumbai",
      testid: "contact-address",
    },
  ];

  return (
    <section
      id="contact"
      data-testid="contact-section"
      className="relative py-28 lg:py-40 bg-[#111111]"
    >
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-12 gap-8 mb-16 items-end">
          <div className="col-span-12 lg:col-span-8">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-8 h-[1px] bg-[#c8a96a]" />
              <span className="text-[10px] uppercase tracking-[0.4em] text-[#c8a96a]">
                Start a Conversation
              </span>
            </div>
            <h2 className="font-display text-4xl lg:text-7xl leading-[0.95] tracking-tight text-white">
              Let&apos;s build the
              <br />
              next <span className="italic text-[#c8a96a]">collection</span>.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 lg:gap-10">
          {/* Left: cards + map */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-3">
              {cards.map((c) => {
                const Icon = c.icon;
                const inner = (
                  <div
                    className="group flex items-start gap-5 p-5 lg:p-6 border border-[#c8a96a]/15 hover:border-[#c8a96a]/60 bg-[#171717] transition-colors"
                  >
                    <div className="shrink-0 w-11 h-11 rounded-full border border-[#c8a96a]/40 text-[#c8a96a] flex items-center justify-center group-hover:bg-[#c8a96a] group-hover:text-black transition-colors">
                      <Icon size={16} strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.35em] text-[#c8a96a] mb-1">
                        {c.label}
                      </div>
                      <div className="text-white/90 leading-snug">
                        {c.value}
                      </div>
                    </div>
                  </div>
                );
                return c.link ? (
                  <a
                    key={c.label}
                    data-testid={c.testid}
                    href={c.link}
                    target={c.link.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                  >
                    {inner}
                  </a>
                ) : (
                  <div key={c.label} data-testid={c.testid}>
                    {inner}
                  </div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative aspect-[4/3] w-full border border-[#c8a96a]/15 overflow-hidden bg-[#0e0e0e]"
            >
              <iframe
                data-testid="contact-map"
                title="Sara Official Office"
                src="https://www.google.com/maps?q=Navy+Nagar+Colaba+Mumbai+400005&output=embed"
                className="absolute inset-0 w-full h-full map-dark"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-[#c8a96a] bg-black/60 backdrop-blur px-3 py-2 border border-[#c8a96a]/30">
                <span>Mumbai · India · HQ</span>
                <span>19.0064° N · 72.8155° E</span>
              </div>
            </motion.div>
          </div>

          {/* Right: form */}
          <form
            data-testid="contact-form"
            onSubmit={onSubmit}
            className="col-span-12 lg:col-span-7 border border-[#c8a96a]/15 bg-[#171717] p-8 lg:p-12"
          >
            <div className="mb-8 text-[10px] uppercase tracking-[0.35em] text-[#c8a96a]">
              Enquiry form
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field
                label="Full name"
                value={form.full_name}
                onChange={onChange("full_name")}
                testid="input-full-name"
              />
              <Field
                label="Email"
                type="email"
                value={form.email}
                onChange={onChange("email")}
                testid="input-email"
              />
              <Field
                label="Phone"
                value={form.phone}
                onChange={onChange("phone")}
                testid="input-phone"
              />
              <Field
                label="Country"
                value={form.country}
                onChange={onChange("country")}
                testid="input-country"
              />
              <div className="md:col-span-2">
                <Field
                  label="Company"
                  value={form.company}
                  onChange={onChange("company")}
                  testid="input-company"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] uppercase tracking-[0.35em] text-white/50 mb-2">
                  Message *
                </label>
                <Textarea
                  data-testid="input-message"
                  value={form.message}
                  onChange={onChange("message")}
                  rows={5}
                  className="bg-transparent border-0 border-b border-white/15 rounded-none focus-visible:ring-0 focus-visible:border-[#c8a96a] text-white placeholder:text-white/30 text-base px-0"
                  placeholder="Tell us about your line, quantities, timelines…"
                />
              </div>
            </div>

            <div className="mt-10 flex items-center justify-between flex-wrap gap-6">
              <p className="text-xs text-white/40 max-w-sm">
                Your enquiry lands directly with the Sara Official team. Expect
                a reply within one business day.
              </p>
              <button
                type="submit"
                disabled={loading}
                data-testid="contact-submit"
                className="group inline-flex items-center gap-3 pl-6 pr-2 py-2 rounded-full bg-[#c8a96a] text-black text-[11px] uppercase tracking-[0.28em] hover:bg-white transition-colors disabled:opacity-60"
              >
                {loading ? "Sending…" : "Send Enquiry"}
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black text-[#c8a96a] group-hover:rotate-45 transition-transform">
                  <ArrowRight size={14} />
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({ label, value, onChange, type = "text", testid, required }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-[0.35em] text-white/50 mb-2">
        {label}
        {required && " *"}
      </label>
      <Input
        data-testid={testid}
        type={type}
        value={value}
        onChange={onChange}
        className="bg-transparent border-0 border-b border-white/15 rounded-none focus-visible:ring-0 focus-visible:border-[#c8a96a] text-white placeholder:text-white/30 text-base px-0 h-11"
      />
    </div>
  );
}
