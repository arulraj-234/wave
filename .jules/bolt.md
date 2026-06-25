## 2024-06-19 - Unpaginated Metadata Enrichment Bottleneck
**Learning:** Performing metadata enrichment (like fetching artists) by blindly pulling all `id`s from an array and putting them into an `IN` clause causes massive database bottlenecks if the array contains items that already have the metadata, leading to unnecessarily large queries.
**Action:** When enriching arrays of data, always check if the target fields are already populated and filter out those items before constructing the batch query.
