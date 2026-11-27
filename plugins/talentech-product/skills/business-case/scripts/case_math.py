#!/usr/bin/env python3
"""Compute the derived numbers of a business case from the interview answers.

Usage:
    python case_math.py answers.json            # prints a table
    python case_math.py answers.json --json     # prints JSON

answers.json (all amounts in euro, effort in person-weeks):
{
  "effort": {"development": 36.4, "ux_research": 20.8, "product": 10.4, "other": 14.3},
  "triggers": ["partner contract", "shared service"],      # [] when none
  "value_12m": {"band": "M"}                                # small / medium
               or {"low": 200000, "base": 366000, "high": 600000},   # large
  "value_36m": {"low": 2000000, "base": 4000000, "high": 10500000},  # large only, optional
  "yearly_cost_after_launch": 240000,                       # optional, 0 when none
  "evidence_level": 3,                                      # 1..4
  "confidence_override": {"value": 0.8, "reason": "..."}    # optional
}

The constants below are company parameters (decided November 2026). Change them
here, not in the cases.
"""
import json
import sys

HOURLY_RATE_EUR = 75
HOURS_PER_WEEK = 40
SMALL_MAX_PW = 4       # under 4 pw: small
MEDIUM_MAX_PW = 20     # 4 to 20 pw: medium; over 20: large
BAND_MIDPOINT = {"XS": 12_000, "S": 60_000, "M": 300_000, "L": 1_200_000, "XL": 2_500_000}
BAND_RANGE = {"XS": "under 25k", "S": "25k to 100k", "M": "100k to 500k", "L": "500k to 2M", "XL": "over 2M"}
CONFIDENCE_BY_LEVEL = {1: 0.30, 2: 0.50, 3: 0.70, 4: 0.90}
FORUM = {"small": "Steering group", "medium": "Steering group",
         "large": "Management team, after steering group review"}


def tier_of(total_pw, triggers):
    if triggers:
        return "large", "triggers: " + ", ".join(triggers)
    if total_pw < SMALL_MAX_PW:
        return "small", f"effort {total_pw:g} pw"
    if total_pw <= MEDIUM_MAX_PW:
        return "medium", f"effort {total_pw:g} pw"
    return "large", f"effort {total_pw:g} pw"


def base_value(value):
    if "band" in value:
        band = value["band"].upper()
        return BAND_MIDPOINT[band], f"band {band} ({BAND_RANGE[band]}), midpoint"
    return value["base"], "base case"


def compute(a):
    effort = a.get("effort", {})
    total_pw = round(sum(effort.values()), 1)
    build_cost = round(total_pw * HOURS_PER_WEEK * HOURLY_RATE_EUR)
    tier, tier_reason = tier_of(total_pw, a.get("triggers", []))

    v12, v12_note = base_value(a["value_12m"])
    yearly_cost = a.get("yearly_cost_after_launch", 0) or 0

    value_per_effort = round(v12 / build_cost, 2) if build_cost else None
    monthly_net = (v12 - yearly_cost) / 12
    if tier != "large":
        payback = "n/a (large cases only)"
    elif monthly_net <= 0:
        payback = "no payback: yearly cost after launch exceeds 12-month value"
    elif build_cost / monthly_net > 60:
        payback = "over 60 months at the 12-month run-rate"
    else:
        payback = round(build_cost / monthly_net, 1)

    level = int(a.get("evidence_level", 1))
    proposed = CONFIDENCE_BY_LEVEL.get(level, 0.30)
    override = a.get("confidence_override")
    if override and override.get("reason"):
        confidence, conf_note = override["value"], f"overridden from {proposed:.0%}: {override['reason']}"
    elif override:
        confidence, conf_note = proposed, "override ignored: no reason given"
    else:
        confidence, conf_note = proposed, f"proposed from evidence level {level}"

    out = {
        "tier": tier, "tier_reason": tier_reason, "forum": FORUM[tier],
        "effort_pw_total": total_pw, "effort_split": effort,
        "build_cost_eur": build_cost,
        "value_12m_eur": v12, "value_12m_note": v12_note,
        "yearly_cost_after_launch_eur": yearly_cost,
        "value_per_effort": value_per_effort,
        "payback_months": payback,
        "confidence": confidence, "confidence_note": conf_note,
        "confidence_weighted_value_eur": round(v12 * confidence),
    }
    if "value_36m" in a:
        out["value_36m_eur"] = a["value_36m"]
    return out


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    with open(sys.argv[1]) as f:
        answers = json.load(f)
    result = compute(answers)
    if "--json" in sys.argv:
        print(json.dumps(result, indent=2))
        return
    for k, v in result.items():
        if isinstance(v, float) and k == "confidence":
            v = f"{v:.0%}"
        elif isinstance(v, (int, float)) and k.endswith("_eur"):
            v = f"€{v:,.0f}"
        print(f"{k:32} {v}")


if __name__ == "__main__":
    main()
