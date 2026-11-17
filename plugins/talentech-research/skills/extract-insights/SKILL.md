---
name: extract-insights
description: "Parse a research report, synthesis document, or set of interview notes and extract atomic insights ready to paste into the Talentech insights repository. Use this skill whenever someone wants to add research findings to the repository, extract insights from a completed study, populate the atomic insights database, or turn a research report into structured rows. Triggers include: 'extract insights from this report', 'add this to the repository', 'parse this research', 'get the insights out of this', 'convert this to atomic insights', 'populate the insights database', 'what insights can we extract', 'turn this into repository rows'. Always use this skill when a research document needs to be broken down into individual, structured insight records."
author: Lindsey Crabtree
---

# Insight Extractor

This skill parses a research report, synthesis document, or interview notes and returns a structured list of atomic insights ready to paste into the Talentech insights repository.

An atomic insight is a single, specific, falsifiable statement about a user, behaviour, need, or experience. It is not a theme, not a summary paragraph, and not a recommendation. It describes reality as customers experience it, grounded in the evidence in the source document.

---

## What this skill produces

A markdown table with one row per atomic insight, using the Talentech repository schema. Each row contains:

| Column | Description |
|---|---|
| **Insight statement** | One sentence. Specific, falsifiable, written in plain language. No hedging. |
| **Product area** | ATS, Onboarding, Recruitment Marketing, Analytics, Innovation, Cross-portfolio |
| **User type** | Hiring Manager, HR Admin / HR Manager, Recruiter, System Administrator, Candidate, Internal / Other |
| **Research type** | Generative interview, Usability test, Survey, Workshop, CSM-reported, AI-synthesised, Mixed |
| **Confidence level** | High, Medium, or Low — see definitions below |
| **Confidence rationale** | One sentence explaining why that confidence level was assigned |
| **Source study** | Name or title of the document this came from |
| **Date** | Date of the source study if stated; otherwise "Unknown" |

---

## Confidence level definitions

Apply these precisely. When in doubt, go lower.

**High** — The insight is directly supported by a verbatim quote or observed behaviour from primary research with multiple participants, or from a single participant where the behaviour or statement is specific and unambiguous.

**Medium** — The insight is a pattern inferred across multiple data points in the source document, but is not directly quoted or explicitly stated. The researcher interpreted the pattern.

**Low** — The insight comes from a single mention, is inferred by the researcher without direct evidence, was reported secondhand (e.g. via a CSM or sales person), or comes from AI-synthesised material rather than primary research.

---

## Extraction rules

Follow these strictly:

1. **One insight per row.** Never combine two findings into a single statement. If you find yourself writing "and" in an insight statement, split it into two rows.

2. **Insights describe reality, not recommendations.** "Hiring managers find the job posting flow confusing" is an insight. "The job posting flow should be redesigned" is a recommendation. Recommendations go in a separate section at the end, not in the table.

3. **Be specific.** "Users are frustrated" is not an atomic insight. "Hiring managers using TalentRekry reported that they could not find the duplicate posting function without help from an administrator" is.

4. **Do not infer beyond the source.** If the document says "several participants mentioned X", do not write "all hiring managers experience X". Write "Several participants reported X" and assign Medium confidence.

5. **Assign product area from context.** Use the product name mentioned in the source. If the document covers multiple products, assign the most relevant one per row. Use Cross-portfolio only if the insight genuinely applies across products with evidence for each.

6. **Assign user type from who said or experienced it.** If the source does not specify, write "Unknown" and assign Low confidence.

7. **Flag AI-synthesised source material.** If the document you are parsing was itself produced by AI (e.g. a Claude synthesis of interview notes rather than a human-written report), mark every row as Research type: AI-synthesised and Confidence level: Low unless there are direct quotes from primary research embedded in the document.

---

## What to do before extracting

Read the entire source document before writing a single row. Then:

1. Note the source document name and date.
2. Note the research method used (if stated).
3. Note the primary product area(s) covered.
4. Note the user types represented.
5. Identify any direct quotes — these are your High confidence candidates.
6. Identify patterns stated explicitly by the researcher — these are your Medium confidence candidates.
7. Identify inferences, secondhand reports, or single mentions — these are your Low confidence candidates.

---

## Output format

First, output the markdown table with all extracted insights.

Then, output a separate section called **Recommendations** listing any recommendations or suggested actions from the source document that are not insights. Do not put these in the table.

Then, output a brief **Extraction summary** stating:
- How many insights were extracted
- Breakdown by confidence level (High / Medium / Low)
- Any caveats or quality notes about the source document that the researcher should be aware of before importing to the repository

---

## Example of a well-formed vs. poorly-formed insight

**Poorly formed:**
"Users have problems with the UI and want it to be better."
Problems: vague, combines two ideas, no user type, no specificity.

**Well formed:**
"Hiring managers using Varbi reported abandoning the job posting flow mid-completion because required fields were not visually distinguished from optional fields, requiring them to restart the process."
Why it works: specific user type, specific product, specific behaviour, specific cause, falsifiable.

---

## After extraction

Remind the researcher to:
- Review every row before importing — do not import AI-generated rows without human review
- Correct any product area, user type, or confidence level assignments that seem wrong
- Add the source study link in the repository entry
- For High confidence insights, verify that the source document contains a direct quote or observed behaviour that supports the statement
- For any insights marked Low confidence, consider whether they belong in the repository at all, or whether they should be flagged as "needs validation"

---

## What this skill does NOT do

- It does not conduct or design research
- It does not write recommendations (it extracts them from the source and lists them separately)
- It does not synthesize across multiple documents at once — run it once per source document
- It does not replace researcher judgment — the output is a first draft that requires human review before importing
