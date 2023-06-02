#!/bin/bash

# Chemin relatif vers le dossier contenant les projets
projects_directory=".."

# Récupération du chemin absolu du script
script_directory="$(cd "$(dirname "$0")" && pwd)"

# Chemin absolu vers le dossier des projets
full_projects_directory="$script_directory/$projects_directory"

# Fonction pour exécuter l'install
execute_migrate_script() {
  local project_dir=$1
  local package_file="$project_dir/package.json"

  # Vérification de l'existence du fichier package.json
  if [[ -f "$package_file" ]]; then
    # Récupération du contenu de package.json
    package_content=$(cat "$package_file")

    echo "Installing for project $project_dir."
    (cd "$project_dir" && npm ci)
    
  fi
}

# Parcours des projets
for project_dir in "$full_projects_directory"/*; do
  if [[ -d "$project_dir" ]]; then
    execute_migrate_script "$project_dir"
  fi
done
