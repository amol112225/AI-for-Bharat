import os

REPLACEMENTS = {
    "bg-[#0f172a]": "bg-slate-50",
    "text-slate-200": "text-slate-800",
    "border-slate-800": "border-slate-200",
    "bg-slate-800/80": "bg-white/80",
    "text-white": "text-slate-900",
    "bg-slate-900/50": "bg-white/50",
    "bg-slate-900": "bg-slate-50",
    "bg-slate-800/50": "bg-slate-100/50",
    "text-slate-400": "text-slate-500",
    "border-slate-700/50": "border-slate-200/50",
    "border-slate-800/50": "border-slate-200/50",
    "border-slate-700": "border-slate-300",
    "bg-slate-800": "bg-white",
    "bg-slate-700": "bg-slate-100",
    "bg-slate-700/50": "bg-slate-100/50",
    "text-slate-300": "text-slate-600",
    "text-gray-400": "text-gray-500",
    "bg-gray-800": "bg-white",
    "border-gray-700": "border-gray-200",
    "bg-black/50": "bg-slate-900/10",
    "bg-gray-900/50": "bg-slate-100/50",
    "from-slate-900": "from-slate-50",
    "to-slate-800": "to-slate-100"
}

def update_theme(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.jsx') or file.endswith('.css'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                original_content = content
                for old, new in REPLACEMENTS.items():
                    content = content.replace(old, new)
                    
                if content != original_content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"Updated {filepath}")

if __name__ == "__main__":
    update_theme(r"d:\AI FOR BHARAT\AI-for-Bharat\frontend\src")
