#!/bin/bash

# Create infrastructure directories
mkdir -p persistence/supabase/{repositories,mappers,schemas,migrations}
mkdir -p persistence/query-services
mkdir -p messaging/handlers
mkdir -p auth/guards
mkdir -p external/{email,storage}

echo "Infrastructure folder structure created"
