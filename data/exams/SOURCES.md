# Certification configuration provenance

All questions in `../questions/` are original educational practice. They are not real exam questions, are not supplied by an examination provider, and do not establish eligibility or predict an official result. The providers do not endorse this application.

## Verification status — 2026-10-20

Requests to the official IIBA and Scrum.org sites returned a policy-denied `CONNECT 403` from the cloud egress proxy. No official exam format, question count, duration, pass score, domain weights, or current syllabus has therefore been asserted as verified. These facts are intentionally `null`, `verifiedAt` is `null`, and every configuration is `needs-verification`.

Each JSON file includes the canonical official certification page to consult. Scrum-related content should be checked against the [official Scrum Guide](https://scrumguides.org/scrum-guide.html), including the 2020 edition specified by this project. BA content should be checked against official IIBA certification materials and a lawfully accessed BABOK Guide v3; do not copy the guide into this repository.

The `domains` lists currently represent editorial groups for practice navigation, not a verified official blueprint. They have no invented weighting. `format` remains `null`; written PSPO III exercises are an educational practice choice, not a verified claim about the current provider assessment.

## Safe update procedure

1. Open the current official certification page and its linked syllabus/blueprint or handbook.
2. Confirm the assessment format, current question count, permitted duration, published passing policy (which can remain null when undisclosed), and domain definitions/weights.
3. Record any distinctions between learning syllabus, examination blueprint, and eligibility requirements.
4. Update only facts supported by those official documents, retaining the source URLs and setting the verification date.
5. Map practice questions to the verified domains; do not represent a small seed bank as a full-length mock if it cannot supply enough distinct questions or the required response types.
6. Set `verificationStatus` to `verified` only after all configured facts and domains have been checked. If the provider does not publish a passing percentage, leave that value null and explain the policy in `notes`.
7. Run `npm run validate:content` and the assessment tests before publishing.

For written responses, the rubric is for structured self-assessment. No automatic correctness or official pass percentage should be inferred from a model answer.
