#!/bin/bash
if [ -d "apps/api" ]; then
  cd apps/api
elif [ -d "AIwithAbhi/apps/api" ]; then
  cd AIwithAbhi/apps/api
fi
pip install -r requirements.txt
