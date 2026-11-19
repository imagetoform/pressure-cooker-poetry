# SINGLE PRODUCTION CONTINUITY, D-42
Do not follow prior staged GO_LIVE_PLAN: it is archived at docs/history/GO_LIVE_PLAN-pre-D42-2026-11-19.md.
Every change is made on CURRENT main (recheck the head), production build executes architecture_contract.py, GitHub CI checks questionnaire->loading->world, exact destinations, eye and sound/hold-still controls, then the SAME Netlify project builds the live site. Check public https://pressurecookerpoetry.com after ready. Report what was actually observed.
No second project, no old branches used as bases, no using archived HTML as a starter, no claiming a commit or PR is live. An automated or manual change cannot waive D-42 or the regression gate. Never force push.
