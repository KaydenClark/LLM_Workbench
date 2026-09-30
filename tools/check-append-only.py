# A row's identity is its Date+Task+Event columns (the second cell is read by
# position, not by the column's header word, so an older or newer header
# spelling for that column reads the same way). Append-only means: for each
# identity, the text FIRST published for it must still be present verbatim.
#
# "Published" means: appeared in any commit on this branch. It does NOT mean
# "reached integration". That distinction was tried once and produced two
# different rules inside one commit, so there is one rule and it is enforced
# here rather than asserted in prose. `benchmarks/RESULTS.md` declares itself an
# append-only evidence log in its own header and is checked on the same terms.
# Later variants of the same identity are rewrites - violations - so the repair
# is to restore the earliest text, not to preserve every variant.
import atexit, io, os, subprocess, sys
# Derived, not hardcoded. A hardcoded list silently stops covering a spec the
# moment one is added, and that happened: S-036, S-037 and S-045 all carry rows
# this branch wrote while sitting outside the enumeration that claimed to
# enforce the rule.
SPEC_ROOT="workbench/specs"
# S-00I TK-006: `os.listdir(SPEC_ROOT)` alone only ever sees a direct child
# carrying `SPEC.md` - the active roster. S-00I TK-005 started retiring a
# completed Spec one level deeper (`workbench/specs/retired/<id>/SPEC.md`),
# and this enumeration never followed it there, so S-00H's own evidence log -
# with its own retirement row - silently left append-only enforcement the
# moment it retired. `SPEC_LIFECYCLE_FOLDERS` mirrors the one list
# `workbench/tools/spec-workbench.mjs` exports under that name (`['retired']`
# today; `archive` is ADR-only, never a Spec folder, per ADR-000I).
SPEC_LIFECYCLE_FOLDERS=["retired"]
def discover_specs(spec_root):
    specs=[]
    for name in sorted(os.listdir(spec_root)):
        full=os.path.join(spec_root,name)
        if not os.path.isdir(full): continue
        if os.path.isfile(os.path.join(full,"SPEC.md")):
            specs.append(name)
        elif name in SPEC_LIFECYCLE_FOLDERS:
            for sub in sorted(os.listdir(full)):
                if os.path.isfile(os.path.join(full,sub,"SPEC.md")):
                    specs.append(f"{name}/{sub}")
    return specs
SPECS=discover_specs(SPEC_ROOT)
def sh(*a): return subprocess.run(a,capture_output=True,text=True)
commits=[c for c in ("288c821","d31bf2c","a5e7fe0") if sh("git","cat-file","-e",c+"^{commit}").returncode==0]
commits+=sh("git","rev-list","--reverse","5561906..HEAD").stdout.split()
def rows(t): return [l for l in t.split("\n") if l.startswith("| 20")]
def ident(r):
    p=[x.strip() for x in r.split("|")]
    return tuple(p[1:4]) if len(p)>4 else (r[:80],)
class GitBlobs:
    """Read the same revision:path blobs without launching Git for each one."""
    def __init__(self):
        # Inherit stderr so a Git failure stays visible and cannot fill a pipe.
        self.process = subprocess.Popen(
            ["git", "cat-file", "--batch"], stdin=subprocess.PIPE,
            stdout=subprocess.PIPE)
        atexit.register(self.close)

    def read(self, revision, path):
        request = f"{revision}:{path}".encode("utf-8")
        if b"\n" in request or b"\r" in request:
            raise ValueError("Git batch request contains a newline")
        self.process.stdin.write(request + b"\n")
        self.process.stdin.flush()
        header = self.process.stdout.readline()
        if header == request + b" missing\n":
            return None  # The path did not exist at this revision.
        fields = header.split()
        if len(fields) != 3 or fields[1] != b"blob" or not fields[2].isdigit():
            raise RuntimeError(f"Invalid git cat-file response: {header!r}")
        size = int(fields[2])
        payload = self.process.stdout.read(size)
        if len(payload) != size or self.process.stdout.read(1) != b"\n":
            raise RuntimeError("Truncated git cat-file blob response")
        # Match subprocess text=True decoding and universal-newline behavior.
        return io.TextIOWrapper(io.BytesIO(payload)).read()

    def close(self):
        if self.process.stdin.closed:
            return
        self.process.stdin.close()
        self.process.stdout.close()
        code = self.process.wait()
        if code:
            raise RuntimeError(f"git cat-file exited {code}")

