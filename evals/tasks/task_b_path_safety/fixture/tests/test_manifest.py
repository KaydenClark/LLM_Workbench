import tempfile
import unittest
from pathlib import Path

from inventory.manifest import safe_output_path


class TestManifestPath(unittest.TestCase):
    def setUp(self):
        self.root = Path(tempfile.mkdtemp()).resolve()

    def test_normal_filename(self):
        self.assertEqual(safe_output_path(self.root, "report.json"), self.root / "report.json")

    def test_nested_filename(self):
        self.assertEqual(safe_output_path(self.root, "daily/report.json"), self.root / "daily/report.json")

    def test_rejects_parent_traversal(self):
        with self.assertRaises(ValueError):
            safe_output_path(self.root, "../outside.json")

    def test_rejects_absolute_path(self):
        with self.assertRaises(ValueError):
            safe_output_path(self.root, "/tmp/outside.json")

    def test_rejects_sibling_prefix_trick(self):
        with self.assertRaises(ValueError):
            safe_output_path(self.root, f"../{self.root.name}-other/report.json")


if __name__ == "__main__":
    unittest.main()
