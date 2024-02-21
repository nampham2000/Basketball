import { _decorator, AudioSource, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioControllerEntry')
export class AudioControllerEntry extends Component {
    @property({type: AudioSource})
    private audioSource: AudioSource = null;

    /** GET / SET */    
    public get AudioSource() : AudioSource {
        return this.audioSource;
    }
    public set AudioSource(v : AudioSource) {
        this.audioSource = v;
    }

    public settingAudio(number: number): void {
        this.audioSource.volume = number;
    }

}

