#!/bin/bash

# Chemin relatif vers le dossier contenant les projets
projects_directory=".."

# Récupération du chemin absolu du script
script_directory="$(cd "$(dirname "$0")" && pwd)"

# Chemin absolu vers le dossier des projets
full_projects_directory="$script_directory/$projects_directory"

# Fonction pour exécuter le script "migrate"
execute_migrate_script() {
  local project_dir=$1
  local package_file="$project_dir/package.json"

  # Vérification de l'existence du fichier package.json
  if [[ -f "$package_file" ]]; then
    # Récupération du contenu de package.json
    package_content=$(cat "$package_file")

    # Vérification de l'existence du script "migrate" dans package.json
    if [[ $package_content == *'"migrate:docker":'* ]]; then
      echo "Running script 'migrate:docker' for $project_dir."
      (cd "$project_dir" && npm run migrate:docker)
    fi
  fi
}

# Parcours des projets
for project_dir in "$full_projects_directory"/*; do
  if [[ -d "$project_dir" ]]; then
    execute_migrate_script "$project_dir"
  fi
done
