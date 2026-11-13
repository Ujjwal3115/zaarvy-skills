import os
import sys

# Matched variable
DATABASE_URL = os.getenv("DATABASE_URL")

# MISSING from .env.example: S3 bucket configuration
S3_BUCKET = os.environ["AWS_S3_BUCKET"]

# Inconsistent naming: Uses REDIS_URL while server.ts uses REDIS_CACHE_URL
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

def process_job(job_id: str):
    print(f"Processing job {job_id} using bucket {S3_BUCKET}")
