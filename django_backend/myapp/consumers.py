import datetime
import json

from channels.generic.websocket import AsyncWebsocketConsumer

# Information and code taken from Django Channel documentation:
# https://channels.readthedocs.io/en/latest/tutorial/index.html

class ChatConsumer(AsyncWebsocketConsumer):
    """
    Analogous with how views work for Django HTTP requests.  Responsible for 
    connecting users to specific rooms based on their input information, receiving
    messages from users, and broadcasting their message to other users of their group
    """

    async def connect(self):
        """
        Performed when a user connects to a web socket.  User is 
        placed in a unique room based on their input data (chat room is
        determined by the room_id passed in the message json)
        """
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"chat_{self.room_name}"

        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        print('closing')
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        """
        Functions to perform after a message is RECEIVED from a 
        web socket; sends the message to all other members of the group
        in backend
        """
        text_data_json = json.loads(text_data)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name, {
                "type": "chat.message",
                "username": text_data_json["username"],
                "value": text_data_json["value"],
                "image": None,
                "date": str(datetime.datetime.now()),
                "room": text_data_json["room"]
                }
        )

    async def chat_message(self, event):
        """
        Function to perform after a message is received 
        from a group: sends message back to the front end
        """

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            "username": event["username"],
            "value": event["value"],
            "image": None,
            "date": event["date"],
            "room": event["room"]
        }))
