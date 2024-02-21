import { _decorator, Component, Node, find, director } from 'cc';
const { ccclass, property } = _decorator;


let matchId: string;

@ccclass('MenuController')
export class MenuControlle extends Component {
    private isCreated: boolean;
    private gameClient;

    protected async onLoad(): Promise<void> {
        director.loadScene('Main');
    }
}

