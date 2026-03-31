# xplain-like-im-5

**Claude Code agents that explain everything in simple, non-technical language.**

Stop staring at technical jargon. Start understanding what's actually happening.

## The Problem

AI coding assistants speak developer. Non-developers get responses full of "deploy to production", "database migration", "CI/CD pipeline" — words that mean nothing to them.

**xplain-like-im-5** installs persona agents into Claude Code that translate everything into human language. Each persona has a unique style, but they all follow one rule:

> **Always describe the RESULT the user can see, not the technical process.**

## Install

```bash
# Install all 5 personas
npx xplain-like-im-5 install --all

# Or just one
npx xplain-like-im-5 install grandma
```

## Use

```bash
claude --agent xli5-grandma
```

That's it. Claude now speaks grandma.

## 5 Personas

### 🧒 ELI5 — Explain Like I'm 5

```
You: "What just happened?"
ELI5: "Your website is open! Everyone in the world can see it now,
      like opening the doors of your shop! 🏪"
```

### 👵 Grandma — Patient & Warm

```
You: "The team says they changed the infrastructure"
Grandma: "Think of it like your house, dear. The furniture inside 
         (your website) stays the same, but they're changing the 
         plumbing and electricity underneath. Your stuff is safe!"
```

### 💼 Business — Executive Briefing

```
You: "What's the status?"
Business: "Update is live. 100% of users can access the new version.
          No downtime. Next milestone: payment integration, ETA Friday."
```

### ⚡ Gen-Z — Keep It Real

```
You: "Is it working?"
Gen-Z: "yep it's live 🚀 everyone can see it. looks clean too ✅"
```

### 📚 Teacher — Learn While You Go

```
You: "What's a server?"
Teacher: "Imagine your website is a restaurant. The server is the 
         kitchen — it's where all the food (your web pages) gets 
         prepared before being served to customers (your visitors). 
         Does that make sense?"
```

## What Makes This Different

**Technical terms are explained, not hidden.** When the agent says "server", it immediately adds "(the computer that runs your website)". You learn the words naturally without being overwhelmed.

**Agents suggest, not ask.** Non-devs don't know what to ask for. Instead of "Want me to check the settings?", the agent says "I'm going to check the settings next — because after this kind of change, they sometimes need updating."

**Every action has a meaning.** Non-devs care about results, not processes:

| What the agent does | What it means for you |
|---|---|
| "Committing and pushing to git" | "Saving your changes and sharing them with the team" |
| "Creating a pull request" | "Asking the team to review and approve your changes" |
| "Running tests" | "Checking that everything still works correctly" |
| "Building the project" | "Preparing your app so it's ready to go live" |
| "Deploying to production" | "Putting your app online so users can see it" |
| "Rolling back" | "Going back to the previous version because the new one had issues" |
| "Creating an issue" | "Writing down a problem or idea so the team can track it" |

## Commands

```bash
npx xplain-like-im-5 install <pack>    # Install a persona
npx xplain-like-im-5 install --all     # Install all 5
npx xplain-like-im-5 list              # See what's installed
npx xplain-like-im-5 remove <pack>     # Remove one
npx xplain-like-im-5 reset             # Remove all
```

## How It Works

Each persona is a `.md` file installed to `~/.claude/agents/`. When you start Claude Code with `--agent xli5-<name>`, Claude reads the persona instructions and adapts its communication style. No code changes, no config, no dependencies.

## License

MIT
