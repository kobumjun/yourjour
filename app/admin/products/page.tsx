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

type ProductImage = {
  id: number;
  product_id: number;
  image_url: string;
  is_cover: boolean;
  sort_order: number | null;
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
  const [existingImages, setExistingImages] = useState<
    Record<number, ProductImage[]>
  >({});
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    fetchProductsAndImages();
  }, []);

  async function fetchProductsAndImages() {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) return;
    const [{ data: productData, error: productError }, { data: imageData }] =
      await Promise.all([
        supabase
          .from("products")
          .select("*")
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: false }),
        supabase
          .from("product_images")
          .select("*")
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: true })
      ]);

    if (!productError && productData) {
      console.log("Fetched products for admin", {
        count: productData.length
      });
      setProducts(productData as Product[]);
    }
    if (imageData) {
      const grouped: Record<number, ProductImage[]> = {};
      (imageData as ProductImage[]).forEach((img) => {
        if (!grouped[img.product_id]) grouped[img.product_id] = [];
        grouped[img.product_id].push(img);
      });
      console.log("Fetched product_images for admin", {
        total: imageData.length
      });
      setExistingImages(grouped);
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

      const supabase = createBrowserSupabaseClient();
      if (!supabase) {
        setMessage(t("admin.saveError"));
        setLoading(false);
        return;
      }

      let coverUrl: string | null = null;
      const uploadedUrls: string[] = [];

      if (selectedFiles.length > 0) {
        for (let index = 0; index < selectedFiles.length; index++) {
          const file = selectedFiles[index];
          const fileExt = file.name.split(".").pop() ?? "jpg";
          const fileName = `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}.${fileExt}`;
          const filePath = `products/${fileName}`;
          const { error: uploadError } = await supabase.storage
            .from("product_images")
            .upload(filePath, file);
          if (!uploadError) {
            const {
              data: { publicUrl }
            } = supabase.storage.from("product_images").getPublicUrl(filePath);
            // Temporary logging to inspect upload/public URL
            console.log("Uploaded product image", {
              filePath,
              publicUrl
            });
            uploadedUrls.push(publicUrl);
            if (coverUrl === null) {
              coverUrl = publicUrl;
            }
          } else {
            console.error("Failed to upload product image", {
              filePath,
              error: uploadError.message
            });
          }
        }
      }

      if (coverUrl) {
        payload.hero_image_url = coverUrl;
      }

      const res = await fetch(
        editingId ? `/api/products/${editingId}` : "/api/products",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, uploadedImages: uploadedUrls })
        }
      );
      if (!res.ok) {
        setMessage(t("admin.saveError"));
      } else {
        setMessage(t("admin.saveSuccess"));
        setForm(emptyForm);
        setEditingId(null);
        setSelectedFiles([]);
        fetchProductsAndImages();
      }
    } catch {
      setMessage(t("admin.saveError"));
    } finally {
      setLoading(false);
    }
  }

  async function handleEdit(p: Product) {
    setEditingId(p.id);
    setSelectedFiles([]);
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
        fetchProductsAndImages();
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
            <span>Product images</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) =>
                setSelectedFiles(e.target.files ? Array.from(e.target.files) : [])
              }
            />
          </label>
          {selectedFiles.length > 0 && (
            <div className="admin-image-previews">
              {selectedFiles.map((file) => (
                <div key={file.name} className="admin-image-preview">
                  <img src={URL.createObjectURL(file)} alt={file.name} />
                </div>
              ))}
            </div>
          )}
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
          {products.map((p) => {
            const imgs = existingImages[p.id] ?? [];
            const cover =
              imgs.find((img) => img.is_cover) ?? imgs[0] ?? null;
            return (
              <div key={p.id} className="admin-product-row">
                <div className="admin-product-main">
                  <div className="thumb">
                    <div
                      className="thumb-inner"
                      style={
                        cover
                          ? { backgroundImage: `url(${cover.image_url})` }
                          : p.hero_image_url
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
                        {p.is_visible
                          ? t("admin.visibleYes")
                          : t("admin.visibleNo")}
                      </span>
                      <span>
                        {t("admin.sortOrderLabel")}: {p.sort_order ?? 0}
                      </span>
                    </div>
                    {imgs.length > 0 && (
                      <div className="admin-product-meta">
                        <span>{imgs.length} image(s)</span>
                      </div>
                    )}
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
            );
          })}
          {products.length === 0 && (
            <p className="empty-text">{t("admin.noProducts")}</p>
          )}
        </div>
      </section>
    </div>
  );
}

