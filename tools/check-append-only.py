# A row's identity is its Date+Ticket+Event columns. Append-only means: for each
# identity, the text FIRST published for it must still be present verbatim.
# Later variants of the same identity are rewrites - violations - so the repair
# is to restore the earliest text, not to preserve every variant.
import subprocess, sys
SPECS=["S-038-v3-1-2-upstream-fix-list","S-039-installed-runtime-integrity","S-040-skill-gate-route-selection",
       "S-041-recorded-baseline-availability","S-042-installed-state-repair","S-043-diagnostic-output-legibility",
       "S-044-legacy-room-classification"]
def sh(*a): return subprocess.run(a,capture_output=True,text=True)
commits=[c for c in ("288c821","d31bf2c","a5e7fe0") if sh("git","cat-file","-e",c+"^{commit}").returncode==0]
commits+=sh("git","rev-list","--reverse","5561906..HEAD").stdout.split()
def rows(t): return [l for l in t.split("\n") if l.startswith("| 20")]
def ident(r):
    p=[x.strip() for x in r.split("|")]
    return tuple(p[1:4]) if len(p)>4 else (r[:80],)
bad=0
for spec in SPECS:
    first={}      # identity -> (text, commit) first published
    variants={}   # identity -> set of texts ever seen
    for c in commits:
        r=sh("git","show",f"{c}:workbench/specs/{spec}/SPEC.md")
        if r.returncode: continue
        for row in rows(r.stdout):
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
print("\nAPPEND-ONLY (first-published text preserved for every row):", "CLEAN" if not bad else f"{bad} VIOLATION(S)")
sys.exit(1 if bad else 0)
