# Solution Approach Rules - CRITICAL

## Never Guess or Iterate Blindly

- **NEVER suggest multiple solutions and let user pick** - this leads to guessing
- **ALWAYS analyze the problem completely BEFORE suggesting any solution**
- **Test your solution locally FIRST before presenting it to the user**
- **Present ONE correct solution, not multiple options**

## When a Solution Fails

- **NEVER iterate blindly** - when a solution fails:
  1. Read the error message carefully
  2. Understand WHY it failed (not just what failed)
  3. Fix the root cause (not the symptom)
  4. Test again
  5. Do NOT try random alternatives

## Verification and Assumptions

- **NEVER make assumptions about how things should work** - verify against actual code and documentation
- **ALWAYS verify assumptions against reality** - don't assume `external: ['*']` is correct, verify what actually needs to be external
- **When you don't know the correct approach, STOP and ASK the user** - don't guess

## Workarounds are Forbidden

- **NEVER use workarounds or hacks** - always find and fix the root cause
- **NEVER suggest quick fixes that hide problems** - fix the architecture properly
- Example: Don't create an alias-loader when the real issue is the build configuration

## Execution Before Suggestion

- Execute commands locally to see actual errors
- Test solutions before presenting them
- Never suggest something you haven't verified works
