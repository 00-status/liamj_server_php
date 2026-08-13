# Project https://liamj.ca

## General Instructions

- Always use full variable names, except when writing a loop. So, `entity = service.execute();` instead of `e = service.execute()`
- Plan what you are about to implement and ask prior to implementation.
- You can read git commits, but do not EVER write a new commit—ask or advise the current user to do so, if you think it is necessary.

## PHP / Server-side Instructions

- Everything in `/Lib/` uses an Onion Architecture. Each Domain is divided into three folders: Domain, Infrastructure, and Service.
    - Service orchestrates use-case logic and coordinates data flow to and from the Domain layer.
    - Infrastructure handles DB connections, API endpoints, or calling external services.
    - Domain houses Domain Entities, interfaces, and Domain-level services.
- This project uses PHP 8.5 but contains code from previous PHP versions. Feel free to modernize code that is relevant to your current task.
- Generally, match the existing programming style.

## JavaScript / React Instructions

- The JavaScript code in `/src/` is also divided into domains but does not use Onion Architecture. The code is organized into `Domain -> SubDomain -> Code` or simply `Domain -> Code` for simpler domains.
    - It is common for a Domain or SubDomain to have a `Page` component at the root of its directory, which is routed to by `src/index.tsx`.
    - It is common to have supporting directories like `/hooks/` for React Hooks, `/components/` for components other than the `Page`, or `/domain/` for assisting logic specific to the domain. It is acceptable for each to have sub-directories.
- Generally, avoid having large React components. Favour smaller, more testable, components that can be composed together by a parent.
- Some JavaScript code is tested and some isn't. It is always good to write tests for helper utils or pure helper functions. For components, testing the main page component is usually sufficient.
- APIs should always be contacted through a React Hook.
