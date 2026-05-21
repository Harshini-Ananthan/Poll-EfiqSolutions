"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Loader2, Plus, Trash2, Tag } from "lucide-react";

const DEFAULT_CATEGORIES = ["Breakfast", "Lunch", "Dinner", "Snacks", "Beverages"];

export default function CategoriesPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [original, setOriginal] = useState<string[]>([]);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await api.get("/organizations/profile");
        const cats = data.categories && Array.isArray(data.categories) && data.categories.length > 0
          ? data.categories
          : DEFAULT_CATEGORIES;
        setCategories(cats);
        setOriginal(cats);
      } catch (err) {
        console.error("Failed to fetch profile", err);
        setCategories(DEFAULT_CATEGORIES);
        setOriginal(DEFAULT_CATEGORIES);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleAddCategory = () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    if (categories.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      alert("Category already exists.");
      return;
    }
    setCategories([...categories, trimmed]);
    setNewCategory("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCategory();
    }
  };

  const handleRemoveCategory = (indexToRemove: number) => {
    setCategories(categories.filter((_, idx) => idx !== indexToRemove));
  };

  const handleDiscard = () => {
    setCategories(original);
  };

  const handleSave = async () => {
    if (categories.length === 0) {
      alert("Please add at least one category.");
      return;
    }
    setSaving(true);
    try {
      await api.patch("/organizations/profile", { categories });
      setOriginal(categories);
      alert("Categories updated successfully!");
    } catch (err) {
      console.error("Failed to save categories", err);
      alert("Failed to save category settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-[400px]"><Loader2 className="animate-spin text-orange-500" /></div>;

  return (
    <div className="max-w-3xl">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-white mb-2">Categories</h1>
        <p className="text-gray-400 text-sm">Create and manage categories for your polls (e.g. Breakfast, Lunch, Dinner, Custom meals).</p>
      </div>

      {/* Category List & Add Input */}
      <section className="bg-[#242424]/50 border border-[#333]/50 rounded-xl p-6 mb-10">
        <h3 className="text-sm font-semibold text-white mb-1">Add new category</h3>
        <p className="text-xs text-gray-500 mb-5">These categories are dynamic and will define your polls and invoice exports.</p>
        
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ex: Snacks, Beverages, Custom..."
            className="flex-1 bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500/50 transition-colors placeholder-gray-600 text-white font-medium"
          />
          <button
            type="button"
            onClick={handleAddCategory}
            className="px-4 py-2.5 bg-[#333] hover:bg-[#444] text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus size={16} /> Add
          </button>
        </div>

        <h3 className="text-sm font-semibold text-white mb-3">Current categories</h3>
        <div className="space-y-2">
          {categories.map((cat, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3.5 bg-[#1a1a1a]/50 border border-[#333]/30 hover:border-[#333] rounded-lg group transition-all"
            >
              <div className="flex items-center gap-3">
                <Tag size={16} className="text-orange-500" />
                <span className="text-sm font-medium text-white">{cat}</span>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveCategory(index)}
                className="text-gray-500 hover:text-red-500 p-1 transition-colors rounded-md"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-xs text-gray-500 py-4 text-center">No categories defined yet. Please add at least one category.</p>
          )}
        </div>
      </section>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={handleDiscard}
          className="px-6 py-2.5 bg-transparent hover:bg-[#333] text-gray-300 text-sm font-bold rounded-lg transition-colors border border-[#333]"
        >
          Discard
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-white text-black hover:bg-gray-200 text-sm font-bold rounded-lg transition-all flex items-center gap-2 disabled:opacity-60"
        >
          {saving ? <Loader2 className="animate-spin" size={18} /> : "Save changes"}
        </button>
      </div>
    </div>
  );
}
