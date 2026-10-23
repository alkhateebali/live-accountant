# live_adk

The voice brain of the personal accountant: a Python service that runs a Google ADK
agent and, from step 2, streams audio to and from Gemini Live (Vertex AI).

Part of the live-accountant demo. Full plan:

| Step | What we build | Video episode |
|------|---------------|---------------|
| 1 | Environment + a text agent in the ADK dev UI | (setup) |
| 2 | Live voice session with interruptions: raw SDK, then ADK | Voice, Framework |
| 3 | Tools called mid-conversation | Tools |
| 4 | .NET Ledger API that the tools call | (backend) |
| 5 | Memory: structured facts + recall | Memory |
| 6 | Deploy to AWS with Terraform | (cloud) |

## Layout

```
live_adk/
  pyproject.toml        dependencies, pinned to Python 3.12 by uv
  accountant/           the ADK agent package (the folder name is the agent's name in the UI)
    __init__.py         makes ADK find `agent`
    agent.py            defines `root_agent`
    .env.example        copy to .env
```

## Setup

Requires `uv` and a gcloud login.

```bash
gcloud auth application-default login      # ADC: how Python code authenticates to Vertex AI
cp accountant/.env.example accountant/.env # then set GOOGLE_CLOUD_PROJECT
uv sync                                    # creates .venv with Python 3.12 and installs deps
```

## Run (step 1)

```bash
uv run adk web .
```

Open the printed URL, pick `accountant`, and chat.

## Notes

- ADK 2.0's Workflow API is incompatible with live streaming, so this service uses the
  standard `Agent`, not Workflows.
