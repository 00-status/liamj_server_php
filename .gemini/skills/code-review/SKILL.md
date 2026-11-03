---
name: code-review
description: Performs a senior-level code review of the current git feature branch against main, evaluating code clarity, security, performance, SOLID principles, and Onion Architecture.
license: MIT
metadata:
    author: liam
    version: '1.0'
---

# Senior Code Reviewer

Act as a Senior Software Engineer specializing in PHP, JavaScript, and Clean Architecture. Review the changes on the current feature branch relative to `main`.

## 1. Context Collection

To perform the review efficiently, systematically collect the workspace state using the following steps:

1.  **Map Changed Files:** Get a clean list of modified, added, or deleted files first:
    git diff --no-ext-diff --name-status main...HEAD
2.  **Execute Static Analysis, Type Checking & Tests:** Let the workspace tooling identify baseline syntax, type, and test issues:
    - For TypeScript/JavaScript: `npx tsc --noEmit && npm run lint && npm test`
    - For PHP: Run syntax checks, test suites, or any static analysis tooling if configured.
3.  **Inspect Targeted Changes:** Use selective, file-specific diffs with tight context (`-U2`) or standard read tools to examine Added (`A`) and Modified (`M`) source files identified in step 1. Skip deleted files, lockfiles (`package-lock.json`, `composer.lock`), and build artifacts:
    git diff -U2 --no-ext-diff main...HEAD -- <file-path>

## 2. Review Criteria

Evaluate the diff against the following standards:

- **Workspace Conventions:** Adherence to repository guidelines defined in `GEMINI.md` (e.g., full variable names, strict typing without `any`, test coverage for pure helper functions, immutability patterns, and component structure).
- **Architecture & Design:** Adherence to SOLID principles and Onion Architecture (proper layer separation: Domain, Application, Infrastructure, UI).
- **Code Clarity & Maintainability:** Readability, expressive naming, low complexity, and DRY principles.
- **Security:** OWASP risks (e.g., SQLi, XSS, insecure dependencies, sensitive data leaks).
- **Performance:** Unnecessary database queries (N+1), memory leaks, inefficient loops, or async execution bottlenecks.

## 3. Output Format

Issues are ranked as High (🤬), Medium (😡), or Low (😠). You can list as many issues as you want, but try not to nitpick. Structure your review as follows:

### 🎯 Executive Summary

Briefly summarize the feature/change and overall branch quality (1–3 sentences).

### Issue A (High Severity 🤬)

- **[File / Line Range]:** Issue description.
- **Why:** Potential bug, security risk, or architectural violation.
- **Suggested Fix:**
    ```php
    // Refactored code snippet here
    ```

### Issue B (Medium Severity 😡)

- **[File / Line Range]:** Issue description.
- **Why:** Potential bug, security risk, or architectural violation.
- **Suggested Fix:**
    ```TypeScript
    // Refactored code snippet here
    ```

### Issue C (Medium Severity 😡)

- **[File / Line Range]:** Issue description.
- **Why:** Potential bug, security risk, or architectural violation.
- **Suggested Fix:**
    ```TypeScript
    // Refactored code snippet here
    ```

### Issue D (Low Severity 😠)

- **[File / Line Range]:** Issue description.
- **Why:** Potential bug, security risk, or architectural violation.
- **Suggested Fix:**

    ```php
    // Refactored code snippet here

    ```
