"""Validate a desktop upload ZIP against the plugin directory (no extraction)."""
import hashlib
import json
import sys
from pathlib import Path
from zipfile import ZipFile

archive, source = map(Path, sys.argv[1:])
with ZipFile(archive) as bundle:
    files = [entry.filename for entry in bundle.infolist() if not entry.is_dir()]
    if "plugin.json" not in files:
        sys.exit("Missing root plugin.json: this is not a desktop upload package")
    expected = {p.relative_to(source).as_posix() for p in source.rglob("*") if p.is_file()}
    if set(files) != expected or len(files) != len(expected):
        sys.exit("ZIP entries do not match the plugin directory")
    manifest = json.loads(bundle.read("plugin.json"))
    if archive.name != f"{manifest['name']}-{manifest['version']}.zip":
        sys.exit("ZIP filename does not match its manifest")
    for name in files:
        # Git checkout may use CRLF on Windows; git archive uses repository bytes.
        data = bundle.read(name)
        original = (source / name).read_bytes()
        if Path(name).suffix in {".md", ".yaml", ".json", ".svg"}:
            data = data.replace(b"\r\n", b"\n")
            original = original.replace(b"\r\n", b"\n")
        if data != original:
            sys.exit(f"ZIP content mismatch: {name}")
print(f"{len(files)} plugin files verified; SHA-256 {hashlib.sha256(archive.read_bytes()).hexdigest()}")
