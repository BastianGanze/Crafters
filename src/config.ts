export enum LogLevel{
    ALL = -2147483648,
    TRACE = 1000,
    DEBUG = 2000,
    INFO = 3000,
    WARN = 4000,
    ERROR = 5000,
    FATAL = 6000,
    OFF = 2147483647
}

export class Config{
    public static APPLICATION_NAME: string = "";
    public static DEBUG : boolean = true;
    public static LOG_LEVEL : LogLevel = LogLevel.DEBUG;
    public static LOG_TO_SERVER: boolean = false;
    public static LOG_TO_CONSOLE: boolean = true;
    public static STAGE_WIDTH: number = 1280;
    public static STAGE_HEIGHT: number = 720;
    public static BG_COLOR: number = 0x6495ED;
    public static MAP_SIZE_X: number = 64;
    public static MAP_SIZE_Y: number = 64;
    public static TILE_SIZE_X: number = 32;
    public static TILE_SIZE_Y: number = 32;
   // public static WS_DOMAIN: string = 'http://localhost:3000';
    public static COLOR_FRIEND : number = 0x00008b;//0x0000ff;
    public static COLOR_FOE : number = 0x8b0000;//0xff0000;
    public static COLOR_ME : number = 0x008b00//0x00ff00;
    public static COLOR_NEUTRAL : number = 0xFFFFFF//0x00ff00;
    public static WS_DOMAIN: string = 'http://crafters.wannabecoder.de:61692';


}