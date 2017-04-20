import json

if __name__ == '__main__':
    with open('./resources/orders.json') as all_orders:
        data = json.load(all_orders)

        bgt_completed_orders = []
        for index, order in enumerate(data):
            if order['value']['orderType'] in ('BUY', 'GIFT', 'TRANSFER') and order['value']['status'] == 'complete':
                print('saving...')
                bgt_completed_orders.append(order['value'])

            if index == 1000:
                break

    with open('filtered_orders.json', 'w') as outfile:
        json.dump(bgt_completed_orders, outfile, sort_keys=True, indent=2)
