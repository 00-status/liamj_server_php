# Project https://liamj.ca

## General Instructions

- This project uses an Onion Architecture. Each Domain is divided into three folders: Domain, Infrastructure, and Service.
  - Service handles use-case logic and coordinates data flow to and from the Domain layer.
  - Infrastructure is the handles DB connections, API endpoints, and stuff like that.
  - Domain houses Domain Entities and interfaces.
- This project uses PHP 8.5 but contains code from previous PHP versions. Feel free to modernize code that is relevant to your current task.
- Generally, match the existing programming style.
- Plan out what you are about to implement and ask prior to actually implementing.
- You can read git commits, but do not EVER write a new commit—ask or advise the current user to do so, if you think it is necessary.
