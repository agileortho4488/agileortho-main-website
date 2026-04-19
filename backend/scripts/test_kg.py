import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.knowledge_graph import kg

def test_kg():
    # Test cases: entities found in enriched technical data
    queries = [
        ["Mitral"], # Indication/Anatomy found in enriched bioprosthesis
        ["Balloon"], # Product type found in enriched Myosist
        ["Aortic"], # Anatomy found in enriched Myosist
        ["Cardiovascular"], # Division
    ]

    for terms in queries:
        print(f"\n--- Querying for: {terms} ---")
        results = kg.query(terms)
        print(f"Found {len(results)} products:")
        for p in results[:3]:
            print(f"  - {p.get('product_name')} ({p.get('brand')}) | Slug: {p.get('slug')}")
            if p.get("materials_canonical"):
                print(f"    Materials: {p.get('materials_canonical')}")
            if p.get("technical_specifications"):
                print(f"    Specs: {list(p.get('technical_specifications').keys())[:3]}")

if __name__ == "__main__":
    test_kg()
