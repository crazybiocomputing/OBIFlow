/*
 *  OBIFlow: Omics and Bioinformatics visual programming workflow
 *  Copyright (C) 2016  Jean-Christophe Taveau.
 *
 *  This file is part of OBIFlow
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with mowgli.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */

function Token(options) {
    // Init
    this.ID = options.ID || -1;
    this.props = options.props || (Token.CLOSABLE | Token.CONTAINABLE | Token.LINKABLE | Token.MOVABLE | Token.RENDERABLE | Token.ROTATABLE);
    this.status = -1;
    this.orgx = options.orgx || 0;
    this.orgy = options.orgy || 0;
    this.width = options.width || Game.TOKENSIZE;
    this.height = options.height || Game.TOKENSIZE;
    this.type = options.type || 'X';
    this.title = options.title || 'No title';
    this.angle = options.angle || 0;
    this.description = options.description  || {title:'None',contents:''};
    this.nodes = options.nodes;
    this.cell_x = (options.cell_x != null) ? options.cell_x : -1;
    this.cell_y = (options.cell_y != null) ? options.cell_y : -1;
    this.knots=options.knots || 'ixox';
    this.background_color=options.background_color || '#FFFFFF';

    this.path_img = Game.HOME_FLOW() +'/images/';
    this.background=options.background || 'background_token.png';
    this.knots_img = 'knots_row.png';
    this.icon = options.icon || 'question_mark.png';
    
    if (this.icon.indexOf("../crazybioflow/img/") != -1) {
        // Backward compatibility
        this.icon = this.icon.substring(20,this.icon.length);
    }

    this.svg = options.svg ||  {type: "circle",data: {"r": 50, "cx": 50, "cy": 50, "fill": "green"} };


    this.clip=options.clip || 'undefined';
    this.clip_left=options.clip_left || 0;

    console.log('new Token '+this.ID+ ' '+this.cell_x+' '+this.cell_y+' '+this.props);
}

Token.CLOSABLE    = 1;
Token.CONTAINABLE = 2;
Token.LINKABLE    = 4;
Token.MOVABLE     = 8;
Token.RENDERABLE  = 16;
Token.ROTATABLE   = 32;


Token.prototype.getKnotRect = function(type) {
    var rect='';
    switch (type) {
    case 'o':
        rect= 'rect(0px '+this.height+'px '+this.height+'px   0px)';
        break;
    case 'O':
        rect= 'rect(0px '+(2*this.height)+'px '+this.height+'px '+   this.height +'px)';
        break;
    case 'i':
        rect= 'rect(0px '+(3*this.height)+'px '+this.height+'px '+(2*this.height)+'px)';
        break;
    case 'I':
        rect= 'rect(0px '+(4*this.height)+'px '+this.height+'px '+(3*this.height)+'px)';
        break;
    default:
        rect= 'rect(0px '+this.height+'px '+this.height+'px   0px)';
    }
    return rect;
}

Token.prototype.getKnotLeft = function(type) {
    var left = 0;
    switch (type) {
    case 'o':
        left=0;
        break;
    case 'O':
        left=-this.height;
        break;
    case 'i':
        left=-2*this.height;
        break;
    case 'I':
        left=-3*this.height;
        break;
    default:
        left=0;
    }
    return left;
}
