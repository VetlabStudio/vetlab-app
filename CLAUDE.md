# Règles de travail — vetlab-app

## Règle absolue : ne jamais push dans git

- Ne JAMAIS committer ou pusher de fichiers dans git, peu importe la situation.
- Toujours livrer les fichiers corrigés via `SendUserFile` uniquement.
- C'est l'utilisateur qui push manuellement dans master.

## Règle absolue : toujours partir de la dernière version master

Avant de modifier ou générer un fichier, toujours récupérer la version actuelle depuis `origin/master` :

```bash
git checkout origin/master -- src/chemin/vers/fichier.jsx
```

Ne jamais se fier à une version locale qui pourrait avoir été modifiée dans une session précédente. Toujours vérifier avec `git diff origin/master <fichier>` après la restauration pour s'assurer que le fichier est propre avant d'y apporter des modifications.

## Style de texte

Ne jamais utiliser de tiret cadratin (—) dans le texte généré. Utiliser un tiret simple (-) ou reformuler la phrase.

## Livraison des fichiers

1. Restaurer depuis `origin/master`
2. Appliquer uniquement les modifications demandées
3. Vérifier avec `git diff origin/master <fichier>` que seules les modifications demandées sont présentes
4. Livrer via `SendUserFile`

## Fichiers index.ts

Les Edge Functions s'appellent toutes `index.ts`. Avant de livrer, toujours copier chaque `index.ts` sous un nom distinct `<nom-de-la-fonction>__index.ts` (ex. `stripe-webhook__index.ts`) et livrer cette copie, en indiquant le dossier de destination `supabase/functions/<nom-de-la-fonction>/index.ts`.
