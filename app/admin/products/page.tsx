"use client";

import { FormEvent, useEffect, useState } from "react";
import { useTranslation } from "../../../components/LanguageContext";
import { createBrowserSupabaseClient } from "../../../lib/supabaseClient";

type Product = {
  id: number;
  title: string;
  slug: string;
  description: string;
  price_text: string | null;
  is_visible: boolean;
  sort_order: number | null;
  hero_image_url: string | null;
};

const emptyForm: Omit<Product, "id"> = {
  title: "",
  slug: "",
  description: "",
  price_text: "",
  is_visible: true,
  sort_order: 0,
  hero_image_url: ""
};

export default function AdminProductsPage() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<Omit<Product, "id">>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) return;
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (!error && data) {
      setProducts(data as Product[]);
    }
  }

  function handleChange(
    field: keyof Omit<Product, "id">,
    value: string | boolean | number | null
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const payload = { ...form };
      const res = await fetch(
        editingId ? `/api/products/${editingId}` : "/api/products",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );
      if (!res.ok) {
        setMessage(t("admin.saveError"));
      } else {
        setMessage(t("admin.saveSuccess"));
        setForm(emptyForm);
        setEditingId(null);
        fetchProducts();
      }
    } catch {
      setMessage(t("admin.saveError"));
    } finally {
      setLoading(false);
    }
  }

  async function handleEdit(p: Product) {
    setEditingId(p.id);
    setForm({
      title: p.title,
      slug: p.slug,
      description: p.description,
      price_text: p.price_text ?? "",
      is_visible: p.is_visible,
      sort_order: p.sort_order ?? 0,
      hero_image_url: p.hero_image_url ?? ""
    });
  }

  async function handleDelete(id: number) {
    if (!confirm(t("admin.deleteConfirm"))) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) {
        setMessage(t("admin.deleteError"));
      } else {
        setMessage(t("admin.deleteSuccess"));
        fetchProducts();
      }
    } catch {
      setMessage(t("admin.deleteError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page admin-products-page">
      <header className="page-header">
        <h1>{t("admin.productsTitle")}</h1>
        <p>{t("admin.productsSubtitle")}</p>
      </header>

      <section className="admin-form-section">
        <form className="admin-product-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label className="field">
              <span>{t("admin.fieldTitle")}</span>
              <input
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
              />
            </label>
            <label className="field">
              <span>{t("admin.fieldSlug")}</span>
              <input
                value={form.slug}
                onChange={(e) => handleChange("slug", e.target.value)}
                required
              />
            </label>
          </div>
          <label className="field">
            <span>{t("admin.fieldDescription")}</span>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </label>
          <div className="form-row">
            <label className="field">
              <span>{t("admin.fieldPrice")}</span>
              <input
                value={form.price_text ?? ""}
                onChange={(e) => handleChange("price_text", e.target.value)}
              />
            </label>
            <label className="field">
              <span>{t("admin.fieldSortOrder")}</span>
              <input
                type="number"
                value={form.sort_order ?? 0}
                onChange={(e) =>
                  handleChange("sort_order", Number(e.target.value))
                }
              />
            </label>
          </div>
          <label className="field">
            <span>{t("admin.fieldHeroImageUrl")}</span>
            <input
              value={form.hero_image_url ?? ""}
              onChange={(e) => handleChange("hero_image_url", e.target.value)}
            />
          </label>
          <label className="checkbox-field">
            <input
              type="checkbox"
              checked={form.is_visible}
              onChange={(e) => handleChange("is_visible", e.target.checked)}
            />
            <span>{t("admin.fieldVisible")}</span>
          </label>

          {message && <p className="form-message">{message}</p>}

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {editingId
                ? t("admin.updateProductButton")
                : t("admin.createProductButton")}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                }}
              >
                {t("admin.cancelEdit")}
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="admin-products-list">
        <h2>{t("admin.existingProducts")}</h2>
        <div className="admin-products-table">
          {products.map((p) => (
            <div key={p.id} className="admin-product-row">
              <div className="admin-product-main">
                <div className="thumb">
                  <div
                    className="thumb-inner"
                    style={
                      p.hero_image_url
                        ? { backgroundImage: `url(${p.hero_image_url})` }
                        : undefined
                    }
                  />
                </div>
                <div>
                  <div className="admin-product-title">{p.title}</div>
                  <div className="admin-product-meta">
                    <span>{p.slug}</span>
                    <span>
                      {t("admin.visibleLabel")}:{" "}
                      {p.is_visible ? t("admin.visibleYes") : t("admin.visibleNo")}
                    </span>
                    <span>
                      {t("admin.sortOrderLabel")}: {p.sort_order ?? 0}
                    </span>
                  </div>
                </div>
              </div>
              <div className="admin-product-actions">
                <button
                  type="button"
                  className="btn-outline small"
                  onClick={() => handleEdit(p)}
                >
                  {t("admin.edit")}
                </button>
                <button
                  type="button"
                  className="btn-text small"
                  onClick={() => handleDelete(p.id)}
                >
                  {t("admin.delete")}
                </button>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <p className="empty-text">{t("admin.noProducts")}</p>
          )}
        </div>
      </section>
    </div>
  );
}

