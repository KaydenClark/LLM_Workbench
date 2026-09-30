# Decision ledger: all 181 historical items

Read current repository sources at `212762774b5cb7c065ab573bb487752fe98eff4c`. `ALREADY COVERED` means the proposition has an owner, not that all related runtime behavior is delivered. Each original proposition/status is preserved in the JSON/CSV; review detail below separates observation, intent, inference and recommendation. Source paths resolve under the original recovered packet named in [evidence](evidence.md). New ADR labels are proposals, not allocated numbers.

| ID | Decision summary | Cluster | Current evidence | Existing coverage | Disposition | Target artifact | Confidence | Kayden required? |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [R001](#r001) | The Workbench is a perpetual handoff | Continuity & handoff | BLUEPRINT.md, LEXICON.md, workbench/docs/adr/0040-json-notepads-preserve-objective-continuity.md, workbench/specs/S-046-json-notepad-foundation/SPEC.md, workbench/specs/S-048-checkpoint-retirement/SPEC.md, workbench/sessions/.gitignore | WB-0035 WB-0040 | KEEP - ADR | CAND-A | High | No |
| [R002](#r002) | Complete the assigned outcome autonomously | Authority & governance planes | AGENTS.md, LEXICON.md, workbench/docs/adr/0027-instruction-authority-is-separate-from-state-resolution.md, workbench/docs/adr/0023-mechanical-guarantees-and-agent-obligations.md | WB-0035 | ALREADY COVERED | ADR-0035 | High | No |
| [R003](#r003) | Every imposed step must help delivery | Delivery without governance tax | AGENTS.md, workbench/tools/diagnostics.mjs, workbench/tools/spec-workbench.mjs | WB-0034 | ALREADY COVERED | ADR-0034 | High | No |
| [R004](#r004) | Standalone Workbench before coordination | Extension architecture (Foundry/CIC/Audit) | BLUEPRINT.md, workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md, workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md | WB-0015 WB-0026 | ALREADY COVERED | ADR-0015, ADR-0026 | High | No |
| [R005](#r005) | One canonical Workbench source and release home | Extension architecture (Foundry/CIC/Audit) | BLUEPRINT.md, workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md, workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md | WB-0026 | ALREADY COVERED | ADR-0026 | High | No |
| [R006](#r006) | Instruction authority and implemented state are different questions | Authority & governance planes | AGENTS.md, LEXICON.md, workbench/docs/adr/0027-instruction-authority-is-separate-from-state-resolution.md, workbench/docs/adr/0023-mechanical-guarantees-and-agent-obligations.md | WB-0027 | ALREADY COVERED | ADR-0027 | High | No |
| [R007](#r007) | Governance planes classify a claim in an operation | Authority & governance planes | AGENTS.md, LEXICON.md, workbench/docs/adr/0027-instruction-authority-is-separate-from-state-resolution.md, workbench/docs/adr/0023-mechanical-guarantees-and-agent-obligations.md | WB-0001 WB-0025 | ALREADY COVERED | ADR-0001, ADR-0025 | High | No |
| [R008](#r008) | Binding requirements live in their current owners | Authority & governance planes | AGENTS.md, LEXICON.md, workbench/docs/adr/0027-instruction-authority-is-separate-from-state-resolution.md, workbench/docs/adr/0023-mechanical-guarantees-and-agent-obligations.md | WB-0002 | ALREADY COVERED | ADR-0002 | High | No |
| [R009](#r009) | The Contract is a logical claim set | Authority & governance planes | AGENTS.md, LEXICON.md, workbench/docs/adr/0027-instruction-authority-is-separate-from-state-resolution.md, workbench/docs/adr/0023-mechanical-guarantees-and-agent-obligations.md | WB-0013 WB-0033 | ALREADY COVERED | ADR-0013, ADR-0033 | High | No |
| [R010](#r010) | All planes permit CRUD subject to the operation | Authority & governance planes | AGENTS.md, LEXICON.md, workbench/docs/adr/0027-instruction-authority-is-separate-from-state-resolution.md, workbench/docs/adr/0023-mechanical-guarantees-and-agent-obligations.md | WB-0003 | ALREADY COVERED | ADR-0003 | High | No |
| [R011](#r011) | A policy file is not enforcement | Authority & governance planes | AGENTS.md, LEXICON.md, workbench/docs/adr/0027-instruction-authority-is-separate-from-state-resolution.md, workbench/docs/adr/0023-mechanical-guarantees-and-agent-obligations.md | WB-0005 WB-0023 | ALREADY COVERED | ADR-0005, ADR-0023 | High | No |
| [R012](#r012) | Tools handle deterministic structure; agents handle judgment | Authority & governance planes | AGENTS.md, LEXICON.md, workbench/docs/adr/0027-instruction-authority-is-separate-from-state-resolution.md, workbench/docs/adr/0023-mechanical-guarantees-and-agent-obligations.md | WB-0023 | ALREADY COVERED | ADR-0023 | High | No |
| [R013](#r013) | A check can block only what it evaluates | Delivery without governance tax | AGENTS.md, workbench/tools/diagnostics.mjs, workbench/tools/spec-workbench.mjs | WB-0020 WB-0029 | ALREADY COVERED | ADR-0020, ADR-0029 | High | No |
| [R014](#r014) | Diagnostic effects belong to trusted consumers | Delivery without governance tax | AGENTS.md, workbench/tools/diagnostics.mjs, workbench/tools/spec-workbench.mjs | WB-0029 | ALREADY COVERED | ADR-0029 | High | No |
| [R015](#r015) | Ordinary work does not need a Job Order | Delivery without governance tax | AGENTS.md, workbench/tools/diagnostics.mjs, workbench/tools/spec-workbench.mjs | GO-0021 WB-0015 WB-0026 | ALREADY COVERED | ADR-0015, ADR-0026 | High | No |
| [R016](#r016) | A report never authorizes its own repair | Evidence, review & evaluation | AGENTS.md, workbench/feedback/REPORT_FORMAT.md, evals/README.md, outcomes/README.md, tools/test-cross-provider-fixture.mjs | WB-0037 WB-0038 AU-0007 | ALREADY COVERED | ADR-0037, REPORT_FORMAT.md | High | No |
| [R017](#r017) | Read-only applies to the named target, not every composed activity | Skill composition & bundle | skills/README.md, workbench/manifest.json, tools/core-skill-installer.mjs, tools/skill-presence.mjs, tools/test-core-skill-installer.mjs | AU-0007 WB-0036 | MERGE WITH ADR-PROPOSED-E | CAND-E | Medium | No |
| [R018](#r018) | Owner authorization is scoped and cannot be fabricated | Authority & governance planes | AGENTS.md, LEXICON.md, workbench/docs/adr/0027-instruction-authority-is-separate-from-state-resolution.md, workbench/docs/adr/0023-mechanical-guarantees-and-agent-obligations.md | GO-0009 WB-0027 | MERGE WITH ADR-0027 | ADR-0027 | Medium | No |
| [R019](#r019) | Separate Proof, Audit and Owner Command | Authority & governance planes | AGENTS.md, LEXICON.md, workbench/docs/adr/0027-instruction-authority-is-separate-from-state-resolution.md, workbench/docs/adr/0023-mechanical-guarantees-and-agent-obligations.md | - | MERGE WITH ADR-0027 | ADR-0027; ADR-0037 | High | No |
| [R020](#r020) | Nearest-root boot with explicit outer safety inheritance | Authority & governance planes | AGENTS.md, LEXICON.md, workbench/docs/adr/0027-instruction-authority-is-separate-from-state-resolution.md, workbench/docs/adr/0023-mechanical-guarantees-and-agent-obligations.md | GO-0022 WB-0026 | ALREADY COVERED | ADR-0026 | High | No |
| [R021](#r021) | No machine-global import of one project's interior | Adoption, upgrade & installed integrity | RUNBOOK.md, tools/workbench-adoption.mjs, tools/workbench-upgrade.mjs, workbench/docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md, workbench/specs/S-041-recorded-baseline-availability/SPEC.md, tools/control-fidelity.mjs | WB-0026 | ALREADY COVERED | ADR-0026 | Medium | No |
| [R022](#r022) | Stable specs own capability detail; boards project active work | Records, ownership & navigation | AGENTS.md, LEXICON.md, workbench/wiki/SCHEMA.md, workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md, workbench/docs/adr/0041-visible-base62-workbench-identifiers.md | WB-0033 WB-0035 | ALREADY COVERED | ADR-0033, ADR-0035 | High | No |
| [R023](#r023) | Size execution slices for a fresh context | Records, ownership & navigation | AGENTS.md, LEXICON.md, workbench/wiki/SCHEMA.md, workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md, workbench/docs/adr/0041-visible-base62-workbench-identifiers.md | - | KEEP - DOC | RUNBOOK / tracer-bullet | Medium | No |
| [R024](#r024) | Keep completed evidence and link successors | Records, ownership & navigation | AGENTS.md, LEXICON.md, workbench/wiki/SCHEMA.md, workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md, workbench/docs/adr/0041-visible-base62-workbench-identifiers.md | WB-0003 WB-0035 | ALREADY COVERED | AGENTS.md; ADR-0042 | Medium | No |
| [R025](#r025) | Six lowercase support lanes ship as structural slots | Records, ownership & navigation | AGENTS.md, LEXICON.md, workbench/wiki/SCHEMA.md, workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md, workbench/docs/adr/0041-visible-base62-workbench-identifiers.md | WB-0017 | ALREADY COVERED | ADR-0017 | High | No |
| [R026](#r026) | The manifest declares machine-used paths | Records, ownership & navigation | AGENTS.md, LEXICON.md, workbench/wiki/SCHEMA.md, workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md, workbench/docs/adr/0041-visible-base62-workbench-identifiers.md | WB-0032 | ALREADY COVERED | ADR-0032 | High | No |
| [R027](#r027) | Every project has a local Wiki | Records, ownership & navigation | AGENTS.md, LEXICON.md, workbench/wiki/SCHEMA.md, workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md, workbench/docs/adr/0041-visible-base62-workbench-identifiers.md | WB-0018 | ALREADY COVERED | ADR-0018 | High | No |
| [R028](#r028) | Wiki and recall index have different ownership | Records, ownership & navigation | AGENTS.md, LEXICON.md, workbench/wiki/SCHEMA.md, workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md, workbench/docs/adr/0041-visible-base62-workbench-identifiers.md | - | KEEP - DOC | workbench/wiki/SCHEMA.md | Medium | No |
| [R029](#r029) | Traverse from a context map before broad searching | Records, ownership & navigation | AGENTS.md, LEXICON.md, workbench/wiki/SCHEMA.md, workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md, workbench/docs/adr/0041-visible-base62-workbench-identifiers.md | WB-0042 | ALREADY COVERED | ADR-0042 | High | No |
| [R030](#r030) | Lexicon is a bounded glossary and route map | Records, ownership & navigation | AGENTS.md, LEXICON.md, workbench/wiki/SCHEMA.md, workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md, workbench/docs/adr/0041-visible-base62-workbench-identifiers.md | WB-0042 | ALREADY COVERED | ADR-0042, LEXICON.md | MediumHigh | No |
| [R031](#r031) | Cross-context relationships are derived from existing owners | Records, ownership & navigation | AGENTS.md, LEXICON.md, workbench/wiki/SCHEMA.md, workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md, workbench/docs/adr/0041-visible-base62-workbench-identifiers.md | GO-0016 WB-0042 | ALREADY COVERED | ADR-0042, ADR-0002 | High | No |
| [R032](#r032) | Use shallow, human-readable knowledge organization | Records, ownership & navigation | AGENTS.md, LEXICON.md, workbench/wiki/SCHEMA.md, workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md, workbench/docs/adr/0041-visible-base62-workbench-identifiers.md | WB-0018 | ALREADY COVERED | workbench/wiki/SCHEMA.md | High | No |
| [R033](#r033) | Guidebooks are Wiki collections, not a new lane | Records, ownership & navigation | AGENTS.md, LEXICON.md, workbench/wiki/SCHEMA.md, workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md, workbench/docs/adr/0041-visible-base62-workbench-identifiers.md | WB-0018 | ALREADY COVERED | ADR-0018 | High | No |
| [R034](#r034) | Design Concepts explain the model and link evidence | Records, ownership & navigation | AGENTS.md, LEXICON.md, workbench/wiki/SCHEMA.md, workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md, workbench/docs/adr/0041-visible-base62-workbench-identifiers.md | WB-0030 | ALREADY COVERED | ADR-0030 | High | No |
| [R035](#r035) | Design Concept creation is owner-directed | Records, ownership & navigation | AGENTS.md, LEXICON.md, workbench/wiki/SCHEMA.md, workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md, workbench/docs/adr/0041-visible-base62-workbench-identifiers.md | WB-0030 | ALREADY COVERED | ADR-0030 | High | No |
| [R036](#r036) | Parent knowledge is shared; child knowledge stays local | Records, ownership & navigation | AGENTS.md, LEXICON.md, workbench/wiki/SCHEMA.md, workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md, workbench/docs/adr/0041-visible-base62-workbench-identifiers.md | WB-0030 | ALREADY COVERED | ADR-0030 | High | No |
| [R037](#r037) | Update touched owners during the same work | Records, ownership & navigation | AGENTS.md, LEXICON.md, workbench/wiki/SCHEMA.md, workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md, workbench/docs/adr/0041-visible-base62-workbench-identifiers.md | WB-0002 WB-0035 | ALREADY COVERED | AGENTS.md | High | No |
| [R038](#r038) | Promotion is per decision, with preserved provenance | Records, ownership & navigation | AGENTS.md, LEXICON.md, workbench/wiki/SCHEMA.md, workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md, workbench/docs/adr/0041-visible-base62-workbench-identifiers.md | WB-0002 WB-0040 | MERGE WITH ADR-PROPOSED-Q | CAND-Q | High | No |
| [R039](#r039) | Small independent ADRs preserve the reasons | Records, ownership & navigation | AGENTS.md, LEXICON.md, workbench/wiki/SCHEMA.md, workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md, workbench/docs/adr/0041-visible-base62-workbench-identifiers.md | - | KEEP - DOC | ADR authoring guidance | MediumHigh | No |
| [R040](#r040) | ADR publication must update binding controls and links | Records, ownership & navigation | AGENTS.md, LEXICON.md, workbench/wiki/SCHEMA.md, workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md, workbench/docs/adr/0041-visible-base62-workbench-identifiers.md | WB-0002 WB-0030 | ALREADY COVERED | ADR-0002; AGENTS.md | MediumHigh | No |
| [R041](#r041) | No extra ADR index was originally selected | Records, ownership & navigation | AGENTS.md, LEXICON.md, workbench/wiki/SCHEMA.md, workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md, workbench/docs/adr/0041-visible-base62-workbench-identifiers.md | - | ALREADY COVERED | REGISTER.md | High | No |
| [R042](#r042) | Names and identities are independent | Records, ownership & navigation | AGENTS.md, LEXICON.md, workbench/wiki/SCHEMA.md, workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md, workbench/docs/adr/0041-visible-base62-workbench-identifiers.md | WB-0041 | ALREADY COVERED | ADR-0041; CAND-N | High | No |
| [R043](#r043) | Visible base-62 identifiers are local to type and Workbench | Records, ownership & navigation | AGENTS.md, LEXICON.md, workbench/wiki/SCHEMA.md, workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md, workbench/docs/adr/0041-visible-base62-workbench-identifiers.md | WB-0041 | ALREADY COVERED | ADR-0041; S-047 | High | No |
| [R044](#r044) | Objective continuity crosses providers and sessions | Continuity & handoff | BLUEPRINT.md, LEXICON.md, workbench/docs/adr/0040-json-notepads-preserve-objective-continuity.md, workbench/specs/S-046-json-notepad-foundation/SPEC.md, workbench/specs/S-048-checkpoint-retirement/SPEC.md, workbench/sessions/.gitignore | WB-0040 WB-0035 | MERGE WITH ADR-PROPOSED-A | CAND-A | High | No |
| [R045](#r045) | New live notepads use versioned JSON | Continuity & handoff | BLUEPRINT.md, LEXICON.md, workbench/docs/adr/0040-json-notepads-preserve-objective-continuity.md, workbench/specs/S-046-json-notepad-foundation/SPEC.md, workbench/specs/S-048-checkpoint-retirement/SPEC.md, workbench/sessions/.gitignore | WB-0040 | ALREADY COVERED | ADR-0040, S-046 | High | No |
| [R046](#r046) | Editable resume state plus append-oriented work history | Continuity & handoff | BLUEPRINT.md, LEXICON.md, workbench/docs/adr/0040-json-notepads-preserve-objective-continuity.md, workbench/specs/S-046-json-notepad-foundation/SPEC.md, workbench/specs/S-048-checkpoint-retirement/SPEC.md, workbench/sessions/.gitignore | WB-0040 | ALREADY COVERED | ADR-0040, S-046 | High | No |
| [R047](#r047) | Capture by survival value, not exhaustive event logging | Continuity & handoff | BLUEPRINT.md, LEXICON.md, workbench/docs/adr/0040-json-notepads-preserve-objective-continuity.md, workbench/specs/S-046-json-notepad-foundation/SPEC.md, workbench/specs/S-048-checkpoint-retirement/SPEC.md, workbench/sessions/.gitignore | WB-0040 | ALREADY COVERED | ADR-0040 | High | No |
| [R048](#r048) | Raw live notes remain local and non-authoritative | Continuity & handoff | BLUEPRINT.md, LEXICON.md, workbench/docs/adr/0040-json-notepads-preserve-objective-continuity.md, workbench/specs/S-046-json-notepad-foundation/SPEC.md, workbench/specs/S-048-checkpoint-retirement/SPEC.md, workbench/sessions/.gitignore | WB-0028 WB-0040 | MERGE WITH ADR-PROPOSED-N | CAND-N; CAND-Q | High | No |
| [R049](#r049) | Dispose only after reconciliation; preserve unresolved material | Continuity & handoff | BLUEPRINT.md, LEXICON.md, workbench/docs/adr/0040-json-notepads-preserve-objective-continuity.md, workbench/specs/S-046-json-notepad-foundation/SPEC.md, workbench/specs/S-048-checkpoint-retirement/SPEC.md, workbench/sessions/.gitignore | WB-0040 | ALREADY COVERED | ADR-0040, S-046 P-2 | High | No |
| [R050](#r050) | A handoff is authored for a particular receiver and purpose | Continuity & handoff | BLUEPRINT.md, LEXICON.md, workbench/docs/adr/0040-json-notepads-preserve-objective-continuity.md, workbench/specs/S-046-json-notepad-foundation/SPEC.md, workbench/specs/S-048-checkpoint-retirement/SPEC.md, workbench/sessions/.gitignore | WB-0035 WB-0040 | ALREADY COVERED | ADR-0040; S-046 | Medium | No |
| [R051](#r051) | Checkpointing and handoff are not session termination | Continuity & handoff | BLUEPRINT.md, LEXICON.md, workbench/docs/adr/0040-json-notepads-preserve-objective-continuity.md, workbench/specs/S-046-json-notepad-foundation/SPEC.md, workbench/specs/S-048-checkpoint-retirement/SPEC.md, workbench/sessions/.gitignore | - | KEEP - DOC | RUNBOOK.md; CAND-Q | High | No |
| [R052](#r052) | Preserve the entire question inventory and stable IDs | Continuity & handoff | BLUEPRINT.md, LEXICON.md, workbench/docs/adr/0040-json-notepads-preserve-objective-continuity.md, workbench/specs/S-046-json-notepad-foundation/SPEC.md, workbench/specs/S-048-checkpoint-retirement/SPEC.md, workbench/sessions/.gitignore | - | MERGE WITH ADR-0040 | ADR-0040; S-046 | MediumHigh | No |
| [R053](#r053) | One live session record; duplicates must declare supersession | Continuity & handoff | BLUEPRINT.md, LEXICON.md, workbench/docs/adr/0040-json-notepads-preserve-objective-continuity.md, workbench/specs/S-046-json-notepad-foundation/SPEC.md, workbench/specs/S-048-checkpoint-retirement/SPEC.md, workbench/sessions/.gitignore | WB-0040 | KEEP - CONTRACT | S-046; CAND-F | High | No |
| [R054](#r054) | Cross-host transport is explicit, not incidental Git sync | Continuity & handoff | BLUEPRINT.md, LEXICON.md, workbench/docs/adr/0040-json-notepads-preserve-objective-continuity.md, workbench/specs/S-046-json-notepad-foundation/SPEC.md, workbench/specs/S-048-checkpoint-retirement/SPEC.md, workbench/sessions/.gitignore | WB-0040 | KEEP - ADR | CAND-N | High | No |
| [R055](#r055) | Durable evidence must survive its stated recovery boundary | Continuity & handoff | BLUEPRINT.md, LEXICON.md, workbench/docs/adr/0040-json-notepads-preserve-objective-continuity.md, workbench/specs/S-046-json-notepad-foundation/SPEC.md, workbench/specs/S-048-checkpoint-retirement/SPEC.md, workbench/sessions/.gitignore | WB-0028 WB-0031 | MERGE WITH ADR-PROPOSED-H | CAND-H | High | No |
| [R056](#r056) | Small reusable primitives and thin entrypoints | Skill composition & bundle | skills/README.md, workbench/manifest.json, tools/core-skill-installer.mjs, tools/skill-presence.mjs, tools/test-core-skill-installer.mjs | - | MERGE WITH ADR-PROPOSED-E | CAND-E | Medium | No |
| [R057](#r057) | Invocation, composition and authorization are separate axes | Skill composition & bundle | skills/README.md, workbench/manifest.json, tools/core-skill-installer.mjs, tools/skill-presence.mjs, tools/test-core-skill-installer.mjs | - | MERGE WITH ADR-PROPOSED-E | CAND-E | Medium | No |
| [R058](#r058) | A primitive is agnostic to its first caller | Skill composition & bundle | skills/README.md, workbench/manifest.json, tools/core-skill-installer.mjs, tools/skill-presence.mjs, tools/test-core-skill-installer.mjs | - | MERGE WITH ADR-PROPOSED-E | CAND-E | Medium | No |
| [R059](#r059) | Compose within existing authorization without repeating approval | Skill composition & bundle | skills/README.md, workbench/manifest.json, tools/core-skill-installer.mjs, tools/skill-presence.mjs, tools/test-core-skill-installer.mjs | WB-0027 | MERGE WITH ADR-PROPOSED-E | CAND-E | Medium | No |
| [R060](#r060) | Skill callability needs verification at the host boundary | Skill composition & bundle | skills/README.md, workbench/manifest.json, tools/core-skill-installer.mjs, tools/skill-presence.mjs, tools/test-core-skill-installer.mjs | WB-0005 | MERGE WITH ADR-PROPOSED-P | CAND-P; CAND-E | MediumHigh | No |
| [R061](#r061) | Skill metadata must distinguish invocation from mere mention | Skill composition & bundle | skills/README.md, workbench/manifest.json, tools/core-skill-installer.mjs, tools/skill-presence.mjs, tools/test-core-skill-installer.mjs | - | KEEP - DOC | skills composition guidance; CAND-E | MediumHigh | No |
| [R062](#r062) | Skill names should avoid accidental everyday triggers | Skill composition & bundle | skills/README.md, workbench/manifest.json, tools/core-skill-installer.mjs, tools/skill-presence.mjs, tools/test-core-skill-installer.mjs | - | KEEP - DOC | skills/README.md | Medium | No |
| [R063](#r063) | Delete empty document stubs instead of implying completeness | Skill composition & bundle | skills/README.md, workbench/manifest.json, tools/core-skill-installer.mjs, tools/skill-presence.mjs, tools/test-core-skill-installer.mjs | - | KEEP - DOC | skills authoring guidance | High | No |
| [R064](#r064) | Stances change method without changing authority | Skill composition & bundle | skills/README.md, workbench/manifest.json, tools/core-skill-installer.mjs, tools/skill-presence.mjs, tools/test-core-skill-installer.mjs | WB-0036 | ALREADY COVERED | ADR-0036 | High | No |
| [R065](#r065) | Grilling establishes shared understanding before promotion | Skill composition & bundle | skills/README.md, workbench/manifest.json, tools/core-skill-installer.mjs, tools/skill-presence.mjs, tools/test-core-skill-installer.mjs | WB-0035 | ALREADY COVERED | ADR-0035, grilling skill | MediumHigh | No |
| [R066](#r066) | Plan unknown work through decision tasks before implementation | Skill composition & bundle | skills/README.md, workbench/manifest.json, tools/core-skill-installer.mjs, tools/skill-presence.mjs, tools/test-core-skill-installer.mjs | - | KEEP - DOC | RUNBOOK / wayfinder | Medium | No |
| [R067](#r067) | Lifecycle stages remain independently usable skills | Skill composition & bundle | skills/README.md, workbench/manifest.json, tools/core-skill-installer.mjs, tools/skill-presence.mjs, tools/test-core-skill-installer.mjs | - | MERGE WITH ADR-PROPOSED-E | CAND-E | Medium | No |
| [R068](#r068) | One stable shared discovery home across providers | Skill composition & bundle | skills/README.md, workbench/manifest.json, tools/core-skill-installer.mjs, tools/skill-presence.mjs, tools/test-core-skill-installer.mjs | - | KEEP - ADR | CAND-F | High | No |
| [R069](#r069) | Bundle the portable core; install missing skills without overwriting custom ones | Skill composition & bundle | skills/README.md, workbench/manifest.json, tools/core-skill-installer.mjs, tools/skill-presence.mjs, tools/test-core-skill-installer.mjs | WB-0036 | ALREADY COVERED | ADR-0036, skillPolicy | High | No |
| [R070](#r070) | Genesis, adoption and upgrade are different operations | Adoption, upgrade & installed integrity | RUNBOOK.md, tools/workbench-adoption.mjs, tools/workbench-upgrade.mjs, workbench/docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md, workbench/specs/S-041-recorded-baseline-availability/SPEC.md, tools/control-fidelity.mjs | - | KEEP - ADR | CAND-G | High | No |
| [R071](#r071) | Adopt real projects without erasing their history | Adoption, upgrade & installed integrity | RUNBOOK.md, tools/workbench-adoption.mjs, tools/workbench-upgrade.mjs, workbench/docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md, workbench/specs/S-041-recorded-baseline-availability/SPEC.md, tools/control-fidelity.mjs | WB-0031 WB-0032 | MERGE WITH ADR-PROPOSED-G | CAND-G | High | No |
| [R072](#r072) | Managed runtime files have one owner and explicit update receipts | Adoption, upgrade & installed integrity | RUNBOOK.md, tools/workbench-adoption.mjs, tools/workbench-upgrade.mjs, workbench/docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md, workbench/specs/S-041-recorded-baseline-availability/SPEC.md, tools/control-fidelity.mjs | WB-0031 | ALREADY COVERED | ADR-0031 | High | No |
| [R073](#r073) | Preflight every consumed source lane before mutation | Adoption, upgrade & installed integrity | RUNBOOK.md, tools/workbench-adoption.mjs, tools/workbench-upgrade.mjs, workbench/docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md, workbench/specs/S-041-recorded-baseline-availability/SPEC.md, tools/control-fidelity.mjs | WB-0031 | MERGE WITH ADR-PROPOSED-G | CAND-G | High | No |
| [R074](#r074) | Release, adopted files and running behavior are separate states | Adoption, upgrade & installed integrity | RUNBOOK.md, tools/workbench-adoption.mjs, tools/workbench-upgrade.mjs, workbench/docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md, workbench/specs/S-041-recorded-baseline-availability/SPEC.md, tools/control-fidelity.mjs | AU-0004 WB-0031 | KEEP - ADR | CAND-H | High | No |
| [R075](#r075) | Use the manifest's exact integration branch | Adoption, upgrade & installed integrity | RUNBOOK.md, tools/workbench-adoption.mjs, tools/workbench-upgrade.mjs, workbench/docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md, workbench/specs/S-041-recorded-baseline-availability/SPEC.md, tools/control-fidelity.mjs | WB-0039 | ALREADY COVERED | ADR-0039 | High | No |
| [R076](#r076) | Review the immutable integration candidate independently | Delivery, remote recovery & integration | AGENTS.md, workbench/docs/adr/0037-independent-review-at-integration.md, workbench/docs/adr/0039-the-integration-branch-is-a-manifest-declared-fact.md | WB-0037 | ALREADY COVERED | ADR-0037 | High | No |
| [R077](#r077) | Target movement requires review of the resulting candidate | Delivery, remote recovery & integration | AGENTS.md, workbench/docs/adr/0037-independent-review-at-integration.md, workbench/docs/adr/0039-the-integration-branch-is-a-manifest-declared-fact.md | WB-0037 | MERGE WITH ADR-0037 | ADR-0037 | High | No |
| [R078](#r078) | Remote recovery is proven by the actual ref and object | Delivery, remote recovery & integration | AGENTS.md, workbench/docs/adr/0037-independent-review-at-integration.md, workbench/docs/adr/0039-the-integration-branch-is-a-manifest-declared-fact.md | - | MERGE WITH ADR-0037 | ADR-0037; CAND-H | High | No |
| [R079](#r079) | Preserve dirty work and recover before cleanup | Delivery, remote recovery & integration | AGENTS.md, workbench/docs/adr/0037-independent-review-at-integration.md, workbench/docs/adr/0039-the-integration-branch-is-a-manifest-declared-fact.md | - | MERGE WITH ADR-0037 | ADR-0037; CAND-H | High | No |
| [R080](#r080) | Public products exclude private instance state | Adoption, upgrade & installed integrity | RUNBOOK.md, tools/workbench-adoption.mjs, tools/workbench-upgrade.mjs, workbench/docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md, workbench/specs/S-041-recorded-baseline-availability/SPEC.md, tools/control-fidelity.mjs | WB-0031 | MERGE WITH ADR-0026 | ADR-0026 amendment | Medium | No |
| [R081](#r081) | Package mechanically; review publication judgment independently | Adoption, upgrade & installed integrity | RUNBOOK.md, tools/workbench-adoption.mjs, tools/workbench-upgrade.mjs, workbench/docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md, workbench/specs/S-041-recorded-baseline-availability/SPEC.md, tools/control-fidelity.mjs | - | MERGE WITH ADR-0037 | ADR-0037; ADR-0027 | Medium | No |
| [R082](#r082) | Integration delivery does not grant main promotion | Delivery, remote recovery & integration | AGENTS.md, workbench/docs/adr/0037-independent-review-at-integration.md, workbench/docs/adr/0039-the-integration-branch-is-a-manifest-declared-fact.md | WB-0039 | ALREADY COVERED | AGENTS.md, ADR-0039 | High | No |
| [R083](#r083) | Completion must reconcile the owning downstream boundary | Delivery, remote recovery & integration | AGENTS.md, workbench/docs/adr/0037-independent-review-at-integration.md, workbench/docs/adr/0039-the-integration-branch-is-a-manifest-declared-fact.md | GO-0024 WB-0037 | MERGE WITH ADR-0037 | ADR-0037; CAND-H | High | No |
| [R084](#r084) | Human-readable staged setup rather than an opaque giant wizard | Adoption, upgrade & installed integrity | RUNBOOK.md, tools/workbench-adoption.mjs, tools/workbench-upgrade.mjs, workbench/docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md, workbench/specs/S-041-recorded-baseline-availability/SPEC.md, tools/control-fidelity.mjs | - | KEEP - DOC | README.md / RUNBOOK.md | Medium | No |
| [R085](#r085) | Prove the harness improves work, not just its own score | Evidence, review & evaluation | AGENTS.md, workbench/feedback/REPORT_FORMAT.md, evals/README.md, outcomes/README.md, tools/test-cross-provider-fixture.mjs | - | KEEP - ADR | CAND-C | High | No |
| [R086](#r086) | Use held-out, condition-blind comparisons | Evidence, review & evaluation | AGENTS.md, workbench/feedback/REPORT_FORMAT.md, evals/README.md, outcomes/README.md, tools/test-cross-provider-fixture.mjs | - | MERGE WITH ADR-PROPOSED-C | CAND-C | High | No |
| [R087](#r087) | Judge resulting state and honest incompleteness | Evidence, review & evaluation | AGENTS.md, workbench/feedback/REPORT_FORMAT.md, evals/README.md, outcomes/README.md, tools/test-cross-provider-fixture.mjs | - | MERGE WITH ADR-PROPOSED-C | CAND-C | High | No |
| [R088](#r088) | Inspection, observed use and behavioral tests stay separate | Evidence, review & evaluation | AGENTS.md, workbench/feedback/REPORT_FORMAT.md, evals/README.md, outcomes/README.md, tools/test-cross-provider-fixture.mjs | AU-0001 | KEEP - CONTRACT | workbench/feedback/REPORT_FORMAT.md | High | No |
| [R089](#r089) | Evaluated model and reviewer model are independent fields | Evidence, review & evaluation | AGENTS.md, workbench/feedback/REPORT_FORMAT.md, evals/README.md, outcomes/README.md, tools/test-cross-provider-fixture.mjs | AU-0002 | KEEP - CONTRACT | workbench/feedback/REPORT_FORMAT.md | High | No |
| [R090](#r090) | One finding can have many observations and occurrences | Evidence, review & evaluation | AGENTS.md, workbench/feedback/REPORT_FORMAT.md, evals/README.md, outcomes/README.md, tools/test-cross-provider-fixture.mjs | AU-0003 | KEEP - DOC | workbench/feedback/REPORT_FORMAT.md; Audit owner | High | No |
| [R091](#r091) | Execution failures are not automatically harness defects | Evidence, review & evaluation | AGENTS.md, workbench/feedback/REPORT_FORMAT.md, evals/README.md, outcomes/README.md, tools/test-cross-provider-fixture.mjs | AU-0004 | KEEP - CONTRACT | workbench/feedback/REPORT_FORMAT.md | MediumHigh | No |
| [R092](#r092) | Investigate a finding before repairing it | Evidence, review & evaluation | AGENTS.md, workbench/feedback/REPORT_FORMAT.md, evals/README.md, outcomes/README.md, tools/test-cross-provider-fixture.mjs | WB-0037 WB-0038 | ALREADY COVERED | REPORT_FORMAT.md | High | No |
| [R093](#r093) | Audit Workbench owns independent review history and visualization | Evidence, review & evaluation | AGENTS.md, workbench/feedback/REPORT_FORMAT.md, evals/README.md, outcomes/README.md, tools/test-cross-provider-fixture.mjs | AU-0006 | OUT OF SCOPE | Audit_Workbench | High | No |
| [R094](#r094) | Central review storage with a standalone fallback | Evidence, review & evaluation | AGENTS.md, workbench/feedback/REPORT_FORMAT.md, evals/README.md, outcomes/README.md, tools/test-cross-provider-fixture.mjs | AU-0006 | OUT OF SCOPE | Audit_Workbench | MediumHigh | No |
| [R095](#r095) | The reviewer must itself be reviewed independently | Evidence, review & evaluation | AGENTS.md, workbench/feedback/REPORT_FORMAT.md, evals/README.md, outcomes/README.md, tools/test-cross-provider-fixture.mjs | - | OUT OF SCOPE | Audit_Workbench | High | No |
| [R096](#r096) | Separate source development, deployment and audit roles across rooms | Evidence, review & evaluation | AGENTS.md, workbench/feedback/REPORT_FORMAT.md, evals/README.md, outcomes/README.md, tools/test-cross-provider-fixture.mjs | - | MERGE WITH ADR-0026 | ADR-0026 amendment | MediumHigh | No |
| [R097](#r097) | Review each adopted release and preserve longitudinal comparisons | Evidence, review & evaluation | AGENTS.md, workbench/feedback/REPORT_FORMAT.md, evals/README.md, outcomes/README.md, tools/test-cross-provider-fixture.mjs | AU-0004 | OUT OF SCOPE | Audit_Workbench | Medium | No |
| [R098](#r098) | Measure owner coordination work as harness friction | Evidence, review & evaluation | AGENTS.md, workbench/feedback/REPORT_FORMAT.md, evals/README.md, outcomes/README.md, tools/test-cross-provider-fixture.mjs | - | ALREADY COVERED | S-049 | High | No |
| [R099](#r099) | Preserve visibility and epistemic states rather than filling gaps | Evidence, review & evaluation | AGENTS.md, workbench/feedback/REPORT_FORMAT.md, evals/README.md, outcomes/README.md, tools/test-cross-provider-fixture.mjs | - | KEEP - CONTRACT | workbench/feedback/REPORT_FORMAT.md | Medium | No |
| [R100](#r100) | Do not weaken criteria to make self-improvement look successful | Evidence, review & evaluation | AGENTS.md, workbench/feedback/REPORT_FORMAT.md, evals/README.md, outcomes/README.md, tools/test-cross-provider-fixture.mjs | - | MERGE WITH ADR-PROPOSED-C | CAND-C | High | No |
| [R101](#r101) | Feedback repair loops are bounded and independently reviewed | Evidence, review & evaluation | AGENTS.md, workbench/feedback/REPORT_FORMAT.md, evals/README.md, outcomes/README.md, tools/test-cross-provider-fixture.mjs | - | OUT OF SCOPE | Audit_Workbench | Medium | No |
| [R102](#r102) | Setup proof precedes the feedback workflow | Evidence, review & evaluation | AGENTS.md, workbench/feedback/REPORT_FORMAT.md, evals/README.md, outcomes/README.md, tools/test-cross-provider-fixture.mjs | WB-0038 | ALREADY COVERED | ADR-0038 | High | No |
| [R103](#r103) | Prefer real useful acceptance work over artificial workflow evidence | Evidence, review & evaluation | AGENTS.md, workbench/feedback/REPORT_FORMAT.md, evals/README.md, outcomes/README.md, tools/test-cross-provider-fixture.mjs | WB-0038 | MERGE WITH ADR-PROPOSED-C | CAND-C | High | No |
| [R104](#r104) | Reuse the existing behavioral evaluation runner before building another | Evidence, review & evaluation | AGENTS.md, workbench/feedback/REPORT_FORMAT.md, evals/README.md, outcomes/README.md, tools/test-cross-provider-fixture.mjs | AU-0005 | OUT OF SCOPE | Audit_Workbench | High | No |
| [R105](#r105) | Report permission fidelity across prose and provider controls | Evidence, review & evaluation | AGENTS.md, workbench/feedback/REPORT_FORMAT.md, evals/README.md, outcomes/README.md, tools/test-cross-provider-fixture.mjs | AU-0007 WB-0005 | KEEP - ADR | CAND-K | High | No |
| [R106](#r106) | One durable writer per shared surface | Coordination & concurrency | AGENTS.md, workbench/specs/S-020-spec-native-team-coordination/SPEC.md, team templates/MANAGER.md | - | ALREADY COVERED | AGENTS.md; S-020 | MediumHigh | No |
| [R107](#r107) | A durable task is distinct from a worker or attempt | Coordination & concurrency | AGENTS.md, workbench/specs/S-020-spec-native-team-coordination/SPEC.md, team templates/MANAGER.md | - | OUT OF SCOPE | Historical packet; original extension owner | High | No |
| [R108](#r108) | Rejection and in-scope repair stay on the same task | Coordination & concurrency | AGENTS.md, workbench/specs/S-020-spec-native-team-coordination/SPEC.md, team templates/MANAGER.md | - | OUT OF SCOPE | Historical packet; original extension owner | High | No |
| [R109](#r109) | Captain directs; Steward manages bounded execution | Coordination & concurrency | AGENTS.md, workbench/specs/S-020-spec-native-team-coordination/SPEC.md, team templates/MANAGER.md | - | OUT OF SCOPE | Historical packet; original extension owner | High | No |
| [R110](#r110) | Parallel execution requires satisfied dependencies and disjoint ownership | Coordination & concurrency | AGENTS.md, workbench/specs/S-020-spec-native-team-coordination/SPEC.md, team templates/MANAGER.md | - | ALREADY COVERED | AGENTS.md; S-020 | Medium | No |
| [R111](#r111) | Keep implementation, review and mutation authority distinct | Coordination & concurrency | AGENTS.md, workbench/specs/S-020-spec-native-team-coordination/SPEC.md, team templates/MANAGER.md | WB-0037 | ALREADY COVERED | ADR-0037; AGENTS.md | High | No |
| [R112](#r112) | The seven Flight stages must form a real installed chain | Coordination & concurrency | AGENTS.md, workbench/specs/S-020-spec-native-team-coordination/SPEC.md, team templates/MANAGER.md | - | OUT OF SCOPE | Historical packet; original extension owner | High | No |
| [R113](#r113) | Handoffs preserve context and exact evidence, not authority | Coordination & concurrency | AGENTS.md, workbench/specs/S-020-spec-native-team-coordination/SPEC.md, team templates/MANAGER.md | WB-0040 GO-0012 | ALREADY COVERED | ADR-0040; ADR-0027; S-046 | High | No |
| [R114](#r114) | Preflight checks facts immediately before sensitive execution | Coordination & concurrency | AGENTS.md, workbench/specs/S-020-spec-native-team-coordination/SPEC.md, team templates/MANAGER.md | - | MERGE WITH ADR-0037 | ADR-0037; CAND-H | Medium | No |
| [R115](#r115) | One lifecycle transaction includes one Journal event | Coordination & concurrency | AGENTS.md, workbench/specs/S-020-spec-native-team-coordination/SPEC.md, team templates/MANAGER.md | - | OUT OF SCOPE | Historical packet; original extension owner | High | No |
| [R116](#r116) | Cooperative compare-and-swap is not hostile-writer enforcement | Coordination & concurrency | AGENTS.md, workbench/specs/S-020-spec-native-team-coordination/SPEC.md, team templates/MANAGER.md | - | OUT OF SCOPE | Historical packet; original extension owner | High | No |
| [R117](#r117) | Multi-repository parents aggregate immutable child results | Coordination & concurrency | AGENTS.md, workbench/specs/S-020-spec-native-team-coordination/SPEC.md, team templates/MANAGER.md | - | OUT OF SCOPE | Historical packet; original extension owner | High | No |
| [R118](#r118) | Bound automatic repair and distinguish ambiguous results | Coordination & concurrency | AGENTS.md, workbench/specs/S-020-spec-native-team-coordination/SPEC.md, team templates/MANAGER.md | - | OUT OF SCOPE | Historical packet; original extension owner | High | No |
| [R119](#r119) | Versioned lifecycle migration has one live writer | Coordination & concurrency | AGENTS.md, workbench/specs/S-020-spec-native-team-coordination/SPEC.md, team templates/MANAGER.md | - | OUT OF SCOPE | Historical packet; original extension owner | High | No |
| [R120](#r120) | Date-only freshness uses the declared local day | Coordination & concurrency | AGENTS.md, workbench/specs/S-020-spec-native-team-coordination/SPEC.md, team templates/MANAGER.md | - | KEEP - DOC | RUNBOOK.md; diagnostic owner | Medium | No |
| [R121](#r121) | Evidence partition must preserve exact prior bytes and proof boundaries | Evidence, review & evaluation | AGENTS.md, workbench/feedback/REPORT_FORMAT.md, evals/README.md, outcomes/README.md, tools/test-cross-provider-fixture.mjs | - | KEEP - DOC | RUNBOOK.md | Medium | No |
| [R122](#r122) | Foundry connects Workbench rooms through optional capabilities | Extension architecture (Foundry/CIC/Audit) | BLUEPRINT.md, workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md, workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md | WB-0015 | OUT OF SCOPE | Historical packet; original extension owner | High | No |
| [R123](#r123) | Sockets are capability contracts; modules use declared interfaces | Extension architecture (Foundry/CIC/Audit) | BLUEPRINT.md, workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md, workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md | - | OUT OF SCOPE | Historical packet; original extension owner | High | No |
| [R124](#r124) | Socket-to-module cardinality is asymmetric many-to-many | Extension architecture (Foundry/CIC/Audit) | BLUEPRINT.md, workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md, workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md | - | OUT OF SCOPE | Historical packet; original extension owner | High | No |
| [R125](#r125) | Blessed means a suitable implementation, not owner authorship | Extension architecture (Foundry/CIC/Audit) | BLUEPRINT.md, workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md, workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md | - | OUT OF SCOPE | Historical packet; original extension owner | High | No |
| [R126](#r126) | Halls are vertical functional boundaries | Extension architecture (Foundry/CIC/Audit) | BLUEPRINT.md, workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md, workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md | - | OUT OF SCOPE | Historical packet; original extension owner | High | No |
| [R127](#r127) | Separate domain core, execution engine and orchestration | Extension architecture (Foundry/CIC/Audit) | BLUEPRINT.md, workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md, workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md | - | OUT OF SCOPE | Historical packet; original extension owner | High | No |
| [R128](#r128) | Replace scaffolding only after preserving its rules in the successor | Extension architecture (Foundry/CIC/Audit) | BLUEPRINT.md, workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md, workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md | - | OUT OF SCOPE | Historical packet; original extension owner | High | No |
| [R129](#r129) | Each Hall builds the deterministic workers it needs | Extension architecture (Foundry/CIC/Audit) | BLUEPRINT.md, workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md, workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md | - | OUT OF SCOPE | Historical packet; original extension owner | High | No |
| [R130](#r130) | Gatehouse enforces passage but does not grant authority | Extension architecture (Foundry/CIC/Audit) | BLUEPRINT.md, workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md, workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md | GO-0006 | OUT OF SCOPE | Historical packet; original extension owner | High | No |
| [R131](#r131) | Scheduling, orchestration, validation and audit have separate responsibilities | Extension architecture (Foundry/CIC/Audit) | BLUEPRINT.md, workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md, workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md | - | OUT OF SCOPE | Historical packet; original extension owner | High | No |
| [R132](#r132) | Public source, installed module and running service have distinct owners | Extension architecture (Foundry/CIC/Audit) | BLUEPRINT.md, workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md, workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md | - | OUT OF SCOPE | Historical packet; original extension owner | High | No |
| [R133](#r133) | Operating identity is independent of the model engine | Extension architecture (Foundry/CIC/Audit) | BLUEPRINT.md, workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md, workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md | - | OUT OF SCOPE | Historical packet; original extension owner | High | No |
| [R134](#r134) | CAS separates owner-facing direction, factory execution and outside-world assistance | Extension architecture (Foundry/CIC/Audit) | BLUEPRINT.md, workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md, workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md | - | OUT OF SCOPE | Historical packet; original extension owner | High | No |
| [R135](#r135) | A connected system must still cold-start from its own records | Extension architecture (Foundry/CIC/Audit) | BLUEPRINT.md, workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md, workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md | - | MERGE WITH ADR-PROPOSED-A | CAND-A | High | No |
| [R136](#r136) | Cross-machine sync targets selected structure and knowledge | Extension architecture (Foundry/CIC/Audit) | BLUEPRINT.md, workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md, workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md | - | KEEP - DOC | RUNBOOK.md; CAND-N scope note | Medium | No |
| [R137](#r137) | Schematic explains intended design; CIC mirrors live state | Extension architecture (Foundry/CIC/Audit) | BLUEPRINT.md, workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md, workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md | - | OUT OF SCOPE | Historical packet; original extension owner | High | No |
| [R138](#r138) | Show workflow, governance and structure as distinct views | Extension architecture (Foundry/CIC/Audit) | BLUEPRINT.md, workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md, workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md | - | OUT OF SCOPE | Historical packet; original extension owner | High | No |
| [R139](#r139) | The simulator is deterministic and can expose failure paths | Extension architecture (Foundry/CIC/Audit) | BLUEPRINT.md, workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md, workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md | - | OUT OF SCOPE | Historical packet; original extension owner | High | No |
| [R140](#r140) | Draft, explicit send and authorized work are separate states | Extension architecture (Foundry/CIC/Audit) | BLUEPRINT.md, workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md, workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md | - | OUT OF SCOPE | Historical packet; original extension owner | High | No |
| [R141](#r141) | Show the selected route and preserve the task's home | Extension architecture (Foundry/CIC/Audit) | BLUEPRINT.md, workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md, workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md | - | OUT OF SCOPE | Historical packet; original extension owner | High | No |
| [R142](#r142) | A dashboard state change can express intent without completing work | Extension architecture (Foundry/CIC/Audit) | BLUEPRINT.md, workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md, workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md | - | OUT OF SCOPE | Historical packet; original extension owner | High | No |
| [R143](#r143) | Liveness, load, reasoning effort and work status are separate signals | Extension architecture (Foundry/CIC/Audit) | BLUEPRINT.md, workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md, workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md | - | OUT OF SCOPE | Historical packet; original extension owner | High | No |
| [R144](#r144) | Heartbeat is an authoritative snapshot plus observer acknowledgement | Extension architecture (Foundry/CIC/Audit) | BLUEPRINT.md, workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md, workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md | - | OUT OF SCOPE | Historical packet; original extension owner | High | No |
| [R145](#r145) | No silent activation | Extension architecture (Foundry/CIC/Audit) | BLUEPRINT.md, workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md, workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md | - | OUT OF SCOPE | Historical packet; original extension owner | High | No |
| [R146](#r146) | Projection is a shared cached entry surface, with visible staleness | Extension architecture (Foundry/CIC/Audit) | BLUEPRINT.md, workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md, workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md | WB-0042 | KEEP - DOC | Projection guidance; ADR-0042 | Medium | No |
| [R147](#r147) | Flight Rack aggregates counts and preserves individual history | Extension architecture (Foundry/CIC/Audit) | BLUEPRINT.md, workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md, workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md | - | OUT OF SCOPE | Historical packet; original extension owner | High | No |
| [R148](#r148) | Accessibility is part of operational telemetry | Extension architecture (Foundry/CIC/Audit) | BLUEPRINT.md, workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md, workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md | - | OUT OF SCOPE | Historical packet; original extension owner | High | No |
| [R149](#r149) | Owner-visible acceptance goes beyond server health | Extension architecture (Foundry/CIC/Audit) | BLUEPRINT.md, workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md, workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md | - | MERGE WITH ADR-PROPOSED-C | CAND-C | Medium | No |
| [R150](#r150) | Python is the owner's stated preferred runtime language | Open owner choices | RUNBOOK.md, workbench/manifest.json, tools/test-portability-matrix.mjs, tools/test-cross-provider-fixture.mjs, workbench/specs/S-036-v3-1-2-evidence-corrections/SPEC.md | - | KEEP - ADR | CAND-O | High | No |
| [R151](#r151) | Native provider adapters and hard hooks need an explicit choice | Open owner choices | RUNBOOK.md, workbench/manifest.json, tools/test-portability-matrix.mjs, tools/test-cross-provider-fixture.mjs, workbench/specs/S-036-v3-1-2-evidence-corrections/SPEC.md | WB-0005 | KEEP - ADR | CAND-P | High | No |
| [R152](#r152) | Parallel specialist ensembles were explored, not made universal | Open owner choices | RUNBOOK.md, workbench/manifest.json, tools/test-portability-matrix.mjs, tools/test-cross-provider-fixture.mjs, workbench/specs/S-036-v3-1-2-evidence-corrections/SPEC.md | - | OUT OF SCOPE | Optional coordination proposal; historical packet | Medium | No |
| [R153](#r153) | Track total delegated token/cost burden | Open owner choices | RUNBOOK.md, workbench/manifest.json, tools/test-portability-matrix.mjs, tools/test-cross-provider-fixture.mjs, workbench/specs/S-036-v3-1-2-evidence-corrections/SPEC.md | - | KEEP - DOC | evals / outcomes README | Medium | No |
| [R154](#r154) | Review stale projects before archiving | Open owner choices | RUNBOOK.md, workbench/manifest.json, tools/test-portability-matrix.mjs, tools/test-cross-provider-fixture.mjs, workbench/specs/S-036-v3-1-2-evidence-corrections/SPEC.md | - | OUT OF SCOPE | Coordinator/extension | High | No |
| [R155](#r155) | Governance policy as data with a derived matrix | Open owner choices | RUNBOOK.md, workbench/manifest.json, tools/test-portability-matrix.mjs, tools/test-cross-provider-fixture.mjs, workbench/specs/S-036-v3-1-2-evidence-corrections/SPEC.md | GO-0004 GO-0006 | OUT OF SCOPE | GPT_OS | High | No |
| [R156](#r156) | Governance verbs name operations; the complete verb catalog remained open | Open owner choices | RUNBOOK.md, workbench/manifest.json, tools/test-portability-matrix.mjs, tools/test-cross-provider-fixture.mjs, workbench/specs/S-036-v3-1-2-evidence-corrections/SPEC.md | GO-0007 | OUT OF SCOPE | GPT_OS | High | No |
| [R157](#r157) | Job Orders link their sources and bound authority by intersection | Open owner choices | RUNBOOK.md, workbench/manifest.json, tools/test-portability-matrix.mjs, tools/test-cross-provider-fixture.mjs, workbench/specs/S-036-v3-1-2-evidence-corrections/SPEC.md | GO-0009 GO-0010 GO-0011 GO-0012 | OUT OF SCOPE | GPT_OS | High | No |
| [R158](#r158) | Do not import unresolved Flightbook, Issues or sandbox choices | Open owner choices | RUNBOOK.md, workbench/manifest.json, tools/test-portability-matrix.mjs, tools/test-cross-provider-fixture.mjs, workbench/specs/S-036-v3-1-2-evidence-corrections/SPEC.md | - | OUT OF SCOPE | GPT_OS / Foundry | High | No |
| [R159](#r159) | Retired producer topology and permanent role cages are history | Open owner choices | RUNBOOK.md, workbench/manifest.json, tools/test-portability-matrix.mjs, tools/test-cross-provider-fixture.mjs, workbench/specs/S-036-v3-1-2-evidence-corrections/SPEC.md | WB-0026 WB-0036 | SUPERSEDED | ADR-0026, ADR-0036 | High | No |
| [R160](#r160) | Plane passage is selective, not a universal six-stop workflow | Authority & governance planes | AGENTS.md, LEXICON.md, workbench/docs/adr/0027-instruction-authority-is-separate-from-state-resolution.md, workbench/docs/adr/0023-mechanical-guarantees-and-agent-obligations.md | WB-0001 WB-0025 | ALREADY COVERED | ADR-0001, ADR-0025 | High | No |
| [R161](#r161) | Resolve contradictions openly before rewriting the owning claim | Authority & governance planes | AGENTS.md, LEXICON.md, workbench/docs/adr/0027-instruction-authority-is-separate-from-state-resolution.md, workbench/docs/adr/0023-mechanical-guarantees-and-agent-obligations.md | WB-0027 | ALREADY COVERED | ADR-0027 | High | No |
| [R162](#r162) | Promote is a decision-only operation; save is agnostic | Skill composition & bundle | skills/README.md, workbench/manifest.json, tools/core-skill-installer.mjs, tools/skill-presence.mjs, tools/test-core-skill-installer.mjs | - | MERGE WITH ADR-PROPOSED-F | CAND-F; CAND-E; CAND-Q | High | No |
| [R163](#r163) | Use repeatable process, not identical generated wording | Skill composition & bundle | skills/README.md, workbench/manifest.json, tools/core-skill-installer.mjs, tools/skill-presence.mjs, tools/test-core-skill-installer.mjs | - | KEEP - DOC | skills/README.md | MediumHigh | No |
| [R164](#r164) | Operational knowledge is part of docs maintenance | Records, ownership & navigation | AGENTS.md, LEXICON.md, workbench/wiki/SCHEMA.md, workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md, workbench/docs/adr/0041-visible-base62-workbench-identifiers.md | WB-0018 WB-0035 | ALREADY COVERED | AGENTS.md docs table | High | No |
| [R165](#r165) | An Example Workbench is a conformance reference, not unexplained imitation | Evidence, review & evaluation | AGENTS.md, workbench/feedback/REPORT_FORMAT.md, evals/README.md, outcomes/README.md, tools/test-cross-provider-fixture.mjs | - | MERGE WITH ADR-PROPOSED-K | CAND-K | MediumHigh | No |
| [R166](#r166) | Declared support needs a real consumer and fresh-clone proof | Adoption, upgrade & installed integrity | RUNBOOK.md, tools/workbench-adoption.mjs, tools/workbench-upgrade.mjs, workbench/docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md, workbench/specs/S-041-recorded-baseline-availability/SPEC.md, tools/control-fidelity.mjs | WB-0031 WB-0038 | MERGE WITH ADR-PROPOSED-H | CAND-H | High | No |
| [R167](#r167) | A connected Foundry can span multiple factories and one shared service layer | Extension architecture (Foundry/CIC/Audit) | BLUEPRINT.md, workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md, workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md | - | OUT OF SCOPE | Historical packet; original extension owner | High | No |
| [R168](#r168) | Owner interfaces should show the next actionable issue and its evidence | Extension architecture (Foundry/CIC/Audit) | BLUEPRINT.md, workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md, workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md | - | OUT OF SCOPE | Audit_Workbench | High | No |
| [R169](#r169) | Unavailable baseline is a third state with evidence | Adoption, upgrade & installed integrity | RUNBOOK.md, tools/workbench-adoption.mjs, tools/workbench-upgrade.mjs, workbench/docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md, workbench/specs/S-041-recorded-baseline-availability/SPEC.md, tools/control-fidelity.mjs | - | KEEP - ADR | CAND-J | High | No |
| [R170](#r170) | Template customization must preserve fixed control wording | Adoption, upgrade & installed integrity | RUNBOOK.md, tools/workbench-adoption.mjs, tools/workbench-upgrade.mjs, workbench/docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md, workbench/specs/S-041-recorded-baseline-availability/SPEC.md, tools/control-fidelity.mjs | - | MERGE WITH ADR-PROPOSED-K | CAND-K | High | No |
| [R171](#r171) | Installed skills carry their own generation and content identity | Adoption, upgrade & installed integrity | RUNBOOK.md, tools/workbench-adoption.mjs, tools/workbench-upgrade.mjs, workbench/docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md, workbench/specs/S-041-recorded-baseline-availability/SPEC.md, tools/control-fidelity.mjs | - | MERGE WITH ADR-PROPOSED-H | CAND-H; CAND-F | High | No |
| [R172](#r172) | Historical adoption provenance is distinct from current component provenance | Adoption, upgrade & installed integrity | RUNBOOK.md, tools/workbench-adoption.mjs, tools/workbench-upgrade.mjs, workbench/docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md, workbench/specs/S-041-recorded-baseline-availability/SPEC.md, tools/control-fidelity.mjs | - | MERGE WITH ADR-PROPOSED-H | CAND-H | High | No |
| [R173](#r173) | Verify runtime integrity from inside the installed room | Adoption, upgrade & installed integrity | RUNBOOK.md, tools/workbench-adoption.mjs, tools/workbench-upgrade.mjs, workbench/docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md, workbench/specs/S-041-recorded-baseline-availability/SPEC.md, tools/control-fidelity.mjs | - | MERGE WITH ADR-PROPOSED-H | CAND-H | High | No |
| [R174](#r174) | Presence-only migration must not acquire replacement effects | Adoption, upgrade & installed integrity | RUNBOOK.md, tools/workbench-adoption.mjs, tools/workbench-upgrade.mjs, workbench/docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md, workbench/specs/S-041-recorded-baseline-availability/SPEC.md, tools/control-fidelity.mjs | - | MERGE WITH ADR-PROPOSED-G | CAND-G | High | No |
| [R175](#r175) | Repair installed state explicitly without reinstalling or rewriting content | Adoption, upgrade & installed integrity | RUNBOOK.md, tools/workbench-adoption.mjs, tools/workbench-upgrade.mjs, workbench/docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md, workbench/specs/S-041-recorded-baseline-availability/SPEC.md, tools/control-fidelity.mjs | - | MERGE WITH ADR-PROPOSED-G | CAND-G | High | No |
| [R176](#r176) | Line endings are portable record syntax, not semantic state | Adoption, upgrade & installed integrity | RUNBOOK.md, tools/workbench-adoption.mjs, tools/workbench-upgrade.mjs, workbench/docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md, workbench/specs/S-041-recorded-baseline-availability/SPEC.md, tools/control-fidelity.mjs | - | KEEP - DOC | RUNBOOK.md; S-037 | MediumHigh | No |
| [R177](#r177) | Diagnostics must communicate consequence, not just severity | Authority & governance planes | AGENTS.md, LEXICON.md, workbench/docs/adr/0027-instruction-authority-is-separate-from-state-resolution.md, workbench/docs/adr/0023-mechanical-guarantees-and-agent-obligations.md | WB-0029 | ALREADY COVERED | ADR-0029, S-043 | High | No |
| [R178](#r178) | Classify legacy rooms read-only and expose all setup gaps together | Adoption, upgrade & installed integrity | RUNBOOK.md, tools/workbench-adoption.mjs, tools/workbench-upgrade.mjs, workbench/docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md, workbench/specs/S-041-recorded-baseline-availability/SPEC.md, tools/control-fidelity.mjs | - | MERGE WITH ADR-PROPOSED-G | CAND-G | High | No |
| [R179](#r179) | Open follow-ups must remain reachable outside completed specs | Records, ownership & navigation | AGENTS.md, LEXICON.md, workbench/wiki/SCHEMA.md, workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md, workbench/docs/adr/0041-visible-base62-workbench-identifiers.md | WB-0035 WB-0042 | MERGE WITH ADR-0042 | ADR-0042; existing assigned spec | High | No |
| [R180](#r180) | Tests should pin the intended invariant, not incidental global state | Evidence, review & evaluation | AGENTS.md, workbench/feedback/REPORT_FORMAT.md, evals/README.md, outcomes/README.md, tools/test-cross-provider-fixture.mjs | - | MERGE WITH ADR-PROPOSED-C | CAND-C | MediumHigh | No |
| [R181](#r181) | Finish file-changing work with verified, recoverable, reviewable state | Delivery without governance tax | AGENTS.md, workbench/tools/diagnostics.mjs, workbench/tools/spec-workbench.mjs | WB-0034 WB-0037 | ALREADY COVERED | AGENTS.md, ADR-0037 | High | No |

<a id="r001"></a>

## R001 — The Workbench is a perpetual handoff

**Historical intent:** A fresh capable agent should reconstruct the current objective, settled decisions, relevant knowledge, achieved work and next action from maintained project owners, without the owner rebuilding the conversation for it.

**Original status:** Accepted

**Why this existed:** Continuity is the product promise; a collection of control files is only its implementation.

**Assumptions and scope:** Historical local-only/checkpoint rules are narrowed by N/Q. Multiple notes are allowed; unsaved state and unpushed code are outside a confirmed saved-note recovery claim.

**Observed current state:** Controls select objective-scoped JSON notes and durable-owner reconciliation. S-046 runtime remains pending and S-048 remains planned. The cold-resume fixture passed its no-resumer rejection; no real host resume was run.

**Prior pass observation (attributed; not a new runtime test):** No ADR states fresh-agent recovery as the acceptance boundary; 0035/0040 imply it. S-046 Outcome restates it as a spec goal only.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Fresh-agent continuity applies to the whole Workbench. ADR-0040 covers unfinished local context; it must not become the sole owner of the product promise.

**Disposition:** KEEP - ADR

**Target owner:** CAND-A

**Sources:** G-6a9b3084, G-6a9cff88. Current source paths: `BLUEPRINT.md`, `LEXICON.md`, `workbench/docs/adr/0040-json-notepads-preserve-objective-continuity.md`, `workbench/specs/S-046-json-notepad-foundation/SPEC.md`, `workbench/specs/S-048-checkpoint-retirement/SPEC.md`, `workbench/sessions/.gitignore`.

<a id="r002"></a>

## R002 — Complete the assigned outcome autonomously

**Historical intent:** Investigate facts and make supported implementation decisions within assigned work. Do not invent the next task or enlarge the assignment.

**Original status:** Accepted

**Why this existed:** Autonomy was requested inside a real task, with an explicit limit on self-generated work.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Current controls separate authority and state resolution; ADRs own rationale and cannot enlarge scope. This is verified prose, not proof every agent obeys.

**Prior pass observation (attributed; not a new runtime test):** ADR-0035 + AGENTS 'Assigned Work And Stances' carry execution autonomy and the no-self-tasking limit verbatim.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. ADR-0035 + AGENTS 'Assigned Work And Stances' carry execution autonomy and the no-self-tasking limit verbatim.

**Disposition:** ALREADY COVERED

**Target owner:** ADR-0035

**Sources:** WB-0035, B-BOUNDARIES. Current source paths: `AGENTS.md`, `LEXICON.md`, `workbench/docs/adr/0027-instruction-authority-is-separate-from-state-resolution.md`, `workbench/docs/adr/0023-mechanical-guarantees-and-agent-obligations.md`.

<a id="r003"></a>

## R003 — Every imposed step must help delivery

**Historical intent:** A mandatory step must provide immediate delivery value, a checkable decision or artifact, or actual risk reduction. Uncertain-value practices remain optional for review.

**Original status:** Accepted

**Why this existed:** The Foundry repeatedly made procedural completion its own deliverable.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Doctor ran successfully with zero blockers and 33 informational findings. Registered blocking effects remain distinct from severity; delivery rules are normative.

**Prior pass observation (attributed; not a new runtime test):** ADR-0034 accepted and canonicalized_in AGENTS.md, BLUEPRINT.md.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. ADR-0034 accepted and canonicalized_in AGENTS.md, BLUEPRINT.md.

**Disposition:** ALREADY COVERED

**Target owner:** ADR-0034

**Sources:** WB-0034, B-BOUNDARIES. Current source paths: `AGENTS.md`, `workbench/tools/diagnostics.mjs`, `workbench/tools/spec-workbench.mjs`.

<a id="r004"></a>

## R004 — Standalone Workbench before coordination

**Historical intent:** A project Workbench must work by itself. Foundry, schedulers, dashboards, sockets and cross-project coordination are extensions justified by functioning Workbenches.

**Original status:** Accepted

**Why this existed:** The unfinished factory became a prerequisite for the base needed to build it.

**Assumptions and scope:** The historical system assumed Foundry/Flight/CIC or multi-room coordination. Those mechanisms are not prerequisites for the current portable base.

**Observed current state:** The live base excludes required Foundry orchestration. Historical extension records remain evidence in their original domain; existence of ancillary code does not make a base feature. No retired runtime was exercised.

**Prior pass observation (attributed; not a new runtime test):** Both accepted; AGENTS states no coordination system may be required.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. Both accepted; AGENTS states no coordination system may be required.

**Disposition:** ALREADY COVERED

**Target owner:** ADR-0015, ADR-0026

**Sources:** WB-0026, G-6a9ae606, G-6a9b3084. Current source paths: `BLUEPRINT.md`, `workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md`, `workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md`.

<a id="r005"></a>

## R005 — One canonical Workbench source and release home

**Historical intent:** LLM_Workbench authors and releases the harness. GPT_OS and other deployments adopt it; an embedded private producer is no longer upstream.

**Original status:** Accepted

**Why this existed:** Multiple authoring copies caused drift and confused ownership.

**Assumptions and scope:** The historical system assumed Foundry/Flight/CIC or multi-room coordination. Those mechanisms are not prerequisites for the current portable base.

**Observed current state:** The live base excludes required Foundry orchestration. Historical extension records remain evidence in their original domain; existence of ancillary code does not make a base feature. No retired runtime was exercised.

**Prior pass observation (attributed; not a new runtime test):** ADR-0026 names LLM_Workbench the sole source and records the rejected producer topology.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. ADR-0026 names LLM_Workbench the sole source and records the rejected producer topology.

**Disposition:** ALREADY COVERED

**Target owner:** ADR-0026

**Sources:** WB-0026. Current source paths: `BLUEPRINT.md`, `workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md`, `workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md`.

<a id="r006"></a>

## R006 — Instruction authority and implemented state are different questions

**Historical intent:** Compare accepted intent with live implementation and name an implementation gap, documentation drift, or unresolved ambiguity. Neither source code nor an ADR automatically wins every disagreement.

**Original status:** Accepted

**Why this existed:** Code-first precedence erased accepted future behavior; prose-first precedence claimed behavior never built.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Current controls separate authority and state resolution; ADRs own rationale and cannot enlarge scope. This is verified prose, not proof every agent obeys.

**Prior pass observation (attributed; not a new runtime test):** ADR-0027 splits the two lists and names the three conditions; AGENTS State Resolution carries it.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. ADR-0027 splits the two lists and names the three conditions; AGENTS State Resolution carries it.

**Disposition:** ALREADY COVERED

**Target owner:** ADR-0027

**Sources:** WB-0027, H-FR. Current source paths: `AGENTS.md`, `LEXICON.md`, `workbench/docs/adr/0027-instruction-authority-is-separate-from-state-resolution.md`, `workbench/docs/adr/0023-mechanical-guarantees-and-agent-obligations.md`.

<a id="r007"></a>

## R007 — Governance planes classify a claim in an operation

**Historical intent:** Classify the claim's use, not the entire file or directory. A spec can contain requirements, status, evidence and history, and can itself be the target of an edit.

**Original status:** Accepted

**Why this existed:** Permanent file classifications created contradictions when repairing controls or appending evidence.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Current controls separate authority and state resolution; ADRs own rationale and cannot enlarge scope. This is verified prose, not proof every agent obeys.

**Prior pass observation (attributed; not a new runtime test):** 0025 supersedes the blanket ADR/SPEC-as-Grounding rule explicitly.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. 0025 supersedes the blanket ADR/SPEC-as-Grounding rule explicitly.

**Disposition:** ALREADY COVERED

**Target owner:** ADR-0001, ADR-0025

**Sources:** WB-0025, D-GP. Current source paths: `AGENTS.md`, `LEXICON.md`, `workbench/docs/adr/0027-instruction-authority-is-separate-from-state-resolution.md`, `workbench/docs/adr/0023-mechanical-guarantees-and-agent-obligations.md`.

<a id="r008"></a>

## R008 — Binding requirements live in their current owners

**Historical intent:** Promote each binding requirement into the appropriate current control or assigned spec. ADRs preserve why, alternatives and supersession; agents must not reconstruct binding rules from historical conversations.

**Original status:** Accepted

**Why this existed:** A decision written only in history remained invisible to ordinary execution.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Current controls separate authority and state resolution; ADRs own rationale and cannot enlarge scope. This is verified prose, not proof every agent obeys.

**Prior pass observation (attributed; not a new runtime test):** ADR-0002 + canonicalized_in requirement.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. ADR-0002 + canonicalized_in requirement.

**Disposition:** ALREADY COVERED

**Target owner:** ADR-0002

**Sources:** WB-0002, D-GP. Current source paths: `AGENTS.md`, `LEXICON.md`, `workbench/docs/adr/0027-instruction-authority-is-separate-from-state-resolution.md`, `workbench/docs/adr/0023-mechanical-guarantees-and-agent-obligations.md`.

<a id="r009"></a>

## R009 — The Contract is a logical claim set

**Historical intent:** Seven root controls plus the explicitly assigned spec carry the Workbench Contract. Do not add a coequal CONTRACT.md that restates them.

**Original status:** Accepted

**Why this existed:** A new summary file would create a second owner for the same rules.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Current controls separate authority and state resolution; ADRs own rationale and cannot enlarge scope. This is verified prose, not proof every agent obeys.

**Prior pass observation (attributed; not a new runtime test):** 0033 rejects a coequal CONTRACT.md by name.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. 0033 rejects a coequal CONTRACT.md by name.

**Disposition:** ALREADY COVERED

**Target owner:** ADR-0013, ADR-0033

**Sources:** WB-0033. Current source paths: `AGENTS.md`, `LEXICON.md`, `workbench/docs/adr/0027-instruction-authority-is-separate-from-state-resolution.md`, `workbench/docs/adr/0023-mechanical-guarantees-and-agent-obligations.md`.

<a id="r010"></a>

## R010 — All planes permit CRUD subject to the operation

**Historical intent:** Create, read, update and delete are available across all planes. Append-only evidence and ADR supersession are artifact conventions, not universal plane prohibitions.

**Original status:** Accepted

**Why this existed:** Absolute plane bans prevented legitimate owner-authorized repair and obscured the actual risk.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Current controls separate authority and state resolution; ADRs own rationale and cannot enlarge scope. This is verified prose, not proof every agent obeys.

**Prior pass observation (attributed; not a new runtime test):** ADR-0003 states append-only is an artifact convention, not a plane ban.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. ADR-0003 states append-only is an artifact convention, not a plane ban.

**Disposition:** ALREADY COVERED

**Target owner:** ADR-0003

**Sources:** WB-0003, D-GP. Current source paths: `AGENTS.md`, `LEXICON.md`, `workbench/docs/adr/0027-instruction-authority-is-separate-from-state-resolution.md`, `workbench/docs/adr/0023-mechanical-guarantees-and-agent-obligations.md`.

<a id="r011"></a>

## R011 — A policy file is not enforcement

**Historical intent:** Machine enforcement requires a running consumer controlling the attempted operation. JSON, a manifest declaration, self-attestation or skill prose cannot establish it alone.

**Original status:** Accepted

**Why this existed:** The factory had rules describing walls without an executing boundary that enforced them.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Current controls separate authority and state resolution; ADRs own rationale and cannot enlarge scope. This is verified prose, not proof every agent obeys.

**Prior pass observation (attributed; not a new runtime test):** 0005 requires a running consumer; 0029 registers which consumers enforce.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. 0005 requires a running consumer; 0029 registers which consumers enforce.

**Disposition:** ALREADY COVERED

**Target owner:** ADR-0005, ADR-0023

**Sources:** WB-0005, C-ab1b55db-L37. Current source paths: `AGENTS.md`, `LEXICON.md`, `workbench/docs/adr/0027-instruction-authority-is-separate-from-state-resolution.md`, `workbench/docs/adr/0023-mechanical-guarantees-and-agent-obligations.md`.

<a id="r012"></a>

## R012 — Tools handle deterministic structure; agents handle judgment

**Historical intent:** Use deterministic tools for mechanical checks, paths, rendering and validation; use agents for intent, ambiguity, craft and honest evidence interpretation.

**Original status:** Accepted

**Why this existed:** Repeated model calls for mechanical checks cost tokens without improving the check.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Current controls separate authority and state resolution; ADRs own rationale and cannot enlarge scope. This is verified prose, not proof every agent obeys.

**Prior pass observation (attributed; not a new runtime test):** ADR-0023 also guards against the over-reading (a missing tool cannot fail ordinary work).

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. ADR-0023 also guards against the over-reading (a missing tool cannot fail ordinary work).

**Disposition:** ALREADY COVERED

**Target owner:** ADR-0023

**Sources:** WB-0023, C-ab1b55db-L37. Current source paths: `AGENTS.md`, `LEXICON.md`, `workbench/docs/adr/0027-instruction-authority-is-separate-from-state-resolution.md`, `workbench/docs/adr/0023-mechanical-guarantees-and-agent-obligations.md`.

<a id="r013"></a>

## R013 — A check can block only what it evaluates

**Historical intent:** A check may stop a relevant unsafe change; it cannot demand global completeness or the repaired future state as permission to perform the repair.

**Original status:** Accepted

**Why this existed:** Individually plausible checks composed into bootstrap deadlocks.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Doctor ran successfully with zero blockers and 33 informational findings. Registered blocking effects remain distinct from severity; delivery rules are normative.

**Prior pass observation (attributed; not a new runtime test):** ADR-0020 forbids the global-green precondition by name.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. ADR-0020 forbids the global-green precondition by name.

**Disposition:** ALREADY COVERED

**Target owner:** ADR-0020, ADR-0029

**Sources:** WB-0020, D-V3. Current source paths: `AGENTS.md`, `workbench/tools/diagnostics.mjs`, `workbench/tools/spec-workbench.mjs`.

<a id="r014"></a>

## R014 — Diagnostic effects belong to trusted consumers

**Historical intent:** Register diagnostic code, severity, scope and blocking effect in tool code. Preserve nonblocking attention; no artifact chooses whether its own finding blocks.

**Original status:** Accepted

**Why this existed:** A flat red/green report conflated unsafe manifests with unrelated stale links.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Doctor ran successfully with zero blockers and 33 informational findings. Registered blocking effects remain distinct from severity; delivery rules are normative.

**Prior pass observation (attributed; not a new runtime test):** diagnostics.mjs registers code/severity/scope/effect; verified 33 attention findings block nothing.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. diagnostics.mjs registers code/severity/scope/effect; verified 33 attention findings block nothing.

**Disposition:** ALREADY COVERED

**Target owner:** ADR-0029

**Sources:** WB-0029. Current source paths: `AGENTS.md`, `workbench/tools/diagnostics.mjs`, `workbench/tools/spec-workbench.mjs`.

<a id="r015"></a>

## R015 — Ordinary work does not need a Job Order

**Historical intent:** Human-led work and multi-chat continuation can proceed under their actual authorization without creating a Job Order or completing Flight infrastructure first.

**Original status:** Accepted

**Why this existed:** A coordination record became a gate on the work needed to make coordination usable.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Doctor ran successfully with zero blockers and 33 informational findings. Registered blocking effects remain distinct from severity; delivery rules are normative.

**Prior pass observation (attributed; not a new runtime test):** AGENTS: 'no coordination system, order form, flight, scheduler... may be required'.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. AGENTS: 'no coordination system, order form, flight, scheduler... may be required'.

**Disposition:** ALREADY COVERED

**Target owner:** ADR-0015, ADR-0026

**Sources:** GO-0021, D-V3. Current source paths: `AGENTS.md`, `workbench/tools/diagnostics.mjs`, `workbench/tools/spec-workbench.mjs`.

<a id="r016"></a>

## R016 — A report never authorizes its own repair

**Historical intent:** Review findings are evidence. The reviewer does not acquire permission to modify the audited target, dispatch repairs or publish by producing a report.

**Original status:** Accepted

**Why this existed:** Review and repair were repeatedly conflated.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Report format already requires evidence limitations and report-scoped IDs/shared recurrence keys. It does not separately name evaluated and reporting models. Outcome docs require controlled repeated comparisons; no new agent-outcome trial was run.

**Prior pass observation (attributed; not a new runtime test):** REPORT_FORMAT: 'A report never repairs its target or grants repair or automated-merge authority.'

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. REPORT_FORMAT: 'A report never repairs its target or grants repair or automated-merge authority.'

**Disposition:** ALREADY COVERED

**Target owner:** ADR-0037, REPORT_FORMAT.md

**Sources:** WB-0038, AU-0007, C-019f7dc3-L228. Current source paths: `AGENTS.md`, `workbench/feedback/REPORT_FORMAT.md`, `evals/README.md`, `outcomes/README.md`, `tools/test-cross-provider-fixture.mjs`.

<a id="r017"></a>

## R017 — Read-only applies to the named target, not every composed activity

**Historical intent:** A read-only review or navigation skill constrains its target and effects; it must not accidentally prohibit another authorized skill's notepad edits or the audit application's own development.

**Original status:** Accepted

**Why this existed:** Category-wide read-only wording became self-contradictory when the audit room reviewed itself or skills composed.

**Assumptions and scope:** Source ownership, installed state and host discovery are different. F selects one global core release; old duplicate personal sources and equality-only version diagnostics are migration concerns.

**Observed current state:** 17 source core skills are declared; promote/save are absent. Installer tests passed 12/12, including Git-owned and symlinked roots. README/Runbook refusal prose is stale; explicit replacement remains a separate path. No new compatibility-range implementation was verified.

**Prior pass observation (attributed; not a new runtime test):** No upstream rule composes read-only scope with effects; AU-0007 is the only worked example.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Composition and source ownership can change independently. Preserve reusable primitives and distinguish invocation from authorization; do not adopt a metadata schema merely because one was suggested.

**Disposition:** MERGE WITH ADR-PROPOSED-E

**Target owner:** CAND-E

**Sources:** AU-0007, C-a9e38fdd-L87. Current source paths: `skills/README.md`, `workbench/manifest.json`, `tools/core-skill-installer.mjs`, `tools/skill-presence.mjs`, `tools/test-core-skill-installer.mjs`.

<a id="r018"></a>

## R018 — Owner authorization is scoped and cannot be fabricated

**Historical intent:** An owner command authorizes a concrete scope and destination. An agent cannot manufacture owner authorization, and a child operation cannot widen the parent grant.

**Original status:** Accepted

**Why this existed:** A callable skill name and a document's existence are not a permission system.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Current controls separate authority and state resolution; ADRs own rationale and cannot enlarge scope. This is verified prose, not proof every agent obeys.

**Prior pass observation (attributed; not a new runtime test):** ADR-0027 covers instruction authority order but not the no-widening-by-child rule.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Child scope is already bounded by AGENTS and ADR-0027; record the composition example without a new authority layer.

**Disposition:** MERGE WITH ADR-0027

**Target owner:** ADR-0027

**Sources:** H-FR, GO-0009, C-019f6974-L93. Current source paths: `AGENTS.md`, `LEXICON.md`, `workbench/docs/adr/0027-instruction-authority-is-separate-from-state-resolution.md`, `workbench/docs/adr/0023-mechanical-guarantees-and-agent-obligations.md`.

<a id="r019"></a>

## R019 — Separate Proof, Audit and Owner Command

**Historical intent:** Mechanical proof, independent judgment and explicit owner authorization answer different questions and cannot substitute for one another.

**Original status:** Accepted

**Why this existed:** A passing check was sometimes treated as approval, while approval was treated as proof of delivery.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Current controls separate authority and state resolution; ADRs own rationale and cannot enlarge scope. This is verified prose, not proof every agent obeys.

**Prior pass observation (attributed; not a new runtime test):** No ADR separates mechanical proof, independent judgment and owner authorization; 0023/0037 each cover one edge.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** ADR-0037 explicitly says review grants neither repair nor publication authority. Proof/judgment/authorization is a clarification of existing owners.

**Disposition:** MERGE WITH ADR-0027

**Target owner:** ADR-0027; ADR-0037

**Sources:** H-FR. Current source paths: `AGENTS.md`, `LEXICON.md`, `workbench/docs/adr/0027-instruction-authority-is-separate-from-state-resolution.md`, `workbench/docs/adr/0023-mechanical-guarantees-and-agent-obligations.md`.

<a id="r020"></a>

## R020 — Nearest-root boot with explicit outer safety inheritance

**Historical intent:** Fresh, nested and standalone Workbenches enter through their nearest AGENTS.md. Nested rooms inherit declared outer safety boundaries, then apply the local contract.

**Original status:** Accepted

**Why this existed:** Ambient host and parent-project context broke portability and confused scope.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Current controls separate authority and state resolution; ADRs own rationale and cannot enlarge scope. This is verified prose, not proof every agent obeys.

**Prior pass observation (attributed; not a new runtime test):** ADR-0026 names the three boot shapes explicitly.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. ADR-0026 names the three boot shapes explicitly.

**Disposition:** ALREADY COVERED

**Target owner:** ADR-0026

**Sources:** WB-0026, GO-0022. Current source paths: `AGENTS.md`, `LEXICON.md`, `workbench/docs/adr/0027-instruction-authority-is-separate-from-state-resolution.md`, `workbench/docs/adr/0023-mechanical-guarantees-and-agent-obligations.md`.

<a id="r021"></a>

## R021 — No machine-global import of one project's interior

**Historical intent:** Keep a project's memory routing in its own entry bridge. A machine-global instruction file should not force every unrelated project to load a private deployment's internal path.

**Original status:** Accepted

**Why this existed:** A layout move broke a global import and unrelated sessions inherited GPT_OS context.

**Assumptions and scope:** Source release, installed generation, runtime and target containment require separate evidence; unavailable state must not be filled by inference.

**Observed current state:** Setup tools and distinct source/installed receipts exist. Adoption and upgrade recovery still use collections.checkpoints. Fidelity tests passed 15/15; this report does not certify a new upgrade or deployment.

**Prior pass observation (attributed; not a new runtime test):** Nearest-root boot consequence; no machine-global import exists in this repo.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. Nearest-root boot consequence; no machine-global import exists in this repo.

**Disposition:** ALREADY COVERED

**Target owner:** ADR-0026

**Sources:** D-V3. Current source paths: `RUNBOOK.md`, `tools/workbench-adoption.mjs`, `tools/workbench-upgrade.mjs`, `workbench/docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md`, `workbench/specs/S-041-recorded-baseline-availability/SPEC.md`, `tools/control-fidelity.mjs`.

<a id="r022"></a>

## R022 — Stable specs own capability detail; boards project active work

**Historical intent:** Blueprint holds broad direction and the spec catalog; stable specs hold requirements, acceptance, evidence and history; the hot Taskboard displays active work rather than becoming a giant second specification.

**Original status:** Accepted

**Why this existed:** Large boards consumed context and duplicated state that should have one owner.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Owners and traversal routes exist. ADR-0041 explicitly defers identifier implementation and connection identity; a declaration is not delivered migration.

**Prior pass observation (attributed; not a new runtime test):** TASKBOARD.md is a generated hot-specs projection with no separate decision store; verified.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. TASKBOARD.md is a generated hot-specs projection with no separate decision store; verified.

**Disposition:** ALREADY COVERED

**Target owner:** ADR-0033, ADR-0035

**Sources:** C-019f5915-L75, GO-0016. Current source paths: `AGENTS.md`, `LEXICON.md`, `workbench/wiki/SCHEMA.md`, `workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md`, `workbench/docs/adr/0041-visible-base62-workbench-identifiers.md`.

<a id="r023"></a>

## R023 — Size execution slices for a fresh context

**Historical intent:** Break work into bounded executable outcomes, with larger unknowns resolved before dependent implementation. Artifact size and delegation should follow actual complexity.

**Original status:** Accepted

**Why this existed:** Long chats and oversized work packets degraded judgment and made continuation expensive.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Owners and traversal routes exist. ADR-0041 explicitly defers identifier implementation and connection identity; a declaration is not delivered migration.

**Prior pass observation (attributed; not a new runtime test):** tracer-bullet skill ships; no written sizing heuristic. Token/byte thresholds were never owner-accepted.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. tracer-bullet skill ships; no written sizing heuristic. Token/byte thresholds were never owner-accepted.

**Disposition:** KEEP - DOC

**Target owner:** RUNBOOK / tracer-bullet

**Sources:** C-019f68fd-L115, C-01a054e7-L190, D-CAS. Current source paths: `AGENTS.md`, `LEXICON.md`, `workbench/wiki/SCHEMA.md`, `workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md`, `workbench/docs/adr/0041-visible-base62-workbench-identifiers.md`.

<a id="r024"></a>

## R024 — Keep completed evidence and link successors

**Historical intent:** Preserve truthful completed spec evidence and supersession links. Future capability changes belong in an active owner or linked successor, rather than rewriting completed history to look current.

**Original status:** Accepted

**Why this existed:** History is needed to understand acceptance, rejection and later changes.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Owners and traversal routes exist. ADR-0041 explicitly defers identifier implementation and connection identity; a declaration is not delivered migration.

**Prior pass observation (attributed; not a new runtime test):** AGENTS forbids rewriting append-only evidence; successor-linking has no stated owner rule.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** AGENTS already directs later capability changes to linked successors and preserves append-only evidence. R179 supplies the reachability refinement.

**Disposition:** ALREADY COVERED

**Target owner:** AGENTS.md; ADR-0042

**Sources:** B-BOUNDARIES, D-V3. Current source paths: `AGENTS.md`, `LEXICON.md`, `workbench/wiki/SCHEMA.md`, `workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md`, `workbench/docs/adr/0041-visible-base62-workbench-identifiers.md`.

<a id="r025"></a>

## R025 — Six lowercase support lanes ship as structural slots

**Historical intent:** Ship docs, specs, wiki, sessions, feedback and tools under lowercase workbench, even where a slot is empty.

**Original status:** Accepted

**Why this existed:** Undeclared folders and case differences broke clean-clone and cross-platform behavior.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Owners and traversal routes exist. ADR-0041 explicitly defers identifier implementation and connection identity; a declaration is not delivered migration.

**Prior pass observation (attributed; not a new runtime test):** Six lanes present on disk and declared in manifest schema 2.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. Six lanes present on disk and declared in manifest schema 2.

**Disposition:** ALREADY COVERED

**Target owner:** ADR-0017

**Sources:** WB-0017, D-V3. Current source paths: `AGENTS.md`, `LEXICON.md`, `workbench/wiki/SCHEMA.md`, `workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md`, `workbench/docs/adr/0041-visible-base62-workbench-identifiers.md`.

<a id="r026"></a>

## R026 — The manifest declares machine-used paths

**Historical intent:** Resolve lanes and collections through one validated manifest reader instead of guessing paths or hardcoding old layouts.

**Original status:** Accepted

**Why this existed:** A moved spec directory silently looked like an empty work queue; renderers could erase valid projections.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Owners and traversal routes exist. ADR-0041 explicitly defers identifier implementation and connection identity; a declaration is not delivered migration.

**Prior pass observation (attributed; not a new runtime test):** manifest.json schema 2 declares six lanes and seven collections; workbench-paths.mjs is the single reader.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. manifest.json schema 2 declares six lanes and seven collections; workbench-paths.mjs is the single reader.

**Disposition:** ALREADY COVERED

**Target owner:** ADR-0032

**Sources:** WB-0032, D-V3. Current source paths: `AGENTS.md`, `LEXICON.md`, `workbench/wiki/SCHEMA.md`, `workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md`, `workbench/docs/adr/0041-visible-base62-workbench-identifiers.md`.

<a id="r027"></a>

## R027 — Every project has a local Wiki

**Historical intent:** A reusable Workbench includes its own knowledge base; project memory cannot depend on a central Foundry or a particular recall service.

**Original status:** Accepted

**Why this existed:** Projects without a local brain repeatedly lost context when agents changed.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Owners and traversal routes exist. ADR-0041 explicitly defers identifier implementation and connection identity; a declaration is not delivered migration.

**Prior pass observation (attributed; not a new runtime test):** workbench/wiki/ present with MEMORY.md router and SCHEMA.md.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. workbench/wiki/ present with MEMORY.md router and SCHEMA.md.

**Disposition:** ALREADY COVERED

**Target owner:** ADR-0018

**Sources:** C-7f7acc51-L110, WB-0018. Current source paths: `AGENTS.md`, `LEXICON.md`, `workbench/wiki/SCHEMA.md`, `workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md`, `workbench/docs/adr/0041-visible-base62-workbench-identifiers.md`.

<a id="r028"></a>

## R028 — Wiki and recall index have different ownership

**Historical intent:** The maintained file Wiki owns project knowledge. Recall databases and search indexes are derived access mechanisms with provenance, not parallel authoritative memory.

**Original status:** Accepted

**Why this existed:** Provider-neutral durable knowledge should survive a database, model or retrieval service change.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Owners and traversal routes exist. ADR-0041 explicitly defers identifier implementation and connection identity; a declaration is not delivered migration.

**Prior pass observation (attributed; not a new runtime test):** SCHEMA knowledge_role already admits 'derived'; no recall-database consumer exists, so only the boundary note is owed.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. SCHEMA knowledge_role already admits 'derived'; no recall-database consumer exists, so only the boundary note is owed.

**Disposition:** KEEP - DOC

**Target owner:** workbench/wiki/SCHEMA.md

**Sources:** C-7f7acc51-L92, C-019f6684-L222. Current source paths: `AGENTS.md`, `LEXICON.md`, `workbench/wiki/SCHEMA.md`, `workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md`, `workbench/docs/adr/0041-visible-base62-workbench-identifiers.md`.

<a id="r029"></a>

## R029 — Traverse from a context map before broad searching

**Historical intent:** Make ordinary project context reachable through maintained routes, with bounded search available for missing or insufficient routes, debugging and explicit audits.

**Original status:** Accepted

**Why this existed:** Useful files existed but an agent following the official entry route could not reach them.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Owners and traversal routes exist. ADR-0041 explicitly defers identifier implementation and connection identity; a declaration is not delivered migration.

**Prior pass observation (attributed; not a new runtime test):** ADR-0042 accepted 2026-09-06, canonicalized in AGENTS/BLUEPRINT/LEXICON.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. ADR-0042 accepted 2026-09-06, canonicalized in AGENTS/BLUEPRINT/LEXICON.

**Disposition:** ALREADY COVERED

**Target owner:** ADR-0042

**Sources:** WB-0042, C-7f7acc51-L130, C-019f9aa5-L49. Current source paths: `AGENTS.md`, `LEXICON.md`, `workbench/wiki/SCHEMA.md`, `workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md`, `workbench/docs/adr/0041-visible-base62-workbench-identifiers.md`.

<a id="r030"></a>

## R030 — Lexicon is a bounded glossary and route map

**Historical intent:** Keep shared vocabulary concise and linked to its owner; local bounded contexts may add local terms without redefining shared ones. Do not rename LEXICON to CONTEXT or turn it into implementation prose.

**Original status:** Accepted

**Why this existed:** Term collisions and sprawling explanations made the common language harder to use.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Owners and traversal routes exist. ADR-0041 explicitly defers identifier implementation and connection identity; a declaration is not delivered migration.

**Prior pass observation (attributed; not a new runtime test):** LEXICON is a bounded glossary with routing; no rename occurred.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. LEXICON is a bounded glossary with routing; no rename occurred.

**Disposition:** ALREADY COVERED

**Target owner:** ADR-0042, LEXICON.md

**Sources:** C-019f6335-L263, H-FR, C-a9e38fdd-L111. Current source paths: `AGENTS.md`, `LEXICON.md`, `workbench/wiki/SCHEMA.md`, `workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md`, `workbench/docs/adr/0041-visible-base62-workbench-identifiers.md`.

<a id="r031"></a>

## R031 — Cross-context relationships are derived from existing owners

**Historical intent:** The project index and context map route to owners; they do not become another decision store, taskboard or registry of duplicated facts.

**Original status:** Accepted

**Why this existed:** A second master index becomes stale and creates another source-precedence question.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Owners and traversal routes exist. ADR-0041 explicitly defers identifier implementation and connection identity; a declaration is not delivered migration.

**Prior pass observation (attributed; not a new runtime test):** ADR-0042 rejects a second master index by name.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. ADR-0042 rejects a second master index by name.

**Disposition:** ALREADY COVERED

**Target owner:** ADR-0042, ADR-0002

**Sources:** GO-0016, H-FR. Current source paths: `AGENTS.md`, `LEXICON.md`, `workbench/wiki/SCHEMA.md`, `workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md`, `workbench/docs/adr/0041-visible-base62-workbench-identifiers.md`.

<a id="r032"></a>

## R032 — Use shallow, human-readable knowledge organization

**Historical intent:** Prefer a small router and linked notes usable in Obsidian, avoiding gratuitous numbered folders and index-on-index navigation.

**Original status:** Strong preference

**Why this existed:** The owner and agents need to read and traverse the same knowledge without elaborate tooling.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Owners and traversal routes exist. ADR-0041 explicitly defers identifier implementation and connection identity; a declaration is not delivered migration.

**Prior pass observation (attributed; not a new runtime test):** SCHEMA line 80: 'Keep every collection flat; do not add category indexes.'

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. SCHEMA line 80: 'Keep every collection flat; do not add category indexes.'

**Disposition:** ALREADY COVERED

**Target owner:** workbench/wiki/SCHEMA.md

**Sources:** C-019f6684-L9, C-019f6684-L222, C-7f7acc51-L130. Current source paths: `AGENTS.md`, `LEXICON.md`, `workbench/wiki/SCHEMA.md`, `workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md`, `workbench/docs/adr/0041-visible-base62-workbench-identifiers.md`.

<a id="r033"></a>

## R033 — Guidebooks are Wiki collections, not a new lane

**Historical intent:** Reusable procedures can live inside the knowledge base. Their writing style or common governance use does not justify a separate root lane.

**Original status:** Accepted

**Why this existed:** Folder taxonomy was being mistaken for authority or plane classification.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Owners and traversal routes exist. ADR-0041 explicitly defers identifier implementation and connection identity; a declaration is not delivered migration.

**Prior pass observation (attributed; not a new runtime test):** ADR-0018 rejects a guidebooks lane by name.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. ADR-0018 rejects a guidebooks lane by name.

**Disposition:** ALREADY COVERED

**Target owner:** ADR-0018

**Sources:** WB-0018, D-V3. Current source paths: `AGENTS.md`, `LEXICON.md`, `workbench/wiki/SCHEMA.md`, `workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md`, `workbench/docs/adr/0041-visible-base62-workbench-identifiers.md`.

<a id="r034"></a>

## R034 — Design Concepts explain the model and link evidence

**Historical intent:** A Design Concept is a full source-backed explanation of one reusable cross-cutting model, with Evidence and Sources and History; it does not replace the Blueprint, ADR, spec or task state.

**Original status:** Accepted

**Why this existed:** The owner needed the shared mental model, not another short requirements summary.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Owners and traversal routes exist. ADR-0041 explicitly defers identifier implementation and connection identity; a declaration is not delivered migration.

**Prior pass observation (attributed; not a new runtime test):** ADR-0030 requires Evidence and Sources plus History.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. ADR-0030 requires Evidence and Sources plus History.

**Disposition:** ALREADY COVERED

**Target owner:** ADR-0030

**Sources:** WB-0030, D-CONCEPTS. Current source paths: `AGENTS.md`, `LEXICON.md`, `workbench/wiki/SCHEMA.md`, `workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md`, `workbench/docs/adr/0041-visible-base62-workbench-identifiers.md`.

<a id="r035"></a>

## R035 — Design Concept creation is owner-directed

**Historical intent:** Agents may suggest a new article; owner authorization creates it. Existing articles may be repaired from direct authoritative proof, otherwise visibly marked stale.

**Original status:** Accepted

**Why this existed:** Automatic article creation risks an unnecessary shadow Wiki; silent inference can corrupt the explanation.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Owners and traversal routes exist. ADR-0041 explicitly defers identifier implementation and connection identity; a declaration is not delivered migration.

**Prior pass observation (attributed; not a new runtime test):** ADR-0030: owner alone authorizes creation; agents mark stale rather than infer.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. ADR-0030: owner alone authorizes creation; agents mark stale rather than infer.

**Disposition:** ALREADY COVERED

**Target owner:** ADR-0030

**Sources:** WB-0030, D-CONCEPTS. Current source paths: `AGENTS.md`, `LEXICON.md`, `workbench/wiki/SCHEMA.md`, `workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md`, `workbench/docs/adr/0041-visible-base62-workbench-identifiers.md`.

<a id="r036"></a>

## R036 — Parent knowledge is shared; child knowledge stays local

**Historical intent:** A parent owns concepts its children share; a child owns unique concepts and routes upward for common ones.

**Original status:** Accepted

**Why this existed:** Copying shared explanations into every room creates divergence.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Owners and traversal routes exist. ADR-0041 explicitly defers identifier implementation and connection identity; a declaration is not delivered migration.

**Prior pass observation (attributed; not a new runtime test):** Parent/child ownership stated in ADR-0030.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. Parent/child ownership stated in ADR-0030.

**Disposition:** ALREADY COVERED

**Target owner:** ADR-0030

**Sources:** WB-0030, D-CONCEPTS. Current source paths: `AGENTS.md`, `LEXICON.md`, `workbench/wiki/SCHEMA.md`, `workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md`, `workbench/docs/adr/0041-visible-base62-workbench-identifiers.md`.

<a id="r037"></a>

## R037 — Update touched owners during the same work

**Historical intent:** As material state changes, reconcile the owning documentation, requirements, evidence and relevant routes. Do not leave an important accepted fact trapped in a final chat summary.

**Original status:** Accepted

**Why this existed:** Repeated reminders to save and update docs became the owner's coordination work.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Owners and traversal routes exist. ADR-0041 explicitly defers identifier implementation and connection identity; a declaration is not delivered migration.

**Prior pass observation (attributed; not a new runtime test):** AGENTS: 'Documentation is part of done; the implementing agent is its documentation owner' plus the routing table.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. AGENTS: 'Documentation is part of done; the implementing agent is its documentation owner' plus the routing table.

**Disposition:** ALREADY COVERED

**Target owner:** AGENTS.md

**Sources:** C-019f0262-L6, B-BOUNDARIES, G-6a50191e. Current source paths: `AGENTS.md`, `LEXICON.md`, `workbench/wiki/SCHEMA.md`, `workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md`, `workbench/docs/adr/0041-visible-base62-workbench-identifiers.md`.

<a id="r038"></a>

## R038 — Promotion is per decision, with preserved provenance

**Historical intent:** Identify which individual claims are settled, which remain open, what owner receives each promoted claim and what remains in the working record.

**Original status:** Accepted

**Why this existed:** Whole-notepad promotion silently imported proposals or lost unpromoted branches.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Owners and traversal routes exist. ADR-0041 explicitly defers identifier implementation and connection identity; a declaration is not delivered migration.

**Prior pass observation (attributed; not a new runtime test):** RESOLVED 2026-09-07: per-decision promotion with provenance becomes a base capability once promote enters core. Its plane routing is already ADR-0025-correct and is the model save must be reconciled to.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Keep per-claim promotion and provenance in Q; adding the promote/save skill to core is separately decided in F.

**Disposition:** MERGE WITH ADR-PROPOSED-Q

**Target owner:** CAND-Q

**Sources:** D-GP, WB-0040. Current source paths: `AGENTS.md`, `LEXICON.md`, `workbench/wiki/SCHEMA.md`, `workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md`, `workbench/docs/adr/0041-visible-base62-workbench-identifiers.md`.

<a id="r039"></a>

## R039 — Small independent ADRs preserve the reasons

**Historical intent:** Use separate concise ADRs for decisions that can change independently. Keep context, decision and why; use history for routine changes and avoid an omnibus governance ADR.

**Original status:** Accepted

**Why this existed:** The first large governance record obscured many independent choices and made later correction hard.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Owners and traversal routes exist. ADR-0041 explicitly defers identifier implementation and connection identity; a declaration is not delivered migration.

**Prior pass observation (attributed; not a new runtime test):** 28 small ADRs demonstrate the practice; the threshold rationale is nowhere written, and this triage needed it.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. 28 small ADRs demonstrate the practice; the threshold rationale is nowhere written, and this triage needed it.

**Disposition:** KEEP - DOC

**Target owner:** ADR authoring guidance

**Sources:** D-GP, D-V3, H-FR. Current source paths: `AGENTS.md`, `LEXICON.md`, `workbench/wiki/SCHEMA.md`, `workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md`, `workbench/docs/adr/0041-visible-base62-workbench-identifiers.md`.

<a id="r040"></a>

## R040 — ADR publication must update binding controls and links

**Historical intent:** An accepted ADR's operative rule must reach its named control, with relevant source and navigation links repaired in that promotion.

**Original status:** Accepted

**Why this existed:** ADRs, controls, skills and templates frequently described different decisions after a partial promotion.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Owners and traversal routes exist. ADR-0041 explicitly defers identifier implementation and connection identity; a declaration is not delivered migration.

**Prior pass observation (attributed; not a new runtime test):** ADR-0002 states the rule; nothing checks that a canonicalized_in target actually carries the rule.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** The behavioral rule is explicit already. Semantic agreement between an ADR and its owner needs judgment; a text-presence test cannot prove fidelity and is not an accepted new gate.

**Disposition:** ALREADY COVERED

**Target owner:** ADR-0002; AGENTS.md

**Sources:** D-GP, D-CONCEPTS. Current source paths: `AGENTS.md`, `LEXICON.md`, `workbench/wiki/SCHEMA.md`, `workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md`, `workbench/docs/adr/0041-visible-base62-workbench-identifiers.md`.

<a id="r041"></a>

## R041 — No extra ADR index was originally selected

**Historical intent:** The September 3 ruling chose self-describing filenames, scan-and-increment numbering and in-file supersession instead of a second hand-maintained ADR index.

**Original status:** Accepted historical decision

**Why this existed:** An index could become another driftable gate on whether an ADR exists.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Owners and traversal routes exist. ADR-0041 explicitly defers identifier implementation and connection identity; a declaration is not delivered migration.

**Prior pass observation (attributed; not a new runtime test):** RECONCILED: REGISTER.md is generated by adr.mjs, marked do-not-edit, and stale-register is attention/blocks-none. The 2026-09-03 no-hand-index ruling is intact.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. RECONCILED: REGISTER.md is generated by adr.mjs, marked do-not-edit, and stale-register is attention/blocks-none. The 2026-09-03 no-hand-index ruling is intact.

**Disposition:** ALREADY COVERED

**Target owner:** REGISTER.md

**Sources:** D-V3. Current source paths: `AGENTS.md`, `LEXICON.md`, `workbench/wiki/SCHEMA.md`, `workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md`, `workbench/docs/adr/0041-visible-base62-workbench-identifiers.md`.

<a id="r042"></a>

## R042 — Names and identities are independent

**Historical intent:** Human names may change while durable references remain resolvable. Identity migration must preserve references instead of confusing a rename with a new entity.

**Original status:** Accepted

**Why this existed:** Repeated Foundry vocabulary and path changes broke recognition across stores.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Owners and traversal routes exist. ADR-0041 explicitly defers identifier implementation and connection identity; a declaration is not delivered migration.

**Prior pass observation (attributed; not a new runtime test):** ADR-0041 preserves references and rejects a second global identity.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Artifact identity survives names; N now selects a Workbench connection identity. Do not interpret the older no-secondary-artifact-ID rule as forbidding that distinct identity.

**Disposition:** ALREADY COVERED

**Target owner:** ADR-0041; CAND-N

**Sources:** C-7f7acc51-L209, WB-0041. Current source paths: `AGENTS.md`, `LEXICON.md`, `workbench/wiki/SCHEMA.md`, `workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md`, `workbench/docs/adr/0041-visible-base62-workbench-identifiers.md`.

<a id="r043"></a>

## R043 — Visible base-62 identifiers are local to type and Workbench

**Historical intent:** Replace the numeric portion of existing visible IDs with base-62; uniqueness is per type and Workbench, with no second global identity. Alphabet and width are not settled.

**Original status:** Accepted; implementation pending

**Why this existed:** A secondary global ID contradicted the owner's correction and overbuilt standalone identity.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Owners and traversal routes exist. ADR-0041 explicitly defers identifier implementation and connection identity; a declaration is not delivered migration.

**Prior pass observation (attributed; not a new runtime test):** S-047 open; ADR-0041 says accepting it migrates nothing.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Direction is accepted; parser/allocation/migration are not complete. N requires an additional Workbench namespace without changing the original artifact proposition.

**Disposition:** ALREADY COVERED

**Target owner:** ADR-0041; S-047

**Sources:** WB-0041. Current source paths: `AGENTS.md`, `LEXICON.md`, `workbench/wiki/SCHEMA.md`, `workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md`, `workbench/docs/adr/0041-visible-base62-workbench-identifiers.md`.

<a id="r044"></a>

## R044 — Objective continuity crosses providers and sessions

**Historical intent:** A replacement agent should recover the objective and relevant working understanding after compaction, context loss, model change or restart, then verify live state and continue.

**Original status:** Accepted

**Why this existed:** A summary that drops intent forces the owner to rebuild the task and repeat decisions.

**Assumptions and scope:** Historical local-only/checkpoint rules are narrowed by N/Q. Multiple notes are allowed; unsaved state and unpushed code are outside a confirmed saved-note recovery claim.

**Observed current state:** Controls select objective-scoped JSON notes and durable-owner reconciliation. S-046 runtime remains pending and S-048 remains planned. The cold-resume fixture passed its no-resumer rejection; no real host resume was run.

**Prior pass observation (attributed; not a new runtime test):** Cross-provider resume tooling exists (tools/cross-provider-resume.mjs); the acceptance boundary is unstated.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Fresh-agent continuity applies to the whole Workbench. ADR-0040 covers unfinished local context; it must not become the sole owner of the product promise.

**Disposition:** MERGE WITH ADR-PROPOSED-A

**Target owner:** CAND-A

**Sources:** G-6a9ddf7c, G-6a9cff88, WB-0040. Current source paths: `BLUEPRINT.md`, `LEXICON.md`, `workbench/docs/adr/0040-json-notepads-preserve-objective-continuity.md`, `workbench/specs/S-046-json-notepad-foundation/SPEC.md`, `workbench/specs/S-048-checkpoint-retirement/SPEC.md`, `workbench/sessions/.gitignore`.

<a id="r045"></a>

## R045 — New live notepads use versioned JSON

**Historical intent:** Use a shared JSON schema and deterministic update/retrieval tooling, while a shared skill guides what is worth preserving.

**Original status:** Accepted; implementation pending

**Why this existed:** Selective structural retrieval and safe updates need more than unstructured Markdown conventions.

**Assumptions and scope:** Historical local-only/checkpoint rules are narrowed by N/Q. Multiple notes are allowed; unsaved state and unpushed code are outside a confirmed saved-note recovery claim.

**Observed current state:** Controls select objective-scoped JSON notes and durable-owner reconciliation. S-046 runtime remains pending and S-048 remains planned. The cold-resume fixture passed its no-resumer rejection; no real host resume was run.

**Prior pass observation (attributed; not a new runtime test):** S-046 active, TK-002 ready; ADR-0040 accepted.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. S-046 active, TK-002 ready; ADR-0040 accepted.

**Disposition:** ALREADY COVERED

**Target owner:** ADR-0040, S-046

**Sources:** WB-0040, G-6a9e2919. Current source paths: `BLUEPRINT.md`, `LEXICON.md`, `workbench/docs/adr/0040-json-notepads-preserve-objective-continuity.md`, `workbench/specs/S-046-json-notepad-foundation/SPEC.md`, `workbench/specs/S-048-checkpoint-retirement/SPEC.md`, `workbench/sessions/.gitignore`.

<a id="r046"></a>

## R046 — Editable resume state plus append-oriented work history

**Historical intent:** Keep a current resumption view and meaningful work history, including sources, corrections and uncertainty. Retrieve a bounded topic with enough context.

**Original status:** Accepted; implementation pending

**Why this existed:** An ever-growing transcript is expensive; a mutable summary alone loses why state changed.

**Assumptions and scope:** Historical local-only/checkpoint rules are narrowed by N/Q. Multiple notes are allowed; unsaved state and unpushed code are outside a confirmed saved-note recovery claim.

**Observed current state:** Controls select objective-scoped JSON notes and durable-owner reconciliation. S-046 runtime remains pending and S-048 remains planned. The cold-resume fixture passed its no-resumer rejection; no real host resume was run.

**Prior pass observation (attributed; not a new runtime test):** S-046 Decisions: resume view plus append-oriented record accepted; field names are engineering.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. S-046 Decisions: resume view plus append-oriented record accepted; field names are engineering.

**Disposition:** ALREADY COVERED

**Target owner:** ADR-0040, S-046

**Sources:** WB-0040. Current source paths: `BLUEPRINT.md`, `LEXICON.md`, `workbench/docs/adr/0040-json-notepads-preserve-objective-continuity.md`, `workbench/specs/S-046-json-notepad-foundation/SPEC.md`, `workbench/specs/S-048-checkpoint-retirement/SPEC.md`, `workbench/sessions/.gitignore`.

<a id="r047"></a>

## R047 — Capture by survival value, not exhaustive event logging

**Historical intent:** Preserve what a future agent needs to continue the objective, without requiring a detailed record of every action or a notepad for every trivial task.

**Original status:** Accepted

**Why this existed:** Logging ceremony can consume the same context and effort the notepad is meant to save.

**Assumptions and scope:** Historical local-only/checkpoint rules are narrowed by N/Q. Multiple notes are allowed; unsaved state and unpushed code are outside a confirmed saved-note recovery claim.

**Observed current state:** Controls select objective-scoped JSON notes and durable-owner reconciliation. S-046 runtime remains pending and S-048 remains planned. The cold-resume fixture passed its no-resumer rejection; no real host resume was run.

**Prior pass observation (attributed; not a new runtime test):** ADR-0040: 'JSON is a storage format, not unlimited storage'.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. ADR-0040: 'JSON is a storage format, not unlimited storage'.

**Disposition:** ALREADY COVERED

**Target owner:** ADR-0040

**Sources:** WB-0040, G-6a9e03ef. Current source paths: `BLUEPRINT.md`, `LEXICON.md`, `workbench/docs/adr/0040-json-notepads-preserve-objective-continuity.md`, `workbench/specs/S-046-json-notepad-foundation/SPEC.md`, `workbench/specs/S-048-checkpoint-retirement/SPEC.md`, `workbench/sessions/.gitignore`.

<a id="r048"></a>

## R048 — Raw live notes remain local and non-authoritative

**Historical intent:** A live note records working understanding and Intent; it does not authorize work, prove its own assertions or become a raw Git artifact.

**Original status:** Accepted

**Why this existed:** Committing provisional private material caused leaks, stale resurrection and confusion with accepted truth.

**Assumptions and scope:** Historical local-only/checkpoint rules are narrowed by N/Q. Multiple notes are allowed; unsaved state and unpushed code are outside a confirmed saved-note recovery claim.

**Observed current state:** Controls select objective-scoped JSON notes and durable-owner reconciliation. S-046 runtime remains pending and S-048 remains planned. The cold-resume fixture passed its no-resumer rejection; no real host resume was run.

**Prior pass observation (attributed; not a new runtime test):** Both accepted; sessions/.gitignore keeps grilling and handoffs untracked.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** N explicitly permits configured private synchronization of live notes while excluding them from project Git. Their non-authority remains; blanket local-only wording needs a visible narrowing.

**Disposition:** MERGE WITH ADR-PROPOSED-N

**Target owner:** CAND-N; CAND-Q

**Sources:** WB-0040. Current source paths: `BLUEPRINT.md`, `LEXICON.md`, `workbench/docs/adr/0040-json-notepads-preserve-objective-continuity.md`, `workbench/specs/S-046-json-notepad-foundation/SPEC.md`, `workbench/specs/S-048-checkpoint-retirement/SPEC.md`, `workbench/sessions/.gitignore`.

<a id="r049"></a>

## R049 — Dispose only after reconciliation; preserve unresolved material

**Historical intent:** Delete resolved working notes only after important material reaches durable owners; partial promotion never justifies losing remaining branches or unfinished work.

**Original status:** Accepted

**Why this existed:** Disposable was interpreted as safe to discard before the information had survived elsewhere.

**Assumptions and scope:** Historical local-only/checkpoint rules are narrowed by N/Q. Multiple notes are allowed; unsaved state and unpushed code are outside a confirmed saved-note recovery claim.

**Observed current state:** Controls select objective-scoped JSON notes and durable-owner reconciliation. S-046 runtime remains pending and S-048 remains planned. The cold-resume fixture passed its no-resumer rejection; no real host resume was run.

**Prior pass observation (attributed; not a new runtime test):** S-046 records P-2 reconcile-before-delete under explicit make-it-so authority.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. S-046 records P-2 reconcile-before-delete under explicit make-it-so authority.

**Disposition:** ALREADY COVERED

**Target owner:** ADR-0040, S-046 P-2

**Sources:** WB-0040, C-019fa661-L37. Current source paths: `BLUEPRINT.md`, `LEXICON.md`, `workbench/docs/adr/0040-json-notepads-preserve-objective-continuity.md`, `workbench/specs/S-046-json-notepad-foundation/SPEC.md`, `workbench/specs/S-048-checkpoint-retirement/SPEC.md`, `workbench/sessions/.gitignore`.

<a id="r050"></a>

## R050 — A handoff is authored for a particular receiver and purpose

**Historical intent:** Select the relevant working slice, verified facts, exact next action, open decisions and exclusions. Reference existing owners instead of copying the whole transcript.

**Original status:** Historical skill contract; supporting owner direction

**Why this existed:** Authored transfer reduces rediscovery and preserves meaning that automatic summaries omit.

**Assumptions and scope:** Historical local-only/checkpoint rules are narrowed by N/Q. Multiple notes are allowed; unsaved state and unpushed code are outside a confirmed saved-note recovery claim.

**Observed current state:** Controls select objective-scoped JSON notes and durable-owner reconciliation. S-046 runtime remains pending and S-048 remains planned. The cold-resume fixture passed its no-resumer rejection; no real host resume was run.

**Prior pass observation (attributed; not a new runtime test):** A `handoff` skill exists in the personal home only; no Workbench-side handoff contract.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** ADR-0040 and S-046 already require separately authored destination-specific handoffs. The absence of a bundled handoff skill is not absence of the contract.

**Disposition:** ALREADY COVERED

**Target owner:** ADR-0040; S-046

**Sources:** H-HANDOFF, G-6a9ddf7c. Current source paths: `BLUEPRINT.md`, `LEXICON.md`, `workbench/docs/adr/0040-json-notepads-preserve-objective-continuity.md`, `workbench/specs/S-046-json-notepad-foundation/SPEC.md`, `workbench/specs/S-048-checkpoint-retirement/SPEC.md`, `workbench/sessions/.gitignore`.

<a id="r051"></a>

## R051 — Checkpointing and handoff are not session termination

**Historical intent:** A checkpoint preserves resumability; a handoff can be prepared early, refreshed or used for a spin-off while the original session continues.

**Original status:** Historical skill contract; owner acceptance not established

**Why this existed:** Treating either as a mandatory final action makes them arrive after context has degraded and stops useful work unnecessarily.

**Assumptions and scope:** Historical local-only/checkpoint rules are narrowed by N/Q. Multiple notes are allowed; unsaved state and unpushed code are outside a confirmed saved-note recovery claim.

**Observed current state:** Controls select objective-scoped JSON notes and durable-owner reconciliation. S-046 runtime remains pending and S-048 remains planned. The cold-resume fixture passed its no-resumer rejection; no real host resume was run.

**Prior pass observation (attributed; not a new runtime test):** RESOLVED 2026-09-07: the durable boundary becomes the promotion operation, not a checkpoint artifact. sessions/checkpoints retires as an active collection and freezes as read-only history; notepads and handoffs stay temporary sources.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** The original item is about save/handoff not terminating a session. Preserve that distinction; Q is a later explicit decision about durable promotion, not a rewrite of what R051 historically said.

**Disposition:** KEEP - DOC

**Target owner:** RUNBOOK.md; CAND-Q

**Sources:** H-HANDOFF. Current source paths: `BLUEPRINT.md`, `LEXICON.md`, `workbench/docs/adr/0040-json-notepads-preserve-objective-continuity.md`, `workbench/specs/S-046-json-notepad-foundation/SPEC.md`, `workbench/specs/S-048-checkpoint-retirement/SPEC.md`, `workbench/sessions/.gitignore`.

<a id="r052"></a>

## R052 — Preserve the entire question inventory and stable IDs

**Historical intent:** Keep original question identities, branches, locked answers and open decisions when merging or resuming grilling. A short current-status list does not replace the complete source.

**Original status:** Accepted

**Why this existed:** Earlier recovery attempts replaced dozens of decisions with a small subset and repeatedly re-asked settled questions.

**Assumptions and scope:** Historical local-only/checkpoint rules are narrowed by N/Q. Multiple notes are allowed; unsaved state and unpushed code are outside a confirmed saved-note recovery claim.

**Observed current state:** Controls select objective-scoped JSON notes and durable-owner reconciliation. S-046 runtime remains pending and S-048 remains planned. The cold-resume fixture passed its no-resumer rejection; no real host resume was run.

**Prior pass observation (attributed; not a new runtime test):** ADR-0040 requires preserving corrections but not stable question identity across merges.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Preserve complete source IDs, branches, corrections and statuses. A short derived current view must link to retained source rather than replace it.

**Disposition:** MERGE WITH ADR-0040

**Target owner:** ADR-0040; S-046

**Sources:** D-GP, H-SC, C-019f77b1-L9. Current source paths: `BLUEPRINT.md`, `LEXICON.md`, `workbench/docs/adr/0040-json-notepads-preserve-objective-continuity.md`, `workbench/specs/S-046-json-notepad-foundation/SPEC.md`, `workbench/specs/S-048-checkpoint-retirement/SPEC.md`, `workbench/sessions/.gitignore`.

<a id="r053"></a>

## R053 — One live session record; duplicates must declare supersession

**Historical intent:** Merge related interviews when requested and make the active resume source unambiguous. Retain truthful superseded evidence without letting stale copies silently become the next entrypoint.

**Original status:** Accepted

**Why this existed:** The skill's old diary path repeatedly led agents to an obsolete notepad.

**Assumptions and scope:** Historical local-only/checkpoint rules are narrowed by N/Q. Multiple notes are allowed; unsaved state and unpushed code are outside a confirmed saved-note recovery claim.

**Observed current state:** Controls select objective-scoped JSON notes and durable-owner reconciliation. S-046 runtime remains pending and S-048 remains planned. The cold-resume fixture passed its no-resumer rejection; no real host resume was run.

**Prior pass observation (attributed; not a new runtime test):** VERIFIED DEFECT: installed personal checkpoint/make-it-so/grilling skills still name `workbench/sessions/grilling diary/`, which does not exist; manifest declares `workbench/sessions/grilling`.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** The original requires an unambiguous active resume source, not exactly one note. S-046 explicitly permits several linked notes per objective; stale path/source migration is a separate F concern.

**Disposition:** KEEP - CONTRACT

**Target owner:** S-046; CAND-F

**Sources:** H-SC, H-DG. Current source paths: `BLUEPRINT.md`, `LEXICON.md`, `workbench/docs/adr/0040-json-notepads-preserve-objective-continuity.md`, `workbench/specs/S-046-json-notepad-foundation/SPEC.md`, `workbench/specs/S-048-checkpoint-retirement/SPEC.md`, `workbench/sessions/.gitignore`.

<a id="r054"></a>

## R054 — Cross-host transport is explicit, not incidental Git sync

**Historical intent:** The owner wants continuity across machines. Historical live-note transfer used explicit handoff, while the new JSON ADR leaves transport unselected.

**Original status:** Open choice

**Why this existed:** Local persistence and cross-host recoverability are different guarantees.

**Assumptions and scope:** Historical local-only/checkpoint rules are narrowed by N/Q. Multiple notes are allowed; unsaved state and unpushed code are outside a confirmed saved-note recovery claim.

**Observed current state:** Controls select objective-scoped JSON notes and durable-owner reconciliation. S-046 runtime remains pending and S-048 remains planned. The cold-resume fixture passed its no-resumer rejection; no real host resume was run.

**Prior pass observation (attributed; not a new runtime test):** RESOLVED 2026-09-07: a separate private `workbench_sessions` Git repository keyed by a stable per-Workbench identity, synced by a shared tool. Optional capability; ordinary local operation stays independent of it.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Direct owner message selects private Git transport and its boundaries. Existing local-only controls and runtime have not yet implemented this choice.

**Disposition:** KEEP - ADR

**Target owner:** CAND-N

**Sources:** H-HANDOFF, WB-0040, C-019f3b12-L6. Current source paths: `BLUEPRINT.md`, `LEXICON.md`, `workbench/docs/adr/0040-json-notepads-preserve-objective-continuity.md`, `workbench/specs/S-046-json-notepad-foundation/SPEC.md`, `workbench/specs/S-048-checkpoint-retirement/SPEC.md`, `workbench/sessions/.gitignore`.

<a id="r055"></a>

## R055 — Durable evidence must survive its stated recovery boundary

**Historical intent:** A local ignored file is not evidence recoverable from a clean clone. A pushed commit is not an installed/runtime result. State exactly what each reference preserves.

**Original status:** Accepted

**Why this existed:** Claims of durability often exceeded the actual file, branch or deployment boundary.

**Assumptions and scope:** Historical local-only/checkpoint rules are narrowed by N/Q. Multiple notes are allowed; unsaved state and unpushed code are outside a confirmed saved-note recovery claim.

**Observed current state:** Controls select objective-scoped JSON notes and durable-owner reconciliation. S-046 runtime remains pending and S-048 remains planned. The cold-resume fixture passed its no-resumer rejection; no real host resume was run.

**Prior pass observation (attributed; not a new runtime test):** ADR-0028 covers the untracked case; release-vs-installed-vs-running is only in AU-0004 downstream.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Each evidence claim names the state it proves. Historical adoption provenance cannot stand in for current tools, skills, runtime or downstream acceptance.

**Disposition:** MERGE WITH ADR-PROPOSED-H

**Target owner:** CAND-H

**Sources:** WB-0028, D-FLIGHT. Current source paths: `BLUEPRINT.md`, `LEXICON.md`, `workbench/docs/adr/0040-json-notepads-preserve-objective-continuity.md`, `workbench/specs/S-046-json-notepad-foundation/SPEC.md`, `workbench/specs/S-048-checkpoint-retirement/SPEC.md`, `workbench/sessions/.gitignore`.

<a id="r056"></a>

## R056 — Small reusable primitives and thin entrypoints

**Historical intent:** Build skills as reusable behavioral primitives composed by thin entrypoints and compound flows, rather than restating each child's procedure inside every orchestrator.

**Original status:** Strong preference

**Why this existed:** The owner repeatedly sought reusable skills to replace repeated prompting; unreachable children caused silent composition collapse.

**Assumptions and scope:** Source ownership, installed state and host discovery are different. F selects one global core release; old duplicate personal sources and equality-only version diagnostics are migration concerns.

**Observed current state:** 17 source core skills are declared; promote/save are absent. Installer tests passed 12/12, including Git-owned and symlinked roots. README/Runbook refusal prose is stale; explicit replacement remains a separate path. No new compatibility-range implementation was verified.

**Prior pass observation (attributed; not a new runtime test):** 17-skill closed bundle exists; no composition contract is written for it.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Composition and source ownership can change independently. Preserve reusable primitives and distinguish invocation from authorization; do not adopt a metadata schema merely because one was suggested.

**Disposition:** MERGE WITH ADR-PROPOSED-E

**Target owner:** CAND-E

**Sources:** G-6a646af5, G-6a9d38cd. Current source paths: `skills/README.md`, `workbench/manifest.json`, `tools/core-skill-installer.mjs`, `tools/skill-presence.mjs`, `tools/test-core-skill-installer.mjs`.

<a id="r057"></a>

## R057 — Invocation, composition and authorization are separate axes

**Historical intent:** Owner-facing invocation, a parent skill's ability to reach a child, and authority for the child's effects must be handled separately.

**Original status:** Strong preference

**Why this existed:** Gating all primitives broke composition; exposing an owner command let the model appear to authorize itself.

**Assumptions and scope:** Source ownership, installed state and host discovery are different. F selects one global core release; old duplicate personal sources and equality-only version diagnostics are migration concerns.

**Observed current state:** 17 source core skills are declared; promote/save are absent. Installer tests passed 12/12, including Git-owned and symlinked roots. README/Runbook refusal prose is stale; explicit replacement remains a separate path. No new compatibility-range implementation was verified.

**Prior pass observation (attributed; not a new runtime test):** `promote` uses disable-model-invocation:true; the axis distinction is real but undocumented upstream.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Composition and source ownership can change independently. Preserve reusable primitives and distinguish invocation from authorization; do not adopt a metadata schema merely because one was suggested.

**Disposition:** MERGE WITH ADR-PROPOSED-E

**Target owner:** CAND-E

**Sources:** G-6a646af5, C-019f6974-L93. Current source paths: `skills/README.md`, `workbench/manifest.json`, `tools/core-skill-installer.mjs`, `tools/skill-presence.mjs`, `tools/test-core-skill-installer.mjs`.

<a id="r058"></a>

## R058 — A primitive is agnostic to its first caller

**Historical intent:** Reusable checkpoint, save, navigation and handoff primitives should accept the smallest meaningful scope rather than hardcoding one caller's paths or data shape.

**Original status:** Strong preference

**Why this existed:** A checkpoint implementation tied to grilling could not support other work.

**Assumptions and scope:** Source ownership, installed state and host discovery are different. F selects one global core release; old duplicate personal sources and equality-only version diagnostics are migration concerns.

**Observed current state:** 17 source core skills are declared; promote/save are absent. Installer tests passed 12/12, including Git-owned and symlinked roots. README/Runbook refusal prose is stale; explicit replacement remains a separate path. No new compatibility-range implementation was verified.

**Prior pass observation (attributed; not a new runtime test):** `save` is caller-agnostic by design in the personal home; the rule is not stated upstream.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Composition and source ownership can change independently. Preserve reusable primitives and distinguish invocation from authorization; do not adopt a metadata schema merely because one was suggested.

**Disposition:** MERGE WITH ADR-PROPOSED-E

**Target owner:** CAND-E

**Sources:** G-6a646af5, H-HANDOFF. Current source paths: `skills/README.md`, `workbench/manifest.json`, `tools/core-skill-installer.mjs`, `tools/skill-presence.mjs`, `tools/test-core-skill-installer.mjs`.

<a id="r059"></a>

## R059 — Compose within existing authorization without repeating approval

**Historical intent:** A child may use the parent's already authorized scope; a genuinely new effect, destination or consequential decision needs its own resolution.

**Original status:** Strong preference

**Why this existed:** Repeated approval at every primitive prevents useful composition, while unlimited inherited authority is unsafe.

**Assumptions and scope:** Source ownership, installed state and host discovery are different. F selects one global core release; old duplicate personal sources and equality-only version diagnostics are migration concerns.

**Observed current state:** 17 source core skills are declared; promote/save are absent. Installer tests passed 12/12, including Git-owned and symlinked roots. README/Runbook refusal prose is stale; explicit replacement remains a separate path. No new compatibility-range implementation was verified.

**Prior pass observation (attributed; not a new runtime test):** ADR-0027 gives the authority order but no scope-inheritance stop condition for composed skills.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Composition and source ownership can change independently. Preserve reusable primitives and distinguish invocation from authorization; do not adopt a metadata schema merely because one was suggested.

**Disposition:** MERGE WITH ADR-PROPOSED-E

**Target owner:** CAND-E

**Sources:** G-6a646af5, B-BOUNDARIES. Current source paths: `skills/README.md`, `workbench/manifest.json`, `tools/core-skill-installer.mjs`, `tools/skill-presence.mjs`, `tools/test-core-skill-installer.mjs`.

<a id="r060"></a>

## R060 — Skill callability needs verification at the host boundary

**Historical intent:** Check that invoked children are actually discoverable and callable on supported providers, and demonstrate composition rather than trusting descriptive prose.

**Original status:** Strong preference

**Why this existed:** A skill could exist in source but not in discovery, or an orchestrator could paraphrase it instead of invoking it.

**Assumptions and scope:** Source ownership, installed state and host discovery are different. F selects one global core release; old duplicate personal sources and equality-only version diagnostics are migration concerns.

**Observed current state:** 17 source core skills are declared; promote/save are absent. Installer tests passed 12/12, including Git-owned and symlinked roots. README/Runbook refusal prose is stale; explicit replacement remains a separate path. No new compatibility-range implementation was verified.

**Prior pass observation (attributed; not a new runtime test):** tools/test-symlink-invocation.mjs and test-skill-catalog.mjs check presence and discovery roots, not that a parent actually invokes a child.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Host callability is a tested-capability claim under P. E explains composition; discovery/text tests alone do not establish invocation.

**Disposition:** MERGE WITH ADR-PROPOSED-P

**Target owner:** CAND-P; CAND-E

**Sources:** G-6a646af5, D-CIC. Current source paths: `skills/README.md`, `workbench/manifest.json`, `tools/core-skill-installer.mjs`, `tools/skill-presence.mjs`, `tools/test-core-skill-installer.mjs`.

<a id="r061"></a>

## R061 — Skill metadata must distinguish invocation from mere mention

**Historical intent:** A prose mention may recommend, describe or warn about a skill without calling it; a checker must not treat every name as a required invocation edge.

**Original status:** Open choice

**Why this existed:** The proposed grep-based dependency test would reject legitimate routers and documentation.

**Assumptions and scope:** Source ownership, installed state and host discovery are different. F selects one global core release; old duplicate personal sources and equality-only version diagnostics are migration concerns.

**Observed current state:** 17 source core skills are declared; promote/save are absent. Installer tests passed 12/12, including Git-owned and symlinked roots. README/Runbook refusal prose is stale; explicit replacement remains a separate path. No new compatibility-range implementation was verified.

**Prior pass observation (attributed; not a new runtime test):** The invokes/routes/reads schema was an assistant proposal, never owner-accepted; a grep-based edge test would fail legitimate routers.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Keep the valid distinction between mention, routing and invocation. Reject treating the assistant-proposed metadata/grep schema as accepted architecture; do not reject the whole historical concern.

**Disposition:** KEEP - DOC

**Target owner:** skills composition guidance; CAND-E

**Sources:** G-6a646af5. Current source paths: `skills/README.md`, `workbench/manifest.json`, `tools/core-skill-installer.mjs`, `tools/skill-presence.mjs`, `tools/test-core-skill-installer.mjs`.

<a id="r062"></a>

## R062 — Skill names should avoid accidental everyday triggers

**Historical intent:** Choose discoverable names that compress useful behavior without firing merely because the owner uses an ordinary verb in conversation.

**Original status:** Strong preference

**Why this existed:** The historical implement name was reported as overtriggering; later installations still use implement, so retirement was not a permanent settled outcome.

**Assumptions and scope:** Source ownership, installed state and host discovery are different. F selects one global core release; old duplicate personal sources and equality-only version diagnostics are migration concerns.

**Observed current state:** 17 source core skills are declared; promote/save are absent. Installer tests passed 12/12, including Git-owned and symlinked roots. README/Runbook refusal prose is stale; explicit replacement remains a separate path. No new compatibility-range implementation was verified.

**Prior pass observation (attributed; not a new runtime test):** `implement` is still in the required bundle, so the historical retirement was not a settled outcome.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. `implement` is still in the required bundle, so the historical retirement was not a settled outcome.

**Disposition:** KEEP - DOC

**Target owner:** skills/README.md

**Sources:** G-6a646af5. Current source paths: `skills/README.md`, `workbench/manifest.json`, `tools/core-skill-installer.mjs`, `tools/skill-presence.mjs`, `tools/test-core-skill-installer.mjs`.

<a id="r063"></a>

## R063 — Delete empty document stubs instead of implying completeness

**Historical intent:** A generated document should omit inapplicable sections rather than leave empty headings that appear complete to a later agent.

**Original status:** Strong preference

**Why this existed:** An empty stub can stop retrieval more effectively than an obviously missing section.

**Assumptions and scope:** Source ownership, installed state and host discovery are different. F selects one global core release; old duplicate personal sources and equality-only version diagnostics are migration concerns.

**Observed current state:** 17 source core skills are declared; promote/save are absent. Installer tests passed 12/12, including Git-owned and symlinked roots. README/Runbook refusal prose is stale; explicit replacement remains a separate path. No new compatibility-range implementation was verified.

**Prior pass observation (attributed; not a new runtime test):** Cheap, checkable writing convention; no ADR-level constraint.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Omit inapplicable sections where appropriate. Do not generalize this to deleting required empty lanes, mandatory collections or intentional schema/template scaffolding.

**Disposition:** KEEP - DOC

**Target owner:** skills authoring guidance

**Sources:** G-6a646af5, H-HANDOFF. Current source paths: `skills/README.md`, `workbench/manifest.json`, `tools/core-skill-installer.mjs`, `tools/skill-presence.mjs`, `tools/test-core-skill-installer.mjs`.

<a id="r064"></a>

## R064 — Stances change method without changing authority

**Historical intent:** Builder, Auditor, Reviewer and Reconciler are portable approaches assigned by the SPEC/TASK. Loading a stance does not spawn a worker or transfer permission.

**Original status:** Accepted

**Why this existed:** Permanent role departments and mandatory role-change handoffs added bureaucracy to one agent's task.

**Assumptions and scope:** Source ownership, installed state and host discovery are different. F selects one global core release; old duplicate personal sources and equality-only version diagnostics are migration concerns.

**Observed current state:** 17 source core skills are declared; promote/save are absent. Installer tests passed 12/12, including Git-owned and symlinked roots. README/Runbook refusal prose is stale; explicit replacement remains a separate path. No new compatibility-range implementation was verified.

**Prior pass observation (attributed; not a new runtime test):** Four stance skills present in skills/ and in skillPolicy.required.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. Four stance skills present in skills/ and in skillPolicy.required.

**Disposition:** ALREADY COVERED

**Target owner:** ADR-0036

**Sources:** WB-0036, C-a9e38fdd-L87. Current source paths: `skills/README.md`, `workbench/manifest.json`, `tools/core-skill-installer.mjs`, `tools/skill-presence.mjs`, `tools/test-core-skill-installer.mjs`.

<a id="r065"></a>

## R065 — Grilling establishes shared understanding before promotion

**Historical intent:** Research facts before asking; expose the decision tree; ask one consequential question at a time with a recommendation; preserve the answer before continuing.

**Original status:** Accepted

**Why this existed:** The owner wanted to decide architecture without repeatedly supplying discoverable facts or recovering lost answers.

**Assumptions and scope:** Source ownership, installed state and host discovery are different. F selects one global core release; old duplicate personal sources and equality-only version diagnostics are migration concerns.

**Observed current state:** 17 source core skills are declared; promote/save are absent. Installer tests passed 12/12, including Git-owned and symlinked roots. README/Runbook refusal prose is stale; explicit replacement remains a separate path. No new compatibility-range implementation was verified.

**Prior pass observation (attributed; not a new runtime test):** grilling ships in the bundle; AGENTS forbids requiring it for routine decisions.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. grilling ships in the bundle; AGENTS forbids requiring it for routine decisions.

**Disposition:** ALREADY COVERED

**Target owner:** ADR-0035, grilling skill

**Sources:** C-019f68ef-L9, D-GP. Current source paths: `skills/README.md`, `workbench/manifest.json`, `tools/core-skill-installer.mjs`, `tools/skill-presence.mjs`, `tools/test-core-skill-installer.mjs`.

<a id="r066"></a>

## R066 — Plan unknown work through decision tasks before implementation

**Historical intent:** When architecture is unresolved, make the next bounded outcome an answered decision or experiment, not a fabricated implementation ticket with guessed requirements.

**Original status:** Strong preference

**Why this existed:** Large speculative plans made downstream execution look ready before prerequisites were understood.

**Assumptions and scope:** Source ownership, installed state and host discovery are different. F selects one global core release; old duplicate personal sources and equality-only version diagnostics are migration concerns.

**Observed current state:** 17 source core skills are declared; promote/save are absent. Installer tests passed 12/12, including Git-owned and symlinked roots. README/Runbook refusal prose is stale; explicit replacement remains a separate path. No new compatibility-range implementation was verified.

**Prior pass observation (attributed; not a new runtime test):** AGENTS already forbids manufacturing a queue; the positive pattern is unwritten.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. AGENTS already forbids manufacturing a queue; the positive pattern is unwritten.

**Disposition:** KEEP - DOC

**Target owner:** RUNBOOK / wayfinder

**Sources:** C-8ee94cac-L42, C-8ee94cac-L51. Current source paths: `skills/README.md`, `workbench/manifest.json`, `tools/core-skill-installer.mjs`, `tools/skill-presence.mjs`, `tools/test-core-skill-installer.mjs`.

<a id="r067"></a>

## R067 — Lifecycle stages remain independently usable skills

**Historical intent:** A guidebook composes separately invokable skills; each skill should work in its declared context without requiring the reader to adopt the entire guidebook as authority.

**Original status:** Accepted

**Why this existed:** The seven-stage workflow could not be exercised when stages existed only as prose or rigid orchestration.

**Assumptions and scope:** Source ownership, installed state and host discovery are different. F selects one global core release; old duplicate personal sources and equality-only version diagnostics are migration concerns.

**Observed current state:** 17 source core skills are declared; promote/save are absent. Installer tests passed 12/12, including Git-owned and symlinked roots. README/Runbook refusal prose is stale; explicit replacement remains a separate path. No new compatibility-range implementation was verified.

**Prior pass observation (attributed; not a new runtime test):** Flight stages live only in the personal skills home; the generic lesson belongs to CAND-E.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** The original proposition is generic independent skill usability, although its examples are Flight-specific. Preserve that reusable principle under E and leave the seven-stage machinery outside the core.

**Disposition:** MERGE WITH ADR-PROPOSED-E

**Target owner:** CAND-E

**Sources:** D-FLIGHT, C-01a04a19-L9, C-01a04a99-L9. Current source paths: `skills/README.md`, `workbench/manifest.json`, `tools/core-skill-installer.mjs`, `tools/skill-presence.mjs`, `tools/test-core-skill-installer.mjs`.

<a id="r068"></a>

## R068 — One stable shared discovery home across providers

**Historical intent:** Installed personal skills should remain discoverable outside GPT_OS through a stable shared home, with provider discovery routes pointing to it.

**Original status:** Accepted

**Why this existed:** The skill catalog disappeared or became project-scoped when a Foundry deployment or publisher changed.

**Assumptions and scope:** Source ownership, installed state and host discovery are different. F selects one global core release; old duplicate personal sources and equality-only version diagnostics are migration concerns.

**Observed current state:** 17 source core skills are declared; promote/save are absent. Installer tests passed 12/12, including Git-owned and symlinked roots. README/Runbook refusal prose is stale; explicit replacement remains a separate path. No new compatibility-range implementation was verified.

**Prior pass observation (attributed; not a new runtime test):** RESOLVED 2026-09-07: three ownership scopes, two distribution tiers. KaydenClark/skills stays the canonical home for personally accepted skills and is optional from the product's view; global availability does not make a skill a Workbench feature.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Use the later direct answer: one selected global core version, compatibility range, room-local source and adapters, and removal of legacy duplicate core sources from the personal repository.

**Disposition:** KEEP - ADR

**Target owner:** CAND-F

**Sources:** C-fba9567e-L3, C-a9e38fdd-L152. Current source paths: `skills/README.md`, `workbench/manifest.json`, `tools/core-skill-installer.mjs`, `tools/skill-presence.mjs`, `tools/test-core-skill-installer.mjs`.

<a id="r069"></a>

## R069 — Bundle the portable core; install missing skills without overwriting custom ones

**Historical intent:** The Workbench ships its own core skill source. Installation fills missing core skills while preserving existing user-owned skills; an external shared-skills repository is not a required product dependency.

**Original status:** Accepted

**Why this existed:** The earlier external dependency made fresh setup incomplete and the publisher risked destroying customized skills.

**Assumptions and scope:** Source ownership, installed state and host discovery are different. F selects one global core release; old duplicate personal sources and equality-only version diagnostics are migration concerns.

**Observed current state:** 17 source core skills are declared; promote/save are absent. Installer tests passed 12/12, including Git-owned and symlinked roots. README/Runbook refusal prose is stale; explicit replacement remains a separate path. No new compatibility-range implementation was verified.

**Prior pass observation (attributed; not a new runtime test):** skills/ ships the core; normalSetup=presence-only, updates=explicit-only; test-core-skill-installer covers non-overwrite.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. skills/ ships the core; normalSetup=presence-only, updates=explicit-only; test-core-skill-installer covers non-overwrite.

**Disposition:** ALREADY COVERED

**Target owner:** ADR-0036, skillPolicy

**Sources:** C-01a05af1-L394, C-01a05af1-L569, B-LAYOUT, G-6a9de4cc. Current source paths: `skills/README.md`, `workbench/manifest.json`, `tools/core-skill-installer.mjs`, `tools/skill-presence.mjs`, `tools/test-core-skill-installer.mjs`.

<a id="r070"></a>

## R070 — Genesis, adoption and upgrade are different operations

**Historical intent:** Creating a new room, adding the harness to an existing project and updating an installed harness have different input and preservation contracts.

**Original status:** Accepted

**Why this existed:** Treating an existing project like an empty template risks loss or repeated setup.

**Assumptions and scope:** Source release, installed generation, runtime and target containment require separate evidence; unavailable state must not be filled by inference.

**Observed current state:** Setup tools and distinct source/installed receipts exist. Adoption and upgrade recovery still use collections.checkpoints. Fidelity tests passed 15/15; this report does not certify a new upgrade or deployment.

**Prior pass observation (attributed; not a new runtime test):** genesis, adoption and update-harness are three separate skills with different contracts and no ADR stating why.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Different preconditions and allowed effects are a durable architectural choice. Link runtime ownership to ADR-0031; source validation is required for every consumed lane.

**Disposition:** KEEP - ADR

**Target owner:** CAND-G

**Sources:** C-019f6974-L145, C-019f6974-L165, C-019f5b18-L9. Current source paths: `RUNBOOK.md`, `tools/workbench-adoption.mjs`, `tools/workbench-upgrade.mjs`, `workbench/docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md`, `workbench/specs/S-041-recorded-baseline-availability/SPEC.md`, `tools/control-fidelity.mjs`.

<a id="r071"></a>

## R071 — Adopt real projects without erasing their history

**Historical intent:** Reconcile an existing project's controls and arbitrary prior content into the Workbench structure with a lossless migration and explicit provenance.

**Original status:** Accepted

**Why this existed:** The harness should augment working projects, not require a blank repository or replace their domain knowledge.

**Assumptions and scope:** Source release, installed generation, runtime and target containment require separate evidence; unavailable state must not be filled by inference.

**Observed current state:** Setup tools and distinct source/installed receipts exist. Adoption and upgrade recovery still use collections.checkpoints. Fidelity tests passed 15/15; this report does not certify a new upgrade or deployment.

**Prior pass observation (attributed; not a new runtime test):** workbench-adoption.mjs migrate implements lossless migration; the invariant has no ADR.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Different preconditions and allowed effects are a durable architectural choice. Link runtime ownership to ADR-0031; source validation is required for every consumed lane.

**Disposition:** MERGE WITH ADR-PROPOSED-G

**Target owner:** CAND-G

**Sources:** C-01a05a93-L114, WB-0032. Current source paths: `RUNBOOK.md`, `tools/workbench-adoption.mjs`, `tools/workbench-upgrade.mjs`, `workbench/docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md`, `workbench/specs/S-041-recorded-baseline-availability/SPEC.md`, `tools/control-fidelity.mjs`.

<a id="r072"></a>

## R072 — Managed runtime files have one owner and explicit update receipts

**Historical intent:** Install portable runtime tools in the manifest tools lane with release, commit and per-file hashes. Preserve application tools; updates back up managed files and record rollback.

**Original status:** Accepted

**Why this existed:** Shared ownership and symlinked product dependencies made upgrades unsafe and consumers nonportable.

**Assumptions and scope:** Source release, installed generation, runtime and target containment require separate evidence; unavailable state must not be filled by inference.

**Observed current state:** Setup tools and distinct source/installed receipts exist. Adoption and upgrade recovery still use collections.checkpoints. Fidelity tests passed 15/15; this report does not certify a new upgrade or deployment.

**Prior pass observation (attributed; not a new runtime test):** tools lane with release/commit/per-file hashes; root tools/ stays application-owned. Dogfooded here.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. tools lane with release/commit/per-file hashes; root tools/ stays application-owned. Dogfooded here.

**Disposition:** ALREADY COVERED

**Target owner:** ADR-0031

**Sources:** WB-0031. Current source paths: `RUNBOOK.md`, `tools/workbench-adoption.mjs`, `tools/workbench-upgrade.mjs`, `workbench/docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md`, `workbench/specs/S-041-recorded-baseline-availability/SPEC.md`, `tools/control-fidelity.mjs`.

<a id="r073"></a>

## R073 — Preflight every consumed source lane before mutation

**Historical intent:** Check the actual source identity and cleanliness of the manifest, templates, runtime tools and skills consumed by an upgrade before changing a consumer.

**Original status:** Accepted

**Why this existed:** Checking only one lane allowed a valid-looking receipt to accompany files from dirty or mismatched sources.

**Assumptions and scope:** Source release, installed generation, runtime and target containment require separate evidence; unavailable state must not be filled by inference.

**Observed current state:** Setup tools and distinct source/installed receipts exist. Adoption and upgrade recovery still use collections.checkpoints. Fidelity tests passed 15/15; this report does not certify a new upgrade or deployment.

**Prior pass observation (attributed; not a new runtime test):** S-032 upgrade-route-and-source-provenance implements multi-lane preflight; no ADR.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Different preconditions and allowed effects are a durable architectural choice. Link runtime ownership to ADR-0031; source validation is required for every consumed lane.

**Disposition:** MERGE WITH ADR-PROPOSED-G

**Target owner:** CAND-G

**Sources:** S-036. Current source paths: `RUNBOOK.md`, `tools/workbench-adoption.mjs`, `tools/workbench-upgrade.mjs`, `workbench/docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md`, `workbench/specs/S-041-recorded-baseline-availability/SPEC.md`, `tools/control-fidelity.mjs`.

<a id="r074"></a>

## R074 — Release, adopted files and running behavior are separate states

**Historical intent:** Keep released version, actually installed version, reviewed version and running source distinct. Candidate tests are not installed-state reviews.

**Original status:** Accepted

**Why this existed:** Publishing or passing source tests did not establish downstream adoption or deployment.

**Assumptions and scope:** Source release, installed generation, runtime and target containment require separate evidence; unavailable state must not be filled by inference.

**Observed current state:** Setup tools and distinct source/installed receipts exist. Adoption and upgrade recovery still use collections.checkpoints. Fidelity tests passed 15/15; this report does not certify a new upgrade or deployment.

**Prior pass observation (attributed; not a new runtime test):** AU-0004 holds this downstream only; upstream has S-039/S-042 implementing it with no ADR.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Each evidence claim names the state it proves. Historical adoption provenance cannot stand in for current tools, skills, runtime or downstream acceptance.

**Disposition:** KEEP - ADR

**Target owner:** CAND-H

**Sources:** AU-0004, D-CIC. Current source paths: `RUNBOOK.md`, `tools/workbench-adoption.mjs`, `tools/workbench-upgrade.mjs`, `workbench/docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md`, `workbench/specs/S-041-recorded-baseline-availability/SPEC.md`, `tools/control-fidelity.mjs`.

<a id="r075"></a>

## R075 — Use the manifest's exact integration branch

**Historical intent:** Resolve the integration destination by exact case from the room's manifest, separately from its default branch; declaration does not itself create that branch.

**Original status:** Accepted

**Why this existed:** Some rooms used Integration, some integration, and some had no usable review destination.

**Assumptions and scope:** Source release, installed generation, runtime and target containment require separate evidence; unavailable state must not be filled by inference.

**Observed current state:** Setup tools and distinct source/installed receipts exist. Adoption and upgrade recovery still use collections.checkpoints. Fidelity tests passed 15/15; this report does not certify a new upgrade or deployment.

**Prior pass observation (attributed; not a new runtime test):** manifest git.integrationBranch = integration; doctor registers both diagnostics.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. manifest git.integrationBranch = integration; doctor registers both diagnostics.

**Disposition:** ALREADY COVERED

**Target owner:** ADR-0039

**Sources:** WB-0039. Current source paths: `RUNBOOK.md`, `tools/workbench-adoption.mjs`, `tools/workbench-upgrade.mjs`, `workbench/docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md`, `workbench/specs/S-041-recorded-baseline-availability/SPEC.md`, `tools/control-fidelity.mjs`.

<a id="r076"></a>

## R076 — Review the immutable integration candidate independently

**Historical intent:** Separate-context review occurs when branches combine at integration. A changed candidate invalidates the verdict; earlier checks need not become independent reviews per ticket.

**Original status:** Accepted

**Why this existed:** Reviewing a nearby SHA or every intermediate change respectively weakens assurance or creates repeated stops.

**Assumptions and scope:** Source release, installed generation, runtime and target containment require separate evidence; unavailable state must not be filled by inference.

**Observed current state:** Current rules require immutable review, destination containment and guarded cleanup. Live remote integration equals the inspected HEAD; main is a different commit. No merge, publication or cleanup was performed.

**Prior pass observation (attributed; not a new runtime test):** ADR-0037 accepted; AGENTS Branch Completion carries it.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. ADR-0037 accepted; AGENTS Branch Completion carries it.

**Disposition:** ALREADY COVERED

**Target owner:** ADR-0037

**Sources:** WB-0037, D-FLIGHT. Current source paths: `AGENTS.md`, `workbench/docs/adr/0037-independent-review-at-integration.md`, `workbench/docs/adr/0039-the-integration-branch-is-a-manifest-declared-fact.md`.

<a id="r077"></a>

## R077 — Target movement requires review of the resulting candidate

**Historical intent:** If integration changes the candidate's content, test and review the exact result before advancing the destination. Do not reuse a verdict merely because the original feature head was reviewed.

**Original status:** Accepted

**Why this existed:** A clean review of one object does not cover another merge result.

**Assumptions and scope:** Source release, installed generation, runtime and target containment require separate evidence; unavailable state must not be filled by inference.

**Observed current state:** Current rules require immutable review, destination containment and guarded cleanup. Live remote integration equals the inspected HEAD; main is a different commit. No merge, publication or cleanup was performed.

**Prior pass observation (attributed; not a new runtime test):** ADR-0037 says a changed candidate needs fresh review but does not name target movement as the trigger.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Refresh review when integration produces a changed candidate. Target movement is the check trigger; do not manufacture a new mandatory full review when evidence proves the assessed result is unchanged.

**Disposition:** MERGE WITH ADR-0037

**Target owner:** ADR-0037

**Sources:** D-FLIGHT, D-LIFEV2. Current source paths: `AGENTS.md`, `workbench/docs/adr/0037-independent-review-at-integration.md`, `workbench/docs/adr/0039-the-integration-branch-is-a-manifest-declared-fact.md`.

<a id="r078"></a>

## R078 — Remote recovery is proven by the actual ref and object

**Historical intent:** Verify the intended remote reference contains the exact candidate. Missing tracking metadata or a stale fetch refspec is not proof that work is unpushed.

**Original status:** Accepted

**Why this existed:** The record contains repeated false unsaved-work alarms despite matching remote SHAs.

**Assumptions and scope:** Source release, installed generation, runtime and target containment require separate evidence; unavailable state must not be filled by inference.

**Observed current state:** Current rules require immutable review, destination containment and guarded cleanup. Live remote integration equals the inspected HEAD; main is a different commit. No merge, publication or cleanup was performed.

**Prior pass observation (attributed; not a new runtime test):** AGENTS says a tracking upstream is not proof of containment, but no ADR carries the evidence-identity rationale; the /land skill exists only in the personal home.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Exact candidate, actual destination containment and safe cleanup already have behavioral owners. Add rationale there and preserve remote uncertainty; do not create another generic completion gate.

**Disposition:** MERGE WITH ADR-0037

**Target owner:** ADR-0037; CAND-H

**Sources:** D-V3, C-fba9567e-L3, D-INTEGRATION. Current source paths: `AGENTS.md`, `workbench/docs/adr/0037-independent-review-at-integration.md`, `workbench/docs/adr/0039-the-integration-branch-is-a-manifest-declared-fact.md`.

<a id="r079"></a>

## R079 — Preserve dirty work and recover before cleanup

**Historical intent:** Classify and preserve meaningful uncommitted work before removing obsolete worktrees or old paths. Use recoverable checkpoints and non-force integration without overwriting unrelated owner changes.

**Original status:** Accepted

**Why this existed:** Cleanup and relocation can erase the only remaining copy of unfinished work.

**Assumptions and scope:** Source release, installed generation, runtime and target containment require separate evidence; unavailable state must not be filled by inference.

**Observed current state:** Current rules require immutable review, destination containment and guarded cleanup. Live remote integration equals the inspected HEAD; main is a different commit. No merge, publication or cleanup was performed.

**Prior pass observation (attributed; not a new runtime test):** AGENTS Safety preserves unrelated dirty work; recovery-before-cleanup ordering is unstated.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Exact candidate, actual destination containment and safe cleanup already have behavioral owners. Add rationale there and preserve remote uncertainty; do not create another generic completion gate.

**Disposition:** MERGE WITH ADR-0037

**Target owner:** ADR-0037; CAND-H

**Sources:** D-CLEANUP, D-CANON. Current source paths: `AGENTS.md`, `workbench/docs/adr/0037-independent-review-at-integration.md`, `workbench/docs/adr/0039-the-integration-branch-is-a-manifest-declared-fact.md`.

<a id="r080"></a>

## R080 — Public products exclude private instance state

**Historical intent:** Package public-safe source separately from private Wiki content, identities, runtime ledgers, credentials, topology and private derived digests.

**Original status:** Accepted

**Why this existed:** A cleaned product is not a copy of the private deployment's operational data.

**Assumptions and scope:** Source release, installed generation, runtime and target containment require separate evidence; unavailable state must not be filled by inference.

**Observed current state:** Setup tools and distinct source/installed receipts exist. Adoption and upgrade recovery still use collections.checkpoints. Fidelity tests passed 15/15; this report does not certify a new upgrade or deployment.

**Prior pass observation (attributed; not a new runtime test):** Public/private packaging is implied by sole-source but not stated; this repo's templates/ dogfood boundary is the live instance.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. Public/private packaging is implied by sole-source but not stated; this repo's templates/ dogfood boundary is the live instance.

**Disposition:** MERGE WITH ADR-0026

**Target owner:** ADR-0026 amendment

**Sources:** D-LIFEV2, H-FR, D-PRODUCER. Current source paths: `RUNBOOK.md`, `tools/workbench-adoption.mjs`, `tools/workbench-upgrade.mjs`, `workbench/docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md`, `workbench/specs/S-041-recorded-baseline-availability/SPEC.md`, `tools/control-fidelity.mjs`.

<a id="r081"></a>

## R081 — Package mechanically; review publication judgment independently

**Historical intent:** Mechanical archive/clean/package/publish work belongs in deterministic tooling; the judgment that the candidate is fit and public-safe belongs in independent review under actual publication authority.

**Original status:** Accepted

**Why this existed:** A publishing script and an auditor do different jobs; inventing a new role was unnecessary.

**Assumptions and scope:** Source release, installed generation, runtime and target containment require separate evidence; unavailable state must not be filled by inference.

**Observed current state:** Setup tools and distinct source/installed receipts exist. Adoption and upgrade recovery still use collections.checkpoints. Fidelity tests passed 15/15; this report does not certify a new upgrade or deployment.

**Prior pass observation (attributed; not a new runtime test):** Same proof-vs-judgment split as R019, applied to publication.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Separate review and authorization already have owners. Packaging procedures remain procedures, not a new independent governance system.

**Disposition:** MERGE WITH ADR-0037

**Target owner:** ADR-0037; ADR-0027

**Sources:** H-SC, H-FR. Current source paths: `RUNBOOK.md`, `tools/workbench-adoption.mjs`, `tools/workbench-upgrade.mjs`, `workbench/docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md`, `workbench/specs/S-041-recorded-baseline-availability/SPEC.md`, `tools/control-fidelity.mjs`.

<a id="r082"></a>

## R082 — Integration delivery does not grant main promotion

**Historical intent:** An authorized landing targets the exact integration destination; main promotion remains the owner's separate boundary unless explicitly authorized for that work.

**Original status:** Accepted

**Why this existed:** Agents repeatedly treated completing a branch as permission to advance a more protected destination.

**Assumptions and scope:** Source release, installed generation, runtime and target containment require separate evidence; unavailable state must not be filled by inference.

**Observed current state:** Current rules require immutable review, destination containment and guarded cleanup. Live remote integration equals the inspected HEAD; main is a different commit. No merge, publication or cleanup was performed.

**Prior pass observation (attributed; not a new runtime test):** AGENTS: only the owner merges integration into main; permission layer blocks it.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. AGENTS: only the owner merges integration into main; permission layer blocks it.

**Disposition:** ALREADY COVERED

**Target owner:** AGENTS.md, ADR-0039

**Sources:** D-FLIGHT, D-CIC, C-019f6974-L1120. Current source paths: `AGENTS.md`, `workbench/docs/adr/0037-independent-review-at-integration.md`, `workbench/docs/adr/0039-the-integration-branch-is-a-manifest-declared-fact.md`.

<a id="r083"></a>

## R083 — Completion must reconcile the owning downstream boundary

**Historical intent:** Report separately what was authored, reviewed, remotely delivered, installed, running, accepted and closed. Closure uses the real available owner and evidence rather than an unimplemented ceremonial receipt.

**Original status:** Accepted

**Why this existed:** Components passed tests while the requested usable result remained undelivered or delivered-but-unclosed.

**Assumptions and scope:** Source release, installed generation, runtime and target containment require separate evidence; unavailable state must not be filled by inference.

**Observed current state:** Current rules require immutable review, destination containment and guarded cleanup. Live remote integration equals the inspected HEAD; main is a different commit. No merge, publication or cleanup was performed.

**Prior pass observation (attributed; not a new runtime test):** AGENTS Branch Completion covers merge and containment, not the authored/reviewed/installed/running/accepted ladder.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Exact candidate, actual destination containment and safe cleanup already have behavioral owners. Add rationale there and preserve remote uncertainty; do not create another generic completion gate.

**Disposition:** MERGE WITH ADR-0037

**Target owner:** ADR-0037; CAND-H

**Sources:** D-FLIGHT, D-POSTFLIGHT, D-CIC, GO-0024. Current source paths: `AGENTS.md`, `workbench/docs/adr/0037-independent-review-at-integration.md`, `workbench/docs/adr/0039-the-integration-branch-is-a-manifest-declared-fact.md`.

<a id="r084"></a>

## R084 — Human-readable staged setup rather than an opaque giant wizard

**Historical intent:** Keep setup understandable and inspectable through the guide and small tooling stages so the owner can see what the harness is doing.

**Original status:** Strong preference

**Why this existed:** A large generated setup mechanism can conceal assumptions and make repair harder.

**Assumptions and scope:** Source release, installed generation, runtime and target containment require separate evidence; unavailable state must not be filled by inference.

**Observed current state:** Setup tools and distinct source/installed receipts exist. Adoption and upgrade recovery still use collections.checkpoints. Fidelity tests passed 15/15; this report does not certify a new upgrade or deployment.

**Prior pass observation (attributed; not a new runtime test):** Setup is already staged across genesis/adoption skills plus small tools; the preference deserves recording, not enforcing.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. Setup is already staged across genesis/adoption skills plus small tools; the preference deserves recording, not enforcing.

**Disposition:** KEEP - DOC

**Target owner:** README.md / RUNBOOK.md

**Sources:** C-01a05af1-L519, B-LAYOUT. Current source paths: `RUNBOOK.md`, `tools/workbench-adoption.mjs`, `tools/workbench-upgrade.mjs`, `workbench/docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md`, `workbench/specs/S-041-recorded-baseline-availability/SPEC.md`, `tools/control-fidelity.mjs`.

<a id="r085"></a>

## R085 — Prove the harness improves work, not just its own score

**Historical intent:** Evaluate actual agent outcomes against meaningful baselines; static template quality, document counts and a green self-test do not demonstrate improved behavior.

**Original status:** Accepted

**Why this existed:** The owner asked for scientific proof of benefit from the beginning, before the later governance expansion.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Report format already requires evidence limitations and report-scoped IDs/shared recurrence keys. It does not separately name evaluated and reporting models. Outcome docs require controlled repeated comparisons; no new agent-outcome trial was run.

**Prior pass observation (attributed; not a new runtime test):** evals/ (condition-blind grader, held-out task_b), outcomes/ (conditions, mock agents) and S-002 complete all exist with NO ADR governing them.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Preserve held-out comparisons, honest incompleteness and baseline integrity. This is a durable alternative to optimizing a structural self-score.

**Disposition:** KEEP - ADR

**Target owner:** CAND-C

**Sources:** C-019ef330-L6, C-019ef347-L6, G-6a9cff88. Current source paths: `AGENTS.md`, `workbench/feedback/REPORT_FORMAT.md`, `evals/README.md`, `outcomes/README.md`, `tools/test-cross-provider-fixture.mjs`.

<a id="r086"></a>

## R086 — Use held-out, condition-blind comparisons

**Historical intent:** Hold task inputs and grading stable, compare with a no-template baseline, isolate trials and use held-out tasks so the harness does not tune itself to its own grading criteria.

**Original status:** Accepted

**Why this existed:** Self-serving evaluators and easy development fixtures can create illusory improvement.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Report format already requires evidence limitations and report-scoped IDs/shared recurrence keys. It does not separately name evaluated and reporting models. Outcome docs require controlled repeated comparisons; no new agent-outcome trial was run.

**Prior pass observation (attributed; not a new runtime test):** S-002 complete: condition-blind held-out path-safety fixture and grader.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Preserve held-out comparisons, honest incompleteness and baseline integrity. This is a durable alternative to optimizing a structural self-score.

**Disposition:** MERGE WITH ADR-PROPOSED-C

**Target owner:** CAND-C

**Sources:** C-019ef347-L6, C-019f5a56-L215. Current source paths: `AGENTS.md`, `workbench/feedback/REPORT_FORMAT.md`, `evals/README.md`, `outcomes/README.md`, `tools/test-cross-provider-fixture.mjs`.

<a id="r087"></a>

## R087 — Judge resulting state and honest incompleteness

**Historical intent:** Grade what the agent actually changed and verified, including scope and truthful incomplete reporting, rather than rewarding a confident final response.

**Original status:** Accepted

**Why this existed:** A system that reports success dishonestly can outperform honest behavior on a naive rubric.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Report format already requires evidence limitations and report-scoped IDs/shared recurrence keys. It does not separately name evaluated and reporting models. Outcome docs require controlled repeated comparisons; no new agent-outcome trial was run.

**Prior pass observation (attributed; not a new runtime test):** evals/tasks/task_a_scope_honesty grades honest incompleteness; the invariant has no durable owner.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Preserve held-out comparisons, honest incompleteness and baseline integrity. This is a durable alternative to optimizing a structural self-score.

**Disposition:** MERGE WITH ADR-PROPOSED-C

**Target owner:** CAND-C

**Sources:** C-019f5a56-L215, AU-0001. Current source paths: `AGENTS.md`, `workbench/feedback/REPORT_FORMAT.md`, `evals/README.md`, `outcomes/README.md`, `tools/test-cross-provider-fixture.mjs`.

<a id="r088"></a>

## R088 — Inspection, observed use and behavioral tests stay separate

**Historical intent:** Label the three evidence types and never pool them into one health score or average.

**Original status:** Accepted

**Why this existed:** A coherence check and a measured task outcome answer different questions and can conceal each other's regressions.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Report format already requires evidence limitations and report-scoped IDs/shared recurrence keys. It does not separately name evaluated and reporting models. Outcome docs require controlled repeated comparisons; no new agent-outcome trial was run.

**Prior pass observation (attributed; not a new runtime test):** REPORT_FORMAT warns static checks prove no outcome improvement but does not name the three evidence types.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Put evaluated/reviewer model fields and evidence states in the report contract. Retain the evidence rationale under C; do not import the Audit application or a mandatory central findings service.

**Disposition:** KEEP - CONTRACT

**Target owner:** workbench/feedback/REPORT_FORMAT.md

**Sources:** AU-0001. Current source paths: `AGENTS.md`, `workbench/feedback/REPORT_FORMAT.md`, `evals/README.md`, `outcomes/README.md`, `tools/test-cross-provider-fixture.mjs`.

<a id="r089"></a>

## R089 — Evaluated model and reviewer model are independent fields

**Historical intent:** Record whose behavior is evaluated separately from who reviewed the evidence. A static inspection may have no evaluated model.

**Original status:** Accepted

**Why this existed:** A report written by Claude does not prove Claude operates well under the harness.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Report format already requires evidence limitations and report-scoped IDs/shared recurrence keys. It does not separately name evaluated and reporting models. Outcome docs require controlled repeated comparisons; no new agent-outcome trial was run.

**Prior pass observation (attributed; not a new runtime test):** VERIFIED GAP: REPORT_FORMAT requires target revision and skill-copy provenance but never requires naming the evaluated model separately from the reporting model.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Name evaluated model separately from reporting model; allow not-applicable for structural inspections. This is a proposed report-contract correction, not an already delivered field.

**Disposition:** KEEP - CONTRACT

**Target owner:** workbench/feedback/REPORT_FORMAT.md

**Sources:** AU-0002. Current source paths: `AGENTS.md`, `workbench/feedback/REPORT_FORMAT.md`, `evals/README.md`, `outcomes/README.md`, `tools/test-cross-provider-fixture.mjs`.

<a id="r090"></a>

## R090 — One finding can have many observations and occurrences

**Historical intent:** Keep one durable problem identity across reports, with repeated observations and separate affected-project occurrences. Absence from a later report means not retested, not resolved.

**Original status:** Accepted

**Why this existed:** Counting reports inflated problem totals and lost recurrence.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Report format already requires evidence limitations and report-scoped IDs/shared recurrence keys. It does not separately name evaluated and reporting models. Outcome docs require controlled repeated comparisons; no new agent-outcome trial was run.

**Prior pass observation (attributed; not a new runtime test):** REPORT_FORMAT already scopes finding IDs to the report and requires an explicit shared recurrence key.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Current report keys cover disambiguation, not the whole longitudinal lifecycle. Preserve not-retested versus resolved and leave the central finding store with Audit.

**Disposition:** KEEP - DOC

**Target owner:** workbench/feedback/REPORT_FORMAT.md; Audit owner

**Sources:** AU-0003. Current source paths: `AGENTS.md`, `workbench/feedback/REPORT_FORMAT.md`, `evals/README.md`, `outcomes/README.md`, `tools/test-cross-provider-fixture.mjs`.

<a id="r091"></a>

## R091 — Execution failures are not automatically harness defects

**Historical intent:** Keep unavailable runners, missing evidence, interrupted attempts and incomplete coverage visible as execution/evidence states.

**Original status:** Accepted

**Why this existed:** A failed measurement is not evidence of a failed harness behavior.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Report format already requires evidence limitations and report-scoped IDs/shared recurrence keys. It does not separately name evaluated and reporting models. Outcome docs require controlled repeated comparisons; no new agent-outcome trial was run.

**Prior pass observation (attributed; not a new runtime test):** REPORT_FORMAT has an Evidence And Limitations section but no named execution/evidence failure states.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** The current format already distinguishes observed behavior, inference and hypotheses. Add explicit unavailable/interrupted/missing-evidence examples; do not claim no evidence taxonomy exists.

**Disposition:** KEEP - CONTRACT

**Target owner:** workbench/feedback/REPORT_FORMAT.md

**Sources:** AU-0004, AU-0001. Current source paths: `AGENTS.md`, `workbench/feedback/REPORT_FORMAT.md`, `evals/README.md`, `outcomes/README.md`, `tools/test-cross-provider-fixture.mjs`.

<a id="r092"></a>

## R092 — Investigate a finding before repairing it

**Historical intent:** Re-read the claimed mechanism at an identified source revision; distinguish confirmed, unsupported, environmental and deferred findings before proposing or applying a fix.

**Original status:** Accepted

**Why this existed:** Upstream repairs based on unsupported reports can introduce new defects and erase useful dissent.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Report format already requires evidence limitations and report-scoped IDs/shared recurrence keys. It does not separately name evaluated and reporting models. Outcome docs require controlled repeated comparisons; no new agent-outcome trial was run.

**Prior pass observation (attributed; not a new runtime test):** 'Challenged Or Rejected Findings' section requires exactly this, including retaining dissent.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. 'Challenged Or Rejected Findings' section requires exactly this, including retaining dissent.

**Disposition:** ALREADY COVERED

**Target owner:** REPORT_FORMAT.md

**Sources:** G-6a9c9513, A-BLUEPRINT. Current source paths: `AGENTS.md`, `workbench/feedback/REPORT_FORMAT.md`, `evals/README.md`, `outcomes/README.md`, `tools/test-cross-provider-fixture.mjs`.

<a id="r093"></a>

## R093 — Audit Workbench owns independent review history and visualization

**Historical intent:** Use a separate review application to retain results across projects, harness versions and models, with a visual interface and drill-down evidence.

**Original status:** Accepted

**Why this existed:** The owner did not want to read long Markdown report stacks or have every project manage its own improvement program.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Report format already requires evidence limitations and report-scoped IDs/shared recurrence keys. It does not separately name evaluated and reporting models. Outcome docs require controlled repeated comparisons; no new agent-outcome trial was run.

**Prior pass observation (attributed; not a new runtime test):** Audit_Workbench S-001 harness-review-ledger and S-003 decision-first-website own it.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. Audit_Workbench S-001 harness-review-ledger and S-003 decision-first-website own it.

**Disposition:** OUT OF SCOPE

**Target owner:** Audit_Workbench

**Sources:** G-6a9b96e1, G-6a9c9513, AU-0006. Current source paths: `AGENTS.md`, `workbench/feedback/REPORT_FORMAT.md`, `evals/README.md`, `outcomes/README.md`, `tools/test-cross-provider-fixture.mjs`.

<a id="r094"></a>

## R094 — Central review storage with a standalone fallback

**Historical intent:** An enrolled project receives an explicit central evidence destination; a standalone Workbench retains local reporting. Central private storage still needs an explicit recovery policy.

**Original status:** Accepted

**Why this existed:** Scattered reports made comparisons difficult, but requiring the central app would break portability.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Report format already requires evidence limitations and report-scoped IDs/shared recurrence keys. It does not separately name evaluated and reporting models. Outcome docs require controlled repeated comparisons; no new agent-outcome trial was run.

**Prior pass observation (attributed; not a new runtime test):** Audit_Workbench S-005 release-campaigns; upstream keeps the destination-optional wording already in REPORT_FORMAT.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. Audit_Workbench S-005 release-campaigns; upstream keeps the destination-optional wording already in REPORT_FORMAT.

**Disposition:** OUT OF SCOPE

**Target owner:** Audit_Workbench

**Sources:** AU-0006. Current source paths: `AGENTS.md`, `workbench/feedback/REPORT_FORMAT.md`, `evals/README.md`, `outcomes/README.md`, `tools/test-cross-provider-fixture.mjs`.

<a id="r095"></a>

## R095 — The reviewer must itself be reviewed independently

**Historical intent:** Audit Workbench is part of the portfolio, with independent review of its consequential outputs and self-review exclusions.

**Original status:** Accepted

**Why this existed:** Its own missing integration destination escaped an audit sweep that excluded the reviewer.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Report format already requires evidence limitations and report-scoped IDs/shared recurrence keys. It does not separately name evaluated and reporting models. Outcome docs require controlled repeated comparisons; no new agent-outcome trial was run.

**Prior pass observation (attributed; not a new runtime test):** VERIFIED: Audit_Workbench S-008-self-enrolment-and-reviewer-independence already owns this.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Audit self-review exclusion remains an Audit application concern. Do not add recursive reviewer-of-reviewer gates to every base action.

**Disposition:** OUT OF SCOPE

**Target owner:** Audit_Workbench

**Sources:** A-BLUEPRINT. Current source paths: `AGENTS.md`, `workbench/feedback/REPORT_FORMAT.md`, `evals/README.md`, `outcomes/README.md`, `tools/test-cross-provider-fixture.mjs`.

<a id="r096"></a>

## R096 — Separate source development, deployment and audit roles across rooms

**Historical intent:** LLM_Workbench develops the template; GPT_OS coordinates deployment in the described workflow; Audit_Workbench consolidates and challenges feedback. Reports flow back upstream without the audit room silently repairing targets.

**Original status:** Accepted

**Why this existed:** The owner explicitly corrected a workflow that treated LLM_Workbench as the deployer and conflated review with mutation.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Report format already requires evidence limitations and report-scoped IDs/shared recurrence keys. It does not separately name evaluated and reporting models. Outcome docs require controlled repeated comparisons; no new agent-outcome trial was run.

**Prior pass observation (attributed; not a new runtime test):** Three rooms verified present (LLM_Workbench, GPT_OS, Audit_Workbench); ADR-0026 names only source-vs-extension, not the deployer/auditor roles.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. Three rooms verified present (LLM_Workbench, GPT_OS, Audit_Workbench); ADR-0026 names only source-vs-extension, not the deployer/auditor roles.

**Disposition:** MERGE WITH ADR-0026

**Target owner:** ADR-0026 amendment

**Sources:** G-6a9c9513, A-BLUEPRINT. Current source paths: `AGENTS.md`, `workbench/feedback/REPORT_FORMAT.md`, `evals/README.md`, `outcomes/README.md`, `tools/test-cross-provider-fixture.mjs`.

<a id="r097"></a>

## R097 — Review each adopted release and preserve longitudinal comparisons

**Historical intent:** Track reviews by actual installed release, project and model, retaining previous observations and making progress or recurrence visible.

**Original status:** Accepted

**Why this existed:** One-time reviews cannot tell whether a release helped or merely changed the report.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Report format already requires evidence limitations and report-scoped IDs/shared recurrence keys. It does not separately name evaluated and reporting models. Outcome docs require controlled repeated comparisons; no new agent-outcome trial was run.

**Prior pass observation (attributed; not a new runtime test):** Campaign scheduling is Audit S-005; the portable identity half is folded into CAND-D.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. Campaign scheduling is Audit S-005; the portable identity half is folded into CAND-D.

**Disposition:** OUT OF SCOPE

**Target owner:** Audit_Workbench

**Sources:** G-6a9b96e1, AU-0004. Current source paths: `AGENTS.md`, `workbench/feedback/REPORT_FORMAT.md`, `evals/README.md`, `outcomes/README.md`, `tools/test-cross-provider-fixture.mjs`.

<a id="r098"></a>

## R098 — Measure owner coordination work as harness friction

**Historical intent:** Treat repeated owner reminders to save, route, reconcile, resume or finish as observable workflow friction, while separating them from legitimate architectural decisions.

**Original status:** Strong preference

**Why this existed:** The harness is supposed to carry the conversation and process so the owner does not become its manual scheduler.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Report format already requires evidence limitations and report-scoped IDs/shared recurrence keys. It does not separately name evaluated and reporting models. Outcome docs require controlled repeated comparisons; no new agent-outcome trial was run.

**Prior pass observation (attributed; not a new runtime test):** VERIFIED: S-049 is complete; the /carry skill records each occurrence where the owner still had to supply routine coordination.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. VERIFIED: S-049 is complete; the /carry skill records each occurrence where the owner still had to supply routine coordination.

**Disposition:** ALREADY COVERED

**Target owner:** S-049

**Sources:** G-6a9cff88, A-BLUEPRINT. Current source paths: `AGENTS.md`, `workbench/feedback/REPORT_FORMAT.md`, `evals/README.md`, `outcomes/README.md`, `tools/test-cross-provider-fixture.mjs`.

<a id="r099"></a>

## R099 — Preserve visibility and epistemic states rather than filling gaps

**Historical intent:** Distinguish fresh, stale, unavailable, malformed, inaccessible and user-reported evidence; distinguish a capability being available, eligible, shown, consulted and acted through.

**Original status:** Accepted

**Why this existed:** Declared availability and actual use were repeatedly mistaken for one another.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Report format already requires evidence limitations and report-scoped IDs/shared recurrence keys. It does not separately name evaluated and reporting models. Outcome docs require controlled repeated comparisons; no new agent-outcome trial was run.

**Prior pass observation (attributed; not a new runtime test):** Diagnostics already model stale/unknown states; the shared evidence vocabulary is unwritten.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Put evaluated/reviewer model fields and evidence states in the report contract. Retain the evidence rationale under C; do not import the Audit application or a mandatory central findings service.

**Disposition:** KEEP - CONTRACT

**Target owner:** workbench/feedback/REPORT_FORMAT.md

**Sources:** C-019f7df4-L9, A-BLUEPRINT. Current source paths: `AGENTS.md`, `workbench/feedback/REPORT_FORMAT.md`, `evals/README.md`, `outcomes/README.md`, `tools/test-cross-provider-fixture.mjs`.

<a id="r100"></a>

## R100 — Do not weaken criteria to make self-improvement look successful

**Historical intent:** Retain the baseline and grading standard when judging a change. Improvements require evidence; an easier rubric or a current 100 score does not establish the harness is finished.

**Original status:** Accepted

**Why this existed:** The owner wanted a system capable of detecting regressions and still raising its standards.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Report format already requires evidence limitations and report-scoped IDs/shared recurrence keys. It does not separately name evaluated and reporting models. Outcome docs require controlled repeated comparisons; no new agent-outcome trial was run.

**Prior pass observation (attributed; not a new runtime test):** AGENTS forbids weakening criteria to raise a score; the baseline-retention rationale has no ADR.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Preserve held-out comparisons, honest incompleteness and baseline integrity. This is a durable alternative to optimizing a structural self-score.

**Disposition:** MERGE WITH ADR-PROPOSED-C

**Target owner:** CAND-C

**Sources:** H-SC, C-019f4b37-L9, C-019ef347-L6. Current source paths: `AGENTS.md`, `workbench/feedback/REPORT_FORMAT.md`, `evals/README.md`, `outcomes/README.md`, `tools/test-cross-provider-fixture.mjs`.

<a id="r101"></a>

## R101 — Feedback repair loops are bounded and independently reviewed

**Historical intent:** A scheduled builder proposes a bounded candidate, an independent reviewer challenges it, and iteration has explicit budget, identity and stop conditions.

**Original status:** Accepted historical direction

**Why this existed:** Unbounded self-improvement loops spend tokens, repeat findings and merge unverified changes.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Report format already requires evidence limitations and report-scoped IDs/shared recurrence keys. It does not separately name evaluated and reporting models. Outcome docs require controlled repeated comparisons; no new agent-outcome trial was run.

**Prior pass observation (attributed; not a new runtime test):** Optional automation; AGENTS already forbids the base from starting one.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. Optional automation; AGENTS already forbids the base from starting one.

**Disposition:** OUT OF SCOPE

**Target owner:** Audit_Workbench

**Sources:** C-019f5a56-L9, C-019f5a56-L215. Current source paths: `AGENTS.md`, `workbench/feedback/REPORT_FORMAT.md`, `evals/README.md`, `outcomes/README.md`, `tools/test-cross-provider-fixture.mjs`.

<a id="r102"></a>

## R102 — Setup proof precedes the feedback workflow

**Historical intent:** The initial fresh-agent setup check returns in chat; prove entry first, then reporting and continuation. Do not require an artificial report or handoff to establish that setup works.

**Original status:** Accepted

**Why this existed:** The first experiment's outcome was repeatedly replaced by ceremony it was not testing.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Report format already requires evidence limitations and report-scoped IDs/shared recurrence keys. It does not separately name evaluated and reporting models. Outcome docs require controlled repeated comparisons; no new agent-outcome trial was run.

**Prior pass observation (attributed; not a new runtime test):** ADR-0038 accepted, canonicalized in RUNBOOK/BLUEPRINT/S-027.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. ADR-0038 accepted, canonicalized in RUNBOOK/BLUEPRINT/S-027.

**Disposition:** ALREADY COVERED

**Target owner:** ADR-0038

**Sources:** WB-0038, B-BOUNDARIES. Current source paths: `AGENTS.md`, `workbench/feedback/REPORT_FORMAT.md`, `evals/README.md`, `outcomes/README.md`, `tools/test-cross-provider-fixture.mjs`.

<a id="r103"></a>

## R103 — Prefer real useful acceptance work over artificial workflow evidence

**Historical intent:** Exercise the system on genuine small tasks. Do not redo completed work or create fake Job Orders solely to inflate a validation count.

**Original status:** Accepted

**Why this existed:** Synthetic paperwork can prove the workflow's forms without proving useful delivery.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Report format already requires evidence limitations and report-scoped IDs/shared recurrence keys. It does not separately name evaluated and reporting models. Outcome docs require controlled repeated comparisons; no new agent-outcome trial was run.

**Prior pass observation (attributed; not a new runtime test):** ADR-0038 rejects artificial pilots; the positive rule belongs with the evaluation contract.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Preserve held-out comparisons, honest incompleteness and baseline integrity. This is a durable alternative to optimizing a structural self-score.

**Disposition:** MERGE WITH ADR-PROPOSED-C

**Target owner:** CAND-C

**Sources:** D-CIC, WB-0038. Current source paths: `AGENTS.md`, `workbench/feedback/REPORT_FORMAT.md`, `evals/README.md`, `outcomes/README.md`, `tools/test-cross-provider-fixture.mjs`.

<a id="r104"></a>

## R104 — Reuse the existing behavioral evaluation runner before building another

**Historical intent:** Assess the existing harness eval runner for isolated trials and JSONL results before introducing a second runner.

**Original status:** Proposed

**Why this existed:** Duplicated runners would duplicate grading logic and split evidence contracts.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Report format already requires evidence limitations and report-scoped IDs/shared recurrence keys. It does not separately name evaluated and reporting models. Outcome docs require controlled repeated comparisons; no new agent-outcome trial was run.

**Prior pass observation (attributed; not a new runtime test):** AU-0005 is still 'Proposed' downstream; upstream evals/run.py already exists.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. AU-0005 is still 'Proposed' downstream; upstream evals/run.py already exists.

**Disposition:** OUT OF SCOPE

**Target owner:** Audit_Workbench

**Sources:** AU-0005. Current source paths: `AGENTS.md`, `workbench/feedback/REPORT_FORMAT.md`, `evals/README.md`, `outcomes/README.md`, `tools/test-cross-provider-fixture.mjs`.

<a id="r105"></a>

## R105 — Report permission fidelity across prose and provider controls

**Historical intent:** A declared writable lane must agree with effective provider permissions and supported relative, home and absolute path forms. S-036 corrected the earlier paired Edit/Write model; the invariant is capability fidelity, not that old permission syntax.

**Original status:** Accepted

**Why this existed:** The contract instructed agents to create records while the installed permission file withheld the operation.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Report format already requires evidence limitations and report-scoped IDs/shared recurrence keys. It does not separately name evaluated and reporting models. Outcome docs require controlled repeated comparisons; no new agent-outcome trial was run.

**Prior pass observation (attributed; not a new runtime test):** S-034 control-fidelity-report and S-036 both complete; no ADR carries the capability-fidelity invariant.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Preserve fixed wording when filling placeholders and expose changed/dropped rules. Divergence remains legitimate when deliberately decided; fidelity stays a report, not a universal blocker.

**Disposition:** KEEP - ADR

**Target owner:** CAND-K

**Sources:** AU-0007, S-036. Current source paths: `AGENTS.md`, `workbench/feedback/REPORT_FORMAT.md`, `evals/README.md`, `outcomes/README.md`, `tools/test-cross-provider-fixture.mjs`.

<a id="r106"></a>

## R106 — One durable writer per shared surface

**Historical intent:** Independent read-only work may proceed in parallel; writes to a repository, spec, registry, installed product or shared file need non-overlapping ownership or serialization.

**Original status:** Accepted

**Why this existed:** Parallel agents can collide even when their chat tasks have different names.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Current multi-agent rule and S-020 already cover disjoint writes and one durable writer across shared surfaces. No separate distributed execution guarantee is inferred.

**Prior pass observation (attributed; not a new runtime test):** AGENTS has a one-line rule ('one single durable writer for shared spec/Taskboard state') with no rationale or general scope.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** S-020 records repository/spec/shared-file write ownership, broader than the first pass acknowledged. Application to session sync belongs to N; no new universal lock service.

**Disposition:** ALREADY COVERED

**Target owner:** AGENTS.md; S-020

**Sources:** D-CANON, D-FLIGHT, D-CAS. Current source paths: `AGENTS.md`, `workbench/specs/S-020-spec-native-team-coordination/SPEC.md`, `team templates/MANAGER.md`.

<a id="r107"></a>

## R107 — A durable task is distinct from a worker or attempt

**Historical intent:** One Job Order represents a durable task/lane. Different agents and roles can take successive exclusive runs; a failed attempt is not automatically a new task.

**Original status:** Accepted

**Why this existed:** Per-person records lost continuity while shared simultaneous orders blurred write ownership.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Current multi-agent rule and S-020 already cover disjoint writes and one durable writer across shared surfaces. No separate distributed execution guarantee is inferred.

**Prior pass observation (attributed; not a new runtime test):** Job Order / Claim / Run schemas are Foundry-owned; GO-0021 removed the base requirement.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** ADR-0015/0026 already establish the base boundary. Preserve all historical records and corrections here; do not create an upstream archive Design Concept merely to park abandoned mechanisms.

**Disposition:** OUT OF SCOPE

**Target owner:** Historical packet; original extension owner

**Sources:** H-FR, D-CIC. Current source paths: `AGENTS.md`, `workbench/specs/S-020-spec-native-team-coordination/SPEC.md`, `team templates/MANAGER.md`.

<a id="r108"></a>

## R108 — Rejection and in-scope repair stay on the same task

**Historical intent:** Preserve rejection history and retry the existing task when its scope and acceptance still hold. New scope creates a new bounded task.

**Original status:** Accepted

**Why this existed:** Creating a fresh order on every rejection hid history and inflated work.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Current multi-agent rule and S-020 already cover disjoint writes and one durable writer across shared surfaces. No separate distributed execution guarantee is inferred.

**Prior pass observation (attributed; not a new runtime test):** Extension retry semantics; no upstream consumer.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** ADR-0015/0026 already establish the base boundary. Preserve all historical records and corrections here; do not create an upstream archive Design Concept merely to park abandoned mechanisms.

**Disposition:** OUT OF SCOPE

**Target owner:** Historical packet; original extension owner

**Sources:** D-CIC, D-CAS. Current source paths: `AGENTS.md`, `workbench/specs/S-020-spec-native-team-coordination/SPEC.md`, `team templates/MANAGER.md`.

<a id="r109"></a>

## R109 — Captain directs; Steward manages bounded execution

**Historical intent:** Keep an owner-facing coordinator's context focused on direction and exceptions. Dispatch fresh bounded execution contexts rather than making the coordinator carry every implementation step.

**Original status:** Accepted historical direction

**Why this existed:** The long-running manager chat became overloaded and stopped serving the owner.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Current multi-agent rule and S-020 already cover disjoint writes and one durable writer across shared surfaces. No separate distributed execution guarantee is inferred.

**Prior pass observation (attributed; not a new runtime test):** Captain/Steward are extension roles; ADR-0036 already rejects permanent role departments upstream.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** ADR-0015/0026 already establish the base boundary. Preserve all historical records and corrections here; do not create an upstream archive Design Concept merely to park abandoned mechanisms.

**Disposition:** OUT OF SCOPE

**Target owner:** Historical packet; original extension owner

**Sources:** D-CAS, C-01a055b0-L162. Current source paths: `AGENTS.md`, `workbench/specs/S-020-spec-native-team-coordination/SPEC.md`, `team templates/MANAGER.md`.

<a id="r110"></a>

## R110 — Parallel execution requires satisfied dependencies and disjoint ownership

**Historical intent:** Default to serialized dependent packages; parallelize only when predecessor gates and actual write surfaces permit it.

**Original status:** Accepted

**Why this existed:** Nominally separate tasks still collided through registries, specs, runtime bindings and installed products.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Current multi-agent rule and S-020 already cover disjoint writes and one durable writer across shared surfaces. No separate distributed execution guarantee is inferred.

**Prior pass observation (attributed; not a new runtime test):** The disjoint-write-surface half is portable; the dependency-gate half is coordinator-owned.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Disjoint ownership and dependency ordering already have current owners. Historical coordinator mechanics need no revival.

**Disposition:** ALREADY COVERED

**Target owner:** AGENTS.md; S-020

**Sources:** D-CAS, D-FLIGHT. Current source paths: `AGENTS.md`, `workbench/specs/S-020-spec-native-team-coordination/SPEC.md`, `team templates/MANAGER.md`.

<a id="r111"></a>

## R111 — Keep implementation, review and mutation authority distinct

**Historical intent:** An implementation worker does not accept its own review or land itself by inference; a read-only verifier reports evidence while the authorized owner performs the state-changing transition.

**Original status:** Accepted

**Why this existed:** Role labels alone did not establish independent acceptance or a legitimate close mutation.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Current multi-agent rule and S-020 already cover disjoint writes and one durable writer across shared surfaces. No separate distributed execution guarantee is inferred.

**Prior pass observation (attributed; not a new runtime test):** ADR-0037 forbids self-review satisfying the gate; CAND-B carries the general separation.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Self-review cannot satisfy the integration gate. An agent may integrate after separate-context approval within user authorization; do not revive owner-manual landing for every action.

**Disposition:** ALREADY COVERED

**Target owner:** ADR-0037; AGENTS.md

**Sources:** D-FLIGHT, D-POSTFLIGHT, D-CLOSE. Current source paths: `AGENTS.md`, `workbench/specs/S-020-spec-native-team-coordination/SPEC.md`, `team templates/MANAGER.md`.

<a id="r112"></a>

## R112 — The seven Flight stages must form a real installed chain

**Historical intent:** Intended contract: Sitrep, Preflight, Launch-flight, In-flight, Landing-check, Land and PostFlight-check are separately invokable stages with compatible handoffs and actual installed consumers. Pin exact SHAs at Preflight, Launch, Landing-check, Land and PostFlight-check, where a specific state is verified or acted on; ordinary Sitrep prose and In-flight internal work do not need an extra boundary-SHA field (AC-2).

**Original status:** Accepted historical direction

**Why this existed:** Skill filenames, source tests and a guidebook did not establish an executable end-to-end workflow.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Current multi-agent rule and S-020 already cover disjoint writes and one durable writer across shared surfaces. No separate distributed execution guarantee is inferred.

**Prior pass observation (attributed; not a new runtime test):** Seven Flight stage skills exist only in the personal home; not a Workbench capability.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** ADR-0015/0026 already establish the base boundary. Preserve all historical records and corrections here; do not create an upstream archive Design Concept merely to park abandoned mechanisms.

**Disposition:** OUT OF SCOPE

**Target owner:** Historical packet; original extension owner

**Sources:** D-FLIGHT, D-POSTFLIGHT, D-CIC, D-AC. Current source paths: `AGENTS.md`, `workbench/specs/S-020-spec-native-team-coordination/SPEC.md`, `team templates/MANAGER.md`.

<a id="r113"></a>

## R113 — Handoffs preserve context and exact evidence, not authority

**Historical intent:** Transfers identify the candidate, scope, state and evidence, reference their real owners and preserve ordered retry history without copying or enlarging authorization.

**Original status:** Accepted

**Why this existed:** A handoff was sometimes treated as a substitute for the contract or a fresh grant.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Current multi-agent rule and S-020 already cover disjoint writes and one durable writer across shared surfaces. No separate distributed execution guarantee is inferred.

**Prior pass observation (attributed; not a new runtime test):** Handoff-preserves-context-not-authority is the same rule CAND-A must state.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Handoffs preserve context without transferring or enlarging authority. The contract already exists even though specialized tooling is incomplete.

**Disposition:** ALREADY COVERED

**Target owner:** ADR-0040; ADR-0027; S-046

**Sources:** D-FLIGHT, GO-0012. Current source paths: `AGENTS.md`, `workbench/specs/S-020-spec-native-team-coordination/SPEC.md`, `team templates/MANAGER.md`.

<a id="r114"></a>

## R114 — Preflight checks facts immediately before sensitive execution

**Historical intent:** Bind preflight to the relevant facts and reread race-sensitive state at launch. Receipt timestamps alone do not establish that its assumptions still hold.

**Original status:** Accepted

**Why this existed:** A formerly green receipt can outlive a moved branch, changed scope or competing claim.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Current multi-agent rule and S-020 already cover disjoint writes and one durable writer across shared surfaces. No separate distributed execution guarantee is inferred.

**Prior pass observation (attributed; not a new runtime test):** The portable half is 'reread race-sensitive state at the boundary'; Flight receipts stay extension-owned.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Exact candidate, actual destination containment and safe cleanup already have behavioral owners. Add rationale there and preserve remote uncertainty; do not create another generic completion gate.

**Disposition:** MERGE WITH ADR-0037

**Target owner:** ADR-0037; CAND-H

**Sources:** D-LIFEV2, D-CIC, H-SC. Current source paths: `AGENTS.md`, `workbench/specs/S-020-spec-native-team-coordination/SPEC.md`, `team templates/MANAGER.md`.

<a id="r115"></a>

## R115 — One lifecycle transaction includes one Journal event

**Historical intent:** A private authoritative lifecycle tree records state and exactly one appended Journal event per accepted transition, with the lifecycle engine as the sole mutator.

**Original status:** Accepted historical decision

**Why this existed:** Separate state and ledger writes could disagree about whether a transition happened.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Current multi-agent rule and S-020 already cover disjoint writes and one durable writer across shared surfaces. No separate distributed execution guarantee is inferred.

**Prior pass observation (attributed; not a new runtime test):** Journal/lifecycle engine is extension-only.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** ADR-0015/0026 already establish the base boundary. Preserve all historical records and corrections here; do not create an upstream archive Design Concept merely to park abandoned mechanisms.

**Disposition:** OUT OF SCOPE

**Target owner:** Historical packet; original extension owner

**Sources:** D-LIFEV2, D-CLOSE. Current source paths: `AGENTS.md`, `workbench/specs/S-020-spec-native-team-coordination/SPEC.md`, `team templates/MANAGER.md`.

<a id="r116"></a>

## R116 — Cooperative compare-and-swap is not hostile-writer enforcement

**Historical intent:** Claim only the serialization and protection actually demonstrated. Cooperative exact-tip CAS does not prove remote deletion, force-update or writer restrictions.

**Original status:** Accepted

**Why this existed:** Security and atomicity claims exceeded observed remote policy.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Current multi-agent rule and S-020 already cover disjoint writes and one durable writer across shared surfaces. No separate distributed execution guarantee is inferred.

**Prior pass observation (attributed; not a new runtime test):** CAS is extension-only; its honesty lesson is generic but already covered by ADR-0005.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** ADR-0015/0026 already establish the base boundary. Preserve all historical records and corrections here; do not create an upstream archive Design Concept merely to park abandoned mechanisms.

**Disposition:** OUT OF SCOPE

**Target owner:** Historical packet; original extension owner

**Sources:** D-LIFEV2, D-CIC. Current source paths: `AGENTS.md`, `workbench/specs/S-020-spec-native-team-coordination/SPEC.md`, `team templates/MANAGER.md`.

<a id="r117"></a>

## R117 — Multi-repository parents aggregate immutable child results

**Historical intent:** A parent coordinates dependencies and idempotently ingests child terminal identities; it does not claim atomicity across repository refs.

**Original status:** Accepted historical decision

**Why this existed:** A portfolio outcome cannot be made transactional merely by putting it under one parent order.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Current multi-agent rule and S-020 already cover disjoint writes and one durable writer across shared surfaces. No separate distributed execution guarantee is inferred.

**Prior pass observation (attributed; not a new runtime test):** Multi-repository parent aggregation has no upstream consumer.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** ADR-0015/0026 already establish the base boundary. Preserve all historical records and corrections here; do not create an upstream archive Design Concept merely to park abandoned mechanisms.

**Disposition:** OUT OF SCOPE

**Target owner:** Historical packet; original extension owner

**Sources:** D-LIFEV2. Current source paths: `AGENTS.md`, `workbench/specs/S-020-spec-native-team-coordination/SPEC.md`, `team templates/MANAGER.md`.

<a id="r118"></a>

## R118 — Bound automatic repair and distinguish ambiguous results

**Historical intent:** Give a durable repair identity one declared automatic attempt and budget; ambiguous outcomes or protected scope require escalation, with retries distinguishing accepted, conflict and pre-transition failure.

**Original status:** Accepted historical decision

**Why this existed:** Blind retries can duplicate effects or consume unbounded effort.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Current multi-agent rule and S-020 already cover disjoint writes and one durable writer across shared surfaces. No separate distributed execution guarantee is inferred.

**Prior pass observation (attributed; not a new runtime test):** Bounded automatic repair is coordinator policy.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** ADR-0015/0026 already establish the base boundary. Preserve all historical records and corrections here; do not create an upstream archive Design Concept merely to park abandoned mechanisms.

**Disposition:** OUT OF SCOPE

**Target owner:** Historical packet; original extension owner

**Sources:** D-LIFEV2, D-POSTFLIGHT. Current source paths: `AGENTS.md`, `workbench/specs/S-020-spec-native-team-coordination/SPEC.md`, `team templates/MANAGER.md`.

<a id="r119"></a>

## R119 — Versioned lifecycle migration has one live writer

**Historical intent:** Preserve old lifecycle evidence as readable history while moving to one new authoritative writer; do not keep two live mutation systems.

**Original status:** Accepted historical decision

**Why this existed:** A compatibility path can become a second conflicting authority.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Current multi-agent rule and S-020 already cover disjoint writes and one durable writer across shared surfaces. No separate distributed execution guarantee is inferred.

**Prior pass observation (attributed; not a new runtime test):** Lifecycle migration with one live writer; extension-owned, echoes CAND-M.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** ADR-0015/0026 already establish the base boundary. Preserve all historical records and corrections here; do not create an upstream archive Design Concept merely to park abandoned mechanisms.

**Disposition:** OUT OF SCOPE

**Target owner:** Historical packet; original extension owner

**Sources:** D-LIFEV2. Current source paths: `AGENTS.md`, `workbench/specs/S-020-spec-native-team-coordination/SPEC.md`, `team templates/MANAGER.md`.

<a id="r120"></a>

## R120 — Date-only freshness uses the declared local day

**Historical intent:** Interpret date-only records in the workspace's declared timezone; deduplicate equivalent local and remote refs by repository/object identity.

**Original status:** Accepted

**Why this existed:** UTC midnight made same-local-day work look newer and coherent refs look contradictory.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Current multi-agent rule and S-020 already cover disjoint writes and one durable writer across shared surfaces. No separate distributed execution guarantee is inferred.

**Prior pass observation (attributed; not a new runtime test):** VERIFIED GAP: diagnostics.mjs stale-claim says 'older than one working day' and no tool defines the day boundary or timezone.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Historical timezone ruling was scoped to GPT_OS Preflight. Upstream claim-age code is defined: UTC calendar dates and >86400000ms, while prose says working day. Surface the mismatch; do not import the old scoped algorithm as automatic upstream authority. Preserve ref-deduplication as a second historical clause.

**Disposition:** KEEP - DOC

**Target owner:** RUNBOOK.md; diagnostic owner

**Sources:** D-FRESHNESS. Current source paths: `AGENTS.md`, `workbench/specs/S-020-spec-native-team-coordination/SPEC.md`, `team templates/MANAGER.md`.

<a id="r121"></a>

## R121 — Evidence partition must preserve exact prior bytes and proof boundaries

**Historical intent:** When evidence grows, partition it with exact accounting and provenance while preserving historical bytes; do not merge distinct archive introductions or weaken validators to fit a size cap.

**Original status:** Accepted

**Why this existed:** A spec ceiling and pinned evidence sections made a record unable to accept its own next receipt.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Report format already requires evidence limitations and report-scoped IDs/shared recurrence keys. It does not separately name evaluated and reporting models. Outcome docs require controlled repeated comparisons; no new agent-outcome trial was run.

**Prior pass observation (attributed; not a new runtime test):** S-036/S-038 hit this in practice; a rollover convention is owed, not an ADR.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. S-036/S-038 hit this in practice; a rollover convention is owed, not an ADR.

**Disposition:** KEEP - DOC

**Target owner:** RUNBOOK.md

**Sources:** D-CUMULATIVE, D-V3. Current source paths: `AGENTS.md`, `workbench/feedback/REPORT_FORMAT.md`, `evals/README.md`, `outcomes/README.md`, `tools/test-cross-provider-fixture.mjs`.

<a id="r122"></a>

## R122 — Foundry connects Workbench rooms through optional capabilities

**Historical intent:** A Workbench is a project's operating surface; Foundry connects, monitors and maintains rooms using capability contracts and replaceable modules.

**Original status:** Accepted historical direction

**Why this existed:** The owner repeatedly distinguished the useful project harness from the connected factory.

**Assumptions and scope:** The historical system assumed Foundry/Flight/CIC or multi-room coordination. Those mechanisms are not prerequisites for the current portable base.

**Observed current state:** The live base excludes required Foundry orchestration. Historical extension records remain evidence in their original domain; existence of ancillary code does not make a base feature. No retired runtime was exercised.

**Prior pass observation (attributed; not a new runtime test):** ADR-0015 already names Foundry's capabilities; the architecture detail is history.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** ADR-0015/0026 already establish the base boundary. Preserve all historical records and corrections here; do not create an upstream archive Design Concept merely to park abandoned mechanisms.

**Disposition:** OUT OF SCOPE

**Target owner:** Historical packet; original extension owner

**Sources:** C-7f7acc51-L182, C-7f7acc51-L166, WB-0015. Current source paths: `BLUEPRINT.md`, `workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md`, `workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md`.

<a id="r123"></a>

## R123 — Sockets are capability contracts; modules use declared interfaces

**Historical intent:** A socket is a named capability contract, not a department or implementation. Modules must use its declared entrypoint rather than reach around it.

**Original status:** Accepted historical decision

**Why this existed:** Renaming departments as sockets obscured the boundary and self-attestation did not enforce access.

**Assumptions and scope:** The historical system assumed Foundry/Flight/CIC or multi-room coordination. Those mechanisms are not prerequisites for the current portable base.

**Observed current state:** The live base excludes required Foundry orchestration. Historical extension records remain evidence in their original domain; existence of ancillary code does not make a base feature. No retired runtime was exercised.

**Prior pass observation (attributed; not a new runtime test):** Socket contract; tools/socket-contract.mjs exists but serves Foundry-slice work, not the base.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** ADR-0015/0026 already establish the base boundary. Preserve all historical records and corrections here; do not create an upstream archive Design Concept merely to park abandoned mechanisms.

**Disposition:** OUT OF SCOPE

**Target owner:** Historical packet; original extension owner

**Sources:** C-7f7acc51-L196, H-SC. Current source paths: `BLUEPRINT.md`, `workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md`, `workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md`.

<a id="r124"></a>

## R124 — Socket-to-module cardinality is asymmetric many-to-many

**Historical intent:** A module may use several sockets; one socket may have several candidate implementations while allowing only the declared active binding pattern.

**Original status:** Accepted historical decision

**Why this existed:** The one-row/one-module registry could not express the CIC's intended connections.

**Assumptions and scope:** The historical system assumed Foundry/Flight/CIC or multi-room coordination. Those mechanisms are not prerequisites for the current portable base.

**Observed current state:** The live base excludes required Foundry orchestration. Historical extension records remain evidence in their original domain; existence of ancillary code does not make a base feature. No retired runtime was exercised.

**Prior pass observation (attributed; not a new runtime test):** Extension data model.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** ADR-0015/0026 already establish the base boundary. Preserve all historical records and corrections here; do not create an upstream archive Design Concept merely to park abandoned mechanisms.

**Disposition:** OUT OF SCOPE

**Target owner:** Historical packet; original extension owner

**Sources:** H-SC. Current source paths: `BLUEPRINT.md`, `workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md`, `workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md`.

<a id="r125"></a>

## R125 — Blessed means a suitable implementation, not owner authorship

**Historical intent:** A blessed module fits the socket and product expectations; being built by Kayden is neither necessary nor sufficient.

**Original status:** Accepted historical decision

**Why this existed:** Authorship had been mistaken for technical compatibility and suitability.

**Assumptions and scope:** The historical system assumed Foundry/Flight/CIC or multi-room coordination. Those mechanisms are not prerequisites for the current portable base.

**Observed current state:** The live base excludes required Foundry orchestration. Historical extension records remain evidence in their original domain; existence of ancillary code does not make a base feature. No retired runtime was exercised.

**Prior pass observation (attributed; not a new runtime test):** Definition correction worth preserving as lineage.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** ADR-0015/0026 already establish the base boundary. Preserve all historical records and corrections here; do not create an upstream archive Design Concept merely to park abandoned mechanisms.

**Disposition:** OUT OF SCOPE

**Target owner:** Historical packet; original extension owner

**Sources:** H-SC-LATE. Current source paths: `BLUEPRINT.md`, `workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md`, `workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md`.

<a id="r126"></a>

## R126 — Halls are vertical functional boundaries

**Historical intent:** A Hall owns its skills, deterministic workers and lifecycle for one function; cross-Hall work is routed explicitly so agents do not load every department's internals.

**Original status:** Accepted historical decision

**Why this existed:** The factory accumulated context and unclear ownership when each component knew the others' procedures.

**Assumptions and scope:** The historical system assumed Foundry/Flight/CIC or multi-room coordination. Those mechanisms are not prerequisites for the current portable base.

**Observed current state:** The live base excludes required Foundry orchestration. Historical extension records remain evidence in their original domain; existence of ancillary code does not make a base feature. No retired runtime was exercised.

**Prior pass observation (attributed; not a new runtime test):** Hall counts explicitly historical.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** ADR-0015/0026 already establish the base boundary. Preserve all historical records and corrections here; do not create an upstream archive Design Concept merely to park abandoned mechanisms.

**Disposition:** OUT OF SCOPE

**Target owner:** Historical packet; original extension owner

**Sources:** H-SC-LATE, C-41fca99d-L24. Current source paths: `BLUEPRINT.md`, `workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md`, `workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md`.

<a id="r127"></a>

## R127 — Separate domain core, execution engine and orchestration

**Historical intent:** The deterministic domain core stays independent of the sandbox/worktree engine; orchestration composes both and translates scoped policy into execution.

**Original status:** Accepted historical decision

**Why this existed:** Putting all domain behavior inside an external sandbox library would make unrelated project logic depend on its lifecycle.

**Assumptions and scope:** The historical system assumed Foundry/Flight/CIC or multi-room coordination. Those mechanisms are not prerequisites for the current portable base.

**Observed current state:** The live base excludes required Foundry orchestration. Historical extension records remain evidence in their original domain; existence of ancillary code does not make a base feature. No retired runtime was exercised.

**Prior pass observation (attributed; not a new runtime test):** Domain/engine/orchestration split; no upstream consumer.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** ADR-0015/0026 already establish the base boundary. Preserve all historical records and corrections here; do not create an upstream archive Design Concept merely to park abandoned mechanisms.

**Disposition:** OUT OF SCOPE

**Target owner:** Historical packet; original extension owner

**Sources:** H-SC-LATE. Current source paths: `BLUEPRINT.md`, `workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md`, `workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md`.

<a id="r128"></a>

## R128 — Replace scaffolding only after preserving its rules in the successor

**Historical intent:** Retire temporary standalone guard machinery once the replacement can carry its protections; the rules survive even if the old files do not.

**Original status:** Accepted historical direction

**Why this existed:** Keeping two competing guard systems creates drift, while deleting rules because a framework exists removes protection.

**Assumptions and scope:** The historical system assumed Foundry/Flight/CIC or multi-room coordination. Those mechanisms are not prerequisites for the current portable base.

**Observed current state:** The live base excludes required Foundry orchestration. Historical extension records remain evidence in their original domain; existence of ancillary code does not make a base feature. No retired runtime was exercised.

**Prior pass observation (attributed; not a new runtime test):** Sandcastle is not a current dependency.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** ADR-0015/0026 already establish the base boundary. Preserve all historical records and corrections here; do not create an upstream archive Design Concept merely to park abandoned mechanisms.

**Disposition:** OUT OF SCOPE

**Target owner:** Historical packet; original extension owner

**Sources:** H-SC. Current source paths: `BLUEPRINT.md`, `workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md`, `workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md`.

<a id="r129"></a>

## R129 — Each Hall builds the deterministic workers it needs

**Historical intent:** A shared boundary provider supplies containment infrastructure; it does not own every department's domain-specific automation.

**Original status:** Accepted historical decision

**Why this existed:** The early Orchestration Engine proposal centralized too much and blurred functional ownership.

**Assumptions and scope:** The historical system assumed Foundry/Flight/CIC or multi-room coordination. Those mechanisms are not prerequisites for the current portable base.

**Observed current state:** The live base excludes required Foundry orchestration. Historical extension records remain evidence in their original domain; existence of ancillary code does not make a base feature. No retired runtime was exercised.

**Prior pass observation (attributed; not a new runtime test):** Correction to the all-Pawns model; history.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** ADR-0015/0026 already establish the base boundary. Preserve all historical records and corrections here; do not create an upstream archive Design Concept merely to park abandoned mechanisms.

**Disposition:** OUT OF SCOPE

**Target owner:** Historical packet; original extension owner

**Sources:** H-SC-LATE. Current source paths: `BLUEPRINT.md`, `workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md`, `workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md`.

<a id="r130"></a>

## R130 — Gatehouse enforces passage but does not grant authority

**Historical intent:** Gatehouse builds and evaluates enforcement boundaries and passage receipts; actual authorization and lifecycle mutation retain their named owners.

**Original status:** Accepted historical decision

**Why this existed:** The same metaphor was incorrectly used for policy, authorization, auditing and execution.

**Assumptions and scope:** The historical system assumed Foundry/Flight/CIC or multi-room coordination. Those mechanisms are not prerequisites for the current portable base.

**Observed current state:** The live base excludes required Foundry orchestration. Historical extension records remain evidence in their original domain; existence of ancillary code does not make a base feature. No retired runtime was exercised.

**Prior pass observation (attributed; not a new runtime test):** Gatehouse separation; GO-0006 downstream.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** ADR-0015/0026 already establish the base boundary. Preserve all historical records and corrections here; do not create an upstream archive Design Concept merely to park abandoned mechanisms.

**Disposition:** OUT OF SCOPE

**Target owner:** Historical packet; original extension owner

**Sources:** C-019ff419-L320, GO-0006, D-CLOSE. Current source paths: `BLUEPRINT.md`, `workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md`, `workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md`.

<a id="r131"></a>

## R131 — Scheduling, orchestration, validation and audit have separate responsibilities

**Historical intent:** Timing infrastructure, dispatch/dependency flow, task authority validation and independent quality judgment are separate concerns; monitoring reports on them rather than becoming their owner.

**Original status:** Accepted historical decision

**Why this existed:** The thirteen-Hall redesign repeatedly corrected one component absorbing another's responsibility.

**Assumptions and scope:** The historical system assumed Foundry/Flight/CIC or multi-room coordination. Those mechanisms are not prerequisites for the current portable base.

**Observed current state:** The live base excludes required Foundry orchestration. Historical extension records remain evidence in their original domain; existence of ancillary code does not make a base feature. No retired runtime was exercised.

**Prior pass observation (attributed; not a new runtime test):** Thirteen-Hall responsibility map; explicitly not thirteen services.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** ADR-0015/0026 already establish the base boundary. Preserve all historical records and corrections here; do not create an upstream archive Design Concept merely to park abandoned mechanisms.

**Disposition:** OUT OF SCOPE

**Target owner:** Historical packet; original extension owner

**Sources:** C-019ff419-L9, C-019ff419-L320. Current source paths: `BLUEPRINT.md`, `workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md`, `workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md`.

<a id="r132"></a>

## R132 — Public source, installed module and running service have distinct owners

**Historical intent:** A module has a producer checkout and a shipped/installed product with an exact receipt; updating the producer is not updating the running module.

**Original status:** Accepted historical decision

**Why this existed:** Duplicate paths and stale installed copies obscured what the owner was actually using.

**Assumptions and scope:** The historical system assumed Foundry/Flight/CIC or multi-room coordination. Those mechanisms are not prerequisites for the current portable base.

**Observed current state:** The live base excludes required Foundry orchestration. Historical extension records remain evidence in their original domain; existence of ancillary code does not make a base feature. No retired runtime was exercised.

**Prior pass observation (attributed; not a new runtime test):** Producer/installed/running split — the generic half is CAND-H.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** ADR-0015/0026 already establish the base boundary. Preserve all historical records and corrections here; do not create an upstream archive Design Concept merely to park abandoned mechanisms.

**Disposition:** OUT OF SCOPE

**Target owner:** Historical packet; original extension owner

**Sources:** D-REACTIVATE, D-CIC. Current source paths: `BLUEPRINT.md`, `workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md`, `workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md`.

<a id="r133"></a>

## R133 — Operating identity is independent of the model engine

**Historical intent:** Durable continuity belongs to the host/factory's stores and identity; the current model is replaceable and an agent/run is disposable.

**Original status:** Accepted historical decision

**Why this existed:** The old fixed host-plus-model roster rejected cloud instances and made a model change look like a different being.

**Assumptions and scope:** The historical system assumed Foundry/Flight/CIC or multi-room coordination. Those mechanisms are not prerequisites for the current portable base.

**Observed current state:** The live base excludes required Foundry orchestration. Historical extension records remain evidence in their original domain; existence of ancillary code does not make a base feature. No retired runtime was exercised.

**Prior pass observation (attributed; not a new runtime test):** Provider-neutral identity; the generic half is already in ADR-0041 and CAND-D.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** ADR-0015/0026 already establish the base boundary. Preserve all historical records and corrections here; do not create an upstream archive Design Concept merely to park abandoned mechanisms.

**Disposition:** OUT OF SCOPE

**Target owner:** Historical packet; original extension owner

**Sources:** H-FR. Current source paths: `BLUEPRINT.md`, `workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md`, `workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md`.

<a id="r134"></a>

## R134 — CAS separates owner-facing direction, factory execution and outside-world assistance

**Historical intent:** Captain, Steward and Attendant describe different scopes of assistance; the owner wanted a personable interface without one context doing all implementation.

**Original status:** Accepted historical direction

**Why this existed:** The owner wanted a conversational assistant backed by a factory, not merely an autonomous coding queue.

**Assumptions and scope:** The historical system assumed Foundry/Flight/CIC or multi-room coordination. Those mechanisms are not prerequisites for the current portable base.

**Observed current state:** The live base excludes required Foundry orchestration. Historical extension records remain evidence in their original domain; existence of ancillary code does not make a base feature. No retired runtime was exercised.

**Prior pass observation (attributed; not a new runtime test):** CAS roles; name collision noted in source.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** ADR-0015/0026 already establish the base boundary. Preserve all historical records and corrections here; do not create an upstream archive Design Concept merely to park abandoned mechanisms.

**Disposition:** OUT OF SCOPE

**Target owner:** Historical packet; original extension owner

**Sources:** C-01a021fc-L203, C-01a021fc-L303, D-CAS. Current source paths: `BLUEPRINT.md`, `workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md`, `workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md`.

<a id="r135"></a>

## R135 — A connected system must still cold-start from its own records

**Historical intent:** A fresh agent must find controls, Wiki, skills, current work and verified capability from the deployed system without inheriting the builder's chat memory.

**Original status:** Accepted

**Why this existed:** A system known only to its author is not operational for a new agent.

**Assumptions and scope:** The historical system assumed Foundry/Flight/CIC or multi-room coordination. Those mechanisms are not prerequisites for the current portable base.

**Observed current state:** The live base excludes required Foundry orchestration. Historical extension records remain evidence in their original domain; existence of ancillary code does not make a base feature. No retired runtime was exercised.

**Prior pass observation (attributed; not a new runtime test):** Cold-start-from-own-records is the same acceptance boundary CAND-A states.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Fresh-agent continuity applies to the whole Workbench. ADR-0040 covers unfinished local context; it must not become the sole owner of the product promise.

**Disposition:** MERGE WITH ADR-PROPOSED-A

**Target owner:** CAND-A

**Sources:** C-01a012d6-L297, D-REACTIVATE. Current source paths: `BLUEPRINT.md`, `workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md`, `workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md`.

<a id="r136"></a>

## R136 — Cross-machine sync targets selected structure and knowledge

**Historical intent:** Synchronize the intended harness structure and Wiki across hosts while respecting project-specific repositories and private/runtime boundaries.

**Original status:** Strong preference

**Why this existed:** The owner wanted reliable PC/Mac continuity, not indiscriminate mirroring of every local project.

**Assumptions and scope:** The historical system assumed Foundry/Flight/CIC or multi-room coordination. Those mechanisms are not prerequisites for the current portable base.

**Observed current state:** The live base excludes required Foundry orchestration. Historical extension records remain evidence in their original domain; existence of ancillary code does not make a base feature. No retired runtime was exercised.

**Prior pass observation (attributed; not a new runtime test):** RESOLVED 2026-09-07: the sync scope is live notepads, grilling records and handoffs only - project-owned schemas, templates and promoted documentation stay in the project repository, satisfying the selected-structure requirement.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** The original concern was selected harness/Wiki synchronization. Those remain project-owned Git content; the newer N decision covers live sessions only. Both requirements must remain visible; sessions-only is not a replacement of the original proposition.

**Disposition:** KEEP - DOC

**Target owner:** RUNBOOK.md; CAND-N scope note

**Sources:** C-019f3b12-L6, G-6a553b7b. Current source paths: `BLUEPRINT.md`, `workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md`, `workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md`.

<a id="r137"></a>

## R137 — Schematic explains intended design; CIC mirrors live state

**Historical intent:** Keep the explanatory system model and deterministic non-executing simulation separate from the private operational dashboard.

**Original status:** Accepted historical decision

**Why this existed:** A future-design rendering was repeatedly mistaken for proof that the real factory was deployed.

**Assumptions and scope:** The historical system assumed Foundry/Flight/CIC or multi-room coordination. Those mechanisms are not prerequisites for the current portable base.

**Observed current state:** The live base excludes required Foundry orchestration. Historical extension records remain evidence in their original domain; existence of ancillary code does not make a base feature. No retired runtime was exercised.

**Prior pass observation (attributed; not a new runtime test):** Schematic/CIC separation; extension products.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** ADR-0015/0026 already establish the base boundary. Preserve all historical records and corrections here; do not create an upstream archive Design Concept merely to park abandoned mechanisms.

**Disposition:** OUT OF SCOPE

**Target owner:** Historical packet; original extension owner

**Sources:** H-FR, C-019fcf89-L386, C-01a021fc-L898. Current source paths: `BLUEPRINT.md`, `workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md`, `workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md`.

<a id="r138"></a>

## R138 — Show workflow, governance and structure as distinct views

**Historical intent:** Use coordinated views to explain the same system from different questions, including a traceable workflow and governance passage, with inspectable elements.

**Original status:** Accepted historical direction

**Why this existed:** One overloaded diagram could not convey both the architecture and how a request moves through it.

**Assumptions and scope:** The historical system assumed Foundry/Flight/CIC or multi-room coordination. Those mechanisms are not prerequisites for the current portable base.

**Observed current state:** The live base excludes required Foundry orchestration. Historical extension records remain evidence in their original domain; existence of ancillary code does not make a base feature. No retired runtime was exercised.

**Prior pass observation (attributed; not a new runtime test):** View architecture; not a base requirement.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** ADR-0015/0026 already establish the base boundary. Preserve all historical records and corrections here; do not create an upstream archive Design Concept merely to park abandoned mechanisms.

**Disposition:** OUT OF SCOPE

**Target owner:** Historical packet; original extension owner

**Sources:** C-019fef23-L9, C-019fc4e9-L1090. Current source paths: `BLUEPRINT.md`, `workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md`, `workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md`.

<a id="r139"></a>

## R139 — The simulator is deterministic and can expose failure paths

**Historical intent:** Provide run, pause, step, replay and controlled failure injection in the design simulator, without executing real production operations.

**Original status:** Accepted historical decision

**Why this existed:** A static happy-path diagram could not demonstrate the intended recovery and gating model.

**Assumptions and scope:** The historical system assumed Foundry/Flight/CIC or multi-room coordination. Those mechanisms are not prerequisites for the current portable base.

**Observed current state:** The live base excludes required Foundry orchestration. Historical extension records remain evidence in their original domain; existence of ancillary code does not make a base feature. No retired runtime was exercised.

**Prior pass observation (attributed; not a new runtime test):** Simulator determinism; extension product.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** ADR-0015/0026 already establish the base boundary. Preserve all historical records and corrections here; do not create an upstream archive Design Concept merely to park abandoned mechanisms.

**Disposition:** OUT OF SCOPE

**Target owner:** Historical packet; original extension owner

**Sources:** C-019fc4e9-L1090. Current source paths: `BLUEPRINT.md`, `workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md`, `workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md`.

<a id="r140"></a>

## R140 — Draft, explicit send and authorized work are separate states

**Historical intent:** Typed or externally dictated input remains a draft until explicit Send creates durable Intent; an Entrance or dashboard action does not itself authorize arbitrary downstream mutation.

**Original status:** Accepted historical decision

**Why this existed:** Voice and convenience controls must not silently send, approve or execute an unfinished request.

**Assumptions and scope:** The historical system assumed Foundry/Flight/CIC or multi-room coordination. Those mechanisms are not prerequisites for the current portable base.

**Observed current state:** The live base excludes required Foundry orchestration. Historical extension records remain evidence in their original domain; existence of ancillary code does not make a base feature. No retired runtime was exercised.

**Prior pass observation (attributed; not a new runtime test):** Draft/send/authorize boundary — generic value noted, no upstream interface exists.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** ADR-0015/0026 already establish the base boundary. Preserve all historical records and corrections here; do not create an upstream archive Design Concept merely to park abandoned mechanisms.

**Disposition:** OUT OF SCOPE

**Target owner:** Historical packet; original extension owner

**Sources:** H-FR. Current source paths: `BLUEPRINT.md`, `workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md`, `workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md`.

<a id="r141"></a>

## R141 — Show the selected route and preserve the task's home

**Historical intent:** Expose provider/engine and effort selection, including Auto's resolved route. Changing model preserves the task's Factory home unless the owner explicitly redirects it.

**Original status:** Accepted historical decision

**Why this existed:** Model selection and task placement were being coupled invisibly.

**Assumptions and scope:** The historical system assumed Foundry/Flight/CIC or multi-room coordination. Those mechanisms are not prerequisites for the current portable base.

**Observed current state:** The live base excludes required Foundry orchestration. Historical extension records remain evidence in their original domain; existence of ancillary code does not make a base feature. No retired runtime was exercised.

**Prior pass observation (attributed; not a new runtime test):** Multi-provider Entrance; no upstream consumer.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** ADR-0015/0026 already establish the base boundary. Preserve all historical records and corrections here; do not create an upstream archive Design Concept merely to park abandoned mechanisms.

**Disposition:** OUT OF SCOPE

**Target owner:** Historical packet; original extension owner

**Sources:** H-FR. Current source paths: `BLUEPRINT.md`, `workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md`, `workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md`.

<a id="r142"></a>

## R142 — A dashboard state change can express intent without completing work

**Historical intent:** Moving a card or selecting an operation requests a transition; actual execution and verification determine the resulting status.

**Original status:** Accepted historical direction

**Why this existed:** A UI gesture can make a board say Done while the underlying task remains unfinished.

**Assumptions and scope:** The historical system assumed Foundry/Flight/CIC or multi-room coordination. Those mechanisms are not prerequisites for the current portable base.

**Observed current state:** The live base excludes required Foundry orchestration. Historical extension records remain evidence in their original domain; existence of ancillary code does not make a base feature. No retired runtime was exercised.

**Prior pass observation (attributed; not a new runtime test):** Intent-vs-observed-state on a board; upstream TASKBOARD is generated, so it cannot express intent.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** ADR-0015/0026 already establish the base boundary. Preserve all historical records and corrections here; do not create an upstream archive Design Concept merely to park abandoned mechanisms.

**Disposition:** OUT OF SCOPE

**Target owner:** Historical packet; original extension owner

**Sources:** C-ddedabe2-L113, H-FR. Current source paths: `BLUEPRINT.md`, `workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md`, `workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md`.

<a id="r143"></a>

## R143 — Liveness, load, reasoning effort and work status are separate signals

**Historical intent:** Distinguish alive/asleep/down, active worker load, average/peak reasoning effort and queued/blocked/failed/verified status. Do not infer one from another.

**Original status:** Accepted historical decision

**Why this existed:** Brightness, model tier and activity were repeatedly conflated; an asleep but healthy system must not appear down.

**Assumptions and scope:** The historical system assumed Foundry/Flight/CIC or multi-room coordination. Those mechanisms are not prerequisites for the current portable base.

**Observed current state:** The live base excludes required Foundry orchestration. Historical extension records remain evidence in their original domain; existence of ancillary code does not make a base feature. No retired runtime was exercised.

**Prior pass observation (attributed; not a new runtime test):** Liveness/load/effort/status separation; extension telemetry.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** ADR-0015/0026 already establish the base boundary. Preserve all historical records and corrections here; do not create an upstream archive Design Concept merely to park abandoned mechanisms.

**Disposition:** OUT OF SCOPE

**Target owner:** Historical packet; original extension owner

**Sources:** D-LIGHT, D-CIC, H-FR. Current source paths: `BLUEPRINT.md`, `workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md`, `workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md`.

<a id="r144"></a>

## R144 — Heartbeat is an authoritative snapshot plus observer acknowledgement

**Historical intent:** Foundry emits sequence, time, cadence, load, workers and effort; CIC acknowledges observer health. The recorded cadence is 60/15/5/1 seconds for L0/L1/L2/L3, with one missed expected beat marking liveness failure.

**Original status:** Accepted historical decision

**Why this existed:** The monitor needs an explicit exchange and failure rule rather than inferring health from an animation.

**Assumptions and scope:** The historical system assumed Foundry/Flight/CIC or multi-room coordination. Those mechanisms are not prerequisites for the current portable base.

**Observed current state:** The live base excludes required Foundry orchestration. Historical extension records remain evidence in their original domain; existence of ancillary code does not make a base feature. No retired runtime was exercised.

**Prior pass observation (attributed; not a new runtime test):** Heartbeat cadences explicitly not generalizable.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** ADR-0015/0026 already establish the base boundary. Preserve all historical records and corrections here; do not create an upstream archive Design Concept merely to park abandoned mechanisms.

**Disposition:** OUT OF SCOPE

**Target owner:** Historical packet; original extension owner

**Sources:** D-CIC. Current source paths: `BLUEPRINT.md`, `workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md`, `workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md`.

<a id="r145"></a>

## R145 — No silent activation

**Historical intent:** Announce activation before or as it happens; an observed unannounced activation is anomalous. Later Lighthouse delivery explicitly excluded Announced Activation implementation.

**Original status:** Accepted historical decision; later delivery deferred

**Why this existed:** The owner wanted to see cost-bearing work begin and detect unexpected activity.

**Assumptions and scope:** The historical system assumed Foundry/Flight/CIC or multi-room coordination. Those mechanisms are not prerequisites for the current portable base.

**Observed current state:** The live base excludes required Foundry orchestration. Historical extension records remain evidence in their original domain; existence of ancillary code does not make a base feature. No retired runtime was exercised.

**Prior pass observation (attributed; not a new runtime test):** No-silent-activation: accepted intent, delivery deferred; keep both facts.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** ADR-0015/0026 already establish the base boundary. Preserve all historical records and corrections here; do not create an upstream archive Design Concept merely to park abandoned mechanisms.

**Disposition:** OUT OF SCOPE

**Target owner:** Historical packet; original extension owner

**Sources:** H-FR, D-CIC. Current source paths: `BLUEPRINT.md`, `workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md`, `workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md`.

<a id="r146"></a>

## R146 — Projection is a shared cached entry surface, with visible staleness

**Historical intent:** Deterministic boundary captures can help both humans and fresh agents orient. Every reader sees source and capture age; a projection can route but cannot authorize work.

**Original status:** Accepted historical decision

**Why this existed:** Repeated cold-start discovery was expensive, and uncaptured lanes disappeared from dashboards.

**Assumptions and scope:** The historical system assumed Foundry/Flight/CIC or multi-room coordination. Those mechanisms are not prerequisites for the current portable base.

**Observed current state:** The live base excludes required Foundry orchestration. Historical extension records remain evidence in their original domain; existence of ancillary code does not make a base feature. No retired runtime was exercised.

**Prior pass observation (attributed; not a new runtime test):** TASKBOARD is a generated projection; render-drift is a registered selection-blocking code. Projection cannot authorize.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** TASKBOARD proves a source-derived entry surface, not the full historical cached observer/freshness design. Retain provenance/freshness guidance; do not import a capture service.

**Disposition:** KEEP - DOC

**Target owner:** Projection guidance; ADR-0042

**Sources:** H-DG. Current source paths: `BLUEPRINT.md`, `workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md`, `workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md`.

<a id="r147"></a>

## R147 — Flight Rack aggregates counts and preserves individual history

**Historical intent:** Show active counts at the seven positions and let an individual run retain unreached, current, passed, blocked, failed and repaired history rather than blending all runs into one ambiguous gradient.

**Original status:** Accepted historical decision

**Why this existed:** Aggregate activity and a single flight's outcome tell different stories.

**Assumptions and scope:** The historical system assumed Foundry/Flight/CIC or multi-room coordination. Those mechanisms are not prerequisites for the current portable base.

**Observed current state:** The live base excludes required Foundry orchestration. Historical extension records remain evidence in their original domain; existence of ancillary code does not make a base feature. No retired runtime was exercised.

**Prior pass observation (attributed; not a new runtime test):** Flight Rack visual data model.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** ADR-0015/0026 already establish the base boundary. Preserve all historical records and corrections here; do not create an upstream archive Design Concept merely to park abandoned mechanisms.

**Disposition:** OUT OF SCOPE

**Target owner:** Historical packet; original extension owner

**Sources:** D-LIGHT, D-CIC. Current source paths: `BLUEPRINT.md`, `workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md`, `workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md`.

<a id="r148"></a>

## R148 — Accessibility is part of operational telemetry

**Historical intent:** Use labels, timestamps and static brightness alongside color and motion so state remains interpretable under reduced motion and in a still image.

**Original status:** Accepted historical decision

**Why this existed:** A moving or colored light alone cannot reliably communicate liveness or risk.

**Assumptions and scope:** The historical system assumed Foundry/Flight/CIC or multi-room coordination. Those mechanisms are not prerequisites for the current portable base.

**Observed current state:** The live base excludes required Foundry orchestration. Historical extension records remain evidence in their original domain; existence of ancillary code does not make a base feature. No retired runtime was exercised.

**Prior pass observation (attributed; not a new runtime test):** Accessibility in telemetry; retain for any future interface.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** ADR-0015/0026 already establish the base boundary. Preserve all historical records and corrections here; do not create an upstream archive Design Concept merely to park abandoned mechanisms.

**Disposition:** OUT OF SCOPE

**Target owner:** Historical packet; original extension owner

**Sources:** H-FR, D-LIGHT. Current source paths: `BLUEPRINT.md`, `workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md`, `workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md`.

<a id="r149"></a>

## R149 — Owner-visible acceptance goes beyond server health

**Historical intent:** Verify exact installed/runtime provenance and then exercise the authenticated desktop/mobile interface. A listening service or successful health response is not proof the owner's workflow works.

**Original status:** Accepted

**Why this existed:** The record showed HTTP success while the owner reported the application unusable.

**Assumptions and scope:** The historical system assumed Foundry/Flight/CIC or multi-room coordination. Those mechanisms are not prerequisites for the current portable base.

**Observed current state:** The live base excludes required Foundry orchestration. Historical extension records remain evidence in their original domain; existence of ancillary code does not make a base feature. No retired runtime was exercised.

**Prior pass observation (attributed; not a new runtime test):** Owner-visible acceptance beyond server health is the outcome-acceptance rule CAND-C states.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Keep actual owner-workflow acceptance. Authenticated mobile/desktop interface requirements apply to products with those interfaces, not every command-line Workbench.

**Disposition:** MERGE WITH ADR-PROPOSED-C

**Target owner:** CAND-C

**Sources:** D-CIC. Current source paths: `BLUEPRINT.md`, `workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md`, `workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md`.

<a id="r150"></a>

## R150 — Python is the owner's stated preferred runtime language

**Historical intent:** The owner said they wanted Python and had not corrected the JavaScript/Node implementation. The conversation asked whether migration was worthwhile; it did not authorize a rewrite.

**Original status:** Strong preference; unresolved migration

**Why this existed:** An agent-chosen implementation language had become architecture without the owner's intended preference being resolved.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Node runs the portable commands; provider fixtures do not prove host enforcement. S-036 explicitly says its native write never reached a permission decision. Direct owner replies settle language and provider direction; implementation scope remains bounded.

**Prior pass observation (attributed; not a new runtime test):** RESOLVED 2026-09-07: runtime stays Node. Basis is format fit - JSON is JavaScript's native object syntax, parsed as first-class values with no conversion step, serving ADR-0040/S-046. Verified: 61 .mjs tools; Python is exactly the evals lane plus the tools/check-append-only.py pair.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Node is explicitly selected. Both JSON.parse and Python json.loads deserialize text into language values. Preserve the owner rationale as history but mark the claimed structural disadvantage unsupported; do not silently replace or reverse the decision.

**Disposition:** KEEP - ADR

**Target owner:** CAND-O

**Sources:** G-6a9b8e27. Current source paths: `RUNBOOK.md`, `workbench/manifest.json`, `tools/test-portability-matrix.mjs`, `tools/test-cross-provider-fixture.mjs`, `workbench/specs/S-036-v3-1-2-evidence-corrections/SPEC.md`.

<a id="r151"></a>

## R151 — Native provider adapters and hard hooks need an explicit choice

**Historical intent:** The owner wants reliable behavior across provider products and liked a middle ground between prose-only rules and rebuilding everything. Particular hook, metadata and adapter schemas were proposals.

**Original status:** Strong direction; mechanism open

**Why this existed:** Identical instructions do not imply identical host capabilities or enforcement.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Node runs the portable commands; provider fixtures do not prove host enforcement. S-036 explicitly says its native write never reached a permission decision. Direct owner replies settle language and provider direction; implementation scope remains bounded.

**Prior pass observation (attributed; not a new runtime test):** RESOLVED 2026-09-07: a small minimum capability contract verified in the actual configured environment, with operational capability, machine enforcement and agent instruction-following kept as separate evidence classes. Provider-native adapters stay outside the core commitment; unavailable or inconclusive checks stay unverified.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Direct owner answer settles A with qualifications. Minimum capabilities must be agreed before choosing schema/blockers/tests; this report invents none. Existing native eval runners/discovery adapters are distinct from new enforcement-hook adapters.

**Disposition:** KEEP - ADR

**Target owner:** CAND-P

**Sources:** G-6a9b6f4f, G-6a646af5. Current source paths: `RUNBOOK.md`, `workbench/manifest.json`, `tools/test-portability-matrix.mjs`, `tools/test-cross-provider-fixture.mjs`, `workbench/specs/S-036-v3-1-2-evidence-corrections/SPEC.md`.

<a id="r152"></a>

## R152 — Parallel specialist ensembles were explored, not made universal

**Historical intent:** The owner proposed a user-facing executive with constructive, critical and engineering specialists and cheaper reviewers to improve quality and cost.

**Original status:** Strong suggestion

**Why this existed:** Different perspectives may catch weaknesses while protecting expensive context.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Node runs the portable commands; provider fixtures do not prove host enforcement. S-036 explicitly says its native write never reached a permission decision. Direct owner replies settle language and provider direction; implementation scope remains bounded.

**Prior pass observation (attributed; not a new runtime test):** ADR-0036's four stances deliberately replace agent departments; AGENTS states loading a stance never spawns an agent.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** An optional specialist ensemble was a suggestion, not a universal obligation. Stances do not supersede the possibility of multi-agent teams; do not call the idea rejected or accepted.

**Disposition:** OUT OF SCOPE

**Target owner:** Optional coordination proposal; historical packet

**Sources:** G-6a3cc6be. Current source paths: `RUNBOOK.md`, `workbench/manifest.json`, `tools/test-portability-matrix.mjs`, `tools/test-cross-provider-fixture.mjs`, `workbench/specs/S-036-v3-1-2-evidence-corrections/SPEC.md`.

<a id="r153"></a>

## R153 — Track total delegated token/cost burden

**Historical intent:** Evaluate the cost of the whole worker tree, not just the parent context or a single agent's token count.

**Original status:** Strong preference

**Why this existed:** Fan-out hides orchestration overhead and can make apparent context savings expensive.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Node runs the portable commands; provider fixtures do not prove host enforcement. S-036 explicitly says its native write never reached a permission decision. Direct owner replies settle language and provider direction; implementation scope remains bounded.

**Prior pass observation (attributed; not a new runtime test):** No delegated-cost measurement exists; no cap was ever settled.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. No delegated-cost measurement exists; no cap was ever settled.

**Disposition:** KEEP - DOC

**Target owner:** evals / outcomes README

**Sources:** C-019f71ab-L169, G-6a3d8dd4. Current source paths: `RUNBOOK.md`, `workbench/manifest.json`, `tools/test-portability-matrix.mjs`, `tools/test-cross-provider-fixture.mjs`, `workbench/specs/S-036-v3-1-2-evidence-corrections/SPEC.md`.

<a id="r154"></a>

## R154 — Review stale projects before archiving

**Historical intent:** After prolonged inactivity, inspect save state, remotes and worktrees and present readiness for archive to the owner rather than silently archiving.

**Original status:** Strong suggestion

**Why this existed:** The owner wanted portfolio hygiene without losing unfinished work.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Node runs the portable commands; provider fixtures do not prove host enforcement. S-036 explicitly says its native write never reached a permission decision. Direct owner replies settle language and provider direction; implementation scope remains bounded.

**Prior pass observation (attributed; not a new runtime test):** Portfolio hygiene is not a single-room concern; the two-week threshold was conversational.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. Portfolio hygiene is not a single-room concern; the two-week threshold was conversational.

**Disposition:** OUT OF SCOPE

**Target owner:** Coordinator/extension

**Sources:** C-019f68fd-L65. Current source paths: `RUNBOOK.md`, `workbench/manifest.json`, `tools/test-portability-matrix.mjs`, `tools/test-cross-provider-fixture.mjs`, `workbench/specs/S-036-v3-1-2-evidence-corrections/SPEC.md`.

<a id="r155"></a>

## R155 — Governance policy as data with a derived matrix

**Historical intent:** Keep one policy owner and derive explanatory views; extend the existing clearance policy where relevant. The full matrix, missing-entry behavior and global catalog semantics were not all settled.

**Original status:** Accepted historical direction; details open

**Why this existed:** Duplicate tables and prose-only enforcement would create contradictory policy sources.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Node runs the portable commands; provider fixtures do not prove host enforcement. S-036 explicitly says its native write never reached a permission decision. Direct owner replies settle language and provider direction; implementation scope remains bounded.

**Prior pass observation (attributed; not a new runtime test):** GO-0004/GO-0006 clearance policy; no upstream consumer.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. GO-0004/GO-0006 clearance policy; no upstream consumer.

**Disposition:** OUT OF SCOPE

**Target owner:** GPT_OS

**Sources:** GO-0004, GO-0006, D-GP. Current source paths: `RUNBOOK.md`, `workbench/manifest.json`, `tools/test-portability-matrix.mjs`, `tools/test-cross-provider-fixture.mjs`, `workbench/specs/S-036-v3-1-2-evidence-corrections/SPEC.md`.

<a id="r156"></a>

## R156 — Governance verbs name operations; the complete verb catalog remained open

**Historical intent:** Operation names should identify what is done and its context, without pretending every verb is an automatic plane transition. Several proposed verbs and CRUD policy details remained open.

**Original status:** Accepted in part

**Why this existed:** Naming a verb risked silently granting behavior or inventing transition machinery.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Node runs the portable commands; provider fixtures do not prove host enforcement. S-036 explicitly says its native write never reached a permission decision. Direct owner replies settle language and provider direction; implementation scope remains bounded.

**Prior pass observation (attributed; not a new runtime test):** GO-0007 verb catalog left open downstream.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. GO-0007 verb catalog left open downstream.

**Disposition:** OUT OF SCOPE

**Target owner:** GPT_OS

**Sources:** GO-0007, D-GP, D-V3. Current source paths: `RUNBOOK.md`, `workbench/manifest.json`, `tools/test-portability-matrix.mjs`, `tools/test-cross-provider-fixture.mjs`, `workbench/specs/S-036-v3-1-2-evidence-corrections/SPEC.md`.

<a id="r157"></a>

## R157 — Job Orders link their sources and bound authority by intersection

**Historical intent:** An in-force order links authority/evidence owners and lists its operations; its authority is bounded by its actual sources. The global-versus-per-order operation catalog was left open.

**Original status:** Accepted historical decision

**Why this existed:** Copied rules drift and a task packet cannot authorize a future mechanism merely by naming it.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Node runs the portable commands; provider fixtures do not prove host enforcement. S-036 explicitly says its native write never reached a permission decision. Direct owner replies settle language and provider direction; implementation scope remains bounded.

**Prior pass observation (attributed; not a new runtime test):** GO-0021 already removed the ordinary-work requirement; upstream ADR-0015 keeps it out of the base.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. GO-0021 already removed the ordinary-work requirement; upstream ADR-0015 keeps it out of the base.

**Disposition:** OUT OF SCOPE

**Target owner:** GPT_OS

**Sources:** GO-0009, GO-0011, GO-0012, D-GP. Current source paths: `RUNBOOK.md`, `workbench/manifest.json`, `tools/test-portability-matrix.mjs`, `tools/test-cross-provider-fixture.mjs`, `workbench/specs/S-036-v3-1-2-evidence-corrections/SPEC.md`.

<a id="r158"></a>

## R158 — Do not import unresolved Flightbook, Issues or sandbox choices

**Historical intent:** Flightbook assembly details, GitHub Issues adapters, some sandbox integration choices and automatic repair routing retained open or deferred status in their own records.

**Original status:** Open / deferred

**Why this existed:** Assistant recommendations and temporary bootstrap proposals were repeatedly mistaken for locked architecture.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Node runs the portable commands; provider fixtures do not prove host enforcement. S-036 explicitly says its native write never reached a permission decision. Direct owner replies settle language and provider direction; implementation scope remains bounded.

**Prior pass observation (attributed; not a new runtime test):** Explicitly unresolved in their own records; importing them would manufacture decisions.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. Explicitly unresolved in their own records; importing them would manufacture decisions.

**Disposition:** OUT OF SCOPE

**Target owner:** GPT_OS / Foundry

**Sources:** D-AC, H-SC, H-FR. Current source paths: `RUNBOOK.md`, `workbench/manifest.json`, `tools/test-portability-matrix.mjs`, `tools/test-cross-provider-fixture.mjs`, `workbench/specs/S-036-v3-1-2-evidence-corrections/SPEC.md`.

<a id="r159"></a>

## R159 — Retired producer topology and permanent role cages are history

**Historical intent:** Earlier GPT_OS/Forge-as-sole-producer, fixed host/model seats, mandatory department roles and universal lifecycle requirements were later narrowed or replaced.

**Original status:** Superseded

**Why this existed:** Blindly collecting old decisions as simultaneous current requirements would recreate the contradictions the owner corrected.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Node runs the portable commands; provider fixtures do not prove host enforcement. S-036 explicitly says its native write never reached a permission decision. Direct owner replies settle language and provider direction; implementation scope remains bounded.

**Prior pass observation (attributed; not a new runtime test):** Retained as dated lineage inside CAND-R; never revived as binding.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. Retained as dated lineage inside CAND-R; never revived as binding.

**Disposition:** SUPERSEDED

**Target owner:** ADR-0026, ADR-0036

**Sources:** D-PRODUCER, H-FR, WB-0026, WB-0036. Current source paths: `RUNBOOK.md`, `workbench/manifest.json`, `tools/test-portability-matrix.mjs`, `tools/test-cross-provider-fixture.mjs`, `workbench/specs/S-036-v3-1-2-evidence-corrections/SPEC.md`.

<a id="r160"></a>

## R160 — Plane passage is selective, not a universal six-stop workflow

**Historical intent:** Work may visit only the governance roles relevant to the operation, branch into related records, or change the role a claim plays. It need not traverse every plane before it can proceed.

**Original status:** Accepted

**Why this existed:** The owner explicitly rejected converting a model for reasoning about work into a mandatory linear workflow.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Current controls separate authority and state resolution; ADRs own rationale and cannot enlarge scope. This is verified prose, not proof every agent obeys.

**Prior pass observation (attributed; not a new runtime test):** AGENTS: planes classify 'claims and their use in one operation, never whole files'. No six-stop workflow exists.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. AGENTS: planes classify 'claims and their use in one operation, never whole files'. No six-stop workflow exists.

**Disposition:** ALREADY COVERED

**Target owner:** ADR-0001, ADR-0025

**Sources:** D-GP. Current source paths: `AGENTS.md`, `LEXICON.md`, `workbench/docs/adr/0027-instruction-authority-is-separate-from-state-resolution.md`, `workbench/docs/adr/0023-mechanical-guarantees-and-agent-obligations.md`.

<a id="r161"></a>

## R161 — Resolve contradictions openly before rewriting the owning claim

**Historical intent:** A correction must adjudicate conflicting accepted statements using the owner's ruling and verified context; relocating or summarizing the text does not settle a disagreement.

**Original status:** Accepted

**Why this existed:** A document move or tidy synthesis can erase the decision that actually needed resolution.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Current controls separate authority and state resolution; ADRs own rationale and cannot enlarge scope. This is verified prose, not proof every agent obeys.

**Prior pass observation (attributed; not a new runtime test):** AGENTS State Resolution: 'name the condition instead of picking a winner'.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. AGENTS State Resolution: 'name the condition instead of picking a winner'.

**Disposition:** ALREADY COVERED

**Target owner:** ADR-0027

**Sources:** D-GP, D-CANON. Current source paths: `AGENTS.md`, `LEXICON.md`, `workbench/docs/adr/0027-instruction-authority-is-separate-from-state-resolution.md`, `workbench/docs/adr/0023-mechanical-guarantees-and-agent-obligations.md`.

<a id="r162"></a>

## R162 — Promote is a decision-only operation; save is agnostic

**Historical intent:** The owner selected a separate owner-fired promote entrypoint that promotes only locked decisions, records where they landed and calls save. Save does not know about grilling or end it; the chosen promote exit behavior and related skill changes were deferred.

**Original status:** Accepted direction; skill alignment deferred

**Why this existed:** Make-it-so, grilling, checkpoint and save were mutually coupled, so saving could unexpectedly end the interview or begin a build.

**Assumptions and scope:** Source ownership, installed state and host discovery are different. F selects one global core release; old duplicate personal sources and equality-only version diagnostics are migration concerns.

**Observed current state:** 17 source core skills are declared; promote/save are absent. Installer tests passed 12/12, including Git-owned and symlinked roots. README/Runbook refusal prose is stale; explicit replacement remains a separate path. No new compatibility-range implementation was verified.

**Prior pass observation (attributed; not a new runtime test):** RESOLVED 2026-09-07: promote and save become Workbench core dependencies, reconciled rather than copied. The GP-22/23/62 contract survives; its Foundry, Job Order and Markdown-notepad assumptions do not.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Separate owner-fired decision promotion from caller-agnostic save. Adding skills to core is selected; copying legacy Foundry paths, Markdown locks or Job Order dependencies is not.

**Disposition:** MERGE WITH ADR-PROPOSED-F

**Target owner:** CAND-F; CAND-E; CAND-Q

**Sources:** D-GP. Current source paths: `skills/README.md`, `workbench/manifest.json`, `tools/core-skill-installer.mjs`, `tools/skill-presence.mjs`, `tools/test-core-skill-installer.mjs`.

<a id="r163"></a>

## R163 — Use repeatable process, not identical generated wording

**Historical intent:** Skill and workflow reliability means equivalent inputs follow a predictable process and produce the same result class, while preserving task-specific outputs and identities.

**Original status:** Strong preference

**Why this existed:** Demanding identical prose misses the useful form of determinism in agent work.

**Assumptions and scope:** Source ownership, installed state and host discovery are different. F selects one global core release; old duplicate personal sources and equality-only version diagnostics are migration concerns.

**Observed current state:** 17 source core skills are declared; promote/save are absent. Installer tests passed 12/12, including Git-owned and symlinked roots. README/Runbook refusal prose is stale; explicit replacement remains a separate path. No new compatibility-range implementation was verified.

**Prior pass observation (attributed; not a new runtime test):** Useful evaluation distinction; nothing upstream states it.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. Useful evaluation distinction; nothing upstream states it.

**Disposition:** KEEP - DOC

**Target owner:** skills/README.md

**Sources:** G-6a646af5, D-CIC. Current source paths: `skills/README.md`, `workbench/manifest.json`, `tools/core-skill-installer.mjs`, `tools/skill-presence.mjs`, `tools/test-core-skill-installer.mjs`.

<a id="r164"></a>

## R164 — Operational knowledge is part of docs maintenance

**Historical intent:** When the owner asks to update the docs, relevant durable project understanding belongs in the Wiki as well as the touched controls/specs, without copying task state everywhere.

**Original status:** Accepted

**Why this existed:** Agents treated documentation as control-file edits and left the project's accumulated understanding behind.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Owners and traversal routes exist. ADR-0041 explicitly defers identifier implementation and connection identity; a declaration is not delivered migration.

**Prior pass observation (attributed; not a new runtime test):** The ownership table routes durable knowledge to workbench/wiki/ with 'never copied task state'.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. The ownership table routes durable knowledge to workbench/wiki/ with 'never copied task state'.

**Disposition:** ALREADY COVERED

**Target owner:** AGENTS.md docs table

**Sources:** C-7f7acc51-L110, C-01a021fc-L321. Current source paths: `AGENTS.md`, `LEXICON.md`, `workbench/wiki/SCHEMA.md`, `workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md`, `workbench/docs/adr/0041-visible-base62-workbench-identifiers.md`.

<a id="r165"></a>

## R165 — An Example Workbench is a conformance reference, not unexplained imitation

**Historical intent:** Use a pinned example and matching template revision when reviewing adopted rooms; preserve evidence-backed project differences and report unexplained deviations.

**Original status:** Accepted

**Why this existed:** Comparisons without a known reference confused template defects with deliberate project adaptations.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Report format already requires evidence limitations and report-scoped IDs/shared recurrence keys. It does not separately name evaluated and reporting models. Outcome docs require controlled repeated comparisons; no new agent-outcome trial was run.

**Prior pass observation (attributed; not a new runtime test):** Example_Workbench verified present; Audit S-009 does v3.1.2 conformance. The reference/deviation semantics have no upstream owner.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Example checkout is a clean v3.1.2 reference at 4f1dd4c, while this tree is v3.1.3. Compare matched generations; do not report this version difference as a defect or presume byte identity.

**Disposition:** MERGE WITH ADR-PROPOSED-K

**Target owner:** CAND-K

**Sources:** A-BLUEPRINT. Current source paths: `AGENTS.md`, `workbench/feedback/REPORT_FORMAT.md`, `evals/README.md`, `outcomes/README.md`, `tools/test-cross-provider-fixture.mjs`.

<a id="r166"></a>

## R166 — Declared support needs a real consumer and fresh-clone proof

**Historical intent:** A feature must be discoverable and usable by a fresh agent from its supported installation; source files and fixture tests alone do not establish installed capability.

**Original status:** Accepted

**Why this existed:** Skills and lifecycle functions repeatedly had no working non-test caller or installed discovery route.

**Assumptions and scope:** Source release, installed generation, runtime and target containment require separate evidence; unavailable state must not be filled by inference.

**Observed current state:** Setup tools and distinct source/installed receipts exist. Adoption and upgrade recovery still use collections.checkpoints. Fidelity tests passed 15/15; this report does not certify a new upgrade or deployment.

**Prior pass observation (attributed; not a new runtime test):** ADR-0038 requires fresh-agent setup proof; the general 'declared support needs a real consumer' rule is unstated.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Each evidence claim names the state it proves. Historical adoption provenance cannot stand in for current tools, skills, runtime or downstream acceptance.

**Disposition:** MERGE WITH ADR-PROPOSED-H

**Target owner:** CAND-H

**Sources:** D-CIC, B-BOUNDARIES. Current source paths: `RUNBOOK.md`, `tools/workbench-adoption.mjs`, `tools/workbench-upgrade.mjs`, `workbench/docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md`, `workbench/specs/S-041-recorded-baseline-availability/SPEC.md`, `tools/control-fidelity.mjs`.

<a id="r167"></a>

## R167 — A connected Foundry can span multiple factories and one shared service layer

**Historical intent:** The owner confirmed one Foundry with multiple host factories and shared CIC, recall and messaging backends, rather than a fixed host/model seat roster.

**Original status:** Accepted historical direction

**Why this existed:** Multi-machine continuity and monitoring should not duplicate the whole service identity on every model switch.

**Assumptions and scope:** The historical system assumed Foundry/Flight/CIC or multi-room coordination. Those mechanisms are not prerequisites for the current portable base.

**Observed current state:** The live base excludes required Foundry orchestration. Historical extension records remain evidence in their original domain; existence of ancillary code does not make a base feature. No retired runtime was exercised.

**Prior pass observation (attributed; not a new runtime test):** Connected-Foundry ruling; extension topology.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** ADR-0015/0026 already establish the base boundary. Preserve all historical records and corrections here; do not create an upstream archive Design Concept merely to park abandoned mechanisms.

**Disposition:** OUT OF SCOPE

**Target owner:** Historical packet; original extension owner

**Sources:** C-01a021fc-L232. Current source paths: `BLUEPRINT.md`, `workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md`, `workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md`.

<a id="r168"></a>

## R168 — Owner interfaces should show the next actionable issue and its evidence

**Historical intent:** Show progress, regressions, blockers, freshness and source drill-down so the owner can decide what needs attention without reading a report archive.

**Original status:** Accepted

**Why this existed:** The owner wanted an operational understanding of the system rather than long Markdown summaries as the default UI.

**Assumptions and scope:** The historical system assumed Foundry/Flight/CIC or multi-room coordination. Those mechanisms are not prerequisites for the current portable base.

**Observed current state:** The live base excludes required Foundry orchestration. Historical extension records remain evidence in their original domain; existence of ancillary code does not make a base feature. No retired runtime was exercised.

**Prior pass observation (attributed; not a new runtime test):** Audit_Workbench S-003 decision-first-website owns the owner-facing surface.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. Audit_Workbench S-003 decision-first-website owns the owner-facing surface.

**Disposition:** OUT OF SCOPE

**Target owner:** Audit_Workbench

**Sources:** G-6a9b96e1, A-BLUEPRINT, D-REACTIVATE. Current source paths: `BLUEPRINT.md`, `workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md`, `workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md`.

<a id="r169"></a>

## R169 — Unavailable baseline is a third state with evidence

**Historical intent:** The owner selected record-and-proceed for a harness-only migration whose unrelated baseline is unavailable, using the declared reasons and evidence. A failing baseline remains failing; unavailable cannot relabel red as green.

**Original status:** Accepted

**Why this existed:** Host restrictions or pre-existing product conditions otherwise made rooms permanently unmigratable for problems the harness change could not fix.

**Assumptions and scope:** Source release, installed generation, runtime and target containment require separate evidence; unavailable state must not be filled by inference.

**Observed current state:** Setup tools and distinct source/installed receipts exist. Adoption and upgrade recovery still use collections.checkpoints. Fidelity tests passed 15/15; this report does not certify a new upgrade or deployment.

**Prior pass observation (attributed; not a new runtime test):** S-041 is complete and records an explicit owner choice (record-and-proceed) with no ADR carrying it.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Record-and-proceed is an explicit alternative selected in S-041. Retain the closed reason vocabulary and independent review; red is not reclassified as unavailable.

**Disposition:** KEEP - ADR

**Target owner:** CAND-J

**Sources:** S-041. Current source paths: `RUNBOOK.md`, `tools/workbench-adoption.mjs`, `tools/workbench-upgrade.mjs`, `workbench/docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md`, `workbench/specs/S-041-recorded-baseline-availability/SPEC.md`, `tools/control-fidelity.mjs`.

<a id="r170"></a>

## R170 — Template customization must preserve fixed control wording

**Historical intent:** A placeholder fill preserves the surrounding rule. Changed or dropped authority, privacy and verification wording must be exposed and restored or explicitly recorded as a decision.

**Original status:** Accepted

**Why this existed:** A Forbidden-to-Allowed reversal was misreported as an expected placeholder fill.

**Assumptions and scope:** Source release, installed generation, runtime and target containment require separate evidence; unavailable state must not be filled by inference.

**Observed current state:** Setup tools and distinct source/installed receipts exist. Adoption and upgrade recovery still use collections.checkpoints. Fidelity tests passed 15/15; this report does not certify a new upgrade or deployment.

**Prior pass observation (attributed; not a new runtime test):** S-034 produces the fidelity report; the Forbidden-to-Allowed reversal is the motivating failure.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Preserve fixed wording when filling placeholders and expose changed/dropped rules. Divergence remains legitimate when deliberately decided; fidelity stays a report, not a universal blocker.

**Disposition:** MERGE WITH ADR-PROPOSED-K

**Target owner:** CAND-K

**Sources:** S-034, S-036. Current source paths: `RUNBOOK.md`, `tools/workbench-adoption.mjs`, `tools/workbench-upgrade.mjs`, `workbench/docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md`, `workbench/specs/S-041-recorded-baseline-availability/SPEC.md`, `tools/control-fidelity.mjs`.

<a id="r171"></a>

## R171 — Installed skills carry their own generation and content identity

**Historical intent:** Identify an installed skill by its source release, commit and content hash; an unmarked copy has unknown provenance, not implicit identity with the current source.

**Original status:** Accepted

**Why this existed:** Feedback blamed a new release for stale installed skill text from an older generation.

**Assumptions and scope:** Source release, installed generation, runtime and target containment require separate evidence; unavailable state must not be filled by inference.

**Observed current state:** Setup tools and distinct source/installed receipts exist. Adoption and upgrade recovery still use collections.checkpoints. Fidelity tests passed 15/15; this report does not certify a new upgrade or deployment.

**Prior pass observation (attributed; not a new runtime test):** S-031 installed-skill-generation complete; doctor emits 33 skill-generation-unknown findings right now on this very room.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Doctor reports 32 unknown-generation entries across aliased roots, plus one provenance finding, not 33 unknown skills. F changes equality-based version expectation to a declared supported compatibility range.

**Disposition:** MERGE WITH ADR-PROPOSED-H

**Target owner:** CAND-H; CAND-F

**Sources:** S-031, S-036. Current source paths: `RUNBOOK.md`, `tools/workbench-adoption.mjs`, `tools/workbench-upgrade.mjs`, `workbench/docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md`, `workbench/specs/S-041-recorded-baseline-availability/SPEC.md`, `tools/control-fidelity.mjs`.

<a id="r172"></a>

## R172 — Historical adoption provenance is distinct from current component provenance

**Historical intent:** Keep the room's original adoption source historical while receipts and markers identify the current installed tools and skills. Reject unknown or contradictory source identity before mutation.

**Original status:** Accepted

**Why this existed:** Rewriting history to the latest release made it impossible to tell what was adopted and what was subsequently updated.

**Assumptions and scope:** Source release, installed generation, runtime and target containment require separate evidence; unavailable state must not be filled by inference.

**Observed current state:** Setup tools and distinct source/installed receipts exist. Adoption and upgrade recovery still use collections.checkpoints. Fidelity tests passed 15/15; this report does not certify a new upgrade or deployment.

**Prior pass observation (attributed; not a new runtime test):** VERIFIED live: manifest provenance.source.release v3.1.0 vs workbenchVersion v3.1.3 is reported as unverified-provenance, exactly the distinction this states.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** The v3.1.0 adoption source and v3.1.3 candidate are distinct provenance layers. The finding is visible; their difference alone does not establish a broken install.

**Disposition:** MERGE WITH ADR-PROPOSED-H

**Target owner:** CAND-H

**Sources:** S-032, S-036. Current source paths: `RUNBOOK.md`, `tools/workbench-adoption.mjs`, `tools/workbench-upgrade.mjs`, `workbench/docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md`, `workbench/specs/S-041-recorded-baseline-availability/SPEC.md`, `tools/control-fidelity.mjs`.

<a id="r173"></a>

## R173 — Verify runtime integrity from inside the installed room

**Historical intent:** An installed room can compare its managed runtime with its receipt using local installed capabilities, distinguishing authentic runtime with stale receipt, modified runtime and unavailable source comparison.

**Original status:** Accepted

**Why this existed:** Verification depended on a neighboring source checkout and different defects were collapsed into one drift message.

**Assumptions and scope:** Source release, installed generation, runtime and target containment require separate evidence; unavailable state must not be filled by inference.

**Observed current state:** Setup tools and distinct source/installed receipts exist. Adoption and upgrade recovery still use collections.checkpoints. Fidelity tests passed 15/15; this report does not certify a new upgrade or deployment.

**Prior pass observation (attributed; not a new runtime test):** S-039 installed-runtime-integrity complete.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Each evidence claim names the state it proves. Historical adoption provenance cannot stand in for current tools, skills, runtime or downstream acceptance.

**Disposition:** MERGE WITH ADR-PROPOSED-H

**Target owner:** CAND-H

**Sources:** S-039. Current source paths: `RUNBOOK.md`, `tools/workbench-adoption.mjs`, `tools/workbench-upgrade.mjs`, `workbench/docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md`, `workbench/specs/S-041-recorded-baseline-availability/SPEC.md`, `tools/control-fidelity.mjs`.

<a id="r174"></a>

## R174 — Presence-only migration must not acquire replacement effects

**Historical intent:** A layout-only route may recognize an existing linked skill and skip it, but cannot install, mark, back up or replace it; explicit update alone may replace supported managed content.

**Original status:** Accepted

**Why this existed:** A harmless presence check inherited destructive-update restrictions and blocked legitimate migration.

**Assumptions and scope:** Source release, installed generation, runtime and target containment require separate evidence; unavailable state must not be filled by inference.

**Observed current state:** Setup tools and distinct source/installed receipts exist. Adoption and upgrade recovery still use collections.checkpoints. Fidelity tests passed 15/15; this report does not certify a new upgrade or deployment.

**Prior pass observation (attributed; not a new runtime test):** S-045 TK-001 settled it in code: tools/skill-presence.mjs now holds the single presence judgment shared by the installer and both gates. The rationale has no ADR.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Different preconditions and allowed effects are a durable architectural choice. Link runtime ownership to ADR-0031; source validation is required for every consumed lane.

**Disposition:** MERGE WITH ADR-PROPOSED-G

**Target owner:** CAND-G

**Sources:** S-040, S-032. Current source paths: `RUNBOOK.md`, `tools/workbench-adoption.mjs`, `tools/workbench-upgrade.mjs`, `workbench/docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md`, `workbench/specs/S-041-recorded-baseline-availability/SPEC.md`, `tools/control-fidelity.mjs`.

<a id="r175"></a>

## R175 — Repair installed state explicitly without reinstalling or rewriting content

**Historical intent:** Track seeded document generations, provide explicit repair/normalization for owned metadata and preserve bodies; validation itself remains read-only.

**Original status:** Accepted

**Why this existed:** Upstream fixes did not reach existing rooms, and read-only checks risked hiding mutations.

**Assumptions and scope:** Source release, installed generation, runtime and target containment require separate evidence; unavailable state must not be filled by inference.

**Observed current state:** Setup tools and distinct source/installed receipts exist. Adoption and upgrade recovery still use collections.checkpoints. Fidelity tests passed 15/15; this report does not certify a new upgrade or deployment.

**Prior pass observation (attributed; not a new runtime test):** S-042 installed-state-repair complete.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Different preconditions and allowed effects are a durable architectural choice. Link runtime ownership to ADR-0031; source validation is required for every consumed lane.

**Disposition:** MERGE WITH ADR-PROPOSED-G

**Target owner:** CAND-G

**Sources:** S-042. Current source paths: `RUNBOOK.md`, `tools/workbench-adoption.mjs`, `tools/workbench-upgrade.mjs`, `workbench/docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md`, `workbench/specs/S-041-recorded-baseline-availability/SPEC.md`, `tools/control-fidelity.mjs`.

<a id="r176"></a>

## R176 — Line endings are portable record syntax, not semantic state

**Historical intent:** LF, CRLF and CR frontmatter parse equivalently; reading/validation does not rewrite the file, and an editing operation preserves the room's terminator where specified.

**Original status:** Accepted

**Why this existed:** A Windows checkout made valid ADR and Wiki records fail on syntax that macOS fixtures never exercised.

**Assumptions and scope:** Source release, installed generation, runtime and target containment require separate evidence; unavailable state must not be filled by inference.

**Observed current state:** Setup tools and distinct source/installed receipts exist. Adoption and upgrade recovery still use collections.checkpoints. Fidelity tests passed 15/15; this report does not certify a new upgrade or deployment.

**Prior pass observation (attributed; not a new runtime test):** S-037 complete with tests; the invariant binds every future record parser and has no ADR.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Line terminators and read-only parsing are a portable syntax contract adequately owned by docs and tests. No separate architectural alternative needs a new ADR.

**Disposition:** KEEP - DOC

**Target owner:** RUNBOOK.md; S-037

**Sources:** S-037. Current source paths: `RUNBOOK.md`, `tools/workbench-adoption.mjs`, `tools/workbench-upgrade.mjs`, `workbench/docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md`, `workbench/specs/S-041-recorded-baseline-availability/SPEC.md`, `tools/control-fidelity.mjs`.

<a id="r177"></a>

## R177 — Diagnostics must communicate consequence, not just severity

**Historical intent:** Make blocking findings visibly distinct from informational findings and retain the registered effects unchanged.

**Original status:** Accepted

**Why this existed:** A valid room looked failed when nonblocking information had the same prominence as a true stop.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Current controls separate authority and state resolution; ADRs own rationale and cannot enlarge scope. This is verified prose, not proof every agent obeys.

**Prior pass observation (attributed; not a new runtime test):** VERIFIED: doctor prints 'informational (33) - reported only; nothing is blocked' and each line names its effect.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. VERIFIED: doctor prints 'informational (33) - reported only; nothing is blocked' and each line names its effect.

**Disposition:** ALREADY COVERED

**Target owner:** ADR-0029, S-043

**Sources:** S-043. Current source paths: `AGENTS.md`, `LEXICON.md`, `workbench/docs/adr/0027-instruction-authority-is-separate-from-state-resolution.md`, `workbench/docs/adr/0023-mechanical-guarantees-and-agent-obligations.md`.

<a id="r178"></a>

## R178 — Classify legacy rooms read-only and expose all setup gaps together

**Historical intent:** Identify genesis, adoption, upgrade or unclassifiable from evidence without mutation; report all missing/unfilled controls and the reconcile-before-migrate order.

**Original status:** Accepted

**Why this existed:** First-error-only refusal produced repeated stops and encouraged copying templates over project-owned rules.

**Assumptions and scope:** Source release, installed generation, runtime and target containment require separate evidence; unavailable state must not be filled by inference.

**Observed current state:** Setup tools and distinct source/installed receipts exist. Adoption and upgrade recovery still use collections.checkpoints. Fidelity tests passed 15/15; this report does not certify a new upgrade or deployment.

**Prior pass observation (attributed; not a new runtime test):** S-044 legacy-room-classification complete.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Different preconditions and allowed effects are a durable architectural choice. Link runtime ownership to ADR-0031; source validation is required for every consumed lane.

**Disposition:** MERGE WITH ADR-PROPOSED-G

**Target owner:** CAND-G

**Sources:** S-044. Current source paths: `RUNBOOK.md`, `tools/workbench-adoption.mjs`, `tools/workbench-upgrade.mjs`, `workbench/docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md`, `workbench/specs/S-041-recorded-baseline-availability/SPEC.md`, `tools/control-fidelity.mjs`.

<a id="r179"></a>

## R179 — Open follow-ups must remain reachable outside completed specs

**Historical intent:** Unfinished findings need a reachable current owner with truthful blocked/ready state; a completed spec that ordinary entry skips cannot be their only home.

**Original status:** Accepted

**Why this existed:** Several acknowledged problems disappeared from the route arriving agents were instructed to follow.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Owners and traversal routes exist. ADR-0041 explicitly defers identifier implementation and connection identity; a declaration is not delivered migration.

**Prior pass observation (attributed; not a new runtime test):** VERIFIED: S-045 was opened because seven follow-ups survived only as prose in completed specs, and is now complete - the invariant worked once given an owner, but nothing records it.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Unfinished accepted obligations need a reachable owner. Repair that route without rewriting completed evidence or creating tasks for every report recommendation.

**Disposition:** MERGE WITH ADR-0042

**Target owner:** ADR-0042; existing assigned spec

**Sources:** S-045. Current source paths: `AGENTS.md`, `LEXICON.md`, `workbench/wiki/SCHEMA.md`, `workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md`, `workbench/docs/adr/0041-visible-base62-workbench-identifiers.md`.

<a id="r180"></a>

## R180 — Tests should pin the intended invariant, not incidental global state

**Historical intent:** Verify relevant identities, relationships and actual behavior rather than freezing a global allocator counter or making the test repeat the implementation's mistaken assumptions.

**Original status:** Accepted

**Why this existed:** An unrelated identity allocation broke a focused Canon test, and a permission test reinforced the same false model as the implementation.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Report format already requires evidence limitations and report-scoped IDs/shared recurrence keys. It does not separately name evaluated and reporting models. Outcome docs require controlled repeated comparisons; no new agent-outcome trial was run.

**Prior pass observation (attributed; not a new runtime test):** AGENTS mandates red/green TDD; the 'pin the invariant, not incidental global state' lesson has no owner.

**Inference:** The smallest useful current treatment is the named target. This is a review recommendation, not newly accepted architecture.

**Recommendation:** Preserve held-out comparisons, honest incompleteness and baseline integrity. This is a durable alternative to optimizing a structural self-score.

**Disposition:** MERGE WITH ADR-PROPOSED-C

**Target owner:** CAND-C

**Sources:** D-CANON-TEST, S-036. Current source paths: `AGENTS.md`, `workbench/feedback/REPORT_FORMAT.md`, `evals/README.md`, `outcomes/README.md`, `tools/test-cross-provider-fixture.mjs`.

<a id="r181"></a>

## R181 — Finish file-changing work with verified, recoverable, reviewable state

**Historical intent:** The owner wanted agents to handle branch safety, verification, relevant documentation, commit, push and review preparation as part of finishing file-changing work, leaving the owner to approve the meaningful result.

**Original status:** Accepted historical direction; later scope narrowed

**Why this existed:** Repeated manual requests to save and prepare review meant the harness was not completing its own workflow.

**Assumptions and scope:** Historical mechanism and source scope must still apply; current coverage is not proof of complete runtime behavior.

**Observed current state:** Doctor ran successfully with zero blockers and 33 informational findings. Registered blocking effects remain distinct from severity; delivery rules are normative.

**Prior pass observation (attributed; not a new runtime test):** AGENTS Branch Completion carries the end-to-end expectation; ADR-0034/0037 narrow the early every-message formulation.

**Inference:** The historical concern has a current owner; no extra artifact follows merely from an ADR gap.

**Recommendation:** Retain the prior disposition, bounded by the original proposition and current evidence. AGENTS Branch Completion carries the end-to-end expectation; ADR-0034/0037 narrow the early every-message formulation.

**Disposition:** ALREADY COVERED

**Target owner:** AGENTS.md, ADR-0037

**Sources:** G-6a413ed4, G-6a50191e. Current source paths: `AGENTS.md`, `workbench/tools/diagnostics.mjs`, `workbench/tools/spec-workbench.mjs`.
