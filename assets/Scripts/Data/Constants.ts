import { _decorator, Color, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

export type DataUser = {
    highScore: number,
    checkLog: Object
}

@ccclass('Constants')
export class Constants extends Component {
    public static readonly BEST_SCORE_KEY: string = 'BestScore_basketballScore';
    public static readonly VOLUME_KEY: string = 'volume_basketball';
    public static readonly DIE_COLOR: Color = new Color('#9F9F9F');
    public static readonly GAP: number = 30;
    public static readonly COUNT_LIVE: number = 3;
    public static readonly BALL_SHADOW_Y: number = -273;
    public static readonly BALL_SHADOW_OPACITY: number = 80;
    public static readonly POWER: number[] = [15, 30, 45];

    public static volumeGameStatic: boolean = true;

    public static scoreGameStatic: number=0;
    public static bestScoreStatic: number = 0;

    public static readonly sceneEntry: string = 'Entry';
    public static readonly sceneGame: string = 'Main';
    public static readonly sceneMenu: string = 'Menu';
 
    public static readonly NODE_NAME = {
        GameClient: 'GameClient'
    }

    public static dataUser: DataUser = {
        highScore: 0,
        checkLog: {}
    }



}

