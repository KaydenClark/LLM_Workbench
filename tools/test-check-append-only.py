#!/usr/bin/env python3
"""Red/green cover for tools/check-append-only.py.

The checker enforces the append-only rule for every spec evidence log, and until
now its only proof was a reviewer running it by hand. That is how three of its
gaps shipped: a hardcoded spec list that excluded S-036, S-037 and S-045; an
orphan check blind to a rewritten row keeping its leading pipe; and a scan that
reset at the first blank line, so a row appended after one was invisible.

Each case plants exactly one violation in a throwaway clone and asserts the
checker fails and names the file. The clone is made once and restored between
cases because a single checker run replays every commit on the branch across
every spec and costs ~25s; three cases plus the clean baseline is the smallest
set that holds all three gaps closed.

The working-tree copy of the checker is installed into the clone deliberately.
Cloning alone tests the committed checker, which would silently pass an
uncommitted regression -- the first draft of this file did exactly that.
"""
import subprocess, sys, tempfile, shutil, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
REL = "tools/check-append-only.py"
TARGET = "workbench/specs/S-045-v3-1-2-follow-ups/SPEC.md"   # outside the old hardcoded seven
# S-00I TK-006: the checker enumerated only `workbench/specs/<id>/SPEC.md`
# (`os.listdir(SPEC_ROOT)` filtered to a direct SPEC.md), so a Spec retired one
# level deeper by S-00I TK-005 - `workbench/specs/retired/<id>/SPEC.md` - was
# never discovered at all, and append-only enforcement silently stopped
# covering it. S-00H is the room's one real retired Spec and the fixture for
# this case, exactly as its own retirement evidence row is the fixture the
# discard gate reads.
RETIRED_TARGET = "workbench/specs/retired/S-00H-task-artifact-and-terminology-migration/SPEC.md"
failures = []

def rows(text):
    return [i for i, l in enumerate(text.split("\n")) if l.startswith("| 20")]

def rewrite_last_row(text):
    L = text.split("\n"); i = rows(text)[-1]
    parts = L[i].split("|"); parts[3] = " REWRITTEN IN PLACE "
    L[i] = "|".join(parts); return "\n".join(L)

def orphan_after_blank(text):
    L = text.split("\n"); i = rows(text)[0]
    L.insert(i + 1, ""); L.insert(i + 2, "TK-001 | hidden after a blank line | v | d | g |")
    return "\n".join(L)

def piped_orphan(text):
    L = text.split("\n"); i = rows(text)[0]
    L.insert(i + 1, "| TK-001 | rewritten variant of a published row | v | d | g |")
    return "\n".join(L)

# (name, mutate, expect, target_rel) - target_rel lets one case mutate a file
# other than TARGET, which the retired-folder case above needs.
CASES = [
    ("in-place rewrite in a spec the old hardcoded list omitted", rewrite_last_row, "S-045", TARGET),
    ("orphan appended after a blank line inside the table", orphan_after_blank, TARGET, TARGET),
    ("rewritten row that keeps its leading pipe", piped_orphan, TARGET, TARGET),
    ("in-place rewrite inside a retired Spec's evidence log, invisible to a top-level-only enumeration", rewrite_last_row, "S-00H", RETIRED_TARGET),
]

work = tempfile.mkdtemp(prefix="append-only-")
try:
    subprocess.run(["git", "clone", "-q", "--shared", str(ROOT), work], check=True, capture_output=True)
    subprocess.run(["git", "checkout", "-q", "--detach", "HEAD"], cwd=work, check=True, capture_output=True)
    shutil.copy(ROOT / REL, pathlib.Path(work) / REL)   # test the working tree, not the last commit

    def run():
        r = subprocess.run([sys.executable, REL], cwd=work, capture_output=True, text=True)
        return r.returncode, r.stdout + r.stderr

    print("check-append-only.py")
    code, out = run()
    if code != 0:
        failures.append(f"clean tree: exited {code}, expected 0\n{out[-600:]}")
    else:
        print("  ok    a clean tree reports CLEAN")

    for name, mutate, expect, target_rel in CASES:
        target = pathlib.Path(work) / target_rel
        pristine = target.read_text()
        target.write_text(mutate(pristine))
        code, out = run()
        target.write_text(pristine)
        if code == 0:
            failures.append(f"{name}: checker exited 0; the violation was not detected")
        elif expect not in out:
            failures.append(f"{name}: exited {code} but never named {expect}\n{out[-400:]}")
        else:
            print(f"  ok    {name}")
finally:
    shutil.rmtree(work, ignore_errors=True)

if failures:
    print("\nFAIL")
    for f in failures: print("  " + f)
    sys.exit(1)
print("\nall cases pass")
