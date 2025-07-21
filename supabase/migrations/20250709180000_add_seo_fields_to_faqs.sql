-- Migration: Add SEO fields to faqs table
ALTER TABLE faqs
  ADD COLUMN seo_title text,
  ADD COLUMN seo_description text,
  ADD COLUMN keywords text[]; 