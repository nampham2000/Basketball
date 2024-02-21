import { _decorator, Collider2D, Component, Contact2DType, find, director, Animation, EventMouse, EventTouch, Input, input, instantiate, IPhysics2DContact, misc, Node, repeat, RigidBody2D, tween, UIOpacity, Vec2, Vec3, math, Sprite, Rect, Camera, UITransform, animation, log, Label, Color } from 'cc';
import { GameModel } from './GameModel';
import { GameView } from './GameView';
import { Constants } from './Data/Constants';
import { AudioController } from './AudioController';
const { ccclass, property } = _decorator;

let matchId: string;

@ccclass('GameController')
export class GameController extends Component {
    @property({
        type: GameModel,
        tooltip: 'Game Model Node'
    })
    private GameModel: GameModel;
    @property(
        {
            type: GameModel,
            tooltip: 'Game Model Node'
        })
    private GameView: GameView;
    @property({
        type: AudioController,
        tooltip: 'Audio Controller Node'
    })
    private AudioController: AudioController;
    @property({
        type: Camera,
        tooltip: 'Camera Node'
    })
    private camera: Camera;

    @property({
        type: RigidBody2D,
        tooltip: 'Rigibody2D Ball'
    })
    private ballRigid: RigidBody2D;
    @property({
        type: Collider2D,
        tooltip: 'Collider2D Ball'
    })
    private ballCol: Collider2D;
    @property({
        type: Node,
        tooltip: 'Hoop Anim'
    })
    private HoopAnim: Node;

    private checkPoint: number = 0;
    private startMousePos;
    private ballInitialPosition: Vec3;
    private basketInitialPosition: Vec3;
    private basketTransition: number = 0.0;
    private move_size: number = 50;
    private Speed: number = 1;
    private basketpos: Vec3;
    private count: number = 0;
    private bounce: number = 0;
    private checkPerfect: boolean;
    private countPerfect: number = 0;
    private countLive: number = 3;
    private countTimePlus: boolean = false;
    private lastPos: Vec3;
    private lastPosBasket: Vec3;
    private stillAlive: boolean = true;
    private hoopPos: Vec3;
    private gameClient;
    private isCreated: boolean = true;
    private matchId: string;
    private ballPosition: Vec2 = new Vec2();
    private ballChange: Vec3 = new Vec3();
    private mouseToPos: Vec3 = new Vec3();
    private interval;
    private time: number = 0;
    private newPos: number = 0;
    private checkmove: number ;
    private checkgameover:boolean=false;
    private userID;


