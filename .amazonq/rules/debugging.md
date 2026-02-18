# Debugging and Investigation Rules

## Never Make Conclusions Without Evidence

- **CRITICAL: NEVER make conclusions without evidence** - ALWAYS add debug logs first, check logs, then investigate
- **When debugging, ALWAYS add logs at key points** to understand what's happening before drawing conclusions
- **If something doesn't work, add logs → check output → investigate → fix**
- Never skip the logging step

## Investigation Process

1. Read the error message carefully
2. Add logs at key points
3. Check the output
4. Understand what's happening
5. Then fix the root cause

## Problem Solving Philosophy

- NEVER remove functionality when encountering errors - ALWAYS investigate and fix properly
- When something doesn't work, research the correct solution (check documentation, examples, types)
- Removing features is NOT a solution - it's avoiding the problem
- **If unsure about the correct approach, STOP and ask for clarification before implementing**

## Respect User's Architecture

- **ALWAYS respect the user's architectural decisions**, even if they seem more complex than alternatives
- **NEVER bypass the user's explicit architectural requirements**, even if a "simpler" solution seems available
- **If the user says the request MUST go through Koa routes/middlewares, it MUST go through them** - do NOT call services directly as a shortcut
