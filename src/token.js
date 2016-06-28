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
    this.ID = options.ID || 'UNK__TOK';
    this.type = options.type || 'unknown';
    this.name = options.name || 'unknown';
    this.description = options.description  || {title:'None',contents:''};
    this.title = options.title || 'No title';
    this.props = options.props || (Token.CLOSABLE | Token.CONTAINABLE | Token.LINKABLE | Token.MOVABLE | Token.RENDERABLE | Token.ROTATABLE);
    this.status = -1;
    this.weight = 1;
    this.type = options.type || 'X';

    // Geometry and Board location
    this.orgx = options.orgx || 0;
    this.orgy = options.orgy || 0;
    this.width = options.width || Game.TOKENSIZE;
    this.height = options.height || Game.TOKENSIZE;
    this.cell_x = (options.cell_x != undefined) ? options.cell_x : -1;
    this.cell_y = (options.cell_y != undefined) ? options.cell_y : -1;
    
    // Knot(s)
    this.knots=options.knots || 'ixox';
    this.angle = options.angle || 0; // Rotation angle of knot(s)
    this.nodes = options.nodes;


    // Obsolete
    // Images of various layers composing the token
    // See svg
    /*
    this.background_color=options.background_color || '#FFFFFF';
    this.path_img = Game.HOME_FLOW() +'/images/';
    this.background=options.background || 'background_token.png';
    this.knots_img = 'knots_row.png';
    this.icon = options.icon || 'question_mark.png';
    if (this.icon.indexOf("../crazybioflow/img/") != -1) {
        // Backward compatibility
        this.icon = this.icon.substring(20,this.icon.length);
    }
    this.clip=options.clip || 'undefined';
    this.clip_left=options.clip_left || 0;
    */
    
    // New ??
    this.svg = options.svg ||  {type: "circle",data: {"r": 50, "cx": 50, "cy": 50, "fill": "green"} };

    console.log('new Token '+this.ID+ ' '+this.cell_x+' '+this.cell_y+' '+this.props);
}

Token.CLOSABLE    = 1;
Token.CONTAINABLE = 2;
Token.LINKABLE    = 4;
Token.MOVABLE     = 8;
Token.RENDERABLE  = 16;
Token.ROTATABLE   = 32;

Token.prototype.getHTMLElement = function() {
    return document.getElementById(this.name);
};


Token.prototype.init = function() {

    var self = this;
    
    // Click to open popup
    function click(ev) {
        ev = ev || window.event;
        console.log('click '+self.ID);
        
        return false;
    }


    var el = document.getElementById(self.name);

    // Click to open popup
    el.addEventListener("click",click,false); 
    
    // Initiate the drag
    el.addEventListener("mousedown", 
        function (ev) {
            ev = ev || window.event;
            self.dragMode = false;
            if ( (self.props & Token.MOVABLE) === Token.MOVABLE) {
                self.dragMode = true;
            }
            self.xStart = parseInt(ev.clientX);
            self.yStart = parseInt(ev.clientY);
            console.log('down '+self.ID+' '+self.xStart+' ' + self.yStart +' '+ self.dragMode);
            
            var el = document.getElementById(self.name);
            el.style.zIndex = 99;
            el.removeEventListener('click',click);
            
            return false;
        },
        false); 
    
    el.addEventListener("mousemove", 
        function (ev) {
            ev = ev || window.event;
            if (self.dragMode === true) {
                self.xDelta = parseInt(ev.clientX) - self.xStart;
                self.yDelta = parseInt(ev.clientY) - self.yStart;
                self.xStart = parseInt(ev.clientX);
                self.yStart = parseInt(ev.clientY);
                console.log('mousemove '+self.ID+' '+ev.clientX+ ' ' + ev.clientY +' '+ev.target+' ' + self.xDelta+' ' + self.yDelta +' '+ self.dragMode);
                // Update css style
                var el = document.getElementById(self.name);
                console.log('Offsets '+el.offsetLeft+' '+ el.offsetTop);

                el.style.left = (el.offsetLeft + self.xDelta ) + 'px';
                el.style.top  = (el.offsetTop  + self.yDelta ) + 'px';
            }
            return false;
        },
        false);


    el.addEventListener("mouseup", 
        function (ev) {
            self.dragMode = false;
            console.log('mouseup '+self.ID+' '+self.xStart+' ' + self.yStart +' '+ self.dragMode);
            var el = document.getElementById(self.name);
            el.style.zIndex = 1;
            var viewportOffset = game.board.getHTMLElement().getBoundingClientRect();
            // these are relative to the viewport

            var cell_x = self.xStart - parseInt(viewportOffset.left);
            var cell_y = self.yStart - parseInt(viewportOffset.top);

            cell_x /= Game.TOKENSIZE;
            cell_y /= Game.TOKENSIZE;
            
            // Clamp
            cell_x = Math.min(Math.max(Math.floor(cell_x), 0.0), parseFloat(game.board.width - 1));
            cell_y = Math.min(Math.max(Math.floor(cell_y), 0.0), parseFloat(game.board.height - 1));
            
            console.log('board ' + cell_x +' '+cell_y+' '+game.board.cells[cell_x + game.board.width * cell_y] );

            if (game.board.cells[cell_x + game.board.width * cell_y] === 0) {    
                // Update board and **this** token
                if (self.status === -1) {
                    self.status = 0;
                    // Update sandbox
                    game.sandbox.refill(self);
                }
                else
                    game.board.cells[self.cell_x + game.board.width * self.cell_y] = 0;

                self.cell_x = cell_x;
                self.cell_y = cell_y;
                game.board.cells[self.cell_x + game.board.width * self.cell_y] = self.ID;
                
                el.style.left = (viewportOffset.left + self.cell_x * Game.TOKENSIZE - 6) + 'px';
                el.style.top  = (viewportOffset.top  + self.cell_y * Game.TOKENSIZE - 6) + 'px';
            }
            else {
                el.style.left = (viewportOffset.left + self.cell_x * Game.TOKENSIZE - 6) + 'px';
                el.style.top  = (viewportOffset.top  + self.cell_y * Game.TOKENSIZE - 6) + 'px';
            }
            

            el.addEventListener('click',click);
        },
        false);
        
}


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
