# #!/bin/sh

# # List files
# ls -la 

# # Copy files
# # cp -r /etc/newman/files/* /etc/newman/

# node conversion.js contract.collection.json fixed.json 


# # Run Newman
# newman run /etc/newman/fixed.json \
#   --bail \
#   --env-var parserUrl=http://parser:5001 \
#   --env-var storageUrl=http://storage:9023 \
#   --env-var baseUrl=http://api:3030 \
#   --env-var filesPath=/
#   --folder ${CONTRACT_TYPE}



#!/bin/sh

# List files
ls -la 

# Copy files
# cp -r /etc/newman/files/* /etc/newman/

# node conversion.js contract.collection.json fixed.json 

echo "CONTRACT_TYPE"
echo ${CONTRACT_TYPE}


# Run Newman
newman run /etc/newman/contract.collection.json \
  --bail \
  --env-var parserUrl=http://parser:5001 \
  --env-var storageUrl=http://storage:9023 \
  --env-var baseUrl=http://api:3030 \
  --env-var filesPath=/etc/newman/files \
  --folder ${CONTRACT_TYPE}