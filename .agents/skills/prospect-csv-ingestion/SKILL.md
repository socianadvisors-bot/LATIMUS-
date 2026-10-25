---
name: prospect-csv-ingestion
description: Implement LATIMUS CSV-first prospect imports, mapping, source-column preservation, batching, normalization, persistence, preview, and export fidelity.
---

- Prospecting begins from user-imported CSV prospect data.
- Preserve every original input column.
- Store raw row, normalized row, mapping version, import batch ID, errors and outputs separately.
- Support drag/drop/file picker, preview, aliases, mapping override, saved mapping templates and import history.
- Design for hundreds to tens of thousands of rows with chunking, IndexedDB batching and virtualized UI.
- Do not auto-create prospect batches from the 55-source signal engine.
- Test parsing, mappings, malformed rows, duplicate files, large files, export and re-import.
