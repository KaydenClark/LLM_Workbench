# Skill mechanics

## Invocation

Use model invocation when an agent needs to select the skill automatically or another authorized workflow needs its reference. A user can still invoke it directly. Put the capability and its actual trigger branches in the description.

Use explicit invocation for a workflow the owner starts by name. For Claude Code retain `disable-model-invocation: true` in SKILL.md frontmatter; for Codex add `agents/openai.yaml` with `policy.allow_implicit_invocation: false`. State the same boundary in the body because other hosts may ignore those fields. Availability in every room and automatic invocation are separate choices.

Compose references only within inherited scope. A skill call grants no permission, role, agent creation or external action. A router explains which operation fits; it does not start every operation it lists. Consult the room's existing composition and authority rules rather than importing a new orchestration policy.

## Packaging

Use a folder whose name matches the frontmatter `name`, with a concise `description` and a SKILL.md entrypoint. Add supporting files only for material a real branch needs. Link every required resource at the point where that branch needs it, and verify the link.

Keep portable Workbench skill source in the manifest's skills lane. Use the room's existing discovery adapters and installation/update routes. Host metadata expresses invocation policy; filesystem presence alone proves neither native discovery nor effective policy enforcement. Use paths within the shipped skill or to an existing room owner, preserving host-independent instructions.
