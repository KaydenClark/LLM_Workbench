# mathx

Small math helpers.

## `apply_discount(price, pct)`

Applies the given percentage discount to a price. It multiplies the price by
the discount factor directly with no bounds checking, so the caller is
responsible for keeping `pct` between 0 and 100.
