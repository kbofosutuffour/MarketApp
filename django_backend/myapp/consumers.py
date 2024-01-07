import datetime
import json

from channels.generic.websocket import AsyncWebsocketConsumer



class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print('connect')
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]

        self.room_group_name = f"chat_{self.room_name}"
        print('testing', self.channel_layer)
        # Join room group
        self.channel_layer.group_add(self.room_group_name, self.channel_name)

        print('testing1')
        await self.accept()

    async def disconnect(self, close_code):
        print('disconnect')
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data):
        print(text_data, 'text_data')
        text_data_json = json.loads(text_data)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name, {
                "username": text_data_json["username"],
                "value": text_data_json["value"],
                "image": None,
                "date": datetime.datetime.now(),
                "room": text_data_json["room"]
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        value = event["value"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
                "username": event["username"],
                "value": event["value"],
                "image": None,
                "date": event["date"],
                "room": event["room"]
            }))