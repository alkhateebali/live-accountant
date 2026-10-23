# live-accountant

A voice-first personal accountant. You talk, it logs expenses, answers questions about your
spending and remembers your facts. Built to practise backend and cloud-microservice skills:
.NET, Python, AWS, and Google ADK 2.0 with the Gemini Live API.

## Architecture

```
Browser (mic) --WebSocket--> live_adk (Python, ADK, run_live) --> Gemini Live (Vertex AI)
                                  | tools (HTTP)
                                  v
                          ledger_api (.NET) --> Postgres (RDS)
                                  ^
        EventBridge schedule --> report Lambda
```

| Folder | What it is | Runs on |
|--------|-----------|---------|
| `live_adk/` | Voice gateway and ADK agent | ECS Fargate (long-lived WebSocket) |
| `ledger_api/` | Accounting core: expenses, categories, budgets, reports | ECS Fargate |
| `report_lambda/` | Monthly spending summary | AWS Lambda + EventBridge |
| `infra/` | Terraform for the AWS side | AWS |

Only `live_adk/` exists so far.

## Plan

| Step | What we build |
|------|---------------|
| 1 | Environment + a text agent in the ADK dev UI |
| 2 | Live voice session with interruptions: raw SDK, then ADK |
| 3 | Tools called mid-conversation |
| 4 | .NET Ledger API that the tools call |
| 5 | Memory: structured facts + recall |
| 6 | Monthly report Lambda |
| 7 | Deploy to AWS with Terraform |

## Accounts

- GCP project `live-accountant`: Gemini through Vertex AI.
- AWS: everything else.
