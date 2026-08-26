"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAdminToast } from "@/app/admin/layout";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  estimatedDelivery: string;
  images: string; // JSON string
  isCustomizable: boolean;
  customFieldPlaceholder: string | null;
  active: boolean;
  categoryId: number;
}

function CreateProductFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const { showToast } = useAdminToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [estimatedDelivery, setEstimatedDelivery] = useState("24h à 48h");
  const [imagesInput, setImagesInput] = useState(""); // Comma separated list of URLs
  const [isCustomizable, setIsCustomizable] = useState(false);
  const [customFieldPlaceholder, setCustomFieldPlaceholder] = useState("Texte à inscrire");
  const [active, setActive] = useState(true);
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      // Fetch categories
      const resCats = await fetch("/api/admin/categories");
      let cats: Category[] = [];
      if (resCats.ok) {
        const dataCats = await resCats.json();
        cats = dataCats.categories || [];
        setCategories(cats);
        if (cats.length > 0) {
          setCategoryId(cats[0].id.toString());
        }
      }

      // If in edit mode, fetch the products list and find the product
      if (editId) {
        const resProds = await fetch("/api/admin/products");
        if (resProds.ok) {
          const dataProds = await resProds.json();
          const productsList: Product[] = dataProds.products || [];
          const product = productsList.find((p) => p.id === parseInt(editId, 10));
          if (product) {
            let urls: string[] = [];
            try {
              urls = typeof product.images === "string" ? JSON.parse(product.images) : product.images;
            } catch {
              urls = [product.images as unknown as string];
            }

            setName(product.name);
            setSlug(product.slug);
            setDescription(product.description || "");
            setPrice(product.price.toString());
            setStock(product.stock.toString());
            setEstimatedDelivery(product.estimatedDelivery || "");
            setImagesInput(urls.join(", "));
            setIsCustomizable(product.isCustomizable);
            setCustomFieldPlaceholder(product.customFieldPlaceholder || "");
            setActive(product.active);
            setCategoryId(product.categoryId.toString());
          } else {
            showToast("Produit introuvable.", "error");
            router.push("/admin/produits");
          }
        }
      }
    } catch (e) {
      console.error(e);
      showToast("Erreur de chargement des données.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSlugify = (text: string) => {
    setName(text);
    setSlug(
      text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // remove accents
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
    );
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setImagesInput((prev) => (prev ? `${prev}, ${data.url}` : data.url));
        showToast("Image transférée avec succès.", "success");
      } else {
        showToast(data.error || "Erreur lors du transfert.", "error");
      }
    } catch (err) {
      showToast("Erreur réseau.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const urlsArray = imagesInput
      .split(",")
      .map((u) => u.trim())
      .filter(Boolean);

    const payload = {
      id: editId ? parseInt(editId, 10) : undefined,
      name,
      slug,
      description,
      price: parseInt(price, 10),
      stock: parseInt(stock, 10),
      estimatedDelivery,
      images: urlsArray,
      isCustomizable,
      customFieldPlaceholder: isCustomizable ? customFieldPlaceholder : null,
      active,
      categoryId: parseInt(categoryId, 10),
    };

    const method = editId ? "PUT" : "POST";

    try {
      const res = await fetch("/api/admin/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast(
          editId ? "Produit modifié avec succès." : "Produit créé avec succès.",
          "success"
        );
        router.push("/admin/produits");
        router.refresh();
      } else {
        const data = await res.json();
        showToast(data.error || "Une erreur est survenue.", "error");
      }
    } catch (err) {
      showToast("Erreur réseau.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center py-10" style={{ minHeight: "60vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* HEADER ROW */}
      <div className="row">
        <div className="col-12">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
            <div>
              <h1 className="fs-3 mb-1 text-dark">
                {editId ? "Modifier le Produit" : "Ajouter au Catalogue"}
              </h1>
              <p className="mb-0 text-secondary">
                {editId ? "Modifiez les informations de ce produit" : "Ajoutez un nouvel article dans le catalogue"}
              </p>
            </div>
            <div>
              <Link href="/admin/produits" className="btn btn-outline-secondary">
                ← Retour à l&apos;inventaire
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* FORM CARD */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  {/* Name */}
                  <div className="col-12 col-md-6 mb-3">
                    <label htmlFor="productName" className="form-label text-dark fw-medium">
                      Nom du Produit *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="productName"
                      placeholder="Entrez le nom du produit"
                      required
                      value={name}
                      onChange={(e) => handleSlugify(e.target.value)}
                    />
                  </div>

                  {/* Category select */}
                  <div className="col-12 col-md-6 mb-3">
                    <label htmlFor="productCategory" className="form-label text-dark fw-medium">
                      Catégorie *
                    </label>
                    <select
                      className="form-select"
                      id="productCategory"
                      required
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Slug */}
                  <div className="col-12 col-md-6 mb-3">
                    <label htmlFor="productSlug" className="form-label text-dark fw-medium">
                      Slug Unique (URL) *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="productSlug"
                      placeholder="nom-du-produit"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                    />
                  </div>

                  {/* Price */}
                  <div className="col-12 col-md-6 mb-3">
                    <label htmlFor="productPrice" className="form-label text-dark fw-medium">
                      Prix (FCFA) *
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="productPrice"
                      placeholder="0"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>

                  {/* Stock */}
                  <div className="col-12 col-md-6 mb-3">
                    <label htmlFor="productStock" className="form-label text-dark fw-medium">
                      Quantité en Stock *
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="productStock"
                      placeholder="0"
                      required
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                    />
                  </div>

                  {/* Delivery delay */}
                  <div className="col-12 col-md-6 mb-3">
                    <label htmlFor="productDelivery" className="form-label text-dark fw-medium">
                      Délai de Livraison Estimé *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="productDelivery"
                      placeholder="24h à 48h"
                      required
                      value={estimatedDelivery}
                      onChange={(e) => setEstimatedDelivery(e.target.value)}
                    />
                  </div>

                  {/* Product Images (Left Column) */}
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label text-dark fw-medium">
                      Images du Produit
                    </label>
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      className={`border border-2 border-dashed rounded-3 p-4 text-center cursor-pointer mb-3 transition-all d-flex flex-column align-items-center justify-content-center ${
                        isDragging ? "border-primary bg-primary bg-opacity-10" : "border-secondary bg-light"
                      }`}
                      style={{ minHeight: "150px" }}
                      onClick={() => document.getElementById("fileInput")?.click()}
                    >
                      {uploading ? (
                        <div className="d-flex flex-column align-items-center">
                          <div className="spinner-border text-primary spinner-border-sm mb-2" role="status"></div>
                          <span className="text-secondary small">Transfert de l&apos;image...</span>
                        </div>
                      ) : (
                        <div className="d-flex flex-column align-items-center">
                          <i className="ti ti-photo-plus fs-2 text-secondary mb-2"></i>
                          <span className="text-dark fw-semibold small">Glissez-déposez une image ici</span>
                          <span className="text-secondary text-xs mt-1">ou cliquez pour parcourir les fichiers</span>
                        </div>
                      )}
                      <input
                        type="file"
                        id="fileInput"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="d-none"
                      />
                    </div>

                    <div className="mb-2">
                      <label htmlFor="productImages" className="form-label text-secondary small fw-medium mb-1">
                        Ou collez des URLs d&apos;images (séparées par virgule)
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="productImages"
                        placeholder="http://img1.jpg, http://img2.jpg"
                        value={imagesInput}
                        onChange={(e) => setImagesInput(e.target.value)}
                      />
                    </div>

                    {/* Visual image preview gallery */}
                    {imagesInput.split(",").map((url) => url.trim()).filter(Boolean).length > 0 && (
                      <div className="d-flex flex-wrap gap-2 mt-2 p-2 bg-light rounded border border-light">
                        {imagesInput.split(",").map((url) => url.trim()).filter(Boolean).map((url, idx) => (
                          <div key={idx} className="position-relative border rounded bg-white p-1" style={{ width: "60px", height: "60px" }}>
                            <img
                              src={url}
                              alt={`Aperçu ${idx + 1}`}
                              className="rounded"
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const urlsArray = imagesInput.split(",").map((u) => u.trim()).filter(Boolean);
                                const newUrls = urlsArray.filter((_, i) => i !== idx);
                                setImagesInput(newUrls.join(", "));
                              }}
                              className="btn btn-danger btn-sm p-0 d-flex align-items-center justify-content-center position-absolute shadow"
                              style={{
                                width: "18px",
                                height: "18px",
                                top: "-6px",
                                right: "-6px",
                                borderRadius: "50%",
                                fontSize: "10px",
                                border: "1px solid white",
                                fontWeight: "bold"
                              }}
                              title="Supprimer l'image"
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Description (Right Column) */}
                  <div className="col-12 col-md-6 mb-3">
                    <div className="h-100 d-flex flex-column">
                      <label htmlFor="productDescription" className="form-label text-dark fw-medium">
                        Description
                      </label>
                      <textarea
                        className="form-control flex-grow-1"
                        id="productDescription"
                        placeholder="Entrez la description complète du produit..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{ minHeight: "220px", height: "calc(100% - 30px)" }}
                      ></textarea>
                    </div>
                  </div>

                  {/* Customizable Checkbox */}
                  <div className="col-12 mb-3">
                    <div className="p-3 bg-light rounded border border-light">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="productCustomizable"
                          checked={isCustomizable}
                          onChange={(e) => setIsCustomizable(e.target.checked)}
                        />
                        <label className="form-check-label text-dark fw-bold" htmlFor="productCustomizable">
                          Produit personnalisable par le client (champs texte personnalisé)
                        </label>
                      </div>
                      {isCustomizable && (
                        <div className="mt-2">
                          <label htmlFor="productPlaceholder" className="form-label small text-secondary">
                            Indications / placeholder du texte (ex: Prénom à graver)
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="productPlaceholder"
                            value={customFieldPlaceholder}
                            onChange={(e) => setCustomFieldPlaceholder(e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Active Checkbox */}
                  <div className="col-12 mb-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="productActive"
                        checked={active}
                        onChange={(e) => setActive(e.target.checked)}
                      />
                      <label className="form-check-label text-secondary" htmlFor="productActive">
                        Rendre ce produit visible immédiatement dans le catalogue public
                      </label>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? (
                      <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                    ) : null}
                    {editId ? "Enregistrer les modifications" : "Ajouter le produit"}
                  </button>
                  <Link href="/admin/produits" className="btn btn-secondary">
                    Annuler
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function CreateProductPage() {
  return (
    <Suspense
      fallback={
        <div className="d-flex align-items-center justify-content-center py-10" style={{ minHeight: "60vh" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      }
    >
      <CreateProductFormInner />
    </Suspense>
  );
}
