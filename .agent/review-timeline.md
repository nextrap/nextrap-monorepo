# Package Review Timeline

This file is the persistent state for the daily package review agent.

Before every review, read this table and select exactly one package in this repository that has either never been reviewed or has the oldest `Last reviewed` date. Do not review the same package repeatedly while other eligible packages are older or unreviewed.

After the review, update or add exactly one row for the reviewed package and keep the table sorted by `Last reviewed` ascending, with never-reviewed packages first when they are listed.

| Package | Last reviewed | Proposal |
| --- | --- | --- |

Proposals are stored below `.agent/proposals/` using the filename pattern `proposal-YYYY-MM-DD-<package>-<short-topic>.md`. Each proposal must describe one concrete, reviewable improvement only. The proposal file remains in the repository after the email has been sent.
