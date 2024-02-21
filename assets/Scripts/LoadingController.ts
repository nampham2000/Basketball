import { _decorator, Component, Node, find, director } from 'cc';
import { Constants } from './Data/Constants';

const { ccclass, property } = _decorator;

@ccclass('LoadingController')
export class LoadingController extends Component {
 
    protected  start() : void {
            director.loadScene(Constants.sceneEntry);
    }
}

