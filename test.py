# Beispiel mit Python und websockets
import asyncio, websockets, json

async def test():
    async with websockets.connect('wss://ws.rereadgames.de') as ws:
        await ws.send(json.dumps({'action': 'draw', 'source': 'deck'}))
        print(await ws.recv())

asyncio.run(test())