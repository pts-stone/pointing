import json

lpLinksToLpNames = {
  'https://lcp.points.com/v1/lps/85e54ce9-122d-4328-90dd-a4413450143b': 'air-canada-altitude',
  'https://lcp.points.com/v1/lps/1e79bc24-4860-4ffc-8181-e43b7a878d49': 'alfursan',
  'https://lcp.points.com/v1/lps/5cc42058-fb12-4dc3-a9bb-798f492aeb11': 'amtrak-guest-rewards',
  'https://lcp.points.com/v1/lps/d85e6724-8661-4866-a500-d3057225d3c1': 'amtrak-guest-rewards',
  'https://lcp.points.com/v1/lps/76b4293d-5f80-4a9c-91a3-a08f9c4b5837': 'avios',
  'https://lcp.points.com/v1/lps/e8207bce-40a0-47d6-b6a8-bc17a6b79063': 'choice-privileges',
  'https://lcp.points.com/v1/lps/6eefefd2-5585-40ba-b76a-9201e6abebee': 'club-carlson',
  'https://lcp.points.com/v1/lps/b1385272-dbd8-494c-9955-b858bccc2232': 'connect-miles',
  'https://lcp.points.com/v1/lps/22de2737-0331-48c0-85bc-087e445bb7b9': 'early-returns',
  'https://lcp.points.com/v1/lps/b1ca89bf-4490-4c27-890b-cbc6ba4b4f78': 'elevate',
  'https://lcp.points.com/v1/lps/e0021296-96ab-49a2-b02c-8d7bf908e833': 'etihad-guest',
  'https://lcp.points.com/v1/lps/2234be13-2aff-4a44-96da-e5c4c9721842': 'executive-club',
  'https://lcp.points.com/v1/lps/50a538e4-3364-451f-984c-638e04de70b6': 'finnair-plus',
  'https://lcp.points.com/v1/lps/33eba759-7f77-4930-926c-472bd52b7497': 'flying-blue',
  'https://lcp.points.com/v1/lps/644fd1ed-bed6-43bc-8b3c-d02360a94fe8': 'free-spirit',
  'https://lcp.points.com/v1/lps/43f39a8f-cac9-4957-8480-a83b6093cfe3': 'globalrewards',
  'https://lcp.points.com/v1/lps/5594997c-e4c0-4aac-be19-24bc4251fd78': 'hainan-fortune-wings-club',
  'https://lcp.points.com/v1/lps/22d99b9a-c0ef-4aba-8667-4e41b2c1dbdb': 'hhonors',
  'https://lcp.points.com/v1/lps/d0f513fa-3505-48e9-b9ed-31082aaabe4b': 'hyatt-gold-passport',
  'https://lcp.points.com/v1/lps/b7f27680-bea9-4d23-a382-92dbaa466079': 'iberia-plus',
  'https://lcp.points.com/v1/lps/7d565ba7-493f-4888-8310-c851423d2003': 'icelandair-saga-club',
  'https://lcp.points.com/v1/lps/aaa6931d-e724-484e-a7c8-f0ca6395c8c7': 'IHG-EQP',
  'https://lcp.points.com/v1/lps/096d3410-3ea9-4c66-a4ef-5d269afa9dbb': 'IHG-rewards-club',
  'https://lcp.points.com/v1/lps/fbb4b6de-0d21-4094-9339-e62ca8688d13': 'la-quinta-returns',
  'https://lcp.points.com/v1/lps/1c25d489-22b4-46fc-b00f-5dc936e44da4': 'latam-pass',
  'https://lcp.points.com/v1/lps/d432908f-a513-4b36-945e-1ea9817e378e': 'marriott-rewards',
  'https://lcp.points.com/v1/lps/a5b9bf12-db5f-45d5-b0bf-0494b4c7e8ee': 'melia-rewards',
  'https://lcp.points.com/v1/lps/1040270f-8e34-4ed2-890d-b1f0d9af58a1': 'mileage-plan',
  'https://lcp.points.com/v1/lps/0ccbb8ee-5129-44dd-9f66-a79eb853da73': 'mileage-plus',
  'https://lcp.points.com/v1/lps/83836c7c-40d9-4995-941d-d8093efbc392': 'mille-miglia',
  'https://lcp.points.com/v1/lps/096d3410-3ea9-4c66-a4ef-5d269afa9dbb': 'priority-club-rewards',
  'https://lcp.points.com/v1/lps/99b0a3f2-cd5d-4b95-b8c9-0b22c1b77d86': 'quality-airlines',
  'https://lcp.points.com/v1/lps/5fa0eefb-78f0-461f-a237-a4f075c313a8': 'rapid-rewards',
  'https://lcp.points.com/v1/lps/d8bf87e0-092b-470c-aedc-c147dc3b1d7a': 'rapid-rewards',
  'https://lcp.points.com/v1/lps/c5241238-c2d7-48ce-9655-02338d15b5e1': 'rapid-rewards',
  'https://lcp.points.com/v1/lps/9b5df082-a863-4366-b070-b2d470867531': 'rapid-rewards',
  'https://lcp.points.com/v1/lps/5ae7021d-2719-4cdb-835b-c9031da49e96': 'shangri-la',
  'https://lcp.points.com/v1/lps/bd3db65b-ce63-47c3-b33a-a994ffa716e3': 'spg',
  'https://lcp.points.com/v1/lps/5f62ce76-6a2b-4ac4-a668-66f014804fa8': 'trueblue',
  'https://lcp.points.com/v1/lps/e1a57783-0796-45c3-b388-a77cb38748c5': 'virgin-atlantic',
  'https://lcp.points.com/v1/lps/483217a5-f73c-4b4d-aca0-a4540eee5132': 'westjet-rewards',
  'https://lcp.points.com/v1/lps/1a626ede-d2af-446d-8ff7-0c5cd665e430': 'wyndham-rewards'
}

if __name__ == '__main__':
    with open('./resources/filtered_orders.js') as all_orders:
        data = json.load(all_orders)

        lp_names = set()
        for index, order in enumerate(data):
            lp_names.add(lpLinksToLpNames[order['data']['loyaltyProgram']])

        print sorted(lp_names)


