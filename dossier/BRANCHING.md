# Branching Concept

## Table of Contents
1. [Introduction](#introduction)
2. [Branching Strategy](#branching-strategy)
3. [Branching Model](#branching-model)
4. [Branching Workflow](#branching-workflow)
5. [Branching Naming Convention](#branching-naming-convention)
6. [References](#references)

### Introduction
This document describes the branching concept used in the project. It explains the branching strategy, the branching model, the branching workflow, and the branching naming convention.

### Branching Strategy
The branching strategy used in the project is a slightly modified Gitflow Workflow. It is a branching model designed around the project release. It is a strict branching model that assigns specific roles to different branches. The main branches are `main`, `dev`, `group`, and `task`.

### Branching Model
The branching model consists of the following branches:
- `main`: The main branch that contains the production-ready code. It is the branch that is deployed to the production server and handed in as results of the milestones.
- `dev`: The development branch that contains the latest development code. It is the branch where all group and task branches are merged into.
- `group`: The group branches are used to solve multiple dependent tasks. They are branched off from the `dev` branch and merged back into the `dev` branch.
- `task`: The task branches are used to solve a single task. They are branched off from the `dev` or `group` branch and merged back into the originating branch. Developers may branch off from a `task` branch to simplify parallel development.
- `hotfix`: The hotfix branches are used to fix critical bugs in the production code. They are branched off from the `main` branch and merged back into the `main` and `dev` branch.
- `doc`: The documentation branches are used to write any form of documentation. They are branched off from the `dev` or `group` branch and merged back into the originating branch.<br>&nbsp;&nbsp;<small>If the documentation is done in parallel with the development, the documentation should instead be done in the respective `task` or `group` branch.</small>

### Branching Workflow
The branching workflow consists of the following steps:
1. Create a new branch from the `dev` branch.
2. Solve the task or fix the bug in the branch.
3. Test the branch locally.
4. Create a pull request to merge the branch back into the `dev` branch.
5. Review the pull request.
6. Merge the branch into the `dev` branch.

### Branching Naming Convention
The branching naming convention is as follows:
- `group`: `group/<group-name>` (e.g. `group/M1-A2+A3`)
- `task`: `task/<task-name>` (e.g. `task/M1-A2`)
    - `task-developer`: `task/<task-name>@<developer-name>` (e.g. `task/M1-A2@simon`)
- `hotfix`: `hotfix/<hotfix-name>` (e.g. `hotfix/M1-A2-fix`)

### References
- [Gitflow Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)
