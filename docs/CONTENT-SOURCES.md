# Teaching sources and scope — 2026-10-21

The user supplied four PDFs and pasted Scrum Guide text. Files were extracted locally with `pdftotext -layout`. They remain outside the Git repository and are not published.

| Source read                                                                              | Sections consulted                                                                                                                                                                                | Teaching use                                           |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Scrum Guide, November 2020 — Ken Schwaber & Jeff Sutherland                              | Scrum Theory, Scrum Team, all events, all artifacts and commitments                                                                                                                               | PSPO I, shared-quality and accountability reasoning    |
| The Kanban Guide for Scrum Teams, January 2021 — Scrum.org, Daniel Vacanti & Yuval Yeret | pp. 3–8, especially metrics p. 4 and SLE p. 6                                                                                                                                                     | PSPO II flow lesson and original scenario checks       |
| Evidence-Based Management Guide, 2024 — Scrum.org                                        | goals pp. 3–4, measures pp. 5–6, experiments pp. 6–7, KVAs pp. 8–11, inspection pp. 11–12, examples pp. 13–16                                                                                     | Value, strategy, experiments and reflection            |
| The Professional Product Owner, 2018 — Don McGreal & Ralph Jocham, ISBN 9780134686479    | Selected material in chapters 1–5, 7–8: Three Vs, product mindset, empiricism/complexity, value metrics, stakeholder/marketplace feedback, MVP, pivot/persevere, backlog ordering and forecasting | Original product-management explanations and scenarios |

## Version decisions

- Scrum terminology and rules follow the November 2020 Guide. The book's older “Development Team” terminology does not override Developers, self-management, Product Goal and artifact commitments.
- EBM instruction follows the supplied 2024 guide, including all four KVAs and the distinction between inputs, activities, outputs, outcomes and impacts.
- The January 2021 upload is **The Kanban Guide for Scrum Teams**, not the standalone Kanban Guide. Kanban complements Scrum and does not remove Sprints/events.
- Formula examples, experiment thresholds and answer-writing structures are teaching aids, not certification rules or official grading criteria.
- Adapted explanations derived from the Scrum and Kanban guides are shared under CC BY-SA 4.0 with attribution on lesson/source pages. Book prose, figures and quizzes are not copied.

## Coverage and practice

All eleven PSPO lessons are now complete in Azerbaijani and English. Eight PSPO I/II lessons include source-tagged original questions and interactive inline checks. PSPO III lessons teach written reasoning and link to original written exercises with self-review rubrics. No automatic official grading is claimed. The total question bank has 218 items; sixteen newly authored items carry explicit `sourceIds`. Earlier original items retain their IDs, options and answer keys; their lesson links now point to complete related PSPO teaching. These older items are editorial practice and have not all undergone a topic-by-topic citation audit.

`data/sources.json` is the source register. `data/lessons.json` and the new questions refer to it through `sourceIds`. Validation rejects missing/unread source IDs and source-tagged questions pointing to outlines. The browser checks source status, inline feedback, lesson-focused practice, persistence and existing functionality.

## Unavailable material and limits

On 2026-10-21 the Product Owner Open URL returned HTTP 202 with an AWS WAF challenge and no question content. The ClassMarker URL was denied by the environment proxy (CONNECT 403). Neither assessment was read or reproduced; ClassMarker's official status is unverified. The app links to Product Owner Open for official practice.

Previously requested Scrum.org forum posts were also unavailable behind a challenge. Modern Analyst and AbeBooks links were blocked; an announcement or sales listing would not replace the BABOK text in any case. No newly completed BABOK lessons are attributed to these links. IIBA curricula and exam provenance from the previous implementation remain separately documented.

The uploaded books/guides do not verify current assessment question counts, time limits, pass thresholds or exact exam domain weights. PSPO exam settings therefore remain `needs-verification`; short practice remains available. Do not represent the topic groups as a verified exam blueprint or enable a full official-format mock without verified rules and a sufficiently large bank.
