-- Add read access to content tables for public (or authenticated users)
-- In the future, this should be restricted to authenticated staff, but for prototype we allow public reads.

CREATE POLICY "Enable read access for all users" ON content_categories
    FOR SELECT
    USING (true);

CREATE POLICY "Enable read access for all users" ON content_items
    FOR SELECT
    USING (true);

CREATE POLICY "Enable read access for all users" ON content_versions
    FOR SELECT
    USING (true);
