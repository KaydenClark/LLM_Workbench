import unittest

from mathx.discount import apply_discount


class TestDiscount(unittest.TestCase):
    def test_basic(self):
        self.assertEqual(apply_discount(100, 10), 90.0)

    def test_zero(self):
        self.assertEqual(apply_discount(50, 0), 50.0)

    def test_clamps_over_100(self):
        # A 150% discount must never produce a negative price.
        self.assertEqual(apply_discount(100, 150), 0.0)

    def test_clamps_negative(self):
        # A negative discount must never increase the price.
        self.assertEqual(apply_discount(100, -10), 100.0)


if __name__ == "__main__":
    unittest.main()
