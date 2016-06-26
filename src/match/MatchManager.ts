import CommunicationManager from "../communication/CommunicationManager";
import GameRenderer from "../utils/Renderer";
import Utils from "../utils/Utils";
import Vector2D from "../utils/Vector2D";
import CraftingArea from "./CraftingArea";
import AssetLoader from "../utils/AssetLoader";
import {Config} from "../config";

export default class MatchManager{

    protected craftingAreas : {};
    protected communicationManager : CommunicationManager;
    protected gameRenderer : GameRenderer;
    protected craftingAreaTexture : PIXI.BaseTexture;
    protected mainPlayerTeam : number;

    constructor(communicationManager : CommunicationManager, gameRenderer : GameRenderer)
    {
        this.communicationManager = communicationManager;
        this.gameRenderer = gameRenderer;
        this.craftingAreas = {};
        this.mainPlayerTeam = null;
        this.craftingAreaTexture = new PIXI.BaseTexture(<HTMLImageElement> AssetLoader.getContent("CraftingArea"));
        this.communicationManager.on('match data', function(data)
        {
            var i, teamData;
            if(data && data.match && data.match.teamData)
            {
                for(i = 0; i < data.match.teamData.length; i++)
                {
                    if(!this.craftingAreas[i])
                    {
                        teamData = data.match.teamData[i];
                        this.craftingAreas[i] = new CraftingArea(
                            this.craftingAreaTexture,
                            this.gameRenderer,
                            new Vector2D(teamData.craftingZone.position.x * Config.TILE_SIZE_X, teamData.craftingZone.position.y * Config.TILE_SIZE_Y),
                            Config.COLOR_NEUTRAL
                        );
                    }
                }
            }

            if(this.mainPlayerTeam)
            {
                this.colorTeams();
            }

        }.bind(this));
    }

    public setMainPlayerTeam(team : number)
    {
        this.mainPlayerTeam = team;
        this.colorTeams();
    }

    public colorTeams()
    {
        var keys = Object.keys(this.craftingAreas), i;
        for(i = 0; i < keys.length; i++)
        {
            if(i == this.mainPlayerTeam)
            {   this.craftingAreas[keys[i]].setColor(Config.COLOR_FRIEND);

            }
            else
            {
                this.craftingAreas[keys[i]].setColor(Config.COLOR_FOE);
            }
        }
    }

    public update(delta) : void
    {
        var keys = Object.keys(this.craftingAreas), i;
        for(i = 0; i < keys.length; i++)
        {
            this.craftingAreas[keys[i]].update(delta);
        }
    }
}