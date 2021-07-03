import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import * as ws from 'ws';
import { WS } from '@photobook/data';

@WebSocketGateway(3001)
export class EventGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: ws.Server;

  @SubscribeMessage(WS.ON.test)
  handleMessage(client: ws, payload: any): WsResponse<string> {
    return { event: 'ws/api/test', data: 'Hello world!' };
  }

  afterInit(server: ws.Server) {
    console.log('Init');
  }

  handleConnection(client: ws) {
    console.log('Connection');
    this.server.emit('connect', 'asdasd');
  }

  public send<T>(data: { type: string; data: T }) {
    this.server.clients.forEach((client) => {
      client.send(JSON.stringify(data));
    });
  }

  handleDisconnect(client: ws) {
    console.log('Disconnect');
  }
}
