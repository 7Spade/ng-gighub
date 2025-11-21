#!/bin/bash

# Create main application directories
mkdir -p account/{commands/handlers,queries/handlers,dto,services}
mkdir -p organization/{commands/handlers,queries/handlers,dto,services}
mkdir -p team/{commands/handlers,queries/handlers,dto,services}
mkdir -p repository/{commands/handlers,queries/handlers,dto,services}
mkdir -p shared/{interfaces,base}

echo "Application folder structure created"
