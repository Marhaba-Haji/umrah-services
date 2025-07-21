-- Migration: Add helpful_count to faqs table
ALTER TABLE faqs ADD COLUMN helpful_count integer NOT NULL DEFAULT 0; 