    protected onLoad(): void {
        this.ballInitialPosition = this.GameModel.Ball.position.clone();
        this.basketInitialPosition = this.GameModel.Basket.position.clone();
        this.basketpos = this.GameModel.Basket.position.clone();
        this.hoopPos = this.GameModel.HoopBefore.position.clone();
        this.HandleAudioStorage();
        let collider = this.ballCol
        if (collider) {
            collider.on(Contact2DType.END_CONTACT, this.onCollision, this)
        }

        if (this.GameModel.Left && this.GameModel.Right && this.GameModel.CheckCountinue) {
            this.EnableCollider();
        }
        this.blinkText();
        Constants.scoreGameStatic = 0;
        this.startMousePos = null;
        this.ballPosition.set(this.GameModel.Ball.position.x, this.GameModel.Ball.position.y);
        this.checkPerfect = true;
        this.GameModel.Ball.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.GameModel.Ball.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    private EnableCollider(): void {
        this.GameModel.Left.active = false;
        this.GameModel.Right.active = false;
        this.GameModel.CheckPoint.active = false;
        this.GameModel.CheckCountinue.active = false;
        this.GameModel.Land1.active = false;
    }

    private onTouchStart(event: EventTouch): void {
        this.startMousePos = new Vec3(event.getLocationX(), event.getLocationY());
        const ballPos = new Vec3(this.ballPosition.x, this.ballPosition.y, 0);
        this.ballChange = this.camera.screenToWorld(this.startMousePos, this.ballChange);
        this.GameView.TextStart.active = false;
        this.GameView.CurrScore.node.active = true;
        this.GameModel.BallFire.active = false;
    }

    private async onCollision(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact): Promise<void> {
        if (otherCollider.tag === 1 && this.GameModel.Waring.active === true && this.GameModel.Left.active === false && this.GameModel.Right.active === false) {
          
            
            this.GameModel.Land.getComponent(Collider2D).enabled = false;
            this.GameModel.Left.active = true;
            this.GameModel.Right.active = true;
            this.GameModel.HoopAfter.getComponent(UIOpacity).opacity = 255;
            // this.GameModel.HoopBefore.getComponent(UIOpacity).opacity = 0;
            this.GameModel.HoopAfter.active=true;
            // this.GameModel.HoopBefore.active=false;
            this.GameModel.Waring.active = false;
            this.GameModel.CheckPoint.active = true;
            this.GameModel.Land1.active = true;
            this.ballCol.restitution = 0.5;
        }
        else if (otherCollider.tag === 2) {
            if (this.checkPerfect) {
                this.checkPoint += 2;
                this.GameModel.PerfectAnim.getComponent(Animation).play();
                this.countPerfect += 1;
                this.AudioController.onAudio(1);
                if (this.countPerfect >= 2) {
                    this.GameModel.BallFire.active = true;
                    this.GameModel.BallFire.getComponent(Animation).play();
                }
            }
            else {
                if (this.countTimePlus === false) {
                    this.checkPoint += 1;
                    this.countPerfect = 0;
                    this.AudioController.onAudio(1);
                }
                this.countTimePlus = true;
            }
            this.GameView.CurrScore.string = this.checkPoint.toString();
            this.GameModel.Land.getComponent(Collider2D).enabled = true;
            this.GameModel.CheckCountinue.active = true;
        }
        else if (otherCollider.tag === 3) {
            this.setBallDefault();
            this.GameModel.BallShadow.getComponent(UIOpacity).opacity = Constants.BALL_SHADOW_OPACITY;
            this.checkPerfect = true;
        }
        else if (otherCollider.tag === 5) {
            if (this.countLive <= 1) {
                if (this.isCreated) {
                    this.isCreated = false;
                    this.gameOver();
                    
                }
                this.stillAlive = false;
                this.GameView.LiveContainer.children[2].getComponent(Sprite).color = Constants.DIE_COLOR;
                this.GameView.RestartBtn.node.active = true;
            } else {
                this.countLive -= 1;
                let length = this.GameView.LiveContainer.children.length - 1;
                this.GameView.LiveContainer.children[length - this.countLive].getComponent(Sprite).color = Constants.DIE_COLOR;
                this.stillAlive = true;
                this.GameModel.Land.getComponent(Collider2D).enabled = true;
                this.setBallDefault();
                this.GameModel.BallShadow.getComponent(UIOpacity).opacity = Constants.BALL_SHADOW_OPACITY;
            }
        }
        else if (otherCollider.tag === 6) {
            this.checkPerfect = false;
            this.AudioController.onAudio(3);
        }
        else if (otherCollider.tag === 7) {
            this.bounce += 1;
            this.AudioController.onAudio(3);
            if (this.bounce === 2) {
                if (this.countLive === 1) {
                    if (this.isCreated) {
                        this.isCreated = false;
                        this.gameOver();
                    }
                    this.stillAlive = false;
                    this.GameView.LiveContainer.children[2].getComponent(Sprite).color = Constants.DIE_COLOR;
                    this.GameView.RestartBtn.node.active = true;
                    this.GameModel.Land.getComponent(Collider2D).enabled = true;
                    this.setBallDefault();
                } else {
                    this.countLive -= 1;
                    let length = this.GameView.LiveContainer.children.length - 1;
                    this.GameView.LiveContainer.children[length - this.countLive].getComponent(Sprite).color = Constants.DIE_COLOR;
                    this.stillAlive = true;
                    this.GameModel.Land.getComponent(Collider2D).enabled = true;
                    this.setBallDefault();
                    this.GameModel.BallShadow.getComponent(UIOpacity).opacity = Constants.BALL_SHADOW_OPACITY;
                }
            }
        }
        else {
            this.GameModel.HoopBefore.active=true;
            this.GameModel.HoopAfter.active=false;
        }
    }

    private onTouchEnd(event: EventTouch): void {
        this.ballRigid.gravityScale = 7;
        let endMousePos = new Vec3(event.getLocationX(), event.getLocationY(), 0);
        this.mouseToPos = this.camera.screenToWorld(endMousePos, this.mouseToPos);
        if (this.mouseToPos === null || this.ballChange === null) {
            this.mouseToPos = new Vec3(0, 0, 0);
            this.ballChange = new Vec3(0, 0, 0);
        }
        let offset = Math.abs(this.mouseToPos.length() - this.ballChange.length());
        if (this.mouseToPos.y > 40 && this.ballChange.y !== this.mouseToPos.y) {
            const deltaX = this.mouseToPos.x - this.ballChange.x;
            const deltaY = this.mouseToPos.y - this.ballChange.y;
            const angleInRadians = Math.atan2(deltaY, deltaX);
            const angleInDegrees = misc.radiansToDegrees(angleInRadians);
            if (offset >= 5 && offset <= 30) {
                var power = Constants.POWER[0];
            }
            else if (offset > 30 && offset <= 50) {
                var power = Constants.POWER[1];
            } else if (offset > 50) {
                var power = Constants.POWER[2];
            } else if (offset < 5) {
                var power = 0;
            }
            const angle = angleInDegrees;
            const velocityX = power * Math.cos(this.degreesToRadians(angle));
            const velocityY = power * Math.sin(this.degreesToRadians(angle));
            tween(this.GameModel.BallShadow)
                .to(0.8, { position: new Vec3(velocityX, this.GameModel.BallShadow.position.y) }, { easing: 'quadIn' })
                .start()
            tween(this.GameModel.BallShadow.getComponent(UIOpacity))
                .to(0.8, { opacity: 0 })
                .start()
            this.ballRigid.linearVelocity = new Vec2(velocityX, velocityY);
            if (this.ballRigid.linearVelocity.length() !== 0 && offset >= 0) {
                this.GameModel.Land.getComponent(Collider2D).enabled = false;
                this.GameModel.Ball.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
                this.GameModel.Ball.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
            }
            this.AudioController.onAudio(0);
        }
        this.GameModel.BallFire.getComponent(Animation).stop();
    }

    private setBallDefault(): void {
        this.ballRigid.gravityScale = 0;
        this.countTimePlus = false;
        this.bounce = 0;
        this.GameModel.Land.active = true;
        this.GameModel.BallShadow.getComponent(UIOpacity).opacity = Constants.BALL_SHADOW_OPACITY;
        this.scheduleOnce(() => {
            if (this.checkPoint < 5) {
                this.GameModel.Ball.setPosition(this.ballInitialPosition);
                this.GameModel.BallShadow.getComponent(UIOpacity).opacity = Constants.BALL_SHADOW_OPACITY;
            }
            else {
                let newPosX = math.randomRange(-100, 100);
                this.GameModel.Ball.setPosition(newPosX, this.ballInitialPosition.y);
                this.lastPos = this.GameModel.Ball.getPosition().clone();
                if (this.stillAlive) {
                    this.GameModel.Ball.setPosition(this.lastPos.x, this.ballInitialPosition.y);
                    this.GameModel.BallShadow.setPosition(this.lastPos.x, Constants.BALL_SHADOW_Y);
                    this.GameModel.BallShadow.getComponent(UIOpacity).opacity = Constants.BALL_SHADOW_OPACITY;
                }
            }
            let ballPos = this.GameModel.Ball.position.x;
            this.GameModel.BallShadow.setPosition(ballPos, Constants.BALL_SHADOW_Y);
            this.ballCol.restitution = 0;
            this.ballCol.apply();


            if (this.checkPoint < 5) {
                this.GameModel.Basket.setPosition(this.basketInitialPosition);
            }
            else if(this.checkPoint>=5&&this.checkPoint<=8) {
                this.newPos = math.randomRange(-100, 100);
                tween(this.GameModel.Basket)
                    .to(0.5, { position: new Vec3(this.newPos, this.basketInitialPosition.y) })
                    .start();
                    
                tween(this.GameModel.HoopBefore)
                    .to(0.5, { position: new Vec3(this.newPos, this.GameModel.HoopBefore.position.y) })
                    .start();
                tween(this.GameModel.HoopAfter)
                    .to(0.5, { position: new Vec3(this.newPos, this.GameModel.HoopBefore.position.y) })
                    .start();
                this.lastPosBasket = this.GameModel.Basket.getPosition().clone();
                if (this.stillAlive) {
                   this.GameModel.Basket.setPosition(this.lastPosBasket.x, this.basketInitialPosition.y);
                }
            }
            if(this.checkPoint>=9)
            {
                this.checkmove=math.randomRangeInt(0, 3);
                if(this.checkmove===0)
                {
                    tween(this.GameModel.Basket)
                    .to(0.5, { position: new Vec3(0, this.basketInitialPosition.y) })
                    .call(() => {  
                        setTimeout(() => {
                            
                            this.GameModel.Basket.getComponent(Animation).play('MoveCenter'); 
                        },0.6); 
                    })
                    .start();


                    tween(this.GameModel.HoopBefore)
                    .to(0.5, { position: new Vec3(0, this.GameModel.HoopBefore.position.y) })
                    .call(() => {   
                        setTimeout(() => {
                            
                            this.GameModel.HoopBefore.getComponent(Animation).play('Center')
                        }, 0.6); 
                    })
                    .start();


                    tween(this.GameModel.HoopAfter)
                    .to(0.5, { position: new Vec3(0, this.GameModel.HoopBefore.position.y) })
                    .call(() => {   
                        setTimeout(() => {
                            
                            this.GameModel.HoopAfter.getComponent(Animation).play('Center')
                        }, 0.6); 
                    })
                    .start();
                }
                if(this.checkmove===1)
                {
                    tween(this.GameModel.Basket)
                    .to(0.5, { position: new Vec3(-150, this.basketInitialPosition.y) })
                    .call(() => {   
                        setTimeout(() => {
                            
                            this.GameModel.Basket.getComponent(Animation).play('MoveLeft');
                        }, 0.6); 
                    })
                    .start();


                    tween(this.GameModel.HoopBefore)
                    .to(0.5, { position: new Vec3(-150, this.GameModel.HoopBefore.position.y) })
                    .call(() => {   
                        setTimeout(() => {
                            
                            this.GameModel.HoopBefore.getComponent(Animation).play('Left')
                        }, 0.6); 
                    })
                    .start();


                    tween(this.GameModel.HoopAfter)
                    .to(0.5, { position: new Vec3(-150, this.GameModel.HoopBefore.position.y) })
                    .call(() => {   
                        setTimeout(() => {
                            
                            this.GameModel.HoopAfter.getComponent(Animation).play('Left')
                        }, 0.6);     
                    })
                    .start();

                  
                }

                if(this.checkmove===2)
                {
                    tween(this.GameModel.Basket)
                    .to(0.5, { position: new Vec3(150, this.basketInitialPosition.y) })
                    .call(() => {  
                        setTimeout(() => {
                            
                            this.GameModel.Basket.getComponent(Animation).play('MoveRight');  
                        }, 0.6); 
                    })
                    .start();

                    tween(this.GameModel.HoopBefore)
                    .to(0.5, { position: new Vec3(150, this.GameModel.HoopBefore.position.y) })
                    .call(() => {   
                        setTimeout(() => {
                            
                            this.GameModel.HoopBefore.getComponent(Animation).play('Right')
                        }, 0.6); 
                    })
                    .start();

                    
                    tween(this.GameModel.HoopAfter)
                    .to(0.5, { position: new Vec3(150, this.GameModel.HoopBefore.position.y) })
                    .call(() => {   
                        setTimeout(() => {
                            
                            this.GameModel.HoopAfter.getComponent(Animation).play('Right')
                        },0.6);     
                    })
                    .start();

                }
              
            }
        });



        this.ballRigid.linearVelocity = new Vec2(0, 0);
        this.GameModel.Ball.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.GameModel.Ball.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        if (this.ballRigid.linearVelocity.length() < 1) {
            this.ballCol.restitution = 0;
            this.GameModel.Ball.setScale(1, 1);
            this.ballCol.apply();
            this.ballRigid.angularVelocity = 0
            this.ballRigid.linearVelocity = new Vec2(0, 0);
            this.EnableCollider();
            this.GameModel.Waring.active = true;
            this.GameModel.CheckCountinue.active = false;
        }
    }

    private degreesToRadians(degrees: number): number {
        return degrees * (Math.PI / 180);
    }

    private gameOver(): void {
        this.checkgameover=true;
        Constants.dataUser.highScore = Constants.dataUser.highScore < this.checkPoint ? this.checkPoint : Constants.dataUser.highScore;
        this.GameView.RestartBtn.interactable = true;
        this.GameView.BestScore.string = `BEST SCORE \n${Constants.dataUser.highScore}`;
        this.GameView.LastScore.string = `LAST SCORE \n${this.checkPoint}`;
        this.GameView.CurrScore.node.active = false;
        this.Speed = 0;
        this.GameModel.Basket.setPosition(this.basketpos);
        this.GameModel.HoopAfter.setPosition(this.hoopPos);
        this.GameModel.HoopBefore.setPosition(this.hoopPos);
        this.GameView.TabToRestart.getComponent(UIOpacity).opacity = 255;
        this.GameView.TabToRestart.getComponent(Animation).play();
        this.GameModel.Ball.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.GameModel.Ball.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this.GameModel.Basket.getComponent(Animation).stop();
        if(this.GameModel.HoopAfter.active===true)
        {

            this.GameModel.HoopAfter.getComponent(Animation).stop();
        }
        if(this.GameModel.HoopBefore.active===true)
        {

            this.GameModel.HoopBefore.getComponent(Animation).stop();
        }
    }

    private blinkText(): void {
        const blinkDuration = 1;
        tween(this.GameView.TextStart.getComponent(UIOpacity))
            .repeatForever(
                tween()
                    .set({ opacity: 255 })
                    .to(blinkDuration, { opacity: 0 }, { easing: 'quadIn' })
                    .to(blinkDuration, { opacity: 255 }, { easing: 'quadOut' })
            )
            .start()
    }

    private async onRestartBtn(): Promise<void> {
        this.GameView.RestartBtn.interactable = false;
        director.loadScene('Main');
    }

    protected HandleAudioStorage(): void {
        if (Constants.volumeGameStatic === null) {
            Constants.volumeGameStatic = true;
        }

        if (Constants.volumeGameStatic === true) {
            this.GameView.SoundBasic.node.active = true;
            this.GameView.SoundMute.node.active = false;
            this.AudioController.settingAudio(1);
        }
        else {
            this.GameView.SoundBasic.node.active = false;
            this.GameView.SoundMute.node.active = true;
            this.AudioController.settingAudio(0);
        }
    }

    protected onTouchOnAudio(): void {
        Constants.volumeGameStatic = true;
        this.AudioController.settingAudio(1);
        this.GameView.SoundBasic.node.active = true;
        this.GameView.SoundMute.node.active = false;
    }

    protected onTouchOffAudio(): void {
        Constants.volumeGameStatic = false;
        this.AudioController.settingAudio(0);
        this.GameView.SoundBasic.node.active = false;
        this.GameView.SoundMute.node.active = true;
    }


    private moveBasket(): void {
        let moveDistance = 50;
        let blinkDuration = 1;
        let startPos = this.newPos;

        let tw1 = tween(this.GameModel.Basket).to(blinkDuration, { position: new Vec3(startPos + moveDistance, this.GameModel.Basket.position.y) }, { easing: 'smooth' });
        let tw2 = tween(this.GameModel.Basket).to(blinkDuration, { position: new Vec3(startPos - moveDistance, this.GameModel.Basket.position.y) }, { easing: 'smooth' });

        const callTw1 = () => {
            startPos = this.newPos;
            tw2 = tween(this.GameModel.Basket).to(blinkDuration, { position: new Vec3(startPos - moveDistance, this.GameModel.Basket.position.y) }, { easing: 'smooth' }).call(callTw2).start();
        }

        const callTw2 = () => {
            startPos = this.newPos;
            tw1 = tween(this.GameModel.Basket).to(blinkDuration, { position: new Vec3(startPos + moveDistance, this.GameModel.Basket.position.y) }, { easing: 'smooth' }).call(callTw1).start();
        }

        tw1.call(callTw1).start();
    }
}


