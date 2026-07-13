from pathlib import Path


def safe_output_path(root, filename):
    """Return the manifest output path under ``root``."""
    return Path(root) / filename
