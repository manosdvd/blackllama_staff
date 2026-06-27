import re

with open('src/style.css', 'r') as f:
    content = f.read()

# 1. Update .app-container mobile query
old_app_container = """@media (max-width: 900px) {
  .app-container {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
}"""
new_app_container = """@media (max-width: 900px) {
  .app-container {
    display: block;
    padding-bottom: 70px; /* Space for bottom nav */
  }
}"""
content = content.replace(old_app_container, new_app_container)

# 2. Update .sidebar mobile query
old_sidebar = """@media (max-width: 900px) {
  .sidebar {
    height: auto;
    position: relative;
    padding: 16px 20px;
    border-right: none;
    border-bottom: 1px solid hsl(var(--border));
  }
}"""
new_sidebar = """@media (max-width: 900px) {
  .sidebar {
    height: 65px;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    flex-direction: row;
    padding: 0;
    border-right: none;
    border-top: 1px solid hsl(var(--border));
    z-index: 9999;
    box-shadow: 0 -4px 15px rgba(0,0,0,0.1);
  }
  .logo-container {
    display: none;
  }
}"""
content = content.replace(old_sidebar, new_sidebar)

# 3. Update .nav-links mobile query
old_nav_links = """@media (max-width: 900px) {
  .nav-links {
    flex-direction: row;
    overflow-x: auto;
    padding-bottom: 8px;
    margin-bottom: 12px;
    gap: 12px;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
  }
  .nav-links::-webkit-scrollbar {
    display: none;
  }
}"""
new_nav_links = """@media (max-width: 900px) {
  .nav-links {
    flex-direction: row;
    overflow-x: auto;
    padding: 0;
    margin: 0;
    gap: 0;
    width: 100%;
    justify-content: space-around;
    align-items: center;
  }
  .nav-item {
    flex: 1;
    display: flex;
    justify-content: center;
  }
  .nav-item button {
    flex-direction: column;
    padding: 8px 4px;
    gap: 4px;
    font-size: 10px;
    width: 100%;
    text-align: center;
    border-radius: 0;
    height: 100%;
  }
  .nav-item button .nav-icon {
    font-size: 20px;
  }
}"""
content = content.replace(old_nav_links, new_nav_links)

with open('src/style.css', 'w') as f:
    f.write(content)
print("Patched mobile shell CSS.")
