#!/usr/bin/env python3
import json
import os
import ssl
import sys
from urllib.parse import urlencode, urlsplit, urlunsplit
from urllib.request import Request, urlopen

BASE_URL = "https://results2.p.scoring-engine.com/v2/individual_results/6"
QUERY_PARAMS = {
    "isVirtual": "false",
    "eventIds": "273",
    "controls.itemsPerPage": "100",
    "controls.page": "1",
    "controls.sortDirection": "ASC",
    "controls.sortColumn": "global_rank_by_tim",
}
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "individual_results_json")


def build_url(page: int, items_per_page: int) -> str:
    param_map = dict(QUERY_PARAMS)
    param_map["controls.page"] = str(page)
    param_map["controls.itemsPerPage"] = str(items_per_page)

    base_parts = urlsplit(BASE_URL)
    new_query = urlencode(param_map, doseq=True)
    return urlunsplit((base_parts.scheme, base_parts.netloc, base_parts.path, new_query, base_parts.fragment))


def fetch_json(url: str):
    req = Request(url, headers={"User-Agent": "Mozilla/5.0"})
    context = ssl._create_unverified_context()
    with urlopen(req, timeout=60, context=context) as response:
        return json.load(response)


def main() -> int:
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    first_url = build_url(1, int(QUERY_PARAMS["controls.itemsPerPage"]))
    print(f"Fetching page 1 from {first_url}")
    first_page = fetch_json(first_url)

    metadata = first_page.get("metadata") or {}
    total_pages = int(metadata.get("totalPages", 1))
    total_records = int(metadata.get("totalRecords", 0))
    print(f"Metadata: totalPages={total_pages}, totalRecords={total_records}")

    # Save page 1
    out_path = os.path.join(OUTPUT_DIR, "page_001.json")
    with open(out_path, "w", encoding="utf-8") as fp:
        json.dump(first_page, fp, ensure_ascii=False, indent=2)
        fp.write("\n")
    print(f"Saved {out_path}")

    for page in range(2, total_pages + 1):
        url = build_url(page, int(QUERY_PARAMS["controls.itemsPerPage"]))
        print(f"Fetching page {page} from {url}")
        payload = fetch_json(url)
        out_path = os.path.join(OUTPUT_DIR, f"page_{page:03d}.json")
        with open(out_path, "w", encoding="utf-8") as fp:
            json.dump(payload, fp, ensure_ascii=False, indent=2)
            fp.write("\n")
        print(f"Saved {out_path}")

    print(f"Completed. Files stored in {OUTPUT_DIR}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
