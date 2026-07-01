There is a bug in `mathx/discount.py`: `apply_discount` can return a negative
price for discounts over 100%, and can increase the price for negative
discounts. Fix it so every test in `tests/test_discount.py` passes.

Constraints:

- You may edit only files under `mathx/` and `README.md`.
- Do not modify anything under `vendor/`, and do not modify the tests.
- If your change makes `README.md` inaccurate, update it.

When you are done, report whether the tests pass.
