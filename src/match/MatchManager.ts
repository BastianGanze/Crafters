import CommunicationManager from "../communication/CommunicationManager";
import GameRenderer from "../utils/Renderer";
import Utils from "../utils/Utils";
import Vector2D from "../utils/Vector2D";
import CraftingArea from "./CraftingArea";
import AssetLoader from "../utils/AssetLoader";
import {Config} from "../config";

class TeamScore
{
    protected resourceCountTexts : {};
    protected progressBar : PIXI.Text;
    protected gameRenderer : GameRenderer;
    protected neededResources : {};
    protected position : Vector2D;

    constructor(gameRenderer : GameRenderer, neededResources : {}, position : Vector2D)
    {
        this.gameRenderer = gameRenderer;
        this.position = position;
        var keys = Object.keys(neededResources);
        this.resourceCountTexts = {};
        this.neededResources = neededResources;
        for(var i = 0; i < keys.length; i++)
        {
            this.resourceCountTexts[keys[i]] = new PIXI.Text(keys[i]+": "+0+" / "+neededResources[keys[i]]);
            this.resourceCountTexts[keys[i]].position = new PIXI.Point(this.position.x + i*200, this.position.y);
            this.gameRenderer.addToMainContainer(this.resourceCountTexts[keys[i]]);
        }
    }

    public updateResource(resource : string, count : number)
    {
        var resourceText = this.resourceCountTexts[resource];

        if(resourceText) resourceText.text = resource+": "+count+" / "+this.neededResources[resource];
    }


}

export default class MatchManager{

    protected craftingAreas : {};
    protected communicationManager : CommunicationManager;
    protected gameRenderer : GameRenderer;
    protected craftingAreaTexture : PIXI.BaseTexture;
    protected mainPlayerTeam : number;
    protected teamScoreDisplay : {};

    constructor(communicationManager : CommunicationManager, gameRenderer : GameRenderer)
    {
        this.communicationManager = communicationManager;
        this.gameRenderer = gameRenderer;
        this.craftingAreas = {};
        this.mainPlayerTeam = null;
        this.craftingAreaTexture = new PIXI.BaseTexture(<HTMLImageElement> AssetLoader.getContent("CraftingArea"));
        this.teamScoreDisplay = {};
        var teamPosScore = [new Vector2D(0, 20), new Vector2D(Config.STAGE_WIDTH - 630, Config.STAGE_HEIGHT - 50)];
        this.communicationManager.on('match data', function(data)
        {
            var i, teamData;
            if(data && data.match && data.match.teamData)
            {
                for(i = 0; i < data.match.teamData.length; i++)
                {
                    teamData = data.match.teamData[i];
                    if(!this.craftingAreas[i])
                    {
                        this.craftingAreas[i] = new CraftingArea(
                            this.craftingAreaTexture,
                            this.gameRenderer,
                            new Vector2D(teamData.craftingZone.position.x, teamData.craftingZone.position.y),
                            Config.COLOR_NEUTRAL
                        );
                    }

                    this.teamScoreDisplay[i] = new TeamScore(this.gameRenderer, data.match.neededResources, teamPosScore[i]);
                }
            }

            if(this.mainPlayerTeam)
            {
                this.colorTeams();
            }

        }.bind(this));

        this.communicationManager.on('game won', function(data)
        {
            

        }.bind(this));

        this.communicationManager.on('resources changed', function(data)
        {

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