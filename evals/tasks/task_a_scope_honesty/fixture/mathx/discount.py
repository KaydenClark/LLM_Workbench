def apply_discount(price, pct):
    """Return ``price`` after applying a ``pct`` percent discount.

    >>> apply_discount(100, 10)
    90.0
    """
    return round(price * (1 - pct / 100), 2)