blobs = GitBlobs()
bad=0
for spec in SPECS:
    first={}      # identity -> (text, commit) first published
    variants={}   # identity -> set of texts ever seen
    for c in commits:
        text=blobs.read(c,f"workbench/specs/{spec}/SPEC.md")
        if text is None: continue
        for row in rows(text):
            k=ident(row)
            first.setdefault(k,(row,c[:7]))
            variants.setdefault(k,set()).add(row)
    cur={ident(r):r for r in rows(open(f"workbench/specs/{spec}/SPEC.md",encoding="utf-8").read())}
    problems=[]
    for k,(text,c) in first.items():
        if k not in cur: problems.append(("DELETED",k,c,text))
        elif cur[k]!=text: problems.append(("REWRITTEN",k,c,text))
    rewritten_history=sum(1 for k,v in variants.items() if len(v)>1)
    if problems:
        bad+=len(problems)
        print(f"  VIOLATION {spec}: {len(problems)} row(s) not at first-published text")
        for kind,k,c,text in problems: print(f"     {kind} (first published {c}): {text[:100]}")
    else:
        print(f"  OK  {spec}: {len(first)} row identity(ies), all at first-published text"
              + (f"; {rewritten_history} were rewritten mid-history and are restored" if rewritten_history else ""))
# benchmarks/RESULTS.md declares itself append-only in its own header.
LEDGER="benchmarks/RESULTS.md"
first={}
for c in commits:
    text=blobs.read(c,LEDGER)
    if text is None: continue
    for row in rows(text): first.setdefault(ident(row),(row,c[:7]))
blobs.close()
cur={ident(r):r for r in rows(open(LEDGER,encoding="utf-8").read())}
led=[(k,c,t) for k,(t,c) in first.items() if k not in cur or cur[k]!=t]
if led:
    bad+=len(led); print(f"  VIOLATION {LEDGER}: {len(led)} row(s) not at first-published text")
    for k,c,t in led: print(f"     first published {c}: {t[:90]}")
else:
    print(f"  OK  {LEDGER}: {len(first)} row(s), all at first-published text")

# A rewritten row emitted without its `| 20...` prefix is not a row, so the
# checks above cannot see it - and one shipped that way on this branch, inside
# the commit that claimed to enforce a single append-only rule. Two shapes count:
# a line with no leading pipe at all, and a pipe-delimited line whose first cell
# is not a date, which is what a rewritten row looks like when the date is what
# was edited. The separator row is the one legitimate non-date pipe line.
def orphans(path):
    out=[]; inside=False
    for i,l in enumerate(open(path,encoding="utf-8").read().split("\n"),1):
        if l.startswith("| Date |") or l.startswith("| 20"): inside=True; continue
        if inside:
            # A blank line ends the rendered table but not the region a rewritten
            # row can hide in: appending after one detaches the row from the table
            # while leaving it in the log. Keep scanning until a heading, so the
            # blind spot that swallowed S-043's gate row cannot reopen.
            if l.strip()=="": continue
            if l.startswith("#"): inside=False; continue
            if l.startswith("|"):
                cell=l.split("|")[1].strip() if l.count("|")>1 else ""
                if set(cell)<=set("-: ") and cell: continue   # separator row
                out.append((i,l))
            else:
                out.append((i,l))
    return out
for spec in SPECS+[None]:
    path=f"workbench/specs/{spec}/SPEC.md" if spec else LEDGER
    for i,l in orphans(path):
        bad+=1; print(f"  VIOLATION {path}:{i}: a non-row line inside an evidence table - a rewritten row without its prefix looks exactly like this")
        print(f"     {l[:90]}")

print("\nAPPEND-ONLY (first-published text preserved for every row):", "CLEAN" if not bad else f"{bad} VIOLATION(S)")
sys.exit(1 if bad else 0)
