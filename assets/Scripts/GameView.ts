import { _decorator, AudioSource, Button, Component, instantiate, Label, Node, Prefab, Sprite, UIOpacity } from 'cc';
import { Constants } from './Data/Constants';
const { ccclass, property } = _decorator;

@ccclass('GameView')
export class GameView extends Component {
    @property({type:Label})
    private score:Label
 
    public get Score() : Label {
        return this.score
    }
    
    public set ScoreValue(v : Label) {
        this.score = v;
    }

    @property({
        type:Label,
        tooltip: 'Best Score Label'
    })
    private bestscore:Label

    public get BestScore() : Label {
        return this.bestscore
    }

    @property({type:Button})
    private soundMute: Sprite;
    public get SoundMute(): Sprite {
        return this.soundMute;
    }
    public set SoundMute(value: Sprite) {
        this.soundMute = value;
    }

    @property({type:Button})
    private soundBasic: Sprite;
    public get SoundBasic(): Sprite {
        return this.soundBasic;
    }
    public set SoundBasic(value: Sprite) {
        this.soundBasic = value;
    }
    
    @property({type:Node})
    private textStart: Node;
    public get TextStart(): Node {
        return this.textStart;
    }
    public set TextStart(value: Node) {
        this.textStart = value;
    }

    @property({type: Label})
    private currScore: Label;

    public get CurrScore(): Label {
        return this.currScore;
    }
    public set CurrScore(value: Label) {
        this.currScore = value;
    }

    @property({type: Node})
    private ballFire: Node;

    public get BallFire(): Node {
        return this.ballFire;
    }
    public set BallFire(value: Node) {
        this.ballFire = value;
    }

    @property({type: Label})
    private lastScore: Label;

    public get LastScore(): Label {
        return this.lastScore;
    }
    public set LastScore(value: Label) {
        this.lastScore = value;
    }

    @property({
        type: Prefab,
        tooltip: 'Live Prefab'
    })
    private livePrefab: Prefab;

    public get LivePrefab(): Prefab {
        return this.livePrefab;
    }
    public set LivePrefab(value: Prefab) {
        this.livePrefab = value;
    }

    @property({
        type: Node,
        tooltip: 'Live Container Node'
    })
    private liveContainer: Node;
    
    public get LiveContainer(): Node {
        return this.liveContainer;
    }
    public set LiveContainer(value: Node) {
        this.liveContainer = value;
    }

    @property({
        type: Label,
        tooltip: 'Restart Label'
    })
    private tabToRestart: Label;

    public get TabToRestart(): Label {
        return this.tabToRestart;
    }
    public set TabToRestart(value: Label) {
        this.tabToRestart = value;
    }

    @property({type: Button})
    private restartBtn: Button;

    public get RestartBtn(): Button {
        return this.restartBtn;
    }
    public set RestartBtn(value: Button) {
        this.restartBtn = value;
    }

    
    @property({type: [Node]})
    private listLeaderboard: Node[] = [];

    public get ListLeaderboard(): Node[] {
        return this.listLeaderboard;
    }
    public set ListLeaderboard(value: Node[]) {
        this.listLeaderboard = value;
    }

    protected onLoad(): void {
        for (let i = 0; i < Constants.COUNT_LIVE; i++) {
            const liveNode = instantiate(this.livePrefab);
            this.liveContainer.addChild(liveNode);
            let xNode = liveNode.position.x;
            liveNode.setPosition(xNode - i * Constants.GAP, 270);
        }
    }
}


