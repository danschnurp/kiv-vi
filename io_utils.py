import json


def save_to_manual_vis(data):
    with open('./data/data.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

