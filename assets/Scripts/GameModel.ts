import { _decorator, Component, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameModel')
export class GameModel extends Component {
    @property({
        type:Node,
        tooltip: 'Ball Node'
    })
    private ball: Node;

    public get Ball(): Node {
        return this.ball;
    }
    public set Ball(value: Node) {
        this.ball = value;
    }


    @property({
        type:Node,
        tooltip: 'Left Node'
    })

    private left: Node;
    public get Left(): Node {
        return this.left;
    }
    public set Left(value: Node) {
        this.left = value;
    }
    
    @property(Node)
    private check: Node;
    public get Check(): Node {
        return this.check;
    }
    public set Check(value: Node) {
        this.check = value;
    }
    

    @property(Node)
    private right: Node; 
    public get Right(): Node {
        return this.right;
    }
    public set Right(value: Node) {
        this.right = value;
    }
    


    @property(Node)
    private waring: Node;
    public get Waring(): Node {
        return this.waring;
    }
    public set Waring(value: Node) {
        this.waring = value;
    }
    

    @property(Node)
    private checkPoint: Node;
    public get CheckPoint(): Node {
        return this.checkPoint;
    }
    public set CheckPoint(value: Node) {
        this.checkPoint = value;
    }
    

    @property({type:Node})
    private land: Node;

    public get Land(): Node {
        return this.land;
    }
    public set Land(value: Node) {
        this.land = value;
    }
    

    @property({type:Node,})
    private land1: Node;

    public get Land1(): Node {
        return this.land1;
    }
    public set Land1(value: Node) {
        this.land1 = value;
    }
    
    @property({
        type: Node,
        tooltip: 'Hoop Before Node'    
    })
    private hoopBefore: Node;

    public get HoopBefore(): Node {
        return this.hoopBefore;
    }
    public set HoopBefore(value: Node) {
        this.hoopBefore = value;
    }

    @property({type: Node})
    private hoopAfter: Node;
    public get HoopAfter(): Node {
        return this.hoopAfter;
    }
    public set HoopAfter(value: Node) {
        this.hoopAfter = value;
    }

    @property({type:Node})
    private checkCountinue: Node;

    public get CheckCountinue(): Node {
        return this.checkCountinue;
    }
    public set CheckCountinue(value: Node) {
        this.checkCountinue = value;
    }
    

    @property({type:Node})
    private checkGameOver: Node;

    public get CheckGameOver(): Node {
        return this.checkGameOver;
    }
    public set CheckGameOver(value: Node) {
        this.checkGameOver = value;
    }
    

    @property({type:Prefab})
    private ballPrefab: Prefab;

    public get BallPrefab(): Prefab {
        return this.ballPrefab;
    }
    public set BallPrefab(value: Prefab) {
        this.ballPrefab = value;
    }
    
    @property({type:Node})
    private basket: Node;

    public get Basket(): Node {
        return this.basket;
    }
    public set Basket(value: Node) {
        this.basket = value;
    }
    
    @property({
        type: Node,
        tooltip: 'Ball Shadow Node'
    })
    private ballShadow: Node;

    public get BallShadow(): Node {
        return this.ballShadow;
    }
    public set BallShadow(value: Node) {
        this.ballShadow = value;
    }

    @property({
        type: Node,
        tooltip: 'Perfect Node'
    })
    private perfectAnim: Node;

    public get PerfectAnim(): Node {
        return this.perfectAnim;
    }
    public set PerfectAnim(value: Node) {
        this.perfectAnim = value;
    }

    @property({
        type: Node,
        tooltip: 'Ball Fire Node'
    })
    private ballFire: Node;

    public get BallFire(): Node {
        return this.ballFire;
    }
    public set BallFire(value: Node) {
        this.ballFire = value;
    }
}


