#!/bin/bash

# Set GitHub repo details
OWNER="nasa-madi"       # Replace with your GitHub username or org
REPO="nx"        # Replace with your repo name
GITHUB_TOKEN=${GITHUB_PERSONAL_ACCESS_TOKEN}  # Replace with your GitHub token

# GitHub API URL
GITHUB_API="https://api.github.com/repos/$OWNER/$REPO/actions/runs"

# Check if required variables are set
if [[ -z "$OWNER" || -z "$REPO" || -z "$GITHUB_TOKEN" ]]; then
  echo "Error: Missing required environment variables."
  echo "Set OWNER, REPO, and GITHUB_TOKEN before running the script."
  exit 1
fi

# Function to delete workflow runs
delete_workflow_runs() {
  local deleted_count=0
  local page=1

  while true; do
    echo "Fetching workflow runs (page $page)..."

    # Get workflow runs (50 per page)
    response=$(curl -s -H "Authorization: Bearer $GITHUB_TOKEN" \
                      -H "Accept: application/vnd.github.v3+json" \
                      "$GITHUB_API?per_page=50&page=$page")


    # Check if the response is valid JSON
    if ! echo "$response" | jq empty 2>/dev/null; then
      echo "❌ Error: Invalid JSON response from GitHub API"
      echo "Response: $response"
      exit 1
    fi

    
    # Extract run IDs with error checking
    total_count=$(echo "$response" | jq -r '.total_count')
    run_ids=$(echo "$response" | jq -r '.workflow_runs[].id' 2>/dev/null)
    
    # Check if we got any run IDs
    if [ -z "$run_ids" ] || [ "$total_count" -eq 0 ]; then
      echo "No more workflow runs to delete."
      break
    fi

    # Check if jq command failed
    if [ $? -ne 0 ]; then
      echo "❌ Error: Failed to parse workflow runs"
      echo "Response: $response"
      exit 1
    fi

    # Loop through each run ID and delete it
    for run_id in $run_ids; do
      echo "Deleting workflow run ID: $run_id"
      delete_response=$(curl -s -X DELETE -H "Authorization: Bearer $GITHUB_TOKEN" \
        -H "Accept: application/vnd.github.v3+json" \
        "$GITHUB_API/$run_id")
      
      if [[ -z "$delete_response" ]]; then
        echo "✅ Successfully deleted run ID: $run_id"
        ((deleted_count++))
      else
        echo "❌ Failed to delete run ID: $run_id - Response: $delete_response"
      fi
    done

    ((page++))
  done

  echo "🎉 Finished! Total workflow runs deleted: $deleted_count"
}

# Run the function
delete_workflow_runs