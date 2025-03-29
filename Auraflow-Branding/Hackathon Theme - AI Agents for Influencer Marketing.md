Help brands or creators manage aspects of their influencer campaigns with an AI-powered assistant. Think of a chatbot or workflow engine that taps into various data sources and APIs (YouTube, RapidAPI, etc.), processes or analyzes the data (OpenAI, LangChain, Claude MCP, scikit-learn, etc.), and outputs actionable insights or automations.

### Background on Influencer Marketing Process

Influencer Search

Identify relevant influencers (e.g., YouTube channels) based on content type, audience demographics, or engagement metrics.

Key tasks: Integrating with YouTube APIs, scraping channel metadata, ranking or filtering channels by relevance.

Outreach & Negotiations

Automate or assist with contacting influencers. Possibly propose deal terms or handle back-and-forth.

Key tasks: Sending personalized messages, auto-generating negotiation scripts, or integrating with social media/email APIs.

Brand Deal Management

Keep track of deliverables, deadlines, and approvals. Possibly remind stakeholders or highlight action items.

Key tasks: Building a simple Kanban or timeline view, auto-generating tasks, creating dashboards.

Performance Tracking

Monitor campaign results: views, clicks, conversions, or ROI.

Key tasks: Integrating analytics (YouTube Insights, Google Analytics), visualizing performance metrics, generating reports.

Recommendation Engine

Use historical performance data to optimize future campaigns, refine outreach strategies, or suggest new influencers.

Key tasks: Basic regression or classification with ML libraries, or using an LLM-based approach to interpret data for next steps.

### What We’re Looking For

AI-Driven Features: Use open-source ML libraries or integrate with AI APIs (OpenAI, LangChain, Claude MCP) to power recommendations, analysis, or intelligent automation.

Backend Skills: Show how you handle data pipelines, API integrations (YouTube, RapidAPI, email, social platforms), and persistent storage (SQL, NoSQL).

YouTube API: [https://developers.google.com/youtube/v3/getting-started](https://developers.google.com/youtube/v3/getting-started)

RapidAPI: [https://rapidapi.com/public/](https://rapidapi.com/public/)

Frontend Skills: A simple yet intuitive interface to demonstrate your solution—visualizing data, providing forms for input, or letting users interact with your AI agent.

Innovation & Completeness: We want to see working demos. Even if minimal, aim for a functional end-to-end experience.

### Example Project Ideas

AI Outreach Assistant

Scrape potential influencers from YouTube, rank them by estimated ROI, and auto-generate first-contact emails using GPT.

Frontend: Simple interface to view recommended influencers and edit the AI-generated outreach message.

Backend: Node.js/Express or Next.js server calling YouTube Data API, storing influencer info, and using OpenAI for message generation.

Intelligent Deal Pipeline

A mini CRM for influencer deals. Let the AI parse email threads for negotiations, highlight key points, and auto-update deal status.

Frontend: Pipeline board or timeline.

Backend: Summarize or parse negotiations using LLMs, store info in a database.

Performance Analyzer & Recommender

Ingest campaign metrics (views, conversions) and apply an ML model to predict which influencer might drive the best ROI next.

Frontend: Graphs or tables to view performance, plus an “AI Suggestions” panel with next-step recommendations.

Backend: Pull data via YouTube Analytics and/or Google Analytics or Shopify conversions, use a regression model or LLM to produce predictions/suggestions.

Influencer Collaboration Chatbot

A GPT-powered chatbot that both brand managers and influencers can query for best practices or performance estimates based on historical data.

Frontend: Chat UI with integrated user roles (brand or influencer).

Backend: GPT or Claude API usage, retrieving relevant data from your DB to offer context.

### Deliverables

Demo

Show a working web app.

Demonstrate how the AI agent helps solve one or more influencer marketing challenges.

Demos are capped to 5 minutes with 2 minutes of Q&A after.

Code Explanation

Summarize how you structured the frontend, backend, and AI/ML components.

Show usage of relevant APIs (YouTube, etc.), LLMs, and data pipelines.

README

Include clear setup instructions.

Mention your main libraries, APIs, and how to run the project locally.

Judgement

Creativity in solution

Resourcefulness

Technical challenge / complexity

Design and UX

Good Luck & Have Fun!

We’re excited to see how you combine creativity, AI, and coding to build something impactful in the influencer marketing space.

FAQ

Am I able to use ChatGPT and AI code editors (eg. Cursor, Windsurf, GitHub Copilot)?

Yes

Will I be reimbursed for any API or compute costs required?

Yes

When does the demo start?

Around 7pm.

Are we building for the brand or the creator?

Building for the brand. The users are Influencer Marketing Managers.

https://console.cloud.google.com/vertex-ai/studio/prompt-gallery/Video%20Q&A?project=dreamwell-hackathon&inv=1&invt=AbsxNQ