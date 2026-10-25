"""Package source + built artifacts without caches, credentials, or local workspace files."""
from pathlib import Path
import zipfile

root = Path(__file__).resolve().parent.parent
out = root / 'dist' / 'LATIMUS-build.zip'
excluded = {'.git', 'node_modules', 'test-results', 'playwright-report', '__pycache__', 'deliverables'}
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as archive:
    for path in sorted(root.rglob('*')):
        relative = path.relative_to(root)
        if any(part in excluded for part in relative.parts) or not path.is_file():
            continue
        if path == out or path.name.startswith('.env') or path.name == '.npmrc' or path.name.endswith(('.vault.json', '.local')):
            continue
        archive.write(path, Path('LATIMUS') / relative)
print(out)
