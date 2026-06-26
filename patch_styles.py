import re

with open('src/style.css', 'r') as f:
    content = f.read()

# 1. Update Typography Text-Wrap
if "text-wrap: balance;" not in content:
    content = content.replace(
        "h1, h2, h3, h4, h5, h6 {\n  font-family: var(--font-heading);\n  font-weight: 700;\n  color: hsl(var(--foreground));\n}",
        "h1, h2, h3, h4, h5, h6 {\n  font-family: var(--font-heading);\n  font-weight: 700;\n  color: hsl(var(--foreground));\n  text-wrap: balance;\n}"
    )

# Apply text-wrap pretty to paragraphs inside glass panels
if ".glass-panel p {" not in content:
    content += "\n/* Text Wrap Pretty for readable bodies */\n.glass-panel p, .welcome-banner-text p, .dialog-content p {\n  text-wrap: pretty;\n}\n"

# 2. Update Shadows to be more layered
content = content.replace(
    "--shadow-md: 0 4px 6px -1px rgba(10, 30, 10, 0.08), 0 2px 4px -1px rgba(10, 30, 10, 0.04);",
    "--shadow-md: 0 10px 15px -3px rgba(10, 30, 10, 0.1), 0 4px 6px -2px rgba(10, 30, 10, 0.05);"
)
content = content.replace(
    "--shadow-lg: 0 10px 15px -3px rgba(10, 30, 10, 0.1), 0 4px 6px -2px rgba(10, 30, 10, 0.05);",
    "--shadow-lg: 0 20px 25px -5px rgba(10, 30, 10, 0.1), 0 10px 10px -5px rgba(10, 30, 10, 0.04);"
)
content = content.replace(
    "--shadow-xl: 0 20px 25px -5px rgba(10, 30, 10, 0.12), 0 10px 10px -5px rgba(10, 30, 10, 0.04);",
    "--shadow-xl: 0 25px 50px -12px rgba(10, 30, 10, 0.25);"
)

# Dark mode shadows
content = content.replace(
    "--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3);",
    "--shadow-md: 0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4);"
)
content = content.replace(
    "--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3);",
    "--shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.5);"
)
content = content.replace(
    "--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4);",
    "--shadow-xl: 0 25px 50px -12px rgba(0, 0, 0, 0.7);"
)

# 3. Update Gradients with Oklab (Fallback wrapper)
if "--in-oklab: ;" not in content:
    fallback = """
/* Gradient OKLAB Interpolation */
:root {
  --in-oklab: ;
}
@supports (background: linear-gradient(in oklab, white, black)) {
  :root {
    --in-oklab: in oklab;
  }
}
"""
    # Insert right after variables
    content = content.replace("/* Base resets & CSS settings */", fallback + "\n/* Base resets & CSS settings */")

content = content.replace(
    "background: linear-gradient(135deg, hsl(var(--primary) / 0.1), hsl(var(--primary) / 0.03));",
    "background: linear-gradient(135deg var(--in-oklab), hsl(var(--primary) / 0.1), hsl(var(--primary) / 0.02));"
)
content = content.replace(
    "background: linear-gradient(135deg, #1d4ed8 10%, #3b82f6 90%);",
    "background: linear-gradient(135deg var(--in-oklab), #1d4ed8 10%, #3b82f6 90%);"
)
content = content.replace(
    "background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)));",
    "background: linear-gradient(135deg var(--in-oklab), hsl(var(--primary)), hsl(var(--accent)));"
)

# 4. Scroll-driven Animations
if "@keyframes scroll-fade-in" not in content:
    animations = """
/* Scroll-driven Animations */
@media (prefers-reduced-motion: no-preference) {
  @supports ((animation-timeline: view()) and (animation-range: entry)) {
    @keyframes scroll-fade-in {
      from {
        opacity: 0;
        transform: translateY(40px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    
    .glass-panel, .training-accordion-card, .comedy-card, .checklist-item, .packing-item-card {
      animation: scroll-fade-in auto linear forwards;
      animation-timeline: view(block);
      animation-range: entry 5% cover 25%;
    }
    
    /* Disable on elements that are already animating or interactive on hover in a conflicting way */
    .glass-panel-interactive {
      animation-range: entry 5% cover 15%;
    }
  }
}
"""
    content += animations

# 5. Micro-interactions
if ".checklist-items-list:has(.checklist-item:hover)" not in content:
    micro = """
/* Micro-interactions: Dim inactive siblings */
.checklist-items-list:has(.checklist-item:hover) .checklist-item:not(:hover),
.packing-items-grid:has(.packing-item-card:hover) .packing-item-card:not(:hover) {
  opacity: 0.6;
  filter: grayscale(40%);
  transform: scale(0.98);
}

/* Theme toggle rotation */
.theme-toggle-btn svg {
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.theme-toggle-btn:hover svg {
  transform: rotate(45deg) scale(1.1);
}
[data-theme="dark"] .theme-toggle-btn:hover svg {
  transform: rotate(360deg) scale(1.1);
}
"""
    content += micro

with open('src/style.css', 'w') as f:
    f.write(content)

print("Patched style.css successfully.")
