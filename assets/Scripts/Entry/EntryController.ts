import { _decorator, Button, color, Color, Component, director, find, Node, Sprite, sys } from 'cc';
import { Constants } from '../Data/Constants';

const { ccclass, property } = _decorator;

@ccclass('EntryController')
export class EntryController extends Component {
  
    @property({type: Button})
    private btnPlay: Button;

    protected start(): void {
        this.btnPlay.node.on(Node.EventType.MOUSE_ENTER, () => {
            this.onMouseEnter(this.btnPlay.node);
          }, this);

          this.btnPlay.node.on(Node.EventType.MOUSE_LEAVE, () => {
            this.onMouseLeave(this.btnPlay.node);
          }, this);
    }

    private onMouseEnter(node:Node)
    {
        let btnplayColor=this.btnPlay.getComponent(Sprite)
        btnplayColor.color = new Color(195,195,195,255);
    }

    private onMouseLeave(node)
    {
        let btnplayColor=this.btnPlay.getComponent(Sprite)
        btnplayColor.color = Color.WHITE;
    }
    
    protected async onTouchPlay(): Promise<void> {
        this.btnPlay.interactable = false;
            director.loadScene(Constants.sceneGame);
    }
}

