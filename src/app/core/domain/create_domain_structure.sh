#!/bin/bash

# Create shared domain structure
mkdir -p shared/{base,types,errors}

# Create account aggregate structure
mkdir -p account/{aggregates,entities,value-objects,events,repositories,services,specifications}

# Create organization aggregate structure
mkdir -p organization/{aggregates,entities,value-objects,events,repositories,services}

# Create team aggregate structure
mkdir -p team/{aggregates,entities,value-objects,events,repositories,services}

# Create repository aggregate structure
mkdir -p repository/{aggregates,entities,value-objects,events,repositories,services}

echo "Domain folder structure created successfully"
