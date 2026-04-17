import Anthropic from '@anthropic-ai/sdk'

export const config = { runtime: 'edge' }

const client = new Anthropic()

const SYSTEM_PROMPT = `You are a workout log parser. Extract structured data from a user's workout note.

Rules:
- "3x8" means 3 sets of 8 reps
- "3x8 @ 185" or "3x8 185lbs" means 3 sets of 8 reps at 185 lbs
- Default weight unit is lbs unless kg is stated
- Bodyweight exercises (sit-ups, pull-ups, push-ups, dips, etc.) have null weight
- Infer date from language: "yesterday", "this morning", "last Tuesday" — default to today if absent
- Infer sessionType from exercises (e.g. "bench, ohp, triceps" → "push") or explicit statement ("push day")
- Extract healthState from contextual language: "felt tired", "shoulder was tight", "feeling strong"
- Set isComplete to false if any exercise is missing both weight and reps with no clear reason (bodyweight)
- Never invent data — use null for anything not stated or inferable
- Return each set as an individual record (3x8 = 3 set objects)`

const PARSE_TOOL: Anthropic.Tool = {
  name: 'parse_workout',
  description: 'Parse a workout note into structured data',
  input_schema: {
    type: 'object' as const,
    properties: {
      date: {
        type: 'string',
        description: 'ISO date string (YYYY-MM-DD). Today if not specified.',
      },
      sessionType: {
        type: ['string', 'null'],
        description: 'Inferred workout type e.g. "push day", "leg day", "cardio"',
      },
      healthState: {
        type: ['string', 'null'],
        description: 'How the user felt e.g. "fatigued", "feeling strong"',
      },
      exercises: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Exercise name as stated in input' },
            sets: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  setNumber: { type: 'number' },
                  weight: { type: ['number', 'null'] },
                  weightUnit: { type: ['string', 'null'], enum: ['lbs', 'kg', null] },
                  reps: { type: ['number', 'null'] },
                  notes: { type: ['string', 'null'] },
                },
                required: ['setNumber', 'weight', 'weightUnit', 'reps', 'notes'],
              },
            },
          },
          required: ['name', 'sets'],
        },
      },
      isComplete: {
        type: 'boolean',
        description: 'false if any exercise has ambiguous or missing required data',
      },
    },
    required: ['date', 'sessionType', 'healthState', 'exercises', 'isComplete'],
  },
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  let text: string
  try {
    const body = await req.json() as { text?: unknown }
    if (typeof body.text !== 'string' || !body.text.trim()) {
      return new Response(JSON.stringify({ error: 'text is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    text = body.text.trim()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const today = new Date().toISOString().split('T')[0]

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system: [
      {
        type: 'text',
        text: SYSTEM_PROMPT,
        // Cache the system prompt — it's large and identical across all requests
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [
      {
        role: 'user',
        content: `Today is ${today}. Parse this workout note:\n\n${text}`,
      },
    ],
    tools: [PARSE_TOOL],
    tool_choice: { type: 'any' },
  })

  const toolUse = response.content.find((b) => b.type === 'tool_use')
  if (!toolUse || toolUse.type !== 'tool_use') {
    return new Response(JSON.stringify({ error: 'Parse failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify(toolUse.input), {
    headers: { 'Content-Type': 'application/json' },
  })
}
