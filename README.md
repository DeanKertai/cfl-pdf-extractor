# CFL Game Stats PDF Extractor

In 2023, the [CFL](https://www.cfl.ca/) broke its public API. My family relied on the API to run our fantasy league.

The CFL does provide weekly player stats in PDF format, but they're in a format that makes it impossible to automate data extraction (by copying in to excel, for example).

There is no way anyone in my family is going to manually copy hundreds of statistics every week just to run a small fantasy league, so my solution is to make a LLM do all of the work.

This project uses the OpenAI API to analyze the PDFs and extract the data in to CSV format so it can be easily parsed.

## Deprecation Note

The CFL now has an easily parsable _internal_ API. I no longer need to analyze PDF files. New repo here: https://github.com/DeanKertai/cfl-api-py

## Get Started

1. Install NodeJS
1. Create an `.env` file with these required environment variables
   ```
   OPENAI_API_KEY=sk-proj-...
   OPENAI_PROJECT=proj_...
   ```
1. Install dependencies
   ```bash
   npm install
   ```
1. Run
   ```bash
   npm start
   ```
