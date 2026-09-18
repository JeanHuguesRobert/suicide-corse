# Suicide Corse — dépôt de publication

Ce dépôt héberge les **éditions publiées** (HTML + PDF) de *Suicide Corse, ou comment réaliser l'impossible*, par Jean Hugues Noël Robert.

- **Site public :** https://suicidecorse.baronsmariani.org
- **Manuscrit source, corpus et doctrine éditoriale :** [`JeanHuguesRobert/barons-Mariani/projects/suicide-corse`](https://github.com/JeanHuguesRobert/barons-Mariani/tree/main/projects/suicide-corse)
- **Pipeline de rendu :** [`JeanHuguesRobert/ubikia`](https://github.com/JeanHuguesRobert/ubikia) (Markdown → Projection Contract → Quarto → HTML/PDF + manifeste de provenance)

## Principe

Ce dépôt ne contient jamais de source éditoriale originale — seulement des **projections rendues**, chacune accompagnée de son `manifest.json` (commit source, empreintes SHA-256, version du renderer). Toute correction substantielle produit une nouvelle édition datée, jamais une réécriture silencieuse d'une édition déjà publiée.

## Structure

```
editions/
  2026-09-17/          # Numéro 1, édition gelée
    index.html
    chapter-XXX.html
    *.pdf
    manifest.json
index.html              # Landing page and edition-status navigation
CNAME                   # suicidecorse.baronsmariani.org
```

## Ce dépôt N'EST PAS ce qui sert le site public

**Important pour quiconque déboguerait pourquoi le site public ne reflète pas un push récent :** ce dépôt possède un fichier `CNAME` et une configuration GitHub Pages historiques, mais **GitHub Pages ne sert plus `suicidecorse.baronsmariani.org` depuis le 17 septembre 2026**. Le DNS a été intentionnellement repointé de `jeanhuguesrobert.github.io` vers l'infrastructure Fracta (confirmé par l'auteur).

Le site public est en réalité servi par :

```text
suicidecorse.baronsmariani.org
  → Caddy sur fracta (reverse_proxy vers fracta2 via Tailscale)
  → Caddy sur fracta2 (root fixe /srv/www/suicidecorse/current, file_server)
  → symlink current -> releases/<date>-<commit-court>
```

Une mise à jour de ce dépôt (push sur `main`) **ne se propage donc pas automatiquement** au site public. La propagation exige une promotion explicite :

1. rendu via `Ubikia/scripts/publish-suicide-corse-preview.sh --apply --commit --push`, exécuté sur `fracta2` (clone local de ce dépôt sous `/home/ubuntu/suicide-corse`) ;
2. promotion atomique de la racine complète du dépôt d'artefacts vers une
   nouvelle release sous `/srv/www/suicidecorse/releases/` et bascule du
   symlink `current`, selon la procédure documentée dans
   [`JeanHuguesRobert/operium/docs/fracta2-github-static-release.md`](https://github.com/JeanHuguesRobert/operium/blob/main/docs/fracta2-github-static-release.md). Cette racine contient la landing page et les sous-répertoires d'éditions ; elle permet donc de rendre plusieurs numéros accessibles sans écraser une édition gelée.

Le `CNAME` et l'historique GitHub Pages de ce dépôt sont conservés tels quels (ils ne gênent rien), mais ne doivent pas être pris comme preuve de ce qui sert réellement le trafic public. Pour vérifier ce qui sert réellement une URL donnée, inspecter les en-têtes de réponse (`Server: Caddy`, pas les en-têtes GitHub Pages) plutôt que de supposer la topologie à partir des fichiers du dépôt.
