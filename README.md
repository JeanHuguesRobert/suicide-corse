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
  2026-09-17/          # Numéro spécial anniversaire
    index.html
    chapter-XXX.html
    *.pdf
    manifest.json
index.html              # Landing page
CNAME                   # suicidecorse.baronsmariani.org
```
