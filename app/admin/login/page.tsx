"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "../../../components/LanguageContext";

export default function AdminLoginPage() {
  const { t } = useTranslation();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      if (!res.ok) {
        setError(t("admin.invalidPassword"));
      } else {
        router.push("/admin/products");
      }
    } catch {
      setError(t("admin.genericError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page admin-login-page">
      <form className="admin-login-form" onSubmit={handleSubmit}>
        <h1>{t("admin.loginTitle")}</h1>
        <p className="admin-login-subtitle">{t("admin.loginSubtitle")}</p>
        <label className="field">
          <span>{t("admin.passwordLabel")}</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn-primary full" disabled={loading}>
          {loading ? t("admin.loggingIn") : t("admin.loginButton")}
        </button>
      </form>
    </div>
  );
}

